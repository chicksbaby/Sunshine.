import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { CartDrawer } from './components/CartDrawer.js';

// Home Sections
import { HeroSection } from './components/home/HeroSection.js';
import { ShopByCategory } from './components/home/ShopByCategory.js';
import { BestsellersSection } from './components/home/BestsellersSection.js';
import { BrandStorySection } from './components/home/BrandStorySection.js';
import { CustomOrdersSection } from './components/home/CustomOrdersSection.js';
import { WhyShopWithUs } from './components/home/WhyShopWithUs.js';
import { ReviewsSection } from './components/home/ReviewsSection.js';
import { FaqSection } from './components/home/FaqSection.js';

// Subpages
import { ShopPage } from './pages/ShopPage.js';
import { ProductDetailPage } from './pages/ProductDetailPage.js';
import { CheckoutPage } from './pages/CheckoutPage.js';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage.js';
import { TrackOrderPage } from './pages/TrackOrderPage.js';
import { OurStoryPage } from './pages/OurStoryPage.js';
import { CustomOrdersPage } from './pages/CustomOrdersPage.js';
import { ContactPage } from './pages/ContactPage.js';
import { PoliciesPage } from './pages/PoliciesPage.js';
import { AdminDashboard } from './pages/AdminDashboard.js';

const MainContent: React.FC = () => {
  const { activePage, toastMessage, setActivePage } = useStore();

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return (
          <main>
            {/* Exact Homepage order specified in user prompt */}
            {/* 3. Hero section */}
            <HeroSection />

            {/* 4. Shop by Category */}
            <ShopByCategory />

            {/* 5. Bestsellers */}
            <BestsellersSection />

            {/* 6. Brand story */}
            <BrandStorySection />

            {/* 7. Custom Orders section */}
            <CustomOrdersSection />

            {/* 8. Why Shop With Us */}
            <WhyShopWithUs />

            {/* 9. Customer reviews */}
            <ReviewsSection />

            {/* 10. FAQ section */}
            <FaqSection />
          </main>
        );

      case 'shop':
      case 'products':
      case 'collections':
        return <ShopPage />;

      case 'product':
        return <ProductDetailPage />;

      case 'checkout':
        return <CheckoutPage />;

      case 'order-confirmation':
        return <OrderConfirmationPage />;

      case 'track-order':
        return <TrackOrderPage />;

      case 'our-story':
        return <OurStoryPage />;

      case 'custom-orders':
        return <CustomOrdersPage />;

      case 'contact':
        return <ContactPage />;

      case 'shipping-policy':
        return <PoliciesPage initialTab="shipping" />;

      case 'returns-policy':
        return <PoliciesPage initialTab="returns" />;

      case 'privacy-policy':
        return <PoliciesPage initialTab="privacy" />;

      case 'terms':
        return <PoliciesPage initialTab="terms" />;

      case 'admin':
        return <AdminDashboard />;

      default:
        return (
          <div className="py-24 bg-[#FFF8EF] min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <span className="text-5xl block mb-4">🧶</span>
            <h2 className="font-handwriting text-4xl sm:text-5xl font-bold text-[#684431]">
              Oops, yarn tangle! (404) ♡
            </h2>
            <p className="text-xs sm:text-sm text-[#684431]/70 max-w-sm mt-2 mb-6">
              We couldn't find the page you're searching for. Let's return to our cozy shop.
            </p>
            <button
              onClick={() => setActivePage('home')}
              className="px-6 py-3 bg-[#684431] text-white text-xs font-semibold rounded-full hover:bg-[#D97757] transition-colors"
            >
              Back to Sunshine Home
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8EF] text-[#684431]">
      {/* 1. Announcement bar & 2. Navigation bar are in Navbar */}
      <Navbar />

      <div className="flex-1">
        {renderPage()}
      </div>

      <Footer />
      <CartDrawer />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#684431] text-white px-5 py-3 rounded-2xl shadow-xl border border-[#F7C948]/30 flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <span className="text-base">🌼</span>
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
