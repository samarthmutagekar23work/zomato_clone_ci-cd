import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
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
});
