export const RATING_THRESHOLDS = { EXCELLENT: 4.5, GOOD: 4.0, AVERAGE: 3.5 };

export const ALLOWED_API_DOMAINS = [
    'nominatim.openstreetmap.org', 'overpass-api.de', 'www.themealdb.com',
    'images.unsplash.com', 'api.dicebear.com', 'ipapi.co'
];

export const CUISINE_KEYWORDS = {
    'Biryani': 'biryani-rice-indian', 'Pizza': 'pizza-italian-cheese',
    'Burger': 'burger-american-food', 'Chinese': 'chinese-noodles-asian',
    'South Indian': 'dosa-idli-sambar', 'North Indian': 'curry-naan-paneer',
    'Seafood': 'fish-curry-seafood', 'Desserts': 'gulab-jamun-dessert',
    'Beverages': 'lassi-chai-drink', 'Fast Food': 'sandwich-snack-food',
    'Cafe': 'coffee-cafe-pastry', 'default': 'indian-food-restaurant'
};

export const CUISINE_EMOJIS = {
    'Biryani': '🍚', 'Pizza': '🍕', 'Burger': '🍔', 'Chinese': '🥡', 'South Indian': '🥘',
    'North Indian': '🍛', 'Japanese': '🍣', 'Desserts': '🍰', 'Salads': '🥗', 'Beverages': '🥤',
    'Seafood': '🦞', 'Fast Food': '🍟', 'Continental': '🍽', 'Italian': '🍝', 'Mughlai': '🍖',
    'Parsi': '🥘', 'American': '🍔', 'Thai': '🍜', 'Hyderabadi': '🍚', 'BBQ': '🔥',
    'Bakery': '🥖', 'Coffee': '☕', 'Brewery': '🍺', 'Bar': '🍸', 'Asian': '🍜', 'Beer': '🍺',
    'Punjabi': '🍛', 'Coastal': '🦐', 'Cafe': '☕', 'Buffet': '🍽', 'Molecular': '🧪', 'Paratha': '🥘',
    'Kebab': '🍢', 'Vegetarian': '🥗', 'Street Food': '🍟', 'Sweets': '🍬', 'Ice Cream': '🍨',
};

export const CITIES = ['Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad'];

export const COUPONS = {
    'SAVE20': { code: 'SAVE20', discount: 0.20, label: '20% off up to ₹100' },
    'WELCOME50': { code: 'WELCOME50', discount: 0.50, label: '50% off for new users' },
    'FIRST100': { code: 'FIRST100', discount: 0.15, label: '₹100 off on orders above ₹500' },
};
