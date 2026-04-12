import '@testing-library/jest-dom';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import CheckoutPage from '../pages/CheckoutPage/CheckoutPage';
import { AppProvider } from '../context/AppContext';

jest.mock('react-transition-group', () => ({
  CSSTransition: ({ children }) => children,
}));

const mockCartItem = {
  id: 1,
  restaurantId: 'r1',
  restaurantName: 'Test Restaurant',
  name: 'Test Item',
  price: 250,
  quantity: 2,
  isVeg: true,
};

const TestWrapper = ({ children, cartItems = [] }) => (
  <MemoryRouter initialEntries={['/checkout']}>
    <AppProvider>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </AppProvider>
  </MemoryRouter>
);

const renderWithProviders = (ui) => {
  return render(ui, { wrapper: TestWrapper });
};

describe('CheckoutPage Component', () => {
  test('renders checkout page container', () => {
    const { container } = renderWithProviders(<CheckoutPage />);
    expect(container.querySelector('.checkout-page')).toBeInTheDocument();
  });

  test('renders checkout container', () => {
    const { container } = renderWithProviders(<CheckoutPage />);
    expect(container.querySelector('.checkout-container')).toBeInTheDocument();
  });

  test('renders steps indicator', () => {
    const { container } = renderWithProviders(<CheckoutPage />);
    expect(container.querySelector('.steps')).toBeInTheDocument();
  });

  test('renders checkout main section', () => {
    const { container } = renderWithProviders(<CheckoutPage />);
    expect(container.querySelector('.checkout-main')).toBeInTheDocument();
  });

  test('renders order summary section', () => {
    const { container } = renderWithProviders(<CheckoutPage />);
    expect(container.querySelector('.order-summary')).toBeInTheDocument();
  });

  test('renders address section header', () => {
    renderWithProviders(<CheckoutPage />);
    expect(screen.getByText('Delivery Address')).toBeInTheDocument();
  });

  test('renders address form fields', () => {
    renderWithProviders(<CheckoutPage />);
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter phone number')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter street address')).toBeInTheDocument();
  });

  test('renders pincode field', () => {
    renderWithProviders(<CheckoutPage />);
    expect(screen.getByPlaceholderText('6 digit pincode')).toBeInTheDocument();
  });

  test('renders continue to payment button', () => {
    renderWithProviders(<CheckoutPage />);
    expect(screen.getByText('Continue to Payment')).toBeInTheDocument();
  });

  test('button is disabled when address is invalid', () => {
    renderWithProviders(<CheckoutPage />);
    const button = screen.getByText('Continue to Payment');
    expect(button).toBeDisabled();
  });

  test('button is enabled when address is valid', async () => {
    renderWithProviders(<CheckoutPage />);
    const nameInput = screen.getByPlaceholderText('Enter your name');
    const phoneInput = screen.getByPlaceholderText('Enter phone number');
    const streetInput = screen.getByPlaceholderText('Enter street address');
    const pincodeInput = screen.getByPlaceholderText('6 digit pincode');

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(phoneInput, { target: { value: '9876543210' } });
      fireEvent.change(streetInput, { target: { value: '123 Main St' } });
      fireEvent.change(pincodeInput, { target: { value: '590001' } });
    });

    const button = screen.getByText('Continue to Payment');
    expect(button).not.toBeDisabled();
  });

  test('can proceed to payment step with valid address', async () => {
    renderWithProviders(<CheckoutPage />);
    
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Enter your name'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByPlaceholderText('Enter phone number'), { target: { value: '9876543210' } });
      fireEvent.change(screen.getByPlaceholderText('Enter street address'), { target: { value: '123 Main St' } });
      fireEvent.change(screen.getByPlaceholderText('6 digit pincode'), { target: { value: '590001' } });
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Continue to Payment'));
    });

    expect(screen.getByText('Payment Method')).toBeInTheDocument();
  });

  test('renders payment options', async () => {
    renderWithProviders(<CheckoutPage />);
    
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Enter your name'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByPlaceholderText('Enter phone number'), { target: { value: '9876543210' } });
      fireEvent.change(screen.getByPlaceholderText('Enter street address'), { target: { value: '123 Main St' } });
      fireEvent.change(screen.getByPlaceholderText('6 digit pincode'), { target: { value: '590001' } });
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Continue to Payment'));
    });

    expect(screen.getByText('Credit/Debit Card')).toBeInTheDocument();
    expect(screen.getByText('UPI')).toBeInTheDocument();
    expect(screen.getByText('Wallet')).toBeInTheDocument();
    expect(screen.getByText('Cash on Delivery')).toBeInTheDocument();
  });

  test('can select payment method', async () => {
    renderWithProviders(<CheckoutPage />);
    
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Enter your name'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByPlaceholderText('Enter phone number'), { target: { value: '9876543210' } });
      fireEvent.change(screen.getByPlaceholderText('Enter street address'), { target: { value: '123 Main St' } });
      fireEvent.change(screen.getByPlaceholderText('6 digit pincode'), { target: { value: '590001' } });
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Continue to Payment'));
    });

    await act(async () => {
      fireEvent.click(screen.getByText('UPI'));
    });

    const upiOption = screen.getByText('UPI').closest('.payment-option');
    expect(upiOption).toHaveClass('selected');
  });

  test('can go to review step', async () => {
    renderWithProviders(<CheckoutPage />);
    
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Enter your name'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByPlaceholderText('Enter phone number'), { target: { value: '9876543210' } });
      fireEvent.change(screen.getByPlaceholderText('Enter street address'), { target: { value: '123 Main St' } });
      fireEvent.change(screen.getByPlaceholderText('6 digit pincode'), { target: { value: '590001' } });
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Continue to Payment'));
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Review Order'));
    });

    expect(screen.getByText('Review Your Order')).toBeInTheDocument();
  });

  test('renders delivery address in review', async () => {
    renderWithProviders(<CheckoutPage />);
    
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Enter your name'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByPlaceholderText('Enter phone number'), { target: { value: '9876543210' } });
      fireEvent.change(screen.getByPlaceholderText('Enter street address'), { target: { value: '123 Main St' } });
      fireEvent.change(screen.getByPlaceholderText('6 digit pincode'), { target: { value: '590001' } });
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Continue to Payment'));
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Review Order'));
    });

    expect(screen.getByText('Delivery Address')).toBeInTheDocument();
    expect(screen.getByText('Order Details')).toBeInTheDocument();
  });

  test('renders back button in payment step', async () => {
    renderWithProviders(<CheckoutPage />);
    
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Enter your name'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByPlaceholderText('Enter phone number'), { target: { value: '9876543210' } });
      fireEvent.change(screen.getByPlaceholderText('Enter street address'), { target: { value: '123 Main St' } });
      fireEvent.change(screen.getByPlaceholderText('6 digit pincode'), { target: { value: '590001' } });
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Continue to Payment'));
    });

    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  test('can go back from payment to address step', async () => {
    renderWithProviders(<CheckoutPage />);
    
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Enter your name'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByPlaceholderText('Enter phone number'), { target: { value: '9876543210' } });
      fireEvent.change(screen.getByPlaceholderText('Enter phone number'), { target: { value: '9876543210' } });
      fireEvent.change(screen.getByPlaceholderText('Enter street address'), { target: { value: '123 Main St' } });
      fireEvent.change(screen.getByPlaceholderText('6 digit pincode'), { target: { value: '590001' } });
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Continue to Payment'));
    });

    await act(async () => {
      fireEvent.click(screen.getAllByText('Back')[0]);
    });

    expect(screen.getByText('Delivery Address')).toBeInTheDocument();
  });
});
