import React from 'react';
import { useStore } from '../../context/StoreContext.js';
import { Heart, Sparkles, Coffee } from 'lucide-react';

export const BrandStorySection: React.FC = () => {
  const { setActivePage } = useStore();

  return (
    <section className="py-14 sm:py-20 bg-[#FFF8EF] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-[#684431]/10 shadow-sm relative">
          
          {/* Scrapbook corner details */}
          <div className="absolute top-4 left-6 text-xs text-[#684431]/40 font-mono">
            est. Bengaluru, India 📍
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Visual Photo with Polaroid vibe */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="bg-[#FFF8EF] p-4 pb-8 rounded-2xl shadow-md border border-[#684431]/10 -rotate-1 hover:rotate-0 transition-transform duration-300 max-w-sm w-full">
                <div className="aspect-4/3 rounded-xl overflow-hidden bg-amber-50">
                  <img
                    src="/images/white-flower-wristlet.jpg"
                    alt="Handcrafted crochet pieces with milk cotton yarn"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src.includes('/src/assets/images/')) {
                        target.src = target.src.replace('/src/assets/images/', '/images/');
                      }
                    }}
                  />
                </div>
                <div className="pt-3 text-center">
                  <p className="font-handwriting text-2xl font-bold text-[#684431]">
                    Two siblings, endless skeins of yarn ♡
                  </p>
                  <p className="text-xs text-[#684431]/60 font-sans mt-0.5">
                    "Every stitch carries a little happiness."
                  </p>
                </div>
              </div>
            </div>

            {/* Story copy */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF2DE] border border-[#F7C948]/40">
                <Heart size={14} className="text-[#D97757] fill-[#D97757]" />
                <span className="text-xs font-semibold text-[#684431] uppercase tracking-wider">
                  Our Story
                </span>
              </div>

              <h2 className="font-handwriting text-4xl sm:text-5xl font-bold text-[#684431] leading-tight">
                Crafted by Two Siblings, <br />
                <span className="text-[#D97757]">Made for Brighter Days ♡</span>
              </h2>

              <p className="text-sm sm:text-base text-[#684431]/80 leading-relaxed font-sans">
                Sunshine Squares started in our living room with a simple belief: in a fast world of mass-produced plastic, there is something deeply magical about a handmade treasure crafted with soft yarn, patient hands, and thoughtful care.
              </p>

              <p className="text-sm sm:text-base text-[#684431]/80 leading-relaxed font-sans">
                As a brother-sister duo in India, one of us handles the hooks, loops, and color harmonies, while the other packs each order in eco-friendly wraps, hand-writes greeting cards, and coordinates pan-India deliveries.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => setActivePage('our-story')}
                  className="px-6 py-3 bg-[#684431] hover:bg-[#D97757] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors"
                >
                  Read Full Sibling Story →
                </button>
                <button
                  onClick={() => setActivePage('custom-orders')}
                  className="px-6 py-3 bg-[#FFF2DE] hover:bg-[#FFE8C8] text-[#684431] text-sm font-semibold rounded-xl border border-[#F7C948]/50 transition-colors"
                >
                  Request a Custom Piece
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
