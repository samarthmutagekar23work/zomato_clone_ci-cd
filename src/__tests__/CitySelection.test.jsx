import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { AppProvider } from '../context/AppContext';
import CitySelection from '../pages/CitySelection/CitySelection';
import { BrowserRouter } from 'react-router-dom';

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
});
