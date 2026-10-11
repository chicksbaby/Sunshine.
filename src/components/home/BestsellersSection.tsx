import React from 'react';
import { useStore } from '../../context/StoreContext.js';
import { ProductCard } from '../ProductCard.js';
import { ArrowRight, Sparkles } from 'lucide-react';

export const BestsellersSection: React.FC = () => {
  const { products, setActivePage } = useStore();

  return (
    <section className="py-12 sm:py-16 bg-[#FFF2DE]/40 border-y border-[#F7C948]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🌼</span>
              <span className="text-xs font-bold text-[#D97757] tracking-wider uppercase">Handmade Launch Catalogue</span>
            </div>
            <h2 className="font-handwriting text-4xl sm:text-5xl font-bold text-[#684431] mt-1">
              Handcrafted Launch Collection <span className="text-[#F3A59B]">♡</span>
            </h2>
            <p className="text-sm text-[#684431]/75 max-w-xl font-sans mt-1">
              Every piece is lovingly hand-crocheted stitch-by-stitch by two siblings in India. Fair, transparent pricing with no factory shortcuts.
            </p>
          </div>

          <button
            onClick={() => setActivePage('shop')}
            className="mt-4 sm:mt-0 px-5 py-2.5 rounded-full bg-white border border-[#684431]/15 text-xs font-bold text-[#684431] hover:bg-[#FFF8EF] hover:border-[#D97757] transition-all flex items-center gap-1.5 self-start sm:self-auto shadow-2xs"
          >
            <span>View All ({products.length} Products)</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Product Cards Grid - exactly 3 launch items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Transparent Gifting Banner */}
        <div className="mt-12 bg-linear-to-r from-[#FFF8EF] via-[#FFF2DE] to-[#FFF8EF] rounded-3xl p-6 sm:p-8 border border-[#F7C948]/40 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl bg-[#F7C948] text-2xl flex items-center justify-center shrink-0 shadow-sm">
              🎁
            </div>
            <div>
              <h3 className="font-handwriting text-3xl font-bold text-[#684431]">
                Thoughtful, Handmade Gifting ♡
              </h3>
              <p className="text-sm text-[#684431]/80 max-w-lg mt-0.5">
                Every order comes packaged with love, including an optional complimentary handwritten greeting note and daisy wax seal wrap.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActivePage('shop')}
            className="px-6 py-3 bg-[#684431] text-white hover:bg-[#D97757] rounded-xl text-sm font-semibold transition-colors shrink-0 shadow-xs"
          >
            Explore Handmade Shop →
          </button>
        </div>

      </div>
    </section>
  );
};
