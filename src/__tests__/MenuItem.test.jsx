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
  test('renders menu item container', () => {
    const { container } = render(
      <MenuItem item={mockItem} quantity={0} onQuantityChange={() => {}} onAdd={() => {}} />
    );
    expect(container.querySelector('.menu-item')).toBeInTheDocument();
  });

  test('renders item details', () => {
    const { container } = render(
      <MenuItem item={mockItem} quantity={0} onQuantityChange={() => {}} onAdd={() => {}} />
    );
    expect(container.querySelector('.item-details')).toBeInTheDocument();
  });

  test('renders item name', () => {
    render(
      <MenuItem item={mockItem} quantity={0} onQuantityChange={() => {}} onAdd={() => {}} />
    );
    expect(screen.getByText('Test Dish')).toBeInTheDocument();
  });

  test('renders item price', () => {
    render(
      <MenuItem item={mockItem} quantity={0} onQuantityChange={() => {}} onAdd={() => {}} />
    );
    expect(screen.getByText('₹250')).toBeInTheDocument();
  });

  test('renders item description', () => {
    render(
      <MenuItem item={mockItem} quantity={0} onQuantityChange={() => {}} onAdd={() => {}} />
    );
    expect(screen.getByText('A delicious test dish')).toBeInTheDocument();
  });

  test('renders item header', () => {
    const { container } = render(
      <MenuItem item={mockItem} quantity={0} onQuantityChange={() => {}} onAdd={() => {}} />
    );
    expect(container.querySelector('.item-header')).toBeInTheDocument();
  });

  test('renders item name element', () => {
    const { container } = render(
      <MenuItem item={mockItem} quantity={0} onQuantityChange={() => {}} onAdd={() => {}} />
    );
    expect(container.querySelector('.item-name')).toBeInTheDocument();
  });

  test('renders item description element', () => {
    const { container } = render(
      <MenuItem item={mockItem} quantity={0} onQuantityChange={() => {}} onAdd={() => {}} />
    );
    expect(container.querySelector('.item-description')).toBeInTheDocument();
  });

  test('renders item price element', () => {
    const { container } = render(
      <MenuItem item={mockItem} quantity={0} onQuantityChange={() => {}} onAdd={() => {}} />
    );
    expect(container.querySelector('.item-price')).toBeInTheDocument();
  });

  test('renders item actions', () => {
    const { container } = render(
      <MenuItem item={mockItem} quantity={0} onQuantityChange={() => {}} onAdd={() => {}} />
    );
    expect(container.querySelector('.item-actions')).toBeInTheDocument();
  });

  test('shows Add button when quantity is 0', () => {
    render(
      <MenuItem item={mockItem} quantity={0} onQuantityChange={() => {}} onAdd={() => {}} />
    );
    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  test('shows quantity controls when quantity > 0', () => {
    render(
      <MenuItem item={mockItem} quantity={2} onQuantityChange={() => {}} onAdd={() => {}} />
    );
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  test('does not show quantity controls when quantity is 0', () => {
    const { container } = render(
      <MenuItem item={mockItem} quantity={0} onQuantityChange={() => {}} onAdd={() => {}} />
    );
    expect(container.querySelector('.quantity-control')).not.toBeInTheDocument();
  });

  test('renders quantity control when quantity > 0', () => {
    const { container } = render(
      <MenuItem item={mockItem} quantity={2} onQuantityChange={() => {}} onAdd={() => {}} />
    );
    expect(container.querySelector('.quantity-control')).toBeInTheDocument();
  });

  test('renders quantity value', () => {
    const { container } = render(
      <MenuItem item={mockItem} quantity={3} onQuantityChange={() => {}} onAdd={() => {}} />
    );
    expect(container.querySelector('.qty-value')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('renders minus button when quantity > 0', () => {
    const { container } = render(
      <MenuItem item={mockItem} quantity={2} onQuantityChange={() => {}} onAdd={() => {}} />
    );
    const buttons = container.querySelectorAll('.qty-btn');
    expect(buttons.length).toBe(2);
  });

  test('renders plus button when quantity > 0', () => {
    const { container } = render(
      <MenuItem item={mockItem} quantity={2} onQuantityChange={() => {}} onAdd={() => {}} />
    );
    expect(container.querySelectorAll('.qty-btn').length).toBe(2);
  });

  test('calls onQuantityChange when add button is clicked with quantity 0', () => {
    const onQuantityChange = jest.fn();
    render(
      <MenuItem item={mockItem} quantity={0} onQuantityChange={onQuantityChange} onAdd={() => {}} />
    );
    fireEvent.click(screen.getByText('Add'));
    expect(onQuantityChange).toHaveBeenCalledWith(1, 1);
  });

  test('calls onAdd when add button is clicked with quantity > 0', () => {
    const onAdd = jest.fn();
    render(
      <MenuItem item={mockItem} quantity={2} onQuantityChange={() => {}} onAdd={onAdd} />
    );
    fireEvent.click(screen.getByText('Add'));
    expect(onAdd).toHaveBeenCalledWith(mockItem);
  });

  test('calls onQuantityChange with -1 when minus button clicked', () => {
    const onQuantityChange = jest.fn();
    const { container } = render(
      <MenuItem item={mockItem} quantity={2} onQuantityChange={onQuantityChange} onAdd={() => {}} />
    );
    const minusBtn = container.querySelectorAll('.qty-btn')[0];
    fireEvent.click(minusBtn);
    expect(onQuantityChange).toHaveBeenCalledWith(1, -1);
  });

  test('calls onQuantityChange with +1 when plus button clicked', () => {
    const onQuantityChange = jest.fn();
    const { container } = render(
      <MenuItem item={mockItem} quantity={2} onQuantityChange={onQuantityChange} onAdd={() => {}} />
    );
    const plusBtn = container.querySelectorAll('.qty-btn')[1];
    fireEvent.click(plusBtn);
    expect(onQuantityChange).toHaveBeenCalledWith(1, 1);
  });

  test('displays veg indicator for veg items', () => {
    const { container } = render(
      <MenuItem item={mockItem} quantity={0} onQuantityChange={() => {}} onAdd={() => {}} />
    );
    expect(container.querySelector('.veg-indicator.veg')).toBeInTheDocument();
  });

  test('displays non-veg indicator for non-veg items', () => {
    const nonVegItem = { ...mockItem, isVeg: false };
    const { container } = render(
      <MenuItem item={nonVegItem} quantity={0} onQuantityChange={() => {}} onAdd={() => {}} />
    );
    expect(container.querySelector('.veg-indicator.non-veg')).toBeInTheDocument();
  });

  test('renders add button', () => {
    const { container } = render(
      <MenuItem item={mockItem} quantity={0} onQuantityChange={() => {}} onAdd={() => {}} />
    );
    expect(container.querySelector('.add-btn')).toBeInTheDocument();
  });

  test('add button shows Add with icon when quantity > 0', () => {
    const { container } = render(
      <MenuItem item={mockItem} quantity={2} onQuantityChange={() => {}} onAdd={() => {}} />
    );
    const addBtn = container.querySelector('.add-btn');
    expect(addBtn).toBeInTheDocument();
  });

  test('renders veg dot indicator', () => {
    const { container } = render(
      <MenuItem item={mockItem} quantity={0} onQuantityChange={() => {}} onAdd={() => {}} />
    );
    expect(container.querySelector('.veg-indicator .dot')).toBeInTheDocument();
  });

  test('handles quantity of 1 correctly', () => {
    const onQuantityChange = jest.fn();
    render(
      <MenuItem item={mockItem} quantity={1} onQuantityChange={onQuantityChange} onAdd={() => {}} />
    );
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  test('non-veg item shows Add text', () => {
    const nonVegItem = { ...mockItem, isVeg: false };
    render(
      <MenuItem item={nonVegItem} quantity={0} onQuantityChange={() => {}} onAdd={() => {}} />
    );
    expect(screen.getByText('Add')).toBeInTheDocument();
  });
});
