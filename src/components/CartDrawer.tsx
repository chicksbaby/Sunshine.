import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.js';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  Tag, 
  CheckCircle2, 
  Truck 
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    setActivePage,
    settings,
    appliedCoupon,
    setAppliedCoupon,
    showToast
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  if (!isCartOpen) return null;

  const freeShippingThreshold = settings?.freeShippingThreshold || 999;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponError('');
    setIsValidatingCoupon(true);

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput.trim(), subtotal: cartSubtotal })
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setAppliedCoupon(data.coupon);
        setCouponInput('');
        showToast(data.message || 'Coupon applied! ♡');
      } else {
        setCouponError(data.message || 'Invalid coupon code');
      }
    } catch {
      setCouponError('Could not validate coupon right now.');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discountType === 'percentage') {
      return Math.round((cartSubtotal * appliedCoupon.discountValue) / 100);
    }
    return Math.min(appliedCoupon.discountValue, cartSubtotal);
  };

  const discountAmount = calculateDiscount();
  const estimatedTotal = Math.max(0, cartSubtotal - discountAmount);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)} 
        className="absolute inset-0 bg-[#684431]/40 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFF8EF] shadow-2xl flex flex-col border-l border-[#684431]/10">
          
          {/* Header */}
          <div className="p-5 border-b border-[#684431]/10 flex items-center justify-between bg-white/70">
            <div className="flex items-center gap-2">
              <span className="text-xl">🧺</span>
              <h2 className="font-handwriting text-3xl font-bold text-[#684431]">
                Your Basket ♡
              </h2>
              <span className="text-xs bg-[#F7C948]/40 px-2 py-0.5 rounded-full font-semibold text-[#684431]">
                {cart.length} {cart.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-[#684431]/60 hover:text-[#684431] hover:bg-[#FFF2DE] rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-[#FFF2DE] px-5 py-3 border-b border-[#F7C948]/30">
            <div className="flex items-center justify-between text-xs text-[#684431] font-medium mb-1.5">
              <div className="flex items-center gap-1.5">
                <Truck size={15} className="text-[#D97757]" />
                <span>
                  {amountNeededForFreeShipping === 0 ? (
                    <strong className="text-emerald-700 font-semibold">Yay! You unlocked FREE Pan-India Shipping! 🎉</strong>
                  ) : (
                    <>Add <strong>₹{amountNeededForFreeShipping}</strong> more for <strong>FREE Pan-India Shipping</strong></>
                  )}
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#684431]/70">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-white rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-linear-to-r from-[#F7C948] to-[#F3A59B] transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 rounded-full bg-[#FFF2DE] flex items-center justify-center mb-4 text-3xl shadow-inner">
                  🧶
                </div>
                <h3 className="font-handwriting text-3xl font-bold text-[#684431] mb-2">
                  Your basket is empty!
                </h3>
                <p className="text-sm text-[#684431]/70 max-w-xs mb-6">
                  Fill it with our handmade strawberry keychains, floral wristlets, and hanging charms ♡
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setActivePage('shop');
                  }}
                  className="px-6 py-2.5 bg-[#684431] text-white text-sm font-medium rounded-full shadow-sm hover:bg-[#D97757] transition-colors"
                >
                  Explore Handmade Shop
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white p-3.5 rounded-2xl border border-[#684431]/10 shadow-xs flex gap-3 relative group"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 object-cover rounded-xl bg-[#FFF8EF] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-sm font-semibold text-[#684431] truncate">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#684431]/40 hover:text-red-500 p-1 transition-colors"
                        title="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {item.selectedColor && (
                      <span className="inline-block text-[11px] font-medium bg-[#FFF2DE] text-[#684431] px-2 py-0.5 rounded-md mt-0.5">
                        Color: {item.selectedColor}
                      </span>
                    )}

                    {item.customNote && (
                      <p className="text-[11px] text-[#684431]/70 italic mt-0.5 truncate">
                        Note: "{item.customNote}"
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-2.5">
                      <span className="font-price font-bold text-sm text-[#684431]">
                        ₹{item.price * item.quantity}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-[#684431]/20 rounded-lg bg-[#FFF8EF] px-1 py-0.5">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:text-[#D97757] text-[#684431] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="font-price text-xs font-semibold px-2 text-[#684431]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:text-[#D97757] text-[#684431] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#684431]/10 bg-white/90 space-y-3.5">
              
              {/* Promo Coupon Form */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl text-xs text-emerald-800">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Tag size={14} className="text-emerald-600" />
                      <span>Code <strong>{appliedCoupon.code}</strong> applied (-₹{discountAmount})</span>
                    </div>
                    <button
                      onClick={() => setAppliedCoupon(null)}
                      className="text-emerald-700 hover:text-emerald-900 text-[11px] underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-1">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="Coupon code (e.g. SUNSHINE10)"
                        className="flex-1 text-xs px-3 py-2 rounded-xl border border-[#684431]/20 bg-[#FFF8EF] focus:outline-none focus:ring-1 focus:ring-[#F7C948]"
                      />
                      <button
                        type="submit"
                        disabled={isValidatingCoupon || !couponInput.trim()}
                        className="px-3.5 py-2 bg-[#684431] text-white text-xs font-medium rounded-xl hover:bg-[#D97757] transition-colors disabled:opacity-50"
                      >
                        {isValidatingCoupon ? '...' : 'Apply'}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[11px] text-red-600 pl-1">{couponError}</p>
                    )}
                  </form>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#684431]/80 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-price font-medium">₹{cartSubtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span className="font-price">-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-emerald-700">
                    {cartSubtotal >= freeShippingThreshold ? 'FREE' : 'Calculated at checkout (₹60)'}
                  </span>
                </div>
                <div className="border-t border-[#684431]/10 pt-2 flex justify-between text-base font-bold text-[#684431]">
                  <span>Estimated Total</span>
                  <span className="font-price text-lg text-[#684431]">₹{estimatedTotal}</span>
                </div>
              </div>

              {/* Proceed to Checkout Button */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setActivePage('checkout');
                }}
                className="w-full py-3.5 bg-[#D97757] hover:bg-[#E76F51] text-white font-medium text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform transform active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={17} />
              </button>

              <p className="text-center text-[11px] text-[#684431]/60">
                🔒 Safe & encrypted • Razorpay UPI or Cash on Delivery (COD)
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
