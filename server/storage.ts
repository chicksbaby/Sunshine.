import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { 
  Product, 
  Order, 
  CustomInquiry, 
  Coupon, 
  StoreSettings, 
  CustomerReview,
  OrderStatus,
  PaymentStatus 
} from '../src/types/index.js';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_REVIEWS, 
  INITIAL_SETTINGS, 
  INITIAL_COUPONS, 
  INITIAL_ORDERS, 
  INITIAL_CUSTOM_INQUIRIES 
} from './data.js';

interface DatabaseSchema {
  products: Product[];
  orders: Order[];
  reviews: CustomerReview[];
  coupons: Coupon[];
  customInquiries: CustomInquiry[];
  settings: StoreSettings;
  adminTokens: string[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.resolve(DATA_DIR, 'store.json');

class StoreService {
  private data: DatabaseSchema;
  private otpSessions: Map<string, { otp: string; expiresAt: number; verified: boolean }> = new Map();

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          products: parsed.products || INITIAL_PRODUCTS,
          orders: parsed.orders || INITIAL_ORDERS,
          reviews: parsed.reviews || INITIAL_REVIEWS,
          coupons: parsed.coupons || INITIAL_COUPONS,
          customInquiries: parsed.customInquiries || INITIAL_CUSTOM_INQUIRIES,
          settings: { ...INITIAL_SETTINGS, ...(parsed.settings || {}) },
          adminTokens: parsed.adminTokens || []
        };
      }
    } catch (err) {
      console.warn('Could not read existing data file, initializing fresh store:', err);
    }

    const initialData: DatabaseSchema = {
      products: INITIAL_PRODUCTS,
      orders: INITIAL_ORDERS,
      reviews: INITIAL_REVIEWS,
      coupons: INITIAL_COUPONS,
      customInquiries: INITIAL_CUSTOM_INQUIRIES,
      settings: INITIAL_SETTINGS,
      adminTokens: []
    };

    this.saveDataDirect(initialData);
    return initialData;
  }

  private saveDataDirect(dataToSave: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving store data to disk:', err);
    }
  }

  private persist() {
    this.saveDataDirect(this.data);
  }

  // --- Products ---
  public getProducts(category?: string, search?: string, sort?: string): Product[] {
    let result = [...this.data.products];
    if (category && category !== 'All') {
      result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        (p.tags ? p.tags.some(t => t.toLowerCase().includes(q)) : false)
      );
    }
    if (sort) {
      if (sort === 'price-low') {
        result.sort((a, b) => a.price - b.price);
      } else if (sort === 'price-high') {
        result.sort((a, b) => b.price - a.price);
      }
    }
    return result;
  }

  public getProductBySlugOrId(identifier: string): Product | undefined {
    return this.data.products.find(p => p.id === identifier || p.slug === identifier);
  }

  public addProduct(productData: Omit<Product, 'id'>): Product {
    const id = `prod-${Date.now()}`;
    const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newProduct: Product = {
      ...productData,
      id,
      slug: slug || `item-${id}`
    };
    this.data.products.unshift(newProduct);
    this.persist();
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.data.products[index] = { ...this.data.products[index], ...updates };
    this.persist();
    return this.data.products[index];
  }

  public deleteProduct(id: string): boolean {
    const prevLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    if (this.data.products.length !== prevLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // --- Orders ---
  public getOrders(filters?: { paymentMethod?: string; status?: string }): Order[] {
    let result = [...this.data.orders];
    if (filters?.paymentMethod) {
      result = result.filter(o => o.paymentMethod === filters.paymentMethod);
    }
    if (filters?.status) {
      result = result.filter(o => o.orderStatus === filters.status);
    }
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getOrder(identifier: string): Order | undefined {
    return this.data.orders.find(o => 
      o.id === identifier || 
      o.orderNumber.toLowerCase() === identifier.toLowerCase() ||
      o.trackingCode.toLowerCase() === identifier.toLowerCase()
    );
  }

  public calculateCartTotals(items: { productId: string; quantity: number }[], couponCode?: string, paymentMethod?: 'cod' | 'razorpay') {
    let subtotal = 0;
    const validatedItems: Order['items'] = [];

    for (const item of items) {
      const prod = this.data.products.find(p => p.id === item.productId);
      if (prod) {
        const qty = Math.max(1, item.quantity);
        subtotal += prod.price * qty;
        validatedItems.push({
          id: `ci-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          productId: prod.id,
          name: prod.name,
          price: prod.price,
          image: prod.images[0] || '',
          quantity: qty,
          codEligible: prod.codEligible
        });
      }
    }

    const settings = this.data.settings;
    const shippingFee = subtotal >= settings.freeShippingThreshold ? 0 : settings.standardShippingFee;
    const codFee = paymentMethod === 'cod' ? settings.codHandlingFee : 0;

    let discountAmount = 0;
    let appliedCoupon: Coupon | undefined;

    if (couponCode) {
      const coupon = this.data.coupons.find(c => c.active && c.code.toUpperCase() === couponCode.trim().toUpperCase());
      if (coupon && subtotal >= coupon.minOrderValue) {
        appliedCoupon = coupon;
        if (coupon.discountType === 'percentage') {
          discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
        } else {
          discountAmount = Math.min(coupon.discountValue, subtotal);
        }
      }
    }

    const total = Math.max(0, subtotal + shippingFee + codFee - discountAmount);

    return {
      subtotal,
      shippingFee,
      codFee,
      discountAmount,
      couponCode: appliedCoupon?.code,
      total,
      items: validatedItems
    };
  }

  public createOrder(orderPayload: {
    items: { productId: string; selectedColor?: string; customNote?: string; quantity: number }[];
    customer: Order['customer'];
    paymentMethod: 'cod' | 'razorpay';
    couponCode?: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
  }): { success: boolean; order?: Order; message?: string } {
    // Validate inputs
    const { customer, items, paymentMethod, couponCode } = orderPayload;
    if (!customer.fullName || !customer.mobile || !customer.address || !customer.city || !customer.state || !customer.pinCode) {
      return { success: false, message: 'All required delivery address fields must be filled.' };
    }

    if (!/^\d{6}$/.test(customer.pinCode.trim())) {
      return { success: false, message: 'Please provide a valid 6-digit Indian PIN code.' };
    }

    if (!/^\d{10}$/.test(customer.mobile.replace(/\D/g, '').slice(-10))) {
      return { success: false, message: 'Please provide a valid 10-digit mobile number.' };
    }

    if (!items || items.length === 0) {
      return { success: false, message: 'Cart cannot be empty.' };
    }

    // Check COD rules
    if (paymentMethod === 'cod') {
      if (this.data.settings.codDisabledPincodes.includes(customer.pinCode.trim())) {
        return { success: false, message: `Cash on Delivery is currently unavailable for PIN code ${customer.pinCode}. Please use prepaid online payment.` };
      }
    }

    const totals = this.calculateCartTotals(items, couponCode, paymentMethod);

    if (paymentMethod === 'cod' && totals.total > this.data.settings.codMaxOrderLimit) {
      return { 
        success: false, 
        message: `Orders above ₹${this.data.settings.codMaxOrderLimit} are not eligible for Cash on Delivery. Please choose prepaid payment.` 
      };
    }

    // Build finalized items with colors/notes
    const finalItems = totals.items.map((finalItem, idx) => {
      const original = items[idx];
      return {
        ...finalItem,
        selectedColor: original?.selectedColor,
        customNote: original?.customNote
      };
    });

    // Check stock & decrement
    for (const item of finalItems) {
      const p = this.data.products.find(prod => prod.id === item.productId);
      if (p) {
        p.stockCount = Math.max(0, p.stockCount - item.quantity);
        if (p.stockCount === 0) {
          p.inStock = false;
        }
      }
    }

    const orderId = `ord-${Date.now()}`;
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `SS-${new Date().getFullYear()}-${randomDigits}`;
    const trackingCode = `SUN${randomDigits}${Math.floor(10 + Math.random() * 90)}IN`;

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      trackingCode,
      items: finalItems,
      customer: {
        ...customer,
        pinCode: customer.pinCode.trim(),
        mobile: customer.mobile.trim()
      },
      paymentMethod,
      paymentStatus: paymentMethod === 'razorpay' ? 'paid' : 'pending',
      orderStatus: 'Confirmed',
      subtotal: totals.subtotal,
      shippingFee: totals.shippingFee,
      codFee: totals.codFee,
      discountAmount: totals.discountAmount,
      couponCode: totals.couponCode,
      total: totals.total,
      createdAt: new Date().toISOString(),
      razorpayOrderId: orderPayload.razorpayOrderId,
      razorpayPaymentId: orderPayload.razorpayPaymentId,
      statusHistory: [
        {
          status: 'Confirmed',
          timestamp: new Date().toISOString(),
          note: paymentMethod === 'cod' 
            ? 'Order confirmed for Cash on Delivery. Payment to be collected on delivery.'
            : 'Prepaid online payment confirmed successfully.'
        }
      ]
    };

    this.data.orders.unshift(newOrder);
    this.persist();

    return { success: true, order: newOrder };
  }

  public updateOrderStatus(orderId: string, status: OrderStatus, note?: string): Order | null {
    const order = this.data.orders.find(o => o.id === orderId);
    if (!order) return null;

    order.orderStatus = status;
    if (status === 'Delivered' && order.paymentMethod === 'cod') {
      order.paymentStatus = 'paid';
    } else if (status === 'Cancelled') {
      order.paymentStatus = order.paymentStatus === 'paid' ? 'failed' : 'pending';
    }

    order.statusHistory.push({
      status,
      timestamp: new Date().toISOString(),
      note: note || `Order marked as ${status}`
    });

    this.persist();
    return order;
  }

  // --- COD OTP Verification ---
  public requestOtp(mobile: string): { success: boolean; message: string; debugOtp?: string } {
    const cleanMobile = mobile.replace(/\D/g, '').slice(-10);
    if (cleanMobile.length !== 10) {
      return { success: false, message: 'Invalid 10-digit mobile number' };
    }

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 min expiry

    this.otpSessions.set(cleanMobile, { otp, expiresAt, verified: false });

    // In a production setup, SMS Gateway like Fast2SMS, Twilio, or Gupshup would dispatch the SMS.
    // For transparent development and preview, we provide the OTP directly in response for immediate testing!
    return {
      success: true,
      message: `OTP sent to +91 ${cleanMobile}. (Dev mode OTP: ${otp})`,
      debugOtp: otp
    };
  }

  public verifyOtp(mobile: string, userEnteredOtp: string): { success: boolean; message: string } {
    const cleanMobile = mobile.replace(/\D/g, '').slice(-10);
    const session = this.otpSessions.get(cleanMobile);

    if (!session) {
      return { success: false, message: 'No OTP requested for this number. Please request a new OTP.' };
    }

    if (Date.now() > session.expiresAt) {
      this.otpSessions.delete(cleanMobile);
      return { success: false, message: 'OTP has expired. Please request a new one.' };
    }

    if (session.otp !== userEnteredOtp.trim()) {
      return { success: false, message: 'Incorrect OTP. Please check and try again.' };
    }

    session.verified = true;
    return { success: true, message: 'Mobile number verified successfully!' };
  }

  public isMobileVerified(mobile: string): boolean {
    const cleanMobile = mobile.replace(/\D/g, '').slice(-10);
    return Boolean(this.otpSessions.get(cleanMobile)?.verified);
  }

  // --- Razorpay Payment Verification ---
  public createRazorpayOrder(amount: number, receipt: string): {
    id: string;
    amount: number;
    currency: string;
    isSandbox: boolean;
  } {
    // If Razorpay API credentials were fully set in .env:
    // (RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET)
    const amountInPaise = Math.round(amount * 100);
    const mockOrderId = `order_rzp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    
    return {
      id: mockOrderId,
      amount: amountInPaise,
      currency: 'INR',
      isSandbox: !process.env.RAZORPAY_KEY_SECRET
    };
  }

  public verifyRazorpaySignature(orderId: string, paymentId: string, signature: string): boolean {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      // In development sandbox mode without secret key configured in environment
      return Boolean(orderId && paymentId && signature);
    }
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');
    return generatedSignature === signature;
  }

  // --- Inquiries ---
  public addCustomInquiry(inquiry: Omit<CustomInquiry, 'id' | 'status' | 'createdAt'>): CustomInquiry {
    const newInquiry: CustomInquiry = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    this.data.customInquiries.unshift(newInquiry);
    this.persist();
    return newInquiry;
  }

  public getCustomInquiries(): CustomInquiry[] {
    return this.data.customInquiries;
  }

  public updateInquiryStatus(id: string, status: CustomInquiry['status']): CustomInquiry | null {
    const item = this.data.customInquiries.find(i => i.id === id);
    if (!item) return null;
    item.status = status;
    this.persist();
    return item;
  }

  // --- Coupons ---
  public getCoupons(): Coupon[] {
    return this.data.coupons;
  }

  public addCoupon(coupon: Coupon): Coupon {
    this.data.coupons.push(coupon);
    this.persist();
    return coupon;
  }

  public validateCoupon(code: string, subtotal: number): { valid: boolean; coupon?: Coupon; discount?: number; message?: string } {
    const c = this.data.coupons.find(coup => coup.code.toUpperCase() === code.trim().toUpperCase() && coup.active);
    if (!c) {
      return { valid: false, message: 'Invalid or expired coupon code.' };
    }
    if (subtotal < c.minOrderValue) {
      return { valid: false, message: `Minimum order of ₹${c.minOrderValue} required for coupon ${c.code}.` };
    }
    const discount = c.discountType === 'percentage' 
      ? Math.round((subtotal * c.discountValue) / 100) 
      : Math.min(c.discountValue, subtotal);

    return { valid: true, coupon: c, discount, message: `${c.code} applied! Saved ₹${discount}` };
  }

  // --- Settings ---
  public getSettings(): StoreSettings {
    return this.data.settings;
  }

  public updateSettings(updates: Partial<StoreSettings>): StoreSettings {
    this.data.settings = { ...this.data.settings, ...updates };
    this.persist();
    return this.data.settings;
  }

  // --- Reviews ---
  public getReviews(): CustomerReview[] {
    return this.data.reviews;
  }

  // --- Admin Auth ---
  public createAdminToken(): string {
    const token = crypto.randomBytes(32).toString('hex');
    this.data.adminTokens.push(token);
    this.persist();
    return token;
  }

  public isValidAdminToken(token?: string): boolean {
    if (!token) return false;
    return this.data.adminTokens.includes(token);
  }
}

export const store = new StoreService();
