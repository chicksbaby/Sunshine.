import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.js';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  Heart, 
  Package, 
  Sparkles, 
  ShieldCheck,
  User,
  ExternalLink
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    cartItemCount, 
    setIsCartOpen, 
    activePage, 
    setActivePage, 
    setSelectedCategory,
    searchQuery,
    setSearchQuery 
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [localSearch, setLocalSearch] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchQuery(localSearch.trim());
      setActivePage('shop');
      setShowSearchModal(false);
      setLocalSearch('');
    }
  };

  const navLinks = [
    { name: 'Home', page: 'home' },
    { name: 'Shop All', page: 'shop' },
    { name: 'Collections', page: 'collections' },
    { name: 'Custom Orders', page: 'custom-orders' },
    { name: 'Our Story', page: 'our-story' },
    { name: 'Track Order', page: 'track-order' },
    { name: 'Contact', page: 'contact' },
  ];

  return (
    <>
      {/* 1. Announcement Bar */}
      <div className="bg-[#F7C948] text-[#684431] text-xs sm:text-sm font-medium py-1.5 px-4 text-center border-b border-[#F3A59B]/40 relative overflow-hidden">
        <div className="flex items-center justify-center gap-2">
          <span>✨</span>
          <span className="font-semibold tracking-wide">Little things, handmade with love ♡</span>
          <span className="hidden md:inline text-[#684431]/70">| Free Pan-India shipping on orders over ₹999</span>
          <span>🌼</span>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#FFF8EF]/95 backdrop-blur-md border-b border-[#684431]/10 transition-shadow duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Mobile Hamburger Button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#684431] hover:text-[#E76F51] rounded-lg focus:outline-none"
                aria-label="Open menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Brand Logo */}
            <div 
              onClick={() => setActivePage('home')}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <div className="w-11 h-11 rounded-full bg-[#F7C948] flex items-center justify-center shadow-sm border-2 border-[#FFF8EF] ring-2 ring-[#F7C948]/50 group-hover:rotate-12 transition-transform duration-300">
                <span className="text-xl">🌼</span>
              </div>
              <div>
                <h1 className="font-handwriting text-3xl sm:text-4xl leading-none text-[#684431] font-bold group-hover:text-[#D97757] transition-colors">
                  sunshine squares <span className="text-[#F3A59B]">♡</span>
                </h1>
                <p className="text-[10px] sm:text-[11px] tracking-widest uppercase font-semibold text-[#684431]/70 mt-0.5">
                  Handmade Crochet with Love
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navLinks.map((link) => (
                <button
                  key={link.page}
                  onClick={() => setActivePage(link.page)}
                  className={`text-sm font-medium transition-colors hover:text-[#D97757] relative py-1 ${
                    activePage === link.page
                      ? 'text-[#D97757] font-semibold'
                      : 'text-[#684431]'
                  }`}
                >
                  {link.name}
                  {activePage === link.page && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F7C948] rounded-full" />
                  )}
                </button>
              ))}
            </nav>

            {/* Action Buttons: Search, Admin, Cart */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Search Button */}
              <button
                onClick={() => setShowSearchModal(true)}
                className="p-2.5 text-[#684431] hover:text-[#D97757] hover:bg-[#FFF2DE] rounded-full transition-colors"
                title="Search crochet items"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Order Tracking Quick Link */}
              <button
                onClick={() => setActivePage('track-order')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#684431] bg-[#FFF2DE] hover:bg-[#FFE8C8] rounded-full border border-[#F7C948]/40 transition-colors"
                title="Track your order"
              >
                <Package size={14} className="text-[#D97757]" />
                <span>Track</span>
              </button>

              {/* Admin Portal Button */}
              <button
                onClick={() => setActivePage('admin')}
                className="p-2.5 text-[#684431] hover:text-[#D97757] hover:bg-[#FFF2DE] rounded-full transition-colors"
                title="Sibling Admin Portal"
                aria-label="Admin Portal"
              >
                <User size={20} />
              </button>

              {/* Cart Button with Count Badge */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 bg-[#684431] text-[#FFF8EF] hover:bg-[#D97757] rounded-full shadow-sm transition-all duration-200 transform hover:scale-105"
                aria-label="Shopping Cart"
              >
                <ShoppingBag size={20} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#F7C948] text-[#684431] font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#FFF8EF] shadow-sm animate-pulse">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FFF8EF] border-b border-[#684431]/10 px-4 pt-2 pb-6 space-y-2 shadow-lg">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => {
                  setActivePage(link.page);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${
                  activePage === link.page
                    ? 'bg-[#F7C948]/30 text-[#684431] font-semibold'
                    : 'text-[#684431] hover:bg-[#FFF2DE]'
                }`}
              >
                {link.name}
              </button>
            ))}

            <div className="pt-2 border-t border-[#684431]/10 flex gap-2">
              <button
                onClick={() => {
                  setActivePage('admin');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 px-3 text-xs text-center font-medium bg-[#FFF2DE] rounded-lg text-[#684431]"
              >
                Admin Dashboard
              </button>
              <button
                onClick={() => {
                  setActivePage('track-order');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 px-3 text-xs text-center font-medium bg-[#F7C948]/40 rounded-lg text-[#684431]"
              >
                Track My Order
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-[#684431]/40 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
          <div className="bg-[#FFF8EF] w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-[#F7C948]/30 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-handwriting text-2xl font-bold text-[#684431]">Search Sunshine Squares ♡</h3>
              <button
                onClick={() => setShowSearchModal(false)}
                className="p-1 text-[#684431]/60 hover:text-[#684431]"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search strawberry keychain, wristlet, hanging charm..."
                className="w-full pl-11 pr-4 py-3 bg-white rounded-xl border border-[#684431]/20 text-[#684431] placeholder-[#684431]/40 focus:outline-none focus:ring-2 focus:ring-[#F7C948]"
                autoFocus
              />
              <Search size={20} className="absolute left-3.5 top-3.5 text-[#684431]/50" />
              <button
                type="submit"
                className="absolute right-2 top-2 px-4 py-1.5 bg-[#684431] text-white text-xs font-medium rounded-lg hover:bg-[#D97757] transition-colors"
              >
                Search
              </button>
            </form>

            <div className="mt-4">
              <p className="text-xs text-[#684431]/70 font-medium mb-2">Handmade collection pieces:</p>
              <div className="flex flex-wrap gap-1.5">
                {['Strawberry Keychain', 'White Flower Wristlet', 'Double Flower Hanging Charm'].map(term => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setSearchQuery(term);
                      setActivePage('shop');
                      setShowSearchModal(false);
                    }}
                    className="text-xs px-3 py-1 bg-white hover:bg-[#F7C948]/20 border border-[#684431]/15 rounded-full text-[#684431] transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
