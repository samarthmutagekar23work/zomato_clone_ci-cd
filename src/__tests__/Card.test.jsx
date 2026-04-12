import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Card from '../components/Card/Card';

describe('Card Component', () => {
  test('renders section title', () => {
    render(<Card />);
    expect(screen.getByText(/What's on your mind/i)).toBeInTheDocument();
  });

  test('renders section subtitle', () => {
    render(<Card />);
    expect(screen.getByText(/Explore curated options/i)).toBeInTheDocument();
  });

  test('renders explore text for all cards', () => {
    render(<Card />);
    const exploreButtons = screen.getAllByText('Explore');
    expect(exploreButtons).toHaveLength(3);
  });
});
