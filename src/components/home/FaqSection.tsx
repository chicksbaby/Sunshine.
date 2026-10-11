import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      q: 'Do you offer Cash on Delivery (COD) across India?',
      a: 'Yes! We offer Cash on Delivery for eligible pincodes across India on orders up to ₹3,000. A nominal COD handling fee of ₹40 is added to cover reverse-logistics verification. You can also pay securely online via UPI, Cards, or Net Banking.'
    },
    {
      q: 'How long does dispatch and delivery take?',
      a: 'Since every item is hand-crocheted in small batches, dispatch takes 2 to 3 business days. Delivery across major Indian cities takes 3 to 5 business days thereafter via BlueDart, Delhivery, or India Post Express. You will receive an SMS and tracking number.'
    },
    {
      q: 'What kind of yarn and materials do you use?',
      a: 'We use premium 100% milk cotton yarn and combed summer cotton yarn. They are super soft, hypoallergenic, breathable, and colorfast. Stems in our crochet flowers use flexible plastic-coated floral wire so you can bend and style them easily.'
    },
    {
      q: 'How do I clean and care for my handmade crochet pieces?',
      a: 'For bags, coasters, and wearables, gently hand-wash in cold water with a mild liquid detergent. Never wring or machine spin. Simply lay flat on a dry towel in shade. For crochet flowers, dusting with a soft makeup brush or cool hairdryer keeps them pristine.'
    },
    {
      q: 'Can I request custom colors or personalized greeting notes?',
      a: 'Absolutely! You can leave custom notes during checkout, fill out our Custom Orders form, or message us directly on WhatsApp. Every order can include a complimentary handwritten gift card.'
    }
  ];

  return (
    <section className="py-14 sm:py-20 bg-[#FFF8EF]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D97757] uppercase tracking-wider mb-2">
            <span>❓</span>
            <span>Common Questions</span>
          </div>
          <h2 className="font-handwriting text-4xl sm:text-5xl font-bold text-[#684431]">
            Frequently Asked Questions <span className="text-[#F3A59B]">♡</span>
          </h2>
          <p className="text-sm text-[#684431]/75 mt-2 font-sans">
            Everything you need to know about placing orders, shipping, and handmade care.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#684431]/10 overflow-hidden shadow-2xs transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-sans font-semibold text-sm sm:text-base text-[#684431] hover:text-[#D97757] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#D97757]' : 'text-[#684431]/40'}`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-[#684431]/80 font-sans leading-relaxed border-t border-[#684431]/5 bg-[#FFF8EF]/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
