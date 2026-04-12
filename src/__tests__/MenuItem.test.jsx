import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import MenuItem from '../components/MenuItem/MenuItem';

const mockItem = {
  id: 1,
  name: 'Test Dish',
  price: 250,
  category: 'Main Course',
  description: 'A delicious test dish',
  isVeg: true,
};

describe('MenuItem Component', () => {
  test('renders item name', () => {
    render(
      <MenuItem
        item={mockItem}
        quantity={0}
        onQuantityChange={() => {}}
        onAdd={() => {}}
      />
    );
    expect(screen.getByText('Test Dish')).toBeInTheDocument();
  });

  test('renders item price', () => {
    render(
      <MenuItem
        item={mockItem}
        quantity={0}
        onQuantityChange={() => {}}
        onAdd={() => {}}
      />
    );
    expect(screen.getByText('₹250')).toBeInTheDocument();
  });

  test('renders item description', () => {
    render(
      <MenuItem
        item={mockItem}
        quantity={0}
        onQuantityChange={() => {}}
        onAdd={() => {}}
      />
    );
    expect(screen.getByText('A delicious test dish')).toBeInTheDocument();
  });

  test('shows Add button when quantity is 0', () => {
    render(
      <MenuItem
        item={mockItem}
        quantity={0}
        onQuantityChange={() => {}}
        onAdd={() => {}}
      />
    );
    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  test('shows quantity controls when quantity > 0', () => {
    render(
      <MenuItem
        item={mockItem}
        quantity={2}
        onQuantityChange={() => {}}
        onAdd={() => {}}
      />
    );
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  test('calls onQuantityChange when add button is clicked', () => {
    const onQuantityChange = jest.fn();
    render(
      <MenuItem
        item={mockItem}
        quantity={0}
        onQuantityChange={onQuantityChange}
        onAdd={() => {}}
      />
    );
    fireEvent.click(screen.getByText('Add'));
    expect(onQuantityChange).toHaveBeenCalledWith(1, 1);
  });

  test('displays veg indicator for veg items', () => {
    render(
      <MenuItem
        item={mockItem}
        quantity={0}
        onQuantityChange={() => {}}
        onAdd={() => {}}
      />
    );
    const vegIndicator = document.querySelector('.veg-indicator.veg');
    expect(vegIndicator).toBeInTheDocument();
  });

  test('displays non-veg indicator for non-veg items', () => {
    const nonVegItem = { ...mockItem, isVeg: false };
    render(
      <MenuItem
        item={nonVegItem}
        quantity={0}
        onQuantityChange={() => {}}
        onAdd={() => {}}
      />
    );
    const nonVegIndicator = document.querySelector('.veg-indicator.non-veg');
    expect(nonVegIndicator).toBeInTheDocument();
  });
});
