import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Footer from '../components/Footer/Footer';

describe('Footer Component', () => {
  test('renders footer with correct class', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('.footer')).toBeInTheDocument();
  });

  test('renders footer main section', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('.footer-main')).toBeInTheDocument();
  });

  test('renders footer top section', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('.footer-top')).toBeInTheDocument();
  });

  test('renders footer top left', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('.top-left')).toBeInTheDocument();
  });

  test('renders logo text', () => {
    render(<Footer />);
    expect(screen.getAllByText('Zomato').length).toBeGreaterThan(0);
  });

  test('renders logo icon', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('.logo-icon')).toBeInTheDocument();
  });

  test('renders language select wrapper', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('.lang')).toBeInTheDocument();
  });

  test('renders select elements', () => {
    const { container } = render(<Footer />);
    const selects = container.querySelectorAll('select');
    expect(selects.length).toBe(2);
  });

  test('renders first select with country options', () => {
    const { container } = render(<Footer />);
    const firstSelect = container.querySelectorAll('select')[0];
    expect(firstSelect.options[0].text).toBe('🇮🇳 India');
  });

  test('renders second select with language options', () => {
    const { container } = render(<Footer />);
    const secondSelect = container.querySelectorAll('select')[1];
    expect(secondSelect.options[0].text).toBe('🌐 English');
  });

  test('renders footer links section', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('.footer-links')).toBeInTheDocument();
  });

  test('renders all footer columns', () => {
    const { container } = render(<Footer />);
    const columns = container.querySelectorAll('.footer-column');
    expect(columns.length).toBe(5);
  });

  test('renders ABOUT ZOMATO column', () => {
    render(<Footer />);
    expect(screen.getByText('ABOUT ZOMATO')).toBeInTheDocument();
  });

  test('renders ZOMAVERSE column', () => {
    render(<Footer />);
    expect(screen.getByText('ZOMAVERSE')).toBeInTheDocument();
  });

  test('renders FOR RESTAURANTS column', () => {
    render(<Footer />);
    expect(screen.getByText('FOR RESTAURANTS')).toBeInTheDocument();
  });

  test('renders FOR ENTERPRISES', () => {
    render(<Footer />);
    expect(screen.getByText('For Enterprises')).toBeInTheDocument();
  });

  test('renders LEARN MORE column', () => {
    render(<Footer />);
    expect(screen.getByText('LEARN MORE')).toBeInTheDocument();
  });

  test('renders SOCIAL LINKS column', () => {
    render(<Footer />);
    expect(screen.getByText('SOCIAL LINKS')).toBeInTheDocument();
  });

  test('renders social icons container', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('.social-icons')).toBeInTheDocument();
  });

  test('renders social icon links', () => {
    const { container } = render(<Footer />);
    const socialIcons = container.querySelectorAll('.social-icon');
    expect(socialIcons.length).toBe(5);
  });

  test('renders store images', () => {
    const { container } = render(<Footer />);
    const storeImgs = container.querySelectorAll('.store-img');
    expect(storeImgs.length).toBe(2);
  });

  test('renders footer divider', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('.footer-divider')).toBeInTheDocument();
  });

  test('renders footer bottom', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('.footer-bottom')).toBeInTheDocument();
  });

  test('renders copyright text', () => {
    render(<Footer />);
    expect(screen.getByText(/2008-2022/)).toBeInTheDocument();
  });

  test('renders terms text', () => {
    render(<Footer />);
    expect(screen.getByText(/Terms of Service/)).toBeInTheDocument();
  });

  test('renders cookie policy text', () => {
    render(<Footer />);
    expect(screen.getByText(/Cookie Policy/)).toBeInTheDocument();
  });

  test('renders privacy text', () => {
    render(<Footer />);
    expect(screen.getAllByText(/Privacy/).length).toBeGreaterThan(0);
  });

  test('renders scroll top button', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('.scroll-top-btn')).toBeInTheDocument();
  });

  test('scroll top button has onClick handler', () => {
    const { container } = render(<Footer />);
    const scrollBtn = container.querySelector('.scroll-top-btn');
    fireEvent.click(scrollBtn);
  });

  test('renders all link texts in ABOUT ZOMATO', () => {
    render(<Footer />);
    expect(screen.getByText('who we are')).toBeInTheDocument();
    expect(screen.getByText('blog')).toBeInTheDocument();
    expect(screen.getByText('work with us')).toBeInTheDocument();
    expect(screen.getByText('Investor Relations')).toBeInTheDocument();
    expect(screen.getByText('Report Fraud')).toBeInTheDocument();
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  test('renders all link texts in ZOMAVERSE', () => {
    render(<Footer />);
    expect(screen.getAllByText('Zomato').length).toBeGreaterThan(0);
    expect(screen.getByText('Blinkit')).toBeInTheDocument();
    expect(screen.getByText('Feeding India')).toBeInTheDocument();
    expect(screen.getByText('HyperPure')).toBeInTheDocument();
    expect(screen.getByText('Zomaland')).toBeInTheDocument();
  });

  test('renders all link texts in FOR RESTAURANTS', () => {
    render(<Footer />);
    expect(screen.getByText('Partner with Us')).toBeInTheDocument();
    expect(screen.getByText('Apps For you')).toBeInTheDocument();
    expect(screen.getByText('Zomato for work')).toBeInTheDocument();
  });

  test('renders all link texts in LEARN MORE', () => {
    render(<Footer />);
    expect(screen.getByText('Security')).toBeInTheDocument();
    expect(screen.getByText('Terms')).toBeInTheDocument();
    expect(screen.getByText('Sitemap')).toBeInTheDocument();
  });

  test('footer main is rendered', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('.footer-main')).toBeInTheDocument();
  });

  test('footer column h4 elements exist', () => {
    const { container } = render(<Footer />);
    const h4s = container.querySelectorAll('.footer-column h4');
    expect(h4s.length).toBeGreaterThan(0);
  });

  test('renders footer links as anchor tags', () => {
    const { container } = render(<Footer />);
    const links = container.querySelectorAll('.footer-column a');
    expect(links.length).toBeGreaterThan(0);
  });

  test('social column has correct class', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('.social-column')).toBeInTheDocument();
  });

  test('renders mt-20 class element', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('.mt-20')).toBeInTheDocument();
  });

  test('language selects have correct wrapper class', () => {
    const { container } = render(<Footer />);
    const wrappers = container.querySelectorAll('.select-wrapper');
    expect(wrappers.length).toBe(2);
  });
});
