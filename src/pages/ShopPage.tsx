import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.js';
import { ProductCard } from '../components/ProductCard.js';
import { Filter, Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { 
    products, 
    isLoadingProducts, 
    selectedCategory, 
    setSelectedCategory,
    searchQuery,
    setSearchQuery 
  } = useStore();

  const [sortOption, setSortOption] = useState<'default' | 'price-low' | 'price-high'>('default');
  const [onlyInStock, setOnlyInStock] = useState(false);

  // Dynamic categories including existing products and any added in admin
  const categories = [
    'All',
    ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))
  ];

  // Filtering
  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchQuery.trim() || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase().trim());
    const matchesStock = !onlyInStock || p.inStock;

    return matchesCat && matchesSearch && matchesStock;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'price-low') return a.price - b.price;
    if (sortOption === 'price-high') return b.price - a.price;
    return 0;
  });

  return (
    <div className="py-8 sm:py-12 bg-[#FFF8EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner */}
        <div className="bg-linear-to-r from-[#FFF2DE] via-white to-[#FFF2DE] rounded-3xl p-6 sm:p-10 border border-[#F7C948]/30 mb-8 sm:mb-10 text-center relative overflow-hidden shadow-2xs">
          <span className="text-3xl">🌼</span>
          <h1 className="font-handwriting text-4xl sm:text-6xl font-bold text-[#684431] mt-2">
            The Sunshine Collection <span className="text-[#F3A59B]">♡</span>
          </h1>
          <p className="text-sm sm:text-base text-[#684431]/80 max-w-xl mx-auto mt-2 font-sans">
            Explore 100% handmade crochet creations. Small batch, premium soft milk cotton, and delivered with love across India.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#684431]/10 shadow-xs mb-8 space-y-4">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-[#684431] text-white shadow-xs'
                    : 'bg-[#FFF8EF] text-[#684431] hover:bg-[#FFF2DE] border border-[#684431]/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Controls: Search, Sort, In-Stock */}
          <div className="pt-3 border-t border-[#684431]/10 flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search keychain, wristlet, flower charm..."
                className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-[#684431]/20 bg-[#FFF8EF] text-[#684431] placeholder-[#684431]/40 focus:outline-none focus:ring-1 focus:ring-[#F7C948]"
              />
              <Search size={15} className="absolute left-3 top-2.5 text-[#684431]/50" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-[#684431]/40 hover:text-[#684431]"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Sorting & Stock filter */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
              
              {/* In stock toggle */}
              <label className="flex items-center gap-2 text-xs text-[#684431] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded text-[#D97757] focus:ring-[#F7C948] accent-[#D97757]"
                />
                <span>In Stock Only</span>
              </label>

              {/* Sort dropdown */}
              <div className="flex items-center gap-2 text-xs text-[#684431]">
                <SlidersHorizontal size={14} className="text-[#D97757]" />
                <span className="text-[#684431]/60">Sort:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as any)}
                  className="bg-[#FFF8EF] border border-[#684431]/20 rounded-xl px-3 py-1.5 text-xs text-[#684431] font-medium focus:outline-none focus:ring-1 focus:ring-[#F7C948]"
                >
                  <option value="featured">Featured & Bestsellers</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

            </div>

          </div>

        </div>

        {/* Product Count Display */}
        <div className="flex items-center justify-between text-xs text-[#684431]/70 font-medium mb-6 px-1">
          <span>Showing {sortedProducts.length} handmade {sortedProducts.length === 1 ? 'item' : 'items'}</span>
          {searchQuery && (
            <span>Search results for: "<strong>{searchQuery}</strong>"</span>
          )}
        </div>

        {/* Product Grid */}
        {isLoadingProducts ? (
          <div className="py-20 text-center">
            <div className="inline-block animate-spin text-3xl mb-3">🌼</div>
            <p className="text-sm text-[#684431] font-medium">Unrolling skeins of yarn...</p>
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto border border-[#684431]/10">
            <span className="text-4xl block mb-3">🔍</span>
            <h3 className="font-handwriting text-3xl font-bold text-[#684431] mb-2">
              No matching pieces found
            </h3>
            <p className="text-xs text-[#684431]/70 mb-5">
              Try searching with another keyword or reset the category filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setOnlyInStock(false);
              }}
              className="px-5 py-2.5 bg-[#684431] text-white text-xs font-semibold rounded-full hover:bg-[#D97757] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
