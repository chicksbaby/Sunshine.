import React from 'react';
import { useStore } from '../../context/StoreContext.js';
import { ArrowRight } from 'lucide-react';

interface CategoryItem {
  name: string;
  label: string;
  image: string;
  tagline: string;
  count: string;
}

export const ShopByCategory: React.FC = () => {
  const { setActivePage, setSelectedCategory } = useStore();

  const categories: CategoryItem[] = [
    {
      name: 'Crochet Keychains',
      label: 'Crochet Keychains',
      image: '/images/strawberry-keychain.jpg',
      tagline: 'Handcrafted berry & bell charms',
      count: 'Pocket Cuties'
    },
    {
      name: 'Crochet Accessories',
      label: 'Crochet Accessories',
      image: '/images/white-flower-wristlet.jpg',
      tagline: 'Braided floral wristlets & accents',
      count: 'Everyday Wear'
    },
    {
      name: 'Hanging Charms',
      label: 'Hanging Charms',
      image: '/images/double-flower-hanging-charm.jpg',
      tagline: 'Tiered floral charms for mirrors & pegs',
      count: 'Delicate Vines'
    }
  ];

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setActivePage('shop');
  };

  return (
    <section className="py-12 sm:py-16 bg-[#FFF8EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[#F7C948] text-xl">🌼</span>
              <span className="text-xs font-bold text-[#D97757] tracking-wider uppercase">Handcrafted Launch Collections</span>
            </div>
            <h2 className="font-handwriting text-4xl sm:text-5xl font-bold text-[#684431] mt-1">
              Shop by Category <span className="text-[#F3A59B]">♡</span>
            </h2>
            <p className="text-sm text-[#684431]/70 font-sans mt-1">
              Purely handmade crochet pieces, made stitch-by-stitch with soft yarn in India.
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedCategory('All');
              setActivePage('shop');
            }}
            className="mt-4 sm:mt-0 text-sm font-semibold text-[#D97757] hover:text-[#684431] flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>View All ({categories.length} Categories)</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Categories Grid - 3 real categories */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => handleCategorySelect(cat.name)}
              className="group bg-white rounded-3xl p-4 border border-[#684431]/10 hover:border-[#F7C948] shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
            >
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#FFF8EF] mb-3">
                <img
                  src={cat.image}
                  alt={cat.label}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src.includes('/src/assets/images/')) {
                      target.src = target.src.replace('/src/assets/images/', '/images/');
                    }
                  }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#684431]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="text-center px-1 pb-1">
                <h3 className="font-sans font-bold text-base text-[#684431] group-hover:text-[#D97757] transition-colors flex items-center justify-center gap-1">
                  <span>{cat.label}</span>
                  <span className="text-[#D97757] group-hover:translate-x-0.5 transition-transform">→</span>
                </h3>
                <p className="text-xs text-[#684431]/60 line-clamp-1 mt-0.5">
                  {cat.tagline}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
