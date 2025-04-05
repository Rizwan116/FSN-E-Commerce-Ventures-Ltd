// App.js
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import HeaderBar from "./Header";
import Home from "./Home";
import AboutUs from "./AboutUs";
import Shop from "./Shop";
import Blog from "./Blog";
import Account from "./pages/Account";
import TrackOrder from "./pages/TrackOrder";
import Subscription from "./pages/Subscription";
import RoyalRewards from "./pages/RoyalRewards";
import BeautyConcierge from "./pages/BeautyConcierge";
import Refer from "./pages/Refer";
import FAQs from "./pages/FAQs";
import Contact from "./pages/Contact";
import Accessibility from "./pages/Accessibility";
import OurStory from "./pages/OurStory";
import Press from "./pages/Press";
import Records from "./pages/Records";
import StoreLocator from "./pages/StoreLocator";
import NotFound from "./NotFound";
import ScrollToTop from "./ScrollToTop";
import Footer from "./Footer";
import CartPage from "./CartPage"; // 👈 import this at the top

function App() {
  const location = useLocation(); // ✅ useLocation must be inside a Router (it's in index.js)

  return (
    <div className="App">
      <AnimatePresence mode="wait">
        <ScrollToTop /> {/* 🚀 Scrolls to top on every route change */}
        <HeaderBar />
        <ToastContainer />

        <div className="content">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/aboutUs" element={<AboutUs />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/account" element={<Account />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/royal-rewards" element={<RoyalRewards />} />
            <Route path="/concierge" element={<BeautyConcierge />} />
            <Route path="/refer" element={<Refer />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/accessibility" element={<Accessibility />} />
            <Route path="/our-story" element={<OurStory />} />
            <Route path="/press" element={<Press />} />
            <Route path="/records" element={<Records />} />
            <Route path="/store-locator" element={<StoreLocator />} />
            <Route path="*" element={<NotFound />} /> {/* Catch-all 404 */}
            <Route path="/cart" element={<CartPage />} />

          </Routes>
        </div>

        <Footer />
      </AnimatePresence>
    </div>
  );
}

export default App;
