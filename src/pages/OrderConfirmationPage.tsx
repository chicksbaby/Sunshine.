import React from 'react';
import { useStore } from '../context/StoreContext.js';
import { 
  CheckCircle2, 
  Package, 
  MapPin, 
  Clock, 
  MessageCircle, 
  ArrowRight, 
  Heart, 
  ShoppingBag,
  Banknote,
  CreditCard
} from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { lastConfirmedOrder, setActivePage } = useStore();

  if (!lastConfirmedOrder) {
    return (
      <div className="py-20 text-center bg-[#FFF8EF] min-h-screen">
        <p className="text-sm text-[#684431]">No recent order found.</p>
        <button
          onClick={() => setActivePage('shop')}
          className="mt-4 px-6 py-2.5 bg-[#684431] text-white text-xs rounded-full"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const order = lastConfirmedOrder;
  const isCod = order.paymentMethod === 'cod';

  const whatsappMessage = encodeURIComponent(
    `Hello Sunshine Squares! I just placed order #${order.orderNumber} (${order.items.map(i => i.name).join(', ')}). Delivery to ${order.customer.city}, ${order.customer.pinCode}. Total: ₹${order.total}. Looking forward to receiving it! ♡`
  );

  return (
    <div className="py-10 sm:py-16 bg-[#FFF8EF] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Celebration Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#684431]/10 shadow-sm text-center relative overflow-hidden">
          
          <div className="w-20 h-20 mx-auto rounded-full bg-[#FFF2DE] flex items-center justify-center text-4xl mb-4 shadow-inner">
            🌼
          </div>

          <span className="text-xs font-bold text-[#D97757] tracking-wider uppercase">
            Order Successfully Placed ♡
          </span>

          <h1 className="font-handwriting text-4xl sm:text-5xl font-bold text-[#684431] mt-1">
            Thank You, {order.customer.fullName.split(' ')[0]}!
          </h1>

          {/* COD Notice Banner */}
          {isCod ? (
            <div className="mt-4 bg-[#FFF2DE] border border-[#F7C948] p-4 rounded-2xl max-w-lg mx-auto text-left flex items-start gap-3">
              <Banknote size={22} className="text-[#D97757] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-sans font-bold text-sm text-[#684431]">
                  Cash on Delivery Confirmed
                </h4>
                <p className="text-xs text-[#684431]/85 mt-0.5 leading-relaxed font-sans">
                  "Your order is placed! Please keep the payment ready when your parcel arrives."
                </p>
                <p className="text-xs font-bold text-[#D97757] mt-1 font-price">
                  Exact amount due on delivery: ₹{order.total}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-4 bg-emerald-50 border border-emerald-200 p-4 rounded-2xl max-w-lg mx-auto text-left flex items-start gap-3">
              <CreditCard size={22} className="text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-sans font-bold text-sm text-emerald-900">
                  Prepaid Payment Received (₹{order.total})
                </h4>
                <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed font-sans">
                  Your payment has been securely verified on our server. We are starting on your parcel!
                </p>
              </div>
            </div>
          )}

          {/* Order Details Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-6 max-w-lg mx-auto text-center">
            <div className="bg-[#FFF8EF] p-3 rounded-2xl border border-[#684431]/5">
              <span className="text-[10px] text-[#684431]/60 uppercase font-medium">Order Number</span>
              <p className="font-price font-bold text-sm text-[#684431] mt-0.5">{order.orderNumber}</p>
            </div>
            <div className="bg-[#FFF8EF] p-3 rounded-2xl border border-[#684431]/5">
              <span className="text-[10px] text-[#684431]/60 uppercase font-medium">Tracking Code</span>
              <p className="font-mono font-bold text-sm text-[#D97757] mt-0.5">{order.trackingCode}</p>
            </div>
            <div className="bg-[#FFF8EF] p-3 rounded-2xl border border-[#684431]/5 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-[#684431]/60 uppercase font-medium">Estimated Dispatch</span>
              <p className="font-sans font-bold text-xs text-[#684431] mt-0.5">2-3 Business Days</p>
            </div>
          </div>

          {/* Direct WhatsApp Confirmation Button */}
          <div className="pt-2">
            <a
              href={`https://wa.me/919876543210?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-semibold rounded-2xl shadow-sm transition-colors"
            >
              <MessageCircle size={18} />
              <span>Send Order Confirmation on WhatsApp</span>
            </a>
            <p className="text-[11px] text-[#684431]/60 mt-1.5">
              Chat directly with the sibling artisans for customized greeting notes or parcel queries
            </p>
          </div>

          {/* Purchased Items List */}
          <div className="mt-8 pt-6 border-t border-[#684431]/10 text-left">
            <h4 className="text-xs font-bold text-[#684431] uppercase tracking-wider mb-4">
              Items in Your Order
            </h4>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={item.image} alt="" className="w-12 h-12 rounded-xl object-cover bg-[#FFF8EF]" />
                    <div className="min-w-0">
                      <p className="font-semibold text-[#684431] truncate">{item.name}</p>
                      {item.selectedColor && (
                        <p className="text-[11px] text-[#684431]/60">Color: {item.selectedColor}</p>
                      )}
                      {item.customNote && (
                        <p className="text-[11px] text-[#684431]/70 italic truncate">Note: "{item.customNote}"</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[#684431]/70 mr-2">x{item.quantity}</span>
                    <span className="font-price font-bold text-[#684431]">₹{item.price * item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address Summary */}
          <div className="mt-6 pt-6 border-t border-[#684431]/10 text-left bg-[#FFF8EF] p-4 rounded-2xl">
            <h5 className="text-xs font-bold text-[#684431] mb-1 flex items-center gap-1.5">
              <MapPin size={13} className="text-[#D97757]" />
              <span>Shipping Address:</span>
            </h5>
            <p className="text-xs text-[#684431]/80 font-sans">
              <strong>{order.customer.fullName}</strong> (+91 {order.customer.mobile})<br />
              {order.customer.address}, {order.customer.landmark ? `${order.customer.landmark}, ` : ''}
              {order.customer.city}, {order.customer.state} - <strong>{order.customer.pinCode}</strong>
            </p>
          </div>

          {/* Action Navigation */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setActivePage('track-order')}
              className="w-full sm:w-auto px-6 py-3 bg-[#684431] hover:bg-[#D97757] text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Package size={15} />
              <span>Track Order Live</span>
            </button>
            <button
              onClick={() => setActivePage('shop')}
              className="w-full sm:w-auto px-6 py-3 bg-white border border-[#684431]/20 hover:bg-[#FFF2DE] text-[#684431] text-xs font-semibold rounded-xl transition-colors"
            >
              Continue Shopping
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
