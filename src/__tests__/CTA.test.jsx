import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import CTA from '../components/CTA/CTA';

describe('CTA Component', () => {
  test('renders CTA section', () => {
    render(<CTA />);
    const ctaElement = document.querySelector('.cta');
    expect(ctaElement).toBeInTheDocument();
  });

  test('renders form inputs', () => {
    render(<CTA />);
    const inputs = document.querySelectorAll('input');
    expect(inputs.length).toBeGreaterThan(0);
  });
});
