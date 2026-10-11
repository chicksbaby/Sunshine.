import React from 'react';
import { useStore } from '../context/StoreContext.js';
import { Heart, Sparkles, Coffee, ArrowRight } from 'lucide-react';

export const OurStoryPage: React.FC = () => {
  const { setActivePage } = useStore();

  return (
    <div className="py-10 sm:py-16 bg-[#FFF8EF] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF2DE] border border-[#F7C948]/50 rounded-full text-xs font-bold text-[#684431] uppercase tracking-wider mb-3">
            <Heart size={14} className="text-[#D97757] fill-[#D97757]" />
            <span>The Sibling Story</span>
          </div>
          <h1 className="font-handwriting text-5xl sm:text-6xl font-bold text-[#684431]">
            Handmade with Love, <br />
            <span className="text-[#D97757]">Made for Brighter Days ♡</span>
          </h1>
          <p className="text-sm sm:text-base text-[#684431]/80 max-w-xl mx-auto mt-3 font-sans leading-relaxed">
            How a brother and sister turned a quiet living room corner in India into a cozy crochet studio delivering joy across the country.
          </p>
        </div>

        {/* Story Content & Visuals */}
        <div className="space-y-10">
          
          {/* Section 1 */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#684431]/10 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5">
              <div className="aspect-square rounded-2xl overflow-hidden bg-amber-50 border-4 border-[#FFF8EF] shadow-md -rotate-2">
                <img
                  src="/src/assets/images/double_flower_charm_1791710043189.jpg"
                  alt="Handmade crochet flowers and charms"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="md:col-span-7 space-y-3 font-sans text-xs sm:text-sm text-[#684431]/85 leading-relaxed">
              <h3 className="font-handwriting text-3xl font-bold text-[#684431]">
                How It Began in 2024
              </h3>
              <p>
                During a college semester break, our grandmother showed us how to hook our very first granny square. What started as making a sunflower coaster for our mother’s morning chai quickly turned into an obsession with loops, color palettes, and yarn textures.
              </p>
              <p>
                Friends started asking: <em>"Can you make one of those daisy tote bags for me?"</em> and <em>"Could you crochet a forever rose for my girlfriend's birthday?"</em> That spark led us to launch <strong>Sunshine Squares</strong>.
              </p>
            </div>
          </div>

          {/* Section 2: Division of Crafts */}
          <div className="bg-linear-to-br from-[#FFF2DE] to-[#FFF8EF] rounded-3xl p-6 sm:p-10 border border-[#F7C948]/30 shadow-xs">
            <h3 className="font-handwriting text-3xl font-bold text-[#684431] text-center mb-6">
              Who Does What? Sibling Teamwork ♡
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white/80 p-5 rounded-2xl border border-[#684431]/10 text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#F7C948]/30 flex items-center justify-center text-2xl">
                  🧶
                </div>
                <h4 className="font-sans font-bold text-sm text-[#684431]">The Master Hook</h4>
                <p className="text-xs text-[#684431]/75 leading-relaxed">
                  Calculates row stitches, designs floral color pairings, tests milk cotton softness, and crochets each intricate daisy petal and bag handle.
                </p>
              </div>

              <div className="bg-white/80 p-5 rounded-2xl border border-[#684431]/10 text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#F3A59B]/30 flex items-center justify-center text-2xl">
                  💌
                </div>
                <h4 className="font-sans font-bold text-sm text-[#684431]">The Gifting & Logistics Lead</h4>
                <p className="text-xs text-[#684431]/75 leading-relaxed">
                  Types custom notes on vintage cardstock, ties twine ribbons, manages pan-India shipping integrations, and chats with you on WhatsApp.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Our Quality Guarantee */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#684431]/10 shadow-xs space-y-4 font-sans text-xs sm:text-sm text-[#684431]/85 leading-relaxed">
            <h3 className="font-handwriting text-3xl font-bold text-[#684431]">
              Our Promise to You
            </h3>
            <p>
              We know ordering handmade online requires trust. That's why we never use synthetic scratchy wool, cheap plastic fillings, or factory shortcuts. Every item is washed in mild conditioner before dispatch so it arrives clean, soft, and smelling heavenly.
            </p>
            <p>
              We also offer Cash on Delivery across India so you can order with absolute peace of mind.
            </p>

            <div className="pt-4 text-center">
              <button
                onClick={() => setActivePage('shop')}
                className="px-8 py-3.5 bg-[#D97757] hover:bg-[#E76F51] text-white text-xs sm:text-sm font-semibold rounded-2xl shadow-md transition-colors inline-flex items-center gap-2"
              >
                <span>Browse Our Handcrafted Pieces</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
