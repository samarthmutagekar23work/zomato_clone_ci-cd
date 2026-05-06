export function formatPrice(price: number): string {
  return `Rs.${price}`;
}

export function formatTime(date: Date | string): string {
  return new Date(date).toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getRatingColor(rating: number): string {
  if (rating >= 4.5) return 'bg-green-700';
  if (rating >= 4.0) return 'bg-green-500';
  if (rating >= 3.5) return 'bg-yellow-500';
  return 'bg-red-500';
}

export function getRatingTextColor(rating: number): string {
  if (rating >= 4.5) return 'text-green-700';
  if (rating >= 4.0) return 'text-green-500';
  if (rating >= 3.5) return 'text-yellow-500';
  return 'text-red-500';
}

export function getRatingBgColor(rating: number): string {
  if (rating >= 4.5) return 'bg-green-50 dark:bg-green-900/20';
  if (rating >= 4.0) return 'bg-green-50 dark:bg-green-900/10';
  if (rating >= 3.5) return 'bg-yellow-50 dark:bg-yellow-900/10';
  return 'bg-red-50 dark:bg-red-900/10';
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function debounce<T extends (...args: unknown[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

export function generateRandomOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function calculateEstimatedDelivery(deliveryTime: number): string {
  const now = new Date();
  const eta = new Date(now.getTime() + deliveryTime * 60000);
  return eta.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export function getDiscountAmount(original: number, discountPercent: number): number {
  return Math.round(original - (original * discountPercent) / 100);
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''));
}

export function getTimeAgo(date: string): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
}

export function generateOrderId(): string {
  return `ZOM${Date.now().toString().slice(-8)}`;
}

export function calculateCartTotals(items: Array<{ menuItem: { price: number }; quantity: number }>, couponDiscount: number = 0) {
  const subtotal = items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const deliveryFee = subtotal >= 299 ? 25 : 40;
  const discount = Math.min(couponDiscount, subtotal * 0.5);
  const taxes = Math.round((subtotal - discount) * 0.05);
  const total = subtotal + deliveryFee + taxes - discount;

  return { subtotal, deliveryFee, discount, taxes, total };
}
