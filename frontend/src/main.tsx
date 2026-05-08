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
  {
    id: 'r7',
    name: 'Tandoori Nights',
    cuisine: 'North Indian, Mughlai, Kebab',
    rating: 4.7,
    deliveryTime: 35,
    costForTwo: 900,
    locality: 'Connaught Place',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=250&fit=crop',
    menu: [
      { id: 'm49', name: 'Tandoori Chicken Platter', description: 'Whole chicken marinated in yogurt and spices, grilled in clay oven', price: 520, image: 'https://images.unsplash.com/photo-1610057099443-fde6c99db9e1?w=300&h=200&fit=crop', category: 'Starters', isVeg: false, rating: 4.8 },
      { id: 'm50', name: 'Galouti Kebab', description: 'Melt-in-the-mouth minced lamb kebabs with aromatic spices', price: 420, image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=300&h=200&fit=crop', category: 'Starters', isVeg: false, rating: 4.9 },
      { id: 'm51', name: 'Mutton Rogan Josh', description: 'Kashmiri-style lamb curry with rich red gravy', price: 480, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&h=200&fit=crop', category: 'Main Course', isVeg: false, rating: 4.7 },
      { id: 'm52', name: 'Dal Tadka', description: 'Yellow lentils tempered with cumin and garlic', price: 220, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop', category: 'Main Course', isVeg: true, rating: 4.5 },
      { id: 'm53', name: 'Biryani', description: 'Fragrant basmati rice layered with spiced meat', price: 390, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&h=200&fit=crop', category: 'Biryani', isVeg: false, rating: 4.8 },
      { id: 'm54', name: 'Garlic Naan', description: 'Soft leavened bread with garlic butter', price: 70, image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=300&h=200&fit=crop', category: 'Breads', isVeg: true, rating: 4.6 },
      { id: 'm55', name: 'Kheer', description: 'Creamy rice pudding with cardamom and nuts', price: 180, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&h=200&fit=crop', category: 'Desserts', isVeg: true, rating: 4.4 },
      { id: 'm56', name: 'Mango Lassi', description: 'Refreshing yogurt drink with mango pulp', price: 140, image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=300&h=200&fit=crop', category: 'Beverages', isVeg: true, rating: 4.7 },
    ],
  },
  {
    id: 'r8',
    name: 'The Thai House',
    cuisine: 'Thai, Asian, Seafood',
    rating: 4.3,
    deliveryTime: 40,
    costForTwo: 1100,
    locality: 'Bandra West',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=250&fit=crop',
    menu: [
      { id: 'm57', name: 'Pad Thai', description: 'Stir-fried rice noodles with shrimp, peanuts and tamarind sauce', price: 350, image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=300&h=200&fit=crop', category: 'Noodles', isVeg: false, rating: 4.6 },
      { id: 'm58', name: 'Tom Yum Soup', description: 'Hot and sour Thai soup with shrimp and mushrooms', price: 290, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&h=200&fit=crop', category: 'Soups', isVeg: false, rating: 4.5 },
      { id: 'm59', name: 'Green Curry', description: 'Aromatic coconut curry with Thai basil and vegetables', price: 380, image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=300&h=200&fit=crop', category: 'Curry', isVeg: true, rating: 4.4 },
      { id: 'm60', name: 'Spring Rolls', description: 'Crispy rolls stuffed with glass noodles and vegetables', price: 210, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&h=200&fit=crop', category: 'Starters', isVeg: true, rating: 4.3 },
      { id: 'm61', name: 'Massaman Curry', description: 'Rich peanut-based curry with potatoes and chicken', price: 420, image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=300&h=200&fit=crop', category: 'Curry', isVeg: false, rating: 4.7 },
      { id: 'm62', name: 'Thai Fried Rice', description: 'Jasmine rice stir-fried with vegetables and Thai spices', price: 280, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&h=200&fit=crop', category: 'Rice', isVeg: true, rating: 4.2 },
      { id: 'm63', name: 'Satay Chicken', description: 'Grilled chicken skewers with peanut dipping sauce', price: 340, image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=300&h=200&fit=crop', category: 'Starters', isVeg: false, rating: 4.6 },
      { id: 'm64', name: 'Mango Sticky Rice', description: 'Sweet sticky rice with fresh mango and coconut cream', price: 230, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&h=200&fit=crop', category: 'Desserts', isVeg: true, rating: 4.8 },
    ],
  },
  {
    id: 'r9',
    name: 'Cafe Brew & Bite',
    cuisine: 'Cafe, Continental, Bakery',
    rating: 4.1,
    deliveryTime: 25,
    costForTwo: 600,
    locality: 'Koramangala',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=250&fit=crop',
    menu: [
      { id: 'm65', name: 'Avocado Toast', description: 'Smashed avocado on sourdough with cherry tomatoes', price: 320, image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=300&h=200&fit=crop', category: 'Breakfast', isVeg: true, rating: 4.4 },
      { id: 'm66', name: 'Blueberry Pancakes', description: 'Fluffy pancakes with fresh blueberries and maple syrup', price: 350, image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=200&fit=crop', category: 'Breakfast', isVeg: true, rating: 4.6 },
      { id: 'm67', name: 'Club Sandwich', description: 'Triple-decker with chicken, bacon, lettuce and tomato', price: 280, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&h=200&fit=crop', category: 'Burgers', isVeg: false, rating: 4.3 },
      { id: 'm68', name: 'Caesar Salad', description: 'Crisp romaine with parmesan, croutons and Caesar dressing', price: 260, image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop', category: 'Salads', isVeg: true, rating: 4.2 },
      { id: 'm69', name: 'Cold Brew Coffee', description: 'Slow-steeped cold brew served over ice', price: 190, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=200&fit=crop', category: 'Beverages', isVeg: true, rating: 4.7 },
      { id: 'm70', name: 'Red Velvet Cake', description: 'Moist red velvet with cream cheese frosting', price: 240, image: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=300&h=200&fit=crop', category: 'Desserts', isVeg: true, rating: 4.5 },
      { id: 'm71', name: 'Smoothie Bowl', description: 'Acai smoothie topped with granola, berries and banana', price: 350, image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=300&h=200&fit=crop', category: 'Breakfast', isVeg: true, rating: 4.4 },
      { id: 'm72', name: 'French Fries', description: 'Golden crispy fries with truffle mayo', price: 170, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop', category: 'Sides', isVeg: true, rating: 4.3 },
    ],
  },
  {
    id: 'r10',
    name: 'El Mariachi',
    cuisine: 'Mexican, Tex-Mex',
    rating: 4.2,
    deliveryTime: 30,
    costForTwo: 750,
    locality: 'Indiranagar',
    image: 'https://images.unsplash.com/photo-1553621042-f6e147280480?w=400&h=250&fit=crop',
    menu: [
      { id: 'm73', name: 'Tacos Al Pastor', description: 'Spiced pork tacos with pineapple and cilantro', price: 320, image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300&h=200&fit=crop', category: 'Tacos', isVeg: false, rating: 4.6 },
      { id: 'm74', name: 'Burrito Bowl', description: 'Rice bowl with beans, salsa, guacamole and chicken', price: 380, image: 'https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?w=300&h=200&fit=crop', category: 'Bowls', isVeg: false, rating: 4.5 },
      { id: 'm75', name: 'Nachos Supreme', description: 'Crispy tortilla chips with cheese, beans and jalapenos', price: 290, image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=300&h=200&fit=crop', category: 'Starters', isVeg: true, rating: 4.4 },
      { id: 'm76', name: 'Quesadilla', description: 'Grilled tortilla with melted cheese and mushrooms', price: 270, image: 'https://images.unsplash.com/photo-1618040996337-56904b7850b4?w=300&h=200&fit=crop', category: 'Tacos', isVeg: true, rating: 4.3 },
      { id: 'm77', name: 'Guacamole & Chips', description: 'Fresh mashed avocado with lime and tortilla chips', price: 220, image: 'https://images.unsplash.com/photo-1600335895229-6bf2509e86f6?w=300&h=200&fit=crop', category: 'Starters', isVeg: true, rating: 4.5 },
      { id: 'm78', name: 'Churros', description: 'Crispy fried dough with cinnamon sugar and chocolate dip', price: 190, image: 'https://images.unsplash.com/photo-1624353363682-586c6326e442?w=300&h=200&fit=crop', category: 'Desserts', isVeg: true, rating: 4.7 },
      { id: 'm79', name: 'Margarita', description: 'Classic cocktail with tequila, lime and triple sec', price: 450, image: 'https://images.unsplash.com/photo-1514361892635-6b07e31e75f0?w=300&h=200&fit=crop', category: 'Beverages', isVeg: true, rating: 4.6 },
      { id: 'm80', name: 'Enchiladas', description: 'Rolled tortillas filled with chicken in spicy sauce', price: 360, image: 'https://images.unsplash.com/photo-1534352956036-cd81e27dd615?w=300&h=200&fit=crop', category: 'Main Course', isVeg: false, rating: 4.4 },
    ],
  },
  {
    id: 'r11',
    name: 'Hyderabad Biryani House',
    cuisine: 'Hyderabadi, Mughlai, Kebab',
    rating: 4.8,
    deliveryTime: 35,
    costForTwo: 700,
    locality: 'Hitech City',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=250&fit=crop',
    menu: [
      { id: 'm81', name: 'Hyderabadi Biryani', description: 'Fragrant dum-cooked biryani with tender mutton', price: 450, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&h=200&fit=crop', category: 'Biryani', isVeg: false, rating: 4.9 },
      { id: 'm82', name: 'Chicken 65', description: 'Crispy deep-fried chicken with South Indian spices', price: 280, image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=300&h=200&fit=crop', category: 'Starters', isVeg: false, rating: 4.6 },
      { id: 'm83', name: 'Mirchi ka Salan', description: 'Spicy curry made with long green chilies and peanuts', price: 200, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop', category: 'Main Course', isVeg: true, rating: 4.4 },
      { id: 'm84', name: 'Double Ka Meetha', description: 'Hyderabadi bread pudding with dry fruits', price: 180, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&h=200&fit=crop', category: 'Desserts', isVeg: true, rating: 4.5 },
      { id: 'm85', name: 'Haleem', description: 'Slow-cooked meat and wheat porridge with spices', price: 350, image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=300&h=200&fit=crop', category: 'Main Course', isVeg: false, rating: 4.7 },
      { id: 'm86', name: 'Nihari', description: 'Slow-cooked beef shank stew with rich gravy', price: 380, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&h=200&fit=crop', category: 'Main Course', isVeg: false, rating: 4.6 },
      { id: 'm87', name: 'Khubani ka Meetha', description: 'Apricot dessert with cream and dry fruits', price: 200, image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=200&fit=crop', category: 'Desserts', isVeg: true, rating: 4.7 },
      { id: 'm88', name: 'Irani Chai', description: 'Traditional Hyderabadi tea with milk and spices', price: 60, image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=300&h=200&fit=crop', category: 'Beverages', isVeg: true, rating: 4.5 },
    ],
  },
  {
    id: 'r12',
    name: 'Madras Cafe',
    cuisine: 'South Indian, Chettinad, Kerala',
    rating: 4.5,
    deliveryTime: 25,
    costForTwo: 400,
    locality: 'T Nagar',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=250&fit=crop',
    menu: [
      { id: 'm89', name: 'Chettinad Chicken', description: 'Spicy chicken curry with Chettinad masala', price: 320, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=200&fit=crop', category: 'Main Course', isVeg: false, rating: 4.7 },
      { id: 'm90', name: 'Meals', description: 'Traditional South Indian full meal on banana leaf', price: 250, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300&h=200&fit=crop', category: 'Main Course', isVeg: true, rating: 4.6 },
      { id: 'm91', name: 'Fish Curry', description: 'Tangy Kerala-style fish curry with coconut', price: 350, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&h=200&fit=crop', category: 'Main Course', isVeg: false, rating: 4.5 },
      { id: 'm92', name: 'Appam with Stew', description: 'Soft lacy rice pancakes with vegetable stew', price: 220, image: 'https://images.unsplash.com/photo-1630383249896-424e484df988?w=300&h=200&fit=crop', category: 'Main Course', isVeg: true, rating: 4.4 },
      { id: 'm93', name: 'Medu Vada', description: 'Crispy lentil donuts with coconut chutney', price: 80, image: 'https://images.unsplash.com/photo-1668236555542-83bd53e4f957?w=300&h=200&fit=crop', category: 'Starters', isVeg: true, rating: 4.5 },
      { id: 'm94', name: 'Rava Dosa', description: 'Crispy semolina crepe with onion and chutney', price: 130, image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=300&h=200&fit=crop', category: 'Dosa', isVeg: true, rating: 4.6 },
      { id: 'm95', name: 'Payasam', description: 'Sweet Kerala-style rice pudding with cardamom', price: 120, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&h=200&fit=crop', category: 'Desserts', isVeg: true, rating: 4.3 },
      { id: 'm96', name: 'Filter Coffee', description: 'Traditional South Indian filter coffee', price: 50, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=200&fit=crop', category: 'Beverages', isVeg: true, rating: 4.8 },
    ],
  },
  {
    id: 'r13',
    name: 'Kolkata Street Food Hub',
    cuisine: 'Bengali, Street Food, Chinese',
    rating: 4.4,
    deliveryTime: 30,
    costForTwo: 500,
    locality: 'Salt Lake',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=250&fit=crop',
    menu: [
      { id: 'm97', name: 'Kathi Roll', description: 'Flaky paratha wrapped with spiced chicken and onions', price: 180, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&h=200&fit=crop', category: 'Street Food', isVeg: false, rating: 4.6 },
      { id: 'm98', name: 'Macher Jhol', description: 'Traditional Bengali fish curry with rice', price: 320, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&h=200&fit=crop', category: 'Main Course', isVeg: false, rating: 4.7 },
      { id: 'm99', name: 'Phuchka', description: 'Crispy hollow puri filled with spicy tamarind water', price: 60, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=200&fit=crop', category: 'Street Food', isVeg: true, rating: 4.5 },
      { id: 'm100', name: 'Chicken Biryani', description: 'Kolkata-style biryani with potato and egg', price: 350, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&h=200&fit=crop', category: 'Biryani', isVeg: false, rating: 4.6 },
      { id: 'm101', name: 'Chingri Malai Curry', description: 'Prawns in creamy coconut milk gravy', price: 420, image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=300&h=200&fit=crop', category: 'Main Course', isVeg: false, rating: 4.8 },
      { id: 'm102', name: 'Luchi & Cholar Dal', description: 'Deep-fried puffed bread with Bengal gram curry', price: 140, image: 'https://images.unsplash.com/photo-1630383249896-424e484df988?w=300&h=200&fit=crop', category: 'Main Course', isVeg: true, rating: 4.4 },
      { id: 'm103', name: 'Rosogolla', description: 'Soft spongy cottage cheese balls in sugar syrup', price: 100, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&h=200&fit=crop', category: 'Desserts', isVeg: true, rating: 4.7 },
      { id: 'm104', name: 'Misti Doi', description: 'Sweet Bengali yogurt in earthen pot', price: 90, image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=200&fit=crop', category: 'Desserts', isVeg: true, rating: 4.5 },
    ],
  },
  {
    id: 'r14',
    name: 'Punjab Grill & Dhaba',
    cuisine: 'Punjabi, North Indian, Dhaba',
    rating: 4.6,
    deliveryTime: 30,
    costForTwo: 600,
    locality: 'Sector 17',
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=250&fit=crop',
    menu: [
      { id: 'm105', name: 'Amritsari Kulcha', description: 'Stuffed bread with chole and chutney', price: 180, image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=300&h=200&fit=crop', category: 'Breads', isVeg: true, rating: 4.7 },
      { id: 'm106', name: 'Sarson ka Saag', description: 'Winter specialty of mustard greens with butter', price: 250, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop', category: 'Main Course', isVeg: true, rating: 4.5 },
      { id: 'm107', name: 'Makki di Roti', description: 'Corn flour flatbread served with saag', price: 60, image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=300&h=200&fit=crop', category: 'Breads', isVeg: true, rating: 4.4 },
      { id: 'm108', name: 'Butter Chicken', description: 'Creamy tomato gravy with tender chicken', price: 380, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=200&fit=crop', category: 'Main Course', isVeg: false, rating: 4.8 },
      { id: 'm109', name: 'Dal Makhani', description: 'Slow-cooked black lentils with cream and butter', price: 240, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop', category: 'Main Course', isVeg: true, rating: 4.6 },
      { id: 'm110', name: 'Paneer Tikka', description: 'Grilled cottage cheese with bell peppers and spices', price: 290, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300&h=200&fit=crop', category: 'Starters', isVeg: true, rating: 4.4 },
      { id: 'm111', name: 'Lassi', description: 'Thick creamy yogurt drink with a hint of cardamom', price: 120, image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=300&h=200&fit=crop', category: 'Beverages', isVeg: true, rating: 4.6 },
      { id: 'm112', name: 'Gulab Jamun', description: 'Soft fried milk dumplings in rose syrup', price: 140, image: 'https://images.unsplash.com/photo-1666190077588-55b0f5a3d585?w=300&h=200&fit=crop', category: 'Desserts', isVeg: true, rating: 4.5 },
    ],
  },
  {
    id: 'r15',
    name: 'Wok & Roll Chinese',
    cuisine: 'Chinese, Tibetan, Asian',
    rating: 4.3,
    deliveryTime: 25,
    costForTwo: 450,
    locality: 'CG Road',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=250&fit=crop',
    menu: [
      { id: 'm113', name: 'Kung Pao Chicken', description: 'Spicy stir-fried chicken with peanuts and veggies', price: 320, image: 'https://images.unsplash.com/photo-1525755662778-929ea6083e29?w=300&h=200&fit=crop', category: 'Main Course', isVeg: false, rating: 4.5 },
      { id: 'm114', name: 'Dim Sum Basket', description: 'Assorted steamed dumplings with 3 dips', price: 350, image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=300&h=200&fit=crop', category: 'Starters', isVeg: false, rating: 4.6 },
      { id: 'm115', name: 'Schezwan Noodles', description: 'Spicy stir-fried noodles with vegetables', price: 220, image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=300&h=200&fit=crop', category: 'Noodles', isVeg: true, rating: 4.4 },
      { id: 'm116', name: 'Manchow Soup', description: 'Hot and spicy soup with crispy noodles', price: 150, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&h=200&fit=crop', category: 'Soups', isVeg: true, rating: 4.3 },
      { id: 'm117', name: 'Chilli Garlic Prawns', description: 'Crispy prawns tossed in chilli garlic sauce', price: 420, image: 'https://images.unsplash.com/photo-1553621042-f6e147280480?w=300&h=200&fit=crop', category: 'Starters', isVeg: false, rating: 4.7 },
      { id: 'm118', name: 'Fried Rice', description: 'Classic Chinese fried rice with egg and veggies', price: 190, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&h=200&fit=crop', category: 'Rice', isVeg: true, rating: 4.3 },
      { id: 'm119', name: 'Spring Rolls', description: 'Crispy vegetable spring rolls with sweet chili dip', price: 170, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&h=200&fit=crop', category: 'Starters', isVeg: true, rating: 4.2 },
      { id: 'm120', name: 'Hot & Sour Soup', description: 'Tangy and spicy soup with tofu and mushrooms', price: 140, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&h=200&fit=crop', category: 'Soups', isVeg: true, rating: 4.4 },
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
  const [currentPage, setCurrentPage] = useState<'home' | 'restaurant' | 'cart' | 'login' | 'tracking' | 'checkout' | 'hyperpure' | 'district'>('home');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('All');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState({ address: '', phone: '', instructions: '' });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card');
  const [showSuccess, setShowSuccess] = useState(false);

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
    return restaurants.filter(r => {
      const matchesSearch = !searchQuery ||
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.locality.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCuisine = selectedCuisine === 'All' ||
        r.cuisine.toLowerCase().includes(selectedCuisine.toLowerCase());
      return matchesSearch && matchesCuisine;
    });
  }, [searchQuery, selectedCuisine]);

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

  // Place order – finalizes order, shows success animation, then navigates to tracking map
  const finalizeOrder = useCallback(() => {
    if (!user) { setShowLoginModal(true); return; }
    if (cart.length === 0) return;
    const deliveryFee = cartTotal >= 299 ? 25 : 40;
    const taxes = Math.round(cartTotal * 0.05);
    const total = cartTotal + deliveryFee + taxes;
    const driver = drivers[Math.floor(Math.random() * drivers.length)];
    const restaurantLocation: [number, number] = [12.9352, 77.6245];
    const userLocation: [number, number] = [12.9716, 77.5946];
    const order: Order = {
      id: generateOrderId(), items: [...cart], total,
      status: 'preparing', driver,
      estimatedTime: selectedRestaurant?.deliveryTime || 30,
      restaurantLocation, userLocation,
    };
    setCurrentOrder(order);
    setCart([]);
    setShowSuccess(true);
    setTimeout(() => { setShowSuccess(false); setCurrentPage('tracking'); }, 3000);
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
      gap: '4px',
      alignItems: 'center',
    },
    navButton: {
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
      color: 'rgba(255,255,255,0.7)',
      padding: '10px 20px',
      borderRadius: '14px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 500,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      letterSpacing: '0.3px',
      position: 'relative' as const,
      backdropFilter: 'blur(8px)',
    },
    navButtonActive: {
      background: 'linear-gradient(135deg, rgba(226,55,68,0.2), rgba(226,55,68,0.08))',
      border: '1px solid rgba(226,55,68,0.3)',
      color: '#fff',
      boxShadow: '0 0 20px rgba(226,55,68,0.2), inset 0 0 20px rgba(226,55,68,0.05)',
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
    checkoutStep: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      marginBottom: '20px',
      padding: '20px',
      borderRadius: '16px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
    },
    checkoutStepNumber: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #E23744, #ff6b6b)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: 700,
      color: '#fff',
      flexShrink: 0,
    },
    checkoutInput: {
      width: '100%',
      padding: '14px 16px',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.08)',
      background: 'rgba(255,255,255,0.04)',
      color: '#fff',
      fontSize: '14px',
      outline: 'none',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box' as const,
    },
    paymentOption: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      padding: '16px 20px',
      borderRadius: '14px',
      border: '1px solid rgba(255,255,255,0.06)',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      background: 'rgba(255,255,255,0.02)',
    },
    paymentDot: {
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      border: '2px solid rgba(255,255,255,0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease',
      flexShrink: 0,
    },
    paymentDotInner: {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      background: '#E23744',
      transition: 'all 0.3s ease',
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
      @keyframes cartFloat {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-8px) rotate(-6deg); }
      }
      @keyframes progressGlow {
        0%, 100% { box-shadow: 0 0 8px rgba(34,197,94,0.2); }
        50% { box-shadow: 0 0 20px rgba(34,197,94,0.5); }
      }
      @keyframes fadeScaleIn {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
      }
      @keyframes slideOutRight {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(40px); }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes fadeSlideDown {
        from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
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

  // Popular dishes for featured section
  const popularDishes = [
    { name: 'Margherita Pizza', description: 'Fresh mozzarella, tomatoes, and basil on crispy crust', price: 299, rating: 4.5, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=250&fit=crop' },
    { name: 'Butter Chicken', description: 'Creamy tomato curry with tender chicken pieces', price: 349, rating: 4.7, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=250&fit=crop' },
    { name: 'Salmon Sushi Roll', description: 'Fresh salmon with avocado and seasoned rice', price: 449, rating: 4.8, image: 'https://images.unsplash.com/photo-1553621042-f6e147280480?w=400&h=250&fit=crop' },
    { name: 'Classic Cheeseburger', description: 'Juicy beef patty with melted cheddar and fries', price: 249, rating: 4.6, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=250&fit=crop' },
    { name: 'Tandoori Chicken Platter', description: 'Whole chicken marinated in yogurt, grilled in clay oven', price: 520, rating: 4.8, image: 'https://images.unsplash.com/photo-1610057099443-fde6c99db9e1?w=400&h=250&fit=crop' },
    { name: 'Pad Thai Noodles', description: 'Stir-fried rice noodles with shrimp and tamarind', price: 350, rating: 4.6, image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&h=250&fit=crop' },
    { name: 'Galouti Kebab', description: 'Melt-in-the-mouth minced lamb kebabs', price: 420, rating: 4.9, image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400&h=250&fit=crop' },
    { name: 'Chicken Biryani', description: 'Aromatic basmati rice with spiced chicken', price: 390, rating: 4.8, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=250&fit=crop' },
  ];

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
            🌆 Popular cities
          </h3>
          <div className="cities-grid" style={styles.citiesGrid}>
            {[
              { name: 'Mumbai', img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=300&h=180&fit=crop&q=80', count: restaurants.filter(r => ['Bandra West'].includes(r.locality)).length },
              { name: 'Pune', img: 'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?w=300&h=180&fit=crop&q=80', count: 12 },
              { name: 'Bengaluru', img: 'https://images.unsplash.com/photo-1599761230913-1ec5c01255d4?w=300&h=180&fit=crop&q=80', count: restaurants.filter(r => ['Koramangala', 'Indiranagar', 'HSR Layout', 'Whitefield', 'Jayanagar', 'MG Road'].includes(r.locality)).length },
              { name: 'Delhi', img: 'https://images.unsplash.com/photo-1598951235041-5e8f7a9ae440?w=300&h=180&fit=crop&q=80', count: restaurants.filter(r => ['Connaught Place'].includes(r.locality)).length },
              { name: 'Chennai', img: 'https://images.unsplash.com/photo-1589802829985-817e51171b92?w=300&h=180&fit=crop&q=80', count: restaurants.filter(r => ['T Nagar'].includes(r.locality)).length },
              { name: 'Hyderabad', img: 'https://images.unsplash.com/photo-1596178060671-7a80dc8053ed?w=300&h=180&fit=crop&q=80', count: restaurants.filter(r => ['Hitech City'].includes(r.locality)).length },
              { name: 'Kolkata', img: 'https://images.unsplash.com/photo-1560931684-3bc4aa8c630d?w=300&h=180&fit=crop&q=80', count: restaurants.filter(r => ['Salt Lake'].includes(r.locality)).length },
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

      {/* Cuisine Categories */}
      <div style={{ marginTop: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <span style={{ width: '4px', height: '24px', background: '#E23744', borderRadius: '2px' }} />
          <h2 style={{ margin: 0, color: '#e5e7eb', fontSize: '22px', fontWeight: 700 }}>Categories</h2>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>— What's on your mind?</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
          {[
            { name: 'All', icon: '🍽️', desc: 'All restaurants' },
            { name: 'North Indian', icon: '🍛', desc: 'Curries & breads' },
            { name: 'Chinese', icon: '🥟', desc: 'Noodles & dumplings' },
            { name: 'South Indian', icon: '🥞', desc: 'Dosa & idli' },
            { name: 'Italian', icon: '🍕', desc: 'Pizza & pasta' },
            { name: 'Mughlai', icon: '🍗', desc: 'Rich & creamy' },
            { name: 'Burgers', icon: '🍔', desc: 'American fast food' },
            { name: 'Thai', icon: '🍜', desc: 'Curries & noodles' },
            { name: 'Bakery', icon: '🥐', desc: 'Cafe & desserts' },
            { name: 'Mexican', icon: '🌮', desc: 'Tacos & nachos' },
            { name: 'Hyderabadi', icon: '🍚', desc: 'Biryani & kebabs' },
            { name: 'Bengali', icon: '🐟', desc: 'Fish & sweets' },
          ].map((cuisine, i) => (
            <div
              key={cuisine.name}
              onClick={() => setSelectedCuisine(cuisine.name)}
              style={{
                background: selectedCuisine === cuisine.name
                  ? 'linear-gradient(135deg, rgba(226,55,68,0.15), rgba(226,55,68,0.05))'
                  : 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
                borderRadius: '16px', padding: '16px 12px', textAlign: 'center',
                cursor: 'pointer', border: selectedCuisine === cuisine.name
                  ? '1px solid rgba(226,55,68,0.3)' : '1px solid rgba(255,255,255,0.06)',
                transition: 'all 0.3s ease', animation: `cardFadeIn 0.4s ease-out ${0.03 * i}s both`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'rgba(226,55,68,0.2)';
                if (selectedCuisine !== cuisine.name) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = selectedCuisine === cuisine.name ? 'rgba(226,55,68,0.3)' : 'rgba(255,255,255,0.06)';
                if (selectedCuisine !== cuisine.name) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))';
                }
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '6px', lineHeight: 1 }}>{cuisine.icon}</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: selectedCuisine === cuisine.name ? '#fff' : 'rgba(255,255,255,0.8)', marginBottom: '2px' }}>{cuisine.name}</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>{cuisine.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Restaurants section */}
      <div style={{ position: 'relative' as const }}>
        <span style={{ position: 'absolute', top: '-10%', left: '-2%', fontSize: '28px', animation: 'menuItemFloat 8s ease-in-out infinite', opacity: 0.08, pointerEvents: 'none' }}>🍽️</span>
        <span style={{ position: 'absolute', top: '20%', right: '-3%', fontSize: '22px', animation: 'menuItemFloat 10s ease-in-out infinite 1s', opacity: 0.06, pointerEvents: 'none' }}>🥂</span>
        <span style={{ position: 'absolute', bottom: '5%', left: '5%', fontSize: '20px', animation: 'menuItemFloat 7s ease-in-out infinite 2s', opacity: 0.07, pointerEvents: 'none' }}>🔥</span>
        <span style={{ position: 'absolute', bottom: '30%', right: '-1%', fontSize: '24px', animation: 'menuItemFloat 9s ease-in-out infinite 0.5s', opacity: 0.06, pointerEvents: 'none' }}>✨</span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '32px', marginBottom: '0' }}>
          <span style={{ width: '4px', height: '24px', background: '#E23744', borderRadius: '2px' }} />
          <h2 style={{ margin: 0, color: '#e5e7eb', fontSize: '22px', fontWeight: 700 }}>
            Restaurants near you
          </h2>
          {selectedCuisine !== 'All' && (
            <span style={{
              padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
              background: 'rgba(226,55,68,0.15)', color: '#E23744',
              border: '1px solid rgba(226,55,68,0.2)',
            }}>
              {selectedCuisine}
            </span>
          )}
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px', marginLeft: 'auto' }}>
            {filteredRestaurants.length} {filteredRestaurants.length === 1 ? 'restaurant' : 'restaurants'}
          </span>
        </div>

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

      {/* Popular Dishes Section */}
      <div style={{ marginTop: '64px', position: 'relative' }}>
        <span style={{ position: 'absolute', top: '-15%', left: '2%', fontSize: '42px', animation: 'heroFloat1 8s ease-in-out infinite', opacity: 0.06, pointerEvents: 'none' }}>🍕</span>
        <span style={{ position: 'absolute', bottom: '5%', right: '3%', fontSize: '36px', animation: 'heroFloat2 10s ease-in-out infinite 2s', opacity: 0.05, pointerEvents: 'none' }}>🍔</span>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <p style={styles.sectionTitle}>Featured</p>
          <h2 style={styles.sectionHeading}>Popular Dishes 🌟</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
          {popularDishes.map((dish, idx) => (
            <div
              key={dish.name}
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                borderRadius: '24px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                animation: `cardFadeIn 0.5s ease-out ${0.1 + idx * 0.1}s both`,
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                cursor: 'pointer',
              }}
              className="card-glow"
            >
              <div style={{
                height: '190px',
                backgroundImage: `url(${dish.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', top: '12px', right: '12px',
                  background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                  padding: '4px 10px', borderRadius: '8px',
                  fontSize: '13px', fontWeight: 600, color: '#fbbf24',
                  display: 'flex', alignItems: 'center', gap: '4px',
                }}>
                  ⭐ {dish.rating}
                </div>
                <div style={{
                  position: 'absolute', bottom: '0', left: '0', right: '0',
                  height: '60%',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)',
                }} />
              </div>
              <div style={{ padding: '18px' }}>
                <h3 style={{ margin: '0 0 4px', color: '#fff', fontSize: '17px', fontWeight: 600 }}>{dish.name}</h3>
                <p style={{ margin: '0 0 14px', color: 'rgba(255,255,255,0.45)', fontSize: '13px', lineHeight: 1.4 }}>{dish.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '18px', background: 'linear-gradient(135deg, #E23744, #ff6b6b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    {formatPrice(dish.price)}
                  </span>
                  <button style={{
                    padding: '8px 18px', background: 'linear-gradient(135deg, #E23744, #ff6b6b)',
                    color: 'white', border: 'none', borderRadius: '10px',
                    fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                    transition: 'all 0.3s ease', boxShadow: '0 2px 10px rgba(226,55,68,0.3)',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(226,55,68,0.5)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(226,55,68,0.3)'; }}
                  >
                    Add +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div style={{ marginTop: '64px', position: 'relative' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
          borderRadius: '28px', padding: '48px 40px',
          border: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(226,55,68,0.05)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: '-50%', left: '30%',
            width: '400px', height: '400px',
            background: 'radial-gradient(circle, rgba(226,55,68,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <span style={{ position: 'absolute', top: '10px', left: '20px', fontSize: '28px', opacity: 0.15, animation: 'heroFloat1 7s ease-in-out infinite', pointerEvents: 'none' }}>🎉</span>
          <span style={{ position: 'absolute', top: '15px', right: '30px', fontSize: '24px', opacity: 0.12, animation: 'heroFloat2 8s ease-in-out infinite 1s', pointerEvents: 'none' }}>🚀</span>
          <span style={{ position: 'absolute', bottom: '15px', left: '40px', fontSize: '22px', opacity: 0.1, animation: 'heroFloat1 9s ease-in-out infinite 2s', pointerEvents: 'none' }}>❤️</span>
          <span style={{ position: 'absolute', bottom: '10px', right: '20px', fontSize: '26px', opacity: 0.12, animation: 'heroFloat2 6s ease-in-out infinite 0.5s', pointerEvents: 'none' }}>⭐</span>

          <div style={{ textAlign: 'center', marginBottom: '36px', position: 'relative', zIndex: 1 }}>
            <p style={styles.sectionTitle}>Our Numbers</p>
            <h2 style={styles.sectionHeading}>Serving food with love ❤️</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '24px', position: 'relative', zIndex: 1 }}>
            {[
              { emoji: '😊', value: '12,500+', label: 'Happy Customers', color: '#22c55e', delay: '0s' },
              { emoji: '📦', value: '50,000+', label: 'Orders Delivered', color: '#E23744', delay: '0.15s' },
              { emoji: '🏪', value: '500+', label: 'Restaurant Partners', color: '#fbbf24', delay: '0.3s' },
              { emoji: '🏙️', value: '25+', label: 'Cities Covered', color: '#3b82f6', delay: '0.45s' },
            ].map((stat, idx) => (
              <div
                key={stat.label}
                style={{
                  textAlign: 'center', padding: '24px 16px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '20px',
                  border: '1px solid rgba(255,255,255,0.05)',
                  animation: `cardFadeIn 0.5s ease-out ${stat.delay}s both`,
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.borderColor = `${stat.color}40`;
                  e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.3), 0 0 20px ${stat.color}15`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ fontSize: '40px', marginBottom: '12px', lineHeight: 1 }}>{stat.emoji}</div>
                <div style={{
                  fontSize: '32px', fontWeight: 800,
                  background: `linear-gradient(135deg, ${stat.color}, ${stat.color}dd)`,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  marginBottom: '6px',
                  animation: `fadeSlideUp 0.5s ease-out ${0.6 + idx * 0.1}s both`,
                }}>{stat.value}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', fontWeight: 500 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Cards Section */}
        <div style={{ marginTop: '64px', position: 'relative' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
            borderRadius: '28px', padding: '48px 40px',
            border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(226,55,68,0.05)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: '-30%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(226,55,68,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-20%', left: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(147,51,234,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <div style={{ textAlign: 'center', marginBottom: '36px', position: 'relative', zIndex: 1 }}>
              <p style={{ ...styles.sectionTitle, color: '#E23744' }}>Our Ecosystem</p>
              <h2 style={{ ...styles.sectionHeading, fontSize: '28px' }}>Explore our platforms</h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginTop: '-4px' }}>Three powerful platforms, one seamless experience</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', position: 'relative', zIndex: 1 }}>
              {/* Zomato Card */}
              <div style={{
                background: 'linear-gradient(180deg, rgba(226,55,68,0.08) 0%, rgba(226,55,68,0.02) 100%)',
                borderRadius: '24px', padding: '32px 24px', textAlign: 'center',
                border: '1px solid rgba(226,55,68,0.15)',
                transition: 'all 0.4s ease', cursor: 'pointer',
                animation: 'cardFadeIn 0.6s ease-out 0s both',
              }}
                onClick={() => { setSelectedRestaurant(null); setSearchQuery(''); setCurrentPage('home'); }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(226,55,68,0.15)'; e.currentTarget.style.borderColor = 'rgba(226,55,68,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(226,55,68,0.15)'; }}
              >
                <div style={{
                  width: '64px', height: '64px', borderRadius: '18px',
                  background: 'linear-gradient(135deg, #E23744, #ff6b6b)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px', fontSize: '30px', fontWeight: 800, color: '#fff',
                  boxShadow: '0 8px 24px rgba(226,55,68,0.3)',
                }}>Z</div>
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', margin: '0 0 8px' }}>Zomato</h3>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: '0 0 16px', lineHeight: 1.5 }}>
                  Order food from your favorite restaurants. 500+ restaurant partners, 25+ cities, 50,000+ orders delivered.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  {['🍕 Pizza', '🍔 Burger', '🍛 Biryani', '🥟 Chinese'].map((tag, i) => (
                    <span key={i} style={{
                      padding: '4px 12px', background: 'rgba(226,55,68,0.08)',
                      borderRadius: '20px', border: '1px solid rgba(226,55,68,0.1)',
                      color: 'rgba(255,255,255,0.6)', fontSize: '11px', fontWeight: 500,
                    }}>{tag}</span>
                  ))}
                </div>
                <button style={{
                  marginTop: '18px', padding: '12px 28px', width: '100%',
                  background: 'linear-gradient(135deg, #E23744, #ff6b6b)',
                  border: 'none', borderRadius: '12px', color: 'white',
                  fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                  transition: 'all 0.3s ease', boxShadow: '0 4px 16px rgba(226,55,68,0.3)',
                }}
                  onClick={(e) => { e.stopPropagation(); setCurrentPage('home'); }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(226,55,68,0.45)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(226,55,68,0.3)'; }}
                >Order Food Now →</button>
              </div>

              {/* District Card */}
              <div style={{
                background: 'linear-gradient(180deg, rgba(147,51,234,0.08) 0%, rgba(147,51,234,0.02) 100%)',
                borderRadius: '24px', padding: '32px 24px', textAlign: 'center',
                border: '1px solid rgba(147,51,234,0.15)',
                transition: 'all 0.4s ease', cursor: 'pointer',
                animation: 'cardFadeIn 0.6s ease-out 0.1s both',
              }}
                onClick={() => setCurrentPage('district')}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(147,51,234,0.15)'; e.currentTarget.style.borderColor = 'rgba(147,51,234,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(147,51,234,0.15)'; }}
              >
                <div style={{
                  width: '64px', height: '64px', borderRadius: '18px',
                  background: 'linear-gradient(135deg, #9333ea, #E23744)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px', fontSize: '28px',
                  boxShadow: '0 8px 24px rgba(147,51,234,0.3)',
                }}>🎭</div>
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', margin: '0 0 8px' }}>District</h3>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: '0 0 16px', lineHeight: 1.5 }}>
                  Movies, events, sports, dining & concerts. Book tickets for IPL, concerts, comedy shows & more.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  {['🎬 Movies', '🏏 IPL', '🎵 Concerts', '🎪 Events'].map((tag, i) => (
                    <span key={i} style={{
                      padding: '4px 12px', background: 'rgba(147,51,234,0.08)',
                      borderRadius: '20px', border: '1px solid rgba(147,51,234,0.1)',
                      color: 'rgba(255,255,255,0.6)', fontSize: '11px', fontWeight: 500,
                    }}>{tag}</span>
                  ))}
                </div>
                <button style={{
                  marginTop: '18px', padding: '12px 28px', width: '100%',
                  background: 'linear-gradient(135deg, #9333ea, #E23744)',
                  border: 'none', borderRadius: '12px', color: 'white',
                  fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                  transition: 'all 0.3s ease', boxShadow: '0 4px 16px rgba(147,51,234,0.3)',
                }}
                  onClick={(e) => { e.stopPropagation(); setCurrentPage('district'); }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(147,51,234,0.45)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(147,51,234,0.3)'; }}
                >Explore District →</button>
              </div>

              {/* Hyperpure Card */}
              <div style={{
                background: 'linear-gradient(180deg, rgba(34,197,94,0.08) 0%, rgba(34,197,94,0.02) 100%)',
                borderRadius: '24px', padding: '32px 24px', textAlign: 'center',
                border: '1px solid rgba(34,197,94,0.15)',
                transition: 'all 0.4s ease', cursor: 'pointer',
                animation: 'cardFadeIn 0.6s ease-out 0.2s both',
              }}
                onClick={() => setCurrentPage('hyperpure')}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(34,197,94,0.15)'; e.currentTarget.style.borderColor = 'rgba(34,197,94,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(34,197,94,0.15)'; }}
              >
                <div style={{
                  width: '64px', height: '64px', borderRadius: '18px',
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px', fontSize: '28px',
                  boxShadow: '0 8px 24px rgba(34,197,94,0.3)',
                }}>🏪</div>
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', margin: '0 0 8px' }}>Hyperpure</h3>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: '0 0 16px', lineHeight: 1.5 }}>
                  Wholesale supplies for restaurants. Fresh ingredients, packaging & essentials at wholesale prices.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  {['🥬 Produce', '🧀 Dairy', '🍗 Meat', '📦 Supplies'].map((tag, i) => (
                    <span key={i} style={{
                      padding: '4px 12px', background: 'rgba(34,197,94,0.08)',
                      borderRadius: '20px', border: '1px solid rgba(34,197,94,0.1)',
                      color: 'rgba(255,255,255,0.6)', fontSize: '11px', fontWeight: 500,
                    }}>{tag}</span>
                  ))}
                </div>
                <button style={{
                  marginTop: '18px', padding: '12px 28px', width: '100%',
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  border: 'none', borderRadius: '12px', color: 'white',
                  fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                  transition: 'all 0.3s ease', boxShadow: '0 4px 16px rgba(34,197,94,0.3)',
                }}
                  onClick={(e) => { e.stopPropagation(); setCurrentPage('hyperpure'); }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(34,197,94,0.45)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(34,197,94,0.3)'; }}
                >Visit Hyperpure →</button>
              </div>
            </div>
          </div>
        </div>

        {/* Details Summary Card */}
        <div style={{ marginTop: '40px', marginBottom: '40px' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
            borderRadius: '24px', padding: '36px 32px',
            border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(16px)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '3px', background: 'linear-gradient(90deg, #E23744, #9333ea, #22c55e)' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', position: 'relative', zIndex: 1 }}>
              <div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>About Zomato</div>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, margin: 0 }}>
                  Zomato is a leading food delivery platform connecting millions of customers with thousands of restaurant partners across India. 
                  We also operate District (events & entertainment) and Hyperpure (restaurant supplies).
                </p>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Quick Stats</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { label: 'Restaurant Partners', value: `${restaurants.length}+` },
                    { label: 'Cities Covered', value: '25+' },
                    { label: 'Menu Items', value: `${restaurants.reduce((s, r) => s + r.menu.length, 0)}+` },
                    { label: 'Avg. Delivery Time', value: '30 min' },
                  ].map((stat, i) => (
                    <div key={stat.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>{stat.label}</span>
                      <span style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Quick Links</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { label: 'Order Food', page: 'home', icon: '🍽️' },
                    { label: 'Book Events', page: 'district', icon: '🎭' },
                    { label: 'Restaurant Supplies', page: 'hyperpure', icon: '🏪' },
                    { label: 'View Cart', page: 'cart', icon: '🛒' },
                  ].map(link => (
                    <button key={link.label} onClick={() => setCurrentPage(link.page as any)} style={{
                      display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px',
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '10px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
                      fontSize: '13px', transition: 'all 0.3s', textAlign: 'left',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(226,55,68,0.2)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; }}
                    >
                      <span>{link.icon}</span> {link.label} <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.2)' }}>→</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Top Cuisines</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {['North Indian', 'Italian', 'Chinese', 'South Indian', 'Japanese', 'Mexican', 'Thai', 'American', 'Mughlai', 'Continental'].map(cuisine => (
                    <span key={cuisine} style={{
                      padding: '6px 14px', background: 'rgba(255,255,255,0.04)',
                      borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)',
                      color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 500,
                      transition: 'all 0.3s', cursor: 'pointer',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(226,55,68,0.1)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(226,55,68,0.2)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
                      onClick={() => { setSearchQuery(cuisine); setCurrentPage('home'); }}
                    >{cuisine}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
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
    const [removingId, setRemovingId] = useState<string | null>(null);
    const deliveryProgress = Math.min((cartTotal / 299) * 100, 100);
    const remainingForFree = Math.max(299 - cartTotal, 0);

    const handleRemove = (id: string) => {
      if (removingId) return;
      setRemovingId(id);
      setTimeout(() => {
        removeFromCart(id);
        setRemovingId(null);
      }, 250);
    };

    const cartOrbs = [
      { size: '400px', color: 'rgba(226,55,68,0.07)', top: '-5%', right: '-5%', anim: 'orbFloat 22s ease-in-out infinite', delay: '0s' },
      { size: '350px', color: 'rgba(34,197,94,0.05)', bottom: '-10%', left: '-5%', anim: 'orbFloat2 28s ease-in-out infinite', delay: '3s' },
      { size: '250px', color: 'rgba(251,191,36,0.04)', top: '40%', left: '40%', anim: 'orbFloat 20s ease-in-out infinite', delay: '5s' },
    ];

    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px', position: 'relative' as const, zIndex: 2 }}>
        {cartOrbs.map((orb, i) => (
          <div key={`cart-orb-${i}`} style={{
            position: 'absolute', width: orb.size, height: orb.size, borderRadius: '50%',
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            top: orb.top, right: orb.right, bottom: orb.bottom, left: orb.left,
            animation: orb.anim, animationDelay: orb.delay,
            filter: 'blur(60px)', pointerEvents: 'none',
          }} />
        ))}
        <span style={{ position: 'absolute', top: '2%', left: '5%', fontSize: '20px', animation: 'heroFloat1 7s ease-in-out infinite', opacity: 0.12, pointerEvents: 'none' }}>🍕</span>
        <span style={{ position: 'absolute', top: '12%', right: '6%', fontSize: '18px', animation: 'heroFloat2 9s ease-in-out infinite 1.5s', opacity: 0.1, pointerEvents: 'none' }}>🍔</span>
        <span style={{ position: 'absolute', bottom: '22%', left: '2%', fontSize: '22px', animation: 'heroFloat1 8s ease-in-out infinite 2.5s', opacity: 0.08, pointerEvents: 'none' }}>🌮</span>
        <span style={{ position: 'absolute', bottom: '8%', right: '4%', fontSize: '16px', animation: 'heroFloat2 10s ease-in-out infinite 0.8s', opacity: 0.1, pointerEvents: 'none' }}>🥤</span>

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
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
          onClick={() => selectedRestaurant ? setCurrentPage('restaurant') : setCurrentPage('home')}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateX(-4px)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.transform = 'translateX(0)'; }}
        >
          ← Back
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
          <span style={{ fontSize: '36px', animation: 'cartFloat 3s ease-in-out infinite' }}>🛒</span>
          <h1 style={{ margin: '0', fontSize: '32px', fontWeight: 800, background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.7))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Your Cart
          </h1>
          {cart.length > 0 && (
            <span style={{
              background: 'rgba(226,55,68,0.15)',
              color: '#ff6b6b',
              padding: '4px 14px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 600,
              border: '1px solid rgba(226,55,68,0.2)',
              animation: 'fadeScaleIn 0.4s ease-out',
            }}>
              {cart.reduce((sum, i) => sum + i.quantity, 0)} item{cart.reduce((sum, i) => sum + i.quantity, 0) !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {cart.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 40px',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
            borderRadius: '24px',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.06)',
            animation: 'cardFadeIn 0.5s ease-out',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 0%, rgba(226,55,68,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />
            <div style={{ fontSize: '80px', marginBottom: '20px', animation: 'cartFloat 4s ease-in-out infinite', lineHeight: 1 }}>🛒</div>
            <h3 style={{ color: '#fff', fontSize: '24px', margin: '0 0 8px', fontWeight: 700 }}>Your cart is empty</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', margin: '0 auto 32px', maxWidth: '400px' }}>Looks like you haven't added anything yet. Explore our restaurants and find something delicious!</p>
            <button
              style={{
                padding: '14px 32px',
                background: 'linear-gradient(135deg, #E23744, #ff6b6b)',
                color: 'white',
                border: 'none',
                borderRadius: '14px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(226,55,68,0.3)',
                transition: 'all 0.3s ease',
              }}
              onClick={() => setCurrentPage('home')}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(226,55,68,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(226,55,68,0.3)'; }}
            >
              Browse Restaurants
            </button>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '40px', flexWrap: 'wrap' }}>
              {['🍕', '🍔', '🍜', '🍣', '🥗'].map((emoji, i) => (
                <span key={i} style={{
                  fontSize: '32px',
                  animation: `heroFloat${(i % 2) + 1} ${6 + i}s ease-in-out infinite ${i * 0.5}s`,
                  opacity: 0.3,
                }}>{emoji}</span>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '28px', alignItems: 'start' }}>
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px',
                padding: '14px 20px',
                background: 'linear-gradient(135deg, rgba(226,55,68,0.08) 0%, rgba(226,55,68,0.02) 100%)',
                borderRadius: '16px',
                border: '1px solid rgba(226,55,68,0.1)',
                backdropFilter: 'blur(8px)',
              }}>
                <span style={{ fontSize: '20px' }}>📍</span>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ordering from</div>
                  <div style={{ color: '#fff', fontSize: '16px', fontWeight: 700 }}>{cart[0]?.restaurantName}</div>
                </div>
              </div>
              {cart.map((item, idx) => (
                <div
                  key={item.menuItem.id}
                  style={{
                    ...styles.cartItem,
                    animation: `slideInRight 0.5s ease-out ${0.05 * idx}s both`,
                    opacity: removingId === item.menuItem.id ? 0 : 1,
                    transform: removingId === item.menuItem.id ? 'translateX(40px)' : 'none',
                    transition: 'all 0.25s ease-out',
                    cursor: 'default',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    padding: '16px 20px',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(226,55,68,0.2)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3), 0 0 20px rgba(226,55,68,0.08)';
                    e.currentTarget.style.transform = removingId === item.menuItem.id ? 'translateX(40px)' : 'translateX(4px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2), 0 0 1px rgba(255,255,255,0.05)';
                    e.currentTarget.style.transform = removingId === item.menuItem.id ? 'translateX(40px)' : 'translateX(0)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <img
                        src={item.menuItem.image}
                        alt={item.menuItem.name}
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '12px',
                          objectFit: 'cover',
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}
                      />
                      <div style={{ position: 'absolute', top: '-4px', left: '-4px' }}>
                        <VegIndicator isVeg={item.menuItem.isVeg} />
                      </div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff', fontSize: '15px', marginBottom: '2px' }}>{item.menuItem.name}</div>
                      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>{formatPrice(item.menuItem.price)} each</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'rgba(255,255,255,0.04)',
                      borderRadius: '12px',
                      padding: '4px 6px',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}>
                      <button
                        style={{
                          width: '28px', height: '28px', borderRadius: '8px', border: 'none',
                          background: 'rgba(226,55,68,0.12)', color: '#ff6b6b', cursor: 'pointer',
                          fontWeight: 'bold', fontSize: '15px', transition: 'all 0.2s ease',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                        onClick={() => handleRemove(item.menuItem.id)}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(226,55,68,0.25)'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(226,55,68,0.12)'; e.currentTarget.style.transform = 'scale(1)'; }}
                      >
                        -
                      </button>
                      <span style={{ fontWeight: 700, minWidth: '24px', textAlign: 'center', color: '#fff', fontSize: '15px' }}>{item.quantity}</span>
                      <button
                        style={{
                          width: '28px', height: '28px', borderRadius: '8px', border: 'none',
                          background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white', cursor: 'pointer',
                          fontWeight: 'bold', fontSize: '15px', transition: 'all 0.2s ease',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(34,197,94,0.3)',
                        }}
                        onClick={() => selectedRestaurant && addToCart(selectedRestaurant, item.menuItem)}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(34,197,94,0.5)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(34,197,94,0.3)'; }}
                      >
                        +
                      </button>
                    </div>
                    <span style={{ fontWeight: 700, minWidth: '68px', textAlign: 'right', color: '#fff', fontSize: '15px' }}>
                      {formatPrice(item.menuItem.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {cartTotal < 299 && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(34,197,94,0.06) 0%, rgba(34,197,94,0.02) 100%)',
                  borderRadius: '16px',
                  padding: '16px',
                  border: '1px solid rgba(34,197,94,0.1)',
                  backdropFilter: 'blur(8px)',
                  animation: 'cardFadeIn 0.5s ease-out',
                  animationDelay: '0.2s',
                  animationFillMode: 'both' as const,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '16px' }}>🚚</span>
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: 500 }}>
                      Add {formatPrice(remainingForFree)} more for free delivery
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '6px',
                    background: 'rgba(255,255,255,0.06)',
                    borderRadius: '3px',
                    overflow: 'hidden',
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.2)',
                  }}>
                    <div style={{
                      width: `${deliveryProgress}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #22c55e, #16a34a)',
                      borderRadius: '3px',
                      transition: 'width 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      boxShadow: '0 0 12px rgba(34,197,94,0.3)',
                      animation: 'progressGlow 2s ease-in-out infinite',
                    }} />
                  </div>
                </div>
              )}
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
                  <span style={{
                    fontWeight: 600,
                    color: cartTotal >= 299 ? '#22c55e' : '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    {cartTotal >= 299 ? (
                      <>
                        <span style={{ fontSize: '12px', textDecoration: 'line-through', opacity: 0.4 }}>{formatPrice(40)}</span>
                        <span style={{ animation: 'badgeBounce 0.4s ease-in-out' }}>FREE</span>
                      </>
                    ) : formatPrice(deliveryFee)}
                  </span>
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
                  className={user ? 'btn-glow' : ''}
                  onClick={() => { if (!user) setShowLoginModal(true); else setCurrentPage('checkout'); }}
                  onMouseEnter={e => { if (user) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(226,55,68,0.5)'; } }}
                  onMouseLeave={e => { if (user) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(226,55,68,0.3)'; } }}
                >
                  {user ? `Proceed to Checkout • ${formatPrice(total)}` : 'Login to Order'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Checkout Page
  const CheckoutPage = () => {
    const deliveryFee = cartTotal >= 299 ? 25 : 40;
    const taxes = Math.round(cartTotal * 0.05);
    const total = cartTotal + deliveryFee + taxes;

    if (showSuccess) {
      const confettiEmojis = ['🎉', '🎊', '✨', '⭐', '🌟', '🍕', '🍔', '🌮', '🍣', '🥟'];
      return (
        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '60px 24px', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          {confettiEmojis.map((emoji, i) => (
            <span key={i} style={{
              position: 'absolute',
              fontSize: `${20 + Math.random() * 24}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `heroFloat${(i % 2) + 1} ${4 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: 0.5 + Math.random() * 0.3,
              pointerEvents: 'none',
            }}>{emoji}</span>
          ))}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(circle at 50% 30%, rgba(226,55,68,0.08) 0%, transparent 60%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            fontSize: '80px',
            animation: 'badgeBounce 0.6s ease-in-out',
            position: 'relative',
            display: 'inline-block',
          }}>✅</div>
          <div style={{ position: 'relative' }}>
            <h2 style={{
              fontSize: '32px', fontWeight: 800,
              margin: '20px 0 8px',
              background: 'linear-gradient(135deg, #22c55e, #16a34a, #22c55e)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradientShift 2s ease infinite',
            }}>Order Placed! 🎉</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px', animation: 'fadeSlideUp 0.5s ease-out 0.2s both' }}>Your delicious food is being prepared</p>
            <div style={{
              width: '64px', height: '4px',
              background: 'linear-gradient(90deg, #22c55e, #16a34a, #22c55e)',
              backgroundSize: '200% 100%',
              borderRadius: '2px',
              margin: '16px auto 0',
              animation: 'shimmerSlide 1.5s linear infinite',
            }} />
            <div style={{
              display: 'flex', justifyContent: 'center', gap: '20px',
              marginTop: '32px',
              animation: 'fadeSlideUp 0.5s ease-out 0.4s both',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '4px' }}>👨‍🍳</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Preparing</div>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.15)', fontSize: '28px', alignSelf: 'center' }}>→</div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '4px' }}>📦</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Packing</div>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.15)', fontSize: '28px', alignSelf: 'center' }}>→</div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '4px' }}>🏍️</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Delivery</div>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '12px', marginTop: '24px', animation: 'fadeSlideUp 0.5s ease-out 0.6s both' }}>
              Redirecting to tracking...
            </p>
          </div>
        </div>
      );
    }

    return (
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '24px', position: 'relative', zIndex: 2 }}>
        <div style={{ position: 'absolute', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(226,55,68,0.06) 0%, transparent 70%)', top: '-5%', right: '-10%', animation: 'orbFloat 25s ease-in-out infinite', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.04) 0%, transparent 70%)', bottom: '-5%', left: '-8%', animation: 'orbFloat2 30s ease-in-out infinite 3s', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <span style={{ position: 'absolute', top: '2%', left: '1%', fontSize: '24px', animation: 'menuItemFloat 6s ease-in-out infinite', opacity: 0.1, pointerEvents: 'none' }}>📋</span>
        <span style={{ position: 'absolute', bottom: '10%', right: '2%', fontSize: '22px', animation: 'menuItemFloat 8s ease-in-out infinite 1s', opacity: 0.08, pointerEvents: 'none' }}>💳</span>

        <button style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', padding: '10px 22px', borderRadius: '12px', cursor: 'pointer', marginBottom: '24px', fontWeight: 500, color: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', transition: 'all 0.3s ease', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          onClick={() => setCurrentPage('cart')}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateX(-4px)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.transform = 'translateX(0)'; }}
        >← Back to Cart</button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
          <span style={{ fontSize: '28px', animation: 'cartFloat 3s ease-in-out infinite' }}>📋</span>
          <h1 style={{ margin: '0', fontSize: '28px', fontWeight: 800, background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.7))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Checkout</h1>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', margin: '0 0 28px' }}>Fill in your details to complete the order</p>

        {/* Flow Steps Indicator */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', justifyContent: 'center', animation: 'fadeSlideUp 0.4s ease-out' }}>
          {[
            { num: '1', label: 'Details', icon: '📍' },
            { num: '2', label: 'Payment', icon: '💳' },
            { num: '3', label: 'Confirm', icon: '✅' },
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 16px', borderRadius: '12px',
                background: i < 2 ? 'rgba(226,55,68,0.12)' : 'rgba(255,255,255,0.04)',
                border: i < 2 ? '1px solid rgba(226,55,68,0.2)' : '1px solid rgba(255,255,255,0.06)',
              }}>
                <span style={{ fontSize: '16px' }}>{step.icon}</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: i < 2 ? '#fff' : 'rgba(255,255,255,0.3)' }}>{step.label}</span>
              </div>
              {i < 2 && <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '14px' }}>→</span>}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '28px', alignItems: 'start' }}>
          <div>
            {/* Delivery Details */}
            <div style={{ ...styles.checkoutStep, animation: 'fadeSlideUp 0.4s ease-out' }}>
              <div style={styles.checkoutStepNumber}>1</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 14px', color: '#fff', fontSize: '16px', fontWeight: 600 }}>Delivery Details</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <input style={styles.checkoutInput} placeholder="📍 Delivery Address" value={deliveryDetails.address}
                    onChange={e => setDeliveryDetails(prev => ({ ...prev, address: e.target.value }))} />
                  <input style={styles.checkoutInput} placeholder="📞 Phone Number" type="tel" value={deliveryDetails.phone}
                    onChange={e => setDeliveryDetails(prev => ({ ...prev, phone: e.target.value }))} />
                  <input style={styles.checkoutInput} placeholder="📝 Delivery Instructions (optional)" value={deliveryDetails.instructions}
                    onChange={e => setDeliveryDetails(prev => ({ ...prev, instructions: e.target.value }))} />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div style={{ ...styles.checkoutStep, animation: 'fadeSlideUp 0.4s ease-out 0.1s both' }}>
              <div style={styles.checkoutStepNumber}>2</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 14px', color: '#fff', fontSize: '16px', fontWeight: 600 }}>Payment Method</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { key: 'card' as const, icon: '💳', label: 'Credit / Debit Card', desc: 'Pay with Visa, Mastercard, or Rupay' },
                    { key: 'upi' as const, icon: '📱', label: 'UPI', desc: 'Google Pay, PhonePe, Paytm' },
                    { key: 'cod' as const, icon: '💵', label: 'Cash on Delivery', desc: 'Pay when your food arrives' },
                  ].map(opt => (
                    <div key={opt.key} style={{ ...styles.paymentOption, border: paymentMethod === opt.key ? '1px solid rgba(226,55,68,0.4)' : '1px solid rgba(255,255,255,0.06)', background: paymentMethod === opt.key ? 'rgba(226,55,68,0.08)' : 'rgba(255,255,255,0.02)' }}
                      onClick={() => setPaymentMethod(opt.key)}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.borderColor = 'rgba(226,55,68,0.3)'; }}
                      onMouseLeave={e => { if (paymentMethod !== opt.key) { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; } }}>
                      <div style={{ ...styles.paymentDot, borderColor: paymentMethod === opt.key ? '#E23744' : 'rgba(255,255,255,0.2)' }}>
                        {paymentMethod === opt.key && <div style={styles.paymentDotInner} />}
                      </div>
                      <span style={{ fontSize: '22px' }}>{opt.icon}</span>
                      <div>
                        <div style={{ color: '#fff', fontWeight: 600, fontSize: '14px' }}>{opt.label}</div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>{opt.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div style={{ position: 'sticky', top: '100px' }}>
            <div style={{ ...styles.cartBillCard, animation: 'fadeSlideUp 0.4s ease-out 0.15s both' }}>
              <h3 style={{ margin: '0 0 16px', color: '#fff', fontSize: '16px', fontWeight: 700 }}>
                <span style={{ marginRight: '8px' }}>🛒</span> Order Summary
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                {cart.slice(0, 3).map(item => (
                  <div key={item.menuItem.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>{item.quantity}x {item.menuItem.name}</span>
                    <span style={{ color: '#fff' }}>{formatPrice(item.menuItem.price * item.quantity)}</span>
                  </div>
                ))}
                {cart.length > 3 && <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>+{cart.length - 3} more items</div>}
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>Subtotal</span>
                  <span style={{ color: '#fff' }}>{formatPrice(cartTotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>Delivery</span>
                  <span style={{ color: cartTotal >= 299 ? '#22c55e' : '#fff' }}>{cartTotal >= 299 ? 'FREE' : formatPrice(deliveryFee)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>Taxes</span>
                  <span style={{ color: '#fff' }}>{formatPrice(taxes)}</span>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '12px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <span style={{ fontWeight: 700, fontSize: '18px', color: '#fff' }}>Total</span>
                  <span style={{ fontWeight: 700, fontSize: '18px', background: 'linear-gradient(135deg, #E23744, #ff6b6b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{formatPrice(total)}</span>
                </div>
                <button
                  style={{
                    ...styles.primaryButton,
                    borderRadius: '14px',
                    padding: '16px',
                    fontSize: '16px',
                    opacity: deliveryDetails.address && deliveryDetails.phone ? 1 : 0.5,
                  }}
                  className={deliveryDetails.address && deliveryDetails.phone ? 'btn-glow' : ''}
                  onClick={finalizeOrder}
                  disabled={!deliveryDetails.address || !deliveryDetails.phone}
                  onMouseEnter={e => { if (deliveryDetails.address && deliveryDetails.phone) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(226,55,68,0.5)'; } }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(226,55,68,0.3)'; }}
                >{deliveryDetails.address && deliveryDetails.phone ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    🚀 Place Order
                  </span>
                ) : '📍 Fill Details to Order'}</button>
              </div>
            </div>
          </div>
        </div>
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

    const trackingOrbs = [
      { size: '350px', color: 'rgba(34,197,94,0.06)', top: '0%', right: '-5%', anim: 'orbFloat 25s ease-in-out infinite', delay: '0s' },
      { size: '300px', color: 'rgba(226,55,68,0.05)', bottom: '10%', left: '-5%', anim: 'orbFloat2 30s ease-in-out infinite', delay: '3s' },
    ];

    return (
      <div style={{ ...styles.trackingContainer, position: 'relative', zIndex: 2 }}>
        {trackingOrbs.map((orb, i) => (
          <div key={`track-orb-${i}`} style={{
            position: 'absolute', width: orb.size, height: orb.size, borderRadius: '50%',
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            top: orb.top, right: orb.right, bottom: orb.bottom, left: orb.left,
            animation: orb.anim, animationDelay: orb.delay,
            filter: 'blur(60px)', pointerEvents: 'none',
          }} />
        ))}

        <div style={{ animation: 'fadeSlideUp 0.5s ease-out' }}>
          <h1 style={{ margin: '0 0 24px', fontSize: '28px', fontWeight: 800, background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.7))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            🏍️ Track Your Order
          </h1>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
          borderRadius: '16px',
          padding: '20px 24px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.06)',
          animation: 'cardFadeIn 0.5s ease-out',
        }}>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Order ID</div>
            <div style={{ fontWeight: 700, color: '#fff', fontSize: '18px' }}>{currentOrder.id}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>ETA</div>
            <div style={{ fontWeight: 700, color: '#ff6b6b', fontSize: '18px' }}>{currentOrder.estimatedTime} mins</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total</div>
            <div style={{ fontWeight: 700, color: '#fff', fontSize: '18px' }}>{formatPrice(currentOrder.total)}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
          borderRadius: '20px',
          padding: '28px 24px',
          marginBottom: '20px',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.06)',
          position: 'relative',
          animation: 'cardFadeIn 0.5s ease-out 0.1s both',
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <div style={{ position: 'absolute', top: '47px', left: 'calc(12.5% + 22px)', right: 'calc(12.5% + 22px)', height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px' }} />
          <div style={{
            position: 'absolute',
            top: '47px',
            left: 'calc(12.5% + 22px)',
            height: '4px',
            background: 'linear-gradient(90deg, #22c55e, #16a34a)',
            borderRadius: '2px',
            width: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%`,
            maxWidth: 'calc(75% - 44px)',
            transition: 'width 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            boxShadow: '0 0 12px rgba(34,197,94,0.3)',
          }} />
          {statusSteps.map((step, index) => (
            <div key={step.key} style={{ textAlign: 'center', zIndex: 1, flex: 1 }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: index <= currentStatusIndex
                  ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                  : 'rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 10px',
                fontSize: '22px',
                boxShadow: index <= currentStatusIndex ? '0 4px 16px rgba(34,197,94,0.4), 0 0 0 4px rgba(34,197,94,0.08)' : 'none',
                transition: 'all 0.5s ease',
                border: index <= currentStatusIndex ? 'none' : '1px solid rgba(255,255,255,0.08)',
              }}>
                {step.icon}
              </div>
              <div style={{
                fontSize: '13px',
                fontWeight: index <= currentStatusIndex ? 600 : 400,
                color: index <= currentStatusIndex ? '#22c55e' : 'rgba(255,255,255,0.3)',
                transition: 'color 0.3s ease',
              }}>
                {step.label}
              </div>
            </div>
          ))}
        </div>

        {/* Map */}
        <div style={{
          ...styles.mapContainer,
          animation: 'cardFadeIn 0.5s ease-out 0.2s both',
        }}>
          <div id="tracking-map" style={{ width: '100%', height: '100%' }} />
        </div>

        {/* Driver Details Card */}
        <div style={{
          ...styles.driverCard,
          animation: 'cardFadeIn 0.5s ease-out 0.3s both',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}>
          <img src={currentOrder.driver.image} alt={currentOrder.driver.name} style={styles.driverImage} />
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: '0 0 4px', color: '#fff', fontSize: '18px' }}>{currentOrder.driver.name}</h3>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '6px' }}>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
                ⭐ {currentOrder.driver.rating}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
                🚴 {currentOrder.driver.trips} trips
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
              🏍️ {currentOrder.driver.vehicle}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button style={{
              padding: '10px 18px',
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 10px rgba(34,197,94,0.3)',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(34,197,94,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(34,197,94,0.3)'; }}
            >
              📞 Call
            </button>
            <button style={{
              padding: '10px 18px',
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 10px rgba(59,130,246,0.3)',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(59,130,246,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(59,130,246,0.3)'; }}
            >
              💬 Chat
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
          borderRadius: '20px',
          padding: '22px',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          animation: 'cardFadeIn 0.5s ease-out 0.4s both',
        }}>
          <h3 style={{ margin: '0 0 16px', color: '#fff', fontSize: '16px', fontWeight: 700 }}>
            <span style={{ marginRight: '8px' }}>🛒</span> Order Summary
          </h3>
          {currentOrder.items.map((item, idx) => (
            <div key={item.menuItem.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px 0',
              borderBottom: idx < currentOrder.items.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
                <span style={{ color: '#fff', fontWeight: 600 }}>{item.quantity}x</span> {item.menuItem.name}
              </span>
              <span style={{ fontWeight: 600, color: '#fff', fontSize: '14px' }}>{formatPrice(item.menuItem.price * item.quantity)}</span>
            </div>
          ))}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            fontWeight: 700,
            fontSize: '18px',
          }}>
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>Total</span>
            <span style={{ background: 'linear-gradient(135deg, #E23744, #ff6b6b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{formatPrice(currentOrder.total)}</span>
          </div>
        </div>

        {currentOrder.status === 'delivered' && (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            background: 'linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(34,197,94,0.02) 100%)',
            borderRadius: '20px',
            marginTop: '20px',
            border: '1px solid rgba(34,197,94,0.1)',
            backdropFilter: 'blur(12px)',
            animation: 'cardFadeIn 0.5s ease-out',
          }}>
            <div style={{ fontSize: '72px', marginBottom: '16px', animation: 'badgeBounce 0.6s ease-in-out' }}>🎉</div>
            <h2 style={{ color: '#22c55e', margin: '0 0 8px', fontSize: '26px', fontWeight: 800 }}>Order Delivered!</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', margin: '0 0 28px', fontSize: '15px' }}>Enjoy your meal! Rate your experience.</p>
            <button
              style={{
                ...styles.primaryButton,
                maxWidth: '220px',
                margin: '0 auto',
                borderRadius: '14px',
                padding: '14px 32px',
              }}
              onClick={() => {
                setCurrentOrder(null);
                setCurrentPage('home');
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(226,55,68,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(226,55,68,0.3)'; }}
            >
              Order Again
            </button>
          </div>
        )}
      </div>
    );
  };

  // Hyperpure Page - Restaurant supplies marketplace
  const HyperpurePage = () => {
    const [hpSearch, setHpSearch] = useState('');
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
    const [selectedHpCategory, setSelectedHpCategory] = useState<string>('All');
    const [hpCart, setHpCart] = useState<{ id: string; name: string; price: number; qty: number }[]>([]);
    const [showHpCart, setShowHpCart] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<typeof hpProducts[0] | null>(null);
    const [hpDelivery, setHpDelivery] = useState({ address: '', phone: '', mode: 'Wholesale' as 'Wholesale' | 'Express' });
    const [hpOrderPlaced, setHpOrderPlaced] = useState(false);
    const [showHpDelivery, setShowHpDelivery] = useState(false);
    const [hpShowPayment, setHpShowPayment] = useState(false);
    const [hpPaymentMethod, setHpPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card');

    const addToHpCart = (id: string, name: string, price: number) => {
      setHpCart(prev => {
        const existing = prev.find(i => i.id === id);
        if (existing) return prev.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i);
        return [...prev, { id, name, price, qty: 1 }];
      });
    };

    const removeFromHpCart = (id: string) => {
      setHpCart(prev => {
        const existing = prev.find(i => i.id === id);
        if (existing && existing.qty > 1) return prev.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i);
        return prev.filter(i => i.id !== id);
      });
    };

    const clearHpCart = () => setHpCart([]);

    const hpCartTotal = hpCart.reduce((sum, i) => sum + i.price * i.qty, 0);
    const hpCartCount = hpCart.reduce((sum, i) => sum + i.qty, 0);

    const hpDeliveryFee = hpDelivery.mode === 'Express' ? 49 : 0;
    const hpOrderTotal = hpCartTotal + hpDeliveryFee;

    const placeHpOrder = () => {
      if (!hpDelivery.address || !hpDelivery.phone || hpCart.length === 0) return;
      setHpOrderPlaced(true);
      setShowHpDelivery(false);
      setShowHpCart(false);
      setHpShowPayment(false);
      setTimeout(() => {
        setHpOrderPlaced(false);
        setHpCart([]);
        setHpDelivery({ address: '', phone: '', mode: 'Wholesale' });
      }, 3000);
    };

    const hpStats = [
      { value: '130+', label: 'cities we\'re active in', icon: '🏙️' },
      { value: '1 Lakh+', label: 'partners trust us', icon: '🤝' },
      { value: '1.1 Crore+', label: 'orders delivered', icon: '📦' },
      { value: '1000+', label: 'seller brands listed', icon: '🏷️' },
    ];

    const hpCategories = [
      { name: 'Fruits & Vegetables', icon: '🥬', img: 'https://images.unsplash.com/photo-1597362925123-77861d2fbac7?w=64&h=64&fit=crop' },
      { name: 'Dairy', icon: '🧀', img: 'https://images.unsplash.com/photo-1624806992066-5ffcf7ca186b?w=64&h=64&fit=crop' },
      { name: 'Chicken & Eggs', icon: '🍗', img: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=64&h=64&fit=crop' },
      { name: 'Sauces', icon: '🥫', img: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=64&h=64&fit=crop' },
      { name: 'Canned Items', icon: '🥫', img: 'https://images.unsplash.com/photo-1580597153911-e284dc2b3f43?w=64&h=64&fit=crop' },
      { name: 'Packaging', icon: '📦', img: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=64&h=64&fit=crop' },
      { name: 'Custom Packaging', icon: '🎨', img: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa4?w=64&h=64&fit=crop' },
      { name: 'Edible Oils', icon: '🫒', img: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=64&h=64&fit=crop' },
      { name: 'Frozen Food', icon: '❄️', img: 'https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=64&h=64&fit=crop' },
      { name: 'Bakery', icon: '🥐', img: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=64&h=64&fit=crop' },
      { name: 'Cleaning', icon: '🧹', img: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=64&h=64&fit=crop' },
      { name: 'Beverages', icon: '🥤', img: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=64&h=64&fit=crop' },
      { name: 'Flours', icon: '🌾', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=64&h=64&fit=crop' },
      { name: 'Pulses', icon: '🫘', img: 'https://images.unsplash.com/photo-1515543904379-3d0ffe0d5a7e?w=64&h=64&fit=crop' },
      { name: 'Dry Fruits', icon: '🥜', img: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=64&h=64&fit=crop' },
      { name: 'Rice', icon: '🍚', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=64&h=64&fit=crop' },
      { name: 'Mutton & Lamb', icon: '🥩', img: 'https://images.unsplash.com/photo-1603048297171-925c0d9b958e?w=64&h=64&fit=crop' },
      { name: 'Seafood', icon: '🐟', img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=64&h=64&fit=crop' },
      { name: 'Kitchenware', icon: '🍳', img: 'https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=64&h=64&fit=crop' },
      { name: 'Appliances', icon: '⚡', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=64&h=64&fit=crop' },
    ];

    const hpProducts = [
      { id: 'hp1', name: 'Walnut Brownie (80 gm/pc), 720 gm', price: 262.5, unit: '9 pc', veg: true, category: 'Bakery', img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&h=200&fit=crop' },
      { id: 'hp2', name: 'Potato Cheese Balls, 1 Kg', price: 241.5, unit: '1 pack', veg: true, category: 'Frozen Food', img: 'https://images.unsplash.com/photo-1559847844-6a2a21e3f1e1?w=300&h=200&fit=crop' },
      { id: 'hp3', name: 'Brioche Burger Buns (Pack of 4)', price: 79, unit: '4 pc', veg: true, category: 'Bakery', img: 'https://images.unsplash.com/photo-1549931319-a54575346796?w=300&h=200&fit=crop' },
      { id: 'hp4', name: 'Crunchy Chicken Popcorn, 1 Kg', price: 409.5, unit: '1 pack', veg: false, category: 'Chicken & Eggs', img: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=300&h=200&fit=crop' },
      { id: 'hp5', name: 'Butter Croissant, Handrolled', price: 210, unit: '3 pc', veg: true, category: 'Bakery', img: 'https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=300&h=200&fit=crop' },
      { id: 'hp6', name: 'Chicken Seekh Kebab, 1 Kg', price: 294, unit: '1 pack', veg: false, category: 'Chicken & Eggs', img: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=300&h=200&fit=crop' },
      { id: 'hp7', name: 'Coriander & Mint Chutney, 1 Kg', price: 168, unit: '1 pack', veg: true, category: 'Sauces', img: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=300&h=200&fit=crop' },
      { id: 'hp8', name: 'Premium Molten Choco Lava (12 pc)', price: 451.5, unit: '12 pc', veg: true, category: 'Bakery', img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&h=200&fit=crop' },
      { id: 'hp9', name: 'Fresh Carrots (Big), 1 Kg', price: 43, unit: '1 kg', veg: true, category: 'Fruits & Vegetables', img: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=300&h=200&fit=crop' },
      { id: 'hp10', name: 'Amul Butter Salted, 500 gm', price: 282.45, unit: '1 pack', veg: true, category: 'Dairy', img: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=300&h=200&fit=crop' },
      { id: 'hp11', name: 'Basmati Rice, 5 Kg', price: 525, unit: '5 kg', veg: true, category: 'Rice', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop' },
      { id: 'hp12', name: 'Toor Dal (Arhar), 1 Kg', price: 145, unit: '1 kg', veg: true, category: 'Pulses', img: 'https://images.unsplash.com/photo-1515543904379-3d0ffe0d5a7e?w=300&h=200&fit=crop' },
      { id: 'hp13', name: 'Fresh Tomatoes (Red), 1 Kg', price: 38, unit: '1 kg', veg: true, category: 'Fruits & Vegetables', img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&h=200&fit=crop' },
      { id: 'hp14', name: 'Fresh Onions (Big), 1 Kg', price: 32, unit: '1 kg', veg: true, category: 'Fruits & Vegetables', img: 'https://images.unsplash.com/photo-1508747703725-4f849b0af0f0?w=300&h=200&fit=crop' },
      { id: 'hp15', name: 'Fresh Potatoes (Big), 1 Kg', price: 28, unit: '1 kg', veg: true, category: 'Fruits & Vegetables', img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300&h=200&fit=crop' },
      { id: 'hp16', name: 'Fresh Whole Milk, 1 Ltr', price: 56, unit: '1 Ltr', veg: true, category: 'Dairy', img: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=200&fit=crop' },
      { id: 'hp17', name: 'Mozzarella Cheese Block, 1 Kg', price: 420, unit: '1 kg', veg: true, category: 'Dairy', img: 'https://images.unsplash.com/photo-1634487359989-3e90c9432133?w=300&h=200&fit=crop' },
      { id: 'hp18', name: 'Fresh Paneer, 1 Kg', price: 340, unit: '1 kg', veg: true, category: 'Dairy', img: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=300&h=200&fit=crop' },
      { id: 'hp19', name: 'Farm Fresh Eggs (Tray of 30)', price: 195, unit: '30 pc', veg: false, category: 'Chicken & Eggs', img: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300&h=200&fit=crop' },
      { id: 'hp20', name: 'Boneless Chicken Breast, 1 Kg', price: 350, unit: '1 kg', veg: false, category: 'Chicken & Eggs', img: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300&h=200&fit=crop' },
      { id: 'hp21', name: 'Tomato Ketchup, 1 Kg Pouch', price: 115, unit: '1 kg', veg: true, category: 'Sauces', img: 'https://images.unsplash.com/photo-1608392604478-5bb58e0c5e1b?w=300&h=200&fit=crop' },
      { id: 'hp22', name: 'Mayonnaise (Veg), 1 Kg', price: 210, unit: '1 kg', veg: true, category: 'Sauces', img: 'https://images.unsplash.com/photo-1623131670774-ff06c0b7d922?w=300&h=200&fit=crop' },
      { id: 'hp23', name: 'Soy Sauce, 1 Ltr', price: 95, unit: '1 Ltr', veg: true, category: 'Sauces', img: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=300&h=200&fit=crop' },
      { id: 'hp24', name: 'Canned Peeled Tomatoes, 2.5 Kg', price: 245, unit: '1 can', veg: true, category: 'Canned Items', img: 'https://images.unsplash.com/photo-1580597153911-e284dc2b3f43?w=300&h=200&fit=crop' },
      { id: 'hp25', name: 'Canned Sweet Corn, 850 gm', price: 135, unit: '1 can', veg: true, category: 'Canned Items', img: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=300&h=200&fit=crop' },
      { id: 'hp26', name: 'Canned Kidney Beans, 400 gm', price: 85, unit: '1 can', veg: true, category: 'Canned Items', img: 'https://images.unsplash.com/photo-1515543904379-3d0ffe0d5a7e?w=300&h=200&fit=crop' },
      { id: 'hp27', name: 'Disposable Food Container (100 pc)', price: 299, unit: '100 pc', veg: true, category: 'Packaging', img: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=300&h=200&fit=crop' },
      { id: 'hp28', name: 'Eco-Friendly Carry Bags (200 pc)', price: 349, unit: '200 pc', veg: true, category: 'Packaging', img: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=300&h=200&fit=crop' },
      { id: 'hp29', name: 'Cling Wrap (300 mtr)', price: 225, unit: '1 roll', veg: true, category: 'Packaging', img: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=300&h=200&fit=crop' },
      { id: 'hp30', name: 'Custom Printed Food Boxes (50 pc)', price: 599, unit: '50 pc', veg: true, category: 'Custom Packaging', img: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa4?w=300&h=200&fit=crop' },
      { id: 'hp31', name: 'Brown Kraft Boxes (100 pc)', price: 449, unit: '100 pc', veg: true, category: 'Custom Packaging', img: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=300&h=200&fit=crop' },
      { id: 'hp32', name: 'Sticker Labels (500 pc)', price: 199, unit: '500 pc', veg: true, category: 'Custom Packaging', img: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=300&h=200&fit=crop' },
      { id: 'hp33', name: 'Refined Sunflower Oil, 15 Ltr', price: 1545, unit: '15 Ltr', veg: true, category: 'Edible Oils', img: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=200&fit=crop' },
      { id: 'hp34', name: 'Extra Virgin Olive Oil, 1 Ltr', price: 650, unit: '1 Ltr', veg: true, category: 'Edible Oils', img: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=200&fit=crop' },
      { id: 'hp35', name: 'Mustard Oil, 5 Ltr', price: 595, unit: '5 Ltr', veg: true, category: 'Edible Oils', img: 'https://images.unsplash.com/photo-1519368358672-25b03afee3bf?w=300&h=200&fit=crop' },
      { id: 'hp36', name: 'Frozen French Fries, 2 Kg', price: 345, unit: '2 kg', veg: true, category: 'Frozen Food', img: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop' },
      { id: 'hp37', name: 'Frozen Mixed Vegetables, 1 Kg', price: 120, unit: '1 kg', veg: true, category: 'Frozen Food', img: 'https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=300&h=200&fit=crop' },
      { id: 'hp38', name: 'Frozen Paratha (Aloo, 30 pc)', price: 310, unit: '30 pc', veg: true, category: 'Frozen Food', img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=200&fit=crop' },
      { id: 'hp39', name: 'White Bread Loaf, 600 gm', price: 45, unit: '1 loaf', veg: true, category: 'Bakery', img: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=300&h=200&fit=crop' },
      { id: 'hp40', name: 'Pizza Base (10 inch, Pack of 10)', price: 285, unit: '10 pc', veg: true, category: 'Bakery', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=200&fit=crop' },
      { id: 'hp41', name: 'Garlic Bread Stick (Pack of 12)', price: 195, unit: '12 pc', veg: true, category: 'Bakery', img: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12584?w=300&h=200&fit=crop' },
      { id: 'hp42', name: 'Commercial Dish Soap, 5 Ltr', price: 375, unit: '5 Ltr', veg: true, category: 'Cleaning', img: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=300&h=200&fit=crop' },
      { id: 'hp43', name: 'Floor Cleaner Concentrate, 5 Ltr', price: 290, unit: '5 Ltr', veg: true, category: 'Cleaning', img: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=300&h=200&fit=crop' },
      { id: 'hp44', name: 'Professional Hand Wash, 5 Ltr', price: 345, unit: '5 Ltr', veg: true, category: 'Cleaning', img: 'https://images.unsplash.com/photo-1559827291-f3a896284a8a?w=300&h=200&fit=crop' },
      { id: 'hp45', name: 'Coca-Cola Can (24 x 330 ml)', price: 720, unit: '24 pc', veg: true, category: 'Beverages', img: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=300&h=200&fit=crop' },
      { id: 'hp46', name: 'Packaged Drinking Water (24 x 1 Ltr)', price: 360, unit: '24 pc', veg: true, category: 'Beverages', img: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&h=200&fit=crop' },
      { id: 'hp47', name: 'Orange Juice Concentrate, 5 Ltr', price: 525, unit: '5 Ltr', veg: true, category: 'Beverages', img: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=300&h=200&fit=crop' },
      { id: 'hp48', name: 'Whole Wheat Flour (Atta), 10 Kg', price: 320, unit: '10 kg', veg: true, category: 'Flours', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=200&fit=crop' },
      { id: 'hp49', name: 'Besan (Gram Flour), 5 Kg', price: 285, unit: '5 kg', veg: true, category: 'Flours', img: 'https://images.unsplash.com/photo-1515543904379-3d0ffe0d5a7e?w=300&h=200&fit=crop' },
      { id: 'hp50', name: 'Maida (All Purpose Flour), 10 Kg', price: 335, unit: '10 kg', veg: true, category: 'Flours', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=200&fit=crop' },
      { id: 'hp51', name: 'Moong Dal (Split), 1 Kg', price: 155, unit: '1 kg', veg: true, category: 'Pulses', img: 'https://images.unsplash.com/photo-1515543904379-3d0ffe0d5a7e?w=300&h=200&fit=crop' },
      { id: 'hp52', name: 'Chana Dal (Split), 1 Kg', price: 105, unit: '1 kg', veg: true, category: 'Pulses', img: 'https://images.unsplash.com/photo-1515543904379-3d0ffe0d5a7e?w=300&h=200&fit=crop' },
      { id: 'hp53', name: 'Urad Dal (Whole), 1 Kg', price: 195, unit: '1 kg', veg: true, category: 'Pulses', img: 'https://images.unsplash.com/photo-1515543904379-3d0ffe0d5a7e?w=300&h=200&fit=crop' },
      { id: 'hp54', name: 'Almonds (Badam), 1 Kg', price: 850, unit: '1 kg', veg: true, category: 'Dry Fruits', img: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=300&h=200&fit=crop' },
      { id: 'hp55', name: 'Cashew Nuts (Whole), 1 Kg', price: 950, unit: '1 kg', veg: true, category: 'Dry Fruits', img: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=300&h=200&fit=crop' },
      { id: 'hp56', name: 'Raisins (Kishmish), 1 Kg', price: 295, unit: '1 kg', veg: true, category: 'Dry Fruits', img: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=200&fit=crop' },
      { id: 'hp57', name: 'Sona Masoori Rice, 10 Kg', price: 480, unit: '10 kg', veg: true, category: 'Rice', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop' },
      { id: 'hp58', name: 'Brown Rice, 5 Kg', price: 350, unit: '5 kg', veg: true, category: 'Rice', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop' },
      { id: 'hp59', name: 'Poha (Flattened Rice), 5 Kg', price: 215, unit: '5 kg', veg: true, category: 'Rice', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop' },
      { id: 'hp60', name: 'Mutton Curry Cut, 1 Kg', price: 620, unit: '1 kg', veg: false, category: 'Mutton & Lamb', img: 'https://images.unsplash.com/photo-1603048297171-925c0d9b958e?w=300&h=200&fit=crop' },
      { id: 'hp61', name: 'Lamb Chops (Rack), 1 Kg', price: 780, unit: '1 kg', veg: false, category: 'Mutton & Lamb', img: 'https://images.unsplash.com/photo-1603048297171-925c0d9b958e?w=300&h=200&fit=crop' },
      { id: 'hp62', name: 'Mutton Mince (Keema), 1 Kg', price: 580, unit: '1 kg', veg: false, category: 'Mutton & Lamb', img: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=300&h=200&fit=crop' },
      { id: 'hp63', name: 'Fresh Salmon Fillet, 500 gm', price: 650, unit: '500 gm', veg: false, category: 'Seafood', img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=300&h=200&fit=crop' },
      { id: 'hp64', name: 'Large Prawns (Cleaned), 1 Kg', price: 520, unit: '1 kg', veg: false, category: 'Seafood', img: 'https://images.unsplash.com/photo-1565680018434-513a5aa48134?w=300&h=200&fit=crop' },
      { id: 'hp65', name: 'Pomfret Fish (Whole), 1 Kg', price: 450, unit: '1 kg', veg: false, category: 'Seafood', img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=300&h=200&fit=crop' },
      { id: 'hp66', name: 'Chef Knife (8 inch)', price: 450, unit: '1 pc', veg: true, category: 'Kitchenware', img: 'https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=300&h=200&fit=crop' },
      { id: 'hp67', name: 'Cutting Board (Plastic, Large)', price: 180, unit: '1 pc', veg: true, category: 'Kitchenware', img: 'https://images.unsplash.com/photo-1594226801341-41427b4c6b27?w=300&h=200&fit=crop' },
      { id: 'hp68', name: 'Stainless Steel Mixing Bowls (Set of 5)', price: 650, unit: '5 pc', veg: true, category: 'Kitchenware', img: 'https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=300&h=200&fit=crop' },
      { id: 'hp69', name: 'Commercial Mixer Grinder, 3 Jars', price: 4500, unit: '1 pc', veg: true, category: 'Appliances', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300&h=200&fit=crop' },
      { id: 'hp70', name: 'OTG Oven, 60 Ltr', price: 8500, unit: '1 pc', veg: true, category: 'Appliances', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300&h=200&fit=crop' },
      { id: 'hp71', name: 'Induction Cooktop, 2000W', price: 3200, unit: '1 pc', veg: true, category: 'Appliances', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300&h=200&fit=crop' },
    ];

    const filteredHpProducts = hpProducts.filter(p => {
      const matchesCategory = selectedHpCategory === 'All' || p.category === selectedHpCategory;
      const matchesSearch = !hpSearch || p.name.toLowerCase().includes(hpSearch.toLowerCase()) || p.category.toLowerCase().includes(hpSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    const hpTestimonials = [
      { name: 'Blue Tokai Coffee Roasters', role: 'Co-Founder', quote: 'Consistent supply of high-quality ingredients, reducing wastage and stockouts. Hyperpure ensures smooth operations, improving planning and maintaining stable pricing.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', logo: 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=64&h=64&fit=crop' },
      { name: 'Meghana Foods', role: 'Founder', quote: 'Their top-quality products and timely deliveries have greatly enhanced our culinary offerings. Their professional and responsive team has made collaboration seamless.', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', logo: 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=64&h=64&fit=crop' },
      { name: 'Marrakesh', role: 'Founder', quote: 'They stand out by focusing on the smallest details and aligning with our brand\'s needs. Their customised food solutions exceeded our expectations.', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', logo: 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=64&h=64&fit=crop' },
      { name: 'Charcoal Eats', role: 'Founder', quote: 'Their tech-enabled platform simplifies the entire process, tracking expenses, managing inventory, and boosting efficiency.', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face', logo: 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=64&h=64&fit=crop' },
      { name: 'The Pizza Bakery', role: 'Founder', quote: 'Their service has never let us down—with on-time deliveries every time. Many key ingredients are sourced through Hyperpure at economical rates.', img: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=100&h=100&fit=crop&crop=face', logo: 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=64&h=64&fit=crop' },
      { name: 'Mad Momos', role: 'Founder & CEO', quote: 'Achieved a 15% reduction in purchasing costs. Their transparent pricing structure and discounts have helped us tremendously.', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', logo: 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=64&h=64&fit=crop' },
    ];

    const hpFaqs = [
      { q: 'What is Hyperpure by Zomato?', a: 'Hyperpure by Zomato is a one-stop B2B marketplace for restaurants, cafes, and food businesses. We supply high-quality ingredients, kitchen essentials, packaging materials, and more at wholesale prices.' },
      { q: 'What makes Hyperpure different from other suppliers?', a: 'We offer consistent quality with rigorous quality checks, transparent pricing, timely deliveries, a wide catalog of 1000+ brands, and a tech-enabled platform for easy ordering and inventory management.' },
      { q: 'How can Hyperpure help me expand my menu?', a: 'Our Menu Innovations team helps you create custom food solutions tailored to your brand. From recipe development to sourcing specialty ingredients, we support your menu expansion.' },
      { q: 'Is Hyperpure committed to sustainability?', a: 'Yes. We focus on sustainable sourcing, minimal packaging waste, and optimizing supply chains to reduce food miles and carbon footprint.' },
      { q: 'Does Hyperpure supply to home chefs/small businesses?', a: 'Absolutely. We cater to businesses of all sizes — from home chefs and cloud kitchens to large restaurant chains.' },
      { q: 'How does Hyperpure procure its supplies?', a: 'We work directly with farmers, manufacturers, and trusted brands to ensure farm-to-fork freshness and the highest quality standards.' },
    ];

    return (
      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Hero Section */}
        <div style={{
          background: 'linear-gradient(135deg, #0a0a0f 0%, #1a0a0a 50%, #0a0f0a 100%)',
          padding: '60px 24px 48px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid rgba(226,55,68,0.15)',
        }}>
          <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(226,55,68,0.08) 0%, transparent 70%)', borderRadius: '50%', animation: 'orbFloat 25s ease-in-out infinite', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)', borderRadius: '50%', animation: 'orbFloat2 30s ease-in-out infinite 3s', pointerEvents: 'none' }} />
          <span style={{ position: 'absolute', top: '10%', left: '5%', fontSize: '36px', animation: 'heroFloat1 7s ease-in-out infinite', opacity: 0.1 }}>🥬</span>
          <span style={{ position: 'absolute', top: '15%', right: '8%', fontSize: '32px', animation: 'heroFloat2 9s ease-in-out infinite 1s', opacity: 0.08 }}>🧀</span>
          <span style={{ position: 'absolute', bottom: '20%', left: '3%', fontSize: '28px', animation: 'heroFloat1 8s ease-in-out infinite 2s', opacity: 0.07 }}>🍗</span>
          <span style={{ position: 'absolute', bottom: '10%', right: '5%', fontSize: '30px', animation: 'heroFloat2 10s ease-in-out infinite 0.5s', opacity: 0.09 }}>🥫</span>

          <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, background: 'linear-gradient(135deg, #E23744, #ff6b6b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Hyperpure</span>
              <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.3)', fontWeight: 300 }}>by</span>
              <span style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>Zomato</span>
            </div>
            <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#fff', margin: '0 0 8px', lineHeight: 1.2 }}>
              Wholesale Suppliers for Restaurant
            </h1>
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.5)', margin: '0 0 32px' }}>at Mandi Rate in India</p>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '500px', margin: '0 auto',
              background: 'rgba(255,255,255,0.06)', borderRadius: '16px', padding: '4px 6px 4px 16px',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <span style={{ fontSize: '18px', lineHeight: 1 }}>🔍</span>
              <input
                type="text" placeholder="Search items or categories..."
                value={hpSearch} onChange={e => setHpSearch(e.target.value)}
                style={{
                  flex: 1, padding: '14px 10px', border: 'none', outline: 'none',
                  background: 'transparent', color: '#fff', fontSize: '15px',
                }}
              />
              <button style={{
                padding: '12px 28px', background: 'linear-gradient(135deg, #E23744, #ff6b6b)',
                color: 'white', border: 'none', borderRadius: '12px', fontSize: '14px',
                fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(226,55,68,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
              >Search</button>
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px',
          maxWidth: '900px', margin: '-28px auto 0', padding: '0 24px', position: 'relative', zIndex: 3,
        }}>
          {hpStats.map((stat, i) => (
            <div key={stat.label} style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
              borderRadius: '16px', padding: '20px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(16px)', animation: `fadeSlideUp 0.5s ease-out ${0.1 + i * 0.08}s both`,
            }}>
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>{stat.icon}</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '2px' }}>{stat.value}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Categories Section */}
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <p style={styles.sectionTitle}>Our Catalog</p>
            <h2 style={styles.sectionHeading}>Categories 📋</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '14px' }}>
            {hpCategories.map((cat, i) => (
              <div
                key={cat.name}
                style={{
                  background: selectedHpCategory === cat.name ? 'rgba(226,55,68,0.12)' : 'rgba(255,255,255,0.04)',
                  borderRadius: '16px', padding: '16px 10px', textAlign: 'center',
                  cursor: 'pointer', border: selectedHpCategory === cat.name ? '1px solid rgba(226,55,68,0.3)' : '1px solid rgba(255,255,255,0.06)',
                  transition: 'all 0.3s ease', animation: `cardFadeIn 0.4s ease-out ${0.02 * i}s both`,
                }}
                onClick={() => setSelectedHpCategory(selectedHpCategory === cat.name ? 'All' : cat.name)}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(226,55,68,0.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = selectedHpCategory === cat.name ? 'rgba(226,55,68,0.3)' : 'rgba(255,255,255,0.06)'; }}
              >
                <img src={cat.img} alt={cat.name} style={{ width: '48px', height: '48px', marginBottom: '8px', objectFit: 'contain' }} />
                <div style={{ fontSize: '12px', color: '#fff', fontWeight: 600, lineHeight: 1.2 }}>{cat.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Products */}
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px 48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <p style={{ ...styles.sectionTitle, textAlign: 'left', marginBottom: '4px' }}>Featured Products</p>
              <h2 style={{ ...styles.sectionHeading, textAlign: 'left', margin: 0, fontSize: '24px' }}>Top picks for your kitchen 🥘</h2>
            </div>
            <button style={{
              padding: '10px 22px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '13px', fontWeight: 500,
              transition: 'all 0.3s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
            >See all →</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {filteredHpProducts.map((prod, i) => (
              <div key={prod.id} style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)',
                animation: `cardFadeIn 0.5s ease-out ${0.05 * i}s both`, transition: 'all 0.3s ease',
              }} className="card-glow">
                <div style={{ height: '150px', backgroundImage: `url(${prod.img})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                  <div style={{
                    position: 'absolute', top: '10px', left: '10px',
                    width: '18px', height: '18px', borderRadius: '3px',
                    background: prod.veg ? '#22c55e' : '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `2px solid ${prod.veg ? '#22c55e' : '#ef4444'}`,
                  }}>
                    <div style={{ width: prod.veg ? '8px' : '0', height: prod.veg ? '8px' : '0', borderRadius: '50%', background: prod.veg ? '#22c55e' : 'transparent', border: prod.veg ? 'none' : '2px solid #ef4444' }} />
                  </div>
                  <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', height: '50%', background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }} />
                </div>
                <div style={{ padding: '14px' }}>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '4px' }}>{prod.unit}</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '8px', lineHeight: 1.3 }}>{prod.name}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '17px', color: '#22c55e' }}>₹{prod.price}</span>
                    <button style={{
                      padding: '7px 16px', borderRadius: '9px', border: 'none',
                      background: hpCart.find(i => i.id === prod.id) ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #E23744, #ff6b6b)',
                      color: 'white', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                      transition: 'all 0.2s ease', boxShadow: '0 2px 8px rgba(226,55,68,0.25)',
                    }}
                      onClick={() => addToHpCart(prod.id, prod.name, prod.price)}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                    >{hpCart.find(i => i.id === prod.id) ? `✓ ${hpCart.find(i => i.id === prod.id)!.qty}` : 'ADD +'}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Models */}
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px 48px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <p style={styles.sectionTitle}>Delivery Models</p>
            <h2 style={styles.sectionHeading}>We deliver your way 🚚</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', margin: '-20px 0 0' }}>Flexible delivery options tailored to your needs</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {[
              { title: 'Wholesale Delivery', desc: 'Next-day restocking for your regular supplies. Order in bulk and save more with our wholesale pricing.', icon: '🚛', color: '#E23744', img: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=400&h=250&fit=crop' },
              { title: 'Express Delivery', desc: 'Need it urgently? Same-day delivery for specialty products and emergency restocking.', icon: '🏍️', color: '#22c55e', img: 'https://images.unsplash.com/photo-1529068755536-a5ade0dcb4e2?w=400&h=250&fit=crop' },
            ].map((model, i) => (
              <div key={model.title} style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)',
                animation: `cardFadeIn 0.5s ease-out ${0.1 + i * 0.15}s both`,
              }}>
                <div style={{ height: '200px', backgroundImage: `url(${model.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '28px' }}>{model.icon}</span>
                    <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#fff' }}>{model.title}</h3>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>{model.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
          padding: '48px 24px', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <p style={styles.sectionTitle}>Testimonials</p>
              <h2 style={styles.sectionHeading}>What our partners say 💬</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {hpTestimonials.slice(0, 4).map((t, i) => (
                <div key={t.name} style={{
                  background: 'rgba(255,255,255,0.04)', borderRadius: '20px', padding: '24px',
                  border: '1px solid rgba(255,255,255,0.06)', animation: `cardFadeIn 0.5s ease-out ${0.1 + i * 0.1}s both`,
                  transition: 'all 0.3s ease',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(226,55,68,0.15)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                    <img src={t.img} alt={t.name} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(226,55,68,0.3)' }} />
                    <div>
                      <div style={{ color: '#fff', fontWeight: 600, fontSize: '14px' }}>{t.name}</div>
                      <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px' }}>{t.role}</div>
                    </div>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>"{t.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <p style={styles.sectionTitle}>Help Center</p>
            <h2 style={styles.sectionHeading}>Frequently Asked Questions ❓</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {hpFaqs.map((faq, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.04)', borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden',
                animation: `fadeSlideUp 0.4s ease-out ${0.05 * i}s both`,
                cursor: 'pointer', transition: 'all 0.3s ease',
              }}
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(226,55,68,0.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
                  <span style={{ color: '#fff', fontWeight: 600, fontSize: '14px' }}>{faq.q}</span>
                  <span style={{
                    color: 'rgba(255,255,255,0.3)', fontSize: '18px', transition: 'transform 0.3s ease',
                    transform: expandedFaq === i ? 'rotate(180deg)' : 'rotate(0)',
                    display: 'inline-block',
                  }}>▼</span>
                </div>
                {expandedFaq === i && (
                  <div style={{
                    padding: '0 20px 16px', color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: 1.6,
                    animation: 'fadeSlideUp 0.3s ease-out',
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Floating Cart Button */}
        {hpCartCount > 0 && (
          <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
            <button
              onClick={() => setShowHpCart(true)}
              style={{
                background: 'linear-gradient(135deg, #E23744, #ff6b6b)',
                border: 'none', borderRadius: '50%', width: '58px', height: '58px',
                cursor: 'pointer', boxShadow: '0 4px 24px rgba(226,55,68,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = '0 6px 32px rgba(226,55,68,0.55)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(226,55,68,0.4)'; }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              <span style={{
                position: 'absolute', top: '-6px', right: '-6px',
                background: '#fff', color: '#E23744', borderRadius: '50%',
                width: '22px', height: '22px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '11px', fontWeight: 800,
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}>{hpCartCount}</span>
            </button>
          </div>
        )}

        {/* Cart Drawer */}
        {showHpCart && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 2000, display: 'flex',
            animation: 'fadeIn 0.2s ease-out',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setShowHpCart(false)} />
            <div style={{
              position: 'absolute', right: 0, top: 0, bottom: 0, width: '400px', maxWidth: '90vw',
              background: 'linear-gradient(180deg, #12121a 0%, #0a0a10 100%)',
              borderLeft: '1px solid rgba(255,255,255,0.08)',
              padding: '24px', display: 'flex', flexDirection: 'column',
              animation: 'slideInRight 0.3s ease-out',
              boxShadow: '-8px 0 40px rgba(0,0,0,0.5)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ color: '#fff', margin: 0, fontSize: '20px', fontWeight: 700 }}>Cart ({hpCartCount})</h3>
                <button onClick={() => setShowHpCart(false)} style={{
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
                  fontSize: '18px', padding: '6px 12px', lineHeight: 1, transition: 'all 0.3s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                >✕</button>
              </div>

              {hpCart.length === 0 ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', gap: '12px' }}>
                  <span style={{ fontSize: '48px' }}>🛒</span>
                  <p style={{ margin: 0, fontSize: '16px', fontWeight: 500 }}>Your cart is empty</p>
                  <p style={{ margin: 0, fontSize: '13px' }}>Browse products and add items to your cart</p>
                </div>
              ) : (
                <>
                  <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                    {hpCart.map(item => (
                      <div key={item.id} style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        background: 'rgba(255,255,255,0.04)', borderRadius: '14px',
                        padding: '12px', border: '1px solid rgba(255,255,255,0.06)',
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>{item.name}</div>
                          <div style={{ fontSize: '15px', fontWeight: 700, color: '#22c55e' }}>₹{item.price}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button onClick={() => removeFromHpCart(item.id)} style={{
                            width: '30px', height: '30px', borderRadius: '8px',
                            background: 'rgba(226,55,68,0.15)', border: '1px solid rgba(226,55,68,0.2)',
                            color: '#E23744', cursor: 'pointer', fontSize: '16px', fontWeight: 700,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.2s',
                          }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(226,55,68,0.25)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(226,55,68,0.15)'; }}
                          >−</button>
                          <span style={{ color: '#fff', fontWeight: 600, fontSize: '15px', minWidth: '20px', textAlign: 'center' }}>{item.qty}</span>
                          <button onClick={() => addToHpCart(item.id, item.name, item.price)} style={{
                            width: '30px', height: '30px', borderRadius: '8px',
                            background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.2)',
                            color: '#22c55e', cursor: 'pointer', fontSize: '16px', fontWeight: 700,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.2s',
                          }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(34,197,94,0.25)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(34,197,94,0.15)'; }}
                          >+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px',
                    display: 'flex', flexDirection: 'column', gap: '10px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Subtotal</span>
                      <span style={{ color: '#fff', fontWeight: 700, fontSize: '16px' }}>₹{hpCartTotal}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Delivery</span>
                      <span style={{ color: hpDeliveryFee === 0 ? '#22c55e' : 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: '14px' }}>
                        {hpDeliveryFee === 0 ? 'FREE' : `₹${hpDeliveryFee}`}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <span style={{ color: '#fff', fontWeight: 700, fontSize: '16px' }}>Total</span>
                      <span style={{ color: '#22c55e', fontWeight: 800, fontSize: '20px' }}>₹{hpOrderTotal}</span>
                    </div>
                    <button onClick={() => { setShowHpDelivery(true); }} style={{
                      width: '100%', padding: '14px', marginTop: '8px',
                      background: 'linear-gradient(135deg, #E23744, #ff6b6b)',
                      border: 'none', borderRadius: '14px', color: 'white',
                      fontSize: '15px', fontWeight: 700, cursor: 'pointer',
                      transition: 'all 0.3s ease', boxShadow: '0 4px 20px rgba(226,55,68,0.3)',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(226,55,68,0.45)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(226,55,68,0.3)'; }}
                    >Proceed to Checkout</button>
                    <button onClick={clearHpCart} style={{
                      background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)',
                      cursor: 'pointer', fontSize: '12px', padding: '6px',
                      transition: 'color 0.3s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#E23744'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}
                    >Clear cart</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Delivery Form Overlay */}
        {showHpDelivery && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 2100, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            animation: 'fadeIn 0.2s ease-out',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }} onClick={() => setShowHpDelivery(false)} />
            <div style={{
              position: 'relative', width: '420px', maxWidth: '90vw',
              background: 'linear-gradient(180deg, #1a1a24 0%, #0e0e16 100%)',
              borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)',
              padding: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ color: '#fff', margin: 0, fontSize: '20px', fontWeight: 700 }}>Delivery Details</h3>
                <button onClick={() => setShowHpDelivery(false)} style={{
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
                  fontSize: '18px', padding: '6px 12px', lineHeight: 1,
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                >✕</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Delivery Address</label>
                  <input
                    placeholder="Enter your restaurant/business address"
                    value={hpDelivery.address}
                    onChange={e => setHpDelivery({ ...hpDelivery, address: e.target.value })}
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.08)', outline: 'none',
                      background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '14px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Phone Number</label>
                  <input
                    placeholder="Enter your phone number"
                    value={hpDelivery.phone}
                    onChange={e => setHpDelivery({ ...hpDelivery, phone: e.target.value })}
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.08)', outline: 'none',
                      background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '14px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Delivery Mode</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {(['Wholesale', 'Express'] as const).map(mode => (
                      <button key={mode} onClick={() => setHpDelivery({ ...hpDelivery, mode })}
                        style={{
                          flex: 1, padding: '10px', borderRadius: '10px', cursor: 'pointer',
                          border: hpDelivery.mode === mode ? '1px solid rgba(226,55,68,0.4)' : '1px solid rgba(255,255,255,0.06)',
                          background: hpDelivery.mode === mode ? 'rgba(226,55,68,0.12)' : 'rgba(255,255,255,0.04)',
                          color: hpDelivery.mode === mode ? '#fff' : 'rgba(255,255,255,0.5)',
                          fontWeight: hpDelivery.mode === mode ? 600 : 400,
                          fontSize: '13px', transition: 'all 0.3s',
                        }}
                      >{mode}</button>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Order Total</span>
                  <span style={{ color: '#22c55e', fontWeight: 800, fontSize: '22px' }}>₹{hpOrderTotal}</span>
                </div>
                <button onClick={() => { setHpShowPayment(true); }}
                  style={{
                    width: '100%', padding: '14px',
                    background: hpDelivery.address && hpDelivery.phone ? 'linear-gradient(135deg, #9333ea, #E23744)' : 'rgba(255,255,255,0.08)',
                    border: 'none', borderRadius: '14px', color: 'white',
                    fontSize: '15px', fontWeight: 700, cursor: hpDelivery.address && hpDelivery.phone ? 'pointer' : 'not-allowed',
                    transition: 'all 0.3s ease', opacity: hpDelivery.address && hpDelivery.phone ? 1 : 0.5,
                    boxShadow: hpDelivery.address && hpDelivery.phone ? '0 4px 20px rgba(147,51,234,0.3)' : 'none',
                  }}
                  onMouseEnter={e => { if (hpDelivery.address && hpDelivery.phone) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(147,51,234,0.45)'; } }}
                  onMouseLeave={e => { if (hpDelivery.address && hpDelivery.phone) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(147,51,234,0.3)'; } }}
                >Continue to Payment — ₹{hpOrderTotal}</button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Overlay */}
        {hpShowPayment && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 2200, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            animation: 'fadeIn 0.2s ease-out',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }} onClick={() => setHpShowPayment(false)} />
            <div style={{
              position: 'relative', width: '460px', maxWidth: '90vw',
              background: 'linear-gradient(180deg, #1a1a2e 0%, #0e0e16 100%)',
              borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)',
              padding: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
              animation: 'fadeScaleIn 0.3s ease-out',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ color: '#fff', margin: 0, fontSize: '20px', fontWeight: 700 }}>💳 Payment</h3>
                <button onClick={() => setHpShowPayment(false)} style={{
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
                  fontSize: '18px', padding: '6px 12px', lineHeight: 1,
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                >✕</button>
              </div>

              {/* Order summary */}
              <div style={{
                background: 'rgba(255,255,255,0.04)', borderRadius: '14px',
                padding: '14px 16px', marginBottom: '20px',
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>Order Summary</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>Items ({hpCartCount})</span>
                  <span style={{ color: '#fff' }}>₹{hpCartTotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>Delivery ({hpDelivery.mode})</span>
                  <span style={{ color: hpDeliveryFee === 0 ? '#22c55e' : '#fff' }}>{hpDeliveryFee === 0 ? 'FREE' : `₹${hpDeliveryFee}`}</span>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#fff', fontWeight: 700 }}>Total</span>
                  <span style={{ color: '#22c55e', fontWeight: 800, fontSize: '18px' }}>₹{hpOrderTotal}</span>
                </div>
              </div>

              {/* Payment methods */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Select Payment Method</div>
                {[
                  { id: 'card' as const, label: 'Credit / Debit Card', icon: '💳', desc: 'Pay with Visa, Mastercard, RuPay' },
                  { id: 'upi' as const, label: 'UPI', icon: '📱', desc: 'Google Pay, PhonePe, Paytm' },
                  { id: 'cod' as const, label: 'Cash on Delivery', icon: '💵', desc: 'Pay when you receive your order' },
                ].map(method => (
                  <button key={method.id} onClick={() => setHpPaymentMethod(method.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px',
                      background: hpPaymentMethod === method.id ? 'rgba(147,51,234,0.12)' : 'rgba(255,255,255,0.03)',
                      border: hpPaymentMethod === method.id ? '1px solid rgba(147,51,234,0.3)' : '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '14px', cursor: 'pointer', width: '100%',
                      transition: 'all 0.3s', textAlign: 'left',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = hpPaymentMethod === method.id ? 'rgba(147,51,234,0.15)' : 'rgba(255,255,255,0.06)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = hpPaymentMethod === method.id ? 'rgba(147,51,234,0.12)' : 'rgba(255,255,255,0.03)'; }}
                  >
                    <span style={{ fontSize: '24px' }}>{method.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: hpPaymentMethod === method.id ? '#fff' : 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '14px' }}>{method.label}</div>
                      <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px' }}>{method.desc}</div>
                    </div>
                    {hpPaymentMethod === method.id && (
                      <span style={{ color: '#22c55e', fontSize: '18px' }}>✓</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Card details for card payment */}
              {hpPaymentMethod === 'card' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Card Number</label>
                    <input placeholder="1234 5678 9012 3456" style={{
                      width: '100%', padding: '11px 14px', borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.08)', outline: 'none',
                      background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '13px',
                      boxSizing: 'border-box',
                    }} />
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Expiry</label>
                      <input placeholder="MM/YY" style={{
                        width: '100%', padding: '11px 14px', borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.08)', outline: 'none',
                        background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '13px',
                        boxSizing: 'border-box',
                      }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>CVV</label>
                      <input placeholder="123" type="password" maxLength={4} style={{
                        width: '100%', padding: '11px 14px', borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.08)', outline: 'none',
                        background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '13px',
                        boxSizing: 'border-box',
                      }} />
                    </div>
                  </div>
                </div>
              )}

              {/* UPI details */}
              {hpPaymentMethod === 'upi' && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>UPI ID</label>
                  <input placeholder="example@upi" style={{
                    width: '100%', padding: '11px 14px', borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.08)', outline: 'none',
                    background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '13px',
                    boxSizing: 'border-box',
                  }} />
                </div>
              )}

              <button onClick={placeHpOrder}
                style={{
                  width: '100%', padding: '14px',
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  border: 'none', borderRadius: '14px', color: 'white',
                  fontSize: '15px', fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(34,197,94,0.3)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(34,197,94,0.45)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(34,197,94,0.3)'; }}
              >
                Pay ₹{hpOrderTotal} • Place Order
              </button>
            </div>
          </div>
        )}

        {/* Order Placed Toast */}
        {hpOrderPlaced && (
          <div style={{
            position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)',
            zIndex: 3000, background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            borderRadius: '16px', padding: '16px 28px', display: 'flex',
            alignItems: 'center', gap: '12px', boxShadow: '0 8px 32px rgba(34,197,94,0.3)',
            border: '1px solid rgba(255,255,255,0.1)',
            animation: 'fadeSlideDown 0.4s ease-out',
          }}>
            <span style={{ fontSize: '24px' }}>✅</span>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '16px' }}>Order Placed Successfully!</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>Your Hyperpure order has been confirmed. Delivery details have been sent.</div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{
          background: 'linear-gradient(180deg, rgba(10,10,16,0.95) 0%, rgba(5,5,10,1) 100%)',
          borderTop: '1px solid rgba(226,55,68,0.1)', padding: '40px 24px 24px',
        }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', marginBottom: '32px' }}>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>
                  <span style={{ color: '#E23744' }}>Hyper</span>pure
                </div>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', lineHeight: 1.6, margin: '0 0 16px' }}>
                  Zomato Hyperpure Private Limited<br />
                  Ground Floor, 12A, 94 Meghdoot,<br />
                  Nehru Place, New Delhi - 110019
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {['📞', '✉️', '💬'].map((icon, i) => (
                    <span key={i} style={{ fontSize: '18px', opacity: 0.5, cursor: 'pointer', transition: 'opacity 0.3s' }}
                      onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
                      onMouseLeave={e => { e.currentTarget.style.opacity = '0.5'; }}
                    >{icon}</span>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Know More</div>
                {['Blog', 'Corporate Announcements', 'Governance', 'Privacy', 'Terms of Use'].map(link => (
                  <div key={link} style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', marginBottom: '10px', cursor: 'pointer', transition: 'color 0.3s' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}
                  >{link}</div>
                ))}
              </div>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Follow Us</div>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                  {[
                    { icon: '🔗', label: 'LinkedIn' },
                    { icon: '📸', label: 'Instagram' },
                    { icon: '▶️', label: 'YouTube' },
                  ].map(social => (
                    <div key={social.label} style={{ textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                      <div style={{ fontSize: '24px', marginBottom: '4px' }}>{social.icon}</div>
                      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px' }}>{social.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {['Play Store', 'App Store'].map(store => (
                    <div key={store} style={{
                      padding: '8px 14px', background: 'rgba(255,255,255,0.06)', borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', fontSize: '12px',
                      color: 'rgba(255,255,255,0.5)', transition: 'all 0.3s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                    >{store}</div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{
              borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              flexWrap: 'wrap', gap: '12px',
            }}>
              <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '12px' }}>Copyright © Hyperpure All Rights Reserved</span>
              <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '11px' }}>License No. 10020064002537</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // District Page - Events, Movies, IPL, Dining marketplace
  const DistrictPage = () => {
    const [dtTab, setDtTab] = useState<'for-you' | 'dining' | 'movies' | 'events' | 'ipl'>('for-you');
    const [dtSearch, setDtSearch] = useState('');
    const [dtLocation, setDtLocation] = useState('Delhi/NCR');
    const [dtShowLocation, setDtShowLocation] = useState(false);
    const [dtEventDetail, setDtEventDetail] = useState<any>(null);
    const [dtBookingStep, setDtBookingStep] = useState<'browse' | 'qty' | 'details' | 'ticket'>('browse');
    const [dtTicketQty, setDtTicketQty] = useState(1);
    const [dtBookingInfo, setDtBookingInfo] = useState({ name: '', email: '', phone: '' });
    const [dtBooked, setDtBooked] = useState<any>(null);
    const [dtShowSuccess, setDtShowSuccess] = useState(false);
    const [dtExpandedFaq, setDtExpandedFaq] = useState<number | null>(null);
    const [dtCategory, setDtCategory] = useState('All');
    const [dtEventType, setDtEventType] = useState('All');

    const dtLocations = ['Delhi/NCR', 'Mumbai', 'Bengaluru', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune', 'Jaipur', 'Ahmedabad', 'Lucknow', 'Chandigarh', 'Goa'];

    const dtMovies = [
      { id: 'dm1', title: 'Bhooth Bangla', lang: 'Hindi', rating: 'UA16+', genre: 'Horror, Comedy', img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=250&fit=crop', desc: 'A haunted bungalow becomes the stage for a chaotic clash of laughter, fear, and unsettling surprises.', price: 199, duration: '2h 25m' },
      { id: 'dm2', title: 'Mortal Kombat II', lang: 'English', rating: 'A', genre: 'Action, Fantasy', img: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=250&fit=crop', desc: 'Earthrealm\'s champions are forced into conflict while resisting the rule of Shao Kahn.', price: 299, duration: '2h 10m' },
      { id: 'dm3', title: 'The Devil Wears Prada 2', lang: 'English', rating: 'A', genre: 'Drama, Comedy', img: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=250&fit=crop', desc: 'Meryl Streep and Anne Hathaway return in the eagerly awaited sequel.', price: 349, duration: '2h 15m' },
      { id: 'dm4', title: 'Krishnavataram Part 1', lang: 'Hindi', rating: 'U', genre: 'Devotional, Drama', img: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=250&fit=crop', desc: 'A mythological narrative reimagining the journey of Lord Krishna.', price: 179, duration: '2h 40m' },
      { id: 'dm5', title: 'Michael', lang: 'English', rating: 'UA13+', genre: 'Music, Drama', img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop', desc: 'An in-depth portrayal of Michael Jackson, the King of Pop.', price: 399, duration: '2h 30m' },
      { id: 'dm6', title: 'Dhurandhar The Revenge', lang: 'Hindi', rating: 'A', genre: 'Thriller, Action', img: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=250&fit=crop', desc: 'A gripping thriller following Jaskirat Singh Rangi\'s rise deep inside Pakistan.', price: 229, duration: '2h 20m' },
      { id: 'dm7', title: 'Raja Shivaji', lang: 'Hindi', rating: 'UA16+', genre: 'Historical, Action', img: 'https://images.unsplash.com/photo-1560931684-3bc4aa8c630d?w=400&h=250&fit=crop', desc: 'The epic tale of the legendary Maratha king.', price: 259, duration: '2h 50m' },
      { id: 'dm8', title: 'Daadi Ki Shaadi', lang: 'Hindi', rating: 'U', genre: 'Comedy, Family', img: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400&h=250&fit=crop', desc: 'A heartwarming family comedy about a grandmother\'s wedding.', price: 189, duration: '2h 05m' },
    ];

    const dtIplMatches = [
      { id: 'di1', title: 'DC vs KKR - Match 51', teams: 'Delhi Capitals vs Kolkata Knight Riders', venue: 'Arun Jaitley Stadium, Delhi/NCR', date: 'Fri, 08 May 2026', time: '7:30 PM', price: 1540, img: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=250&fit=crop' },
      { id: 'di2', title: 'RR vs LSG - Match 64', teams: 'Rajasthan Royals vs Lucknow Super Giants', venue: 'Sawai Mansingh Stadium, Jaipur', date: 'Tue, 19 May 2026', time: '7:30 PM', price: 2500, img: 'https://images.unsplash.com/photo-1508098682722-e99c643e7f0b?w=400&h=250&fit=crop' },
      { id: 'di3', title: 'RR vs GT - Match 52', teams: 'Rajasthan Royals vs Gujarat Titans', venue: 'Sawai Mansingh Stadium, Jaipur', date: 'Sat, 09 May 2026', time: '7:30 PM', price: 2800, img: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=400&h=250&fit=crop' },
      { id: 'di4', title: 'PBKS vs DC - Match 55', teams: 'Punjab Kings vs Delhi Capitals', venue: 'HPCA Stadium, Dharamshala', date: 'Mon, 11 May 2026', time: '7:30 PM', price: 2500, img: 'https://images.unsplash.com/photo-1567599752821-3fcb5f7b3377?w=400&h=250&fit=crop' },
      { id: 'di5', title: 'CSK vs LSG - Match 53', teams: 'Chennai Super Kings vs Lucknow Super Giants', venue: 'M. A. Chidambaram Stadium, Chennai', date: 'Sun, 10 May 2026', time: '3:30 PM', price: 4700, img: 'https://images.unsplash.com/photo-1575542625447-7e8e1b157d6a?w=400&h=250&fit=crop' },
      { id: 'di6', title: 'MI vs RCB - Match 60', teams: 'Mumbai Indians vs Royal Challengers Bengaluru', venue: 'Wankhede Stadium, Mumbai', date: 'Thu, 14 May 2026', time: '7:30 PM', price: 3200, img: 'https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?w=400&h=250&fit=crop' },
    ];

    const dtEvents = [
      { id: 'de1', title: 'Ye Live in India', type: 'Music', venue: 'Jawaharlal Nehru Stadium, Delhi/NCR', date: 'Sat, 23 May', time: '8:00 PM', price: 7500, img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=250&fit=crop' },
      { id: 'de2', title: 'TATA IPL 2026: DC vs KKR', type: 'Sports', venue: 'Arun Jaitley Stadium, Delhi/NCR', date: 'Fri, 08 May', time: '7:30 PM', price: 1540, img: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=250&fit=crop' },
      { id: 'de3', title: 'Anime India | Delhi', type: 'Exhibition', venue: 'Yashobhoomi, Delhi/NCR', date: 'Sat, 06 Jun – Sun, 07 Jun', time: '10:00 AM', price: 399, img: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=400&h=250&fit=crop' },
      { id: 'de4', title: 'Music & Masala Fest | Delhi', type: 'Festival', venue: 'JLN Stadium, Delhi/NCR', date: 'Sat, 09 May – Sun, 10 May', time: '2:00 PM', price: 499, img: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=250&fit=crop' },
      { id: 'de5', title: 'BUDX NBA House 2026', type: 'Sports', venue: 'Bharat Mandapam, Delhi/NCR', date: 'Sat, 09 May – Sun, 10 May', time: '4:00 PM', price: 1999, img: 'https://images.unsplash.com/photo-1546512565-1fc5f9e5e1e9?w=400&h=250&fit=crop' },
      { id: 'de6', title: 'Diet Coke Party - Edition 2', type: 'Nightlife', venue: 'Marièta, Gurugram', date: 'Fri, 15 May', time: '5:00 PM', price: 1499, img: 'https://images.unsplash.com/photo-1576016772010-5d2e22a46761?w=400&h=250&fit=crop' },
      { id: 'de7', title: 'Noida Comedy Show | Sec-18', type: 'Comedy', venue: 'Comedy Club Sector 18 Noida', date: 'Fri, 8 May – Fri, 15 May', time: 'Multiple slots', price: 299, img: 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=400&h=250&fit=crop' },
      { id: 'de8', title: 'ISL 2025-26: SC Delhi vs Odisha FC', type: 'Sports', venue: 'JLN Stadium, Delhi/NCR', date: 'Fri, 08 May', time: '5:00 PM', price: 50, img: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=400&h=250&fit=crop' },
      { id: 'de9', title: 'Kaahe Mose India Tour', type: 'Music', venue: 'The Piano Man, Delhi/NCR', date: 'Sun, 24 May', time: '8:30 PM', price: 799, img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop' },
      { id: 'de10', title: 'Arz Kiya Hai India Tour - Mukul Sharma', type: 'Music', venue: 'Aiwan-e-Ghalib Auditorium, Delhi/NCR', date: 'Sun, 19 Jul', time: '7:00 PM', price: 499, img: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&h=250&fit=crop' },
      { id: 'de11', title: 'Maithili Thakur Live', type: 'Music', venue: 'Yashobhoomi, Delhi/NCR', date: 'Sat, 20 Jun', time: '7:00 PM', price: 1100, img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=250&fit=crop' },
      { id: 'de12', title: 'Eden of Sounds | Mussoorie', type: 'Festival', venue: 'Venue TBA, Mussoorie', date: 'Fri, 05 Jun', time: '3:00 PM', price: 6969, img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=250&fit=crop' },
    ];

    const dtArtists = [
      { name: 'Papon', genre: 'Music', img: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=100&h=100&fit=crop' },
      { name: 'Ye', genre: 'Music', img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop' },
      { name: 'Mukul Sharma', genre: 'Comedy', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
      { name: 'Karma', genre: 'Music', img: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100&h=100&fit=crop' },
      { name: 'NAV', genre: 'Music', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
      { name: 'Rakesh Chaurasia', genre: 'Music', img: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=100&h=100&fit=crop' },
      { name: 'Mannara Chopra', genre: 'Music', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
      { name: 'Shah Rule', genre: 'Music', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop' },
      { name: 'Atul Khatri', genre: 'Comedy', img: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=100&h=100&fit=crop' },
      { name: 'Priyam Pandey', genre: 'Comedy', img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop' },
    ];

    const dtDining = [
      { id: 'dd1', name: 'Spice Paradise', cuisine: 'North Indian, Mughlai', rating: 4.5, price: 600, locality: 'Koramangala', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=250&fit=crop' },
      { id: 'dd2', name: 'Pizza Paradise', cuisine: 'Italian, Pizza', rating: 4.3, price: 800, locality: 'Indiranagar', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=250&fit=crop' },
      { id: 'dd3', name: 'Dragon Wok', cuisine: 'Chinese, Thai', rating: 4.2, price: 500, locality: 'HSR Layout', img: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=250&fit=crop' },
      { id: 'dd4', name: 'Burger Barn', cuisine: 'American, Burgers', rating: 4.1, price: 400, locality: 'Whitefield', img: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&h=250&fit=crop' },
      { id: 'dd5', name: 'Dosa Delight', cuisine: 'South Indian', rating: 4.6, price: 350, locality: 'Jayanagar', img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=250&fit=crop' },
      { id: 'dd6', name: 'Sushi House', cuisine: 'Japanese, Sushi', rating: 4.4, price: 1200, locality: 'MG Road', img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=250&fit=crop' },
    ];

    const dtFaqs = [
      { q: 'How do I book tickets on District?', a: 'Simply browse events, movies, or matches, select your preferred option, choose quantity, enter your details, and confirm your booking. Your ticket will be generated instantly.' },
      { q: 'Can I cancel my booking?', a: 'Cancellation policies vary by event. Most tickets can be cancelled up to 24 hours before the event for a full refund. Check the specific event page for details.' },
      { q: 'How will I receive my tickets?', a: 'Tickets are delivered digitally via email and SMS. You can also view all your bookings in the "My Tickets" section of your account.' },
      { q: 'Is there a booking fee?', a: 'A nominal convenience fee may apply to certain bookings. The total amount including all fees is displayed before you confirm your purchase.' },
      { q: 'Can I transfer my tickets to someone else?', a: 'Yes, most tickets can be transferred. Please contact our support team for assistance with ticket transfers.' },
    ];

    const dtCategories = ['All', 'Now Showing', 'Coming Soon', 'Hindi', 'English', 'Regional'];

    const handleDtBook = (item: any) => {
      setDtEventDetail(item);
      setDtBookingStep('qty');
      setDtTicketQty(1);
      setDtBookingInfo({ name: '', email: '', phone: '' });
    };

    const handleDtConfirmBooking = () => {
      const booking = {
        id: `DT${Date.now()}`,
        event: dtEventDetail,
        qty: dtTicketQty,
        info: dtBookingInfo,
        total: dtEventDetail.price * dtTicketQty,
        date: new Date().toISOString(),
        status: 'confirmed' as const,
      };
      setDtBooked(booking);
      setDtShowSuccess(true);
      setTimeout(() => setDtShowSuccess(false), 4000);
      setDtBookingStep('ticket');
    };

    const filteredMovies = dtMovies.filter(m => {
      if (dtCategory === 'All') return true;
      if (dtCategory === 'Now Showing') return true;
      if (dtCategory === 'Hindi') return m.lang === 'Hindi';
      if (dtCategory === 'English') return m.lang === 'English';
      return true;
    }).filter(m => dtSearch ? m.title.toLowerCase().includes(dtSearch.toLowerCase()) || m.genre.toLowerCase().includes(dtSearch.toLowerCase()) : true);

    const filteredEvents = dtEvents.filter(e => {
      if (dtEventType === 'All') return true;
      return e.type === dtEventType;
    }).filter(e => dtSearch ? e.title.toLowerCase().includes(dtSearch.toLowerCase()) || e.venue.toLowerCase().includes(dtSearch.toLowerCase()) : true);

    const filteredIpl = dtIplMatches.filter(m => dtSearch ? m.title.toLowerCase().includes(dtSearch.toLowerCase()) || m.teams.toLowerCase().includes(dtSearch.toLowerCase()) || m.venue.toLowerCase().includes(dtSearch.toLowerCase()) : true);

    const filteredDining = dtDining.filter(d => dtSearch ? d.name.toLowerCase().includes(dtSearch.toLowerCase()) || d.cuisine.toLowerCase().includes(dtSearch.toLowerCase()) : true);

    const dtSectionTitle: React.CSSProperties = { fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', color: '#E23744', marginBottom: '6px' };
    const dtSectionHeading: React.CSSProperties = { fontSize: '28px', fontWeight: 800, color: '#fff', margin: '0 0 8px' };

    return (
      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Hero */}
        <div style={{
          background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a0a1a 100%)',
          padding: '56px 24px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden',
          borderBottom: '1px solid rgba(226,55,68,0.12)',
        }}>
          <div style={{ position: 'absolute', top: '-30%', left: '-5%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(147,51,234,0.08) 0%, transparent 70%)', borderRadius: '50%', animation: 'orbFloat 20s ease-in-out infinite', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(226,55,68,0.06) 0%, transparent 70%)', borderRadius: '50%', animation: 'orbFloat2 25s ease-in-out infinite 3s', pointerEvents: 'none' }} />
          <span style={{ position: 'absolute', top: '8%', left: '3%', fontSize: '40px', animation: 'heroFloat1 7s ease-in-out infinite', opacity: 0.1 }}>🎬</span>
          <span style={{ position: 'absolute', top: '12%', right: '6%', fontSize: '36px', animation: 'heroFloat2 9s ease-in-out infinite 1s', opacity: 0.08 }}>🎵</span>
          <span style={{ position: 'absolute', bottom: '15%', left: '5%', fontSize: '32px', animation: 'heroFloat1 8s ease-in-out infinite 2s', opacity: 0.07 }}>🏏</span>
          <span style={{ position: 'absolute', bottom: '8%', right: '3%', fontSize: '34px', animation: 'heroFloat2 10s ease-in-out infinite 0.5s', opacity: 0.09 }}>🍽️</span>

          <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '24px' }}>🎭</span>
              <span style={{ fontSize: '26px', fontWeight: 800, background: 'linear-gradient(135deg, #9333ea, #E23744, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>District</span>
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', fontWeight: 300 }}>by</span>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>Zomato</span>
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', margin: '0 0 6px', lineHeight: 1.2 }}>
              Movies, Events, Sports & More
            </h1>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.45)', margin: '0 0 24px' }}>in {dtLocation}</p>

            {/* Location selector */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ position: 'relative' }}>
                <button onClick={() => setDtShowLocation(!dtShowLocation)} style={{
                  display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer',
                  fontSize: '13px', transition: 'all 0.3s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                >
                  <span>📍</span> {dtLocation} <span style={{ fontSize: '10px' }}>▼</span>
                </button>
                {dtShowLocation && (
                  <div style={{
                    position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '8px',
                    background: '#1a1a24', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)',
                    padding: '8px', width: '200px', boxShadow: '0 12px 40px rgba(0,0,0,0.5)', zIndex: 100,
                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px',
                  }}>
                    {dtLocations.map(loc => (
                      <button key={loc} onClick={() => { setDtLocation(loc); setDtShowLocation(false); }} style={{
                        padding: '8px 10px', background: dtLocation === loc ? 'rgba(147,51,234,0.15)' : 'transparent',
                        border: 'none', borderRadius: '8px', color: dtLocation === loc ? '#fff' : 'rgba(255,255,255,0.5)',
                        cursor: 'pointer', fontSize: '12px', fontWeight: dtLocation === loc ? 600 : 400, transition: 'all 0.2s',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = dtLocation === loc ? 'rgba(147,51,234,0.15)' : 'transparent'; }}
                      >{loc}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Search */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px', maxWidth: '520px', margin: '0 auto',
              background: 'rgba(255,255,255,0.06)', borderRadius: '16px', padding: '4px 6px 4px 16px',
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <span style={{ fontSize: '16px' }}>🔍</span>
              <input type="text" placeholder="Search events, movies, restaurants..."
                value={dtSearch} onChange={e => setDtSearch(e.target.value)}
                style={{ flex: 1, padding: '12px 10px', border: 'none', outline: 'none', background: 'transparent', color: '#fff', fontSize: '14px' }} />
              <button style={{
                padding: '10px 22px', background: 'linear-gradient(135deg, #9333ea, #E23744)',
                color: 'white', border: 'none', borderRadius: '12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(147,51,234,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
              >Search</button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '4px', padding: '16px 24px',
          background: 'rgba(10,10,16,0.8)', borderBottom: '1px solid rgba(255,255,255,0.04)',
          position: 'sticky', top: '0', zIndex: 50, backdropFilter: 'blur(12px)',
        }}>
          {[
            { key: 'for-you', label: 'For You', icon: '🎯' },
            { key: 'dining', label: 'Dining', icon: '🍽️' },
            { key: 'movies', label: 'Movies', icon: '🎬' },
            { key: 'events', label: 'Events', icon: '🎉' },
            { key: 'ipl', label: 'IPL', icon: '🏏' },
          ].map(tab => (
            <button key={tab.key} onClick={() => setDtTab(tab.key as typeof dtTab)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px',
                background: dtTab === tab.key ? 'linear-gradient(135deg, rgba(147,51,234,0.15), rgba(226,55,68,0.1))' : 'transparent',
                border: dtTab === tab.key ? '1px solid rgba(147,51,234,0.2)' : '1px solid transparent',
                borderRadius: '12px', color: dtTab === tab.key ? '#fff' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer', fontSize: '14px', fontWeight: dtTab === tab.key ? 600 : 400,
                transition: 'all 0.3s',
              }}
              onMouseEnter={e => { if (dtTab !== tab.key) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; } }}
              onMouseLeave={e => { if (dtTab !== tab.key) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; } }}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* FOR YOU TAB */}
        {dtTab === 'for-you' && (
          <div>
            {/* IPL matches spotlight */}
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <p style={dtSectionTitle}>Live Action</p>
                  <h2 style={dtSectionHeading}>TATA IPL 2026 🏏</h2>
                </div>
                <button onClick={() => setDtTab('ipl')} style={{
                  padding: '8px 18px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '12px', fontWeight: 500,
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                >View all →</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {dtIplMatches.slice(0, 4).map((match, i) => (
                  <div key={match.id} style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                    borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)',
                    animation: `cardFadeIn 0.5s ease-out ${0.05 * i}s both`, transition: 'all 0.3s ease', cursor: 'pointer',
                  }} className="card-glow"
                    onClick={() => handleDtBook(match)}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <div style={{ height: '160px', backgroundImage: `url(${match.img})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'linear-gradient(135deg, #9333ea, #E23744)', borderRadius: '8px', padding: '4px 12px', fontSize: '11px', fontWeight: 700, color: '#fff' }}>LIVE</div>
                      <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', height: '50%', background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />
                    </div>
                    <div style={{ padding: '16px' }}>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '4px' }}>{match.date} • {match.time}</div>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{match.title}</div>
                      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>{match.venue}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, fontSize: '18px', color: '#22c55e' }}>₹{match.price}</span>
                        <button style={{
                          padding: '8px 18px', borderRadius: '10px', border: 'none',
                          background: 'linear-gradient(135deg, #9333ea, #E23744)', color: 'white',
                          fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                        }}
                          onClick={(e) => { e.stopPropagation(); handleDtBook(match); }}
                          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                        >Book Now</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Movies section */}
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <p style={dtSectionTitle}>Now Showing</p>
                  <h2 style={dtSectionHeading}>Top Movies 🎬</h2>
                </div>
                <button onClick={() => setDtTab('movies')} style={{
                  padding: '8px 18px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '12px', fontWeight: 500,
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                >View all →</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                {dtMovies.slice(0, 6).map((movie, i) => (
                  <div key={movie.id} style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                    borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)',
                    animation: `cardFadeIn 0.5s ease-out ${0.05 * i}s both`, transition: 'all 0.3s ease', cursor: 'pointer',
                  }} className="card-glow"
                    onClick={() => handleDtBook(movie)}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <div style={{ height: '150px', backgroundImage: `url(${movie.img})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.6)', borderRadius: '6px', padding: '3px 8px', fontSize: '11px', fontWeight: 600, color: '#fff' }}>{movie.rating}</div>
                      <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', height: '40%', background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }} />
                    </div>
                    <div style={{ padding: '14px' }}>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '4px' }}>{movie.genre}</div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '6px', lineHeight: 1.3 }}>{movie.title}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, fontSize: '17px', color: '#22c55e' }}>₹{movie.price}</span>
                        <button style={{
                          padding: '7px 16px', borderRadius: '9px', border: 'none',
                          background: 'linear-gradient(135deg, #9333ea, #E23744)', color: 'white',
                          fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                        }}
                          onClick={(e) => { e.stopPropagation(); handleDtBook(movie); }}
                          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                        >Book</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Events section */}
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <p style={dtSectionTitle}>Upcoming</p>
                  <h2 style={dtSectionHeading}>Best of Nightlife & Events 🎉</h2>
                </div>
                <button onClick={() => setDtTab('events')} style={{
                  padding: '8px 18px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '12px', fontWeight: 500,
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                >View all →</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {dtEvents.slice(0, 4).map((event, i) => (
                  <div key={event.id} style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                    borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)',
                    animation: `cardFadeIn 0.5s ease-out ${0.05 * i}s both`, transition: 'all 0.3s ease', cursor: 'pointer',
                  }} className="card-glow"
                    onClick={() => handleDtBook(event)}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <div style={{ height: '160px', backgroundImage: `url(${event.img})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'linear-gradient(135deg, #9333ea, #E23744)', borderRadius: '8px', padding: '4px 12px', fontSize: '11px', fontWeight: 700, color: '#fff' }}>{event.type}</div>
                      <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', height: '40%', background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />
                    </div>
                    <div style={{ padding: '16px' }}>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '4px' }}>{event.date} • {event.time}</div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{event.title}</div>
                      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>{event.venue}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, fontSize: '18px', color: '#22c55e' }}>₹{event.price}</span>
                        <button style={{
                          padding: '8px 18px', borderRadius: '10px', border: 'none',
                          background: 'linear-gradient(135deg, #9333ea, #E23744)', color: 'white',
                          fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                        }}
                          onClick={(e) => { e.stopPropagation(); handleDtBook(event); }}
                          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                        >Book Now</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Artists */}
            <div style={{
              maxWidth: '1100px', margin: '0 auto', padding: '24px 24px 40px',
            }}>
              <p style={dtSectionTitle}>Featured</p>
              <h2 style={dtSectionHeading}>Artists in your District 🎤</h2>
              <div style={{
                display: 'flex', gap: '16px', overflowX: 'auto', padding: '8px 4px 12px',
                scrollbarWidth: 'thin', scrollbarColor: '#9333ea transparent',
              }}>
                {dtArtists.map((artist, i) => (
                  <div key={artist.name} style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                    minWidth: '90px', cursor: 'pointer', transition: 'all 0.3s ease',
                    animation: `fadeSlideUp 0.4s ease-out ${0.03 * i}s both`,
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <div style={{
                      width: '72px', height: '72px', borderRadius: '50%', overflow: 'hidden',
                      border: '2px solid rgba(147,51,234,0.3)', boxShadow: '0 0 20px rgba(147,51,234,0.1)',
                    }}>
                      <img src={artist.img} alt={artist.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>{artist.name}</span>
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>{artist.genre}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MOVIES TAB */}
        {dtTab === 'movies' && (
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {dtCategories.map(cat => (
                <button key={cat} onClick={() => setDtCategory(cat)}
                  style={{
                    padding: '8px 18px', borderRadius: '20px', border: 'none',
                    background: dtCategory === cat ? 'linear-gradient(135deg, #9333ea, #E23744)' : 'rgba(255,255,255,0.06)',
                    color: dtCategory === cat ? '#fff' : 'rgba(255,255,255,0.5)',
                    cursor: 'pointer', fontSize: '13px', fontWeight: dtCategory === cat ? 600 : 400,
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={e => { if (dtCategory !== cat) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                  onMouseLeave={e => { if (dtCategory !== cat) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                >{cat}</button>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '20px' }}>
              {filteredMovies.map((movie, i) => (
                <div key={movie.id} style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                  borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)',
                  animation: `cardFadeIn 0.5s ease-out ${0.04 * i}s both`, transition: 'all 0.3s ease', cursor: 'pointer',
                }} className="card-glow"
                  onClick={() => handleDtBook(movie)}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{ height: '160px', backgroundImage: `url(${movie.img})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.6)', borderRadius: '6px', padding: '3px 8px', fontSize: '11px', fontWeight: 600, color: '#fff' }}>{movie.rating}</div>
                  </div>
                  <div style={{ padding: '14px' }}>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '4px' }}>{movie.lang} • {movie.duration}</div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '4px', lineHeight: 1.3 }}>{movie.title}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>{movie.genre}</div>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', margin: '0 0 10px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{movie.desc}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '17px', color: '#22c55e' }}>₹{movie.price}</span>
                      <button style={{
                        padding: '7px 18px', borderRadius: '9px', border: 'none',
                        background: 'linear-gradient(135deg, #9333ea, #E23744)', color: 'white',
                        fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                      }}
                        onClick={(e) => { e.stopPropagation(); handleDtBook(movie); }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                      >Book</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EVENTS TAB */}
        {dtTab === 'events' && (
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {['All', 'Music', 'Sports', 'Comedy', 'Nightlife', 'Festival', 'Exhibition'].map(type => (
                <button key={type} onClick={() => setDtEventType(type)}
                  style={{
                    padding: '8px 18px', borderRadius: '20px', border: 'none',
                    background: dtEventType === type ? 'linear-gradient(135deg, #9333ea, #E23744)' : 'rgba(255,255,255,0.06)',
                    color: dtEventType === type ? '#fff' : 'rgba(255,255,255,0.5)',
                    cursor: 'pointer', fontSize: '13px', fontWeight: dtEventType === type ? 600 : 400,
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={e => { if (dtEventType !== type) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                  onMouseLeave={e => { if (dtEventType !== type) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                >{type}</button>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {filteredEvents.map((event, i) => (
                <div key={event.id} style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                  borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)',
                  animation: `cardFadeIn 0.5s ease-out ${0.04 * i}s both`, transition: 'all 0.3s ease', cursor: 'pointer',
                }} className="card-glow"
                  onClick={() => handleDtBook(event)}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{ height: '170px', backgroundImage: `url(${event.img})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'linear-gradient(135deg, #9333ea, #E23744)', borderRadius: '8px', padding: '4px 12px', fontSize: '11px', fontWeight: 700, color: '#fff' }}>{event.type}</div>
                    <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', height: '40%', background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />
                  </div>
                  <div style={{ padding: '16px' }}>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '4px' }}>{event.date} • {event.time}</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{event.title}</div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '10px' }}>{event.venue}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '18px', color: '#22c55e' }}>From ₹{event.price}</span>
                      <button style={{
                        padding: '8px 18px', borderRadius: '10px', border: 'none',
                        background: 'linear-gradient(135deg, #9333ea, #E23744)', color: 'white',
                        fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                      }}
                        onClick={(e) => { e.stopPropagation(); handleDtBook(event); }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                      >Book Now</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* IPL TAB */}
        {dtTab === 'ipl' && (
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '8px' }}>🏏</span>
              <p style={dtSectionTitle}>TATA Indian Premier League 2026</p>
              <h2 style={{ ...dtSectionHeading, fontSize: '32px' }}>IPL Ticket Booking</h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginTop: '-4px' }}>Book your seats for the biggest cricket extravaganza</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
              {filteredIpl.map((match, i) => (
                <div key={match.id} style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                  borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)',
                  animation: `cardFadeIn 0.5s ease-out ${0.05 * i}s both`, transition: 'all 0.3s ease', cursor: 'pointer',
                }} className="card-glow"
                  onClick={() => handleDtBook(match)}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{ height: '180px', backgroundImage: `url(${match.img})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'linear-gradient(135deg, #9333ea, #E23744)', borderRadius: '8px', padding: '4px 14px', fontSize: '11px', fontWeight: 700, color: '#fff' }}>IPL 2026</div>
                    <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', height: '50%', background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />
                    <div style={{ position: 'absolute', bottom: '10px', left: '12px', color: '#fff', fontSize: '13px', fontWeight: 600 }}>{match.teams}</div>
                  </div>
                  <div style={{ padding: '16px' }}>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '4px' }}>{match.date} • {match.time}</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>{match.title}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginBottom: '10px' }}>📍 {match.venue}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Starting from </span>
                        <span style={{ fontWeight: 800, fontSize: '20px', color: '#22c55e' }}>₹{match.price}</span>
                      </div>
                      <button style={{
                        padding: '10px 22px', borderRadius: '10px', border: 'none',
                        background: 'linear-gradient(135deg, #9333ea, #E23744)', color: 'white',
                        fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                        boxShadow: '0 4px 16px rgba(147,51,234,0.3)',
                      }}
                        onClick={(e) => { e.stopPropagation(); handleDtBook(match); }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(147,51,234,0.45)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(147,51,234,0.3)'; }}
                      >Book Tickets</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DINING TAB */}
        {dtTab === 'dining' && (
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <p style={dtSectionTitle}>Restaurants</p>
              <h2 style={dtSectionHeading}>Best Dining Spots Nearby 🍽️</h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginTop: '-4px' }}>Discover the finest restaurants in {dtLocation}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {filteredDining.map((d, i) => (
                <div key={d.id} style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                  borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)',
                  animation: `cardFadeIn 0.5s ease-out ${0.05 * i}s both`, transition: 'all 0.3s ease', cursor: 'pointer',
                }} className="card-glow"
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{ height: '160px', backgroundImage: `url(${d.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  <div style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>{d.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(34,197,94,0.15)', padding: '2px 8px', borderRadius: '6px' }}>
                        <span style={{ color: '#22c55e', fontSize: '12px' }}>★</span>
                        <span style={{ color: '#22c55e', fontSize: '12px', fontWeight: 600 }}>{d.rating}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>{d.cuisine}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>{d.locality} • ₹{d.price} for two</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ */}
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <p style={dtSectionTitle}>Help Center</p>
            <h2 style={dtSectionHeading}>Frequently Asked Questions ❓</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {dtFaqs.map((faq, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.04)', borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden',
                animation: `fadeSlideUp 0.4s ease-out ${0.05 * i}s both`,
                cursor: 'pointer', transition: 'all 0.3s ease',
              }}
                onClick={() => setDtExpandedFaq(dtExpandedFaq === i ? null : i)}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(147,51,234,0.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
                  <span style={{ color: '#fff', fontWeight: 600, fontSize: '14px' }}>{faq.q}</span>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '18px', transition: 'transform 0.3s ease', transform: dtExpandedFaq === i ? 'rotate(180deg)' : 'rotate(0)', display: 'inline-block' }}>▼</span>
                </div>
                {dtExpandedFaq === i && (
                  <div style={{ padding: '0 20px 16px', color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: 1.6, animation: 'fadeSlideUp 0.3s ease-out' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          background: 'linear-gradient(180deg, rgba(10,10,16,0.95) 0%, rgba(5,5,10,1) 100%)',
          borderTop: '1px solid rgba(147,51,234,0.1)', padding: '40px 24px 24px',
        }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', marginBottom: '32px' }}>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>
                  <span style={{ background: 'linear-gradient(135deg, #9333ea, #E23744, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>District</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', lineHeight: 1.6, margin: '0 0 16px' }}>
                  Your one-stop destination for movies, events, sports, concerts & dining.
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {['📘', '📸', '🐦', '▶️'].map((icon, i) => (
                    <span key={i} style={{ fontSize: '18px', opacity: 0.5, cursor: 'pointer', transition: 'opacity 0.3s' }}
                      onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
                      onMouseLeave={e => { e.currentTarget.style.opacity = '0.5'; }}
                    >{icon}</span>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Know More</div>
                {['Terms & Conditions', 'Privacy Policy', 'Contact Us', 'About District', 'Careers'].map(link => (
                  <div key={link} style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', marginBottom: '10px', cursor: 'pointer', transition: 'color 0.3s' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}
                  >{link}</div>
                ))}
              </div>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Download the app</div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {['Play Store', 'App Store'].map(store => (
                    <div key={store} style={{
                      padding: '8px 14px', background: 'rgba(255,255,255,0.06)', borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', fontSize: '12px',
                      color: 'rgba(255,255,255,0.5)', transition: 'all 0.3s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                    >{store}</div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '12px' }}>© 2026 District by Zomato. All rights reserved.</span>
              <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '11px' }}>Movies • Events • Sports • Dining</span>
            </div>
          </div>
        </div>

        {/* Booking Modal - Qty Selection */}
        {dtBookingStep === 'qty' && dtEventDetail && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }} onClick={() => setDtBookingStep('browse')} />
            <div style={{
              position: 'relative', width: '440px', maxWidth: '90vw',
              background: 'linear-gradient(180deg, #1a1a2e 0%, #0e0e16 100%)',
              borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)',
              padding: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
              animation: 'fadeScaleIn 0.3s ease-out',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{dtEventDetail.title}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{dtEventDetail.venue || dtEventDetail.genre} • ₹{dtEventDetail.price}/ticket</div>
                </div>
                <button onClick={() => setDtBookingStep('browse')} style={{
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
                  fontSize: '18px', padding: '6px 12px', lineHeight: 1, height: 'fit-content',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                >✕</button>
              </div>
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '12px' }}>Select number of tickets</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                  <button onClick={() => setDtTicketQty(Math.max(1, dtTicketQty - 1))} style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: 'rgba(226,55,68,0.15)', border: '1px solid rgba(226,55,68,0.2)',
                    color: '#E23744', cursor: 'pointer', fontSize: '22px', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(226,55,68,0.25)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(226,55,68,0.15)'; }}
                  >−</button>
                  <span style={{ fontSize: '48px', fontWeight: 800, color: '#fff', minWidth: '60px', textAlign: 'center' }}>{dtTicketQty}</span>
                  <button onClick={() => setDtTicketQty(Math.min(10, dtTicketQty + 1))} style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.2)',
                    color: '#22c55e', cursor: 'pointer', fontSize: '22px', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(34,197,94,0.25)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(34,197,94,0.15)'; }}
                  >+</button>
                </div>
                <div style={{ marginTop: '16px', color: '#22c55e', fontWeight: 700, fontSize: '24px' }}>₹{dtEventDetail.price * dtTicketQty}</div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', marginTop: '4px' }}>₹{dtEventDetail.price} × {dtTicketQty} ticket{dtTicketQty > 1 ? 's' : ''}</div>
              </div>
              <button onClick={() => setDtBookingStep('details')} style={{
                width: '100%', padding: '14px', marginTop: '16px',
                background: 'linear-gradient(135deg, #9333ea, #E23744)',
                border: 'none', borderRadius: '14px', color: 'white',
                fontSize: '15px', fontWeight: 700, cursor: 'pointer',
                transition: 'all 0.3s ease', boxShadow: '0 4px 20px rgba(147,51,234,0.3)',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(147,51,234,0.45)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(147,51,234,0.3)'; }}
              >Continue - ₹{dtEventDetail.price * dtTicketQty}</button>
            </div>
          </div>
        )}

        {/* Booking Modal - Details Form */}
        {dtBookingStep === 'details' && dtEventDetail && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }} onClick={() => setDtBookingStep('qty')} />
            <div style={{
              position: 'relative', width: '440px', maxWidth: '90vw',
              background: 'linear-gradient(180deg, #1a1a2e 0%, #0e0e16 100%)',
              borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)',
              padding: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
              animation: 'fadeScaleIn 0.3s ease-out',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ color: '#fff', margin: 0, fontSize: '18px', fontWeight: 700 }}>Your Details</h3>
                <button onClick={() => setDtBookingStep('qty')} style={{
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
                  fontSize: '18px', padding: '6px 12px', lineHeight: 1, height: 'fit-content',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                >✕</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Full Name</label>
                  <input placeholder="Enter your full name" value={dtBookingInfo.name}
                    onChange={e => setDtBookingInfo({ ...dtBookingInfo, name: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', outline: 'none', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Email Address</label>
                  <input placeholder="Enter your email" type="email" value={dtBookingInfo.email}
                    onChange={e => setDtBookingInfo({ ...dtBookingInfo, email: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', outline: 'none', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Phone Number</label>
                  <input placeholder="Enter your phone number" value={dtBookingInfo.phone}
                    onChange={e => setDtBookingInfo({ ...dtBookingInfo, phone: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', outline: 'none', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>{dtTicketQty} ticket{dtTicketQty > 1 ? 's' : ''}</span>
                  <span style={{ color: '#22c55e', fontWeight: 800, fontSize: '22px' }}>₹{dtEventDetail.price * dtTicketQty}</span>
                </div>
                <button onClick={handleDtConfirmBooking}
                  style={{
                    width: '100%', padding: '14px',
                    background: dtBookingInfo.name && dtBookingInfo.email && dtBookingInfo.phone ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'rgba(255,255,255,0.08)',
                    border: 'none', borderRadius: '14px', color: 'white',
                    fontSize: '15px', fontWeight: 700, cursor: dtBookingInfo.name && dtBookingInfo.email && dtBookingInfo.phone ? 'pointer' : 'not-allowed',
                    opacity: dtBookingInfo.name && dtBookingInfo.email && dtBookingInfo.phone ? 1 : 0.5,
                    boxShadow: dtBookingInfo.name && dtBookingInfo.email && dtBookingInfo.phone ? '0 4px 20px rgba(34,197,94,0.3)' : 'none',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={e => { if (dtBookingInfo.name && dtBookingInfo.email && dtBookingInfo.phone) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(34,197,94,0.45)'; } }}
                  onMouseLeave={e => { if (dtBookingInfo.name && dtBookingInfo.email && dtBookingInfo.phone) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(34,197,94,0.3)'; } }}
                >Confirm & Pay - ₹{dtEventDetail.price * dtTicketQty}</button>
              </div>
            </div>
          </div>
        )}

        {/* Ticket Confirmation Modal */}
        {/* Success Toast */}
        {dtShowSuccess && (
          <div style={{
            position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)',
            zIndex: 3000, background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            borderRadius: '16px', padding: '16px 28px', display: 'flex',
            alignItems: 'center', gap: '14px', boxShadow: '0 8px 32px rgba(34,197,94,0.3)',
            border: '1px solid rgba(255,255,255,0.1)',
            animation: 'fadeSlideDown 0.5s ease-out',
          }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: '22px',
              animation: 'badgeBounce 0.6s ease-in-out',
            }}>🎬</div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '16px' }}>
                🎉 Booking Confirmed! Enjoy the show!
              </div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px' }}>
                📧 E-tickets sent to {dtBooked?.info?.email || 'your email'}
              </div>
            </div>
          </div>
        )}

        {dtBookingStep === 'ticket' && dtBooked && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }} />
            <div style={{
              position: 'relative', width: '480px', maxWidth: '90vw',
              background: 'linear-gradient(180deg, #0a2e1a 0%, #0e0e16 100%)',
              borderRadius: '24px', border: '1px solid rgba(34,197,94,0.2)',
              padding: '36px 32px', boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(34,197,94,0.05)',
              animation: 'fadeScaleIn 0.4s ease-out', textAlign: 'center',
            }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: 'rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', margin: '0 auto 16px',
                border: '2px solid rgba(34,197,94,0.3)',
              }}>
                <span style={{ fontSize: '36px' }}>🎫</span>
              </div>
              <h2 style={{ color: '#22c55e', fontSize: '24px', fontWeight: 800, margin: '0 0 4px' }}>Booking Confirmed! 🎉</h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', margin: '0 0 4px' }}>Your tickets have been booked successfully</p>
              <p style={{ color: '#facc15', fontSize: '18px', fontWeight: 700, margin: '0 0 4px' }}>🎬 Enjoy the show! 🍿</p>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', margin: '0 0 20px' }}>📧 E-tickets sent to {dtBooked.info.email}</p>

              <div style={{
                background: 'rgba(255,255,255,0.04)', borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.06)', padding: '20px', textAlign: 'left', marginBottom: '20px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px dashed rgba(255,255,255,0.08)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>Booking ID</span>
                  <span style={{ color: '#fff', fontSize: '13px', fontWeight: 700, fontFamily: 'monospace' }}>{dtBooked.id}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>Event</span>
                  <span style={{ color: '#fff', fontSize: '13px', fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{dtBooked.event.title}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>Tickets</span>
                  <span style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>{dtBooked.qty} × ₹{dtBooked.event.price}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>Attendee</span>
                  <span style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>{dtBooked.info.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>Status</span>
                  <span style={{ color: '#22c55e', fontSize: '13px', fontWeight: 700 }}>✅ Confirmed</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px dashed rgba(255,255,255,0.08)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>Total Paid</span>
                  <span style={{ color: '#22c55e', fontSize: '20px', fontWeight: 800 }}>₹{dtBooked.total}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => { setDtBookingStep('browse'); setDtEventDetail(null); setDtBooked(null); }} style={{
                  flex: 1, padding: '12px',
                  background: 'linear-gradient(135deg, #9333ea, #E23744)',
                  border: 'none', borderRadius: '12px', color: 'white',
                  fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >Browse More</button>
                <button onClick={() => { setDtBookingStep('browse'); setDtEventDetail(null); }}
                  style={{
                    padding: '12px 20px', background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px',
                    color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '14px', fontWeight: 500,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                >Download Ticket</button>
              </div>
            </div>
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
          <button
            style={{
              ...styles.navButton,
              ...(currentPage === 'hyperpure'
                ? {
                    background: 'linear-gradient(135deg, rgba(34,197,94,0.25), rgba(16,185,129,0.12))',
                    border: '1px solid rgba(34,197,94,0.35)',
                    color: '#fff',
                    boxShadow: '0 0 24px rgba(34,197,94,0.25), inset 0 0 20px rgba(34,197,94,0.06)',
                  }
                : {
                    background: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(16,185,129,0.04))',
                    border: '1px solid rgba(34,197,94,0.12)',
                    color: 'rgba(34,197,94,0.85)',
                  }),
            }}
            className={currentPage === 'hyperpure' ? 'nav-btn-active' : ''}
            onClick={() => setCurrentPage('hyperpure')}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(34,197,94,0.18), rgba(16,185,129,0.1))';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(34,197,94,0.2)';
              e.currentTarget.style.borderColor = 'rgba(34,197,94,0.3)';
            }}
            onMouseLeave={e => {
              if (currentPage !== 'hyperpure') {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(16,185,129,0.04))';
                e.currentTarget.style.color = 'rgba(34,197,94,0.85)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(34,197,94,0.12)';
              } else {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(34,197,94,0.25), rgba(16,185,129,0.12))';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 0 24px rgba(34,197,94,0.25)';
                e.currentTarget.style.borderColor = 'rgba(34,197,94,0.35)';
              }
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 4px rgba(34,197,94,0.4))' }}>
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              <path d="M12 3l8 4v10l-8 4-8-4V7z" fill="none"/>
            </svg>
            <span style={{ fontWeight: 600 }}>Hyperpure</span>
            <span style={{
              fontSize: '9px', padding: '2px 6px', borderRadius: '6px',
              background: 'rgba(34,197,94,0.2)', color: '#22c55e',
              fontWeight: 700, letterSpacing: '0.5px', marginLeft: '2px',
            }}>B2B</span>
          </button>
          <button
            style={currentPage === 'district' ? { ...styles.navButton, ...styles.navButtonActive } : styles.navButton}
            className={currentPage === 'district' ? 'nav-btn-active' : ''}
            onClick={() => setCurrentPage('district')}
            onMouseEnter={e => { if (currentPage !== 'district') { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
            onMouseLeave={e => { if (currentPage !== 'district') { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; e.currentTarget.style.transform = 'translateY(0)'; } }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M12 3a4 4 0 0 1 4 4"/><path d="M12 7h.01"/></svg>
            District
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
                style={{ ...styles.navButton, background: 'rgba(226,55,68,0.08)', color: 'rgba(255,255,255,0.6)', fontSize: '13px', padding: '8px 18px', border: '1px solid rgba(226,55,68,0.15)', borderRadius: '10px', gap: '6px' }}
                onClick={handleLogout}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(226,55,68,0.2)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(226,55,68,0.4)'; e.currentTarget.style.boxShadow = '0 0 16px rgba(226,55,68,0.2)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(226,55,68,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.borderColor = 'rgba(226,55,68,0.15)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
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
      {currentPage === 'checkout' && <CheckoutPage />}
      {currentPage === 'tracking' && <TrackingPage />}
      {currentPage === 'hyperpure' && <HyperpurePage />}
      {currentPage === 'district' && <DistrictPage />}

      {/* Login Modal */}
      <LoginModal />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
