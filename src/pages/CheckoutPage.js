import React, { useState, useContext } from 'react';
import { COUPONS } from '../utils/constants';
import { ToastContext } from '../context/ToastContext';

const CheckoutPage = () => {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('zomato_cart') || '{"restaurantId":null,"restaurantName":"","items":[],"coupon":null}');
    } catch {
      return { restaurantId: null, restaurantName: '', items: [], coupon: null };
    }
  });
  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '', pincode: '' });
  const [errors, setErrors] = useState({});
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(cart.coupon || null);
  const [selectedPayment, setSelectedPayment] = useState('');
  const addToast = useContext(ToastContext);

  const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discount = appliedCoupon ? Math.round(subtotal * appliedCoupon.discount) : 0;
  const deliveryFee = subtotal > 199 ? 0 : 40;
  const taxes = Math.round((subtotal - discount) * 0.05);
  const total = subtotal - discount + deliveryFee + taxes;

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!/^[6-9]\d{9}$/.test(form.phone)) errs.phone = 'Valid 10-digit mobile required';
    if (!form.address.trim()) errs.address = 'Address is required';
    if (!form.city.trim()) errs.city = 'City is required';
    if (!/^\d{6}$/.test(form.pincode)) errs.pincode = 'Valid 6-digit pincode required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const applyCoupon = () => {
    const code = couponCode.toUpperCase().trim();
    if (COUPONS[code]) {
      const coupon = COUPONS[code];
      setAppliedCoupon(coupon);
      const newCart = { ...cart, coupon };
      setCart(newCart);
      localStorage.setItem('zomato_cart', JSON.stringify(newCart));
      if (addToast) addToast('Coupon applied: ' + coupon.label, 'success');
    } else {
      if (addToast) addToast('Invalid coupon code', 'error');
    }
  };

  const placeOrder = () => {
    if (!validate()) return;
    const id = 'ZM' + Date.now().toString(36).toUpperCase();
    setOrderId(id);
    setOrderPlaced(true);
    localStorage.setItem('zomato_order', JSON.stringify({ 
      id, 
      cart: { ...cart }, 
      form, 
      paymentMethod: selectedPayment,
      status: 'confirmed', 
      timestamp: Date.now() 
    }));
    localStorage.setItem('zomato_cart', JSON.stringify({ restaurantId: null, restaurantName: '', items: [], coupon: null }));
    if (addToast) addToast('Order placed successfully!', 'success');
    setTimeout(() => { window.location.hash = '#/track/' + id; }, 1500);
  };

  if (cart.items.length === 0 && !orderPlaced) {
    return <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <p style={{ fontSize: '64px', marginBottom: '16px' }}>🛒</p>
      <p style={{ color: '#6B7280' }}>Your cart is empty</p>
      <a href="#/restaurants" style={{ display: 'inline-block', marginTop: '16px',
        backgroundColor: '#E23744', color: 'white', padding: '12px 24px',
        borderRadius: '12px', textDecoration: 'none', fontWeight: 700 }}>Browse Restaurants</a>
    </div>;
  }

  if (orderPlaced) {
    return <div style={{ textAlign: 'center', padding: '80px 24px', animation: 'fadeSlideUp 0.5s ease-out' }}>
      <p style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</p>
      <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Order Placed Successfully!</h2>
      <p style={{ color: '#6B7280', marginBottom: '8px' }}>Order ID: <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{orderId}</span></p>
      <p style={{ color: '#6B7280' }}>Redirecting to order tracking...</p>
    </div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
        {['Payment', 'Address', 'Review'].map((label, idx) => {
          const s = idx + 1;
          return (
            <div key={s} style={{
              flex: 1, padding: '12px', textAlign: 'center', borderRadius: '9999px',
              fontSize: '14px', fontWeight: 600,
              backgroundColor: s < step ? '#22C55E' : s === step ? '#E23744' : 'rgba(255,255,255,0.1)',
              color: s < step || s === step ? 'white' : '#6B7280'
            }}>
              {label}
            </div>
          );
        })}
      </div>

      {step === 1 && (
        <div style={{ backgroundColor: 'rgba(30,41,59,0.8)', borderRadius: '16px', padding: '24px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', color: 'white' }}>Payment Method</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { method: 'Cash on Delivery', icon: '💰', desc: 'Pay when your order arrives' },
              { method: 'UPI', icon: '📱', desc: 'Pay using Google Pay, PhonePe, etc.' },
              { method: 'Credit/Debit Card', icon: '💳', desc: 'Visa, MasterCard, RuPay accepted' }
            ].map(({ method, icon, desc }) => (
              <div key={method} onClick={() => setSelectedPayment(method)}
                style={{
                  padding: '16px 20px',
                  border: `2px solid ${selectedPayment === method ? '#E23744' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '16px',
                  cursor: 'pointer',
                  backgroundColor: selectedPayment === method ? 'rgba(226,55,68,0.1)' : 'rgba(255,255,255,0.02)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                <div style={{ fontSize: '28px', width: '48px', textAlign: 'center' }}>{icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: 'white' }}>{method}</div>
                  <div style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>{desc}</div>
                </div>
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  border: `2px solid ${selectedPayment === method ? '#E23744' : '#475569'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {selectedPayment === method && (
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#E23744' }}></div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
            <button onClick={() => window.history.back()}
              style={{ flex: 1, padding: '16px', backgroundColor: 'transparent', border: '2px solid rgba(255,255,255,0.2)',
                borderRadius: '12px', fontSize: '16px', fontWeight: 600, cursor: 'pointer', color: 'white' }}>← Back</button>
            <button onClick={() => selectedPayment && setStep(2)}
              disabled={!selectedPayment}
              style={{ flex: 1, padding: '16px', backgroundColor: selectedPayment ? '#E23744' : '#475569', color: 'white',
                border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 700, cursor: selectedPayment ? 'pointer' : 'not-allowed' }}>Continue to Address →</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={{ backgroundColor: 'rgba(30,41,59,0.8)', borderRadius: '16px', padding: '24px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', color: 'white' }}>Delivery Address</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {['name', 'phone', 'address', 'city', 'pincode'].map(field => (
              <div key={field} style={field === 'address' ? { gridColumn: 'span 2' } : {}}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px',
                  fontSize: '14px', color: '#CBD5E1' }}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input type="text" value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  placeholder={`Enter ${field}`}
                  style={{ width: '100%', padding: '12px 16px', border: `2px solid ${errors[field] ? '#EF4444' : 'rgba(255,255,255,0.2)'}`,
                    borderRadius: '8px', fontSize: '14px', outline: 'none', background: 'rgba(15,23,42,0.8)', color: 'white' }} />
                {errors[field] && (
                  <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>{errors[field]}</p>
                )}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
            <button onClick={() => setStep(1)}
              style={{ flex: 1, padding: '16px', backgroundColor: 'transparent', border: '2px solid rgba(255,255,255,0.2)',
                borderRadius: '12px', fontSize: '16px', fontWeight: 600, cursor: 'pointer', color: 'white' }}>← Back</button>
            <button onClick={() => validate() && setStep(3)}
              style={{ flex: 1, padding: '16px', backgroundColor: '#E23744', color: 'white',
                border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}>Review Order →</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{ backgroundColor: 'rgba(30,41,59,0.8)', borderRadius: '16px', padding: '24px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', color: 'white' }}>Order Summary</h3>
          
          {/* Delivery Address Review */}
          <div style={{ background: 'rgba(15,23,42,0.6)', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
            <h4 style={{ color: '#94A3B8', fontSize: '13px', marginBottom: '8px', textTransform: 'uppercase' }}>Delivery Address</h4>
            <p style={{ color: 'white', fontWeight: 600, marginBottom: '4px' }}>{form.name}</p>
            <p style={{ color: '#CBD5E1', fontSize: '14px' }}>{form.address}</p>
            <p style={{ color: '#CBD5E1', fontSize: '14px' }}>{form.city} - {form.pincode}</p>
            <p style={{ color: '#CBD5E1', fontSize: '14px' }}>📞 {form.phone}</p>
          </div>

          {/* Payment Method Review */}
          <div style={{ background: 'rgba(15,23,42,0.6)', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
            <h4 style={{ color: '#94A3B8', fontSize: '13px', marginBottom: '8px', textTransform: 'uppercase' }}>Payment Method</h4>
            <p style={{ color: 'white', fontWeight: 600 }}>{selectedPayment}</p>
          </div>

          {cart.items.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between',
              padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ color: 'white' }}>{item.qty}x {item.name}</span>
              <span style={{ fontWeight: 600, color: 'white' }}>₹{item.price * item.qty}</span>
            </div>
          ))}
          <div style={{ margin: '16px 0', padding: '16px', backgroundColor: 'rgba(15,23,42,0.6)',
            borderRadius: '12px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Coupon code" style={{ flex: 1, padding: '12px 16px',
                  border: '2px solid rgba(255,255,255,0.2)', borderRadius: '8px', fontSize: '14px', background: 'transparent', color: 'white' }} />
              <button onClick={applyCoupon}
                style={{ padding: '12px 24px', backgroundColor: 'transparent',
                  border: '2px solid rgba(255,255,255,0.2)', borderRadius: '8px', fontWeight: 600,
                  cursor: 'pointer', color: 'white' }}>Apply</button>
            </div>
            {appliedCoupon && (
              <p style={{ color: '#22C55E', fontSize: '14px', marginTop: '8px' }}>✓ {appliedCoupon.label} applied!</p>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#CBD5E1' }}>
              <span>Subtotal</span><span>₹{subtotal}</span>
            </div>
            {discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#22C55E' }}>
                <span>Discount</span><span>-₹{discount}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#CBD5E1' }}>
              <span>Delivery Fee</span><span>{deliveryFee === 0 ? 'FREE' : '₹' + deliveryFee}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#CBD5E1' }}>
              <span>Taxes & Charges</span><span>₹{taxes}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700,
              fontSize: '18px', paddingTop: '12px', borderTop: '2px solid rgba(255,255,255,0.1)', color: 'white' }}>
              <span>Total</span><span>₹{total}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button onClick={() => setStep(2)}
              style={{ flex: 1, padding: '16px', backgroundColor: 'transparent',
                border: '2px solid rgba(255,255,255,0.2)', borderRadius: '12px', fontSize: '16px',
                fontWeight: 600, cursor: 'pointer', color: 'white' }}>← Back</button>
            <button onClick={placeOrder}
              style={{ flex: 1, padding: '16px', backgroundColor: '#E23744', color: 'white',
                border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 700,
                cursor: 'pointer' }}>Place Order • ₹{total}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
