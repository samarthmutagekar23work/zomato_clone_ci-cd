import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CartPage from '../pages/CartPage/CartPage';
import { AppProvider } from '../context/AppContext';

jest.mock('react-transition-group', () => ({
  CSSTransition: ({ children }) => children,
}));

const TestWrapper = ({ children }) => (
  <AppProvider>
    <BrowserRouter>
      {children}
    </BrowserRouter>
  </AppProvider>
);

const renderWithProviders = (ui) => {
  return render(ui, { wrapper: TestWrapper });
};

describe('CartPage Component', () => {
  test('renders empty cart message when cart is empty', () => {
    renderWithProviders(<CartPage />);
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.getByText('Add items from restaurants to get started')).toBeInTheDocument();
  });

  test('renders browse restaurants button in empty cart', () => {
    renderWithProviders(<CartPage />);
    expect(screen.getByText('Browse Restaurants')).toBeInTheDocument();
  });

  test('renders cart page container', () => {
    const { container } = renderWithProviders(<CartPage />);
    expect(container.querySelector('.cart-page')).toBeInTheDocument();
  });

  test('renders empty cart container', () => {
    const { container } = renderWithProviders(<CartPage />);
    expect(container.querySelector('.empty-cart')).toBeInTheDocument();
  });

  test('renders shopping cart icon in empty state', () => {
    renderWithProviders(<CartPage />);
    const icon = document.querySelector('.empty-icon');
    expect(icon).toBeInTheDocument();
  });
});
