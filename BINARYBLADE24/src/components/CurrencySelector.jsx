import React from 'react';
import { useCurrency } from '../contexts/CurrencyContext';

const CurrencySelector = ({ className = '' }) => {
    const { userCurrency, setUserCurrency, availableCurrencies, priorityCurrencies, loading } = useCurrency();

    if (loading) {
        return (
            <div className={`flex items-center ${className}`}>
                <span className="text-sm text-gray-500">Loading currencies...</span>
            </div>
        );
    }

    const handleCurrencyChange = (event) => {
        setUserCurrency(event.target.value);
    };

    // Separate priority and other currencies
    const otherCurrencies = availableCurrencies.filter(
        curr => !priorityCurrencies.includes(curr)
    );

    return (
        <div className={`currency-selector ${className}`}>
            <label htmlFor="currency-select" className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Currency
            </label>
            <select
                id="currency-select"
                value={userCurrency}
                onChange={handleCurrencyChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all duration-200"
            >
                {/* Priority Currencies */}
                <optgroup label="Most Popular">
                    {priorityCurrencies.map((currency) => (
                        <option key={currency} value={currency}>
                            {currency} - {getCurrencyName(currency)}
                        </option>
                    ))}
                </optgroup>

                {/* Divider */}
                <option disabled>──────────</option>

                {/* Other Currencies */}
                <optgroup label="All Currencies">
                    {otherCurrencies.map((currency) => (
                        <option key={currency} value={currency}>
                            {currency} - {getCurrencyName(currency)}
                        </option>
                    ))}
                </optgroup>
            </select>

            <p className="mt-2 text-xs text-gray-500">
                All prices will be displayed in your preferred currency
            </p>
        </div>
    );
};

// Helper function to get currency names
const getCurrencyName = (code) => {
    const currencyNames = {
        USD: 'US Dollar',
        EUR: 'Euro',
        GBP: 'British Pound',
        ZAR: 'South African Rand',
        JPY: 'Japanese Yen',
        CNY: 'Chinese Yuan',
        INR: 'Indian Rupee',
        AUD: 'Australian Dollar',
        CAD: 'Canadian Dollar',
        CHF: 'Swiss Franc',
        SEK: 'Swedish Krona',
        NOK: 'Norwegian Krone',
        DKK: 'Danish Krone',
        NZD: 'New Zealand Dollar',
        SGD: 'Singapore Dollar',
        HKD: 'Hong Kong Dollar',
        KRW: 'South Korean Won',
        MXN: 'Mexican Peso',
        BRL: 'Brazilian Real',
        RUB: 'Russian Ruble',
        TRY: 'Turkish Lira',
        PLN: 'Polish Złoty',
        THB: 'Thai Baht',
        IDR: 'Indonesian Rupiah',
        MYR: 'Malaysian Ringgit',
        PHP: 'Philippine Peso',
        CZK: 'Czech Koruna',
        ILS: 'Israeli Shekel',
        CLP: 'Chilean Peso',
        AED: 'UAE Dirham',
        SAR: 'Saudi Riyal',
        // Add more as needed
    };

    return currencyNames[code] || code;
};

export default CurrencySelector;
