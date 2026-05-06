import { ALLOWED_API_DOMAINS } from './constants';

export const isAllowedDomain = (url) => {
    try { return ALLOWED_API_DOMAINS.includes(new URL(url).hostname); }
    catch (e) { console.warn('URL parsing error:', e); return false; }
};

export const sanitizeSearchQuery = (input) => input.replace(/[<>"&]/g, '').trim().slice(0, 100);

export const safeStorage = {
    get: (key) => { try { return localStorage.getItem(key); } catch (e) { console.warn('Storage get error:', e); return null; } },
    set: (key, value) => { try { localStorage.setItem(key, value); } catch (e) { console.warn('Storage set error:', e); } },
    getJSON: (key, fallback) => {
        try { const val = localStorage.getItem(key); return val ? JSON.parse(val) : fallback; }
        catch (e) { console.warn('Storage getJSON error:', e); return fallback; }
    },
    setJSON: (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { console.warn('Storage setJSON error:', e); } }
};

export const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'green';
    if (rating >= 4.0) return 'yellow';
    return 'red';
};

const RESTAURANT_PHOTOS = [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1467446884851-400897639765?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&h=400&fit=crop',
];

const MUMBAI_RESTAURANT_PHOTOS = [
    'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/2442882/pexels-photo-2442882.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/9635051/pexels-photo-9635051.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/7253611/pexels-photo-7253611.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/5560791/pexels-photo-5560791.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/9635050/pexels-photo-9635050.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/2347313/pexels-photo-2347313.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/2442883/pexels-photo-2442883.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
];

export const getRestaurantImage = (restaurant) => {
    const idNum = parseInt(restaurant.id?.replace('r', '') || '1');
    if (restaurant.city === 'Mumbai') {
        return MUMBAI_RESTAURANT_PHOTOS[(idNum - 1) % MUMBAI_RESTAURANT_PHOTOS.length];
    }
    return RESTAURANT_PHOTOS[(idNum - 1) % RESTAURANT_PHOTOS.length];
};

export const CITY_FALLBACK_COLORS = {
    'Bangalore': ['#E23744', '#f87171'],
    'Mumbai': ['#3B82F6', '#60A5FA'],
    'Delhi': ['#F59E0B', '#FBBF24'],
    'Pune': ['#10B981', '#34D399'],
    'Hyderabad': ['#8B5CF6', '#A78BFA'],
    'Chennai': ['#EC4899', '#F472B6'],
    'Kolkata': ['#06B6D4', '#22D3EE'],
    'Ahmedabad': ['#F97316', '#FB923C'],
};

const CITY_IMAGES = {
    'Bangalore': 'https://images.pexels.com/photos/3889820/pexels-photo-3889820.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    'Mumbai': 'https://images.pexels.com/photos/26595923/pexels-photo-26595923.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    'Delhi': 'https://images.pexels.com/photos/30915614/pexels-photo-30915614.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    'Pune': 'https://images.pexels.com/photos/18455701/pexels-photo-18455701.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    'Hyderabad': 'https://images.pexels.com/photos/1888730/pexels-photo-1888730.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    'Chennai': 'https://images.pexels.com/photos/1486223/pexels-photo-1486223.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    'Kolkata': 'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    'Ahmedabad': 'https://images.pexels.com/photos/14036706/pexels-photo-14036706.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
};

export const getCityImage = (cityName) => {
  return CITY_IMAGES[cityName] || CITY_IMAGES['Bangalore'];
};

const CUISINE_IMAGES = {
    'Biryani': 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=400&fit=crop',
    'Pizza': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop',
    'Burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop',
    'Chinese': 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400&h=400&fit=crop',
    'South Indian': 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=400&fit=crop',
    'North Indian': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=400&fit=crop',
    'Desserts': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop',
    'Beverages': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop',
};

export const getCuisineImage = (cuisineName) => CUISINE_IMAGES[cuisineName] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop';

const MENU_ITEM_IMAGES = {
    'butter-chicken': 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop',
    'paneer-tikka': 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop',
    'biryani': 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop',
    'dosa': 'https://images.unsplash.com/photo-1589302168065-03bcec13f946?w=400&h=300&fit=crop',
    'tandoori': 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=400&h=300&fit=crop',
    'naan': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
    'jeera-rice': 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop',
    'gulab-jamun': 'https://images.unsplash.com/photo-1593455589668-b8e91241961d?w=400&h=300&fit=crop',
    'lassi': 'https://images.unsplash.com/photo-1627217439970-1c0f5c8e6c5c?w=400&h=300&fit=crop',
    'fish-curry': 'https://images.unsplash.com/photo-1606491180646-05c88d3c0e84?w=400&h=300&fit=crop',
    'idli': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=300&fit=crop',
    'chicken-65': 'https://images.unsplash.com/photo-1610053498689-25627c4a4b49?w=400&h=300&fit=crop',
    'dal-makhani': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    'tandoori-roti': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
    'rasmalai': 'https://images.unsplash.com/photo-1666190077420-36e07b536a5d?w=400&h=300&fit=crop',
    'masala-chai': 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop',
    'prawn-curry': 'https://images.unsplash.com/photo-1625398407796-82660a8a754d?w=400&h=300&fit=crop',
    'veg-manchurian': 'https://images.unsplash.com/photo-1567337710282-00832b415977?w=400&h=300&fit=crop',
    'chicken-fried-rice': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
    'parotta': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
    'kulfi': 'https://images.unsplash.com/photo-1629117625099-90b5e4e5e5c1?w=400&h=300&fit=crop',
    'filter-coffee': 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&h=300&fit=crop',
    'mutton-rogan-josh': 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop',
    'hara-bhara-kabab': 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop',
    'butter-naan': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
    'gajar-halwa': 'https://images.unsplash.com/photo-1666190077420-9075381b3c5e?w=400&h=300&fit=crop',
    'mango-lassi': 'https://images.unsplash.com/photo-1627217439970-1c0f5c8e6c5c?w=400&h=300&fit=crop',
    'pani-puri': 'https://images.unsplash.com/photo-1601050690117-94f5fa6b5c6d?w=400&h=300&fit=crop',
    'chicken-curry': 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop',
    'veg-biryani': 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop',
    'papdi-chaat': 'https://images.unsplash.com/photo-1606491180646-05c88d3c0e84?w=400&h=300&fit=crop',
    'cold-coffee': 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop',
    'gulab-jamun-icecream': 'https://images.unsplash.com/photo-1593455589668-b8e91241961d?w=400&h=300&fit=crop',
    'lemon-mint-mojito': 'https://images.unsplash.com/photo-1513558161293-cdaf27b5c65e?w=400&h=300&fit=crop',
    'indian food': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
};

export const getMenuItemImage = (imageKeyword) => {
    return MENU_ITEM_IMAGES[imageKeyword] || MENU_ITEM_IMAGES['indian food'];
};
