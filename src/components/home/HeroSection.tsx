import React from 'react';
import { useStore } from '../../context/StoreContext.js';
import { ArrowRight, Sparkles, Heart, Package, ShieldCheck, Sun } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { setActivePage } = useStore();

  return (
    <section className="relative overflow-hidden pt-4 pb-12 sm:pb-16 bg-[#FFF8EF]">
      {/* Decorative floral & yarn background accents */}
      <div className="absolute top-10 left-6 text-2xl opacity-40 select-none animate-pulse">🌼</div>
      <div className="absolute top-32 right-12 text-2xl opacity-40 select-none">✨</div>
      <div className="absolute bottom-10 left-1/4 text-xl opacity-30 select-none">🧶</div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Card Container */}
        <div className="relative rounded-3xl bg-linear-to-b from-[#FFF2DE] to-[#FFF8EF] border border-[#F7C948]/30 shadow-md p-6 sm:p-10 lg:p-12 overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Cute Tag */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF8EF] border border-[#F7C948]/50 shadow-2xs">
                <span className="text-[#F7C948]">🌼</span>
                <span className="text-xs font-semibold text-[#684431] tracking-wide uppercase">
                  Handmade Crochet with Love ♡
                </span>
              </div>

              {/* Main Heading */}
              <div>
                <h1 className="font-handwriting text-5xl sm:text-6xl lg:text-7xl font-bold text-[#684431] leading-tight tracking-tight">
                  Little Threads, <br />
                  <span className="text-[#D97757]">Big Happiness</span> <span className="text-[#F3A59B]">♡</span>
                </h1>
                <p className="mt-4 text-base sm:text-lg text-[#684431]/80 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
                  Handmade crochet treasures for your everyday moments. Cute strawberry keychains, white flower wristlets, and delicate hanging charms stitched stitch-by-stitch by two siblings in India.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={() => setActivePage('shop')}
                  className="w-full sm:w-auto px-8 py-4 bg-[#D97757] hover:bg-[#E76F51] text-white font-medium text-base rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group transform active:scale-98"
                >
                  <span>Shop Now</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setActivePage('our-story')}
                  className="w-full sm:w-auto px-7 py-4 bg-white hover:bg-[#FFF2DE] text-[#684431] font-medium text-base rounded-2xl border-2 border-[#684431]/15 shadow-2xs transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span>Discover Our Story</span>
                  <Heart size={16} className="text-[#F3A59B] fill-[#F3A59B]" />
                </button>
              </div>

              {/* Sibling reassurance note */}
              <p className="text-xs text-[#684431]/60 font-medium">
                🌸 Small batch handmade • Cash on Delivery & Razorpay available pan-India
              </p>
            </div>

            {/* Right Visual Imagery (Hero collage mirroring user's photo) */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md">
                
                {/* Main Hero Photo Container with scrapbook border */}
                <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-white rotate-1 hover:rotate-0 transition-transform duration-500">
                  <img
                    src="/src/assets/images/strawberry_keychain_1791710017265.jpg"
                    alt="Sunshine Squares handmade crochet creations"
                    referrerPolicy="no-referrer"
                    className="w-full h-80 sm:h-96 object-cover"
                  />
                  
                  {/* Scrapbook Tape Detail */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#F7C948]/70 backdrop-blur-xs -rotate-2 rounded-xs shadow-xs pointer-events-none" />

                  {/* Mascot Speech Bubble (little ball of happiness) */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-lg border border-[#F7C948]/40 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#F7C948] flex items-center justify-center text-2xl shrink-0 shadow-inner">
                      🧶
                    </div>
                    <div>
                      <p className="font-handwriting text-xl font-bold text-[#684431] leading-none">
                        little ball of happiness ♡
                      </p>
                      <p className="text-xs text-[#684431]/75 mt-0.5">
                        Each piece is lovingly hand-stitched, never factory made.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating secondary badge */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-3 shadow-lg border border-[#684431]/10 hidden sm:flex items-center gap-2 animate-bounce">
                  <span className="text-xl">🌼</span>
                  <div className="text-left">
                    <p className="text-[10px] text-[#684431]/60 font-medium">Made for</p>
                    <p className="text-xs font-bold text-[#684431]">Brighter Days ♡</p>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* 4 Value Badges below hero (Requested in spec & photo) */}
          <div className="mt-10 pt-8 border-t border-[#684431]/10 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 bg-white/70 p-3.5 rounded-2xl border border-[#684431]/5 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#FFF2DE] text-[#D97757] flex items-center justify-center shrink-0">
                <span>🌱</span>
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-[#684431]">100% Handmade</h4>
                <p className="text-[11px] text-[#684431]/65">Crafted with pure love</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/70 p-3.5 rounded-2xl border border-[#684431]/5 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#FFF2DE] text-[#F3A59B] flex items-center justify-center shrink-0">
                <Heart size={20} className="fill-[#F3A59B] text-[#F3A59B]" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-[#684431]">Unique Designs</h4>
                <p className="text-[11px] text-[#684431]/65">Original artisan patterns</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/70 p-3.5 rounded-2xl border border-[#684431]/5 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#FFF2DE] text-[#F7C948] flex items-center justify-center shrink-0">
                <span>🎁</span>
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-[#684431]">Perfect for Gifting</h4>
                <p className="text-[11px] text-[#684431]/65">With handwritten notes</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/70 p-3.5 rounded-2xl border border-[#684431]/5 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#FFF2DE] text-[#B9A4E8] flex items-center justify-center shrink-0">
                <Package size={20} className="text-[#684431]" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-[#684431]">Pan India Shipping</h4>
                <p className="text-[11px] text-[#684431]/65">Prepaid & COD available</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
