import { render, screen } from '@testing-library/react';
import Footer from '../components/Footer/Footer';

describe('Footer Component', () => {
  test('renders footer logo', () => {
    render(<Footer />);
    expect(screen.getByText('zomato')).toBeInTheDocument();
  });

  test('renders about section', () => {
    render(<Footer />);
    expect(screen.getByText('About Zomato')).toBeTheDocument();
  });

  test('renders restaurant categories', () => {
    render(<Footer />);
    expect(screen.getByText('Restaurant'));
  });

  test('renders social links', () => {
    render(<Footer />);
    const socialSection = screen.getByText(/Follow us/i);
    expect(socialSection).toBeInTheDocument();
  });
});
