import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.js';
import { 
  Instagram, 
  MessageCircle, 
  Mail, 
  MapPin, 
  Heart, 
  Send, 
  Truck, 
  CreditCard 
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActivePage, showToast, setSelectedCategory } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      showToast('Welcome to Sunshine Squares family! Use code SUNSHINE10 at checkout ♡');
      setNewsletterEmail('');
    }
  };

  const instagramPosts = [
    {
      img: '/images/strawberry-keychain.jpg',
      caption: 'Strawberry Keychains stitched with love 🍓'
    },
    {
      img: '/images/white-flower-wristlet.jpg',
      caption: 'White Flower Wristlets on warm linen 🌼'
    },
    {
      img: '/images/double-flower-hanging-charm.jpg',
      caption: 'Double Flower Hanging Charms for sunny spaces ✨'
    }
  ];

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setActivePage('shop');
  };

  return (
    <footer className="bg-[#684431] text-[#FFF8EF] pt-14 pb-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Instagram Gallery Grid - using the authentic handmade photos */}
        <div className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 text-center sm:text-left">
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-[#F7C948] font-semibold tracking-wider uppercase">
                <Instagram size={14} />
                <span>@sunshinesquares.in</span>
              </div>
              <h3 className="font-handwriting text-3xl sm:text-4xl font-bold text-white mt-0.5">
                From Our Studio to Your Feed ♡
              </h3>
            </div>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 sm:mt-0 text-xs font-semibold text-[#F7C948] hover:text-white transition-colors underline"
            >
              Follow along on Instagram →
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {instagramPosts.map((post, idx) => (
              <div
                key={idx}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-[#533525] border border-white/10"
              >
                <img
                  src={post.img}
                  alt={post.caption}
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
                <div className="absolute inset-0 bg-[#684431]/70 opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex items-center justify-center text-center">
                  <p className="text-xs text-white leading-tight font-sans">
                    {post.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Signup Banner */}
        <div className="bg-[#563625] rounded-3xl p-6 sm:p-8 mb-12 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h4 className="font-handwriting text-3xl font-bold text-[#F7C948]">
              Join the Sunshine Family ♡
            </h4>
            <p className="text-xs sm:text-sm text-white/80 max-w-md mt-1 font-sans">
              Get secret preview drops and 10% off your first handmade order with code <strong>SUNSHINE10</strong>.
            </p>
          </div>

          <div className="w-full md:w-auto">
            {newsletterSubscribed ? (
              <div className="bg-[#F7C948]/20 border border-[#F7C948]/40 px-5 py-3 rounded-2xl text-xs text-[#F7C948] font-medium text-center">
                ✨ Thank you! Coupon code <strong>SUNSHINE10</strong> is active for you!
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2 w-full max-w-md">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="px-4 py-3 bg-white/10 rounded-xl text-xs text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#F7C948] flex-1"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-[#F7C948] hover:bg-[#F3A59B] text-[#684431] font-bold text-xs rounded-xl transition-colors shrink-0 flex items-center gap-1.5"
                >
                  <span>Subscribe</span>
                  <Send size={12} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-white/10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌼</span>
              <span className="font-handwriting text-3xl font-bold text-white">
                sunshine squares <span className="text-[#F3A59B]">♡</span>
              </span>
            </div>
            <p className="text-xs text-white/70 max-w-sm font-sans leading-relaxed">
              "Handmade with Love, Made for Brighter Days ♡"
              A homegrown small craft studio run by two siblings in India, handcrafting durable, joyful crochet pieces stitch by stitch.
            </p>

            <div className="space-y-1.5 text-xs text-white/80 font-sans">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-[#F7C948]" />
                <span>Indiranagar, Bengaluru, Karnataka, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-[#F7C948]" />
                <span>hello@sunshinesquares.in</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle size={14} className="text-[#F7C948]" />
                <span>WhatsApp: +91 98765 43210</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#F7C948]">
              Explore
            </h5>
            <ul className="space-y-2 text-xs text-white/75 font-sans">
              <li>
                <button onClick={() => setActivePage('shop')} className="hover:text-white transition-colors">
                  Shop All Products
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('custom-orders')} className="hover:text-white transition-colors">
                  Custom Orders
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('our-story')} className="hover:text-white transition-colors">
                  Our Sibling Story
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('track-order')} className="hover:text-white transition-colors">
                  Track Your Parcel
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('contact')} className="hover:text-white transition-colors">
                  Contact Studio
                </button>
              </li>
            </ul>
          </div>

          {/* Real Category Links */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#F7C948]">
              Collections
            </h5>
            <ul className="space-y-2 text-xs text-white/75 font-sans">
              <li>
                <button onClick={() => handleCategoryClick('Crochet Keychains')} className="hover:text-white transition-colors">
                  Crochet Keychains
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('Crochet Accessories')} className="hover:text-white transition-colors">
                  Crochet Accessories
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('Hanging Charms')} className="hover:text-white transition-colors">
                  Hanging Charms
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#F7C948]">
              Help & Policies
            </h5>
            <ul className="space-y-2 text-xs text-white/75 font-sans">
              <li>
                <button onClick={() => setActivePage('shipping-policy')} className="hover:text-white transition-colors">
                  Shipping Policy
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('returns-policy')} className="hover:text-white transition-colors">
                  Cancellation & Returns
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('privacy-policy')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('terms')} className="hover:text-white transition-colors">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('admin')} className="text-white/40 hover:text-[#F7C948] transition-colors">
                  Artisan Admin Login
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60 font-sans">
          <p>
            © {new Date().getFullYear()} Sunshine Squares. Handcrafted with love in India ♡
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[11px] bg-white/10 px-2.5 py-1 rounded-md text-white/80">UPI / GPay / PhonePe</span>
            <span className="text-[11px] bg-white/10 px-2.5 py-1 rounded-md text-white/80">Cards & NetBanking</span>
            <span className="text-[11px] bg-[#F7C948]/20 px-2.5 py-1 rounded-md text-[#F7C948]">Cash on Delivery (COD)</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
