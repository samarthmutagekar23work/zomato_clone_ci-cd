import React, { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { RESTAURANTS } from '../data/restaurants';
import { sanitizeSearchQuery, getRestaurantImage, getRatingColor } from '../utils/helpers';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const fuseInstance = useMemo(() => {
    return new Fuse(RESTAURANTS, {
      keys: [
        { name: 'name', weight: 0.5 },
        { name: 'cuisines', weight: 0.3 },
        { name: 'locality', weight: 0.1 },
        { name: 'city', weight: 0.1 }
      ],
      threshold: 0.3,
      includeScore: true
    });
  }, []);

  const results = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    return fuseInstance.search(sanitizeSearchQuery(query)).map(r => r.item);
  }, [query, fuseInstance]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <h1 style={{ fontSize: 'clamp(24px,4vw,40px)', fontWeight: 800, marginBottom: '24px' }}>
        Search Restaurants
      </h1>
    <div style={{ maxWidth: '600px', margin: '0 auto 32px',
        background: 'linear-gradient(135deg, rgba(30,41,59,0.8), rgba(51,65,85,0.8))', borderRadius: '16px', padding: '4px',
        display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', border: '1px solid rgba(226,55,68,0.2)' }}>
        <span style={{ fontSize: '20px', paddingLeft: '12px' }}>🔍</span>
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for restaurant, cuisine or a dish..."
          style={{ flex: 1, border: 'none', outline: 'none', fontSize: '16px', padding: '16px 12px', background: 'transparent', color: 'white' }}
          autoFocus />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '24px' }}>
        {results.map((r, idx) => (
          <div key={r.id} onClick={() => window.location.hash = '#/restaurant/' + r.id}
            style={{ cursor: 'pointer', borderRadius: '16px', overflow: 'hidden',
              backgroundColor: 'white', boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              animation: `fadeSlideUp 0.5s ease-out ${idx * 0.05}s both` }}>
            <div style={{ height: '180px', overflow: 'hidden' }}>
              <img src={getRestaurantImage(r)} alt={r.name} keyword={r.imageKeyword}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ padding: '16px' }}>
              <h3 style={{ fontWeight: 700, fontSize: '18px', marginBottom: '4px' }}>{r.name}</h3>
              <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '8px' }}>
                {r.cuisines.join(' • ')}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ backgroundColor: getRatingColor(r.rating) === 'green' ? '#22C55E' :
                  getRatingColor(r.rating) === 'yellow' ? '#EAB308' : '#EF4444',
                  color: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '14px', fontWeight: 700 }}>
                  ★ {r.rating}
                </span>
                <span style={{ color: '#6B7280', fontSize: '14px' }}>📍 {r.locality}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {results.length === 0 && query.length >= 2 && (
        <p style={{ textAlign: 'center', color: '#6B7280', marginTop: '32px' }}>No restaurants found.</p>
      )}
    </div>
  );
};

export default SearchPage;
