import { render, screen } from '@testing-library/react';
import Collection from '../components/Collections/Collection';

describe('Collection Component', () => {
  test('renders collections header', () => {
    render(<Collection />);
    expect(screen.getByText('Collections')).toBeInTheDocument();
  });

  test('renders collection subtitle', () => {
    render(<Collection />);
    expect(screen.getByText(/Explore curated lists/i)).toBeInTheDocument();
  });

  test('renders all collection titles', () => {
    render(<Collection />);
    expect(screen.getByText(/10 Must-Visit Places for Christmas/i)).toBeInTheDocument();
    expect(screen.getByText(/7 Finest Buffet Places/i)).toBeInTheDocument();
    expect(screen.getByText(/Top 8 Picturesque Cafes/i)).toBeInTheDocument();
    expect(screen.getByText(/10 Best Luxury Dining Places/i)).toBeInTheDocument();
  });

  test('renders place counts', () => {
    render(<Collection />);
    expect(screen.getByText(/9 Places/i)).toBeInTheDocument();
    expect(screen.getByText(/7 Places/i)).toBeInTheDocument();
    expect(screen.getByText(/10 Places/i)).toBeInTheDocument();
  });
});
