import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getRestaurantImage } from '../utils/helpers';
import { getFoodImage } from '../utils/foodApi';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const TrackOrder = () => {
  const [hash] = useState(() => window.location.hash);
  const orderId = hash.split('/')[2];
  const [order] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('zomato_order') || 'null');
    } catch {
      return null;
    }
  });
  const [status, setStatus] = useState(order ? order.status : 'confirmed');
  const [delivered, setDelivered] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const mapRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const routeLineRef = useRef(null);
  const animationRef = useRef(null);

  const driver = {
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    rating: 4.8,
    trips: 1247,
    vehicle: 'Honda Activa - KA 01 AB 1234',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    joiningDate: 'Jan 2022'
  };

  const restaurantCoords = React.useMemo(() => [12.9352, 77.6245], []);
  const userCoords = React.useMemo(() => [12.9716, 77.5946], []);
  const midCoords = React.useMemo(() => [
    [12.9450, 77.6150],
    [12.9550, 77.6050],
    [12.9650, 77.5980]
  ], []);

  const statusSteps = [
    { key: 'confirmed', label: 'Order Confirmed', icon: '✅' },
    { key: 'preparing', label: 'Preparing Food', icon: '👨‍🍳' },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: '🛵' },
    { key: 'delivered', label: 'Delivered', icon: '🎉' }
  ];

  useEffect(() => {
    if (!order) { window.location.hash = '#/'; return; }
    const interval = setInterval(() => {
      try {
        const stored = JSON.parse(localStorage.getItem('zomato_order') || 'null');
        if (stored) {
          setStatus(stored.status);
          if (stored.status === 'delivered') {
            setDelivered(true);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
          }
        }
      } catch (e) {
        console.error('Error reading order from localStorage:', e);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [order]);

  useEffect(() => {
    if (order && !mapRef.current) {
      try {
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        const map = L.map('map-container').setView([12.9534, 77.6095], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>',
          maxZoom: 18
        }).addTo(map);

        const restaurantIcon = L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        });
        L.marker(restaurantCoords, { icon: restaurantIcon }).addTo(map).bindPopup(`<b>${order.cart?.restaurantName || 'Restaurant'}</b><br>Order pickup location`);

        const userIcon = L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        });
        L.marker(userCoords, { icon: userIcon }).addTo(map).bindPopup('<b>Your Location</b><br>Delivery address');

        const deliveryIcon = L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        });

        driverMarkerRef.current = L.marker(restaurantCoords, { icon: deliveryIcon }).addTo(map).bindPopup('<b>Delivery Partner</b><br>On the way!');

        const routeCoords = [restaurantCoords, ...midCoords, userCoords];
        routeLineRef.current = L.polyline(routeCoords, {
          color: '#3B82F6',
          weight: 4,
          opacity: 0.7,
          dashArray: '10, 10'
        }).addTo(map);

        map.fitBounds(routeLineRef.current.getBounds(), { padding: [50, 50] });

        mapRef.current = map;
      } catch (e) {
        console.error('Error initializing map:', e);
      }
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [order, midCoords, restaurantCoords, userCoords]);

  useEffect(() => {
    if (!mapRef.current || !driverMarkerRef.current) return;

    let progress = 0;
    const allPoints = [restaurantCoords, ...midCoords, userCoords];

    const animateDriver = () => {
      if (status === 'delivered') {
        driverMarkerRef.current.setLatLng(userCoords);
        return;
      }

      if (status === 'out_for_delivery' && progress < 1) {
        progress += 0.003;
        if (progress > 1) progress = 1;

        const segmentIndex = Math.min(Math.floor(progress * (allPoints.length - 1)), allPoints.length - 2);
        const segmentProgress = (progress * (allPoints.length - 1)) - segmentIndex;

        const start = allPoints[segmentIndex];
        const end = allPoints[segmentIndex + 1];

        const lat = start[0] + (end[0] - start[0]) * segmentProgress;
        const lng = start[1] + (end[1] - start[1]) * segmentProgress;

        driverMarkerRef.current.setLatLng([lat, lng]);

        animationRef.current = requestAnimationFrame(animateDriver);
      } else if (status === 'confirmed' || status === 'preparing') {
        driverMarkerRef.current.setLatLng(restaurantCoords);
        animationRef.current = requestAnimationFrame(animateDriver);
      }
    };

    animationRef.current = requestAnimationFrame(animateDriver);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [status, midCoords, restaurantCoords, userCoords]);

  if (!order) return <div style={{ textAlign: 'center', padding: '80px 24px', background: '#0F172A', minHeight: '100vh', color: 'white' }}>Loading...</div>;

  const currentStep = statusSteps.findIndex(s => s.key === status);
  const cartItems = order.cart?.items || [];
  const restaurantName = order.cart?.restaurantName || 'Restaurant';

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0F172A, #1E293B)', padding: '24px' }}>
      {showConfetti && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }}>
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: '-10px',
              left: `${Math.random() * 100}%`,
              fontSize: '24px',
              animation: `confetti-fall ${2 + Math.random() * 3}s linear ${Math.random() * 2}s forwards`
            }}>
              {['🎉', '🎊', '✨', '🎈', '⭐', '❤️'][Math.floor(Math.random() * 6)]}
            </div>
          ))}
        </div>
      )}

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <button onClick={() => window.location.hash = '#/restaurants'} style={{ marginBottom: '20px', backgroundColor: '#E23744', color: 'white', padding: '14px 32px', borderRadius: '9999px', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 8px 24px rgba(226,55,68,0.4)', transition: 'all 0.3s ease' }}>← Back to Restaurants</button>
        <h1 style={{ fontSize: 'clamp(24px,4vw,40px)', fontWeight: 800, color: 'white', marginBottom: '24px' }}>
          Track Order: <span style={{ fontFamily: 'monospace', color: '#FF6B35' }}>{orderId}</span>
        </h1>

        <div style={{ background: 'linear-gradient(135deg, rgba(226,55,68,0.15), rgba(255,107,53,0.1))', border: '1px solid rgba(226,55,68,0.3)', borderRadius: '24px', padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', overflow: 'hidden', flexShrink: 0 }}>
              <img src={getRestaurantImage({ id: 'r1', imageKeyword: 'indian food' })} alt={restaurantName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <h3 style={{ color: 'white', fontSize: '20px', fontWeight: 700, margin: '0 0 4px' }}>{restaurantName}</h3>
              <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>📍 {order.form?.city || 'Bangalore'}</p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
            {statusSteps.map((step, idx) => (
              <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, color: idx <= currentStep ? '#22C55E' : '#9CA3AF' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{step.icon}</div>
                <span style={{ fontSize: '12px', fontWeight: 600, textAlign: 'center' }}>{step.label}</span>
              </div>
            ))}
          </div>

          <div id="map-container" style={{ height: '300px', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px' }} />

          {delivered && (
            <div style={{ marginTop: '16px', padding: '20px', backgroundColor: '#FEF3C7', borderRadius: '12px', textAlign: 'center', border: '2px solid #F59E0B' }}>
              <p style={{ fontWeight: 800, color: '#92400E', fontSize: '24px', marginBottom: '8px' }}>
                🎉 Order Delivered!
              </p>
              <p style={{ color: '#78350F', fontSize: '16px' }}>
                Enjoy your meal! Don't forget to rate your experience. ⭐
              </p>
            </div>
          )}

          <div style={{ marginTop: '24px', padding: '16px', backgroundColor: 'rgba(16,185,129,0.1)', borderRadius: '12px', textAlign: 'center' }}>
            <p style={{ fontWeight: 700, color: '#166534', fontSize: '16px' }}>Estimated Delivery: 25-30 mins</p>
            <p style={{ color: '#15803D', fontSize: '14px', margin: '4px 0 0' }}>Your food is being prepared with love! 🍽️</p>
          </div>

          {order.paymentMethod && (
            <div style={{ marginTop: '16px', padding: '12px 16px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', textAlign: 'center' }}>
              <p style={{ color: '#94A3B8', fontSize: '12px', marginBottom: '4px' }}>PAYMENT METHOD</p>
              <p style={{ color: 'white', fontWeight: 600, fontSize: '14px' }}>{order.paymentMethod}</p>
            </div>
          )}
        </div>

        <div style={{ background: 'linear-gradient(135deg, #1E293B, #0F172A)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
            <img src={driver.image} alt={driver.name} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #3B82F6' }} />
            <div style={{ flex: 1 }}>
              <h3 style={{ color: 'white', fontSize: '20px', fontWeight: 700, margin: '0 0 4px' }}>{driver.name}</h3>
              <p style={{ color: '#94A3B8', fontSize: '14px', margin: '0 0 4px' }}>📞 {driver.phone}</p>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <span style={{ color: '#22C55E', fontSize: '13px', fontWeight: 600 }}>⭐ {driver.rating} rating</span>
                <span style={{ color: '#94A3B8', fontSize: '13px' }}>🛵 {driver.trips} trips</span>
              </div>
            </div>
            <a href={`tel:${driver.phone}`} style={{ backgroundColor: '#22C55E', color: 'white', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>Call Driver</a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px' }}>
              <p style={{ color: '#94A3B8', fontSize: '12px', marginBottom: '4px' }}>VEHICLE</p>
              <p style={{ color: 'white', fontWeight: 600, fontSize: '14px' }}>{driver.vehicle}</p>
            </div>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px' }}>
              <p style={{ color: '#94A3B8', fontSize: '12px', marginBottom: '4px' }}>JOINING DATE</p>
              <p style={{ color: 'white', fontWeight: 600, fontSize: '14px' }}>{driver.joiningDate}</p>
            </div>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px' }}>
              <p style={{ color: '#94A3B8', fontSize: '12px', marginBottom: '4px' }}>STATUS</p>
              <p style={{ color: '#22C55E', fontWeight: 600, fontSize: '14px' }}>{status === 'out_for_delivery' ? 'On the way' : status === 'delivered' ? 'Delivered' : 'Assigned'}</p>
            </div>
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #1E293B, #0F172A)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ color: 'white', fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Order Items</h3>
          {cartItems.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px 0', borderBottom: idx === cartItems.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                <img src={getFoodImage(item.name)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: 'white', fontWeight: 600, fontSize: '14px', margin: '0 0 2px' }}>{item.qty}x {item.name}</p>
                <p style={{ color: '#10B981', fontWeight: 700, fontSize: '13px', margin: 0 }}>₹{item.price * item.qty}</p>
              </div>
            </div>
          ))}
        </div>

        <a href="#/restaurants" style={{ display: 'block', textAlign: 'center', padding: '12px 24px',
          backgroundColor: 'transparent', border: '2px solid rgba(255,255,255,0.2)', borderRadius: '12px',
          textDecoration: 'none', fontWeight: 600, color: '#94A3B8' }}>Order More Food</a>

        <style>{`
          @keyframes confetti-fall {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default TrackOrder;
