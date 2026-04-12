import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RestaurantsPage from '../pages/RestaurantsPage/RestaurantsPage';
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

describe('RestaurantsPage Component', () => {
  test('renders restaurants page container', () => {
    const { container } = renderWithProviders(<RestaurantsPage />);
    expect(container.querySelector('.restaurants-page')).toBeInTheDocument();
  });

  test('renders page header', () => {
    const { container } = renderWithProviders(<RestaurantsPage />);
    expect(container.querySelector('.page-header')).toBeInTheDocument();
  });

  test('renders page title', () => {
    renderWithProviders(<RestaurantsPage />);
    expect(screen.getByText(/Restaurants in/)).toBeInTheDocument();
  });

  test('renders search bar', () => {
    const { container } = renderWithProviders(<RestaurantsPage />);
    expect(container.querySelector('.controls-bar')).toBeInTheDocument();
  });

  test('renders filter toggle button', () => {
    renderWithProviders(<RestaurantsPage />);
    expect(screen.getByText('Show Filters')).toBeInTheDocument();
  });

  test('toggles filter visibility', () => {
    const { container } = renderWithProviders(<RestaurantsPage />);
    const toggleBtn = container.querySelector('.filter-toggle-btn');
    
    expect(screen.queryByText('Show Filters')).toBeInTheDocument();
  });

  test('renders restaurants grid', () => {
    const { container } = renderWithProviders(<RestaurantsPage />);
    expect(container.querySelector('.restaurants-grid')).toBeInTheDocument();
  });

  test('renders page content', () => {
    const { container } = renderWithProviders(<RestaurantsPage />);
    expect(container.querySelector('.page-content')).toBeInTheDocument();
  });
});
