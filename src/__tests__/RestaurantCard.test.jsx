import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import RestaurantCard from '../components/RestaurantCard/RestaurantCard';

const mockRestaurant = {
  id: 1,
  name: 'Test Restaurant',
  rating: 4.5,
  reviews: 100,
  cuisine: 'Italian',
  price: 500,
  deliveryTime: '30-40',
  image: 'https://example.com/image.jpg',
  featured: true,
  city: 'Belgaum',
  address: 'Test Address',
  isOpen: true,
};

describe('RestaurantCard Component', () => {
  test('renders restaurant name', () => {
    render(<RestaurantCard restaurant={mockRestaurant} onClick={() => {}} />);
    expect(screen.getByText('Test Restaurant')).toBeInTheDocument();
  });

  test('renders restaurant rating', () => {
    render(<RestaurantCard restaurant={mockRestaurant} onClick={() => {}} />);
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  test('renders cuisine type', () => {
    render(<RestaurantCard restaurant={mockRestaurant} onClick={() => {}} />);
    expect(screen.getByText('Italian')).toBeInTheDocument();
  });

  test('renders featured badge when featured', () => {
    render(<RestaurantCard restaurant={mockRestaurant} onClick={() => {}} />);
    expect(screen.getByText('Featured')).toBeInTheDocument();
  });

  test('does not render featured badge when not featured', () => {
    const nonFeaturedRestaurant = { ...mockRestaurant, featured: false };
    render(<RestaurantCard restaurant={nonFeaturedRestaurant} onClick={() => {}} />);
    expect(screen.queryByText('Featured')).not.toBeInTheDocument();
  });

  test('renders closed badge when restaurant is closed', () => {
    const closedRestaurant = { ...mockRestaurant, isOpen: false };
    render(<RestaurantCard restaurant={closedRestaurant} onClick={() => {}} />);
    expect(screen.getByText('Currently Closed')).toBeInTheDocument();
  });

  test('calls onClick when card is clicked', () => {
    const onClick = jest.fn();
    render(<RestaurantCard restaurant={mockRestaurant} onClick={onClick} />);
    screen.getByText('Test Restaurant').click();
    expect(onClick).toHaveBeenCalled();
  });
});
