export interface ProductCostBreakdown {
  woolCost: number;
  labourCost: number;
  packagingCost: number;
  petrolAllocation: number;
  totalCost: number;
  profitMargin: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: 'Crochet Keychains' | 'Crochet Accessories' | 'Hanging Charms' | string;
  images: string[];
  colors?: { name: string; hex: string }[];
  inStock: boolean;
  stockCount: number;
  codEligible: boolean;
  estimatedDispatch: string;
  makingTime?: string;
  costBreakdown?: ProductCostBreakdown;
  customNotesPlaceholder?: string;
  tags?: string[];
  yarnType?: string;
  dimensions?: string;
  careInstructions?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  selectedColor?: string;
  customNote?: string;
  quantity: number;
  codEligible: boolean;
}

export interface OrderCustomer {
  fullName: string;
  mobile: string;
  email?: string;
  address: string;
  landmark?: string;
  city: string;
  state: string;
  pinCode: string;
  deliveryInstructions?: string;
}

export type OrderStatus = 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned';
export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type PaymentMethod = 'cod' | 'razorpay';

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  note: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  trackingCode: string;
  items: CartItem[];
  customer: OrderCustomer;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  subtotal: number;
  shippingFee: number;
  codFee: number;
  discountAmount: number;
  couponCode?: string;
  total: number;
  createdAt: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  statusHistory: OrderStatusHistoryItem[];
}

export interface CustomInquiry {
  id: string;
  fullName: string;
  mobile: string;
  email?: string;
  description: string;
  preferredColors: string;
  occasion?: string;
  budgetRange?: string;
  status: 'new' | 'contacted' | 'quoted' | 'in_progress' | 'completed';
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  description: string;
  active: boolean;
}

export interface StoreSettings {
  freeShippingThreshold: number;
  standardShippingFee: number;
  codHandlingFee: number;
  codMaxOrderLimit: number;
  codDisabledPincodes: string[];
  razorpayKeyId: string;
  razorpayKeySecretConfigured: boolean;
  whatsappNumber: string;
  instagramHandle: string;
  businessEmail: string;
  businessAddress: string;
  allowDirectOtpVerification: boolean;
}

export interface CustomerReview {
  id: string;
  author: string;
  location: string;
  rating: number;
  productName: string;
  comment: string;
  date: string;
  verifiedBuyer: boolean;
  avatar?: string;
}
