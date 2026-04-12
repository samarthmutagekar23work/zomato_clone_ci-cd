import { cities, categories, cuisines, restaurants, menuItems, reviews } from '../data/restaurantData';

describe('Restaurant Data', () => {
  describe('cities', () => {
    test('cities array exists and has items', () => {
      expect(cities).toBeDefined();
      expect(Array.isArray(cities)).toBe(true);
      expect(cities.length).toBeGreaterThan(0);
    });

    test('each city has required properties', () => {
      cities.forEach(city => {
        expect(city).toHaveProperty('id');
        expect(city).toHaveProperty('name');
        expect(city).toHaveProperty('state');
        expect(typeof city.id).toBe('number');
        expect(typeof city.name).toBe('string');
        expect(typeof city.state).toBe('string');
      });
    });

    test('Belgaum city exists', () => {
      const belgaum = cities.find(c => c.name === 'Belgaum');
      expect(belgaum).toBeDefined();
      expect(belgaum.state).toBe('Karnataka');
    });
  });

  describe('categories', () => {
    test('categories array exists and has items', () => {
      expect(categories).toBeDefined();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
    });

    test('each category has required properties', () => {
      categories.forEach(cat => {
        expect(cat).toHaveProperty('id');
        expect(cat).toHaveProperty('name');
        expect(cat).toHaveProperty('icon');
        expect(cat).toHaveProperty('image');
      });
    });
  });

  describe('cuisines', () => {
    test('cuisines array exists and has items', () => {
      expect(cuisines).toBeDefined();
      expect(Array.isArray(cuisines)).toBe(true);
      expect(cities.length).toBeGreaterThan(0);
    });

    test('contains common cuisines', () => {
      expect(cuisines).toContain('North Indian');
      expect(cuisines).toContain('Chinese');
      expect(cuisines).toContain('Pizza');
      expect(cuisines).toContain('Burger');
    });
  });

  describe('restaurants', () => {
    test('restaurants array exists and has items', () => {
      expect(restaurants).toBeDefined();
      expect(Array.isArray(restaurants)).toBe(true);
      expect(restaurants.length).toBeGreaterThan(0);
    });

    test('each restaurant has required properties', () => {
      restaurants.forEach(restaurant => {
        expect(restaurant).toHaveProperty('id');
        expect(restaurant).toHaveProperty('name');
        expect(restaurant).toHaveProperty('rating');
        expect(restaurant).toHaveProperty('cuisine');
        expect(restaurant).toHaveProperty('price');
        expect(restaurant).toHaveProperty('deliveryTime');
        expect(restaurant).toHaveProperty('image');
        expect(restaurant).toHaveProperty('featured');
        expect(restaurant).toHaveProperty('city');
        expect(restaurant).toHaveProperty('address');
        expect(restaurant).toHaveProperty('isOpen');
      });
    });

    test('rating is a number between 0 and 5', () => {
      restaurants.forEach(restaurant => {
        expect(restaurant.rating).toBeGreaterThanOrEqual(0);
        expect(restaurant.rating).toBeLessThanOrEqual(5);
      });
    });

    test('price is a positive number', () => {
      restaurants.forEach(restaurant => {
        expect(restaurant.price).toBeGreaterThan(0);
      });
    });

    test('has featured restaurants', () => {
      const featuredRestaurants = restaurants.filter(r => r.featured);
      expect(featuredRestaurants.length).toBeGreaterThan(0);
    });
  });

  describe('menuItems', () => {
    test('menuItems is an object', () => {
      expect(menuItems).toBeDefined();
      expect(typeof menuItems).toBe('object');
    });

    test('has menu items for restaurants', () => {
      const restaurantIds = Object.keys(menuItems);
      expect(restaurantIds.length).toBeGreaterThan(0);
    });

    test('menu items have required properties', () => {
      Object.values(menuItems).forEach(items => {
        items.forEach(item => {
          expect(item).toHaveProperty('id');
          expect(item).toHaveProperty('name');
          expect(item).toHaveProperty('price');
          expect(item).toHaveProperty('category');
          expect(item).toHaveProperty('isVeg');
        });
      });
    });
  });

  describe('reviews', () => {
    test('reviews is an object', () => {
      expect(reviews).toBeDefined();
      expect(typeof reviews).toBe('object');
    });

    test('reviews have required properties', () => {
      Object.values(reviews).forEach(items => {
        items.forEach(review => {
          expect(review).toHaveProperty('id');
          expect(review).toHaveProperty('user');
          expect(review).toHaveProperty('rating');
          expect(review).toHaveProperty('comment');
          expect(review).toHaveProperty('date');
        });
      });
    });
  });
});
