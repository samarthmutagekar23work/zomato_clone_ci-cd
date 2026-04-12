import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Accordian from '../components/Accordian/Accordian';

const mockQuestion = {
  id: 1,
  title: 'Test Question',
  infos: 'This is test information content.'
};

describe('Accordian Component', () => {
  test('renders accordian title', () => {
    render(<Accordian question={mockQuestion} />);
    expect(screen.getByText('Test Question')).toBeInTheDocument();
  });

  test('opens on click', () => {
    render(<Accordian question={mockQuestion} />);
    fireEvent.click(screen.getByText('Test Question'));
    expect(screen.getByText('This is test information content.')).toBeVisible();
  });
});
