import { render } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
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
