import { RESTAURANTS } from './restaurants';

const menuTemplates = {
    biryani: [
        { id: 'm1', name: 'Chicken Biryani', price: 320, category: 'Biryani', recommended: true, isVeg: false, isBestSeller: true, description: 'Aromatic basmati rice cooked with tender chicken and authentic spices', imageKeyword: 'biryani' },
        { id: 'm2', name: 'Mutton Biryani', price: 420, category: 'Biryani', recommended: true, isVeg: false, isBestSeller: true, description: 'Slow-cooked mutton biryani with fragrant saffron rice', imageKeyword: 'biryani' },
        { id: 'm3', name: 'Egg Biryani', price: 220, category: 'Biryani', recommended: false, isVeg: false, isBestSeller: false, description: 'Flavorful biryani with boiled eggs and special masala', imageKeyword: 'biryani' },
        { id: 'm4', name: 'Veg Biryani', price: 250, category: 'Biryani', recommended: false, isVeg: true, isBestSeller: false, description: 'Mixed vegetable biryani with aromatic spices', imageKeyword: 'veg-biryani' },
        { id: 'm5', name: 'Chicken 65', price: 180, category: 'Starters', recommended: true, isVeg: false, isBestSeller: true, description: 'Spicy deep-fried chicken cubes with curry leaves', imageKeyword: 'chicken-65' },
        { id: 'm6', name: 'Raita', price: 60, category: 'Sides', recommended: false, isVeg: true, isBestSeller: false, description: 'Cool yogurt sauce with cucumber and spices', imageKeyword: 'idli' },
        { id: 'm7', name: 'Mirchi Ka Salan', price: 120, category: 'Sides', recommended: true, isVeg: true, isBestSeller: false, description: 'Tangy peanut and chili curry, perfect biryani accompaniment', imageKeyword: 'chicken-curry' },
        { id: 'm8', name: 'Gulab Jamun', price: 80, category: 'Desserts', recommended: false, isVeg: true, isBestSeller: true, description: 'Soft milk dumplings in sweet rose syrup', imageKeyword: 'gulab-jamun' }
    ],
    southIndian: [
        { id: 'm9', name: 'Masala Dosa', price: 120, category: 'Dosas', recommended: true, isVeg: true, isBestSeller: true, description: 'Crispy rice crepe filled with spiced potato masala', imageKeyword: 'dosa' },
        { id: 'm10', name: 'Idli Sambar', price: 80, category: 'Idlis & Vadas', recommended: true, isVeg: true, isBestSeller: true, description: 'Steamed rice cakes served with lentil stew', imageKeyword: 'idli' },
        { id: 'm11', name: 'Medu Vada', price: 60, category: 'Idlis & Vadas', recommended: false, isVeg: true, isBestSeller: false, description: 'Crispy fried lentil donuts with chutneys', imageKeyword: 'tandoori' },
        { id: 'm12', name: 'Filter Coffee', price: 40, category: 'Beverages', recommended: true, isVeg: true, isBestSeller: true, description: 'Traditional South Indian strong filter coffee', imageKeyword: 'filter-coffee' },
        { id: 'm13', name: 'Plain Dosa', price: 90, category: 'Dosas', recommended: false, isVeg: true, isBestSeller: false, description: 'Thin crispy rice crepe without filling', imageKeyword: 'dosa' },
        { id: 'm14', name: 'Uttapam', price: 110, category: 'Dosas', recommended: false, isVeg: true, isBestSeller: false, description: 'Thick rice pancake topped with onions and tomatoes', imageKeyword: 'tandoori' },
        { id: 'm15', name: 'Pongal', price: 70, category: 'Rice Varieties', recommended: true, isVeg: true, isBestSeller: false, description: 'Creamy rice and lentil dish tempered with pepper and cumin', imageKeyword: 'thali' },
        { id: 'm16', name: 'Coconut Chutney', price: 30, category: 'Sides', recommended: false, isVeg: true, isBestSeller: false, description: 'Fresh coconut chutney with green chilies', imageKeyword: 'idli' }
    ],
    northIndian: [
        { id: 'm17', name: 'Butter Chicken', price: 320, category: 'Main Course', recommended: true, isVeg: false, isBestSeller: true, description: 'Creamy tomato-based curry with tender tandoori chicken', imageKeyword: 'butter-chicken' },
        { id: 'm18', name: 'Dal Makhani', price: 220, category: 'Main Course', recommended: true, isVeg: true, isBestSeller: true, description: 'Slow-cooked black lentils in buttery cream sauce', imageKeyword: 'dal-makhani' },
        { id: 'm19', name: 'Tandoori Chicken', price: 380, category: 'Tandoor', recommended: true, isVeg: false, isBestSeller: true, description: 'Whole chicken marinated in yogurt and spices, cooked in tandoor', imageKeyword: 'tandoori' },
        { id: 'm20', name: 'Butter Naan', price: 60, category: 'Breads', recommended: false, isVeg: true, isBestSeller: false, description: 'Soft leavened bread brushed with butter from tandoor', imageKeyword: 'butter-naan' },
        { id: 'm21', name: 'Paneer Butter Masala', price: 280, category: 'Main Course', recommended: false, isVeg: true, isBestSeller: false, description: 'Cottage cheese cubes in rich tomato gravy', imageKeyword: 'paneer-tikka' },
        { id: 'm22', name: 'Jeera Rice', price: 150, category: 'Rice', recommended: false, isVeg: true, isBestSeller: false, description: 'Basmati rice tempered with cumin seeds', imageKeyword: 'jeera-rice' },
        { id: 'm23', name: 'Lassi', price: 80, category: 'Beverages', recommended: false, isVeg: true, isBestSeller: true, description: 'Thick yogurt drink, sweet and refreshing', imageKeyword: 'lassi' },
        { id: 'm24', name: 'Rasmalai', price: 120, category: 'Desserts', recommended: false, isVeg: true, isBestSeller: true, description: 'Soft cottage cheese patties in sweetened milk with cardamom', imageKeyword: 'rasmalai' }
    ],
    pizza: [
        { id: 'm25', name: 'Margherita Pizza', price: 280, category: 'Pizzas', recommended: true, isVeg: true, isBestSeller: true, description: 'Classic pizza with fresh mozzarella, tomatoes and basil', imageKeyword: 'pizza' },
        { id: 'm26', name: 'Pepperoni Pizza', price: 350, category: 'Pizzas', recommended: true, isVeg: false, isBestSeller: true, description: 'Loaded with spicy pepperoni and extra cheese', imageKeyword: 'pizza' },
        { id: 'm27', name: 'BBQ Chicken Pizza', price: 380, category: 'Pizzas', recommended: false, isVeg: false, isBestSeller: false, description: 'Grilled chicken with BBQ sauce, onions and peppers', imageKeyword: 'pizza' },
        { id: 'm28', name: 'Veggie Supreme', price: 320, category: 'Pizzas', recommended: false, isVeg: true, isBestSeller: false, description: 'Loaded with mushrooms, olives, peppers and onions', imageKeyword: 'pizza' },
        { id: 'm29', name: 'Garlic Breadsticks', price: 150, category: 'Sides', recommended: true, isVeg: true, isBestSeller: false, description: 'Crispy breadsticks with garlic butter and herbs', imageKeyword: 'bakery' },
        { id: 'm30', name: 'Caesar Salad', price: 180, category: 'Salads', recommended: false, isVeg: true, isBestSeller: false, description: 'Fresh romaine lettuce with Caesar dressing and croutons', imageKeyword: 'tandoori' },
        { id: 'm31', name: 'Coca Cola', price: 60, category: 'Beverages', recommended: false, isVeg: true, isBestSeller: false, description: 'Chilled Coca Cola 300ml', imageKeyword: 'cold-coffee' },
        { id: 'm32', name: 'Chocolate Lava Cake', price: 180, category: 'Desserts', recommended: true, isVeg: true, isBestSeller: true, description: 'Warm chocolate cake with gooey center', imageKeyword: 'cake' }
    ],
    chinese: [
        { id: 'm33', name: 'Hakka Noodles', price: 220, category: 'Noodles', recommended: true, isVeg: false, isBestSeller: true, description: 'Wok-tossed noodles with vegetables and soy sauce', imageKeyword: 'noodles' },
        { id: 'm34', name: 'Chicken Fried Rice', price: 250, category: 'Rice', recommended: true, isVeg: false, isBestSeller: true, description: 'Classic fried rice with chicken and eggs', imageKeyword: 'chicken-fried-rice' },
        { id: 'm35', name: 'Veg Manchurian', price: 180, category: 'Starters', recommended: false, isVeg: true, isBestSeller: true, description: 'Deep-fried vegetable balls in spicy Manchurian sauce', imageKeyword: 'veg-manchurian' },
        { id: 'm36', name: 'Chilli Chicken', price: 280, category: 'Starters', recommended: true, isVeg: false, isBestSeller: true, description: 'Crispy chicken tossed in spicy chilli sauce', imageKeyword: 'chicken-65' },
        { id: 'm37', name: 'Dim Sum Platter', price: 320, category: 'Starters', recommended: true, isVeg: false, isBestSeller: false, description: 'Assorted steamed dumplings with dipping sauces', imageKeyword: 'veg-manchurian' },
        { id: 'm38', name: 'Hot & Sour Soup', price: 150, category: 'Soups', recommended: false, isVeg: false, isBestSeller: false, description: 'Spicy and tangy soup with vegetables and chicken', imageKeyword: 'fish-curry' },
        { id: 'm39', name: 'Spring Rolls', price: 160, category: 'Starters', recommended: false, isVeg: true, isBestSeller: false, description: 'Crispy rolls stuffed with seasoned vegetables', imageKeyword: 'noodles' },
        { id: 'm40', name: 'Green Tea', price: 60, category: 'Beverages', recommended: false, isVeg: true, isBestSeller: false, description: 'Hot green tea, soothing and healthy', imageKeyword: 'filter-coffee' }
    ],
    seafood: [
        { id: 'm41', name: 'Fish Curry Rice', price: 320, category: 'Main Course', recommended: true, isVeg: false, isBestSeller: true, description: 'Fresh fish cooked in tangy coconut curry with steamed rice', imageKeyword: 'fish-curry' },
        { id: 'm42', name: 'Prawn Masala', price: 420, category: 'Main Course', recommended: true, isVeg: false, isBestSeller: true, description: 'Juicy prawns in spicy onion-tomato masala', imageKeyword: 'prawn-curry' },
        { id: 'm43', name: 'Fish Fry', price: 350, category: 'Starters', recommended: true, isVeg: false, isBestSeller: false, description: 'Crispy fried fish with coastal spice coating', imageKeyword: 'fish-curry' },
        { id: 'm44', name: 'Crab Roast', price: 580, category: 'Main Course', recommended: false, isVeg: false, isBestSeller: true, description: 'Whole crab roasted in spicy masala gravy', imageKeyword: 'fish-curry' },
        { id: 'm45', name: 'Appam with Stew', price: 180, category: 'Main Course', recommended: true, isVeg: false, isBestSeller: false, description: 'Lacy rice pancakes with mild coconut stew', imageKeyword: 'idli' },
        { id: 'm46', name: 'Squid Fry', price: 280, category: 'Starters', recommended: false, isVeg: false, isBestSeller: false, description: 'Crispy fried squid rings with pepper seasoning', imageKeyword: 'veg-manchurian' },
        { id: 'm47', name: 'Lemon Rice', price: 120, category: 'Rice', recommended: false, isVeg: true, isBestSeller: false, description: 'Tangy rice tempered with mustard seeds and peanuts', imageKeyword: 'thali' },
        { id: 'm48', name: 'Payasam', price: 80, category: 'Desserts', recommended: false, isVeg: true, isBestSeller: true, description: 'Traditional sweet pudding made with vermicelli', imageKeyword: 'rasmalai' }
    ],
    cafe: [
        { id: 'm49', name: 'Cappuccino', price: 150, category: 'Coffee', recommended: true, isVeg: true, isBestSeller: true, description: 'Classic Italian coffee with steamed milk foam', imageKeyword: 'masala-chai' },
        { id: 'm50', name: 'Avocado Toast', price: 250, category: 'Breakfast', recommended: true, isVeg: true, isBestSeller: true, description: 'Smashed avocado on sourdough with cherry tomatoes', imageKeyword: 'thali' },
        { id: 'm51', name: 'Club Sandwich', price: 220, category: 'Sandwiches', recommended: false, isVeg: false, isBestSeller: false, description: 'Triple-decker sandwich with chicken, bacon and veggies', imageKeyword: 'burger' },
        { id: 'm52', name: 'Pasta Aglio e Olio', price: 280, category: 'Pasta', recommended: false, isVeg: true, isBestSeller: false, description: 'Spaghetti with garlic, olive oil and red chili flakes', imageKeyword: 'pasta' },
        { id: 'm53', name: 'Croissant', price: 120, category: 'Bakery', recommended: true, isVeg: true, isBestSeller: false, description: 'Buttery flaky French pastry', imageKeyword: 'bakery' },
        { id: 'm54', name: 'Cold Coffee', price: 180, category: 'Beverages', recommended: false, isVeg: true, isBestSeller: true, description: 'Blended iced coffee with vanilla ice cream', imageKeyword: 'cold-coffee' },
        { id: 'm55', name: 'Chocolate Brownie', price: 160, category: 'Desserts', recommended: true, isVeg: true, isBestSeller: true, description: 'Rich fudgy brownie with walnuts', imageKeyword: 'cake' },
        { id: 'm56', name: 'Caesar Salad', price: 200, category: 'Salads', recommended: false, isVeg: false, isBestSeller: false, description: 'Grilled chicken with romaine and Caesar dressing', imageKeyword: 'tandoori' }
    ],
    streetFood: [
        { id: 'm57', name: 'Pani Puri', price: 60, category: 'Chaat', recommended: true, isVeg: true, isBestSeller: true, description: 'Crispy hollow puris filled with spiced tangy water', imageKeyword: 'pani-puri' },
        { id: 'm58', name: 'Papdi Chaat', price: 80, category: 'Chaat', recommended: true, isVeg: true, isBestSeller: true, description: 'Crispy wafers topped with yogurt, chutneys and sev', imageKeyword: 'papdi-chaat' },
        { id: 'm59', name: 'Vada Pav', price: 50, category: 'Street Favorites', recommended: true, isVeg: true, isBestSeller: true, description: 'Mumbai\'s favorite potato fritter burger', imageKeyword: 'pani-puri' },
        { id: 'm60', name: 'Dahi Puri', price: 70, category: 'Chaat', recommended: false, isVeg: true, isBestSeller: false, description: 'Crispy puris filled with yogurt and sweet chutney', imageKeyword: 'pani-puri' },
        { id: 'm61', name: 'Aloo Tikki', price: 60, category: 'Street Favorites', recommended: false, isVeg: true, isBestSeller: false, description: 'Spiced potato patties with chutneys', imageKeyword: 'tandoori' },
        { id: 'm62', name: 'Bhel Puri', price: 70, category: 'Chaat', recommended: false, isVeg: true, isBestSeller: false, description: 'Puffed rice mixed with vegetables and tangy sauces', imageKeyword: 'thali' },
        { id: 'm63', name: 'Masala Chai', price: 40, category: 'Beverages', recommended: true, isVeg: true, isBestSeller: true, description: 'Spiced Indian tea with milk', imageKeyword: 'masala-chai' },
        { id: 'm64', name: 'Jalebi', price: 50, category: 'Desserts', recommended: false, isVeg: true, isBestSeller: true, description: 'Crispy spiral sweets soaked in sugar syrup', imageKeyword: 'gajar-halwa' }
    ],
    thali: [
        { id: 'm65', name: 'Unlimited Thali', price: 350, category: 'Thalis', recommended: true, isVeg: true, isBestSeller: true, description: 'Unlimited Gujarati thali with 5 rotis, 2 sabzis, dal, rice and dessert', imageKeyword: 'thali' },
        { id: 'm66', name: 'Royal Thali', price: 400, category: 'Thalis', recommended: true, isVeg: true, isBestSeller: true, description: 'Premium Rajasthani thali with dal baati churma and more', imageKeyword: 'thali' },
        { id: 'm67', name: 'Dhokla', price: 80, category: 'Farsan', recommended: true, isVeg: true, isBestSeller: true, description: 'Steamed fermented rice and chickpea cake', imageKeyword: 'tandoori' },
        { id: 'm68', name: 'Khandvi', price: 90, category: 'Farsan', recommended: false, isVeg: true, isBestSeller: false, description: 'Delicate gram flour rolls with coconut tempering', imageKeyword: 'noodles' },
        { id: 'm69', name: 'Undhiyu', price: 180, category: 'Special', recommended: true, isVeg: true, isBestSeller: true, description: 'Mixed vegetable casserole, Gujarati specialty', imageKeyword: 'thali' },
        { id: 'm70', name: 'Chaas', price: 40, category: 'Beverages', recommended: false, isVeg: true, isBestSeller: false, description: 'Spiced buttermilk with cumin and mint', imageKeyword: 'lassi' },
        { id: 'm71', name: 'Shrikhand', price: 100, category: 'Desserts', recommended: true, isVeg: true, isBestSeller: true, description: 'Sweet strained yogurt flavored with cardamom and saffron', imageKeyword: 'rasmalai' },
        { id: 'm72', name: 'Mohanthal', price: 90, category: 'Desserts', recommended: false, isVeg: true, isBestSeller: false, description: 'Traditional Gujarati gram flour fudge', imageKeyword: 'gajar-halwa' }
    ],
    mughlai: [
        { id: 'm73', name: 'Chicken Biryani', price: 350, category: 'Biryani', recommended: true, isVeg: false, isBestSeller: true, description: 'Hyderabadi style dum biryani with aromatic spices', imageKeyword: 'biryani' },
        { id: 'm74', name: 'Mutton Keema', price: 380, category: 'Main Course', recommended: true, isVeg: false, isBestSeller: true, description: 'Minced mutton cooked with peas and spices', imageKeyword: 'chicken-curry' },
        { id: 'm75', name: 'Seekh Kebab', price: 280, category: 'Kebabs', recommended: true, isVeg: false, isBestSeller: true, description: 'Minced meat kebabs grilled in tandoor', imageKeyword: 'tandoori' },
        { id: 'm76', name: 'Butter Chicken', price: 320, category: 'Main Course', recommended: false, isVeg: false, isBestSeller: false, description: 'Tandoori chicken in rich buttery tomato gravy', imageKeyword: 'butter-chicken' },
        { id: 'm77', name: 'Roomali Roti', price: 50, category: 'Breads', recommended: false, isVeg: true, isBestSeller: false, description: 'Paper-thin handkerchief bread from tandoor', imageKeyword: 'naan' },
        { id: 'm78', name: 'Haleem', price: 320, category: 'Special', recommended: true, isVeg: false, isBestSeller: true, description: 'Slow-cooked stew of wheat, lentils and meat', imageKeyword: 'dal-makhani' },
        { id: 'm79', name: 'Sheermal', price: 60, category: 'Breads', recommended: false, isVeg: true, isBestSeller: false, description: 'Saffron-flavored sweet bread', imageKeyword: 'naan' },
        { id: 'm80', name: 'Firni', price: 100, category: 'Desserts', recommended: false, isVeg: true, isBestSeller: true, description: 'Ground rice pudding with rose water and nuts', imageKeyword: 'rasmalai' }
    ],
    bakery: [
        { id: 'm81', name: 'Chocolate Truffle Cake', price: 450, category: 'Cakes', recommended: true, isVeg: true, isBestSeller: true, description: 'Rich chocolate cake with ganache glaze', imageKeyword: 'cake' },
        { id: 'm82', name: 'Croissant', price: 120, category: 'Pastries', recommended: true, isVeg: true, isBestSeller: true, description: 'Buttery flaky French pastry', imageKeyword: 'bakery' },
        { id: 'm83', name: 'Sourdough Bread', price: 180, category: 'Breads', recommended: false, isVeg: true, isBestSeller: false, description: 'Artisanal fermented bread with crispy crust', imageKeyword: 'bakery' },
        { id: 'm84', name: 'Chicken Quiche', price: 250, category: 'Savory', recommended: false, isVeg: false, isBestSeller: false, description: 'Savory tart with chicken, cheese and herbs', imageKeyword: 'pizza' },
        { id: 'm85', name: 'Swiss Roll', price: 180, category: 'Pastries', recommended: true, isVeg: true, isBestSeller: false, description: 'Sponge cake roll with cream filling', imageKeyword: 'bakery' },
        { id: 'm86', name: 'Cappuccino', price: 150, category: 'Beverages', recommended: false, isVeg: true, isBestSeller: true, description: 'Classic Italian coffee with steamed milk foam', imageKeyword: 'masala-chai' },
        { id: 'm87', name: 'Cinnamon Roll', price: 140, category: 'Pastries', recommended: false, isVeg: true, isBestSeller: false, description: 'Sweet roll with cinnamon sugar and icing', imageKeyword: 'bakery' },
        { id: 'm88', name: 'Tiramisu', price: 280, category: 'Desserts', recommended: true, isVeg: true, isBestSeller: true, description: 'Classic Italian coffee-flavored dessert', imageKeyword: 'cake' }
    ]
};

