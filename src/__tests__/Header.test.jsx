import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
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
});
