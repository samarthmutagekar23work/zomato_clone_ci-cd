const { useState, useEffect, useMemo, useCallback, useRef } = React;

// ==================== CONSTANTS (SonarQube S1192) ====================
const RATING_THRESHOLDS = {
    EXCELLENT: 4.5,
    GOOD: 4.0,
    AVERAGE: 3.5,
};

const ALLOWED_API_DOMAINS = [
    'nominatim.openstreetmap.org',
    'overpass-api.de',
    'www.themealdb.com',
    'source.unsplash.com',
    'api.dicebear.com',
    'ipapi.co',
];

const CUISINE_KEYWORDS = {
    'Biryani': 'biryani-rice-indian',
    'Pizza': 'pizza-italian-cheese',
    'Burger': 'burger-american-food',
    'Chinese': 'chinese-noodles-asian',
    'South Indian': 'dosa-idli-sambar',
    'North Indian': 'curry-naan-paneer',
    'Seafood': 'fish-curry-seafood',
    'Desserts': 'gulab-jamun-dessert',
    'Beverages': 'lassi-chai-drink',
    'Fast Food': 'sandwich-snack-food',
    'Cafe': 'coffee-cafe-pastry',
    'default': 'indian-food-restaurant',
};

const CUISINE_EMOJIS = {
    'Biryani': '🍚', 'Pizza': '🍕', 'Burger': '🍔', 'Chinese': '🥡', 'South Indian': '🥘',
    'North Indian': '🍛', 'Japanese': '🍣', 'Desserts': '🍰', 'Salads': '🥗', 'Beverages': '🥤',
    'Seafood': '🦞', 'Fast Food': '🍟', 'Continental': '🍽', 'Italian': '🍝', 'Mughlai': '🍖',
    'Parsi': '🥘', 'American': '🍔', 'Thai': '🍜', 'Hyderabadi': '🍚', 'BBQ': '🔥',
    'Bakery': '🥖', 'Coffee': '☕', 'Brewery': '🍺', 'Bar': '🍸', 'Asian': '🍜', 'Beer': '🍺',
    'Punjabi': '🍛', 'Coastal': '🦐', 'Cafe': '☕', 'Buffet': '🍽', 'Molecular': '🧪', 'Paratha': '🥘',
    'Kebab': '🍢', 'Vegetarian': '🥗', 'Street Food': '🍟', 'Sweets': '🍬', 'Ice Cream': '🍨',
};

const CITIES = ['Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad'];

const COUPONS = {
    'WELCOME50': { type: 'percent', value: 50, maxDiscount: 100, minOrder: 0 },
    'FLAT100': { type: 'flat', value: 100, minOrder: 500 },
    'FREEDEL': { type: 'delivery', value: 0, minOrder: 199 },
    'FIRSTORDER': { type: 'percent', value: 30, maxDiscount: 150, minOrder: 200 },
};
