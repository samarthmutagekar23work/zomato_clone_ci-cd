import React, { useState } from 'react';
import { safeStorage } from '../utils/helpers';
import { CITIES } from '../utils/constants';

const NavBar = () => {
  const [city, setCity] = useState(() => safeStorage.get('zomato_city') || 'Bangalore');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [cart] = useState(() => safeStorage.getJSON('zomato_cart', { items: [] }));

  const cartCount = cart.items.reduce((sum, i) => sum + i.qty,0);

  return (
    <>
      <nav className="navbar">
        {/* Logo */}
        <div className="nav-logo" onClick={() => window.location.hash = '#/'}>
          <span className="logo-text">zomato</span>
          <span className="logo-dot">.</span>
        </div>

        {/* Right Nav */}
        <div className="nav-links">
          <button className="nav-location-btn" onClick={() => setShowLocationModal(true)}>
            <span className="nav-icon">📍</span>
            <span className="nav-text">{city}</span>
            <span className="nav-chevron">▼</span>
          </button>
          
          <a href="#/profile" className="nav-link">
            <span className="nav-icon">👤</span>
            <span className="nav-text">Profile</span>
          </a>
          
          <div className="nav-cart" onClick={() => window.location.hash = '#/cart'}>
            <span className="cart-icon">🛒</span>
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </div>
        </div>
      </nav>

      {/* Location Modal - Full List */}
      {showLocationModal && (
        <div className="modal-overlay" onClick={() => setShowLocationModal(false)}>
          <div className="modal-content location-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Select Your City</h3>
              <button className="modal-close" onClick={() => setShowLocationModal(false)}>✕</button>
            </div>
            <div className="city-list-modal">
              {CITIES.map(c => (
                <div key={c} className={`city-list-item ${city === c ? 'city-selected' : ''}`} onClick={() => {
                  safeStorage.set('zomato_city', c);
                  setCity(c);
                  setShowLocationModal(false);
                  window.location.hash = '#/restaurants';
                }}>
                  <span className="city-list-icon">📍</span>
                  <span className="city-list-name">{c}</span>
                  {city === c && <span className="city-selected-check">✓</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
