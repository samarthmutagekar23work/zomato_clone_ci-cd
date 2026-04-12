import { render, screen, fireEvent } from '@testing-library/react';
import Accordian from '../components/Accordian/Accordian';

const mockQuestion = {
  title: 'Test Question',
  infos: 'This is test information content.'
};

describe('Accordian Component', () => {
  test('renders accordian title', () => {
    render(<Accordian question={mockQuestion} />);
    expect(screen.getByText('Test Question')).toBeInTheDocument();
  });

  test('starts in closed state', () => {
    render(<Accordian question={mockQuestion} />);
    expect(screen.queryByText('This is test information content.')).not.toBeVisible();
  });

  test('opens on click', () => {
    render(<Accordian question={mockQuestion} />);
    fireEvent.click(screen.getByText('Test Question'));
    expect(screen.getByText('This is test information content.')).toBeVisible();
  });

  test('closes on second click', () => {
    render(<Accordian question={mockQuestion} />);
    fireEvent.click(screen.getByText('Test Question'));
    fireEvent.click(screen.getByText('Test Question'));
    expect(screen.queryByText('This is test information content.')).not.toBeVisible();
  });
});
