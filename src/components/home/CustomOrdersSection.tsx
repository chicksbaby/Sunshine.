import React from 'react';
import { useStore } from '../../context/StoreContext.js';
import { Palette, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';

export const CustomOrdersSection: React.FC = () => {
  const { setActivePage } = useStore();

  return (
    <section className="py-12 sm:py-16 bg-[#FFF2DE]/50 border-t border-[#F7C948]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-linear-to-br from-[#FFF8EF] via-white to-[#FFF2DE] rounded-3xl p-6 sm:p-10 border-2 border-dashed border-[#F7C948] shadow-sm relative overflow-hidden">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            <div className="md:col-span-8 space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F7C948]/30 rounded-full text-xs font-bold text-[#684431]">
                <Palette size={14} className="text-[#D97757]" />
                <span>Personalized Creations</span>
              </div>

              <h2 className="font-handwriting text-3xl sm:text-4xl lg:text-5xl font-bold text-[#684431]">
                Want Something Custom Made? <span className="text-[#F3A59B]">♡</span>
              </h2>

              <p className="text-sm sm:text-base text-[#684431]/80 max-w-2xl font-sans leading-relaxed">
                Have a favorite color combination in mind? Need a customized wedding bouquet with specific flower stems, personalized anniversary coasters, or a custom-sized tote? We delight in bringing your crochet ideas to life!
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                <button
                  onClick={() => setActivePage('custom-orders')}
                  className="px-6 py-3.5 bg-[#D97757] hover:bg-[#E76F51] text-white text-sm font-semibold rounded-2xl shadow-md transition-all flex items-center gap-2"
                >
                  <span>Submit Custom Order Form</span>
                  <ArrowRight size={16} />
                </button>

                <a
                  href="https://wa.me/919876543210?text=Hi%20Sunshine%20Squares!%20I%20would%20love%20to%20discuss%20a%20custom%20crochet%20order%20♡"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] text-sm font-semibold rounded-2xl border border-[#25D366]/30 transition-colors flex items-center gap-2"
                >
                  <MessageCircle size={18} />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="md:col-span-4 flex justify-center">
              <div className="w-full max-w-xs bg-white rounded-2xl p-4 shadow-md border border-[#684431]/10 text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#FFF2DE] flex items-center justify-center text-3xl">
                  🧶
                </div>
                <h4 className="font-handwriting text-2xl font-bold text-[#684431]">
                  How Custom Works:
                </h4>
                <ul className="text-xs text-[#684431]/80 space-y-2 text-left">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-[#D97757]">1.</span>
                    <span>Tell us your colors, design inspiration & target date.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-[#D97757]">2.</span>
                    <span>We confirm yarn shades & estimated price in 24 hours.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-[#D97757]">3.</span>
                    <span>We crochet, wrap, and ship across India with tracking!</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
