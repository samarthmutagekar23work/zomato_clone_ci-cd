import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { ToastContext } from '../context/ToastContext';

const ProfilePage = () => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('zomato_user') || '{"name":"Food Lover","phone":"","email":"","addresses":[]}'));
  const [orderHistory] = useState(() => {
    const order = JSON.parse(localStorage.getItem('zomato_order') || 'null');
    return order ? [order] : [];
  });
  const [loaded, setLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('zomato_google_token'));
  const [showLoginModal, setShowLoginModal] = useState(false);
  const addToast = React.useContext(ToastContext);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleSave = () => {
    localStorage.setItem('zomato_user', JSON.stringify(user));
    if (addToast) addToast('Profile updated!', 'success');
  };

  const handleGoogleSuccess = (credentialResponse) => {
    const token = credentialResponse.credential;
    localStorage.setItem('zomato_google_token', token);
    setIsLoggedIn(true);

    const payload = JSON.parse(atob(token.split('.')[1]));
    const newUser = {
      name: payload.name || user.name,
      phone: user.phone,
      email: payload.email || user.email,
      addresses: user.addresses || []
    };
    setUser(newUser);
    localStorage.setItem('zomato_user', JSON.stringify(newUser));
    setShowLoginModal(false);
    if (addToast) addToast('Logged in successfully!', 'success');
  };

  const handleGoogleError = () => {
    if (addToast) addToast('Google login failed. Please try again.', 'error');
  };

  const handleLogout = () => {
    localStorage.removeItem('zomato_google_token');
    setIsLoggedIn(false);
    if (addToast) addToast('Logged out successfully', 'info');
  };

  return (
    <div className="profile-page-wrapper">
      <div className="profile-bg-animation">
        <div className="profile-bg-orb profile-bg-orb-1"></div>
        <div className="profile-bg-orb profile-bg-orb-2"></div>
        <div className="profile-bg-orb profile-bg-orb-3"></div>
        
        {[...Array(10)].map((_, i) => (
          <div key={i} className="profile-float-food" style={{
            left: `${8 + i * 10}%`,
            animationDelay: `${i * 1.2}s`
          }}>
            {['🍕', '🍔', '🍜', '🥗', '🍛', '🍣', '🌮', '🍰', '🥘', '🍲'][i]}
          </div>
        ))}
      </div>

      {showLoginModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(5px)'
        }} onClick={() => setShowLoginModal(false)}>
          <div style={{
            backgroundColor: '#1E293B',
            borderRadius: '24px',
            padding: '40px',
            maxWidth: '450px',
            width: '90%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.1)',
            animation: 'fadeSlideUp 0.3s ease-out'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔐</div>
              <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 800, margin: '0 0 8px' }}>Login to Your Account</h2>
              <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>Sign in to access your orders, saved addresses and more</p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="filled_black"
                size="large"
                text="signin_with"
                shape="rectangular"
                width="100%"
              />
            </div>

            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#64748B', fontSize: '12px', margin: 0 }}>
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>

            <button 
              onClick={() => setShowLoginModal(false)}
              style={{
                marginTop: '16px',
                width: '100%',
                padding: '12px',
                backgroundColor: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '12px',
                color: '#94A3B8',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className={`profile-content ${loaded ? 'loaded' : ''}`}>
        <div className="profile-header-section">
          <h1 className="profile-page-title">
            <span className="profile-title-emoji">👤</span>
            My Profile
          </h1>
          <p className="profile-page-subtitle">Manage your account, addresses and order history</p>
        </div>
        
        <div className="profile-layout-grid">
          <div className="profile-column-left">
            <div className="profile-card profile-sidebar-card" style={{ animationDelay: '0.1s' }}>
              <div className="profile-avatar-section">
                <div className="avatar-glow-ring"></div>
                <div className="avatar-ring-spin"></div>
                <div className="profile-avatar-circle">
                  <span className="avatar-emoji">👤</span>
                </div>
              </div>
              
              <h2 className="profile-user-name">{user.name || 'Food Lover'}</h2>
              <p className="profile-user-email">{user.email || 'Add your email address'}</p>
              {user.phone && <p className="profile-user-phone">📱 {user.phone}</p>}
              
              <div style={{ marginTop: '16px', marginBottom: '16px' }}>
                {!isLoggedIn ? (
                  <button 
                    onClick={() => setShowLoginModal(true)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#4285F4',
                      border: 'none',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(66,133,244,0.3)'
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign in with Google
                  </button>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ backgroundColor: 'rgba(34,197,94,0.1)', padding: '12px', borderRadius: '12px', marginBottom: '12px' }}>
                      <p style={{ color: '#22C55E', fontSize: '14px', fontWeight: 600, margin: 0 }}>✓ Logged in with Google</p>
                    </div>
                    <button 
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: '12px',
                        color: '#EF4444',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
              
              <div className="profile-stats-row">
                <div className="stat-box">
                  <span className="stat-num">{orderHistory.length}</span>
                  <span className="stat-text">Orders</span>
                </div>
                <div className="stat-box">
                  <span className="stat-num">0</span>
                  <span className="stat-text">Reviews</span>
                </div>
                <div className="stat-box">
                  <span className="stat-num">0</span>
                  <span className="stat-text">Wishlist</span>
                </div>
              </div>
              
              <button className="edit-profile-button">
                <span>✏️</span> Edit Profile
              </button>
            </div>
          </div>

          <div className="profile-column-right">
            <div className="profile-card profile-info-card" style={{ animationDelay: '0.2s' }}>
              <div className="card-heading">
                <span className="heading-icon">📝</span>
                <div>
                  <h3>Personal Information</h3>
                  <p>Update your basic details</p>
                </div>
              </div>
              
              <div className="profile-form-grid">
                {['name', 'phone', 'email'].map(field => (
                  <div key={field} className="form-group">
                    <label className="form-label">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input 
                      type={field === 'email' ? 'email' : 'text'} 
                      value={user[field] || ''}
                      onChange={(e) => setUser({ ...user, [field]: e.target.value })}
                      className="form-control"
                      placeholder={`Enter your ${field}`}
                    />
                  </div>
                ))}
              </div>
              
              <button onClick={handleSave} className="save-button">
                <span>💾</span>
                <span>Save Changes</span>
              </button>
            </div>

            <div className="profile-card profile-history-card" style={{ animationDelay: '0.3s' }}>
              <div className="card-heading">
                <span className="heading-icon">📦</span>
                <div>
                  <h3>Order History</h3>
                  <p>Your recent orders</p>
                </div>
              </div>
              
              {orderHistory.length === 0 ? (
                <div className="empty-orders">
                  <span className="empty-food-icon">🍕</span>
                  <h4>No orders yet</h4>
                  <p>Start ordering your favorite food!</p>
                  <button className="browse-btn" onClick={() => window.location.hash = '#/restaurants'}>
                    Browse Restaurants
                  </button>
                </div>
              ) : (
                <div className="orders-list">
                  {orderHistory.map((order, idx) => (
                    <div key={idx} className="order-card-item">
                      <div className="order-left">
                        <p className="order-id">Order #{order.id}</p>
                        <p className="order-date">{new Date(order.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        <span className={`order-badge order-badge-${order.status}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="order-right">
                        <p className="order-amount">₹{order.cart.items.reduce((s, i) => s + i.price * i.qty, 0)}</p>
                        <p className="order-items-count">{order.cart.items.length} item{order.cart.items.length > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
