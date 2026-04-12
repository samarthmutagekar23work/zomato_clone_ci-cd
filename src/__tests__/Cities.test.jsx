import { render, screen } from '@testing-library/react';
import Cities from '../components/Cities/Cities';

describe('Cities Component', () => {
  const cityData = [
    'Bodakdev',
    'Satellite',
    'Gurukul',
    'Navrangpura',
    'Vastrapur',
    'Thaltej',
    'Prahlad Nagar',
    'C G Road'
  ];

  test('renders header with Ahmedabad', () => {
    render(<Cities />);
    expect(screen.getByText(/Popular localities/i)).toBeInTheDocument();
    expect(screen.getByText('Ahmedabad')).toBeInTheDocument();
  });

  test('renders all city names', () => {
    render(<Cities />);
    cityData.forEach(city => {
      expect(screen.getByText(city)).toBeInTheDocument();
    });
  });

  test('renders place counts', () => {
    render(<Cities />);
    expect(screen.getByText(/345 Places/i)).toBeInTheDocument();
    expect(screen.getByText(/336 Places/i)).toBeInTheDocument();
  });

  test('renders see more button', () => {
    render(<Cities />);
    expect(screen.getByText('See more')).toBeInTheDocument();
  });
});
