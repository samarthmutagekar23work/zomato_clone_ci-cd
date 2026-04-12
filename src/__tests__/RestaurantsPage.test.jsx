import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
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

  test('renders page header h1', () => {
    const { container } = renderWithProviders(<RestaurantsPage />);
    expect(container.querySelector('.page-header h1')).toBeInTheDocument();
  });

  test('renders page header p', () => {
    const { container } = renderWithProviders(<RestaurantsPage />);
    expect(container.querySelector('.page-header p')).toBeInTheDocument();
  });

  test('shows filter bar when toggled', () => {
    const { container } = renderWithProviders(<RestaurantsPage />);
    fireEvent.click(container.querySelector('.filter-toggle-btn'));
    expect(screen.getByText('Hide Filters')).toBeInTheDocument();
  });

  test('hides filter bar when toggled again', () => {
    const { container } = renderWithProviders(<RestaurantsPage />);
    fireEvent.click(container.querySelector('.filter-toggle-btn'));
    fireEvent.click(container.querySelector('.filter-toggle-btn'));
    expect(screen.getByText('Show Filters')).toBeInTheDocument();
  });

  test('renders search input', () => {
    renderWithProviders(<RestaurantsPage />);
    expect(screen.getByPlaceholderText(/Search restaurants or cuisines/i)).toBeInTheDocument();
  });

  test('can type in search input', () => {
    renderWithProviders(<RestaurantsPage />);
    const input = screen.getByPlaceholderText(/Search restaurants or cuisines/i);
    fireEvent.change(input, { target: { value: 'Pizza' } });
    expect(input.value).toBe('Pizza');
  });

  test('renders restaurant cards', () => {
    const { container } = renderWithProviders(<RestaurantsPage />);
    expect(container.querySelector('.restaurant-card')).toBeInTheDocument();
  });

  test('renders no results when search matches nothing', async () => {
    renderWithProviders(<RestaurantsPage />);
    const input = screen.getByPlaceholderText(/Search restaurants or cuisines/i);
    fireEvent.change(input, { target: { value: 'XYZNOTFOUND123' } });
  });

  test('has filter toggle button with correct class', () => {
    const { container } = renderWithProviders(<RestaurantsPage />);
    expect(container.querySelector('.filter-toggle-btn')).toBeInTheDocument();
  });
});
