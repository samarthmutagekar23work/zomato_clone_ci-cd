import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage/HomePage';
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

describe('HomePage Component', () => {
  test('renders home page container', () => {
    const { container } = renderWithProviders(<HomePage />);
    expect(container.querySelector('.home-page')).toBeInTheDocument();
  });

  test('renders categories section', () => {
    const { container } = renderWithProviders(<HomePage />);
    expect(container.querySelector('.categories-section')).toBeInTheDocument();
  });

  test('renders featured section', () => {
    const { container } = renderWithProviders(<HomePage />);
    expect(container.querySelector('.featured-section')).toBeInTheDocument();
  });

  test('renders featured restaurants header', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByText('Featured Restaurants')).toBeInTheDocument();
  });

  test('renders view all button', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByText(/View All/)).toBeInTheDocument();
  });

  test('renders collections section', () => {
    const { container } = renderWithProviders(<HomePage />);
    expect(container.querySelector('.collections-section')).toBeInTheDocument();
  });

  test('renders cities section', () => {
    const { container } = renderWithProviders(<HomePage />);
    expect(container.querySelector('.cities-section')).toBeInTheDocument();
  });

  test('renders app promo section', () => {
    const { container } = renderWithProviders(<HomePage />);
    expect(container.querySelector('.app-promo-section')).toBeInTheDocument();
  });

  test('renders faq section', () => {
    const { container } = renderWithProviders(<HomePage />);
    expect(container.querySelector('.faq-section')).toBeInTheDocument();
  });

  test('renders section container', () => {
    const { container } = renderWithProviders(<HomePage />);
    expect(container.querySelector('.section-container')).toBeInTheDocument();
  });

  test('renders section header', () => {
    const { container } = renderWithProviders(<HomePage />);
    expect(container.querySelector('.section-header')).toBeInTheDocument();
  });

  test('renders restaurant grid', () => {
    const { container } = renderWithProviders(<HomePage />);
    expect(container.querySelector('.restaurant-grid')).toBeInTheDocument();
  });

  test('renders restaurant cards', () => {
    const { container } = renderWithProviders(<HomePage />);
    expect(container.querySelector('.restaurant-card')).toBeInTheDocument();
  });

  test('renders view all button with correct class', () => {
    const { container } = renderWithProviders(<HomePage />);
    expect(container.querySelector('.view-all-btn')).toBeInTheDocument();
  });

  test('section header contains h2', () => {
    const { container } = renderWithProviders(<HomePage />);
    const header = container.querySelector('.section-header');
    expect(header.querySelector('h2')).toBeInTheDocument();
  });

  test('featured section contains restaurant cards', () => {
    const { container } = renderWithProviders(<HomePage />);
    const cards = container.querySelectorAll('.restaurant-card');
    expect(cards.length).toBeGreaterThan(0);
  });

  test('renders categories card component', () => {
    const { container } = renderWithProviders(<HomePage />);
    expect(container.querySelector('.categories-section')).toBeInTheDocument();
  });

  test('renders collections component', () => {
    const { container } = renderWithProviders(<HomePage />);
    expect(container.querySelector('.collections-section')).toBeInTheDocument();
  });

  test('renders cities component', () => {
    const { container } = renderWithProviders(<HomePage />);
    expect(container.querySelector('.cities-section')).toBeInTheDocument();
  });

  test('renders CTA component', () => {
    const { container } = renderWithProviders(<HomePage />);
    expect(container.querySelector('.app-promo-section')).toBeInTheDocument();
  });

  test('renders accordion container', () => {
    const { container } = renderWithProviders(<HomePage />);
    expect(container.querySelector('.faq-section')).toBeInTheDocument();
  });

  test('renders footer', () => {
    const { container } = renderWithProviders(<HomePage />);
    expect(container.querySelector('.footer')).toBeInTheDocument();
  });

  test('renders header', () => {
    const { container } = renderWithProviders(<HomePage />);
    expect(container.querySelector('.header')).toBeInTheDocument();
  });
});
