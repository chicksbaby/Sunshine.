import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.js';
import { Shield, Truck, RotateCcw, FileText, ArrowLeft } from 'lucide-react';

interface PoliciesPageProps {
  initialTab?: 'shipping' | 'returns' | 'privacy' | 'terms';
}

export const PoliciesPage: React.FC<PoliciesPageProps> = ({ initialTab = 'shipping' }) => {
  const { setActivePage } = useStore();
  const [tab, setTab] = useState<'shipping' | 'returns' | 'privacy' | 'terms'>(initialTab);

  return (
    <div className="py-10 sm:py-16 bg-[#FFF8EF] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <button
          onClick={() => setActivePage('home')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#684431]/70 hover:text-[#D97757] mb-6"
        >
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </button>

        {/* Tab Navigation */}
        <div className="bg-white p-2 rounded-2xl border border-[#684431]/10 flex flex-wrap gap-2 mb-8 shadow-xs">
          <button
            onClick={() => setTab('shipping')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              tab === 'shipping' ? 'bg-[#684431] text-white shadow-xs' : 'text-[#684431] hover:bg-[#FFF2DE]'
            }`}
          >
            <Truck size={14} />
            <span>Shipping Policy</span>
          </button>
          <button
            onClick={() => setTab('returns')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              tab === 'returns' ? 'bg-[#684431] text-white shadow-xs' : 'text-[#684431] hover:bg-[#FFF2DE]'
            }`}
          >
            <RotateCcw size={14} />
            <span>Cancellations & Returns</span>
          </button>
          <button
            onClick={() => setTab('privacy')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              tab === 'privacy' ? 'bg-[#684431] text-white shadow-xs' : 'text-[#684431] hover:bg-[#FFF2DE]'
            }`}
          >
            <Shield size={14} />
            <span>Privacy Policy</span>
          </button>
          <button
            onClick={() => setTab('terms')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              tab === 'terms' ? 'bg-[#684431] text-white shadow-xs' : 'text-[#684431] hover:bg-[#FFF2DE]'
            }`}
          >
            <FileText size={14} />
            <span>Terms of Service</span>
          </button>
        </div>

        {/* Policy Content Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#684431]/10 shadow-xs font-sans text-xs sm:text-sm text-[#684431]/80 space-y-6 leading-relaxed">
          
          {tab === 'shipping' && (
            <div className="space-y-4">
              <h2 className="font-handwriting text-3xl font-bold text-[#684431]">
                Pan-India Shipping Policy ♡
              </h2>
              <p>
                At Sunshine Squares, every crochet creation is handmade by sibling hands. Here are our exact fulfillment commitments:
              </p>
              <div className="space-y-3 pt-2">
                <div className="bg-[#FFF8EF] p-4 rounded-2xl border border-[#684431]/5">
                  <h4 className="font-bold text-[#684431] mb-1">1. Dispatch Timelines</h4>
                  <p>In-stock products dispatch within <strong>2 to 3 business days</strong> from Bengaluru. Made-to-order custom pieces dispatch within <strong>4 to 5 business days</strong>.</p>
                </div>
                <div className="bg-[#FFF8EF] p-4 rounded-2xl border border-[#684431]/5">
                  <h4 className="font-bold text-[#684431] mb-1">2. Delivery Time & Couriers</h4>
                  <p>Deliveries are handled by trusted partners (BlueDart, Delhivery, Speed Post). Delivery typically takes <strong>3 to 5 business days</strong> after dispatch depending on your city and state.</p>
                </div>
                <div className="bg-[#FFF8EF] p-4 rounded-2xl border border-[#684431]/5">
                  <h4 className="font-bold text-[#684431] mb-1">3. Shipping Rates & Free Shipping</h4>
                  <p>Orders above <strong>₹999</strong> receive <strong>FREE Shipping</strong> across all deliverable Indian pincodes. For orders below ₹999, a flat shipping charge of ₹60 is applied.</p>
                </div>
                <div className="bg-[#FFF8EF] p-4 rounded-2xl border border-[#684431]/5">
                  <h4 className="font-bold text-[#684431] mb-1">4. Cash on Delivery (COD)</h4>
                  <p>A nominal COD handling fee of ₹40 applies for cash collection and verification logistics. Orders above ₹3,000 must be prepaid online.</p>
                </div>
              </div>
            </div>
          )}

          {tab === 'returns' && (
            <div className="space-y-4">
              <h2 className="font-handwriting text-3xl font-bold text-[#684431]">
                Cancellation & Returns Policy ♡
              </h2>
              <p>
                Because our items are handcrafted stitch-by-stitch and made in tiny batches, each piece takes several hours of manual craft.
              </p>
              <div className="space-y-3 pt-2">
                <div className="bg-[#FFF8EF] p-4 rounded-2xl border border-[#684431]/5">
                  <h4 className="font-bold text-[#684431] mb-1">1. Order Cancellations</h4>
                  <p>Orders may be cancelled within <strong>12 hours</strong> of placing the order by messaging us on WhatsApp or emailing hello@sunshinesquares.in. Once the artisan has started crocheting custom orders or once parcels are shipped, cancellations cannot be honored.</p>
                </div>
                <div className="bg-[#FFF8EF] p-4 rounded-2xl border border-[#684431]/5">
                  <h4 className="font-bold text-[#684431] mb-1">2. Transit Damage & Replacements</h4>
                  <p>If your parcel arrives damaged in courier transit, please send an unboxing video to our WhatsApp (+91 98765 43210) within <strong>48 hours</strong> of receipt. We will ship a free replacement right away!</p>
                </div>
                <div className="bg-[#FFF8EF] p-4 rounded-2xl border border-[#684431]/5">
                  <h4 className="font-bold text-[#684431] mb-1">3. Color Nuances</h4>
                  <p>Handmade yarn dye lots may have minute natural variances. Slight 5-10% hue differences under varying screen monitors are normal characteristics of artisanal fibers.</p>
                </div>
              </div>
            </div>
          )}

          {tab === 'privacy' && (
            <div className="space-y-4">
              <h2 className="font-handwriting text-3xl font-bold text-[#684431]">
                Privacy & Data Security Policy ♡
              </h2>
              <p>
                Your privacy is sacred to us. Sunshine Squares does not sell, rent, or trade your personal information.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Your name, address, and mobile number are used exclusively to process and deliver your parcels.</li>
                <li>We do not store credit card credentials, CVVs, or UPI PINs. All online payments are handled directly by RBI-authorized payment aggregator Razorpay.</li>
                <li>You can request deletion of your order records anytime by emailing us.</li>
              </ul>
            </div>
          )}

          {tab === 'terms' && (
            <div className="space-y-4">
              <h2 className="font-handwriting text-3xl font-bold text-[#684431]">
                Terms & Conditions ♡
              </h2>
              <p>
                By using the Sunshine Squares website and placing an order, you agree to these fair terms:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>All designs, photos, and descriptions are proprietary creations of Sunshine Squares.</li>
                <li>Prices are in Indian Rupees (₹ INR) and include all applicable taxes.</li>
                <li>Customers placing Cash on Delivery orders agree to receive and pay the full invoice amount to the courier personnel upon delivery. Refusing genuine COD orders causes severe loss to small handcrafters.</li>
              </ul>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
