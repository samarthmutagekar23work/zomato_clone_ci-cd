import React, { useState, useEffect } from 'react';
import { RESTAURANTS } from '../data/restaurants';
import { MENU_DATA } from '../data/menu';
import { getRestaurantImage } from '../utils/helpers';
import { getFoodImage, getPriceForSize, SIZE_LABELS, SIZE_DESCRIPTIONS } from '../utils/foodApi';
import { ToastContext } from '../context/ToastContext';

const RestaurantDetail = () => {
  const [hash] = useState(() => window.location.hash);
  const id = hash.split('/')[2];
  const restaurant = RESTAURANTS.find(r => r.id === id);
  const [activeCategory, setActiveCategory] = useState('Recommended');
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('zomato_cart') || '{"restaurantId":null,"restaurantName":"","items":[]}'));
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isFav, setIsFav] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState({});
  const addToast = React.useContext(ToastContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!restaurant) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9FAFB' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '80px', marginBottom: '16px' }}>🍽️</div>
          <p style={{ fontSize: '24px', fontWeight: 800, color: '#1F2937', marginBottom: '8px' }}>Restaurant not found</p>
          <p style={{ color: '#6B7280', marginBottom: '24px' }}>The restaurant you're looking for doesn't exist.</p>
          <button onClick={() => window.location.hash = '#/restaurants'} style={{ backgroundColor: '#E23744', color: 'white', padding: '12px 32px', borderRadius: '9999px', border: 'none', fontSize: '16px', fontWeight: 600, cursor: 'pointer' }}>Browse Restaurants</button>
        </div>
      </div>
    );
  }

  const menuItems = MENU_DATA[id] || [];
  const categories = ['Recommended', ...new Set(menuItems.map(m => m.category))];
  const filteredItems = activeCategory === 'Recommended' ? menuItems.filter(m => m.recommended) : menuItems.filter(m => m.category === activeCategory);

  const addToCart = (item) => {
    const size = selectedSizes[item.id] || 'medium';
    const price = getPriceForSize(item.price, item.category, size);
    const newCart = { ...cart };
    if (newCart.restaurantId && newCart.restaurantId !== id) {
      if (!window.confirm('Adding from a different restaurant will clear your cart. Continue?')) return;
      newCart.items = [];
    }
    newCart.restaurantId = id;
    newCart.restaurantName = restaurant.name;
    const existing = newCart.items.find(i => i.id === item.id && i.size === size);
    if (existing) { existing.qty += 1; }
    else { newCart.items.push({ ...item, qty: 1, size, price, restaurantId: id, restaurantName: restaurant.name }); }
    setCart(newCart);
    localStorage.setItem('zomato_cart', JSON.stringify(newCart));
    if (addToast) addToast(item.name + ' (' + SIZE_LABELS[size] + ') added to cart!', 'success');
  };

  const handleSizeChange = (itemId, size) => {
    setSelectedSizes(prev => ({ ...prev, [itemId]: size }));
  };

  const cartCount = cart.items.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cart.items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      <div style={{ position: 'relative', height: '350px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(226,55,68,0.3), rgba(0,0,0,0.6))', zIndex: 10 }}></div>
        <img src={getRestaurantImage(restaurant)} alt={restaurant.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop'; }} />
        <div style={{ position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.9) 100%)',
          display: 'flex', alignItems: 'flex-end', padding: '32px 24px', zIndex: 20 }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <button onClick={() => window.history.back()} style={{ marginBottom: '16px', backgroundColor: '#E23744', backdropFilter: 'blur(10px)', color: 'white', padding: '12px 28px', borderRadius: '9999px', border: '2px solid rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 8px 24px rgba(226,55,68,0.5)', transition: 'all 0.3s ease', transform: 'scale(1.05)' }}>← Back</button>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div style={{ position: 'relative' }}>
                <img src={getRestaurantImage(restaurant)} alt={restaurant.name}
                  style={{ width: '140px', height: '140px', borderRadius: '16px', objectFit: 'cover',
                    border: '4px solid white', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }} />
                {restaurant.isPromoted && (
                  <div style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'linear-gradient(135deg, #FBBF24, #F59E0B)', color: 'white', padding: '4px 12px', borderRadius: '12px', fontWeight: 800, fontSize: '11px', boxShadow: '0 4px 12px rgba(245,158,11,0.4)' }}>⭐ PROMOTED</div>
                )}
              </div>
              <div style={{ flex: 1, color: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h1 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 900, marginBottom: '8px',
                    textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>{restaurant.name}</h1>
                  <button onClick={() => { setIsFav(!isFav); if(addToast) addToast(isFav ? 'Removed from favorites' : 'Added to favorites!', 'success'); }} style={{ background: 'none', border: 'none', fontSize: '32px', cursor: 'pointer', transition: 'transform 0.2s', transform: 'scale(1.1)' }}>{isFav ? '❤️' : '🤍'}</button>
                </div>
                <p style={{ opacity: 0.95, marginBottom: '6px', fontSize: '16px' }}>{restaurant.cuisines.join(' • ')}</p>
                <p style={{ opacity: 0.9, fontSize: '14px', marginBottom: '12px' }}>📍 {restaurant.locality}, {restaurant.city} • {restaurant.phone}</p>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ backgroundColor: 'white', color: '#1F2937', padding: '8px 16px', borderRadius: '9999px', fontWeight: 800, fontSize: '15px',
                    display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>★ {restaurant.rating} <span style={{ fontWeight: 400, fontSize: '13px', color: '#6B7280' }}>{restaurant.totalRatings}+ ratings</span></span>
                  <span style={{ backgroundColor: '#22C55E', color: 'white', padding: '8px 16px',
                    borderRadius: '9999px', fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>🛵 {restaurant.deliveryTime} mins</span>
                  <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', color: 'white', padding: '8px 16px',
                    borderRadius: '9999px', fontWeight: 600, fontSize: '13px' }}>💰 ₹{restaurant.costForTwo} for two</span>
                  {restaurant.isVeg && <span style={{ backgroundColor: '#F0FDF4', color: '#166534', padding: '8px 16px', borderRadius: '9999px', fontWeight: 600, fontSize: '13px' }}>🟢 Pure Veg</span>}
                </div>
                {restaurant.offers?.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
                    {restaurant.offers.map((offer, idx) => (
                      <span key={idx} style={{ background: 'linear-gradient(135deg, #EF4444, #EC4899)', color: 'white', padding: '8px 16px',
                        borderRadius: '9999px', fontWeight: 600, fontSize: '13px', boxShadow: '0 4px 12px rgba(239,68,68,0.3)' }}>🎉 {offer}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '-24px auto 0', padding: '0 24px', position: 'relative', zIndex: 30 }}>
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px 24px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '28px', fontWeight: 800, color: '#1F2937' }}>★ {restaurant.rating}</p>
              <p style={{ fontSize: '12px', color: '#6B7280' }}>{restaurant.totalRatings}+ ratings</p>
            </div>
            <div style={{ width: '1px', height: '40px', backgroundColor: '#E5E7EB' }}></div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '28px', fontWeight: 800, color: '#1F2937' }}>{restaurant.deliveryTime}</p>
              <p style={{ fontSize: '12px', color: '#6B7280' }}>mins</p>
            </div>
            <div style={{ width: '1px', height: '40px', backgroundColor: '#E5E7EB' }}></div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '28px', fontWeight: 800, color: '#1F2937' }}>₹{restaurant.costForTwo}</p>
              <p style={{ fontSize: '12px', color: '#6B7280' }}>for two</p>
            </div>
          </div>
          <button onClick={() => window.location.hash = '#/cart'} style={{ backgroundColor: '#E23744', color: 'white', padding: '12px 28px', borderRadius: '9999px', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(226,55,68,0.3)' }}>
            🛒 View Cart {cartCount > 0 && `(${cartCount})`}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '24px auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px',
          borderBottom: '2px solid #E5E7EB' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              style={{
                padding: '12px 24px', borderRadius: '9999px', border: 'none', cursor: 'pointer',
                fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap',
                backgroundColor: activeCategory === cat ? '#E23744' : 'white',
                color: activeCategory === cat ? 'white' : '#374151',
                transition: 'all 0.2s', boxShadow: activeCategory === cat ? '0 4px 12px rgba(226,55,68,0.3)' : '0 1px 3px rgba(0,0,0,0.1)',
                transform: activeCategory === cat ? 'scale(1.05)' : 'scale(1)'
              }}>
              {cat === 'Recommended' ? '⭐ Recommended' : cat}
            </button>
          ))}
        </div>

        {filteredItems.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))',
            gap: '20px', marginTop: '24px' }}>
            {filteredItems.map((item, idx) => {
              const size = selectedSizes[item.id] || 'medium';
              const currentPrice = getPriceForSize(item.price, item.category, size);
              return (
                <div key={item.id} style={{
                  display: 'flex', gap: '16px', padding: '20px', backgroundColor: 'white',
                  borderRadius: '16px', boxShadow: hoveredItem === item.id ? '0 8px 24px rgba(226,55,68,0.15)' : '0 2px 8px rgba(0,0,0,0.06)',
                  transition: 'all 0.3s', cursor: 'pointer',
                  border: hoveredItem === item.id ? '2px solid #E23744' : '2px solid transparent',
                  transform: hoveredItem === item.id ? 'translateY(-4px)' : 'translateY(0)'
                }}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 style={{ fontWeight: 700, color: '#1F2937', fontSize: '16px' }}>{item.name}</h4>
                        {item.recommended && (
                          <span style={{ display: 'inline-block', fontSize: '11px', color: '#E23744', fontWeight: 700,
                            backgroundColor: '#FEF2F2', padding: '4px 8px', borderRadius: '4px', marginTop: '4px' }}>🔥 Bestseller</span>
                        )}
                      </div>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', marginTop: '6px', flexShrink: 0, backgroundColor: item.isVeg ? '#22C55E' : '#EF4444' }}></div>
                    </div>
                    <p style={{ color: '#6B7280', fontSize: '13px', marginTop: '8px', lineHeight: '1.5' }}>{item.description}</p>

                    <div style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
                      {['small', 'medium', 'large'].map(s => (
                        <button key={s} onClick={() => handleSizeChange(item.id, s)}
                          style={{
                            padding: '6px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                            fontSize: '12px', fontWeight: 600,
                            backgroundColor: size === s ? '#E23744' : '#F3F4F6',
                            color: size === s ? 'white' : '#6B7280',
                            transition: 'all 0.2s'
                          }}
                          title={SIZE_DESCRIPTIONS[s]}>
                          {SIZE_LABELS[s]} ₹{getPriceForSize(item.price, item.category, s)}
                        </button>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 800, color: '#1F2937', fontSize: '17px' }}>₹{currentPrice}</span>
                      {item.isVeg && <span style={{ fontSize: '11px', color: '#22C55E', fontWeight: 600,
                        backgroundColor: '#F0FDF4', padding: '4px 8px', borderRadius: '4px' }}>🟢 Veg</span>}
                      {item.isBestSeller && <span style={{ fontSize: '11px', color: '#F59E0B', fontWeight: 600,
                        backgroundColor: '#FEF3C7', padding: '4px 8px', borderRadius: '4px' }}>🔥 Bestseller</span>}
                    </div>
                  </div>
                  <div style={{ position: 'relative', width: '120px', height: '120px', flexShrink: 0 }}>
                    <img src={getFoodImage(item.name)}
                       alt={item.name} style={{ width: '100%', height: '100%', borderRadius: '12px',
                         objectFit: 'cover', transition: 'transform 0.3s',
                         transform: hoveredItem === item.id ? 'scale(1.05)' : 'scale(1)' }}
                       onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop'; }} />
                    <button onClick={() => addToCart(item)}
                      style={{ position: 'absolute', bottom: '-12px', left: '50%', transform: 'translateX(-50%)',
                        backgroundColor: hoveredItem === item.id ? '#CB202D' : '#E23744',
                        color: 'white', border: 'none', padding: '8px 24px',
                        borderRadius: '9999px', cursor: 'pointer', fontWeight: 700, fontSize: '13px',
                        boxShadow: '0 4px 12px rgba(226,55,68,0.3)',
                        transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
                      + ADD
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '48px 24px', color: '#9CA3AF', fontSize: '18px' }}>No items found in this category</div>
        )}
      </div>

      {cartCount > 0 && (
        <div onClick={() => window.location.hash = '#/cart'}
          style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
            backgroundColor: 'white', color: '#1F2937', padding: '16px 28px', borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)', display: 'flex', gap: '24px',
            cursor: 'pointer', fontWeight: 700, zIndex: 50, alignItems: 'center',
            transition: 'all 0.3s', fontSize: '15px', border: '1px solid #E5E7EB', minWidth: '400px' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 12px 48px rgba(0,0,0,0.18)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)';
          }}>
          <div>
            <p style={{ fontWeight: 800, color: '#1F2937' }}>{cartCount} items in cart</p>
            <p style={{ fontSize: '13px', color: '#6B7280' }}>₹{cartTotal}</p>
          </div>
          <button style={{ backgroundColor: '#E23744', color: 'white', padding: '10px 24px', borderRadius: '9999px', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>View Cart →</button>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetail;
