import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext.js';
import { Product, Order, CustomInquiry, Coupon, OrderStatus, PaymentStatus } from '../types/index.js';
import { 
  Lock, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Clock, 
  Filter, 
  Search, 
  ArrowRight, 
  DollarSign,
  Truck,
  LogOut,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  Tag
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { adminToken, setAdminToken, showToast, refreshProducts, settings: globalSettings } = useStore();

  // Login form state
  const [email, setEmail] = useState('admin@sunshinesquares.in');
  const [password, setPassword] = useState('sunshine123');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'inquiries' | 'settings'>('overview');

  // Dashboard Data
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [inquiries, setInquiries] = useState<CustomInquiry[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Orders Filters
  const [orderPaymentFilter, setOrderPaymentFilter] = useState<string>('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState('');

  // Product Modal (Add/Edit)
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#F3A59B');
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    category: 'Crochet Keychains',
    price: 149,
    description: '',
    images: ['/images/strawberry-keychain.jpg'],
    colors: [{ name: 'Pastel Pink', hex: '#F3A59B' }],
    inStock: true,
    stockCount: 15,
    codEligible: true,
    estimatedDispatch: '2-3 business days',
    makingTime: '30 minutes'
  });

  const handleAddColor = () => {
    if (!newColorName.trim()) {
      showToast('Please enter a colour name (e.g. Daisy Yellow)');
      return;
    }
    setProductForm(prev => ({
      ...prev,
      colors: [...(prev.colors || []), { name: newColorName.trim(), hex: newColorHex }]
    }));
    setNewColorName('');
  };

  const handleRemoveColor = (index: number) => {
    setProductForm(prev => ({
      ...prev,
      colors: (prev.colors || []).filter((_, i) => i !== index)
    }));
  };

  const handleCostChange = (field: 'woolCost' | 'labourCost' | 'packagingCost' | 'petrolAllocation', val: number) => {
    const currentCost = productForm.costBreakdown || {
      woolCost: 0,
      labourCost: 0,
      packagingCost: 25,
      petrolAllocation: 11.67,
      totalCost: 0,
      profitMargin: 0
    };
    const updated = {
      ...currentCost,
      [field]: val
    };
    const totalCost = Number((updated.woolCost + updated.labourCost + updated.packagingCost + updated.petrolAllocation).toFixed(2));
    const profitMargin = Number(((productForm.price || 0) - totalCost).toFixed(2));
    setProductForm(prev => ({
      ...prev,
      costBreakdown: {
        ...updated,
        totalCost,
        profitMargin
      }
    }));
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      showToast('Image file too large (max 8MB)');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setIsUploadingImage(true);
      try {
        const res = await fetch('/api/admin/upload-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          },
          body: JSON.stringify({
            dataUrl,
            filename: file.name
          })
        });
        const data = await res.json();
        if (res.ok && data.url) {
          setProductForm(prev => ({
            ...prev,
            images: [data.url, ...(prev.images || []).slice(1)]
          }));
          showToast('Image uploaded and saved successfully! ♡');
        } else {
          showToast(data.error || 'Failed to upload image');
        }
      } catch {
        showToast('Image upload failed');
      } finally {
        setIsUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Settings form
  const [settingsForm, setSettingsForm] = useState(globalSettings || {
    freeShippingThreshold: 999,
    standardShippingFee: 60,
    codHandlingFee: 40,
    codMaxOrderLimit: 3000,
    codDisabledPincodes: [],
    razorpayKeyId: 'rzp_test_sunshine',
    razorpayKeySecretConfigured: false,
    whatsappNumber: '+919876543210',
    instagramHandle: '@sunshinesquares.in',
    businessEmail: 'hello@sunshinesquares.in',
    businessAddress: 'Indiranagar, Bengaluru, KA 560038',
    allowDirectOtpVerification: true
  });

  // Load Admin Data when authenticated
  const fetchDashboardData = async () => {
    if (!adminToken) return;
    setIsLoadingData(true);
    try {
      const headers = { 'Authorization': `Bearer ${adminToken}` };
      
      const [ordersRes, prodsRes, inqRes] = await Promise.all([
        fetch('/api/admin/orders', { headers }),
        fetch('/api/products'),
        fetch('/api/admin/custom-inquiries', { headers })
      ]);

      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (prodsRes.ok) setProducts(await prodsRes.json());
      if (inqRes.ok) setInquiries(await inqRes.json());
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (adminToken) {
      fetchDashboardData();
    }
  }, [adminToken]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setAdminToken(data.token);
        showToast('Welcome back, Sibling Co-Founder! ♡');
      } else {
        setLoginError(data.error || 'Invalid credentials');
      }
    } catch {
      setLoginError('Server error during authentication.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setAdminToken(null);
    showToast('Admin logged out.');
  };

  // Order status update
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          status,
          note: `Artisan updated status to ${status}`
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
        showToast(`Order marked as ${status}`);
      }
    } catch {
      showToast('Could not update order status');
    }
  };

  // Save product (Add or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingProduct 
        ? `/api/admin/products/${editingProduct.id}`
        : '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(productForm)
      });

      if (res.ok) {
        showToast(editingProduct ? 'Product updated successfully' : 'New handmade product added!');
        setShowProductModal(false);
        setEditingProduct(null);
        fetchDashboardData();
        refreshProducts();
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to save product');
      }
    } catch {
      showToast('Network error while saving product');
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
        showToast('Product removed');
        refreshProducts();
      }
    } catch {
      showToast('Failed to delete product');
    }
  };

  // Update inquiry status
  const handleUpdateInquiryStatus = async (id: string, status: CustomInquiry['status']) => {
    try {
      const res = await fetch(`/api/admin/custom-inquiries/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
        showToast('Inquiry status updated');
      }
    } catch {
      showToast('Failed to update inquiry');
    }
  };

  // Update store settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(settingsForm)
      });
      if (res.ok) {
        showToast('Store settings updated successfully! ♡');
      }
    } catch {
      showToast('Failed to save settings');
    }
  };

  // If not authenticated, show login
  if (!adminToken) {
    return (
      <div className="py-16 sm:py-24 bg-[#FFF8EF] min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-[#684431]/10 shadow-lg text-center space-y-5">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#FFF2DE] text-3xl flex items-center justify-center shadow-inner">
            🌼
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#D97757] uppercase tracking-wider">Sibling Admin Portal</span>
            <h2 className="font-handwriting text-3xl font-bold text-[#684431] mt-0.5">
              Sunshine Squares Studio ♡
            </h2>
            <p className="text-xs text-[#684431]/70 mt-1">
              Sign in to manage orders, update COD statuses, add crochet products, and view inquiries.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-[#684431] mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#684431]/20 bg-[#FFF8EF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#684431] mb-1">
                Admin Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#684431]/20 bg-[#FFF8EF]"
              />
            </div>

            {loginError && (
              <p className="text-xs text-red-600 font-medium">{loginError}</p>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 bg-[#684431] hover:bg-[#D97757] text-white text-xs font-semibold rounded-2xl shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <Lock size={14} />
              <span>{isLoggingIn ? 'Verifying...' : 'Sign In to Studio Portal'}</span>
            </button>

            <div className="bg-[#FFF2DE] p-2.5 rounded-xl text-[11px] text-[#684431]/80 text-center font-medium">
              Demo Credentials: <strong>admin@sunshinesquares.in</strong> / <strong>sunshine123</strong>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Calculate Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : 0), 0);
  const pendingCodOrders = orders.filter(o => o.paymentMethod === 'cod' && o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled');
  const deliveredOrders = orders.filter(o => o.orderStatus === 'Delivered');

  // Filter orders
  const filteredOrders = orders.filter(o => {
    const matchesPayment = orderPaymentFilter === 'all' || o.paymentMethod === orderPaymentFilter;
    const matchesStatus = orderStatusFilter === 'all' || o.orderStatus === orderStatusFilter;
    const matchesSearch = !orderSearch.trim() || 
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.fullName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.mobile.includes(orderSearch);

    return matchesPayment && matchesStatus && matchesSearch;
  });

  return (
    <div className="py-8 bg-[#FFF8EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Header */}
        <div className="bg-white rounded-3xl p-6 border border-[#684431]/10 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F7C948] flex items-center justify-center text-2xl shadow-xs">
              🌼
            </div>
            <div>
              <h1 className="font-handwriting text-3xl font-bold text-[#684431]">
                Sunshine Squares Studio Manager ♡
              </h1>
              <p className="text-xs text-[#684431]/70">
                Sibling Co-Founders Portal • Indiranagar Studio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchDashboardData}
              className="p-2 text-[#684431] hover:bg-[#FFF2DE] rounded-xl border border-[#684431]/10"
              title="Refresh Data"
            >
              <RefreshCw size={16} className={isLoadingData ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-[#FFF2DE] hover:bg-[#FFE8C8] text-[#684431] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-[#684431]/10 pb-2">
          {[
            { id: 'overview', label: 'Overview Analytics' },
            { id: 'orders', label: `Orders (${orders.length})` },
            { id: 'products', label: `Products (${products.length})` },
            { id: 'inquiries', label: `Custom Requests (${inquiries.length})` },
            { id: 'settings', label: 'Shipping & COD Settings' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                activeTab === t.id
                  ? 'bg-[#684431] text-white shadow-xs'
                  : 'bg-white text-[#684431] hover:bg-[#FFF2DE] border border-[#684431]/10'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-[#684431]/10 shadow-xs">
                <span className="text-[11px] text-[#684431]/60 font-semibold uppercase">Total Paid Revenue</span>
                <p className="font-price font-bold text-2xl text-emerald-700 mt-1">₹{totalRevenue}</p>
                <p className="text-[10px] text-[#684431]/50 mt-1">From prepaid & delivered COD</p>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#684431]/10 shadow-xs">
                <span className="text-[11px] text-[#684431]/60 font-semibold uppercase">Total Orders</span>
                <p className="font-price font-bold text-2xl text-[#684431] mt-1">{orders.length}</p>
                <p className="text-[10px] text-[#684431]/50 mt-1">{deliveredOrders.length} delivered successfully</p>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#684431]/10 shadow-xs">
                <span className="text-[11px] text-[#684431]/60 font-semibold uppercase">Pending COD Dispatches</span>
                <p className="font-price font-bold text-2xl text-[#D97757] mt-1">{pendingCodOrders.length}</p>
                <p className="text-[10px] text-[#684431]/50 mt-1">Require cash collection on arrival</p>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#684431]/10 shadow-xs">
                <span className="text-[11px] text-[#684431]/60 font-semibold uppercase">Custom Inquiries</span>
                <p className="font-price font-bold text-2xl text-[#B9A4E8] mt-1">{inquiries.length}</p>
                <p className="text-[10px] text-[#684431]/50 mt-1">Bespoke bouquets & requests</p>
              </div>
            </div>

            {/* Quick Sibling Workflow Guide */}
            <div className="bg-[#FFF2DE] rounded-3xl p-6 border border-[#F7C948] space-y-3">
              <h3 className="font-handwriting text-2xl font-bold text-[#684431]">
                Daily Sibling Workflow Checklist ♡
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#684431]/80">
                <div className="bg-white/80 p-3.5 rounded-2xl">
                  <strong className="block text-[#684431] mb-1">1. Check New COD Orders</strong>
                  <p>All COD orders require automated OTP confirmation. Verify the delivery phone number before crocheting.</p>
                </div>
                <div className="bg-white/80 p-3.5 rounded-2xl">
                  <strong className="block text-[#684431] mb-1">2. Print Handwritten Greeting Card</strong>
                  <p>Check the customer's custom notes and wrap with floral tissue and wax seal before dispatching.</p>
                </div>
                <div className="bg-white/80 p-3.5 rounded-2xl">
                  <strong className="block text-[#684431] mb-1">3. Mark Status to 'Shipped'</strong>
                  <p>Customer gets instant tracking visibility with their AWB number. Mark as 'Delivered' when courier confirms payment.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Orders Manager */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 border border-[#684431]/10 shadow-xs space-y-5">
            
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-72">
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search order #, customer name, phone..."
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-[#684431]/20 bg-[#FFF8EF]"
                />
                <Search size={14} className="absolute left-3 top-2.5 text-[#684431]/50" />
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-[#684431]/60">Payment:</span>
                  <select
                    value={orderPaymentFilter}
                    onChange={(e) => setOrderPaymentFilter(e.target.value)}
                    className="bg-[#FFF8EF] border border-[#684431]/20 rounded-xl px-2.5 py-1.5 text-xs"
                  >
                    <option value="all">All Payments</option>
                    <option value="cod">Cash on Delivery (COD)</option>
                    <option value="razorpay">Prepaid Online</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-[#684431]/60">Status:</span>
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="bg-[#FFF8EF] border border-[#684431]/20 rounded-xl px-2.5 py-1.5 text-xs"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#684431]">
                <thead className="bg-[#FFF8EF] text-[#684431]/70 uppercase tracking-wider font-semibold border-b border-[#684431]/10">
                  <tr>
                    <th className="py-3 px-3">Order Details</th>
                    <th className="py-3 px-3">Customer & Delivery</th>
                    <th className="py-3 px-3">Items</th>
                    <th className="py-3 px-3">Payment</th>
                    <th className="py-3 px-3">Status Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#684431]/10">
                  {filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-[#FFF8EF]/40 transition-colors">
                      
                      {/* Order info */}
                      <td className="py-3.5 px-3 align-top">
                        <p className="font-price font-bold text-sm text-[#684431]">{order.orderNumber}</p>
                        <p className="font-mono text-[10px] text-[#D97757]">{order.trackingCode}</p>
                        <p className="text-[10px] text-[#684431]/50 mt-1">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-3 align-top">
                        <strong className="block text-[#684431]">{order.customer.fullName}</strong>
                        <p className="text-[11px] text-[#684431]/75">+91 {order.customer.mobile}</p>
                        <p className="text-[10px] text-[#684431]/60 mt-0.5 line-clamp-2" title={order.customer.address}>
                          {order.customer.address}, {order.customer.city} ({order.customer.pinCode})
                        </p>
                        {order.customer.deliveryInstructions && (
                          <p className="text-[10px] text-amber-700 italic mt-0.5">Note: "{order.customer.deliveryInstructions}"</p>
                        )}
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-3 align-top">
                        <div className="space-y-1">
                          {order.items.map((it, i) => (
                            <div key={i} className="text-[11px] flex items-center justify-between gap-2">
                              <span className="truncate max-w-[140px]">• {it.name}</span>
                              <span className="text-[#684431]/60">x{it.quantity}</span>
                            </div>
                          ))}
                        </div>
                        <p className="font-price font-bold text-sm text-[#684431] mt-2">
                          Total: ₹{order.total}
                        </p>
                      </td>

                      {/* Payment */}
                      <td className="py-3.5 px-3 align-top">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          order.paymentMethod === 'cod'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-emerald-100 text-emerald-900'
                        }`}>
                          {order.paymentMethod === 'cod' ? 'COD' : 'Prepaid (Razorpay)'}
                        </span>
                        <p className="text-[11px] text-[#684431]/70 mt-1 font-medium capitalize">
                          Status: <strong>{order.paymentStatus}</strong>
                        </p>
                        {order.paymentMethod === 'cod' && order.paymentStatus === 'pending' && (
                          <span className="text-[10px] text-amber-700 block">Collect ₹{order.total}</span>
                        )}
                      </td>

                      {/* Status Selector */}
                      <td className="py-3.5 px-3 align-top">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-xl border focus:outline-none ${
                            order.orderStatus === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : order.orderStatus === 'Shipped'
                              ? 'bg-blue-50 text-blue-800 border-blue-300'
                              : order.orderStatus === 'Processing'
                              ? 'bg-purple-50 text-purple-800 border-purple-300'
                              : order.orderStatus === 'Cancelled'
                              ? 'bg-red-50 text-red-800 border-red-300'
                              : 'bg-amber-50 text-amber-800 border-amber-300'
                          }`}
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                          <option value="Returned">Returned</option>
                        </select>
                        <p className="text-[10px] text-[#684431]/50 mt-1">
                          Changes persist instantly
                        </p>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* Tab 3: Products CRUD */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl p-6 border border-[#684431]/10 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-handwriting text-3xl font-bold text-[#684431]">
                  Handmade Catalog Management ♡
                </h3>
                <p className="text-xs text-[#684431]/70">
                  Add new crochet pieces, adjust pricing, stock quantities, or toggle COD eligibility.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({
                    name: '',
                    category: 'Crochet Keychains',
                    price: 149,
                    description: '',
                    images: ['/images/strawberry-keychain.jpg'],
                    colors: [{ name: 'Pastel Pink', hex: '#F3A59B' }],
                    inStock: true,
                    stockCount: 15,
                    codEligible: true,
                    estimatedDispatch: '2-3 business days',
                    makingTime: '30 minutes'
                  });
                  setShowProductModal(true);
                }}
                className="px-4 py-2.5 bg-[#D97757] hover:bg-[#E76F51] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs"
              >
                <Plus size={15} />
                <span>Add New Crochet Piece</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(prod => (
                <div key={prod.id} className="p-4 rounded-2xl border border-[#684431]/10 bg-[#FFF8EF] flex gap-3 relative group">
                  <img 
                    src={prod.images[0]} 
                    alt="" 
                    className="w-18 h-18 rounded-xl object-cover bg-white shrink-0" 
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src.includes('/src/assets/images/')) {
                        target.src = target.src.replace('/src/assets/images/', '/images/');
                      }
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-[#684431] truncate">{prod.name}</h4>
                    <p className="text-[10px] text-[#D97757] font-semibold">{prod.category}</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-price font-bold text-sm text-[#684431]">₹{prod.price}</span>
                      <span className="text-[11px] text-[#684431]/60">Stock: {prod.stockCount}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => {
                          setEditingProduct(prod);
                          setProductForm(prod);
                          setShowProductModal(true);
                        }}
                        className="text-[11px] text-[#684431] bg-white px-2.5 py-1 rounded-lg border border-[#684431]/15 hover:bg-[#FFF2DE]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="text-[11px] text-red-600 bg-white px-2.5 py-1 rounded-lg border border-red-200 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Inquiries */}
        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-3xl p-6 border border-[#684431]/10 shadow-xs space-y-4">
            <h3 className="font-handwriting text-3xl font-bold text-[#684431]">
              Custom Order Inquiries ♡
            </h3>
            <p className="text-xs text-[#684431]/70">
              Customer personalized requests from the website. Reach out on WhatsApp with a quote!
            </p>

            <div className="space-y-4 pt-2">
              {inquiries.length === 0 ? (
                <p className="text-xs text-[#684431]/60 italic py-6 text-center">No custom inquiries received yet.</p>
              ) : (
                inquiries.map(inq => (
                  <div key={inq.id} className="p-5 rounded-2xl border border-[#684431]/10 bg-[#FFF8EF] space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#684431]/10">
                      <div>
                        <strong className="text-sm text-[#684431]">{inq.fullName}</strong>
                        <p className="text-xs text-[#684431]/70">
                          WhatsApp: <strong>+91 {inq.mobile}</strong> {inq.email && `• ${inq.email}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={inq.status}
                          onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value as any)}
                          className="text-xs font-semibold px-3 py-1 rounded-xl border bg-white"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted on WhatsApp</option>
                          <option value="quoted">Quoted</option>
                          <option value="in_progress">In Progress (Crocheting)</option>
                          <option value="completed">Completed</option>
                        </select>
                        <a
                          href={`https://wa.me/91${inq.mobile.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(inq.fullName)}!%20This%20is%20Sunshine%20Squares%20following%20up%20on%20your%20custom%20crochet%20request%20♡`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-[#25D366] text-white text-xs font-semibold rounded-xl"
                        >
                          WhatsApp Now
                        </a>
                      </div>
                    </div>

                    <p className="text-xs text-[#684431]/85 italic">
                      "{inq.description}"
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-[#684431]/75">
                      <div>Colors: <strong>{inq.preferredColors}</strong></div>
                      <div>Occasion: <strong>{inq.occasion || 'General'}</strong></div>
                      <div>Budget: <strong>{inq.budgetRange || 'Not specified'}</strong></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 5: Settings */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#684431]/10 shadow-xs">
            <h3 className="font-handwriting text-3xl font-bold text-[#684431] mb-2">
              Store Shipping & COD Rules ♡
            </h3>
            <p className="text-xs text-[#684431]/70 mb-6">
              Configure free shipping thresholds, COD fees, max limits, and studio contact details.
            </p>

            <form onSubmit={handleSaveSettings} className="space-y-4 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#684431] mb-1">
                    Free Shipping Threshold (₹)
                  </label>
                  <input
                    type="number"
                    value={settingsForm.freeShippingThreshold}
                    onChange={(e) => setSettingsForm({ ...settingsForm, freeShippingThreshold: Number(e.target.value) })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#684431]/20 bg-[#FFF8EF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#684431] mb-1">
                    Standard Shipping Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={settingsForm.standardShippingFee}
                    onChange={(e) => setSettingsForm({ ...settingsForm, standardShippingFee: Number(e.target.value) })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#684431]/20 bg-[#FFF8EF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#684431] mb-1">
                    COD Handling Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={settingsForm.codHandlingFee}
                    onChange={(e) => setSettingsForm({ ...settingsForm, codHandlingFee: Number(e.target.value) })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#684431]/20 bg-[#FFF8EF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#684431] mb-1">
                    Max Order Limit for COD (₹)
                  </label>
                  <input
                    type="number"
                    value={settingsForm.codMaxOrderLimit}
                    onChange={(e) => setSettingsForm({ ...settingsForm, codMaxOrderLimit: Number(e.target.value) })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#684431]/20 bg-[#FFF8EF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#684431] mb-1">
                  WhatsApp Business Number (with country code)
                </label>
                <input
                  type="text"
                  value={settingsForm.whatsappNumber}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#684431]/20 bg-[#FFF8EF]"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-[#684431] hover:bg-[#D97757] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                Save Settings
              </button>
            </form>
          </div>
        )}

      </div>

      {/* Add / Edit Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-[#684431]/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#684431]/10 my-8">
            <h3 className="font-handwriting text-3xl font-bold text-[#684431] mb-4">
              {editingProduct ? 'Edit Handmade Piece ♡' : 'Add New Handmade Piece ♡'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#684431] mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Strawberry Keychain"
                  className="w-full px-3 py-2 rounded-xl border border-[#684431]/20 bg-[#FFF8EF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#684431] mb-1">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setCustomCategoryInput('');
                        setProductForm({ ...productForm, category: '' });
                      } else {
                        setProductForm({ ...productForm, category: e.target.value as any });
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-[#684431]/20 bg-[#FFF8EF]"
                  >
                    <option value="Crochet Keychains">Crochet Keychains</option>
                    <option value="Crochet Accessories">Crochet Accessories</option>
                    <option value="Hanging Charms">Hanging Charms</option>
                    <option value="custom">+ Custom Category</option>
                  </select>
                  {(!productForm.category || productForm.category === 'custom') && (
                    <input
                      type="text"
                      required
                      placeholder="Enter custom category name"
                      value={customCategoryInput}
                      onChange={(e) => {
                        setCustomCategoryInput(e.target.value);
                        setProductForm({ ...productForm, category: e.target.value });
                      }}
                      className="mt-1.5 w-full px-2.5 py-1.5 rounded-lg border border-[#684431]/20 bg-white"
                    />
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-[#684431] mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#684431]/20 bg-[#FFF8EF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#684431] mb-1">Making Time</label>
                  <input
                    type="text"
                    value={productForm.makingTime || ''}
                    onChange={(e) => setProductForm({ ...productForm, makingTime: e.target.value })}
                    placeholder="e.g. 30 minutes, 45 minutes"
                    className="w-full px-3 py-2 rounded-xl border border-[#684431]/20 bg-[#FFF8EF]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#684431] mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={productForm.stockCount || 10}
                    onChange={(e) => setProductForm({ ...productForm, stockCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#684431]/20 bg-[#FFF8EF]"
                  />
                </div>
              </div>

              {/* Photo Upload Section */}
              <div className="p-3 bg-[#FFF8EF] rounded-2xl border border-[#684431]/10 space-y-2">
                <label className="block font-semibold text-[#684431]">Product Photo *</label>
                
                <div className="flex items-center gap-3">
                  {productForm.images?.[0] ? (
                    <img
                      src={productForm.images[0]}
                      alt="Preview"
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-xl object-cover border border-[#684431]/20 shrink-0"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src.includes('/src/assets/images/')) {
                          target.src = target.src.replace('/src/assets/images/', '/images/');
                        }
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-white border border-dashed border-[#684431]/30 flex items-center justify-center text-xs text-[#684431]/40 shrink-0">
                      No Photo
                    </div>
                  )}

                  <div className="flex-1 space-y-1">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#684431] text-white rounded-lg text-xs font-medium hover:bg-[#D97757] transition-colors">
                      <span>{isUploadingImage ? 'Uploading...' : 'Upload Photo from Computer'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[10px] text-[#684431]/60">Supports PNG, JPG, WebP. Saved persistently.</p>
                  </div>
                </div>

                <div className="pt-1">
                  <span className="text-[10px] text-[#684431]/60 block mb-0.5">Or enter image URL path:</span>
                  <input
                    type="text"
                    required
                    value={productForm.images?.[0] || ''}
                    onChange={(e) => setProductForm({ ...productForm, images: [e.target.value] })}
                    placeholder="/images/... or https://..."
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#684431]/20 bg-white text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#684431] mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Describe the handmade piece, yarn composition, and dimensions..."
                  className="w-full px-3 py-2 rounded-xl border border-[#684431]/20 bg-[#FFF8EF]"
                />
              </div>

              {/* Colours Section */}
              <div className="p-3 bg-[#FFF8EF] rounded-2xl border border-[#684431]/10 space-y-2">
                <label className="block font-semibold text-[#684431]">Colours & Shades</label>
                
                {/* Active shades list */}
                {productForm.colors && productForm.colors.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {productForm.colors.map((col, idx) => (
                      <span 
                        key={idx} 
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#684431]/15 text-[11px] text-[#684431]"
                      >
                        <span 
                          className="w-3 h-3 rounded-full border border-black/15 shrink-0" 
                          style={{ backgroundColor: col.hex }} 
                        />
                        <span>{col.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(idx)}
                          className="text-red-500 hover:text-red-700 ml-1 font-bold text-xs"
                          title="Remove colour"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Add new colour row */}
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="w-8 h-8 rounded-lg border border-[#684431]/20 cursor-pointer bg-white p-0.5 shrink-0"
                    title="Select hex colour"
                  />
                  <input
                    type="text"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    placeholder="e.g. Pastel Pink & Leaf Green"
                    className="flex-1 px-2.5 py-1.5 rounded-lg border border-[#684431]/20 bg-white text-[11px]"
                  />
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="px-3 py-1.5 bg-[#684431] text-white rounded-lg text-xs font-semibold hover:bg-[#D97757] transition-colors shrink-0"
                  >
                    Add Shade
                  </button>
                </div>
              </div>

              {/* Cost Breakdown Transparency (Optional) */}
              <div className="p-3 bg-[#FFF8EF] rounded-2xl border border-[#684431]/10 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-[#684431]">Cost Allocation & Profit Calculation (₹)</label>
                  <span className="text-[10px] text-[#684431]/60">Handmade business analytics</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <span className="text-[10px] text-[#684431]/70 block">Wool Cost</span>
                    <input
                      type="number"
                      step="0.01"
                      value={productForm.costBreakdown?.woolCost || ''}
                      onChange={(e) => handleCostChange('woolCost', Number(e.target.value))}
                      placeholder="e.g. 33.33"
                      className="w-full px-2 py-1 rounded-lg border border-[#684431]/20 bg-white text-[11px]"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#684431]/70 block">Labour Cost</span>
                    <input
                      type="number"
                      step="0.01"
                      value={productForm.costBreakdown?.labourCost || ''}
                      onChange={(e) => handleCostChange('labourCost', Number(e.target.value))}
                      placeholder="e.g. 20"
                      className="w-full px-2 py-1 rounded-lg border border-[#684431]/20 bg-white text-[11px]"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#684431]/70 block">Packaging</span>
                    <input
                      type="number"
                      step="0.01"
                      value={productForm.costBreakdown?.packagingCost || ''}
                      onChange={(e) => handleCostChange('packagingCost', Number(e.target.value))}
                      placeholder="e.g. 25"
                      className="w-full px-2 py-1 rounded-lg border border-[#684431]/20 bg-white text-[11px]"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#684431]/70 block">Petrol / Transp</span>
                    <input
                      type="number"
                      step="0.01"
                      value={productForm.costBreakdown?.petrolAllocation || ''}
                      onChange={(e) => handleCostChange('petrolAllocation', Number(e.target.value))}
                      placeholder="e.g. 11.67"
                      className="w-full px-2 py-1 rounded-lg border border-[#684431]/20 bg-white text-[11px]"
                    />
                  </div>
                </div>

                {productForm.costBreakdown && (
                  <div className="flex items-center justify-between pt-1 text-[11px] font-semibold">
                    <span className="text-[#684431]">
                      Calculated Total Cost: <strong>₹{productForm.costBreakdown.totalCost || 0}</strong>
                    </span>
                    <span className={productForm.costBreakdown.profitMargin >= 0 ? "text-emerald-700" : "text-red-600"}>
                      Margin before expenses: <strong>₹{productForm.costBreakdown.profitMargin || 0}</strong>
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.inStock}
                    onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                    className="accent-[#D97757]"
                  />
                  <span>Available In Stock</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.codEligible}
                    onChange={(e) => setProductForm({ ...productForm, codEligible: e.target.checked })}
                    className="accent-[#D97757]"
                  />
                  <span>Cash on Delivery (COD) Eligible</span>
                </label>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#684431]/20 text-[#684431] hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingImage}
                  className="flex-1 py-2.5 rounded-xl bg-[#D97757] hover:bg-[#E76F51] text-white font-semibold shadow-xs disabled:opacity-50"
                >
                  Save Piece Persistently
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
