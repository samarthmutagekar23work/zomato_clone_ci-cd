import React, { useState, useMemo } from 'react';
import { RESTAURANTS } from '../data/restaurants';
import { getRestaurantImage, getRatingColor } from '../utils/helpers';

const RestaurantsList = () => {
  const [city] = useState(() => localStorage.getItem('zomato_city') || 'Bangalore');
  const [filters, setFilters] = useState({ rating: 0, cost: 0, veg: false, open: false, offers: false });
  const [sortBy, setSortBy] = useState('relevance');
  const [displayCount, setDisplayCount] = useState(1000);

  const filtered = useMemo(() => {
    let results = RESTAURANTS.filter(r => r.city === city);
    if (filters.rating > 0) results = results.filter(r => r.rating >= filters.rating);
    if (filters.cost > 0) results = results.filter(r => r.costForTwo <= filters.cost);
    if (filters.veg) results = results.filter(r => r.isVeg);
    if (filters.open) results = results.filter(r => r.isOpen);
    if (filters.offers) results = results.filter(r => r.offers.length > 0);

    if (sortBy === 'rating') results.sort((a, b) => b.rating - a.rating);
    if (sortBy === 'delivery') results.sort((a, b) => a.deliveryTime - b.deliveryTime);
    if (sortBy === 'cost-low') results.sort((a, b) => a.costForTwo - b.costForTwo);
    if (sortBy === 'cost-high') results.sort((a, b) => b.costForTwo - a.costForTwo);

    return results;
  }, [city, filters, sortBy]);

  const displayed = filtered.slice(0, displayCount);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', display: 'flex', gap: '24px' }}>
      {/* Filters Sidebar */}
      <aside style={{ width: '260px', flexShrink: 0, display: { md: 'block', none: 'none' } }}>
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)', position: 'sticky', top: '80px' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '16px' }}>Filters</h3>

          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>Rating</p>
            {[4.5, 4.0, 3.5, 0].map(r => (
              <label key={r} style={{ display: 'flex', alignItems: 'center', gap: '8px',
                padding: '6px 0', cursor: 'pointer', fontSize: '14px' }}>
                <input type="radio" name="rating" checked={filters.rating === r}
                  onChange={() => setFilters({ ...filters, rating: r })} />
                {r === 0 ? 'All' : `★ ${r}+`}
              </label>
            ))}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>Cost for Two</p>
            {[300, 500, 1000, 0].map(c => (
              <label key={c} style={{ display: 'flex', alignItems: 'center', gap: '8px',
                padding: '6px 0', cursor: 'pointer', fontSize: '14px' }}>
                <input type="radio" name="cost" checked={filters.cost === c}
                  onChange={() => setFilters({ ...filters, cost: c })} />
                {c === 0 ? 'All' : `₹${c}`}
              </label>
            ))}
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
            padding: '8px 0', fontSize: '14px' }}>
            <input type="checkbox" checked={filters.veg} onChange={(e) => setFilters({ ...filters, veg: e.target.checked })} />
            🟢 Pure Veg
          </label>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
          <h1 style={{ fontSize: 'clamp(24px,4vw,40px)', fontWeight: 800, background: 'linear-gradient(135deg, #E23744, #FF6B35)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', filter: 'drop-shadow(0 2px 8px rgba(226,55,68,0.3))' }}>
            Restaurants in {city}
            <span style={{ fontSize: '16px', fontWeight: 400, color: '#6B7280', marginLeft: '12px' }}>
              ({filtered.length} found)
            </span>
          </h1>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { value: 'relevance', label: '✨ Relevance' },
              { value: 'rating', label: '⭐ Rating' },
              { value: 'delivery', label: '🚀 Fast Delivery' },
              { value: 'cost-low', label: '💰 Cost: Low to High' },
              { value: 'cost-high', label: '💎 Cost: High to Low' }
            ].map(({ value, label }) => (
              <button key={value} onClick={() => setSortBy(value)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '14px',
                  backgroundColor: sortBy === value ? '#E23744' : 'white',
                  color: sortBy === value ? 'white' : '#374151',
                  boxShadow: sortBy === value ? '0 4px 12px rgba(226,55,68,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
                  transform: sortBy === value ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.3s ease'
                }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px' }}>
          {displayed.map((r, idx) => (
            <div key={r.id} onClick={() => window.location.hash = '#/restaurant/' + r.id}
              style={{ cursor: 'pointer', borderRadius: '16px', overflow: 'hidden',
                backgroundColor: 'white', boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                animation: `fadeSlideUp 0.5s ease-out ${idx * 0.05}s both` }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 24px 64px rgba(0,0,0,0.18)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
              }}>
              <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                <img src={getRestaurantImage(r)} alt={r.name} keyword={r.imageKeyword}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop'; }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'} />
                {r.isPromoted && (
                  <span style={{ position: 'absolute', top: '12px', left: '12px',
                    backgroundColor: '#E23744', color: 'white', padding: '4px 12px',
                    borderRadius: '6px', fontSize: '12px', fontWeight: 700 }}>
                    Promoted
                  </span>
                )}
              </div>
              <div style={{ padding: '16px' }}>
                <h3 style={{ fontWeight: 700, fontSize: '18px', marginBottom: '4px' }}>{r.name}</h3>
                <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '8px' }}>
                  {r.cuisines.join(' • ')}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ backgroundColor: getRatingColor(r.rating) === 'green' ? '#22C55E' :
                    getRatingColor(r.rating) === 'yellow' ? '#EAB308' : '#EF4444',
                    color: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '14px', fontWeight: 700 }}>
                    ★ {r.rating}
                  </span>
                  <span style={{ color: '#6B7280', fontSize: '14px' }}>{r.deliveryTime} mins</span>
                  <span style={{ color: '#6B7280', fontSize: '14px' }}>₹{r.costForTwo} for two</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {displayCount < filtered.length && (
          <button onClick={() => setDisplayCount(displayCount + 20)}
            style={{ display: 'block', margin: '32px auto', padding: '12px 48px',
              backgroundColor: '#E23744', color: 'white', border: 'none', borderRadius: '12px',
              fontSize: '16px', fontWeight: 600, cursor: 'pointer' }}>
            Load More
          </button>
        )}
      </div>
    </div>
  );
};

export default RestaurantsList;
