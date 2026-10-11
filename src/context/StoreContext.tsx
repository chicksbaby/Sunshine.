import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, StoreSettings, CustomerReview, Coupon } from '../types/index.js';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS } from '../data/initialProducts.js';

interface StoreContextType {
  products: Product[];
  isLoadingProducts: boolean;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedColor?: string, customNote?: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartItemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  activePage: string;
  setActivePage: (page: string, param?: string) => void;
  selectedProductId: string | null;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  settings: StoreSettings | null;
  refreshProducts: () => Promise<void>;
  appliedCoupon: Coupon | null;
  setAppliedCoupon: (coupon: Coupon | null) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  adminToken: string | null;
  setAdminToken: (token: string | null) => void;
  lastConfirmedOrder: Order | null;
  setLastConfirmedOrder: (order: Order | null) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('sunshine_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activePage, setActivePageState] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [settings, setSettings] = useState<StoreSettings | null>(INITIAL_SETTINGS);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem('sunshine_admin_token');
    } catch {
      return null;
    }
  });
  const [lastConfirmedOrder, setLastConfirmedOrder] = useState<Order | null>(() => {
    try {
      const saved = sessionStorage.getItem('sunshine_last_order');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sunshine_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
  }, [cart]);

  // Sync admin token
  useEffect(() => {
    if (adminToken) {
      sessionStorage.setItem('sunshine_admin_token', adminToken);
    } else {
      sessionStorage.removeItem('sunshine_admin_token');
    }
  }, [adminToken]);

  // Sync last order
  useEffect(() => {
    if (lastConfirmedOrder) {
      sessionStorage.setItem('sunshine_last_order', JSON.stringify(lastConfirmedOrder));
    }
  }, [lastConfirmedOrder]);

  // Handle URL hash changes
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash) {
        setActivePageState('home');
        return;
      }
      if (hash.startsWith('product/')) {
        const id = hash.replace('product/', '');
        setSelectedProductId(id);
        setActivePageState('product');
      } else if (hash.startsWith('category/')) {
        const cat = decodeURIComponent(hash.replace('category/', ''));
        setSelectedCategory(cat);
        setActivePageState('shop');
      } else {
        setActivePageState(hash);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const setActivePage = (page: string, param?: string) => {
    if (page === 'product' && param) {
      setSelectedProductId(param);
      window.location.hash = `product/${param}`;
    } else if (page === 'category' && param) {
      setSelectedCategory(param);
      setActivePageState('shop');
      window.location.hash = `category/${encodeURIComponent(param)}`;
    } else {
      if (page === 'home') {
        window.location.hash = '';
      } else {
        window.location.hash = page;
      }
    }
    setActivePageState(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      }
    } catch (err) {
      // Backend not running (e.g. static Vercel deployment), keep initial products
      console.warn('Backend unavailable, using initial product data', err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === 'object') {
          setSettings(data);
        }
      }
    } catch (err) {
      // Keep initial settings
      console.warn('Backend unavailable, using initial settings', err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchSettings();
  }, []);

  const addToCart = (product: Product, quantity = 1, selectedColor?: string, customNote?: string) => {
    setCart(prev => {
      const colorToUse = selectedColor || product.colors?.[0]?.name || 'Standard';
      const existingIndex = prev.findIndex(
        item => item.productId === product.id && item.selectedColor === colorToUse
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        const newItem: CartItem = {
          id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0] || '',
          selectedColor: colorToUse,
          customNote,
          quantity,
          codEligible: product.codEligible
        };
        return [...prev, newItem];
      }
    });

    showToast(`Added "${product.name}" to your basket ♡`);
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev => prev.map(item => item.id === itemId ? { ...item, quantity } : item));
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
    showToast('Item removed from basket');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        products,
        isLoadingProducts,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartItemCount,
        isCartOpen,
        setIsCartOpen,
        activePage,
        setActivePage,
        selectedProductId,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        settings,
        refreshProducts: fetchProducts,
        appliedCoupon,
        setAppliedCoupon,
        toastMessage,
        showToast,
        adminToken,
        setAdminToken,
        lastConfirmedOrder,
        setLastConfirmedOrder
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
