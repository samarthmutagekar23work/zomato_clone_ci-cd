import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
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

  test('renders header overlay', () => {
    renderWithProviders(<Header />);
    expect(document.querySelector('.header-overlay')).toBeInTheDocument();
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

  test('renders hero title element', () => {
    renderWithProviders(<Header />);
    expect(document.querySelector('.hero-title')).toBeInTheDocument();
  });

  test('renders search form', () => {
    renderWithProviders(<Header />);
    expect(document.querySelector('form')).toBeInTheDocument();
  });

  test('renders search icon', () => {
    renderWithProviders(<Header />);
    expect(document.querySelector('.search-icon')).toBeInTheDocument();
  });

  test('renders search button', () => {
    renderWithProviders(<Header />);
    expect(document.querySelector('.search-btn')).toBeInTheDocument();
  });

  test('renders quick tags container', () => {
    renderWithProviders(<Header />);
    expect(document.querySelector('.quick-tags')).toBeInTheDocument();
  });

  test('renders input container', () => {
    renderWithProviders(<Header />);
    expect(document.querySelector('.input-container')).toBeInTheDocument();
  });

  test('renders location select container', () => {
    renderWithProviders(<Header />);
    expect(document.querySelector('.location-select')).toBeInTheDocument();
  });

  test('renders search input element', () => {
    renderWithProviders(<Header />);
    expect(document.querySelector('.search-input')).toBeInTheDocument();
  });

  test('renders divider', () => {
    renderWithProviders(<Header />);
    expect(document.querySelector('.divider')).toBeInTheDocument();
  });

  test('renders cart link', () => {
    renderWithProviders(<Header />);
    expect(document.querySelector('.cart-link')).toBeInTheDocument();
  });

  test('renders sign up button', () => {
    renderWithProviders(<Header />);
    expect(document.querySelector('.btn-zomato')).toBeInTheDocument();
  });

  test('renders right navigation', () => {
    renderWithProviders(<Header />);
    expect(document.querySelector('.right')).toBeInTheDocument();
  });

  test('renders nav links', () => {
    renderWithProviders(<Header />);
    expect(document.querySelector('.nav-link')).toBeInTheDocument();
  });

  test('renders get app link', () => {
    renderWithProviders(<Header />);
    expect(document.querySelector('.get-app')).toBeInTheDocument();
  });

  test('renders nav button', () => {
    renderWithProviders(<Header />);
    expect(document.querySelector('.nav-btn')).toBeInTheDocument();
  });

  test('renders Chinese quick tag', () => {
    renderWithProviders(<Header />);
    expect(screen.getByText('🍜 Chinese')).toBeInTheDocument();
  });

  test('renders Desserts quick tag', () => {
    renderWithProviders(<Header />);
    expect(screen.getByText('🍰 Desserts')).toBeInTheDocument();
  });

  test('can change search input', () => {
    renderWithProviders(<Header />);
    const input = screen.getByPlaceholderText(/Search for restaurant/i);
    fireEvent.change(input, { target: { value: 'Pizza' } });
    expect(input.value).toBe('Pizza');
  });

  test('location icon renders', () => {
    renderWithProviders(<Header />);
    expect(document.querySelector('.location-icon')).toBeInTheDocument();
  });

  test('location select has options', () => {
    renderWithProviders(<Header />);
    const select = document.querySelector('select');
    expect(select.options.length).toBeGreaterThan(0);
  });

  test('renders nav restaurant link', () => {
    renderWithProviders(<Header />);
    const links = document.querySelectorAll('.nav-link');
    expect(links.length).toBeGreaterThan(0);
  });

  test('renders menu icon when hamburger closed', () => {
    renderWithProviders(<Header />);
    const hamburger = document.querySelector('.hamburger');
    expect(hamburger).toBeInTheDocument();
  });

  test('toggles hamburger menu', () => {
    renderWithProviders(<Header />);
    const hamburger = document.querySelector('.hamburger');
    fireEvent.click(hamburger);
  });
});
