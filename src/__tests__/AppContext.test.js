import '@testing-library/jest-dom';
import { render, act, fireEvent } from '@testing-library/react';
import React from 'react';
import { AppProvider, useApp } from '../context/AppContext';

jest.spyOn(Storage.prototype, 'getItem');
jest.spyOn(Storage.prototype, 'setItem');

const mockGetItem = (key) => {
  const store = { selectedCity: '', cart: '[]' };
  return store[key] || null;
};

beforeEach(() => {
  localStorage.getItem.mockImplementation(mockGetItem);
  localStorage.setItem.mockClear();
});

const TestComponent = ({ callback }) => {
  const context = useApp();
  React.useEffect(() => {
    if (callback) callback(context);
  }, [context, callback]);
  return <div data-testid="context-value">{JSON.stringify(context)}</div>;
};

const renderWithContext = (callback) => {
  return render(
    <AppProvider>
      <TestComponent callback={callback} />
    </AppProvider>
  );
};

describe('AppContext - useApp Hook', () => {
  test('provides initial state', () => {
    const { container } = renderWithContext();
    expect(container.querySelector('[data-testid="context-value"]')).toBeInTheDocument();
  });

  test('addToCart adds new item', () => {
    let context;
    renderWithContext((ctx) => { context = ctx; });
    act(() => {
      context.addToCart({ id: 1, name: 'Pizza', price: 299 }, 'r1', 'Test Restaurant');
    });
    expect(context.cart.length).toBe(1);
    expect(context.cart[0].quantity).toBe(1);
  });

  test('addToCart increments quantity for existing item', () => {
    let context;
    renderWithContext((ctx) => { context = ctx; });
    act(() => {
      context.addToCart({ id: 1, name: 'Pizza', price: 299 }, 'r1', 'Test Restaurant');
      context.addToCart({ id: 1, name: 'Pizza', price: 299 }, 'r1', 'Test Restaurant');
    });
    expect(context.cart.length).toBe(1);
    expect(context.cart[0].quantity).toBe(2);
  });

  test('removeFromCart removes item', () => {
    let context;
    renderWithContext((ctx) => { context = ctx; });
    act(() => {
      context.addToCart({ id: 1, name: 'Pizza', price: 299 }, 'r1', 'Test Restaurant');
    });
    expect(context.cart.length).toBe(1);
    act(() => {
      context.removeFromCart({ id: 1, restaurantId: 'r1' });
    });
    expect(context.cart.length).toBe(0);
  });

  test('updateQuantity changes quantity', () => {
    let context;
    renderWithContext((ctx) => { context = ctx; });
    act(() => {
      context.addToCart({ id: 1, name: 'Pizza', price: 299 }, 'r1', 'Test Restaurant');
      context.updateQuantity({ id: 1, restaurantId: 'r1' }, 5);
    });
    expect(context.cart[0].quantity).toBe(5);
  });

  test('updateQuantity to 0 removes item', () => {
    let context;
    renderWithContext((ctx) => { context = ctx; });
    act(() => {
      context.addToCart({ id: 1, name: 'Pizza', price: 299 }, 'r1', 'Test Restaurant');
      context.updateQuantity({ id: 1, restaurantId: 'r1' }, 0);
    });
    expect(context.cart.length).toBe(0);
  });

  test('clearCart empties cart', () => {
    let context;
    renderWithContext((ctx) => { context = ctx; });
    act(() => {
      context.addToCart({ id: 1, name: 'Pizza', price: 299 }, 'r1', 'Test Restaurant');
      context.clearCart();
    });
    expect(context.cart.length).toBe(0);
  });

  test('getCartTotal calculates total', () => {
    let context;
    renderWithContext((ctx) => { context = ctx; });
    act(() => {
      context.addToCart({ id: 1, name: 'Pizza', price: 299 }, 'r1', 'Test Restaurant');
      context.addToCart({ id: 2, name: 'Burger', price: 199 }, 'r1', 'Test Restaurant');
    });
    expect(context.getCartTotal()).toBe(498);
  });

  test('getCartItemCount returns correct count', () => {
    let context;
    renderWithContext((ctx) => { context = ctx; });
    act(() => {
      context.addToCart({ id: 1, name: 'Pizza', price: 299 }, 'r1', 'Test Restaurant');
      context.addToCart({ id: 2, name: 'Burger', price: 199 }, 'r1', 'Test Restaurant');
    });
    expect(context.getCartItemCount()).toBe(2);
  });

  test('setCity updates city', () => {
    let context;
    renderWithContext((ctx) => { context = ctx; });
    act(() => {
      context.setCity('Bangalore');
    });
    expect(context.city).toBe('Bangalore');
  });

  test('setSearchQuery updates query', () => {
    let context;
    renderWithContext((ctx) => { context = ctx; });
    act(() => {
      context.setSearchQuery('Pizza');
    });
    expect(context.searchQuery).toBe('Pizza');
  });

  test('setFilters updates filters', () => {
    let context;
    renderWithContext((ctx) => { context = ctx; });
    act(() => {
      context.setFilters({ rating: 4 });
    });
    expect(context.filters.rating).toBe(4);
  });

  test('resetFilters resets to default', () => {
    let context;
    renderWithContext((ctx) => { context = ctx; });
    act(() => {
      context.setFilters({ rating: 4, cuisine: 'Italian' });
      context.resetFilters();
    });
    expect(context.filters.rating).toBe(0);
    expect(context.filters.cuisine).toBe('');
  });
});
