import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Footer from '../components/Footer/Footer';

describe('Footer Component', () => {
  test('renders footer with correct class', () => {
    render(<Footer />);
    expect(document.querySelector('.footer')).toBeInTheDocument();
  });

  test('renders social links section', () => {
    render(<Footer />);
    expect(screen.getByText('SOCIAL LINKS')).toBeInTheDocument();
  });

  test('renders footer sections', () => {
    render(<Footer />);
    expect(screen.getByText('ABOUT ZOMATO')).toBeInTheDocument();
    expect(screen.getByText('ZOMAVERSE')).toBeInTheDocument();
    expect(screen.getByText('LEARN MORE')).toBeInTheDocument();
  });

  test('renders footer links', () => {
    render(<Footer />);
    expect(screen.getByText('Privacy')).toBeInTheDocument();
    expect(screen.getByText('Security')).toBeInTheDocument();
    expect(screen.getByText('Terms')).toBeInTheDocument();
  });

  test('renders scroll to top button', () => {
    render(<Footer />);
    const buttons = document.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
