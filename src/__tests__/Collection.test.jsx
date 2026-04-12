import '@testing-library/jest-dom';
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
});
