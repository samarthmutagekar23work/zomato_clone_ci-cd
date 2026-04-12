import '@testing-library/jest-dom';
import { render, screen, fireEvent, act } from '@testing-library/react';
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

  test('renders restaurant detail page container', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/restaurant/1']}>
        <AppProvider>
          <RestaurantDetailPage />
        </AppProvider>
      </MemoryRouter>
    );
    expect(container.querySelector('.restaurant-detail-page')).toBeInTheDocument();
  });

  test('renders restaurant hero section', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/restaurant/1']}>
        <AppProvider>
          <RestaurantDetailPage />
        </AppProvider>
      </MemoryRouter>
    );
    expect(container.querySelector('.restaurant-hero')).toBeInTheDocument();
  });

  test('renders restaurant info bar', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/restaurant/1']}>
        <AppProvider>
          <RestaurantDetailPage />
        </AppProvider>
      </MemoryRouter>
    );
    expect(container.querySelector('.restaurant-info-bar')).toBeInTheDocument();
  });

  test('renders tabs section', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/restaurant/1']}>
        <AppProvider>
          <RestaurantDetailPage />
        </AppProvider>
      </MemoryRouter>
    );
    expect(container.querySelector('.tabs')).toBeInTheDocument();
  });

  test('renders menu tab button', () => {
    render(
      <MemoryRouter initialEntries={['/restaurant/1']}>
        <AppProvider>
          <RestaurantDetailPage />
        </AppProvider>
      </MemoryRouter>
    );
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  test('renders reviews tab button', () => {
    render(
      <MemoryRouter initialEntries={['/restaurant/1']}>
        <AppProvider>
          <RestaurantDetailPage />
        </AppProvider>
      </MemoryRouter>
    );
    expect(screen.getByText(/Reviews/)).toBeInTheDocument();
  });

  test('renders info tab button', () => {
    render(
      <MemoryRouter initialEntries={['/restaurant/1']}>
        <AppProvider>
          <RestaurantDetailPage />
        </AppProvider>
      </MemoryRouter>
    );
    expect(screen.getByText('Info')).toBeInTheDocument();
  });

  test('renders menu section by default', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/restaurant/1']}>
        <AppProvider>
          <RestaurantDetailPage />
        </AppProvider>
      </MemoryRouter>
    );
    expect(container.querySelector('.menu-section')).toBeInTheDocument();
  });

  test('switches to reviews tab when clicked', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/restaurant/1']}>
        <AppProvider>
          <RestaurantDetailPage />
        </AppProvider>
      </MemoryRouter>
    );
    const reviewsTab = container.querySelectorAll('.tab')[1];
    fireEvent.click(reviewsTab);
    expect(container.querySelector('.reviews-section')).toBeInTheDocument();
  });

  test('switches to info tab when clicked', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/restaurant/1']}>
        <AppProvider>
          <RestaurantDetailPage />
        </AppProvider>
      </MemoryRouter>
    );
    const infoTab = container.querySelectorAll('.tab')[2];
    fireEvent.click(infoTab);
    expect(container.querySelector('.info-section')).toBeInTheDocument();
  });

  test('renders back button in hero', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/restaurant/1']}>
        <AppProvider>
          <RestaurantDetailPage />
        </AppProvider>
      </MemoryRouter>
    );
    expect(container.querySelector('.back-btn')).toBeInTheDocument();
  });

  test('renders content area', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/restaurant/1']}>
        <AppProvider>
          <RestaurantDetailPage />
        </AppProvider>
      </MemoryRouter>
    );
    expect(container.querySelector('.content-area')).toBeInTheDocument();
  });

  test('renders menu items when menu tab is active', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/restaurant/1']}>
        <AppProvider>
          <RestaurantDetailPage />
        </AppProvider>
      </MemoryRouter>
    );
    expect(container.querySelector('.menu-items')).toBeInTheDocument();
  });
});
