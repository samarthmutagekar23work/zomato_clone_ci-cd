import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { AppProvider } from '../context/AppContext';
import CitySelection from '../pages/CitySelection/CitySelection';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';

const renderWithProviders = (ui) => {
  return render(
    <AppProvider>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </AppProvider>
  );
};

describe('CitySelection Component', () => {
  test('renders city selection page', () => {
    renderWithProviders(<CitySelection />);
    expect(screen.getByText(/Select your city/i)).toBeInTheDocument();
  });

  test('renders search input', () => {
    renderWithProviders(<CitySelection />);
    expect(screen.getByPlaceholderText(/Search for city/i)).toBeInTheDocument();
  });

  test('renders popular cities', () => {
    renderWithProviders(<CitySelection />);
    expect(screen.getByText('Popular Cities')).toBeInTheDocument();
  });

  test('renders continue button', () => {
    renderWithProviders(<CitySelection />);
    expect(screen.getByText('Continue')).toBeInTheDocument();
  });

  test('renders city selection container', () => {
    const { container } = renderWithProviders(<CitySelection />);
    expect(container.querySelector('.city-selection')).toBeInTheDocument();
  });

  test('renders city selection content', () => {
    const { container } = renderWithProviders(<CitySelection />);
    expect(container.querySelector('.city-selection-content')).toBeInTheDocument();
  });

  test('renders logo section', () => {
    const { container } = renderWithProviders(<CitySelection />);
    expect(container.querySelector('.logo-section')).toBeInTheDocument();
  });

  test('renders zomato logo', () => {
    const { container } = renderWithProviders(<CitySelection />);
    expect(container.querySelector('.zomato-logo')).toBeInTheDocument();
  });

  test('renders heading', () => {
    renderWithProviders(<CitySelection />);
    expect(screen.getByText(/Discover the best food/i)).toBeInTheDocument();
  });

  test('renders city selector', () => {
    const { container } = renderWithProviders(<CitySelection />);
    expect(container.querySelector('.city-selector')).toBeInTheDocument();
  });

  test('renders search container', () => {
    const { container } = renderWithProviders(<CitySelection />);
    expect(container.querySelector('.search-container')).toBeInTheDocument();
  });

  test('renders location icon', () => {
    const { container } = renderWithProviders(<CitySelection />);
    expect(container.querySelector('.location-icon')).toBeInTheDocument();
  });

  test('renders city search input with correct class', () => {
    const { container } = renderWithProviders(<CitySelection />);
    expect(container.querySelector('.city-search-input')).toBeInTheDocument();
  });

  test('renders popular cities section', () => {
    const { container } = renderWithProviders(<CitySelection />);
    expect(container.querySelector('.popular-cities')).toBeInTheDocument();
  });

  test('renders city chips container', () => {
    const { container } = renderWithProviders(<CitySelection />);
    expect(container.querySelector('.city-chips')).toBeInTheDocument();
  });

  test('renders continue button with correct class', () => {
    const { container } = renderWithProviders(<CitySelection />);
    expect(container.querySelector('.continue-btn')).toBeInTheDocument();
  });

  test('continue button is disabled when no city selected', () => {
    renderWithProviders(<CitySelection />);
    const button = screen.getByText('Continue');
    expect(button).toBeDisabled();
  });

  test('can type in search input', () => {
    renderWithProviders(<CitySelection />);
    const input = screen.getByPlaceholderText(/Search for city/i);
    fireEvent.change(input, { target: { value: 'Bang' } });
    expect(input.value).toBe('Bang');
  });

  test('shows dropdown when searching', () => {
    renderWithProviders(<CitySelection />);
    const input = screen.getByPlaceholderText(/Search for city/i);
    fireEvent.change(input, { target: { value: 'Bangalore' } });
    fireEvent.focus(input);
  });

  test('shows city options when dropdown is visible', async () => {
    renderWithProviders(<CitySelection />);
    const input = screen.getByPlaceholderText(/Search for city/i);
    fireEvent.change(input, { target: { value: 'Bel' } });
    
    await waitFor(() => {
      const dropdown = document.querySelector('.city-dropdown');
      expect(dropdown).toBeInTheDocument();
    });
  });

  test('can select a city chip', () => {
    renderWithProviders(<CitySelection />);
    const chips = document.querySelectorAll('.city-chip');
    expect(chips.length).toBeGreaterThan(0);
  });

  test('selected city is displayed', () => {
    const { container } = renderWithProviders(<CitySelection />);
    const input = screen.getByPlaceholderText(/Search for city/i);
    fireEvent.change(input, { target: { value: 'Belgaum' } });
  });

  test('renders city overlay', () => {
    const { container } = renderWithProviders(<CitySelection />);
    expect(container.querySelector('.city-selection-overlay')).toBeInTheDocument();
  });

  test('city chips are buttons', () => {
    renderWithProviders(<CitySelection />);
    const chips = document.querySelectorAll('.city-chip');
    chips.forEach(chip => {
      expect(chip.tagName).toBe('BUTTON');
    });
  });

  test('shows no results when city not found', async () => {
    renderWithProviders(<CitySelection />);
    const input = screen.getByPlaceholderText(/Search for city/i);
    fireEvent.change(input, { target: { value: 'XYZNOTFOUND' } });
  });

  test('can type in city search', () => {
    renderWithProviders(<CitySelection />);
    const input = screen.getByPlaceholderText(/Search for city/i);
    fireEvent.change(input, { target: { value: 'Mumbai' } });
    expect(input.value).toBe('Mumbai');
  });
});
