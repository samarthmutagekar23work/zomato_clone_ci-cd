import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import RestaurantsList from './pages/RestaurantsList';
import RestaurantDetail from './pages/RestaurantDetail';
import SearchPage from './pages/SearchPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import TrackOrder from './pages/TrackOrder';
import ProfilePage from './pages/ProfilePage';
import { ToastProvider, ToastContext } from './context/ToastContext';

const Router = () => {
  const [hash, setHash] = useState(() => window.location.hash || '#/');
  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const getComponent = () => {
    if (hash.startsWith('#/restaurant/')) return RestaurantDetail;
    if (hash.startsWith('#/restaurants')) return RestaurantsList;
    if (hash === '#/search') return SearchPage;
    if (hash === '#/cart') return CartPage;
    if (hash === '#/checkout') return CheckoutPage;
    if (hash.startsWith('#/track/')) return TrackOrder;
    if (hash === '#/profile') return ProfilePage;
    return HomePage;
  };

  const Component = getComponent();
  return <Component />;
};

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'}>
      <ToastProvider>
        <NavBar />
        <Router />
      </ToastProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
export { ToastContext };
