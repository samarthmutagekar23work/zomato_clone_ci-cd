import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterBar from '../components/FilterBar/FilterBar';

describe('FilterBar Component', () => {
  const defaultProps = {
    cuisines: ['Italian', 'Chinese', 'Indian', 'Mexican'],
    filters: {
      rating: 0,
      cuisine: '',
      priceRange: [0, 1000],
      sortBy: 'rating',
    },
    onFilterChange: jest.fn(),
    onReset: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders filter bar container', () => {
    const { container } = render(<FilterBar {...defaultProps} />);
    expect(container.querySelector('.filter-bar')).toBeInTheDocument();
  });

  test('renders sort by select', () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByText('Sort By')).toBeInTheDocument();
  });

  test('renders rating filter buttons', () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getAllByText('All').length).toBeGreaterThan(0);
    expect(screen.getByText('3+')).toBeInTheDocument();
  });

  test('renders cuisine select', () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByText('Cuisine')).toBeInTheDocument();
  });

  test('renders price range buttons', () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByText('Price Range')).toBeInTheDocument();
    expect(screen.getByText('Under ₹300')).toBeInTheDocument();
  });

  test('calls onFilterChange when rating is changed', () => {
    render(<FilterBar {...defaultProps} />);
    fireEvent.click(screen.getByText('4+'));
    expect(defaultProps.onFilterChange).toHaveBeenCalledWith({ rating: 4 });
  });

  test('calls onFilterChange when cuisine is changed', () => {
    render(<FilterBar {...defaultProps} />);
    const select = document.querySelector('.filter-group:nth-child(3) select');
    fireEvent.change(select, { target: { value: 'Italian' } });
    expect(defaultProps.onFilterChange).toHaveBeenCalledWith({ cuisine: 'Italian' });
  });

  test('calls onFilterChange when price range is changed', () => {
    render(<FilterBar {...defaultProps} />);
    fireEvent.click(screen.getByText('Under ₹300'));
    expect(defaultProps.onFilterChange).toHaveBeenCalledWith({ priceRange: [0, 300] });
  });

  test('calls onFilterChange when sort is changed', () => {
    render(<FilterBar {...defaultProps} />);
    const select = document.querySelector('.filter-group:nth-child(1) select');
    fireEvent.change(select, { target: { value: 'price-low' } });
    expect(defaultProps.onFilterChange).toHaveBeenCalledWith({ sortBy: 'price-low' });
  });

  test('shows clear filters button when filters are active', () => {
    const filtersWithRating = {
      rating: 4,
      cuisine: '',
      priceRange: [0, 1000],
      sortBy: 'rating',
    };
    render(<FilterBar {...defaultProps} filters={filtersWithRating} />);
    expect(screen.getByText('Clear All Filters (1)')).toBeInTheDocument();
  });

  test('shows clear filters button when cuisine is selected', () => {
    const filtersWithCuisine = {
      rating: 0,
      cuisine: 'Italian',
      priceRange: [0, 1000],
      sortBy: 'rating',
    };
    render(<FilterBar {...defaultProps} filters={filtersWithCuisine} />);
    expect(screen.getByText('Clear All Filters (1)')).toBeInTheDocument();
  });

  test('shows clear filters button when price range is changed', () => {
    const filtersWithPrice = {
      rating: 0,
      cuisine: '',
      priceRange: [0, 300],
      sortBy: 'rating',
    };
    render(<FilterBar {...defaultProps} filters={filtersWithPrice} />);
    expect(screen.getByText('Clear All Filters (1)')).toBeInTheDocument();
  });

  test('calls onReset when clear filters is clicked', () => {
    const filtersWithRating = {
      rating: 4,
      cuisine: '',
      priceRange: [0, 1000],
      sortBy: 'rating',
    };
    render(<FilterBar {...defaultProps} filters={filtersWithRating} />);
    fireEvent.click(screen.getByText('Clear All Filters (1)'));
    expect(defaultProps.onReset).toHaveBeenCalled();
  });

  test('renders all cuisine options', () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByText('Italian')).toBeInTheDocument();
    expect(screen.getByText('Chinese')).toBeInTheDocument();
    expect(screen.getByText('Indian')).toBeInTheDocument();
    expect(screen.getByText('Mexican')).toBeInTheDocument();
  });

  test('renders all rating options', () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByText('3.5+')).toBeInTheDocument();
    expect(screen.getByText('4.5+')).toBeInTheDocument();
  });

  test('renders all price range options', () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByText('₹300 - ₹500')).toBeInTheDocument();
    expect(screen.getByText('₹500 - ₹700')).toBeInTheDocument();
    expect(screen.getByText('₹700+')).toBeInTheDocument();
  });

  test('does not show clear filters when no filters are active', () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.queryByText(/Clear All Filters/)).not.toBeInTheDocument();
  });

  test('active rating button has active class', () => {
    const filtersWithRating = {
      rating: 4,
      cuisine: '',
      priceRange: [0, 1000],
      sortBy: 'rating',
    };
    render(<FilterBar {...defaultProps} filters={filtersWithRating} />);
    const ratingButtons = document.querySelectorAll('.rating-btn');
    const activeButton = Array.from(ratingButtons).find(btn => btn.classList.contains('active'));
    expect(activeButton).toBeInTheDocument();
  });
});
