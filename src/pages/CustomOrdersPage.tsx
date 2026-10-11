import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.js';
import { Palette, MessageCircle, Send, CheckCircle2, Heart, Sparkles } from 'lucide-react';

export const CustomOrdersPage: React.FC = () => {
  const { showToast } = useStore();
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [preferredColors, setPreferredColors] = useState('');
  const [occasion, setOccasion] = useState('Birthday Gift');
  const [budgetRange, setBudgetRange] = useState('₹500 - ₹1,500');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !mobile.trim() || !description.trim()) {
      showToast('Please fill in required fields');
      return;
    }
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/custom-inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          mobile,
          email,
          preferredColors,
          occasion,
          budgetRange,
          description
        })
      });
      if (res.ok) {
        setSubmitted(true);
        showToast('Custom request received! We will WhatsApp you within 24 hours ♡');
      } else {
        showToast('Failed to submit inquiry. Please try WhatsApp directly.');
      }
    } catch {
      showToast('Network error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-10 sm:py-16 bg-[#FFF8EF] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#FFF2DE] flex items-center justify-center text-3xl mb-3 shadow-inner">
            🎨
          </div>
          <h1 className="font-handwriting text-4xl sm:text-5xl font-bold text-[#684431]">
            Custom Crochet Creations <span className="text-[#F3A59B]">♡</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#684431]/80 max-w-xl mx-auto mt-2 font-sans">
            Dreaming of a bespoke floral bouquet, custom tote bag dimensions, or customized anniversary colors? Let us handcraft it specially for you!
          </p>
        </div>

        {submitted ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#684431]/10 shadow-sm text-center max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl">
              ✓
            </div>
            <h3 className="font-handwriting text-3xl font-bold text-[#684431]">
              Thank You! We Received Your Request ♡
            </h3>
            <p className="text-xs sm:text-sm text-[#684431]/80 font-sans leading-relaxed">
              We will review your requested colors and design, calculate yarn skein requirements, and send you a photo quote on WhatsApp at <strong>+91 {mobile}</strong> within 24 hours.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/919876543210?text=Hi%20Sunshine%20Squares!%20I%20just%20submitted%20a%20custom%20order%20request%20under%20the%20name%20${encodeURIComponent(fullName)}.%20Looking%20forward%20to%20coordinating!`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white text-xs font-semibold rounded-2xl shadow-xs"
              >
                <MessageCircle size={16} />
                <span>Chat Now on WhatsApp</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#684431]/10 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#684431] mb-1">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Radhika Sen"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#684431]/20 bg-[#FFF8EF] focus:outline-none focus:ring-1 focus:ring-[#F7C948]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#684431] mb-1">
                    WhatsApp Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                    placeholder="9876543210"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#684431]/20 bg-[#FFF8EF] focus:outline-none focus:ring-1 focus:ring-[#F7C948]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#684431] mb-1">
                    Occasion / Target Date
                  </label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#684431]/20 bg-[#FFF8EF]"
                  >
                    <option value="Birthday Gift">Birthday Gift</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Baby Shower / Nursery">Baby Shower / Nursery</option>
                    <option value="Self Love Treat">Self Love Treat</option>
                    <option value="Bridal / Wedding Favors">Bridal / Wedding Favors</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#684431] mb-1">
                    Estimated Budget Range
                  </label>
                  <select
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#684431]/20 bg-[#FFF8EF]"
                  >
                    <option value="Under ₹500">Under ₹500 (Charms / Keychains)</option>
                    <option value="₹500 - ₹1,200">₹500 - ₹1,200 (Bags / Coaster sets)</option>
                    <option value="₹1,200 - ₹2,500">₹1,200 - ₹2,500 (Custom Bouquet / Wearables)</option>
                    <option value="₹2,500+">₹2,500+ (Large Cardigans / Bulk favors)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#684431] mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="radhika@example.com"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#684431]/20 bg-[#FFF8EF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#684431] mb-1">
                  Preferred Color Palette
                </label>
                <input
                  type="text"
                  value={preferredColors}
                  onChange={(e) => setPreferredColors(e.target.value)}
                  placeholder="e.g. Pastel lavender, sage green, and buttercup yellow"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#684431]/20 bg-[#FFF8EF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#684431] mb-1">
                  Describe Your Dream Piece in Detail <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us what you'd love: e.g. 'I want a 7-stem bouquet with 2 sunflowers, 2 pink tulips, 1 lavender sprig, and 2 white daisies with a handwritten card for my sister's convocation on October 25th.'"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#684431]/20 bg-[#FFF8EF] focus:outline-none focus:ring-1 focus:ring-[#F7C948]"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#D97757] hover:bg-[#E76F51] text-white text-xs font-semibold rounded-2xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send size={14} />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Custom Request ♡'}</span>
                </button>

                <a
                  href="https://wa.me/919876543210?text=Hi%20Sunshine%20Squares!%20I%20would%20love%20to%20discuss%20a%20custom%20crochet%20order%20♡"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-[#128C7E] flex items-center gap-1.5 hover:underline"
                >
                  <MessageCircle size={16} />
                  <span>Or talk to us immediately on WhatsApp</span>
                </a>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
