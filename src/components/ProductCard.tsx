import React from 'react';
import { Product } from '../types/index.js';
import { useStore } from '../context/StoreContext.js';
import { ShoppingBag, Clock, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setActivePage } = useStore();

  const handleCardClick = () => {
    setActivePage('product', product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group bg-white rounded-3xl p-3.5 border border-[#684431]/10 shadow-xs hover:shadow-xl hover:border-[#F7C948]/50 transition-all duration-300 flex flex-col justify-between cursor-pointer relative"
    >
      <div>
        {/* Product Image Wrapper */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#FFF8EF] mb-3">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />

          {/* Genuine Authentic Handmade Tag */}
          <div className="absolute top-2.5 left-2.5">
            <span className="bg-[#FFF8EF]/90 backdrop-blur-xs text-[#684431] text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-2xs border border-[#684431]/10">
              Handmade ♡
            </span>
          </div>
        </div>

        {/* Product Information */}
        <div className="space-y-1.5">
          {/* Category & Making Time */}
          <div className="flex items-center justify-between text-xs text-[#684431]/60">
            <span className="font-medium text-[#D97757]">{product.category}</span>
            {product.makingTime && (
              <span className="flex items-center gap-1 text-[11px] text-[#684431]/60">
                <Clock size={11} />
                <span>{product.makingTime}</span>
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3 className="font-sans font-semibold text-sm sm:text-base text-[#684431] group-hover:text-[#D97757] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Color swatch indicator if present */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 pt-0.5">
              {product.colors.map((c, i) => (
                <span
                  key={i}
                  className="w-2.5 h-2.5 rounded-full border border-black/10 shadow-2xs"
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
              <span className="text-[10px] text-[#684431]/50 ml-0.5">
                {product.colors[0]?.name}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Price & Add to Cart Action */}
      <div className="pt-3 mt-3 border-t border-[#684431]/5 flex items-center justify-between gap-2">
        <div>
          <span className="text-[10px] text-[#684431]/50 block leading-tight">Price</span>
          <span className="font-price font-bold text-base sm:text-lg text-[#684431]">
            ₹{product.price}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          className="px-3.5 py-2 bg-[#684431] hover:bg-[#D97757] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 active:scale-95"
          title="Add to cart"
        >
          <ShoppingBag size={13} />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};
