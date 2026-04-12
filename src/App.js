import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import CitySelection from "./pages/CitySelection/CitySelection";
import HomePage from "./pages/HomePage/HomePage";
import RestaurantsPage from "./pages/RestaurantsPage/RestaurantsPage";
import RestaurantDetailPage from "./pages/RestaurantDetailPage/RestaurantDetailPage";
import CartPage from "./pages/CartPage/CartPage";
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage";
import "./app.scss";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent = () => {
  const { city } = useApp();
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  if (!city && !isLandingPage) {
    return <CitySelection />;
  }

  return (
    <Routes>
      <Route path="/" element={city ? <HomePage /> : <CitySelection />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/restaurants" element={<RestaurantsPage />} />
      <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AppProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </AppProvider>
  );
};

export default App;
