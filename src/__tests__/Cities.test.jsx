import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Cities from '../components/Cities/Cities';

describe('Cities Component', () => {
  test('renders header with Ahmedabad', () => {
    render(<Cities />);
    expect(screen.getByText(/Popular localities/i)).toBeInTheDocument();
    expect(screen.getByText('Ahmedabad')).toBeInTheDocument();
  });

  test('renders see more button', () => {
    render(<Cities />);
    expect(screen.getByText('See more')).toBeInTheDocument();
  });
});
