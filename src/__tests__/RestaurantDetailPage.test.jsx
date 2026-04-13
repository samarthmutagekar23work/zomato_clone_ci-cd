import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RestaurantDetailPage from '../pages/RestaurantDetailPage/RestaurantDetailPage';
import { AppProvider } from '../context/AppContext';

jest.mock('react-transition-group', () => ({
  CSSTransition: ({ children }) => children,
}));

describe('RestaurantDetailPage Component', () => {
  test('renders restaurant not found when id is invalid', () => {
    render(
      <MemoryRouter initialEntries={['/restaurant/999']}>
        <AppProvider>
          <RestaurantDetailPage />
        </AppProvider>
      </MemoryRouter>
    );
    expect(screen.getByText('Restaurant not found')).toBeInTheDocument();
  });

  test('renders back to restaurants button when not found', () => {
    render(
      <MemoryRouter initialEntries={['/restaurant/999']}>
        <AppProvider>
          <RestaurantDetailPage />
        </AppProvider>
      </MemoryRouter>
    );
    expect(screen.getByText('Back to Restaurants')).toBeInTheDocument();
  });

  test('renders not found container', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/restaurant/999']}>
        <AppProvider>
          <RestaurantDetailPage />
        </AppProvider>
      </MemoryRouter>
    );
    expect(container.querySelector('.not-found')).toBeInTheDocument();
  });

  test('renders restaurant detail page container', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/restaurant/1']}>
        <AppProvider>
          <RestaurantDetailPage />
        </AppProvider>
      </MemoryRouter>
    );
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(container.querySelector('.restaurant-detail-page')).toBeInTheDocument();
  });
});
