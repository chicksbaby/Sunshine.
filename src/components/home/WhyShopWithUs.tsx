import React from 'react';
import { Heart, Sparkles, Gift, MapPin } from 'lucide-react';

export const WhyShopWithUs: React.FC = () => {
  const pillars = [
    {
      icon: Heart,
      color: '#F3A59B',
      title: 'Handmade with Love',
      description: 'Zero factory machines. Every loop, petal, and border is crocheted by sibling hands using soft, durable milk cotton yarn.'
    },
    {
      icon: Sparkles,
      color: '#F7C948',
      title: 'Unique Designs',
      description: 'Carefully curated color palettes and original floral motifs that stand out from mass-produced fast-fashion accessories.'
    },
    {
      icon: Gift,
      color: '#B9A4E8',
      title: 'Thoughtful Gifting',
      description: 'Packed in eco-friendly kraft boxes with twine ribbons, floral tissue wrap, and handwritten notes on seed paper.'
    },
    {
      icon: MapPin,
      color: '#D97757',
      title: 'Delivery Across India',
      description: 'Reliable pan-India delivery through trusted couriers. Transparent prepaid Razorpay checkout and Cash on Delivery (COD).'
    }
  ];

  return (
    <section className="py-14 sm:py-18 bg-[#FFF8EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D97757] uppercase tracking-wider mb-2">
            <span>🌼</span>
            <span>The Sunshine Promise</span>
          </div>
          <h2 className="font-handwriting text-4xl sm:text-5xl font-bold text-[#684431]">
            Why Shop With Us <span className="text-[#F3A59B]">♡</span>
          </h2>
          <p className="text-sm text-[#684431]/75 mt-2 font-sans">
            We are a small homegrown business, and we treat every single parcel as if it were a gift for our own closest friend.
          </p>
        </div>

        {/* 4 Feature Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-[#684431]/10 shadow-xs hover:shadow-md transition-shadow flex flex-col items-center text-center group"
              >
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${item.color}25` }}
                >
                  <Icon size={26} style={{ color: item.color === '#FFF8EF' ? '#684431' : item.color }} />
                </div>
                <h3 className="font-sans font-bold text-base text-[#684431] mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-[#684431]/75 font-sans leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
