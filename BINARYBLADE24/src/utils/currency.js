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

export const convertToZAR = (amount, currency) => {
  if (!rates[currency] || !rates.ZAR) {
    return null; // Rates not available
  }

  const amountInUSD = amount / rates[currency];
  const amountInZAR = amountInUSD * rates.ZAR;
  return amountInZAR;
};
