import React, { useState, useMemo } from 'react';
import { RESTAURANTS } from '../data/restaurants';
import { CITIES, CUISINE_EMOJIS } from '../utils/constants';
import { getRestaurantImage, getCityImage, getCuisineImage } from '../utils/helpers';

const CityCard = ({ city, idx }) => {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const restaurantCount = RESTAURANTS.filter(r => r.city === city).length;
  const fallbackColors = {
    'Bangalore': ['#E23744', '#f87171'], 'Mumbai': ['#3B82F6', '#60A5FA'], 'Delhi': ['#F59E0B', '#FBBF24'],
    'Pune': ['#10B981', '#34D399'], 'Hyderabad': ['#8B5CF6', '#A78BFA'], 'Chennai': ['#EC4899', '#F472B6'],
    'Kolkata': ['#06B6D4', '#22D3EE'], 'Ahmedabad': ['#F97316', '#FB923C']
  };
  
  return (
    <div className="city-card-new"
      onClick={() => {
        localStorage.setItem('zomato_city', city);
        window.location.hash = '#/restaurants';
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ animationDelay: `${idx * 0.05}s` }}>
      <div className="city-card-image-container">
        {imgError ? (
          <div className="city-gradient-placeholder" style={{ background: `linear-gradient(135deg, ${fallbackColors[city]?.[0] || '#E23744'}, ${fallbackColors[city]?.[1] || '#f87171'})` }}>
            <span className="city-initial">{city[0]}</span>
          </div>
        ) : (
          <img src={getCityImage(city)} alt={city} className="city-card-image" onError={(e) => { 
            console.log(`Failed to load image for ${city}:`, e.target.src);
            setImgError(true); 
          }} />
        )}
        <div className="city-card-overlay" style={{ opacity: hovered ? 1 : 0, transform: hovered ? 'translateY(0)' : 'translateY(20px)' }}>
          <span className="city-card-explore-text">
            Explore {restaurantCount}+ Restaurants
          </span>
        </div>
      </div>
      <div className="city-card-info" style={{ backgroundColor: hovered ? '#FEF2F2' : 'white', transition: 'background-color 0.3s' }}>
        <h3 className="city-card-name" style={{ color: hovered ? '#E23744' : '#111827' }}>
          {city}
          <span className="city-card-arrow">→</span>
        </h3>
      </div>
    </div>
  );
};

const RestaurantCard = ({ restaurant, idx }) => {
  const [imgError, setImgError] = useState(false);
  
  return (
    <div key={restaurant.id} className="restaurant-card-unified" style={{ animationDelay: `${idx * 0.05}s` }}
      onClick={() => window.location.hash = `#/restaurant/${restaurant.id}`}>
      <div className="restaurant-card-img-wrapper">
        {imgError ? (
          <div className="restaurant-image-fallback" style={{ background: 'linear-gradient(135deg, #1E293B, #334155)', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '48px' }}>{restaurant.name[0]}</span>
          </div>
        ) : (
          <img src={getRestaurantImage(restaurant)} alt={restaurant.name} className="restaurant-card-img" onError={(e) => { setImgError(true); }} />
        )}
        {restaurant.offers?.length > 0 && (
          <div className="restaurant-offer-badge-unified">
            {restaurant.offers[0]}
          </div>
        )}
      </div>
      <div className="restaurant-card-info-unified">
        <h3 className="restaurant-card-title-unified">{restaurant.name}</h3>
        <p className="restaurant-card-cuisines-unified">{restaurant.cuisines.slice(0, 2).join(' • ')}</p>
        <div className="restaurant-card-meta-unified">
          <span className="restaurant-card-rating-unified" style={{ backgroundColor: restaurant.rating >= 4 ? '#10B981' : restaurant.rating >= 3 ? '#F59E0B' : '#EF4444' }}>
            ⭐ {restaurant.rating}
          </span>
          <span className="restaurant-card-time-unified">🕐 {restaurant.deliveryTime} min</span>
          <span className="restaurant-card-cost-unified">₹{restaurant.costForTwo}</span>
        </div>
        <p className="restaurant-card-location-unified">📍 {restaurant.locality}</p>
      </div>
    </div>
  );
};