function getMenuForRestaurant(restaurant) {
    const cuisines = restaurant.cuisines.map(c => c.toLowerCase());
    const name = restaurant.name.toLowerCase();

    if (cuisines.some(c => c.includes('biryani') || c.includes('hyderabadi'))) return menuTemplates.biryani;
    if (cuisines.some(c => c.includes('south indian'))) return menuTemplates.southIndian;
    if (cuisines.some(c => c.includes('north indian') || c.includes('punjabi') || c.includes('mughlai') || c.includes('kebab'))) return menuTemplates.northIndian;
    if (cuisines.some(c => c.includes('pizza') || c.includes('italian'))) return menuTemplates.pizza;
    if (cuisines.some(c => c.includes('chinese') || c.includes('thai') || c.includes('asian'))) return menuTemplates.chinese;
    if (cuisines.some(c => c.includes('seafood') || c.includes('coastal') || c.includes('fish'))) return menuTemplates.seafood;
    if (cuisines.some(c => c.includes('cafe') || c.includes('bakery') || c.includes('continental'))) return menuTemplates.cafe;
    if (cuisines.some(c => c.includes('street food') || c.includes('chaat'))) return menuTemplates.streetFood;
    if (cuisines.some(c => c.includes('gujarati') || c.includes('rajasthani') || c.includes('thali'))) return menuTemplates.thali;
    if (cuisines.some(c => c.includes('mughlai') || c.includes('kebabs'))) return menuTemplates.mughlai;
    if (name.includes('bakery') || name.includes('bakehouse') || name.includes('cake')) return menuTemplates.bakery;

    return menuTemplates.northIndian;
}

export const MENU_DATA = {};
RESTAURANTS.forEach(r => { MENU_DATA[r.id] = getMenuForRestaurant(r); });
