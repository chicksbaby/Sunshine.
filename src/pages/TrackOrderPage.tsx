import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext.js';
import { Order, OrderStatus } from '../types/index.js';
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const TrackOrderPage: React.FC = () => {
  const { lastConfirmedOrder, setActivePage } = useStore();
  const [searchInput, setSearchInput] = useState(lastConfirmedOrder?.trackingCode || lastConfirmedOrder?.orderNumber || '');
  const [order, setOrder] = useState<Order | null>(lastConfirmedOrder || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(searchInput.trim())}`);
      const data = await res.json();
      if (res.ok && data.id) {
        setOrder(data);
      } else {
        setError(data.error || 'No order found with this tracking ID or Order Number.');
        setOrder(null);
      }
    } catch {
      setError('Could not retrieve tracking details. Please check network connection.');
    } finally {
      setLoading(false);
    }
  };

  const steps: OrderStatus[] = ['Confirmed', 'Processing', 'Shipped', 'Delivered'];

  const getStepIndex = (status: OrderStatus) => {
    if (status === 'Cancelled' || status === 'Returned') return -1;
    return steps.indexOf(status);
  };

  const currentStepIdx = order ? getStepIndex(order.orderStatus) : 0;

  return (
    <div className="py-10 sm:py-16 bg-[#FFF8EF] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#FFF2DE] flex items-center justify-center text-3xl mb-3 shadow-inner">
            📦
          </div>
          <h1 className="font-handwriting text-4xl sm:text-5xl font-bold text-[#684431]">
            Track Your Sunshine Parcel ♡
          </h1>
          <p className="text-xs sm:text-sm text-[#684431]/75 max-w-md mx-auto mt-1 font-sans">
            Enter your Order Number (e.g. <strong>SS-2026-7821</strong>) or Courier Tracking Code to see the live status.
          </p>
        </div>

        {/* Tracking Search Input */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#684431]/10 shadow-xs mb-8">
          <form onSubmit={handleTrackSubmit} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                required
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Order ID (e.g. SS-2026-7821) or Tracking Code"
                className="w-full pl-11 pr-28 py-3.5 text-xs sm:text-sm rounded-2xl border border-[#684431]/20 bg-[#FFF8EF] focus:outline-none focus:ring-2 focus:ring-[#F7C948]"
              />
              <Search size={18} className="absolute left-4 top-4 text-[#684431]/50" />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-2 px-5 py-2 bg-[#684431] hover:bg-[#D97757] text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-60"
              >
                {loading ? 'Searching...' : 'Track'}
              </button>
            </div>

            {error && (
              <p className="text-xs text-red-600 pl-2 font-medium">{error}</p>
            )}

            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-[#684431]/60">
              <span>Quick try sample orders:</span>
              <button
                type="button"
                onClick={() => setSearchInput('SS-2026-7821')}
                className="underline hover:text-[#D97757]"
              >
                SS-2026-7821 (Shipped COD)
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setSearchInput('SS-2026-7822')}
                className="underline hover:text-[#D97757]"
              >
                SS-2026-7822 (Delivered Prepaid)
              </button>
            </div>
          </form>
        </div>

        {/* Tracking Result View */}
        {order && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#684431]/10 shadow-sm space-y-6 animate-in fade-in">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#684431]/10 gap-3">
              <div>
                <span className="text-[10px] text-[#D97757] font-bold uppercase tracking-wider">
                  Order Status: {order.orderStatus}
                </span>
                <h3 className="font-price font-bold text-xl text-[#684431]">
                  {order.orderNumber}
                </h3>
                <p className="text-xs text-[#684431]/60">
                  Tracking Code: <strong className="font-mono text-[#684431]">{order.trackingCode}</strong>
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${
                  order.paymentMethod === 'cod'
                    ? order.paymentStatus === 'paid' 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}>
                  {order.paymentMethod === 'cod' 
                    ? `COD (${order.paymentStatus === 'paid' ? 'Paid on Delivery' : 'Pending Payment'})`
                    : 'Prepaid Online (Paid)'}
                </span>
                <p className="font-price font-bold text-base text-[#684431] mt-1">
                  ₹{order.total}
                </p>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="py-4">
              <div className="relative flex justify-between">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-[#FFF2DE] z-0" />
                <div 
                  className="absolute top-1/2 left-0 -translate-y-1/2 h-1 bg-[#D97757] transition-all duration-500 z-0"
                  style={{ width: `${Math.max(0, currentStepIdx) * 33.3}%` }}
                />

                {steps.map((st, i) => {
                  const isCompleted = i <= currentStepIdx;
                  const isCurrent = i === currentStepIdx;
                  return (
                    <div key={st} className="relative z-10 flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                        isCompleted 
                          ? 'bg-[#D97757] text-white ring-4 ring-orange-100' 
                          : 'bg-white border-2 border-[#684431]/20 text-[#684431]/50'
                      }`}>
                        {isCompleted ? '✓' : i + 1}
                      </div>
                      <span className={`text-[11px] font-semibold mt-2 ${
                        isCurrent ? 'text-[#D97757]' : isCompleted ? 'text-[#684431]' : 'text-[#684431]/40'
                      }`}>
                        {st}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Status History Timeline */}
            <div className="bg-[#FFF8EF] p-5 rounded-2xl border border-[#684431]/5">
              <h4 className="text-xs font-bold text-[#684431] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Clock size={13} className="text-[#D97757]" />
                <span>Tracking Milestones</span>
              </h4>
              <div className="space-y-3">
                {order.statusHistory.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <span className="w-2 h-2 rounded-full bg-[#D97757] mt-1 shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-[#684431]">{item.status}</strong>
                        <span className="text-[10px] text-[#684431]/50">
                          {new Date(item.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                      </div>
                      <p className="text-[#684431]/75 mt-0.5">{item.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Address & Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-[#FFF8EF] p-4 rounded-2xl">
                <h5 className="font-bold text-[#684431] mb-1">Destination Address:</h5>
                <p className="text-[#684431]/80">
                  {order.customer.fullName}<br />
                  {order.customer.address}<br />
                  {order.customer.city}, {order.customer.state} - {order.customer.pinCode}
                </p>
              </div>

              <div className="bg-[#FFF8EF] p-4 rounded-2xl">
                <h5 className="font-bold text-[#684431] mb-1">Items in Parcel:</h5>
                <ul className="space-y-1 text-[#684431]/80">
                  {order.items.map((it, idx) => (
                    <li key={idx} className="truncate">
                      • {it.name} (x{it.quantity})
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
