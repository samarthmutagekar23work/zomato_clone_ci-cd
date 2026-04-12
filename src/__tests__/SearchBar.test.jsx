import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../components/SearchBar/SearchBar';

describe('SearchBar Component', () => {
  test('renders with placeholder text', () => {
    render(<SearchBar placeholder="Search..." onSearch={() => {}} value="" />);
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  test('renders with value', () => {
    render(<SearchBar placeholder="Search..." onSearch={() => {}} value="Pizza" />);
    expect(screen.getByDisplayValue('Pizza')).toBeInTheDocument();
  });

  test('calls onSearch when input changes', () => {
    const onSearch = jest.fn();
    render(<SearchBar placeholder="Search..." onSearch={onSearch} value="" />);
    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'Burger' } });
    expect(onSearch).toHaveBeenCalledWith('Burger');
  });

  test('shows clear button when value is not empty', () => {
    render(<SearchBar placeholder="Search..." onSearch={() => {}} value="Pizza" />);
    expect(document.querySelector('.clear-btn')).toBeInTheDocument();
  });

  test('hides clear button when value is empty', () => {
    render(<SearchBar placeholder="Search..." onSearch={() => {}} value="" />);
    expect(document.querySelector('.clear-btn')).not.toBeInTheDocument();
  });

  test('calls onSearch with empty string when clear is clicked', () => {
    const onSearch = jest.fn();
    render(<SearchBar placeholder="Search..." onSearch={onSearch} value="Pizza" />);
    fireEvent.click(document.querySelector('.clear-btn'));
    expect(onSearch).toHaveBeenCalledWith('');
  });
});
