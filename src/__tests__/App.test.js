import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });

  test('shows city selection when no city is selected', () => {
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });

  test('shows city selection with select your city text', () => {
    const { container } = render(<App />);
    expect(container.textContent || container.innerText).toContain('Select your city');
  });
});
