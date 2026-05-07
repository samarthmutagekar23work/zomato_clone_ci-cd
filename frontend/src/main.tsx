import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Types
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isVeg: boolean;
  rating: number;
}

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: number;
  costForTwo: number;
  locality: string;
  image: string;
  menu: MenuItem[];
}

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
}

interface Driver {
  name: string;
  phone: string;
  rating: number;
  trips: number;
  vehicle: string;
  image: string;
}

interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'preparing' | 'picked_up' | 'on_the_way' | 'delivered';
  driver: Driver;
  estimatedTime: number;
  restaurantLocation: [number, number];
  userLocation: [number, number];
}

interface User {
  name: string;
  email: string;
  photo: string;
}

// Mock restaurant data with unique menus and food images
const restaurants: Restaurant[] = [
  {
    id: 'r1',
    name: 'Spice Paradise',
    cuisine: 'North Indian, Mughlai',
    rating: 4.5,
    deliveryTime: 30,
    costForTwo: 600,
    locality: 'Koramangala',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=250&fit=crop',
    menu: [
      { id: 'm1', name: 'Butter Chicken', description: 'Rich and creamy tomato-based curry with tender chicken pieces', price: 320, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=200&fit=crop', category: 'Main Course', isVeg: false, rating: 4.7 },
      { id: 'm2', name: 'Paneer Tikka Masala', description: 'Grilled cottage cheese in spicy onion-tomato gravy', price: 280, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300&h=200&fit=crop', category: 'Main Course', isVeg: true, rating: 4.5 },
      { id: 'm3', name: 'Garlic Naan', description: 'Soft flatbread with garlic and butter', price: 60, image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=300&h=200&fit=crop', category: 'Breads', isVeg: true, rating: 4.6 },
      { id: 'm4', name: 'Dal Makhani', description: 'Slow-cooked black lentils in buttery cream', price: 220, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop', category: 'Main Course', isVeg: true, rating: 4.4 },
      { id: 'm5', name: 'Chicken Biryani', description: 'Aromatic basmati rice with spiced chicken', price: 350, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&h=200&fit=crop', category: 'Biryani', isVeg: false, rating: 4.8 },
      { id: 'm6', name: 'Gulab Jamun', description: 'Soft milk dumplings in sweet syrup', price: 120, image: 'https://images.unsplash.com/photo-1666190077588-55b0f5a3d585?w=300&h=200&fit=crop', category: 'Desserts', isVeg: true, rating: 4.3 },
      { id: 'm7', name: 'Tandoori Chicken', description: 'Whole chicken marinated in yogurt and spices', price: 420, image: 'https://images.unsplash.com/photo-1610057099443-fde6c99db9e1?w=300&h=200&fit=crop', category: 'Starters', isVeg: false, rating: 4.6 },
      { id: 'm8', name: 'Veg Fried Rice', description: 'Wok-tossed rice with mixed vegetables', price: 180, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=200&fit=crop', category: 'Rice', isVeg: true, rating: 4.2 },
    ],
  },
  {
    id: 'r2',
    name: 'Pizza Paradise',
    cuisine: 'Italian, Pizza, Pasta',
    rating: 4.3,
    deliveryTime: 35,
    costForTwo: 800,
    locality: 'Indiranagar',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=250&fit=crop',
    menu: [
      { id: 'm9', name: 'Margherita Pizza', description: 'Classic pizza with fresh mozzarella, tomatoes, and basil', price: 299, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=200&fit=crop', category: 'Pizza', isVeg: true, rating: 4.5 },
      { id: 'm10', name: 'Pepperoni Pizza', description: 'Loaded with spicy pepperoni and extra cheese', price: 399, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&h=200&fit=crop', category: 'Pizza', isVeg: false, rating: 4.7 },
      { id: 'm11', name: 'Penne Arrabiata', description: 'Penne pasta in spicy tomato sauce', price: 249, image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=300&h=200&fit=crop', category: 'Pasta', isVeg: true, rating: 4.3 },
      { id: 'm12', name: 'Garlic Bread', description: 'Toasted bread with garlic butter and herbs', price: 149, image: 'https://images.unsplash.com/photo-1573140401552-38a6147a39c1?w=300&h=200&fit=crop', category: 'Starters', isVeg: true, rating: 4.4 },
      { id: 'm13', name: 'Farmhouse Pizza', description: 'Fresh veggies, olives, and mushrooms on crispy crust', price: 349, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=200&fit=crop', category: 'Pizza', isVeg: true, rating: 4.2 },
      { id: 'm14', name: 'Alfredo Pasta', description: 'Creamy white sauce pasta with parmesan', price: 279, image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=300&h=200&fit=crop', category: 'Pasta', isVeg: true, rating: 4.5 },
      { id: 'm15', name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with molten center', price: 199, image: 'https://images.unsplash.com/photo-1624353363682-586c6326e442?w=300&h=200&fit=crop', category: 'Desserts', isVeg: true, rating: 4.8 },
      { id: 'm16', name: 'Caesar Salad', description: 'Crisp romaine with Caesar dressing and croutons', price: 229, image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop', category: 'Salads', isVeg: true, rating: 4.1 },
    ],
  },
  {
    id: 'r3',
    name: 'Dragon Wok',
    cuisine: 'Chinese, Thai, Asian',
    rating: 4.2,
    deliveryTime: 40,
    costForTwo: 500,
    locality: 'HSR Layout',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=250&fit=crop',
    menu: [
      { id: 'm17', name: 'Hakka Noodles', description: 'Stir-fried noodles with vegetables and soy sauce', price: 199, image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=300&h=200&fit=crop', category: 'Noodles', isVeg: true, rating: 4.4 },
      { id: 'm18', name: 'Chicken Manchurian', description: 'Crispy chicken in tangy Manchurian sauce', price: 279, image: 'https://images.unsplash.com/photo-1525755662778-929ea6083e29?w=300&h=200&fit=crop', category: 'Starters', isVeg: false, rating: 4.6 },
      { id: 'm19', name: 'Dim Sum Platter', description: 'Assorted steamed dumplings with dipping sauce', price: 349, image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=300&h=200&fit=crop', category: 'Starters', isVeg: false, rating: 4.7 },
      { id: 'm20', name: 'Thai Green Curry', description: 'Aromatic coconut curry with vegetables', price: 329, image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=300&h=200&fit=crop', category: 'Curry', isVeg: true, rating: 4.5 },
      { id: 'm21', name: 'Fried Rice', description: 'Classic Chinese fried rice with egg and vegetables', price: 179, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=200&fit=crop', category: 'Rice', isVeg: true, rating: 4.3 },
      { id: 'm22', name: 'Szechuan Chicken', description: 'Spicy chicken with Szechuan peppercorns', price: 299, image: 'https://images.unsplash.com/photo-1525755662778-929ea6083e29?w=300&h=200&fit=crop', category: 'Main Course', isVeg: false, rating: 4.4 },
      { id: 'm23', name: 'Spring Rolls', description: 'Crispy rolls stuffed with vegetables', price: 159, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&h=200&fit=crop', category: 'Starters', isVeg: true, rating: 4.2 },
      { id: 'm24', name: 'Hot & Sour Soup', description: 'Spicy and tangy soup with mushrooms and tofu', price: 149, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&h=200&fit=crop', category: 'Soups', isVeg: true, rating: 4.5 },
    ],
  },
  {
    id: 'r4',
    name: 'Burger Barn',
    cuisine: 'American, Burgers, Fries',
    rating: 4.1,
    deliveryTime: 25,
    costForTwo: 400,
    locality: 'Whitefield',
    image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&h=250&fit=crop',
    menu: [
      { id: 'm25', name: 'Classic Cheeseburger', description: 'Juicy beef patty with melted cheddar and special sauce', price: 249, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop', category: 'Burgers', isVeg: false, rating: 4.6 },
      { id: 'm26', name: 'Crispy Chicken Burger', description: 'Fried chicken fillet with coleslaw and mayo', price: 229, image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=300&h=200&fit=crop', category: 'Burgers', isVeg: false, rating: 4.5 },
      { id: 'm27', name: 'Loaded Fries', description: 'Crispy fries topped with cheese sauce and bacon', price: 179, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop', category: 'Sides', isVeg: false, rating: 4.4 },
      { id: 'm28', name: 'Veggie Burger', description: 'Plant-based patty with fresh veggies and avocado', price: 219, image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=300&h=200&fit=crop', category: 'Burgers', isVeg: true, rating: 4.2 },
      { id: 'm29', name: 'Milkshake', description: 'Thick creamy milkshake in chocolate/vanilla/strawberry', price: 149, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&h=200&fit=crop', category: 'Beverages', isVeg: true, rating: 4.7 },
      { id: 'm30', name: 'Onion Rings', description: 'Beer-battered crispy onion rings', price: 129, image: 'https://images.unsplash.com/photo-1639024471283-03518888f59d?w=300&h=200&fit=crop', category: 'Sides', isVeg: true, rating: 4.3 },
      { id: 'm31', name: 'BBQ Bacon Burger', description: 'Smoky BBQ sauce, crispy bacon, and cheddar', price: 299, image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=300&h=200&fit=crop', category: 'Burgers', isVeg: false, rating: 4.8 },
      { id: 'm32', name: 'Iced Coffee', description: 'Cold brew coffee with cream and caramel', price: 139, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=200&fit=crop', category: 'Beverages', isVeg: true, rating: 4.4 },
    ],
  },
  {
    id: 'r5',
    name: 'Dosa Delight',
    cuisine: 'South Indian, Dosa, Idli',
    rating: 4.6,
    deliveryTime: 20,
    costForTwo: 350,
    locality: 'Jayanagar',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=250&fit=crop',
    menu: [
      { id: 'm33', name: 'Masala Dosa', description: 'Crispy crepe filled with spiced potato masala', price: 120, image: 'https://images.unsplash.com/photo-1630383249896-424e484df988?w=300&h=200&fit=crop', category: 'Dosa', isVeg: true, rating: 4.8 },
      { id: 'm34', name: 'Idli Sambar', description: 'Soft steamed rice cakes with lentil soup', price: 80, image: 'https://images.unsplash.com/photo-1589301773859-b9af2f36b693?w=300&h=200&fit=crop', category: 'Idli', isVeg: true, rating: 4.6 },
      { id: 'm35', name: 'Paper Roast Dosa', description: 'Extra thin crispy dosa served with chutneys', price: 140, image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=300&h=200&fit=crop', category: 'Dosa', isVeg: true, rating: 4.7 },
      { id: 'm36', name: 'Uttapam', description: 'Thick savory pancake with onions and tomatoes', price: 110, image: 'https://images.unsplash.com/photo-1630383249896-424e484df988?w=300&h=200&fit=crop', category: 'Uttapam', isVeg: true, rating: 4.4 },
      { id: 'm37', name: 'Vada', description: 'Crispy fried lentil donut with coconut chutney', price: 70, image: 'https://images.unsplash.com/photo-1668236555542-83bd53e4f957?w=300&h=200&fit=crop', category: 'Starters', isVeg: true, rating: 4.5 },
      { id: 'm38', name: 'Pongal', description: 'Comforting rice and lentil porridge with ghee', price: 90, image: 'https://images.unsplash.com/photo-1567171466295-4afa78478e91?w=300&h=200&fit=crop', category: 'Rice', isVeg: true, rating: 4.3 },
      { id: 'm39', name: 'Filter Coffee', description: 'Traditional South Indian strong coffee', price: 50, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=200&fit=crop', category: 'Beverages', isVeg: true, rating: 4.9 },
      { id: 'm40', name: 'Paneer Dosa', description: 'Dosa stuffed with spiced paneer filling', price: 160, image: 'https://images.unsplash.com/photo-1630383249896-424e484df988?w=300&h=200&fit=crop', category: 'Dosa', isVeg: true, rating: 4.6 },
    ],
  },
  {
    id: 'r6',
    name: 'Sushi House',
    cuisine: 'Japanese, Sushi, Ramen',
    rating: 4.4,
    deliveryTime: 45,
    costForTwo: 1000,
    locality: 'MG Road',
    image: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=400&h=250&fit=crop',
    menu: [
      { id: 'm41', name: 'Salmon Sushi Roll', description: 'Fresh salmon with avocado and rice', price: 449, image: 'https://images.unsplash.com/photo-1553621042-f6e147280480?w=300&h=200&fit=crop', category: 'Sushi', isVeg: false, rating: 4.8 },
      { id: 'm42', name: 'Tonkotsu Ramen', description: 'Rich pork broth ramen with soft egg and chashu', price: 399, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop', category: 'Ramen', isVeg: false, rating: 4.7 },
      { id: 'm43', name: 'Edamame', description: 'Steamed soybeans with sea salt', price: 149, image: 'https://images.unsplash.com/photo-1564093497595-593b96d2b649?w=300&h=200&fit=crop', category: 'Starters', isVeg: true, rating: 4.3 },
      { id: 'm44', name: 'Veggie Roll', description: 'Cucumber, avocado, and carrot maki roll', price: 249, image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=300&h=200&fit=crop', category: 'Sushi', isVeg: true, rating: 4.4 },
      { id: 'm45', name: 'Chicken Teriyaki', description: 'Grilled chicken glazed with teriyaki sauce', price: 349, image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=300&h=200&fit=crop', category: 'Main Course', isVeg: false, rating: 4.6 },
      { id: 'm46', name: 'Miso Soup', description: 'Traditional soybean paste soup with tofu', price: 129, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&h=200&fit=crop', category: 'Soups', isVeg: true, rating: 4.2 },
      { id: 'm47', name: 'Gyoza', description: 'Pan-fried pork dumplings with dipping sauce', price: 279, image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=300&h=200&fit=crop', category: 'Starters', isVeg: false, rating: 4.7 },
      { id: 'm48', name: 'Matcha Ice Cream', description: 'Creamy Japanese green tea ice cream', price: 179, image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=300&h=200&fit=crop', category: 'Desserts', isVeg: true, rating: 4.5 },
    ],
  },
];

// Mock drivers
const drivers: Driver[] = [
  { name: 'Rajesh Kumar', phone: '+91 98765 43210', rating: 4.8, trips: 1243, vehicle: 'Honda Activa - KA01AB1234', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
  { name: 'Priya Sharma', phone: '+91 98765 43211', rating: 4.9, trips: 2156, vehicle: 'TVS Jupiter - KA05CD5678', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face' },
  { name: 'Arun Reddy', phone: '+91 98765 43212', rating: 4.7, trips: 876, vehicle: 'Bajaj Pulsar - KA02EF9012', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' },
  { name: 'Meena Patel', phone: '+91 98765 43213', rating: 4.6, trips: 567, vehicle: 'Hero Splendor - KA03GH3456', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
];

// Helper functions
function formatPrice(price: number): string {
  return `₹${price}`;
}

function generateOrderId(): string {
  return `ZOM${Date.now().toString().slice(-8)}`;
}

// Fake route generation for driver navigation
function generateRoute(start: [number, number], end: [number, number], numPoints: number): [number, number][] {
  const route: [number, number][] = [];
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const lat = start[0] + (end[0] - start[0]) * t + (Math.random() - 0.5) * 0.002;
    const lng = start[1] + (end[1] - start[1]) * t + (Math.random() - 0.5) * 0.002;
    route.push([lat, lng]);
  }
  return route;
}

// Google icon component
const GoogleIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

// Veg indicator
const VegIndicator: React.FC<{ isVeg: boolean }> = ({ isVeg }) => (
  <span style={{
    display: 'inline-block',
    width: '16px',
    height: '16px',
    border: isVeg ? '2px solid #22c55e' : '2px solid #ef4444',
    borderRadius: '2px',
    position: 'relative',
  }}>
    <span style={{
      display: 'block',
      width: isVeg ? '8px' : '0',
      height: isVeg ? '8px' : '0',
      background: isVeg ? '#22c55e' : 'transparent',
      borderRadius: '50%',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      border: isVeg ? 'none' : '2px solid #ef4444',
      boxSizing: 'border-box',
    }} />
  </span>
);

// Main App Component
const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'restaurant' | 'cart' | 'login' | 'tracking'>('home');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Map reference
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const animationRef = useRef<number | null>(null);

  // Login states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  // Filter restaurants
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter(r =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.locality.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Get cart total
  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  }, [cart]);

  // Add to cart
  const addToCart = useCallback((restaurant: Restaurant, menuItem: MenuItem) => {
    setCart(prev => {
      if (prev.length > 0 && prev[0].restaurantId !== restaurant.id) {
        if (!window.confirm(`Add items from ${restaurant.name}? This will clear your current cart.`)) {
          return prev;
        }
        return [{ menuItem, quantity: 1, restaurantId: restaurant.id, restaurantName: restaurant.name }];
      }
      const existing = prev.find(item => item.menuItem.id === menuItem.id);
      if (existing) {
        return prev.map(item =>
          item.menuItem.id === menuItem.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { menuItem, quantity: 1, restaurantId: restaurant.id, restaurantName: restaurant.name }];
    });
  }, []);

  // Remove from cart
  const removeFromCart = useCallback((menuItemId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.menuItem.id === menuItemId);
      if (existing && existing.quantity > 1) {
        return prev.map(item =>
          item.menuItem.id === menuItemId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prev.filter(item => item.menuItem.id !== menuItemId);
    });
  }, []);

  // Place order
  const placeOrder = useCallback(() => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    if (cart.length === 0) return;

    const deliveryFee = cartTotal >= 299 ? 25 : 40;
    const taxes = Math.round(cartTotal * 0.05);
    const total = cartTotal + deliveryFee + taxes;

    const driver = drivers[Math.floor(Math.random() * drivers.length)];

    // Bangalore coordinates
    const restaurantLocation: [number, number] = [12.9352, 77.6245];
    const userLocation: [number, number] = [12.9716, 77.5946];

    const order: Order = {
      id: generateOrderId(),
      items: [...cart],
      total,
      status: 'preparing',
      driver,
      estimatedTime: selectedRestaurant?.deliveryTime || 30,
      restaurantLocation,
      userLocation,
    };

    setCurrentOrder(order);
    setCart([]);
    setCurrentPage('tracking');
  }, [user, cart, cartTotal, selectedRestaurant]);

  // Google Sign In simulation
  const handleGoogleSignIn = useCallback(() => {
    setUser({
      name: 'Samarth Kulkarni',
      email: 'samarth@gmail.com',
      photo: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop&crop=face',
    });
    setShowLoginModal(false);
    setCurrentPage('home');
  }, []);

  // Email/Password Sign In
  const handleEmailSignIn = useCallback(() => {
    if (loginEmail && loginPassword) {
      setUser({
        name: loginEmail.split('@')[0],
        email: loginEmail,
        photo: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop&crop=face',
      });
      setShowLoginModal(false);
    }
  }, [loginEmail, loginPassword]);

  // Logout
  const handleLogout = useCallback(() => {
    setUser(null);
    setCurrentPage('home');
  }, []);

  // Initialize map for tracking
  useEffect(() => {
    if (currentPage === 'tracking' && currentOrder && !mapRef.current) {
      setTimeout(() => {
        const mapContainer = document.getElementById('tracking-map');
        if (mapContainer) {
          mapRef.current = L.map('tracking-map').setView(currentOrder.restaurantLocation, 13);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
          }).addTo(mapRef.current);

          // Restaurant marker
          L.marker(currentOrder.restaurantLocation).addTo(mapRef.current).bindPopup('Restaurant');
          // User location marker
          L.marker(currentOrder.userLocation).addTo(mapRef.current).bindPopup('Your Location');

          // Route line
          const route = generateRoute(currentOrder.restaurantLocation, currentOrder.userLocation, 50);
          polylineRef.current = L.polyline(route, { color: '#3b82f6', weight: 4 }).addTo(mapRef.current);

          // Driver marker with custom icon
          const driverIcon = L.divIcon({
            html: '<div style="background:#1f2937;color:white;padding:6px 10px;border-radius:20px;font-size:12px;white-space:nowrap;font-weight:600;box-shadow:0 2px 8px rgba(0,0,0,0.3);">🏍️ Driver</div>',
            className: '',
            iconSize: [80, 30],
            iconAnchor: [40, 15],
          });
          markerRef.current = L.marker(currentOrder.restaurantLocation, { icon: driverIcon }).addTo(mapRef.current);

          // Animate driver along route
          let currentIndex = 0;
          const animateDriver = () => {
            if (currentIndex < route.length && currentOrder.status !== 'delivered') {
              markerRef.current?.setLatLng(route[currentIndex]);
              mapRef.current?.setView(route[currentIndex], 14);
              currentIndex++;

              // Update order status based on progress
              if (currentIndex === 5) {
                setCurrentOrder(prev => prev ? { ...prev, status: 'picked_up' } : null);
              } else if (currentIndex === 15) {
                setCurrentOrder(prev => prev ? { ...prev, status: 'on_the_way' } : null);
              } else if (currentIndex >= route.length - 1) {
                setCurrentOrder(prev => prev ? { ...prev, status: 'delivered' } : null);
              }

              animationRef.current = window.setTimeout(animateDriver, 300);
            }
          };
          animateDriver();
        }
      }, 100);
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
        polylineRef.current = null;
      }
    };
  }, [currentPage, currentOrder]);

  // Categories for menu
  const categories = useMemo(() => {
    if (!selectedRestaurant) return ['All'];
    const cats = ['All', ...new Set(selectedRestaurant.menu.map(item => item.category))];
    return cats;
  }, [selectedRestaurant]);

  const filteredMenu = useMemo(() => {
    if (!selectedRestaurant) return [];
    if (selectedCategory === 'All') return selectedRestaurant.menu;
    return selectedRestaurant.menu.filter(item => item.category === selectedCategory);
  }, [selectedRestaurant, selectedCategory]);

  // Styles
  const styles: Record<string, React.CSSProperties> = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f0f 0%, #1a0a0a 25%, #0a1a0a 50%, #1a1a0a 75%, #0f0f0f 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 20s ease infinite',
      fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
      position: 'relative' as const,
      overflow: 'hidden',
    },
    header: {
      background: 'linear-gradient(180deg, rgba(16,14,22,0.98) 0%, rgba(10,10,16,0.92) 100%)',
      backdropFilter: 'blur(24px) saturate(200%)',
      WebkitBackdropFilter: 'blur(24px) saturate(200%)',
      borderBottom: '1px solid rgba(226,55,68,0.2)',
      color: 'white',
      padding: '12px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 1px 0 rgba(255,255,255,0.03), 0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(226,55,68,0.06)',
      position: 'sticky' as const,
      top: 0,
      zIndex: 100,
      animation: 'navSlideIn 0.5s ease-out',
    },
    logo: {
      fontSize: '28px',
      fontWeight: 800,
      cursor: 'pointer',
      letterSpacing: '-1px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      transition: 'all 0.3s ease',
      position: 'relative',
    },
    navButtons: {
      display: 'flex',
      gap: '6px',
      alignItems: 'center',
    },
    navButton: {
      background: 'transparent',
      border: 'none',
      color: 'rgba(255,255,255,0.65)',
      padding: '10px 22px',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 500,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      letterSpacing: '0.3px',
      position: 'relative' as const,
    },
    navButtonActive: {
      background: 'rgba(226,55,68,0.12)',
      color: '#fff',
      boxShadow: '0 0 12px rgba(226,55,68,0.15)',
    },
    searchContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px',
    },
    searchInput: {
      width: '100%',
      padding: '16px 24px',
      fontSize: '16px',
      border: '2px solid rgba(255,255,255,0.1)',
      borderRadius: '16px',
      outline: 'none',
      background: 'rgba(255,255,255,0.06)',
      color: 'white',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
      transition: 'all 0.3s ease',
    },
    heroCard: {
      background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
      borderRadius: '32px',
      padding: '60px 40px 48px',
      border: '1px solid rgba(255,255,255,0.1)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(226,55,68,0.08)',
      position: 'relative',
      overflow: 'hidden',
      animation: 'heroCardFloat 6s ease-in-out infinite',
    },
    heroTitle: {
      fontSize: '48px',
      fontWeight: 800,
      margin: '0 0 12px',
      background: 'linear-gradient(135deg, #E23744, #ff6b6b, #fbbf24, #E23744)',
      backgroundSize: '300% 300%',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      animation: 'titleGradient 4s ease infinite',
      lineHeight: 1.2,
      letterSpacing: '-1px',
    },
    heroSubtitle: {
      color: 'rgba(255,255,255,0.6)',
      fontSize: '18px',
      margin: '0 0 28px',
      fontWeight: 400,
    },
    heroSearchWrapper: {
      display: 'flex',
      alignItems: 'center',
      background: 'rgba(255,255,255,0.06)',
      borderRadius: '20px',
      border: '2px solid rgba(255,255,255,0.1)',
      padding: '4px 6px 4px 20px',
      maxWidth: '600px',
      margin: '0 auto',
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    },
    heroSearchInput: {
      flex: 1,
      padding: '16px 14px',
      fontSize: '16px',
      border: 'none',
      outline: 'none',
      background: 'transparent',
      color: 'white',
    },
    heroFoodPill: {
      padding: '10px 22px',
      background: 'rgba(255,255,255,0.06)',
      borderRadius: '24px',
      fontSize: '15px',
      cursor: 'pointer',
      color: '#e5e7eb',
      border: '1px solid rgba(255,255,255,0.08)',
      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      backdropFilter: 'blur(10px)',
      animation: 'pillPulse 3s ease-in-out infinite',
    },
    citiesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '14px',
      maxWidth: '780px',
      margin: '0 auto',
    },
    cityCard: {
      position: 'relative',
      borderRadius: '16px',
      overflow: 'hidden',
      height: '130px',
      cursor: 'pointer',
      border: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
    cityCardOverlay: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 50%, transparent 100%)',
      zIndex: 1,
    },
    cityCardContent: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: '16px',
      zIndex: 2,
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
    },
    cityCardName: {
      color: 'white',
      fontSize: '16px',
      fontWeight: 700,
      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
    },
    cityCardCount: {
      color: 'rgba(255,255,255,0.75)',
      fontSize: '12px',
      fontWeight: 500,
    },
    restaurantGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '24px',
      marginTop: '24px',
    },
    restaurantCard: {
      background: 'rgba(255,255,255,0.04)',
      borderRadius: '20px',
      overflow: 'hidden',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.06)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      animation: 'cardFadeIn 0.5s ease-out',
      position: 'relative',
    },
    restaurantImage: {
      width: '100%',
      height: '200px',
      objectFit: 'cover' as const,
    },
    cardContent: {
      padding: '18px',
    },
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '4px 10px',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: 600,
    },
    modal: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.2s ease-out',
    },
    modalContent: {
      background: 'rgba(30,30,30,0.95)',
      borderRadius: '24px',
      padding: '36px',
      width: '100%',
      maxWidth: '420px',
      border: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
      animation: 'scaleIn 0.3s ease-out',
    },
    googleButton: {
      width: '100%',
      padding: '14px',
      border: '2px solid rgba(255,255,255,0.12)',
      borderRadius: '14px',
      background: 'rgba(255,255,255,0.04)',
      color: 'white',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 500,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      transition: 'all 0.3s ease',
    },
    input: {
      width: '100%',
      padding: '14px',
      border: '2px solid rgba(255,255,255,0.1)',
      borderRadius: '12px',
      fontSize: '15px',
      outline: 'none',
      background: 'rgba(255,255,255,0.04)',
      color: 'white',
      transition: 'all 0.3s ease',
    },
    primaryButton: {
      width: '100%',
      padding: '14px',
      background: 'linear-gradient(135deg, #E23744 0%, #ff6b6b 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '14px',
      fontSize: '16px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      boxShadow: '0 4px 20px rgba(226,55,68,0.3)',
    },
    menuItem: {
      display: 'flex',
      gap: '20px',
      padding: '22px',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
      borderRadius: '20px',
      marginBottom: '14px',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(255,255,255,0.06)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      animation: 'cardFadeIn 0.4s ease-out',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      cursor: 'default',
      position: 'relative' as const,
      overflow: 'hidden',
    },
    menuItemImage: {
      width: '120px',
      height: '110px',
      borderRadius: '16px',
      objectFit: 'cover' as const,
      flexShrink: 0,
    },
    cartItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '18px 22px',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
      borderRadius: '18px',
      marginBottom: '12px',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(255,255,255,0.06)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.2), 0 0 1px rgba(255,255,255,0.05)',
      animation: 'cardFadeIn 0.4s ease-out',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
    cartBillCard: {
      background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
      borderRadius: '20px',
      padding: '24px',
      height: 'fit-content' as const,
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(255,255,255,0.06)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 1px rgba(255,255,255,0.05)',
      position: 'sticky' as const,
      top: '100px',
    },
    trackingContainer: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '24px',
    },
    driverCard: {
      background: 'rgba(255,255,255,0.04)',
      borderRadius: '20px',
      padding: '20px',
      border: '1px solid rgba(255,255,255,0.06)',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      display: 'flex',
      gap: '16px',
      alignItems: 'center',
      marginBottom: '20px',
      animation: 'cardFadeIn 0.4s ease-out',
    },
    driverImage: {
      width: '70px',
      height: '70px',
      borderRadius: '50%',
      objectFit: 'cover' as const,
      border: '3px solid #E23744',
    },
    progressBar: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '20px',
      position: 'relative' as const,
    },
    mapContainer: {
      height: '400px',
      borderRadius: '20px',
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.06)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      marginBottom: '20px',
    },
    callInfoSection: {
      marginTop: '64px',
      position: 'relative' as const,
      zIndex: 2,
    },
    callInfoCard: {
      background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)',
      borderRadius: '28px',
      padding: '48px 40px',
      border: '1px solid rgba(255,255,255,0.06)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(226,55,68,0.05)',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '32px',
      transition: 'all 0.4s ease',
    },
    callInfoItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '16px',
      padding: '20px',
      borderRadius: '18px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.05)',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      cursor: 'default',
    },
    callInfoIcon: {
      width: '48px',
      height: '48px',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '22px',
      flexShrink: 0,
    },
    callInfoTitle: {
      color: 'rgba(255,255,255,0.5)',
      fontSize: '12px',
      fontWeight: 600,
      textTransform: 'uppercase' as const,
      letterSpacing: '1px',
      marginBottom: '6px',
    },
    callInfoValue: {
      color: '#fff',
      fontSize: '16px',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    callInfoSub: {
      color: 'rgba(255,255,255,0.45)',
      fontSize: '13px',
      marginTop: '4px',
    },
    sectionTitle: {
      textAlign: 'center' as const,
      color: 'rgba(255,255,255,0.6)',
      fontSize: '13px',
      fontWeight: 600,
      textTransform: 'uppercase' as const,
      letterSpacing: '2px',
      marginBottom: '8px',
    },
    sectionHeading: {
      textAlign: 'center' as const,
      fontSize: '32px',
      fontWeight: 800,
      margin: '0 0 32px',
      background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.7))',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
  };

  // Inject keyframe animations
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      @keyframes cardFadeIn {
        from { opacity: 0; transform: translateY(30px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes cardFadeInLeft {
        from { opacity: 0; transform: translateX(-30px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes cardFadeInRight {
        from { opacity: 0; transform: translateX(30px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes bgShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.5; }
        25% { transform: translateY(-20px) rotate(5deg); }
        50% { transform: translateY(-35px) rotate(-3deg); opacity: 0.9; }
        75% { transform: translateY(-15px) rotate(7deg); }
      }
      @keyframes float2 {
        0%, 100% { transform: translateY(0) rotate(0deg) scale(1); opacity: 0.3; }
        33% { transform: translateY(-25px) rotate(-5deg) scale(1.1); opacity: 0.7; }
        66% { transform: translateY(-10px) rotate(4deg) scale(0.95); opacity: 0.5; }
      }
      @keyframes shimmer {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
      @keyframes pulseGlow {
        0%, 100% { box-shadow: 0 4px 15px rgba(255,92,92,0.3); }
        50% { box-shadow: 0 8px 35px rgba(255,92,92,0.6); }
      }
      @keyframes pulseGlowGreen {
        0%, 100% { box-shadow: 0 4px 15px rgba(34,197,94,0.3); }
        50% { box-shadow: 0 8px 35px rgba(34,197,94,0.6); }
      }
      @keyframes orbFloat {
        0%, 100% { transform: translate(0, 0) scale(1); }
        25% { transform: translate(30px, -40px) scale(1.1); }
        50% { transform: translate(-20px, -70px) scale(0.9); }
        75% { transform: translate(-40px, -20px) scale(1.05); }
      }
      @keyframes orbFloat2 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        25% { transform: translate(-30px, 40px) scale(1.15); }
        50% { transform: translate(20px, 70px) scale(0.85); }
        75% { transform: translate(40px, 20px) scale(1.1); }
      }
      @keyframes twinkle {
        0%, 100% { opacity: 0; transform: scale(0); }
        50% { opacity: 0.8; transform: scale(1); }
      }
      @keyframes countUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes ripple {
        0% { box-shadow: 0 0 0 0 rgba(255,92,92,0.4); }
        100% { box-shadow: 0 0 0 20px rgba(255,92,92,0); }
      }
      @keyframes slideInDown {
        from { opacity: 0; transform: translateY(-50px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes pulseRing {
        0% { transform: scale(0.95); opacity: 0.7; }
        50% { transform: scale(1.05); opacity: 1; }
        100% { transform: scale(0.95); opacity: 0.7; }
      }
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes typing {
        from { width: 0; }
        to { width: 100%; }
      }
      @keyframes blink {
        50% { border-color: transparent; }
      }
      @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.8); }
        to { opacity: 1; transform: scale(1); }
      }
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes dash {
        to { stroke-dashoffset: 0; }
      }
      @keyframes heroCardFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
      }
      @keyframes heroFloat1 {
        0%, 100% { transform: translate(0, 0) rotate(0deg); }
        25% { transform: translate(10px, -15px) rotate(5deg); }
        50% { transform: translate(-5px, -25px) rotate(-3deg); }
        75% { transform: translate(8px, -10px) rotate(4deg); }
      }
      @keyframes heroFloat2 {
        0%, 100% { transform: translate(0, 0) rotate(0deg); }
        33% { transform: translate(-15px, -10px) rotate(-8deg); }
        66% { transform: translate(5px, -20px) rotate(5deg); }
      }
      @keyframes titleGradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes pillPulse {
        0%, 100% { transform: scale(1); box-shadow: 0 0 10px rgba(226,55,68,0.1); }
        50% { transform: scale(1.05); box-shadow: 0 0 20px rgba(226,55,68,0.2); }
      }
      @keyframes fadeSlideUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes navGlow {
        0%, 100% { box-shadow: 0 0 6px rgba(226,55,68,0.15); }
        50% { box-shadow: 0 0 20px rgba(226,55,68,0.35); }
      }
      @keyframes logoShine {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
      @keyframes badgeBounce {
        0% { transform: scale(0.8); }
        40% { transform: scale(1.25); }
        60% { transform: scale(0.95); }
        100% { transform: scale(1); }
      }
      @keyframes navSlideIn {
        from { opacity: 0; transform: translateY(-15px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes headerBorderPulse {
        0%, 100% { border-bottom-color: rgba(226,55,68,0.15); }
        50% { border-bottom-color: rgba(226,55,68,0.4); }
      }
      @keyframes slideInRight {
        from { opacity: 0; transform: translateX(40px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes slideInLeft {
        from { opacity: 0; transform: translateX(-40px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes pulseOnce {
        0% { transform: scale(1); }
        50% { transform: scale(1.06); box-shadow: 0 0 30px rgba(226,55,68,0.12); }
        100% { transform: scale(1); }
      }
      @keyframes shimmerSlide {
        0% { background-position: 200% center; }
        100% { background-position: -200% center; }
      }
      @keyframes menuItemFloat {
        0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.15; }
        50% { transform: translateY(-12px) rotate(4deg); opacity: 0.35; }
      }
      .nav-btn-active::after { content: ''; position: absolute; bottom: -1px; left: 50%; transform: translateX(-50%); width: 50%; height: 2px; background: #E23744; border-radius: 1px; box-shadow: 0 0 10px rgba(226,55,68,0.5); }
      .logo-z { background-size: 200% 100% !important; animation: logoShine 3s linear infinite !important; }
      .badge-pop { animation: badgeBounce 0.4s ease-in-out !important; }
      .header-border::after { content: ''; position: absolute; bottom: 0; left: 5%; width: 90%; height: 1px; background: linear-gradient(90deg, transparent, rgba(226,55,68,0.4), transparent); pointer-events: none; }
      .hero-search-wrapper { transition: all 0.4s ease !important; }
      .hero-search-wrapper:focus-within { border-color: #E23744 !important; box-shadow: 0 0 30px rgba(226,55,68,0.15), 0 4px 20px rgba(0,0,0,0.3) !important; }
      .hero-search-input::placeholder { color: rgba(255,255,255,0.35); }
      .city-card-image { transition: transform 0.5s ease !important; }
      .city-card-image:hover { transform: scale(1.1) !important; }
      @media (max-width: 640px) { .cities-grid { grid-template-columns: repeat(2, 1fr) !important; } }
      @media (max-width: 420px) { .cities-grid { grid-template-columns: 1fr !important; } }
      @keyframes heroShimmer {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
      * { scrollbar-width: thin; scrollbar-color: #E23744 #1a1a1a; }
      ::-webkit-scrollbar { width: 8px; }
      ::-webkit-scrollbar-track { background: #1a1a1a; border-left: 1px solid rgba(255,255,255,0.04); }
      ::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #E23744, #ff6b6b); border-radius: 4px; border: 2px solid #1a1a1a; }
      ::-webkit-scrollbar-thumb:hover { background: linear-gradient(180deg, #ff6b6b, #E23744); box-shadow: 0 0 12px rgba(226,55,68,0.4); }
      .btn-glow:hover { animation: pulseGlow 1.5s ease-in-out infinite !important; }
      .btn-glow-green:hover { animation: pulseGlowGreen 1.5s ease-in-out infinite !important; }
      .card-hover { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important; }
      .card-hover:hover { transform: translateY(-8px) scale(1.02) !important; }
      .card-glow { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important; }
      .card-glow:hover { transform: translateY(-8px) scale(1.02) !important; box-shadow: 0 0 30px rgba(226,55,68,0.25), 0 8px 32px rgba(0,0,0,0.3) !important; border-color: rgba(226,55,68,0.25) !important; }
      .text-gradient { background: linear-gradient(135deg, #E23744, #ff6b6b, #E23744); background-size: 200% 200%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: gradientShift 3s ease infinite; }
    `;
    document.head.appendChild(styleEl);
    return () => { document.head.removeChild(styleEl); };
  }, []);

  // Login Modal
  const LoginModal = () => showLoginModal ? (
    <div style={styles.modal} onClick={() => setShowLoginModal(false)}>
      <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
        <h2 style={{ margin: '0 0 8px', fontSize: '24px', color: '#1f2937' }}>
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p style={{ margin: '0 0 24px', color: '#6b7280' }}>
          {isSignUp ? 'Sign up to order delicious food' : 'Sign in to continue ordering'}
        </p>

        <button
          style={styles.googleButton}
          onClick={handleGoogleSignIn}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#4285F4';
            e.currentTarget.style.background = '#f8fafc';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#e0e0e0';
            e.currentTarget.style.background = 'white';
          }}
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0', gap: '12px' }}>
          <div style={{ flex: 1, height: '1px', background: '#e0e0e0' }} />
          <span style={{ color: '#9ca3af', fontSize: '14px' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: '#e0e0e0' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="email"
            placeholder="Email address"
            value={loginEmail}
            onChange={e => setLoginEmail(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={e => setLoginPassword(e.target.value)}
            style={styles.input}
          />
          <button style={styles.primaryButton} onClick={handleEmailSignIn}>
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#6b7280', fontSize: '14px' }}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span
            style={{ color: '#ff5c5c', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </span>
        </p>
      </div>
    </div>
  ) : null;

  // Restaurant Card
  const RestaurantCard: React.FC<{ restaurant: Restaurant }> = ({ restaurant }) => (
    <div
      style={styles.restaurantCard}
      className="card-glow"
      onClick={() => {
        setSelectedRestaurant(restaurant);
        setSelectedCategory('All');
        setCurrentPage('restaurant');
      }}
    >
      <img src={restaurant.image} alt={restaurant.name} style={styles.restaurantImage} />
      <div style={styles.cardContent}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#1f2937' }}>{restaurant.name}</h3>
          <span style={{
            ...styles.badge,
            background: restaurant.rating >= 4 ? '#22c55e' : '#f59e0b',
            color: 'white',
          }}>
            ⭐ {restaurant.rating}
          </span>
        </div>
        <p style={{ margin: '0 0 8px', color: '#6b7280', fontSize: '14px' }}>🍽️ {restaurant.cuisine}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#6b7280', fontSize: '13px' }}>📍 {restaurant.locality}</span>
          <span style={{ color: '#6b7280', fontSize: '13px' }}>⏱️ {restaurant.deliveryTime} mins</span>
          <span style={{ fontWeight: 600, color: '#ff5c5c' }}>{formatPrice(restaurant.costForTwo)} for two</span>
        </div>
      </div>
    </div>
  );

  // Menu Item Card
  const MenuItemCard: React.FC<{ item: MenuItem }> = ({ item }) => {
    const cartItem = cart.find(c => c.menuItem.id === item.id);
    const quantity = cartItem?.quantity || 0;

    return (
      <div style={styles.menuItem}
        className="card-glow"
        onMouseEnter={e => { }}
        onMouseLeave={e => { }}
      >
        <img src={item.image} alt={item.name} style={styles.menuItemImage} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <VegIndicator isVeg={item.isVeg} />
            <h4 style={{ margin: 0, fontSize: '17px', fontWeight: 600, color: '#fff' }}>{item.name}</h4>
          </div>
          <p style={{ margin: '0 0 10px', color: 'rgba(255,255,255,0.45)', fontSize: '13px', lineHeight: 1.5 }}>{item.description}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontWeight: 700, fontSize: '20px', background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.8))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{formatPrice(item.price)}</span>
              <span style={{ background: 'rgba(255,255,255,0.05)', padding: '3px 10px', borderRadius: '8px', fontSize: '12px', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.04)' }}>
                ⭐ {item.rating}
              </span>
            </div>
          </div>
          <div style={{ marginTop: '12px' }}>
            {quantity === 0 ? (
              <button
                style={{
                  padding: '10px 32px',
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  border: 'none',
                  color: 'white',
                  borderRadius: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '14px',
                  letterSpacing: '0.3px',
                  boxShadow: '0 4px 16px rgba(34,197,94,0.25)',
                  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                }}
                onClick={() => selectedRestaurant && addToCart(selectedRestaurant, item)}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(34,197,94,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(34,197,94,0.25)'; }}
              >
                + ADD
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <button
                  style={{
                    width: '36px', height: '36px', borderRadius: '10px', border: '1px solid rgba(226,55,68,0.3)',
                    background: 'rgba(226,55,68,0.1)', color: '#ff6b6b', cursor: 'pointer', fontWeight: 'bold',
                    fontSize: '18px', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                  onClick={() => removeFromCart(item.id)}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(226,55,68,0.25)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(226,55,68,0.1)'; }}
                >
                  -
                </button>
                <span style={{ fontWeight: 700, fontSize: '17px', color: '#fff', minWidth: '20px', textAlign: 'center' }}>{quantity}</span>
                <button
                  style={{
                    width: '36px', height: '36px', borderRadius: '10px', border: 'none',
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white', cursor: 'pointer',
                    fontWeight: 'bold', fontSize: '18px', transition: 'all 0.2s ease',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(34,197,94,0.3)',
                  }}
                  onClick={() => selectedRestaurant && addToCart(selectedRestaurant, item)}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(34,197,94,0.5)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(34,197,94,0.3)'; }}
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Home Page
  const HomePage = () => (
    <div style={styles.searchContainer}>
      {/* Hero Card */}
      <div style={styles.heroCard}>
        {/* Decorative floating food emojis */}
        <span style={{ position: 'absolute', top: '10px', left: '20px', fontSize: '42px', opacity: 0.5, animation: 'heroFloat1 7s ease-in-out infinite', filter: 'drop-shadow(0 0 15px rgba(255,100,100,0.2))', zIndex: 1 }}>🍕</span>
        <span style={{ position: 'absolute', top: '15px', right: '25px', fontSize: '36px', opacity: 0.4, animation: 'heroFloat2 8s ease-in-out infinite 1s', filter: 'drop-shadow(0 0 15px rgba(255,200,50,0.2))', zIndex: 1 }}>🍔</span>
        <span style={{ position: 'absolute', bottom: '20px', left: '30px', fontSize: '38px', opacity: 0.4, animation: 'heroFloat1 9s ease-in-out infinite 2s', filter: 'drop-shadow(0 0 15px rgba(50,200,100,0.2))', zIndex: 1 }}>🌮</span>
        <span style={{ position: 'absolute', bottom: '10px', right: '20px', fontSize: '34px', opacity: 0.5, animation: 'heroFloat2 6.5s ease-in-out infinite 0.5s', filter: 'drop-shadow(0 0 15px rgba(255,150,200,0.2))', zIndex: 1 }}>🥗</span>
        <span style={{ position: 'absolute', top: '45%', left: '2%', fontSize: '28px', opacity: 0.3, animation: 'heroFloat1 10s ease-in-out infinite 3s', zIndex: 1 }}>🍣</span>
        <span style={{ position: 'absolute', top: '38%', right: '3%', fontSize: '26px', opacity: 0.3, animation: 'heroFloat2 8.5s ease-in-out infinite 1.5s', zIndex: 1 }}>🍜</span>

        {/* Gradient glow overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 30% 20%, rgba(226,55,68,0.1) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(251,191,36,0.06) 0%, transparent 50%)',
          zIndex: 0,
        }} />

        {/* Content */}
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <h1 style={styles.heroTitle}>Discover the best food & drinks</h1>
          <p style={styles.heroSubtitle}>Order from your favorite restaurants near you</p>

          <div className="hero-search-wrapper" style={styles.heroSearchWrapper}>
            <span style={{ fontSize: '20px', lineHeight: 1 }}>🔍</span>
            <input
              type="text"
              placeholder="Search for restaurants, cuisines, or localities..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="hero-search-input"
              style={styles.heroSearchInput}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '28px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {['Pizza', 'Burger', 'Chinese', 'Biryani', 'Dosa', 'Sushi'].filter(t =>
              t.toLowerCase().includes(searchQuery.toLowerCase()) || searchQuery === ''
            ).map((tag, idx) => (
              <span
                key={tag}
                style={{ ...styles.heroFoodPill, animationDelay: `${idx * 0.3}s` }}
                onClick={() => setSearchQuery(tag)}
              >
                {tag === 'Pizza' ? '🍕 ' : tag === 'Burger' ? '🍔 ' : tag === 'Chinese' ? '🥟 ' : tag === 'Biryani' ? '🍛 ' : tag === 'Dosa' ? '🥞 ' : '🍣 '}
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Cities Section */}
        <div style={{ marginTop: '40px', position: 'relative', zIndex: 2 }}>
          <h3 style={{ color: 'rgba(255,255,255,0.8)', fontSize: '18px', fontWeight: 600, margin: '0 0 16px', textAlign: 'center' }}>
            🌆 Popular localities
          </h3>
          <div className="cities-grid" style={styles.citiesGrid}>
            {[
              { name: 'Koramangala', img: 'https://images.unsplash.com/photo-1599761230913-1ec5c01255d4?w=300&h=180&fit=crop&q=80', count: restaurants.filter(r => r.locality === 'Koramangala').length },
              { name: 'Indiranagar', img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=300&h=180&fit=crop&q=80', count: restaurants.filter(r => r.locality === 'Indiranagar').length },
              { name: 'HSR Layout', img: 'https://images.unsplash.com/photo-1577415124269-fc114f0f4c2e?w=300&h=180&fit=crop&q=80', count: restaurants.filter(r => r.locality === 'HSR Layout').length },
              { name: 'Whitefield', img: 'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?w=300&h=180&fit=crop&q=80', count: restaurants.filter(r => r.locality === 'Whitefield').length },
              { name: 'Jayanagar', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&h=180&fit=crop&q=80', count: restaurants.filter(r => r.locality === 'Jayanagar').length },
              { name: 'MG Road', img: 'https://images.unsplash.com/photo-1580584127374-9276b1e9959b?w=300&h=180&fit=crop&q=80', count: restaurants.filter(r => r.locality === 'MG Road').length },
            ].map((city, idx) => (
              <div
                key={city.name}
                style={{
                  ...styles.cityCard,
                  animation: `fadeSlideUp 0.5s ease-out ${0.1 + idx * 0.08}s both`,
                }}
                className="card-glow"
                onClick={() => setSearchQuery(city.name)}
              >
                <div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: `url(${city.img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transition: 'transform 0.5s ease',
                }} className="city-card-image" />
                <div style={styles.cityCardOverlay} />
                <div style={styles.cityCardContent}>
                  <span style={styles.cityCardName}>{city.name}</span>
                  <span style={styles.cityCardCount}>{city.count} {city.count === 1 ? 'place' : 'places'} ›</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Restaurants section */}
      <div style={{ position: 'relative' as const }}>
        <span style={{ position: 'absolute', top: '-10%', left: '-2%', fontSize: '28px', animation: 'menuItemFloat 8s ease-in-out infinite', opacity: 0.08, pointerEvents: 'none' }}>🍽️</span>
        <span style={{ position: 'absolute', top: '20%', right: '-3%', fontSize: '22px', animation: 'menuItemFloat 10s ease-in-out infinite 1s', opacity: 0.06, pointerEvents: 'none' }}>🥂</span>
        <span style={{ position: 'absolute', bottom: '5%', left: '5%', fontSize: '20px', animation: 'menuItemFloat 7s ease-in-out infinite 2s', opacity: 0.07, pointerEvents: 'none' }}>🔥</span>
        <span style={{ position: 'absolute', bottom: '30%', right: '-1%', fontSize: '24px', animation: 'menuItemFloat 9s ease-in-out infinite 0.5s', opacity: 0.06, pointerEvents: 'none' }}>✨</span>

        <h2 style={{ color: '#e5e7eb', marginTop: '48px', fontSize: '22px', fontWeight: 700, animation: 'fadeSlideUp 0.6s ease-out' }}>
          Restaurants near you ({filteredRestaurants.length})
        </h2>

      <div style={styles.restaurantGrid}>
        {filteredRestaurants.map(restaurant => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>

      {/* Call Info Section */}
      <div style={styles.callInfoSection}>
        {/* Decorative background glow */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '400px',
          background: 'radial-gradient(ellipse, rgba(226,55,68,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />
        <p style={styles.sectionTitle}>Get in touch</p>
        <h2 style={styles.sectionHeading}>We're here for you</h2>
        <div style={styles.callInfoCard}>
          {[
            { icon: '📞', iconBg: 'linear-gradient(135deg, rgba(226,55,68,0.3), rgba(226,55,68,0.05))', iconBorder: '1px solid rgba(226,55,68,0.2)', title: 'Call Us', value: '+1 (555) 123-4567', sub: '24/7 customer support' },
            { icon: '✉️', iconBg: 'linear-gradient(135deg, rgba(251,191,36,0.3), rgba(251,191,36,0.05))', iconBorder: '1px solid rgba(251,191,36,0.2)', title: 'Email', value: 'hello@zomato.com', sub: 'We reply within 2 hours' },
            { icon: '📍', iconBg: 'linear-gradient(135deg, rgba(34,197,94,0.3), rgba(34,197,94,0.05))', iconBorder: '1px solid rgba(34,197,94,0.2)', title: 'Location', value: 'Bengaluru, India', sub: 'Visit our flagship store' },
            { icon: '🕐', iconBg: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(99,102,241,0.05))', iconBorder: '1px solid rgba(99,102,241,0.2)', title: 'Hours', value: '8:00 AM - 11:00 PM', sub: 'Open all days' },
          ].map((item, idx) => (
            <div
              key={item.title}
              style={{
                ...styles.callInfoItem,
                animation: `fadeSlideUp 0.6s ease-out ${0.1 + idx * 0.12}s both`,
              }}
              className="card-glow"
            >
              <div style={{ ...styles.callInfoIcon, background: item.iconBg, border: item.iconBorder }}>
                {item.icon}
              </div>
              <div>
                <div style={styles.callInfoTitle}>{item.title}</div>
                <div style={styles.callInfoValue}>{item.value}</div>
                <div style={styles.callInfoSub}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Restaurant Menu Page
  const RestaurantPage = () => selectedRestaurant ? (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px', position: 'relative' as const, zIndex: 2 }}>
      {/* Decorative floating food emojis */}
      <span style={{ position: 'absolute', top: '3%', left: '1%', fontSize: '30px', animation: 'menuItemFloat 7s ease-in-out infinite', opacity: 0.12, pointerEvents: 'none' }}>🍕</span>
      <span style={{ position: 'absolute', top: '8%', right: '2%', fontSize: '24px', animation: 'menuItemFloat 9s ease-in-out infinite 1s', opacity: 0.1, pointerEvents: 'none' }}>🍔</span>
      <span style={{ position: 'absolute', bottom: '15%', left: '3%', fontSize: '22px', animation: 'menuItemFloat 8s ease-in-out infinite 2s', opacity: 0.1, pointerEvents: 'none' }}>🌮</span>
      <span style={{ position: 'absolute', bottom: '5%', right: '1%', fontSize: '26px', animation: 'menuItemFloat 6s ease-in-out infinite 0.5s', opacity: 0.12, pointerEvents: 'none' }}>🥗</span>

      <button
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.08)',
          padding: '10px 22px',
          borderRadius: '12px',
          cursor: 'pointer',
          marginBottom: '24px',
          fontWeight: 500,
          color: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(12px)',
          transition: 'all 0.3s ease',
        }}
        onClick={() => setCurrentPage('home')}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
      >
        ← Back to Restaurants
      </button>

      {/* Restaurant Hero Card */}
      <div style={{
        borderRadius: '24px',
        overflow: 'hidden',
        marginBottom: '28px',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.3), 0 0 1px rgba(255,255,255,0.05)',
        animation: 'cardFadeIn 0.5s ease-out',
      }}>
        <div style={{ position: 'relative' }}>
          <img
            src={selectedRestaurant.image}
            alt={selectedRestaurant.name}
            style={{ width: '100%', height: '260px', objectFit: 'cover', display: 'block' }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)',
          }} />
          <div style={{ position: 'absolute', bottom: '20px', left: '24px', right: '24px' }}>
            <h1 style={{ margin: '0 0 4px', fontSize: '30px', fontWeight: 800, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>{selectedRestaurant.name}</h1>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: '15px' }}>{selectedRestaurant.cuisine}</p>
          </div>
        </div>
        <div style={{ padding: '20px 24px', display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', background: selectedRestaurant.rating >= 4 ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)', color: selectedRestaurant.rating >= 4 ? '#22c55e' : '#f59e0b', padding: '6px 14px', borderRadius: '10px', fontWeight: 700, fontSize: '14px' }}>
            ⭐ {selectedRestaurant.rating}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>⏱️ {selectedRestaurant.deliveryTime} mins</span>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>📍 {selectedRestaurant.locality}</span>
          <span style={{ color: '#E23744', fontWeight: 700, fontSize: '14px', marginLeft: 'auto' }}>{formatPrice(selectedRestaurant.costForTwo)} for two</span>
        </div>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button
            key={cat}
            style={{
              padding: '10px 22px',
              background: selectedCategory === cat
                ? 'linear-gradient(135deg, #E23744, #ff6b6b)'
                : 'rgba(255,255,255,0.05)',
              color: selectedCategory === cat ? 'white' : 'rgba(255,255,255,0.7)',
              border: selectedCategory === cat
                ? '1px solid transparent'
                : '1px solid rgba(255,255,255,0.08)',
              borderRadius: '24px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
              transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              boxShadow: selectedCategory === cat ? '0 4px 16px rgba(226,55,68,0.3)' : 'none',
            }}
            onClick={() => setSelectedCategory(cat)}
            onMouseEnter={e => { if (selectedCategory !== cat) { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; } }}
            onMouseLeave={e => { if (selectedCategory !== cat) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; } }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <span style={{ width: '4px', height: '24px', background: '#E23744', borderRadius: '2px' }} />
        <h2 style={{ margin: 0, color: '#fff', fontSize: '22px', fontWeight: 700 }}>Menu</h2>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '15px' }}>({filteredMenu.length} items)</span>
      </div>

      {filteredMenu.map((item, idx) => (
        <div key={item.id} style={{ animation: `cardFadeIn 0.5s ease-out ${0.03 * idx}s both` }}>
          <MenuItemCard item={item} />
        </div>
      ))}

      {/* Floating Cart Bar */}
      {cart.length > 0 && cart.some(c => c.restaurantId === selectedRestaurant.id) && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'linear-gradient(135deg, rgba(16,14,22,0.95) 0%, rgba(20,18,28,0.92) 100%)',
          backdropFilter: 'blur(24px) saturate(200%)',
          WebkitBackdropFilter: 'blur(24px) saturate(200%)',
          borderRadius: '18px',
          padding: '18px 24px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.5), 0 0 20px rgba(226,55,68,0.08), inset 0 1px 0 rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: '18px',
          zIndex: 50,
          animation: 'slideInRight 0.4s ease-out',
        }}>
          <div>
            <div style={{ fontWeight: 700, color: '#fff', fontSize: '15px' }}>{cart.reduce((sum, i) => sum + i.quantity, 0)} items</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{formatPrice(cartTotal)}</div>
          </div>
          <button
            style={{
              padding: '12px 28px',
              background: 'linear-gradient(135deg, #E23744 0%, #ff6b6b 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '14px',
              boxShadow: '0 4px 16px rgba(226,55,68,0.3)',
              transition: 'all 0.3s ease',
            }}
            onClick={() => setCurrentPage('cart')}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(226,55,68,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(226,55,68,0.3)'; }}
          >
            View Cart →
          </button>
        </div>
      )}
    </div>
  ) : null;

  // Cart Page
  const CartPage = () => {
    const deliveryFee = cartTotal >= 299 ? 25 : 40;
    const taxes = Math.round(cartTotal * 0.05);
    const total = cartTotal + deliveryFee + taxes;

    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px', position: 'relative' as const, zIndex: 2 }}>
        {/* Decorative floating elements */}
        <span style={{ position: 'absolute', top: '5%', left: '2%', fontSize: '28px', animation: 'menuItemFloat 6s ease-in-out infinite', opacity: 0.15, pointerEvents: 'none' }}>🛒</span>
        <span style={{ position: 'absolute', top: '15%', right: '3%', fontSize: '22px', animation: 'menuItemFloat 8s ease-in-out infinite 1s', opacity: 0.12, pointerEvents: 'none' }}>🧾</span>
        <span style={{ position: 'absolute', bottom: '10%', left: '5%', fontSize: '20px', animation: 'menuItemFloat 7s ease-in-out infinite 2s', opacity: 0.1, pointerEvents: 'none' }}>💳</span>
        <span style={{ position: 'absolute', bottom: '20%', right: '2%', fontSize: '24px', animation: 'menuItemFloat 9s ease-in-out infinite 0.5s', opacity: 0.12, pointerEvents: 'none' }}>🚀</span>

        <button
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '10px 22px',
            borderRadius: '12px',
            cursor: 'pointer',
            marginBottom: '24px',
            fontWeight: 500,
            color: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(12px)',
            transition: 'all 0.3s ease',
          }}
          onClick={() => selectedRestaurant ? setCurrentPage('restaurant') : setCurrentPage('home')}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
        >
          ← Back
        </button>

        <h1 style={{ margin: '0 0 28px', fontSize: '32px', fontWeight: 800, background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.7))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          Your Cart
        </h1>

        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 40px', background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)', borderRadius: '24px', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.06)', animation: 'cardFadeIn 0.5s ease-out' }}>
            <div style={{ fontSize: '72px', marginBottom: '20px', animation: 'menuItemFloat 4s ease-in-out infinite' }}>🛒</div>
            <h3 style={{ color: '#fff', fontSize: '22px', margin: '0 0 8px' }}>Your cart is empty</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', margin: 0 }}>Add items from a restaurant to get started</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '28px', alignItems: 'start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <span style={{ color: '#E23744', fontSize: '18px' }}>📍</span>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  {cart[0]?.restaurantName}
                </span>
              </div>
              {cart.map((item, idx) => (
                <div key={item.menuItem.id} style={{ ...styles.cartItem, animation: `slideInRight 0.5s ease-out ${0.05 * idx}s both` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <VegIndicator isVeg={item.menuItem.isVeg} />
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff', fontSize: '15px' }}>{item.menuItem.name}</div>
                      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>{formatPrice(item.menuItem.price)} each</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <button
                      style={{
                        width: '32px', height: '32px', borderRadius: '10px', border: '1px solid rgba(226,55,68,0.3)',
                        background: 'rgba(226,55,68,0.1)', color: '#ff6b6b', cursor: 'pointer', fontWeight: 'bold',
                        fontSize: '16px', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                      onClick={() => removeFromCart(item.menuItem.id)}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(226,55,68,0.25)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(226,55,68,0.1)'; }}
                    >
                      -
                    </button>
                    <span style={{ fontWeight: 700, minWidth: '28px', textAlign: 'center', color: '#fff', fontSize: '16px' }}>{item.quantity}</span>
                    <button
                      style={{
                        width: '32px', height: '32px', borderRadius: '10px', border: 'none',
                        background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white', cursor: 'pointer',
                        fontWeight: 'bold', fontSize: '16px', transition: 'all 0.2s ease',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(34,197,94,0.3)',
                      }}
                      onClick={() => selectedRestaurant && addToCart(selectedRestaurant, item.menuItem)}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(34,197,94,0.5)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(34,197,94,0.3)'; }}
                    >
                      +
                    </button>
                    <span style={{ fontWeight: 700, minWidth: '70px', textAlign: 'right', color: '#fff', fontSize: '16px' }}>
                      {formatPrice(item.menuItem.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.cartBillCard}>
              <h3 style={{ margin: '0 0 20px', color: '#fff', fontSize: '18px', fontWeight: 700 }}>
                <span style={{ marginRight: '8px' }}>🧾</span> Bill Details
              </h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>Subtotal</span>
                <span style={{ fontWeight: 600, color: '#fff' }}>{formatPrice(cartTotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>Delivery Fee</span>
                <span style={{ fontWeight: 600, color: cartTotal >= 299 ? '#22c55e' : '#fff' }}>{cartTotal >= 299 ? 'FREE' : formatPrice(deliveryFee)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>Taxes & Charges</span>
                <span style={{ fontWeight: 600, color: '#fff' }}>{formatPrice(taxes)}</span>
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '16px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <span style={{ fontWeight: 700, fontSize: '20px', color: '#fff' }}>Total</span>
                <span style={{ fontWeight: 700, fontSize: '20px', background: 'linear-gradient(135deg, #E23744, #ff6b6b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{formatPrice(total)}</span>
              </div>
              <button
                style={{
                  ...styles.primaryButton,
                  opacity: user ? 1 : 0.7,
                  borderRadius: '14px',
                  padding: '16px',
                  fontSize: '16px',
                }}
                onClick={placeOrder}
              >
                {user ? `Place Order • ${formatPrice(total)}` : 'Login to Order'}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Order Tracking Page
  const TrackingPage = () => {
    if (!currentOrder) return null;

    const statusSteps = [
      { key: 'preparing', label: 'Preparing', icon: '👨‍🍳' },
      { key: 'picked_up', label: 'Picked Up', icon: '📦' },
      { key: 'on_the_way', label: 'On the Way', icon: '🏍️' },
      { key: 'delivered', label: 'Delivered', icon: '✅' },
    ];

    const currentStatusIndex = statusSteps.findIndex(s => s.key === currentOrder.status);

    return (
      <div style={styles.trackingContainer}>
        <h1 style={{ margin: '0 0 24px', color: '#1f2937' }}>Track Your Order</h1>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>Order ID</div>
            <div style={{ fontWeight: 700, color: '#1f2937' }}>{currentOrder.id}</div>
          </div>
          <div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>Estimated Time</div>
            <div style={{ fontWeight: 700, color: '#ff5c5c' }}>{currentOrder.estimatedTime} mins</div>
          </div>
          <div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>Total Amount</div>
            <div style={{ fontWeight: 700, color: '#1f2937' }}>{formatPrice(currentOrder.total)}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={styles.progressBar}>
          <div style={{ position: 'absolute', top: '20px', left: '40px', right: '40px', height: '4px', background: '#e0e0e0', borderRadius: '2px' }} />
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '40px',
            height: '4px',
            background: 'linear-gradient(90deg, #22c55e, #16a34a)',
            borderRadius: '2px',
            width: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%`,
            maxWidth: 'calc(100% - 80px)',
            transition: 'width 0.5s ease',
          }} />
          {statusSteps.map((step, index) => (
            <div key={step.key} style={{ textAlign: 'center', zIndex: 1 }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: index <= currentStatusIndex ? '#22c55e' : '#e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 8px',
                fontSize: '20px',
                boxShadow: index <= currentStatusIndex ? '0 4px 12px rgba(34, 197, 94, 0.3)' : 'none',
              }}>
                {step.icon}
              </div>
              <div style={{ fontSize: '12px', fontWeight: index <= currentStatusIndex ? 600 : 400, color: index <= currentStatusIndex ? '#22c55e' : '#9ca3af' }}>
                {step.label}
              </div>
            </div>
          ))}
        </div>

        {/* Map */}
        <div style={styles.mapContainer}>
          <div id="tracking-map" style={{ width: '100%', height: '100%' }} />
        </div>

        {/* Driver Details Card */}
        <div style={styles.driverCard}>
          <img src={currentOrder.driver.image} alt={currentOrder.driver.name} style={styles.driverImage} />
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: '0 0 4px', color: '#1f2937' }}>{currentOrder.driver.name}</h3>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
              <span style={{ color: '#6b7280', fontSize: '14px' }}>
                ⭐ {currentOrder.driver.rating} Rating
              </span>
              <span style={{ color: '#6b7280', fontSize: '14px' }}>
                🚴 {currentOrder.driver.trips} trips
              </span>
            </div>
            <div style={{ fontSize: '13px', color: '#9ca3af' }}>
              🏍️ {currentOrder.driver.vehicle}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button style={{
              padding: '10px 16px',
              background: '#22c55e',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              📞 Call
            </button>
            <button style={{
              padding: '10px 16px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              💬 Chat
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          animation: 'cardFadeIn 0.4s ease-out',
        }}>
          <h3 style={{ margin: '0 0 12px', color: '#1f2937' }}>Order Summary</h3>
          {currentOrder.items.map(item => (
            <div key={item.menuItem.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '8px 0',
              borderBottom: '1px solid #f0f0f0',
            }}>
              <span style={{ color: '#1f2937' }}>
                {item.quantity}x {item.menuItem.name}
              </span>
              <span style={{ fontWeight: 500 }}>{formatPrice(item.menuItem.price * item.quantity)}</span>
            </div>
          ))}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '12px',
            fontWeight: 700,
            fontSize: '18px',
          }}>
            <span>Total</span>
            <span style={{ color: '#ff5c5c' }}>{formatPrice(currentOrder.total)}</span>
          </div>
        </div>

        {currentOrder.status === 'delivered' && (
          <div style={{
            textAlign: 'center',
            padding: '32px',
            background: 'white',
            borderRadius: '16px',
            marginTop: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
            <h2 style={{ color: '#22c55e', margin: '0 0 8px' }}>Order Delivered!</h2>
            <p style={{ color: '#6b7280', margin: '0 0 20px' }}>Enjoy your meal! Rate your experience.</p>
            <button
              style={styles.primaryButton}
              onClick={() => {
                setCurrentOrder(null);
                setCurrentPage('home');
              }}
            >
              Order Again
            </button>
          </div>
        )}
      </div>
    );
  };

  // Immersive animated background
  const BackgroundParticles = () => {
    const gradientOrbs = [
      { size: '600px', color: 'rgba(226,55,68,0.08)', top: '-10%', right: '-5%', anim: 'orbFloat 25s ease-in-out infinite' },
      { size: '500px', color: 'rgba(255,107,107,0.06)', bottom: '-15%', left: '-8%', anim: 'orbFloat2 30s ease-in-out infinite' },
      { size: '400px', color: 'rgba(34,197,94,0.05)', top: '40%', left: '50%', anim: 'orbFloat 20s ease-in-out infinite 5s' },
      { size: '350px', color: 'rgba(251,191,36,0.04)', top: '60%', right: '10%', anim: 'orbFloat2 22s ease-in-out infinite 3s' },
    ];
    const foodParticles = [
      { emoji: '🍕', top: '12%', left: '6%', dur: '7s', delay: '0s', size: '34px' },
      { emoji: '🍔', top: '22%', right: '10%', dur: '9s', delay: '0.5s', size: '30px' },
      { emoji: '🍜', bottom: '18%', left: '12%', dur: '8s', delay: '1s', size: '32px' },
      { emoji: '🥗', bottom: '28%', right: '6%', dur: '10s', delay: '0.3s', size: '26px' },
      { emoji: '🍦', top: '45%', left: '4%', dur: '9s', delay: '2s', size: '24px' },
      { emoji: '🌮', top: '65%', right: '4%', dur: '7.5s', delay: '1.5s', size: '28px' },
      { emoji: '🍣', top: '8%', left: '48%', dur: '10s', delay: '0.8s', size: '22px' },
      { emoji: '🥤', bottom: '8%', right: '22%', dur: '6.5s', delay: '2.5s', size: '26px' },
      { emoji: '🍩', top: '78%', left: '3%', dur: '8s', delay: '1.2s', size: '20px' },
      { emoji: '🧁', bottom: '42%', right: '3%', dur: '9s', delay: '0.6s', size: '22px' },
      { emoji: '🍝', top: '35%', left: '55%', dur: '11s', delay: '2.2s', size: '20px' },
      { emoji: '🍛', top: '50%', left: '8%', dur: '8.5s', delay: '1.8s', size: '22px' },
      { emoji: '🍰', bottom: '10%', left: '35%', dur: '7.2s', delay: '0.4s', size: '20px' },
      { emoji: '🍪', top: '10%', right: '25%', dur: '9.5s', delay: '3s', size: '18px' },
      { emoji: '🥟', bottom: '50%', right: '8%', dur: '8.2s', delay: '1.1s', size: '20px' },
    ];
    const sparkles = Array.from({ length: 30 }, (_, i) => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 4 + 2,
      delay: `${Math.random() * 5}s`,
      dur: `${Math.random() * 3 + 3}s`,
    }));
    return (
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        {gradientOrbs.map((orb, i) => (
          <div key={`orb-${i}`} style={{
            position: 'absolute',
            width: orb.size,
            height: orb.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            top: orb.top,
            right: orb.right,
            left: orb.left,
            bottom: orb.bottom,
            animation: orb.anim,
            filter: 'blur(60px)',
          }} />
        ))}
        {foodParticles.map((p, i) => (
          <span key={`food-${i}`} style={{
            position: 'absolute',
            top: p.top,
            left: p.left,
            right: p.right,
            bottom: p.bottom,
            fontSize: p.size,
            animation: `float ${p.dur} ease-in-out infinite`,
            animationDelay: p.delay,
            opacity: 0.4,
            filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.05))',
            transition: 'opacity 0.3s',
          }}>{p.emoji}</span>
        ))}
        {sparkles.map((s, i) => (
          <div key={`sparkle-${i}`} style={{
            position: 'absolute',
            left: s.left,
            top: s.top,
            width: `${s.size}px`,
            height: `${s.size}px`,
            borderRadius: '50%',
            background: 'white',
            animation: `twinkle ${s.dur} ease-in-out infinite`,
            animationDelay: s.delay,
            opacity: 0,
          }} />
        ))}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <BackgroundParticles />
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo} onClick={() => setCurrentPage('home')}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}>
          <span className="logo-z" style={{
            background: 'linear-gradient(135deg, #E23744, #ff6b6b, #ffd700, #ff6b6b, #E23744)',
            backgroundSize: '200% 100%',
            borderRadius: '14px',
            padding: '6px 12px',
            fontSize: '22px',
            lineHeight: '1',
            boxShadow: '0 2px 16px rgba(226,55,68,0.4), 0 0 20px rgba(226,55,68,0.1)',
            display: 'inline-block',
          }}>Z</span>
          <span className="text-gradient" style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px' }}>omato</span>
        </div>
        <div style={styles.navButtons}>
          <button
            style={currentPage === 'home' ? { ...styles.navButton, ...styles.navButtonActive } : styles.navButton}
            className={currentPage === 'home' ? 'nav-btn-active' : ''}
            onClick={() => setCurrentPage('home')}
            onMouseEnter={e => { if (currentPage !== 'home') { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
            onMouseLeave={e => { if (currentPage !== 'home') { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; e.currentTarget.style.transform = 'translateY(0)'; } }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Home
          </button>
          <button
            style={{
              ...(currentPage === 'cart' ? { ...styles.navButton, ...styles.navButtonActive } : styles.navButton),
              position: 'relative',
            }}
            className={currentPage === 'cart' ? 'nav-btn-active' : ''}
            onClick={() => cart.length > 0 && setCurrentPage('cart')}
            onMouseEnter={e => { if (currentPage !== 'cart') { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
            onMouseLeave={e => { if (currentPage !== 'cart') { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; e.currentTarget.style.transform = 'translateY(0)'; } }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            Cart
            {cart.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                background: '#E23744',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 700,
                boxShadow: '0 2px 8px rgba(226,55,68,0.4)',
                animation: 'badgeBounce 0.4s ease-in-out',
              }}>
                {cart.reduce((sum, i) => sum + i.quantity, 0)}
              </span>
            )}
          </button>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '8px', paddingLeft: '16px', borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={user.photo}
                  alt={user.name}
                  style={{ width: '34px', height: '34px', borderRadius: '50%', border: '2px solid rgba(226,55,68,0.5)', objectFit: 'cover' }}
                />
                <span style={{ position: 'absolute', bottom: '-1px', right: '-1px', width: '10px', height: '10px', background: '#22c55e', borderRadius: '50%', border: '2px solid rgba(8,8,12,0.85)' }} />
              </div>
              <span style={{ fontWeight: 500, fontSize: '14px' }}>{user.name}</span>
              <button
                style={{ ...styles.navButton, color: 'rgba(255,255,255,0.5)', fontSize: '12px', padding: '6px 14px' }}
                onClick={handleLogout}
                onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(226,55,68,0.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'transparent'; }}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              style={{ ...styles.navButton, background: 'linear-gradient(135deg, rgba(226,55,68,0.2), rgba(226,55,68,0.1))', color: '#fff', fontWeight: 600, padding: '10px 24px', border: '1px solid rgba(226,55,68,0.25)', boxShadow: '0 0 12px rgba(226,55,68,0.1)' }}
              onClick={() => setShowLoginModal(true)}
              onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(226,55,68,0.35), rgba(226,55,68,0.2))'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(226,55,68,0.25)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(226,55,68,0.2), rgba(226,55,68,0.1))'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 12px rgba(226,55,68,0.1)'; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Pages */}
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'restaurant' && <RestaurantPage />}
      {currentPage === 'cart' && <CartPage />}
      {currentPage === 'tracking' && <TrackingPage />}

      {/* Login Modal */}
      <LoginModal />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
