const API_URL = 'https://open.exchangerate-api.com/v6/latest';

// Priority currencies to show at the top of selectors
export const PRIORITY_CURRENCIES = ['USD', 'EUR', 'GBP', 'ZAR'];

// Currency symbols mapping
export const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  ZAR: 'R',
  JPY: '¥',
  CNY: '¥',
  INR: '₹',
  AUD: 'A$',
  CAD: 'C$',
  CHF: 'Fr',
  // Add more as needed
};

// Global rates cache
let rates = {};

/**
 * Fetch exchange rates from API
 */
export const fetchRates = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    rates = data.rates;
    return rates;
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error);
    return null;
  }
};

/**
 * Convert amount from one currency to another
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency code (e.g., 'USD')
 * @param {string} toCurrency - Target currency code (e.g., 'EUR')
 * @param {object} exchangeRates - Optional rates object, uses global rates if not provided
 * @returns {number|null} Converted amount or null if rates unavailable
 */
export const convertCurrency = (amount, fromCurrency, toCurrency, exchangeRates = null) => {
  const ratesData = exchangeRates || rates;

  if (!ratesData[fromCurrency] || !ratesData[toCurrency]) {
    console.warn(`Exchange rates not available for ${fromCurrency} -> ${toCurrency}`);
    return null;
  }

  // If same currency, no conversion needed
  if (fromCurrency === toCurrency) {
    return amount;
  }

  // Convert to USD first (base currency), then to target currency
  const amountInUSD = fromCurrency === 'USD' ? amount : amount / ratesData[fromCurrency];
  const convertedAmount = toCurrency === 'USD' ? amountInUSD : amountInUSD * ratesData[toCurrency];

  return convertedAmount;
};

/**
 * Format currency with symbol and amount
 * @param {number} amount - Amount to format
 * @param {string} fromCurrency - Currency code of the original amount
 * @param {string} toCurrency - Currency code to convert and display in
 * @param {object} exchangeRates - Optional rates object
 * @returns {string} Formatted currency string (e.g., "$1,234.56" or "€1.234,56")
 */
export const formatCurrency = (amount, fromCurrency = 'USD', toCurrency = 'USD', exchangeRates = null) => {
  const convertedAmount = convertCurrency(amount, fromCurrency, toCurrency, exchangeRates);

  if (convertedAmount === null) {
    // Fallback to showing original amount if conversion fails
    const symbol = CURRENCY_SYMBOLS[fromCurrency] || fromCurrency;
    return `${symbol}${Number(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  const symbol = CURRENCY_SYMBOLS[toCurrency] || toCurrency;
  const formattedAmount = convertedAmount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // For symbols that go after the amount (rare, but good to support)
  if (['CZK', 'PLN', 'SEK', 'NOK', 'DKK'].includes(toCurrency)) {
    return `${formattedAmount} ${symbol}`;
  }

  return `${symbol}${formattedAmount}`;
};

/**
 * Get all available currencies sorted with priority currencies first
 * @returns {string[]} Array of currency codes
 */
export const getAllCurrencies = () => {
  const allCurrencies = Object.keys(rates).sort();

  // Remove priority currencies from the main list
  const otherCurrencies = allCurrencies.filter(
    currency => !PRIORITY_CURRENCIES.includes(currency)
  );

  // Return priority currencies first, then others
  return [...PRIORITY_CURRENCIES, ...otherCurrencies];
};

// Legacy function for backward compatibility (will be deprecated)
export const convertToZAR = (amount, currency = 'USD') => {
  return convertCurrency(amount, currency, 'ZAR');
};

// Legacy function for backward compatibility (will be deprecated)
export const formatToZAR = (amount, originalCurrency = 'USD') => {
  return formatCurrency(amount, originalCurrency, 'ZAR');
};
