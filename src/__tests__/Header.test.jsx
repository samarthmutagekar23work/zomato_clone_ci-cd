import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../components/Header/Header';

jest.mock('react-transition-group', () => ({
  CSSTransition: ({ children }) => children,
}));

describe('Header Component', () => {
  test('renders header', () => {
    render(<Header />);
    expect(document.querySelector('.header')).toBeInTheDocument();
  });

  test('renders logo', () => {
    render(<Header />);
    const logos = document.querySelectorAll('img');
    expect(logos.length).toBeGreaterThan(0);
  });

  test('renders navigation links', () => {
    render(<Header />);
    expect(screen.getByText('Get the App')).toBeInTheDocument();
    expect(screen.getAllByText('Investor Relations').length).toBeGreaterThan(0);
    expect(screen.getByText('Add restaurant')).toBeInTheDocument();
    expect(screen.getByText('Log in')).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });

  test('renders search input', () => {
    render(<Header />);
    expect(screen.getByPlaceholderText(/Search for restaurant/i)).toBeInTheDocument();
  });

  test('renders location select', () => {
    render(<Header />);
    const selects = document.querySelectorAll('select');
    expect(selects.length).toBeGreaterThan(0);
  });

  test('renders quick tags', () => {
    render(<Header />);
    expect(screen.getByText('🍕 Pizza')).toBeInTheDocument();
    expect(screen.getByText('🍔 Burger')).toBeInTheDocument();
    expect(screen.getByText('🍣 Sushi')).toBeInTheDocument();
  });

  test('renders scroll indicator', () => {
    render(<Header />);
    expect(screen.getByText('↓')).toBeInTheDocument();
  });

  test('renders hamburger menu', () => {
    render(<Header />);
    const hamburger = document.querySelector('.hamburger');
    expect(hamburger).toBeInTheDocument();
  });

  test('renders hero title', () => {
    render(<Header />);
    expect(screen.getByText(/Discover the best food/i)).toBeInTheDocument();
  });
});