const CuisineCard = ({ cuisine, idx }) => {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  
  return (
    <div key={cuisine} className="cuisine-card-new" style={{ animationDelay: `${idx * 0.05}s` }}
      onClick={() => window.location.hash = '#/restaurants'}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      <div className="cuisine-card-bg-animation">
        <div className="cuisine-bg-orb"></div>
        <span className="cuisine-bg-emoji">{CUISINE_EMOJIS[cuisine] || '🍽️'}</span>
      </div>
      <div className="cuisine-card-image-wrapper">
        {imgError ? (
          <div className="cuisine-photo-fallback" style={{ background: 'linear-gradient(135deg, #1E293B, #334155)', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '48px' }}>{CUISINE_EMOJIS[cuisine] || '🍽️'}</span>
          </div>
        ) : (
          <img src={getCuisineImage(cuisine)} alt={cuisine} className="cuisine-card-img" onError={() => setImgError(true)} />
        )}
        <div className="cuisine-card-overlay" style={{ opacity: hovered ? 1 : 0 }}>
          <span className="cuisine-card-emoji-large">{CUISINE_EMOJIS[cuisine] || '🍽️'}</span>
        </div>
      </div>
      <div className="cuisine-card-label-new">
        <span>{cuisine}</span>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [city] = useState(() => localStorage.getItem('zomato_city') || 'Bangalore');
  const cityRestaurants = useMemo(() => RESTAURANTS.filter(r => r.city === city).slice(0, 20), [city]);

  const cuisines = ['Biryani', 'Pizza', 'Burger', 'Chinese', 'South Indian', 'North Indian', 'Desserts', 'Beverages'];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-white">
        <div className="hero-animated-bg">
          <div className="hero-wave hero-wave-1"></div>
          <div className="hero-wave hero-wave-2"></div>
          <div className="hero-wave hero-wave-3"></div>
          
          <div className="hero-circle hero-circle-1"></div>
          <div className="hero-circle hero-circle-2"></div>
          <div className="hero-circle hero-circle-3"></div>
          <div className="hero-circle hero-circle-4"></div>
          <div className="hero-circle hero-circle-5"></div>
          
          {['🍕', '🍔', '🍜', '🥗', '🍛', '🍣', '🌮', '🍰', '☕', '🧋'].map((emoji, i) => (
            <div key={i} className="hero-emoji-float" style={{ '--i': i, '--duration': `${8 + i * 0.5}s` }}>
              {emoji}
            </div>
          ))}
        </div>
        
        <div className="hero-white-content">
          <div className="hero-white-top-content">
            <h1 className="hero-white-title">
              Discover the best food in {city}
            </h1>
            <p className="hero-white-subtitle">
              Order from 7000+ restaurants
            </p>
          </div>
          
          <div className="hero-search-container">
            <div className="hero-search-inner">
              <div className="hero-search-location" onClick={() => window.location.hash = '#/restaurants'}>
                <span className="location-icon">📍</span>
                <span className="location-text">{city}</span>
                <span className="location-chevron">▼</span>
              </div>
              <input
                type="text"
                placeholder="Search for restaurant, cuisine or a dish"
                className="hero-search-input-large"
                onFocus={(e) => e.target.style.borderColor = '#E23744'}
                onBlur={(e) => e.target.style.borderColor = 'transparent'}
              />
              <button className="hero-search-btn-main">
                <span className="btn-icon">🔍</span>
                <span>Search</span>
              </button>
            </div>
          </div>
          
          {/* Animated particles after search bar */}
          <div className="hero-particles">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="hero-particle" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
                fontSize: `${12 + Math.random() * 20}px`,
                opacity: 0.3 + Math.random() * 0.4
              }}>
                {['✨', '💫', '⭐', '🌟', '✨'][Math.floor(Math.random() * 5)]}
              </div>
            ))}
          </div>
        </div>
        
        <div className="hero-white-bg-overlay"></div>
      </section>

      {/* Cities Section - Big Card with Running Animations */}
      <section className="section-padding section-cities-unified">
        <div className="cities-big-card-bg">
          <div className="cities-running-line cities-running-line-1">
            {[...Array(15)].map((_, i) => (
              <span key={i} className="city-emoji">{['🏙️', '🌆', '🌇', '🌃', '🌉', '🗼', '🏛️', '🌍', '✨', '🌟', '💫', '🎆', '🌠', '🎇', '🌌'][i]}</span>
            ))}
          </div>
          <div className="cities-running-line cities-running-line-2">
            {[...Array(15)].map((_, i) => (
              <span key={i} className="city-emoji">{['🏙️', '🌆', '🌇', '🌃', '🌉', '🗼', '🏛️', '🌍', '✨', '🌟', '💫', '🎆', '🌠', '🎇', '🌌'][i]}</span>
            ))}
          </div>
          <div className="cities-running-line cities-running-line-3">
            {[...Array(15)].map((_, i) => (
              <span key={i} className="city-emoji">{['🏙️', '🌆', '🌇', '🌃', '🌉', '🗼', '🏛️', '🌍', '✨', '🌟', '💫', '🎆', '🌠', '🎇', '🌌'][i]}</span>
            ))}
          </div>
          <div className="cities-glow-orb cities-glow-orb-1"></div>
          <div className="cities-glow-orb cities-glow-orb-2"></div>
          <div className="cities-glow-orb cities-glow-orb-3"></div>
        </div>
        
        <div className="container-center">
          <div className="section-header">
            <h2 className="section-title">
              Popular Cities
            </h2>
            <p className="section-subtitle">
              Explore restaurants in your favorite city
            </p>
            <div className="title-underline"></div>
          </div>
          
          <div className="cities-big-card">
            <div className="cities-big-card-inner">
              <div className="cities-bg-animation-layer">
                {[...Array(6)].map((_, i) => (
                  <div key={`orb-${i}`} className="city-bg-orb" style={{
                    left: `${10 + i * 15}%`,
                    top: `${20 + (i % 3) * 25}%`,
                    animationDelay: `${i * 1.5}s`,
                    width: `${200 + i * 50}px`,
                    height: `${200 + i * 50}px`,
                    background: `radial-gradient(circle, rgba(${59 + i * 20}, ${130 + i * 10}, ${246 - i * 20}, 0.12), transparent)`
                  }}></div>
                ))}
                {[...Array(8)].map((_, i) => (
                  <div key={`emoji-${i}`} className="city-float-emoji" style={{
                    left: `${5 + i * 12}%`,
                    top: `${10 + (i % 2) * 80}%`,
                    animationDelay: `${i * 2}s`,
                    fontSize: `${24 + (i % 3) * 12}px`
                  }}>
                    {['🏙️', '🌆', '🌇', '🌃', '🌉', '🗼', '🏛️', '✨'][i]}
                  </div>
                ))}
              </div>
              <div className="cities-grid-unified">
                {CITIES.map((cityName, idx) => (
                  <CityCard key={cityName} city={cityName} idx={idx} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Restaurant Chains - Big Card with Running Animations */}
      <section className="section-padding section-restaurants-unified">
        <div className="restaurants-big-card-bg">
          <div className="restaurants-running-line restaurants-running-line-1">
            {[...Array(12)].map((_, i) => (
              <span key={i} className="running-emoji">{['🍕', '🍔', '🍜', '🥗', '🍛', '🍣', '🌮', '🍰', '🥘', '🍲', '🥙', '🍝'][i]}</span>
            ))}
          </div>
          <div className="restaurants-running-line restaurants-running-line-2">
            {[...Array(12)].map((_, i) => (
              <span key={i} className="running-emoji">{['🍕', '🍔', '🍜', '🥗', '🍛', '🍣', '🌮', '🍰', '🥘', '🍲', '🥙', '🍝'][i]}</span>
            ))}
          </div>
          <div className="restaurants-running-line restaurants-running-line-3">
            {[...Array(12)].map((_, i) => (
              <span key={i} className="running-emoji">{['🍕', '🍔', '🍜', '🥗', '🍛', '🍣', '🌮', '🍰', '🥘', '🍲', '🥙', '🍝'][i]}</span>
            ))}
          </div>
          <div className="restaurants-glow-orb restaurants-glow-orb-1"></div>
          <div className="restaurants-glow-orb restaurants-glow-orb-2"></div>
          <div className="restaurants-glow-orb restaurants-glow-orb-3"></div>
        </div>
        
        <div className="container-center">
          <div className="section-header">
            <h2 className="section-title">Top Restaurant Chains</h2>
            <p className="section-subtitle">Popular dining destinations</p>
            <div className="title-underline"></div>
          </div>
          
          <div className="restaurants-big-card">
            <div className="restaurants-grid-unified">
              {cityRestaurants.map((restaurant, idx) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} idx={idx} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cuisines Section with Big Card and Animations */}
      <section className="section-padding">
        <div className="container-center">
          <div className="section-header">
            <h2 className="section-title">
              Popular Cuisines
            </h2>
            <p className="section-subtitle">
              Choose from a variety of cuisines
            </p>
            <div className="title-underline"></div>
          </div>
          
          <div className="cuisines-big-card-wrapper">
            <div className="cuisines-big-card-bg">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="cuisines-big-orb" style={{
                  left: `${10 + i * 15}%`,
                  top: `${20 + (i % 3) * 25}%`,
                  animationDelay: `${i * 1.5}s`,
                  width: `${200 + i * 50}px`,
                  height: `${200 + i * 50}px`,
                  background: `radial-gradient(circle, rgba(${226 + i * 5}, ${55 + i * 10}, ${68 + i * 15}, 0.15), transparent)`
                }}></div>
              ))}
              {[...Array(8)].map((_, i) => (
                <div key={`float-${i}`} className="cuisines-float-emoji" style={{
                  left: `${5 + i * 12}%`,
                  top: `${10 + (i % 2) * 80}%`,
                  animationDelay: `${i * 2}s`,
                  fontSize: `${24 + (i % 3) * 12}px`
                }}>
                  {['🍕', '🍔', '🍜', '🥗', '🍛', '🍣', '🌮', '🍰'][i]}
                </div>
              ))}
              {[...Array(10)].map((_, i) => (
                <div key={`spark-${i}`} className="cuisines-sparkle" style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 4}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}>
                  ✨
                </div>
              ))}
            </div>
            
            <div className="cuisines-grid-photos">
              {cuisines.map((cuisine, idx) => (
                <CuisineCard key={cuisine} cuisine={cuisine} idx={idx} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="website-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-logo">🍽️ Zomato Clone</h3>
            <p className="footer-description">
              Discover the best food & drinks in your city. Order online from 7000+ restaurants.
            </p>
            <div className="footer-social">
              <span className="social-icon">📘</span>
              <span className="social-icon">📸</span>
              <span className="social-icon">🐦</span>
              <span className="social-icon">📺</span>
            </div>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-heading">About Zomato</h4>
            <ul className="footer-links">
              <li>Who We Are</li>
              <li>Blog</li>
              <li>Careers</li>
              <li>Report Fraud</li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-heading">For Restaurants</h4>
            <ul className="footer-links">
              <li>Partner With Us</li>
              <li>Apps For You</li>
              <li>Advertise</li>
              <li>Zomato Pro</li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-heading">Learn More</h4>
            <ul className="footer-links">
              <li>Privacy</li>
              <li>Security</li>
              <li>Terms</li>
              <li>Sitemap</li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2024 Zomato Clone - Built with React. This is a demo project.</p>
          <p className="footer-heart">Made with ❤️ for food lovers</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
