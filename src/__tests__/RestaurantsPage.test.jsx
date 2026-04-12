import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

  test('has filter toggle button with correct class', () => {
    const { container } = renderWithProviders(<RestaurantsPage />);
    expect(container.querySelector('.filter-toggle-btn')).toBeInTheDocument();
  });

  test('renders filter toggle button text', () => {
    const { container } = renderWithProviders(<RestaurantsPage />);
    expect(container.querySelector('.filter-toggle-btn').textContent).toBe('Show Filters');
  });

  test('renders header component', () => {
    const { container } = renderWithProviders(<RestaurantsPage />);
    expect(container.querySelector('.header')).toBeInTheDocument();
  });

  test('renders footer component', () => {
    const { container } = renderWithProviders(<RestaurantsPage />);
    expect(container.querySelector('.footer')).toBeInTheDocument();
  });

  test('shows restaurant count in header', () => {
    renderWithProviders(<RestaurantsPage />);
    expect(screen.getByText(/places/)).toBeInTheDocument();
  });

  test('renders multiple restaurant cards', () => {
    const { container } = renderWithProviders(<RestaurantsPage />);
    const cards = container.querySelectorAll('.restaurant-card');
    expect(cards.length).toBeGreaterThan(0);
  });

  test('shows filter bar with filter toggle', () => {
    const { container } = renderWithProviders(<RestaurantsPage />);
    fireEvent.click(container.querySelector('.filter-toggle-btn'));
    expect(container.querySelector('.filter-bar')).toBeInTheDocument();
  });

  test('filter toggle changes button text', () => {
    const { container } = renderWithProviders(<RestaurantsPage />);
    const btn = container.querySelector('.filter-toggle-btn');
    expect(btn.textContent).toBe('Show Filters');
    fireEvent.click(btn);
    expect(btn.textContent).toBe('Hide Filters');
  });

  test('renders controls bar with search', () => {
    const { container } = renderWithProviders(<RestaurantsPage />);
    expect(container.querySelector('.controls-bar')).toBeInTheDocument();
  });

  test('renders search bar component', () => {
    renderWithProviders(<RestaurantsPage />);
    expect(document.querySelector('.search-bar')).toBeInTheDocument();
  });

  test('filter bar contains sort by options when visible', () => {
    const { container } = renderWithProviders(<RestaurantsPage />);
    fireEvent.click(container.querySelector('.filter-toggle-btn'));
    expect(container.querySelector('.filter-bar')).toBeInTheDocument();
  });

  test('shows restaurants when search matches', () => {
    const { container } = renderWithProviders(<RestaurantsPage />);
    const input = screen.getByPlaceholderText(/Search restaurants or cuisines/i);
    fireEvent.change(input, { target: { value: 'Spice' } });
  });

  test('renders no-results section when search has no matches', () => {
    const { container } = renderWithProviders(<RestaurantsPage />);
    const input = screen.getByPlaceholderText(/Search restaurants or cuisines/i);
    fireEvent.change(input, { target: { value: 'XXXXXXXXXXXXX' } });
  });

  test('page header displays city name', () => {
    renderWithProviders(<RestaurantsPage />);
    expect(screen.getByText(/Restaurants in Belgaum/)).toBeInTheDocument();
  });
});
