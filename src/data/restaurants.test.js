import { restaurants } from './restaurants';

describe('restaurants data', () => {
  test('restaurants array exists and is not empty', () => {
    expect(restaurants).toBeDefined();
    expect(Array.isArray(restaurants)).toBe(true);
    expect(restaurants.length).toBeGreaterThan(0);
  });

  test('each restaurant has required fields', () => {
    restaurants.forEach(restaurant => {
      expect(restaurant).toHaveProperty('id');
      expect(restaurant).toHaveProperty('name');
      expect(restaurant).toHaveProperty('image');
      expect(restaurant).toHaveProperty('cuisine');
      expect(restaurant).toHaveProperty('rating');
      expect(restaurant).toHaveProperty('reviews');
      expect(restaurant).toHaveProperty('deliveryTime');
      expect(restaurant).toHaveProperty('minOrder');
      expect(restaurant).toHaveProperty('distance');
      expect(restaurant).toHaveProperty('offer');
      expect(restaurant).toHaveProperty('isVeg');
      expect(restaurant).toHaveProperty('costForTwo');
      expect(restaurant).toHaveProperty('menu');
    });
  });

  test('each restaurant has valid menu items', () => {
    restaurants.forEach(restaurant => {
      expect(Array.isArray(restaurant.menu)).toBe(true);
      expect(restaurant.menu.length).toBeGreaterThan(0);
      
      restaurant.menu.forEach(item => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('name');
        expect(item).toHaveProperty('description');
        expect(item).toHaveProperty('price');
        expect(item).toHaveProperty('image');
        expect(item).toHaveProperty('category');
        expect(item).toHaveProperty('isVeg');
        expect(item.isPopular !== undefined || item.isIsPopular !== undefined).toBe(true);
        expect(item).toHaveProperty('rating');
      });
    });
  });

  test('ratings are within valid range', () => {
    restaurants.forEach(restaurant => {
      expect(restaurant.rating).toBeGreaterThanOrEqual(0);
      expect(restaurant.rating).toBeLessThanOrEqual(5);
    });
  });
});
