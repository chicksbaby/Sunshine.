import React, { useState, useEffect } from 'react';
import { CustomerReview } from '../../types/index.js';
import { Star, CheckCircle, Heart, MessageCircle } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => {
        setReviews(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setReviews([]);
        setLoading(false);
      });
  }, []);

  if (loading) return null;

  return (
    <section className="py-12 sm:py-16 bg-[#FFF2DE]/30 border-t border-[#F7C948]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D97757] uppercase tracking-wider mb-2">
            <span>💌</span>
            <span>Customer Feedback</span>
          </div>
          <h2 className="font-handwriting text-4xl sm:text-5xl font-bold text-[#684431]">
            Verified Customer Reviews <span className="text-[#F3A59B]">♡</span>
          </h2>
          <p className="text-sm text-[#684431]/75 mt-2 font-sans">
            We only display 100% genuine reviews from verified buyers who purchased our handmade crochet pieces.
          </p>
        </div>

        {reviews.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 max-w-2xl mx-auto border border-[#684431]/10 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#FFF2DE] text-[#D97757] flex items-center justify-center mx-auto text-xl">
              🌼
            </div>
            <h3 className="font-handwriting text-2xl font-bold text-[#684431]">
              Launching Our First Edition Pieces ♡
            </h3>
            <p className="text-xs sm:text-sm text-[#684431]/80 leading-relaxed font-sans">
              As a homegrown sibling studio in India launching with our first three curated designs, we never generate fake reviews or paid testimonials.
            </p>
            <p className="text-xs text-[#684431]/60 font-sans">
              Once you receive your handmade strawberry keychain, white flower wristlet, or double flower charm, share your unboxing feedback with us!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-3xl p-6 border border-[#684431]/10 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-[#F7C948]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" />
                      ))}
                    </div>
                    {rev.verifiedBuyer && (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        <CheckCircle size={10} />
                        <span>Verified Buyer</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-[#684431]/80 font-sans italic leading-relaxed mb-4">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-[#684431]/10 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#684431]">{rev.author}</h4>
                    <p className="text-[10px] text-[#684431]/50">{rev.location}</p>
                  </div>
                  <span className="text-[10px] text-[#D97757] font-medium bg-[#FFF8EF] px-2 py-1 rounded-md text-right max-w-[110px] truncate" title={rev.productName}>
                    {rev.productName}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
