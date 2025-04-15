// App.js
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom"; // ✅ No BrowserRouter here
import { AnimatePresence } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Import components
import CartPage from "./CartPage";
import Billing from "./Billing";
import { AuthProvider } from "./context/AuthContext";
import HeaderBar from "./Header";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";

import Home from "./Home";
import AboutUs from "./AboutUs";
import Shop from "./Shop";
import Blog from "./Blog";
import Account from "./pages/Account";
import TrackOrder from "./pages/TrackOrder";
import Subscription from "./pages/Subscription";
import RoyalRewards from "./pages/RoyalRewards";
import BeautyConcierge from "./pages/BeautyConcierge";
import OrderDetails from "./pages/OrderDetails";
import Refer from "./pages/Refer";
import FAQs from "./pages/FAQs";
import Contact from "./pages/Contact";
import Accessibility from "./pages/Accessibility";
import Blogs from "./pages/Blogs";
import Press from "./pages/Press";
import Records from "./pages/Records";
import StoreLocator from "./pages/StoreLocator";
import NotFound from "./NotFound";
import Signup from "./Signup";
import Login from "./Login";
import ForgetPassword from "./ForgetPassword";
import AdminPanel from "./AdminPanel";

// ✅ Separate location logic (needed for AnimatePresence)
const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <ScrollToTop />
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
          <Route path="/order-details" element={<OrderDetails />} />
          <Route path="/order-details/:orderId" element={<OrderDetails />} /> {/* ✅ Added dynamic route */}
          <Route path="/refer" element={<Refer />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/accessibility" element={<Accessibility />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/press" element={<Press />} />
          <Route path="/records" element={<Records />} />
          <Route path="/store-locator" element={<StoreLocator />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/adminpanel" element={<AdminPanel />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}

export default App;
