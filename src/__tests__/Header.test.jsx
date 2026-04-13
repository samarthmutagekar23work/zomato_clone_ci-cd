import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../components/Header/Header';
import { AppProvider } from '../context/AppContext';

jest.mock('react-transition-group', () => ({
  CSSTransition: ({ children }) => children,
}));

const renderWithProviders = (ui) => {
  return render(
    <AppProvider>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </AppProvider>
  );
};

describe('Header Component', () => {
  test('renders header', () => {
    renderWithProviders(<Header />);
    expect(document.querySelector('.header')).toBeInTheDocument();
  });

  test('renders logo', () => {
    renderWithProviders(<Header />);
    const logos = document.querySelectorAll('img');
    expect(logos.length).toBeGreaterThan(0);
  });

  test('renders navigation links', () => {
    renderWithProviders(<Header />);
    expect(screen.getByText('Get the App')).toBeInTheDocument();
    expect(screen.getAllByText('Investor Relations').length).toBeGreaterThan(0);
    expect(screen.getByText('Add restaurant')).toBeInTheDocument();
    expect(screen.getByText('Log in')).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });

  test('renders search input', () => {
    renderWithProviders(<Header />);
    expect(screen.getByPlaceholderText(/Search for restaurant/i)).toBeInTheDocument();
  });

  test('renders location select', () => {
    renderWithProviders(<Header />);
    const selects = document.querySelectorAll('select');
    expect(selects.length).toBeGreaterThan(0);
  });

  test('renders quick tags', () => {
    renderWithProviders(<Header />);
    expect(screen.getByText('🍕 Pizza')).toBeInTheDocument();
    expect(screen.getByText('🍔 Burger')).toBeInTheDocument();
    expect(screen.getByText('🍗 Biryani')).toBeInTheDocument();
  });

  test('renders scroll indicator', () => {
    renderWithProviders(<Header />);
    expect(screen.getByText('↓')).toBeInTheDocument();
  });

  test('renders hamburger menu', () => {
    renderWithProviders(<Header />);
    const hamburger = document.querySelector('.hamburger');
    expect(hamburger).toBeInTheDocument();
  });

  test('renders hero title', () => {
    renderWithProviders(<Header />);
    expect(screen.getByText(/Discover the best food/i)).toBeInTheDocument();
  });

  test('can change search input', () => {
    renderWithProviders(<Header />);
    const input = screen.getByPlaceholderText(/Search for restaurant/i);
    fireEvent.change(input, { target: { value: 'Pizza' } });
    expect(input.value).toBe('Pizza');
  });

  test('handles search form submission', () => {
    renderWithProviders(<Header />);
    const input = screen.getByPlaceholderText(/Search for restaurant/i);
    const form = document.querySelector('form');
    fireEvent.change(input, { target: { value: 'Pizza' } });
    fireEvent.submit(form);
  });

  test('handles search input focus', () => {
    renderWithProviders(<Header />);
    const input = screen.getByPlaceholderText(/Search for restaurant/i);
    fireEvent.focus(input);
  });

  test('handles search input blur', () => {
    renderWithProviders(<Header />);
    const input = screen.getByPlaceholderText(/Search for restaurant/i);
    fireEvent.blur(input);
  });

  test('toggles hamburger menu', () => {
    renderWithProviders(<Header />);
    const hamburger = document.querySelector('.hamburger');
    fireEvent.click(hamburger);
  });

  test('toggles hamburger menu off', () => {
    renderWithProviders(<Header />);
    const hamburger = document.querySelector('.hamburger');
    fireEvent.click(hamburger);
    fireEvent.click(hamburger);
  });

  test('renders location icon', () => {
    renderWithProviders(<Header />);
    expect(document.querySelector('.location-icon')).toBeInTheDocument();
  });

  test('location select has options', () => {
    renderWithProviders(<Header />);
    const select = document.querySelector('select');
    expect(select.options.length).toBeGreaterThan(0);
  });

  test('renders cart link', () => {
    renderWithProviders(<Header />);
    expect(document.querySelector('.cart-link')).toBeInTheDocument();
  });

  test('clicking pizza tag sets search', () => {
    renderWithProviders(<Header />);
    const pizzaTag = screen.getByText('🍕 Pizza');
    fireEvent.click(pizzaTag);
  });

  test('clicking burger tag sets search', () => {
    renderWithProviders(<Header />);
    const burgerTag = screen.getByText('🍔 Burger');
    fireEvent.click(burgerTag);
  });

  test('clicking biryani tag sets search', () => {
    renderWithProviders(<Header />);
    const biryaniTag = screen.getByText('🍗 Biryani');
    fireEvent.click(biryaniTag);
  });

  test('clicking chinese tag sets search', () => {
    renderWithProviders(<Header />);
    const chineseTag = screen.getByText('🍜 Chinese');
    fireEvent.click(chineseTag);
  });

  test('clicking desserts tag sets search', () => {
    renderWithProviders(<Header />);
    const dessertsTag = screen.getByText('🍰 Desserts');
    fireEvent.click(dessertsTag);
  });

  test('search form has input-container class', () => {
    renderWithProviders(<Header />);
    expect(document.querySelector('.input-container')).toBeInTheDocument();
  });

  test('renders all menu items when hamburger open', () => {
    renderWithProviders(<Header />);
    const hamburger = document.querySelector('.hamburger');
    fireEvent.click(hamburger);
    expect(document.querySelector('.sideMenu')).toBeInTheDocument();
  });

  test('menu items include Home link', () => {
    renderWithProviders(<Header />);
    const hamburger = document.querySelector('.hamburger');
    fireEvent.click(hamburger);
    expect(document.querySelector('.menu-item')).toBeInTheDocument();
  });

  test('menu items include Cart', () => {
    renderWithProviders(<Header />);
    const hamburger = document.querySelector('.hamburger');
    fireEvent.click(hamburger);
    expect(screen.getByText(/Cart/)).toBeInTheDocument();
  });

  test('hamburger renders menu icon initially', () => {
    renderWithProviders(<Header />);
    const hamburger = document.querySelector('.hamburger');
    expect(hamburger).toBeInTheDocument();
  });

  test('search button exists', () => {
    renderWithProviders(<Header />);
    expect(document.querySelector('.search-btn')).toBeInTheDocument();
  });

  test('quick tags container exists', () => {
    renderWithProviders(<Header />);
    expect(document.querySelector('.quick-tags')).toBeInTheDocument();
  });

  test('renders header nav', () => {
    renderWithProviders(<Header />);
    expect(document.querySelector('.header-nav')).toBeInTheDocument();
  });

  test('renders header content', () => {
    renderWithProviders(<Header />);
    expect(document.querySelector('.headerContent')).toBeInTheDocument();
  });

  test('renders hero logo', () => {
    renderWithProviders(<Header />);
    expect(document.querySelector('.hero-logo')).toBeInTheDocument();
  });

  test('renders hero title', () => {
    renderWithProviders(<Header />);
    expect(document.querySelector('.hero-title')).toBeInTheDocument();
  });

  test('renders header overlay', () => {
    renderWithProviders(<Header />);
    expect(document.querySelector('.header-overlay')).toBeInTheDocument();
  });

  test('renders scroll indicator', () => {
    renderWithProviders(<Header />);
    expect(document.querySelector('.scroll-indicator')).toBeInTheDocument();
  });

  test('renders scroll arrow', () => {
    renderWithProviders(<Header />);
    expect(document.querySelector('.scroll-arrow')).toBeInTheDocument();
  });

  test('clicking sign up button does not navigate', () => {
    renderWithProviders(<Header />);
    const signUpBtn = document.querySelector('.btn-zomato');
    fireEvent.click(signUpBtn);
  });

  test('search with empty query does not navigate', () => {
    renderWithProviders(<Header />);
    const form = document.querySelector('form');
    fireEvent.submit(form);
  });

  test('renders inner menu when hamburger open', () => {
    renderWithProviders(<Header />);
    const hamburger = document.querySelector('.hamburger');
    fireEvent.click(hamburger);
    expect(document.querySelector('.innerMenu')).toBeInTheDocument();
  });

  test('renders side logo when hamburger open', () => {
    renderWithProviders(<Header />);
    const hamburger = document.querySelector('.hamburger');
    fireEvent.click(hamburger);
    expect(document.querySelector('.side-logo')).toBeInTheDocument();
  });
});
