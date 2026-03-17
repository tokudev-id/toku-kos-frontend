/**
 * Formats a number as Indonesian Rupiah (IDR).
 * If amount >= 1,000,000, it formats as "Rp X.Xjt" for readability in tight spaces.
 */
export function formatCurrency(amount: number) {
  if (amount === undefined || amount === null) return 'Rp 0';
  if (amount >= 1_000_000) return `Rp ${(amount / 1_000_000).toFixed(1)}jt`;
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

/**
 * Formats a number as a detailed Indonesian Rupiah (IDR) without "jt" shorthand.
 */
export function formatCurrencyFull(amount: number) {
  if (amount === undefined || amount === null) return 'Rp 0';
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

/**
 * Formats a date string into a localized Indonesian date.
 */
export function formatDate(dateString: string | Date) {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
