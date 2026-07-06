const currencyFormatters: Record<string, Intl.NumberFormat> = {}

export function formatCurrency(amount: number, currency: string): string {
  const key = `${currency}_${amount}`
  if (!currencyFormatters[key]) {
    currencyFormatters[key] = new Intl.NumberFormat('en-US', { style: 'currency', currency })
  }
  return currencyFormatters[key]!.format(amount)
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString))
}
