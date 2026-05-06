import React, { useState } from 'react';
import { getFoodImage } from '../utils/foodApi';

const CartPage = () => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('zomato_cart');
    return saved ? JSON.parse(saved) : { restaurantId: null, restaurantName: '', items: [], coupon: null };
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState(() => {
    const saved = localStorage.getItem('zomato_address');
    return saved ? JSON.parse(saved) : { name: '', phone: '', flat: '', area: '', landmark: '', city: '', pincode: '' };
  });
  const [saveAddress, setSaveAddress] = useState(true);
  
  const total = cart.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const deliveryFee = 40;
  const taxes = Math.round(total * 0.05);
  const grandTotal = total + deliveryFee + taxes;
  
  const removeItem = (id) => {
    const newCart = { ...cart, items: cart.items.filter(i => i.id !== id) };
    if (newCart.items.length === 0) { newCart.restaurantId = null; newCart.restaurantName = ''; }
    setCart(newCart);
    localStorage.setItem('zomato_cart', JSON.stringify(newCart));
  };
  
  const updateQty = (id, delta) => {
    const newCart = { ...cart };
    const item = newCart.items.find(i => i.id === id);
    if (item) {
      item.qty += delta;
      if (item.qty <= 0) { newCart.items = newCart.items.filter(i => i.id !== id); }
    }
    if (newCart.items.length === 0) { newCart.restaurantId = null; newCart.restaurantName = ''; }
    setCart(newCart);
    localStorage.setItem('zomato_cart', JSON.stringify(newCart));
  };

  const handleAddressChange = (field, value) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const proceedToPayment = () => {
    if (!address.name || !address.phone || !address.flat || !address.area || !address.city || !address.pincode) {
      alert('Please fill all required address fields');
      return;
    }
    if (saveAddress) {
      localStorage.setItem('zomato_address', JSON.stringify(address));
    }
    setStep(2);
  };

  const placeOrder = () => {
    const orderId = 'ZM' + Date.now().toString(36).toUpperCase();
    setOrderPlaced(true);
    localStorage.setItem('zomato_order', JSON.stringify({ 
      id: orderId, 
      cart: { ...cart }, 
      paymentMethod: selectedPayment === 'cod' ? 'Cash on Delivery' : selectedPayment === 'upi' ? 'UPI Payment' : 'Card Payment',
      address: address,
      status: 'confirmed', 
      timestamp: Date.now() 
    }));
    localStorage.setItem('zomato_cart', JSON.stringify({ restaurantId: null, restaurantName: '', items: [], coupon: null }));
    setTimeout(() => {
      window.location.hash = '#/track/' + orderId;
    }, 2000);
  };
  
  if (orderPlaced) {
    return (
      <div className="order-success-overlay">
        <div className="success-content">
          <div className="success-emoji">🎉</div>
          <h2 className="success-title">Order Placed Successfully!</h2>
          <p className="success-text">Your delicious food is being prepared</p>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="checkout-container">
        <div style={{ textAlign: 'center', padding: '80px 24px', animation: 'fadeIn 0.5s ease-out' }}>
          <p style={{ fontSize: '64px', marginBottom: '16px' }}>🛒</p>
          <p style={{ color: '#94A3B8', fontSize: '18px' }}>Your cart is empty</p>
          <button onClick={() => window.location.hash = '#/restaurants'}
            style={{ marginTop: '24px', padding: '12px 24px', background: 'linear-gradient(135deg, #E23744, #FF6B35)',
              color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}>
            Browse Restaurants
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="checkout-container">
      {/* Food Animations Behind Cards */}
      <div className="checkout-food-bg">
        <div className="food-line food-line-1">
          {[...Array(15)].map((_, i) => (
            <span key={i} className="food-emoji">{['🍕', '🍔', '🍜', '🥗', '🍛', '🍣', '🌮', '🍰', '🥘', '🍲', '🌯', '🍱', '🥟', '🍗', '🥙'][i]}</span>
          ))}
        </div>
        <div className="food-line food-line-2">
          {[...Array(15)].map((_, i) => (
            <span key={i} className="food-emoji">{['🍕', '🍔', '🍜', '🥗', '🍛', '🍣', '🌮', '🍰', '🥘', '🍲', '🌯', '🍱', '🥟', '🍗', '🥙'][i]}</span>
          ))}
        </div>
        <div className="food-line food-line-3">
          {[...Array(15)].map((_, i) => (
            <span key={i} className="food-emoji">{['🍕', '🍔', '🍜', '🥗', '🍛', '🍣', '🌮', '🍰', '🥘', '🍲', '🌯', '🍱', '🥟', '🍗', '🥙'][i]}</span>
          ))}
        </div>
        <div className="checkout-glow-orb checkout-glow-1"></div>
        <div className="checkout-glow-orb checkout-glow-2"></div>
        <div className="checkout-glow-orb checkout-glow-3"></div>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="checkout-float-bubble" style={{
            left: `${10 + i * 16}%`,
            animationDelay: `${i * 2}s`,
            animationDuration: `${4 + Math.random() * 3}s`
          }}></div>
        ))}
      </div>

      <div className="checkout-header">
        <button className="back-btn" onClick={() => window.location.hash = '#/restaurants'}>
          <span>←</span>
          <span>Back to Restaurants</span>
        </button>
        <h1 className="checkout-title" style={{ color: 'white' }}>Checkout</h1>
        <div className="checkout-steps">
          <div className={`checkout-step ${step >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Address</span>
          </div>
          <div className="step-divider"></div>
          <div className={`checkout-step ${step >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Payment</span>
          </div>
        </div>
      </div>

      {step === 1 && (
        <div className="address-section" style={{ animation: 'fadeSlideUp 0.5s ease-out' }}>
          <div className="order-summary-card">
            <div className="delivery-header">
              <span className="delivery-icon" style={{ fontSize: '24px' }}>📍</span>
              <h3 className="delivery-title" style={{ color: 'white', fontSize: '18px' }}>Delivery Address</h3>
            </div>
            
            <div className="address-form-grid">
              <div className="address-field">
                <label className="address-label">Full Name *</label>
                <input 
                  type="text" 
                  className="address-input"
                  value={address.name}
                  onChange={(e) => handleAddressChange('name', e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="address-field">
                <label className="address-label">Phone Number *</label>
                <input 
                  type="tel" 
                  className="address-input"
                  value={address.phone}
                  onChange={(e) => handleAddressChange('phone', e.target.value)}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                />
              </div>
              <div className="address-field full-width">
                <label className="address-label">Flat / House / Building *</label>
                <input 
                  type="text" 
                  className="address-input"
                  value={address.flat}
                  onChange={(e) => handleAddressChange('flat', e.target.value)}
                  placeholder="e.g. Flat 302, Sunrise Apartments"
                />
              </div>
              <div className="address-field full-width">
                <label className="address-label">Area / Street / Locality *</label>
                <input 
                  type="text" 
                  className="address-input"
                  value={address.area}
                  onChange={(e) => handleAddressChange('area', e.target.value)}
                  placeholder="e.g. MG Road, Koramangala"
                />
              </div>
              <div className="address-field">
                <label className="address-label">Landmark</label>
                <input 
                  type="text" 
                  className="address-input"
                  value={address.landmark}
                  onChange={(e) => handleAddressChange('landmark', e.target.value)}
                  placeholder="e.g. Near Metro Station"
                />
              </div>
              <div className="address-field">
                <label className="address-label">City *</label>
                <input 
                  type="text" 
                  className="address-input"
                  value={address.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  placeholder="e.g. Bangalore"
                />
              </div>
              <div className="address-field">
                <label className="address-label">Pincode *</label>
                <input 
                  type="text" 
                  className="address-input"
                  value={address.pincode}
                  onChange={(e) => handleAddressChange('pincode', e.target.value)}
                  placeholder="6-digit pincode"
                  maxLength={6}
                />
              </div>
            </div>

            <div className="save-address-checkbox">
              <input 
                type="checkbox" 
                id="saveAddress"
                checked={saveAddress}
                onChange={(e) => setSaveAddress(e.target.checked)}
              />
              <label htmlFor="saveAddress">Save this address for future orders</label>
            </div>

            <button className="proceed-btn" onClick={proceedToPayment}>
              <span>Proceed to Payment</span>
              <span className="proceed-arrow">→</span>
            </button>
          </div>

          <div className="order-summary-card order-items-mini" style={{ animationDelay: '0.1s' }}>
            <div className="delivery-header">
              <span className="delivery-icon" style={{ fontSize: '24px' }}>🍽️</span>
              <h3 className="delivery-title" style={{ color: 'white', fontSize: '18px' }}>{cart.restaurantName || 'Your Order'}</h3>
            </div>
            
            {cart.items.map((item, idx) => (
              <div key={item.id} className="order-item-row" style={{ animationDelay: `${idx * 0.1}s`, borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '16px 0' }}>
                <div className="order-item-image-container" style={{ width: '60px', height: '60px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                  <img 
                    src={getFoodImage(item.name)} 
                    alt={item.name}
                    className="order-item-image"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
                    onError={(e) => { 
                      e.target.src = 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=100&h=100&fit=crop'; 
                    }}
                  />
                </div>
                <div className="order-item-details" style={{ flex: 1 }}>
                  <p className="order-item-name" style={{ color: 'white', fontWeight: 600, fontSize: '15px', margin: '0 0 4px' }}>{item.name}</p>
                  <p className="order-item-price" style={{ color: '#10B981', fontWeight: 700, fontSize: '14px', margin: 0 }}>₹{item.price} each</p>
                </div>
                <div className="order-item-qty" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '4px 8px' }}>
                  <button className="qty-btn" onClick={() => updateQty(item.id, -1)} style={{ width: '28px', height: '28px', borderRadius: '6px', border: 'none', background: 'rgba(226,55,68,0.2)', color: 'white', fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}>−</button>
                  <span className="qty-value" style={{ fontWeight: 700, color: 'white', minWidth: '24px', textAlign: 'center' }}>{item.qty}</span>
                  <button className="qty-btn" onClick={() => updateQty(item.id, 1)} style={{ width: '28px', height: '28px', borderRadius: '6px', border: 'none', background: 'rgba(226,55,68,0.2)', color: 'white', fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}>+</button>
                </div>
                <span className="order-item-total" style={{ fontWeight: 700, color: 'white', fontSize: '14px' }}>₹{item.price * item.qty}</span>
                <button onClick={() => removeItem(item.id)}
                  style={{ marginLeft: '12px', color: '#EF4444', background: 'transparent',
                    border: 'none', cursor: 'pointer', fontSize: '16px' }}>✕</button>
              </div>
            ))}

            <div className="total-section" style={{ paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="total-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', color: '#94A3B8', fontSize: '14px' }}>
                <span>Subtotal:</span>
                <span>₹{total}</span>
              </div>
              <div className="total-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', color: '#94A3B8', fontSize: '14px' }}>
                <span>Delivery Fee:</span>
                <span style={{ color: '#10B981' }}>₹{deliveryFee}</span>
              </div>
              <div className="total-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', color: '#94A3B8', fontSize: '14px' }}>
                <span>Taxes & Charges:</span>
                <span>₹{taxes}</span>
              </div>
              <div className="total-row final" style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0 0', borderTop: '2px solid rgba(255,255,255,0.1)', marginTop: '8px', fontSize: '20px', fontWeight: 800, color: 'white' }}>
                <span>Total Amount:</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="payment-section" style={{ animation: 'fadeSlideUp 0.5s ease-out' }}>
          <button className="back-btn" onClick={() => setStep(1)}>
            <span>←</span>
            <span>Back to Address</span>
          </button>

          <div className="order-summary-card">
            <div className="delivery-header">
              <span className="delivery-icon" style={{ fontSize: '24px' }}>📍</span>
              <h3 className="delivery-title" style={{ color: 'white', fontSize: '18px' }}>Delivering to</h3>
            </div>
            <div className="address-display-card">
              <p className="address-display-name">{address.name}</p>
              <p className="address-display-phone">{address.phone}</p>
              <p className="address-display-full">{address.flat}, {address.area}{address.landmark ? `, ${address.landmark}` : ''}, {address.city} - {address.pincode}</p>
            </div>
          </div>

          <div className="order-summary-card payment-method-card" style={{ animationDelay: '0.1s' }}>
            <div className="delivery-header">
              <span className="delivery-icon" style={{ fontSize: '24px' }}>💳</span>
              <h3 className="delivery-title" style={{ color: 'white', fontSize: '18px' }}>Payment Method</h3>
            </div>

            <div className="payment-options-grid">
              <div 
                className={`payment-option-card ${selectedPayment === 'cod' ? 'selected' : ''}`}
                onClick={() => setSelectedPayment('cod')}
              >
                <div className="payment-option-icon">💰</div>
                <div className="payment-option-info">
                  <h4>Cash on Delivery</h4>
                  <p>Pay when you receive</p>
                </div>
                <div className={`payment-radio ${selectedPayment === 'cod' ? 'checked' : ''}`}></div>
              </div>

              <div 
                className={`payment-option-card ${selectedPayment === 'upi' ? 'selected' : ''}`}
                onClick={() => setSelectedPayment('upi')}
              >
                <div className="payment-option-icon">📱</div>
                <div className="payment-option-info">
                  <h4>UPI Payment</h4>
                  <p>GPay, PhonePe, Paytm</p>
                </div>
                <div className={`payment-radio ${selectedPayment === 'upi' ? 'checked' : ''}`}></div>
              </div>

              <div 
                className={`payment-option-card ${selectedPayment === 'card' ? 'selected' : ''}`}
                onClick={() => setSelectedPayment('card')}
              >
                <div className="payment-option-icon">💳</div>
                <div className="payment-option-info">
                  <h4>Credit / Debit Card</h4>
                  <p>Visa, Mastercard, RuPay</p>
                </div>
                <div className={`payment-radio ${selectedPayment === 'card' ? 'checked' : ''}`}></div>
              </div>
            </div>

            {selectedPayment === 'upi' && (
              <div className="payment-details-form" style={{ animation: 'fadeSlideUp 0.3s ease-out' }}>
                <div className="payment-field">
                  <label>UPI ID</label>
                  <input type="text" className="payment-input" placeholder="yourname@upi" />
                </div>
                <p className="payment-note">You will receive a payment request on your UPI app after placing the order</p>
              </div>
            )}

            {selectedPayment === 'card' && (
              <div className="payment-details-form" style={{ animation: 'fadeSlideUp 0.3s ease-out' }}>
                <div className="payment-field">
                  <label>Cardholder Name</label>
                  <input type="text" className="payment-input" placeholder="Name on card" />
                </div>
                <p className="payment-note">Card details will be collected securely on the payment gateway</p>
              </div>
            )}
          </div>

          <div className="order-summary-card order-total-card" style={{ animationDelay: '0.2s' }}>
            <h3 className="total-card-title">Order Summary</h3>
            <div className="total-breakdown">
              <div className="total-line">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>
              <div className="total-line">
                <span>Delivery Fee</span>
                <span className="free-delivery">₹{deliveryFee}</span>
              </div>
              <div className="total-line">
                <span>Taxes & Charges</span>
                <span>₹{taxes}</span>
              </div>
              <div className="total-line grand-total">
                <span>Total Amount</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>
          </div>

          <button className="place-order-btn" onClick={placeOrder}>
            <span>Place Order & Pay</span>
            <span className="place-order-total">₹{grandTotal}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
