import React from 'react';
import { Product } from '../types/index.js';
import { useStore } from '../context/StoreContext.js';
import { ShoppingBag, Clock, MessageCircle, Sparkles } from 'lucide-react';
import { resolveProductImage, DEFAULT_FALLBACK_IMAGE } from '../utils/imageUtils.js';
import { createWhatsAppProductOrderUrl } from '../utils/whatsapp.js';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setActivePage, settings } = useStore();

  const handleCardClick = () => {
    setActivePage('product', product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const whatsappUrl = createWhatsAppProductOrderUrl({
    productName: product.name,
    price: product.price,
    quantity: 1,
    selectedColor: product.colors?.[0]?.name,
    whatsappNumber: settings?.whatsappNumber,
  });

  const handleBuyNowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const imageUrl = resolveProductImage(product.images?.[0]);

  return (
    <div 
      onClick={handleCardClick}
      className="group bg-white rounded-3xl p-4 border border-[#684431]/10 shadow-xs hover:shadow-xl hover:border-[#F7C948]/50 transition-all duration-300 flex flex-col justify-between cursor-pointer relative"
    >
      <div>
        {/* Product Image Wrapper */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#FFF8EF] mb-3">
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src !== DEFAULT_FALLBACK_IMAGE) {
                target.src = DEFAULT_FALLBACK_IMAGE;
              }
            }}
          />

          {/* Genuine Authentic Handmade Tag */}
          <div className="absolute top-2.5 left-2.5">
            <span className="bg-[#FFF8EF]/95 backdrop-blur-xs text-[#684431] text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-2xs border border-[#684431]/15">
              Handmade ♡
            </span>
          </div>

          {product.inStock && (
            <div className="absolute top-2.5 right-2.5">
              <span className="bg-emerald-500/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                In Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-1.5">
          {/* Category & Making Time */}
          <div className="flex items-center justify-between text-xs text-[#684431]/60">
            <span className="font-semibold text-[#D97757] uppercase tracking-wider text-[11px]">{product.category}</span>
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

          {/* Product Description brief excerpt */}
          {product.description && (
            <p className="text-[11px] text-[#684431]/70 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}

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

      {/* Price, Action Buttons & Enquiry Note */}
      <div className="pt-3 mt-3 border-t border-[#684431]/5 space-y-2.5">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-[10px] text-[#684431]/50 block leading-tight">Price</span>
            <span className="font-price font-bold text-lg text-[#684431]">
              ₹{product.price}
            </span>
          </div>
          <span className="text-[10px] text-[#684431]/60 font-medium">
            Handcrafted in India
          </span>
        </div>

        {/* Both Buy Now & Add to Cart Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {/* Buy Now Button (WhatsApp Order) */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleBuyNowClick}
            className="py-2.5 px-3 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-95 text-center group/btn"
            title="Buy Now via WhatsApp"
          >
            <MessageCircle size={14} className="shrink-0" />
            <span className="whitespace-nowrap">Buy Now</span>
          </a>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="py-2.5 px-3 bg-[#684431] hover:bg-[#D97757] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 active:scale-95 text-center"
            title="Add to basket"
          >
            <ShoppingBag size={14} className="shrink-0" />
            <span className="whitespace-nowrap">Add to Cart</span>
          </button>
        </div>

        {/* Clear Explanation that order is an enquiry until seller confirms */}
        <p className="text-[10px] text-[#684431]/60 text-center leading-tight">
          💬 WhatsApp order enquiry • Confirmed by seller
        </p>
      </div>
    </div>
  );
};
