import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CheckoutPage from '../pages/CheckoutPage/CheckoutPage';
import { AppProvider } from '../context/AppContext';

jest.mock('react-transition-group', () => ({
  CSSTransition: ({ children }) => children,
}));

const mockCartItem = {
  id: 1,
  restaurantId: 'r1',
  restaurantName: 'Test Restaurant',
  name: 'Test Item',
  price: 250,
  quantity: 2,
  isVeg: true,
};

const renderWithProviders = (ui, { cartItems = [] } = {}) => {
  return render(
    <AppProvider cartItems={cartItems}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </AppProvider>
  );
};

describe('CheckoutPage Component', () => {
  test('renders checkout page container', () => {
    const { container } = renderWithProviders(<CheckoutPage />, { cartItems: [mockCartItem] });
    expect(container.querySelector('.checkout-page')).toBeInTheDocument();
  });

  test('renders checkout container', () => {
    const { container } = renderWithProviders(<CheckoutPage />, { cartItems: [mockCartItem] });
    expect(container.querySelector('.checkout-container')).toBeInTheDocument();
  });

  test('renders steps indicator', () => {
    const { container } = renderWithProviders(<CheckoutPage />, { cartItems: [mockCartItem] });
    expect(container.querySelector('.steps')).toBeInTheDocument();
  });

  test('renders checkout main section', () => {
    const { container } = renderWithProviders(<CheckoutPage />, { cartItems: [mockCartItem] });
    expect(container.querySelector('.checkout-main')).toBeInTheDocument();
  });

  test('renders order summary section', () => {
    const { container } = renderWithProviders(<CheckoutPage />, { cartItems: [mockCartItem] });
    expect(container.querySelector('.order-summary')).toBeInTheDocument();
  });
});
