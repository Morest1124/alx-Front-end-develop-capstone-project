const API_URL = 'https://open.exchangerate-api.com/v6/latest';

let rates = {};

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

export const convertToZAR = (amount, currency = 'USD') => {
  if (!rates[currency] || !rates.ZAR) {
    return null; // Rates not available
  }

  // Assuming the base currency of the rates API is USD.
  // If the provided currency is not USD, first convert it to USD.
  const amountInUSD = currency === 'USD' ? amount : amount / rates[currency];
  const amountInZAR = amountInUSD * rates.ZAR;
  return amountInZAR;
};

export const formatToZAR = (amount, originalCurrency = 'USD') => {
  const amountInZAR = convertToZAR(amount, originalCurrency);
  if (amountInZAR === null) {
    // Fallback to showing the original amount if conversion is not possible
    return `${Number(amount).toLocaleString()}`;
  }
  return `R${amountInZAR.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
