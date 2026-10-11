import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { store } from './server/storage.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Statically serve uploaded and catalog crochet images
  const imagesDir = path.resolve(__dirname, 'src', 'assets', 'images');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }
  app.use('/src/assets/images', express.static(imagesDir));

  // Helper auth middleware for Admin
  const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    
    // Allow local admin session token or fallback master check
    if (token && store.isValidAdminToken(token)) {
      return next();
    }
    // Also allow preview testing token
    if (token === 'dev_admin_sunshine_token_2026') {
      return next();
    }
    return res.status(401).json({ error: 'Unauthorized: Admin authentication required' });
  };

  // --- API Routes ---

  // 1. Products
  app.get('/api/products', (req: Request, res: Response) => {
    const { category, search, sort } = req.query;
    const products = store.getProducts(category as string, search as string, sort as string);
    res.json(products);
  });

  app.get('/api/products/:identifier', (req: Request, res: Response) => {
    const product = store.getProductBySlugOrId(req.params.identifier);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  });

  app.post('/api/admin/products', requireAdmin, (req: Request, res: Response) => {
    try {
      const product = store.addProduct(req.body);
      res.status(201).json(product);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to create product' });
    }
  });

  app.put('/api/admin/products/:id', requireAdmin, (req: Request, res: Response) => {
    try {
      const product = store.updateProduct(req.params.id, req.body);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      res.json(product);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to update product' });
    }
  });

  app.delete('/api/admin/products/:id', requireAdmin, (req: Request, res: Response) => {
    const success = store.deleteProduct(req.params.id);
    if (!success) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true, message: 'Product deleted successfully' });
  });

  app.post('/api/admin/upload-image', requireAdmin, (req: Request, res: Response) => {
    try {
      const { dataUrl, filename } = req.body;
      if (!dataUrl) {
        return res.status(400).json({ error: 'No image data provided' });
      }

      const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ error: 'Invalid base64 image data' });
      }

      const mimeType = matches[1];
      const ext = mimeType.includes('png') ? 'png' : mimeType.includes('webp') ? 'webp' : 'jpg';
      const buffer = Buffer.from(matches[2], 'base64');

      const uploadsDir = path.resolve(__dirname, 'src', 'assets', 'images');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const safeName = (filename || 'product_photo')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .toLowerCase();
      const generatedFilename = `${safeName}_${Date.now()}.${ext}`;
      const filePath = path.join(uploadsDir, generatedFilename);

      fs.writeFileSync(filePath, buffer);
      const publicUrl = `/src/assets/images/${generatedFilename}`;

      res.json({ success: true, url: publicUrl });
    } catch (err: any) {
      console.error('Image upload failed:', err);
      res.status(500).json({ error: 'Failed to upload image file' });
    }
  });

  // 2. Cart Totals & Coupons
  app.post('/api/cart/calculate', (req: Request, res: Response) => {
    const { items, couponCode, paymentMethod } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'Items array is required' });
    }
    const calculation = store.calculateCartTotals(items, couponCode, paymentMethod);
    res.json(calculation);
  });

  app.post('/api/coupons/validate', (req: Request, res: Response) => {
    const { code, subtotal } = req.body;
    if (!code) return res.status(400).json({ error: 'Coupon code is required' });
    const result = store.validateCoupon(code, Number(subtotal || 0));
    res.json(result);
  });

  app.get('/api/coupons', (req: Request, res: Response) => {
    res.json(store.getCoupons());
  });

  app.post('/api/admin/coupons', requireAdmin, (req: Request, res: Response) => {
    const newCoupon = store.addCoupon(req.body);
    res.json(newCoupon);
  });

  // 3. Orders
  app.post('/api/orders', (req: Request, res: Response) => {
    const result = store.createOrder(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.message });
    }
    res.status(201).json(result.order);
  });

  app.get('/api/orders/:identifier', (req: Request, res: Response) => {
    const order = store.getOrder(req.params.identifier);
    if (!order) {
      return res.status(404).json({ error: 'Order not found. Please verify Order ID or Tracking Number.' });
    }
    res.json(order);
  });

  app.get('/api/admin/orders', requireAdmin, (req: Request, res: Response) => {
    const { paymentMethod, status } = req.query;
    const orders = store.getOrders({
      paymentMethod: paymentMethod as string,
      status: status as string
    });
    res.json(orders);
  });

  app.put('/api/admin/orders/:id/status', requireAdmin, (req: Request, res: Response) => {
    const { status, note } = req.body;
    const updated = store.updateOrderStatus(req.params.id, status, note);
    if (!updated) return res.status(404).json({ error: 'Order not found' });
    res.json(updated);
  });

  // 4. COD OTP Verification
  app.post('/api/cod/send-otp', (req: Request, res: Response) => {
    const { mobile } = req.body;
    if (!mobile) return res.status(400).json({ error: 'Mobile number is required' });
    const result = store.requestOtp(mobile);
    res.json(result);
  });

  app.post('/api/cod/verify-otp', (req: Request, res: Response) => {
    const { mobile, otp } = req.body;
    if (!mobile || !otp) return res.status(400).json({ error: 'Mobile and OTP are required' });
    const result = store.verifyOtp(mobile, otp);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json(result);
  });

  // 5. Razorpay Payments
  app.post('/api/payment/razorpay/create-order', (req: Request, res: Response) => {
    const { amount, receipt } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }
    const rzpOrder = store.createRazorpayOrder(Number(amount), receipt || `rcpt_${Date.now()}`);
    res.json(rzpOrder);
  });

  app.post('/api/payment/razorpay/verify', (req: Request, res: Response) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const isValid = store.verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return res.status(400).json({ success: false, error: 'Invalid payment signature' });
    }

    res.json({ success: true, message: 'Payment signature verified successfully' });
  });

  // 6. Custom Inquiries
  app.post('/api/custom-inquiries', (req: Request, res: Response) => {
    const { fullName, mobile, description, preferredColors, occasion, budgetRange } = req.body;
    if (!fullName || !mobile || !description) {
      return res.status(400).json({ error: 'Name, mobile number, and description are required' });
    }
    const inquiry = store.addCustomInquiry({
      fullName,
      mobile,
      email: req.body.email,
      description,
      preferredColors: preferredColors || 'Not specified',
      occasion,
      budgetRange
    });
    res.status(201).json(inquiry);
  });

  app.get('/api/admin/custom-inquiries', requireAdmin, (req: Request, res: Response) => {
    res.json(store.getCustomInquiries());
  });

  app.put('/api/admin/custom-inquiries/:id/status', requireAdmin, (req: Request, res: Response) => {
    const updated = store.updateInquiryStatus(req.params.id, req.body.status);
    if (!updated) return res.status(404).json({ error: 'Inquiry not found' });
    res.json(updated);
  });

  // 7. Store Settings & Reviews
  app.get('/api/settings', (req: Request, res: Response) => {
    res.json(store.getSettings());
  });

  app.put('/api/admin/settings', requireAdmin, (req: Request, res: Response) => {
    const updated = store.updateSettings(req.body);
    res.json(updated);
  });

  app.get('/api/reviews', (req: Request, res: Response) => {
    res.json(store.getReviews());
  });

  // 8. Admin Auth
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    // Default admin credential
    if (email === 'admin@sunshinesquares.in' && password === 'sunshine123') {
      const token = store.createAdminToken();
      return res.json({
        success: true,
        token,
        admin: {
          name: 'Sibling Co-Founders',
          email: 'admin@sunshinesquares.in',
          role: 'Admin'
        }
      });
    }
    return res.status(401).json({ error: 'Invalid email or password' });
  });

  // Setup Vite middleware in dev or static files in production
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sunshine Squares server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
