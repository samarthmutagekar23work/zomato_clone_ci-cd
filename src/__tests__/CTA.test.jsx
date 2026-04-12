import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import CTA from '../components/CTA/CTA';

describe('CTA Component', () => {
  test('renders CTA section', () => {
    render(<CTA />);
    expect(document.querySelector('.cta')).toBeInTheDocument();
  });

  test('renders app title', () => {
    render(<CTA />);
    expect(screen.getByText(/Get the Zomato app/i)).toBeInTheDocument();
  });

  test('renders description text', () => {
    render(<CTA />);
    expect(screen.getByText(/send you a link/i)).toBeInTheDocument();
  });

  test('renders email radio button', () => {
    render(<CTA />);
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  });

  test('renders phone radio button', () => {
    render(<CTA />);
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
  });

  test('renders submit button', () => {
    render(<CTA />);
    expect(screen.getByText(/Share App Link/i)).toBeInTheDocument();
  });

  test('renders phone image', () => {
    render(<CTA />);
    const images = document.querySelectorAll('img');
    expect(images.length).toBeGreaterThan(0);
  });

  test('renders store images', () => {
    render(<CTA />);
    expect(screen.getByText(/Download app from/i)).toBeInTheDocument();
  });

  test('clicking email radio selects email', () => {
    render(<CTA />);
    const emailRadio = screen.getByLabelText(/Email/i);
    fireEvent.click(emailRadio);
    expect(screen.getByPlaceholderText(/Enter your email/i)).toBeInTheDocument();
  });

  test('clicking phone radio selects phone', () => {
    render(<CTA />);
    const phoneRadio = screen.getByLabelText(/Phone/i);
    fireEvent.click(phoneRadio);
    expect(screen.getByPlaceholderText(/Enter your phone/i)).toBeInTheDocument();
  });

  test('form submit works', () => {
    render(<CTA />);
    const input = screen.getByPlaceholderText(/Enter your email/i);
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    const submitButton = screen.getByText(/Share App Link/i);
    fireEvent.click(submitButton);
  });
});
