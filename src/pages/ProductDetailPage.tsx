import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext.js';
import { Product } from '../types/index.js';
import { ProductCard } from '../components/ProductCard.js';
import { 
  Truck, 
  ShieldCheck, 
  Plus, 
  Minus, 
  ArrowLeft, 
  Clock, 
  Coins, 
  CheckCircle2, 
  ShoppingBag,
  Sparkles
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { 
    selectedProductId, 
    products, 
    addToCart, 
    setActivePage, 
    setIsCartOpen 
  } = useStore();

  const product = products.find(p => p.id === selectedProductId || p.slug === selectedProductId) || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>(product?.colors?.[0]?.name || '');
  const [quantity, setQuantity] = useState(1);
  const [customNote, setCustomNote] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'cost' | 'care' | 'shipping'>('details');

  useEffect(() => {
    if (product?.colors?.[0]) {
      setSelectedColor(product.colors[0].name);
    }
    setActiveImageIndex(0);
    setQuantity(1);
    setCustomNote('');
  }, [selectedProductId, product]);

  if (!product) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-[#684431]">Product not found.</p>
        <button
          onClick={() => setActivePage('shop')}
          className="mt-4 px-5 py-2 bg-[#684431] text-white text-xs rounded-full"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, customNote);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor, customNote);
    setIsCartOpen(false);
    setActivePage('checkout');
  };

  const relatedProducts = products
    .filter(p => p.id !== product.id)
    .slice(0, 2);

  return (
    <div className="py-8 sm:py-12 bg-[#FFF8EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back breadcrumb */}
        <button
          onClick={() => setActivePage('shop')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#684431]/70 hover:text-[#D97757] mb-6 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Collection</span>
        </button>

        {/* Product Hero Layout */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#684431]/10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left: Product Images Gallery */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Active Photo */}
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-[#FFF8EF] border border-[#684431]/10 shadow-inner group">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src.includes('/src/assets/images/')) {
                    target.src = target.src.replace('/src/assets/images/', '/images/');
                  }
                }}
              />
              <span className="absolute top-4 left-4 bg-[#FFF8EF]/90 backdrop-blur-xs text-[#684431] text-xs font-bold px-3 py-1 rounded-full shadow-xs border border-[#684431]/10">
                100% Handmade ♡
              </span>
            </div>

            {/* Thumbnail Row */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-[#D97757] ring-2 ring-[#D97757]/30 scale-102'
                        : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt="" 
                      referrerPolicy="no-referrer" 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src.includes('/src/assets/images/')) {
                          target.src = target.src.replace('/src/assets/images/', '/images/');
                        }
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details & Purchase Form */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              {/* Category & Making Time */}
              <div className="flex items-center justify-between text-xs text-[#684431]/70">
                <span className="font-semibold text-[#D97757] uppercase tracking-wider">{product.category}</span>
                {product.makingTime && (
                  <span className="flex items-center gap-1.5 text-xs text-[#684431] bg-[#FFF2DE] px-2.5 py-1 rounded-full font-medium">
                    <Clock size={13} className="text-[#D97757]" />
                    <span>Making Time: {product.makingTime}</span>
                  </span>
                )}
              </div>

              {/* Product Title */}
              <h1 className="font-sans font-bold text-2xl sm:text-3xl text-[#684431]">
                {product.name}
              </h1>

              {/* Pricing in INR - honest real price, no fake discount strikethrough */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="font-price font-bold text-3xl text-[#684431]">
                  ₹{product.price}
                </span>
                <span className="text-xs text-[#684431]/60 font-sans">
                  (Inclusive of all taxes)
                </span>
              </div>

              {/* Genuine Status Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <CheckCircle2 size={13} className="text-emerald-600" />
                  <span>{product.inStock ? 'In Stock • Handcrafted with Love ♡' : 'Made to Order'}</span>
                </span>

                {product.codEligible && (
                  <span className="text-xs font-semibold text-[#684431] bg-[#FFF2DE] px-3 py-1 rounded-full border border-[#F7C948]/50">
                    ✓ Cash on Delivery (COD) Available
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-[#684431]/80 font-sans leading-relaxed pt-2">
                {product.description}
              </p>

              {/* Color Swatch Selector if available */}
              {product.colors && product.colors.length > 0 && (
                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs font-medium text-[#684431] mb-2">
                    <span>Selected Shade: <strong>{selectedColor}</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c.name)}
                        className={`group relative p-1 rounded-full border-2 transition-all ${
                          selectedColor === c.name
                            ? 'border-[#D97757] scale-110 shadow-xs'
                            : 'border-transparent hover:border-[#684431]/30'
                        }`}
                        title={c.name}
                      >
                        <span
                          className="w-7 h-7 rounded-full block border border-black/10"
                          style={{ backgroundColor: c.hex }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Customization instructions note (if applicable) */}
              <div className="pt-2">
                <label className="block text-xs font-medium text-[#684431] mb-1">
                  Optional Handwritten Gift Card Note:
                </label>
                <input
                  type="text"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="e.g. Free card message: 'Happy Birthday to my sweetest friend!' ♡"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#684431]/20 bg-[#FFF8EF] focus:outline-none focus:ring-1 focus:ring-[#F7C948]"
                />
              </div>

              {/* Quantity Selector */}
              <div className="pt-2 flex items-center gap-4">
                <span className="text-xs font-semibold text-[#684431]">Quantity:</span>
                <div className="flex items-center border border-[#684431]/20 rounded-xl bg-[#FFF8EF] px-2 py-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 hover:text-[#D97757] text-[#684431]"
                    aria-label="Decrease"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-price font-bold text-sm px-3 text-[#684431]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockCount || 10, quantity + 1))}
                    className="p-1 hover:text-[#D97757] text-[#684431]"
                    aria-label="Increase"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div className="text-xs text-[#684431]/60 flex items-center gap-1">
                  <Clock size={13} />
                  <span>Dispatches in {product.estimatedDispatch}</span>
                </div>
              </div>

            </div>

            {/* Action Buttons: Add to Cart & Buy Now */}
            <div className="pt-4 border-t border-[#684431]/10 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3.5 bg-white border-2 border-[#684431] text-[#684431] hover:bg-[#FFF2DE] text-sm font-semibold rounded-2xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={16} />
                  <span>Add to Cart ♡</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="w-full py-3.5 bg-[#D97757] hover:bg-[#E76F51] text-white text-sm font-semibold rounded-2xl shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <span>Buy Now (₹{product.price * quantity})</span>
                </button>
              </div>

              {/* Trust highlights */}
              <div className="bg-[#FFF2DE]/50 rounded-2xl p-3 grid grid-cols-2 gap-2 text-[11px] text-[#684431]/80 font-medium">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-[#D97757]" />
                  <span>100% Sibling Handcraft</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck size={14} className="text-[#D97757]" />
                  <span>Pan India Courier Tracking</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Tabbed Specifications & Craft Cost Transparency */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-[#684431]/10 shadow-xs">
          <div className="flex border-b border-[#684431]/10 gap-6 mb-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-3 text-sm font-bold whitespace-nowrap transition-colors relative ${
                activeTab === 'details' ? 'text-[#D97757]' : 'text-[#684431]/60 hover:text-[#684431]'
              }`}
            >
              Yarn & Dimensions
              {activeTab === 'details' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#D97757]" />}
            </button>
            
            {product.costBreakdown && (
              <button
                onClick={() => setActiveTab('cost')}
                className={`pb-3 text-sm font-bold whitespace-nowrap transition-colors relative ${
                  activeTab === 'cost' ? 'text-[#D97757]' : 'text-[#684431]/60 hover:text-[#684431]'
                }`}
              >
                Cost Breakdown Transparency
                {activeTab === 'cost' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#D97757]" />}
              </button>
            )}

            <button
              onClick={() => setActiveTab('care')}
              className={`pb-3 text-sm font-bold whitespace-nowrap transition-colors relative ${
                activeTab === 'care' ? 'text-[#D97757]' : 'text-[#684431]/60 hover:text-[#684431]'
              }`}
            >
              Care & Washing
              {activeTab === 'care' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#D97757]" />}
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-3 text-sm font-bold whitespace-nowrap transition-colors relative ${
                activeTab === 'shipping' ? 'text-[#D97757]' : 'text-[#684431]/60 hover:text-[#684431]'
              }`}
            >
              Shipping & COD
              {activeTab === 'shipping' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#D97757]" />}
            </button>
          </div>

          <div className="text-xs sm:text-sm text-[#684431]/80 leading-relaxed space-y-3 font-sans">
            {activeTab === 'details' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#FFF8EF] p-4 rounded-xl border border-[#684431]/5">
                  <strong className="block text-[#684431] font-semibold mb-1">Yarn Composition:</strong>
                  <p>{product.yarnType || '100% Premium Soft Cotton Yarn'}</p>
                </div>
                <div className="bg-[#FFF8EF] p-4 rounded-xl border border-[#684431]/5">
                  <strong className="block text-[#684431] font-semibold mb-1">Dimensions:</strong>
                  <p>{product.dimensions || 'Handcrafted artisanal dimensions'}</p>
                </div>
              </div>
            )}

            {activeTab === 'cost' && product.costBreakdown && (
              <div className="space-y-3">
                <p className="text-xs text-[#684431]/80">
                  As an honest small artisan business, we believe in open pricing. Here is our direct cost calculation for making this piece:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                  <div className="bg-[#FFF8EF] p-3 rounded-xl border border-[#684431]/10">
                    <span className="text-[10px] text-[#684431]/60 uppercase">Wool / Yarn Cost</span>
                    <p className="font-price font-bold text-sm text-[#684431] mt-0.5">₹{product.costBreakdown.woolCost}</p>
                  </div>
                  <div className="bg-[#FFF8EF] p-3 rounded-xl border border-[#684431]/10">
                    <span className="text-[10px] text-[#684431]/60 uppercase">Artisan Labour</span>
                    <p className="font-price font-bold text-sm text-[#684431] mt-0.5">₹{product.costBreakdown.labourCost}</p>
                  </div>
                  <div className="bg-[#FFF8EF] p-3 rounded-xl border border-[#684431]/10">
                    <span className="text-[10px] text-[#684431]/60 uppercase">Packaging & Card</span>
                    <p className="font-price font-bold text-sm text-[#684431] mt-0.5">₹{product.costBreakdown.packagingCost}</p>
                  </div>
                  <div className="bg-[#FFF8EF] p-3 rounded-xl border border-[#684431]/10">
                    <span className="text-[10px] text-[#684431]/60 uppercase">Local Transport</span>
                    <p className="font-price font-bold text-sm text-[#684431] mt-0.5">₹{product.costBreakdown.petrolAllocation}</p>
                  </div>
                  <div className="bg-[#FFF2DE] p-3 rounded-xl border border-[#F7C948]">
                    <span className="text-[10px] text-[#684431]/70 uppercase font-semibold">Total Cost</span>
                    <p className="font-price font-bold text-sm text-[#684431] mt-0.5">₹{product.costBreakdown.totalCost}</p>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                    <span className="text-[10px] text-emerald-800 uppercase font-semibold">Margin / Reinvestment</span>
                    <p className="font-price font-bold text-sm text-emerald-800 mt-0.5">₹{product.costBreakdown.profitMargin}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'care' && (
              <div className="bg-[#FFF8EF] p-4 rounded-xl border border-[#684431]/5">
                <p className="mb-2">
                  {product.careInstructions || 'Hand wash gently in cool water with mild soap. Lay flat to air dry.'}
                </p>
                <p className="text-[#684431]/70">
                  Tip: Crochet items love gentle care! Store away from sharp objects to prevent snags.
                </p>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="bg-[#FFF8EF] p-4 rounded-xl border border-[#684431]/5 space-y-2">
                <p>
                  • <strong>Pan-India Shipping:</strong> Dispatched in 2-3 business days from Bengaluru. Free shipping on orders over ₹999; flat ₹60 standard shipping for orders below ₹999.
                </p>
                <p>
                  • <strong>Cash on Delivery (COD):</strong> Available with nominal ₹40 verification and collection fee.
                </p>
                <p>
                  • <strong>Prepaid Payments:</strong> 100% secure Razorpay UPI, Cards, NetBanking.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related products - only show other real launch items */}
        {relatedProducts.length > 0 && (
          <div className="mt-14">
            <h3 className="font-handwriting text-3xl font-bold text-[#684431] mb-6">
              Other Pieces in Our Launch Collection ♡
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
              {relatedProducts.map(rel => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
