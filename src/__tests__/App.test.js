import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  test('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });

  test('renders header component', () => {
    const { container } = render(<App />);
    expect(container.querySelector('.header')).toBeInTheDocument();
  });

  test('renders footer component', () => {
    const { container } = render(<App />);
    expect(container.querySelector('.footer')).toBeInTheDocument();
  });
});
