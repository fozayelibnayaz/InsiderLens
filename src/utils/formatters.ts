const compactCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 2,
});

const fullCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const filedFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

export function formatCompactCurrency(value: number) {
  return compactCurrency.format(value);
}

export function formatFullCurrency(value: number) {
  return fullCurrency.format(value);
}

export function formatShares(shares: number) {
  return `${new Intl.NumberFormat('en-US').format(shares)} shares`;
}

export function formatDate(isoDate: string) {
  return dateFormatter.format(new Date(isoDate));
}

export function formatFiledDateTime(isoDate: string) {
  return filedFormatter.format(new Date(isoDate));
}

export function formatFiledTime(isoDate: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(isoDate));
}