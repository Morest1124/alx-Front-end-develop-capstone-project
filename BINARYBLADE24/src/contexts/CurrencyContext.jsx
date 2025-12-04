import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchRates, convertCurrency, formatCurrency, getAllCurrencies, PRIORITY_CURRENCIES } from '../utils/currency';
import { AuthContext } from './AuthContext';
import { getUserPreferences, updateUserPreferences } from '../api';

// Create the Currency Context
export const CurrencyContext = createContext();

// Currency Provider Component
export const CurrencyProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [userCurrency, setUserCurrency] = useState('USD'); // Default to USD
    const [exchangeRates, setExchangeRates] = useState({});
    const [loading, setLoading] = useState(true);

    // Fetch exchange rates on mount
    useEffect(() => {
        const loadRates = async () => {
            const rates = await fetchRates();
            if (rates) {
                setExchangeRates(rates);
            }
            setLoading(false);
        };
        loadRates();

        // Refresh rates every hour
        const interval = setInterval(loadRates, 60 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    // Load user's preferred currency from preferences
    useEffect(() => {
        const loadUserCurrency = async () => {
            if (user.isLoggedIn) {
                try {
                    const preferences = await getUserPreferences();
                    if (preferences.preferred_currency) {
                        setUserCurrency(preferences.preferred_currency);
                    }
                } catch (error) {
                    console.error('Failed to load user currency preference:', error);
                    // Keep default USD if loading fails
                }
            } else {
                // For non-logged-in users, check localStorage
                const savedCurrency = localStorage.getItem('preferred_currency');
                if (savedCurrency) {
                    setUserCurrency(savedCurrency);
                }
            }
        };
        loadUserCurrency();
    }, [user.isLoggedIn]);

    // Update currency preference
    const updateCurrency = async (newCurrency) => {
        setUserCurrency(newCurrency);

        if (user.isLoggedIn) {
            // Update in backend for logged-in users
            try {
                await updateUserPreferences({ preferred_currency: newCurrency });
            } catch (error) {
                console.error('Failed to update currency preference:', error);
            }
        } else {
            // Save to localStorage for non-logged-in users
            localStorage.setItem('preferred_currency', newCurrency);
        }
    };

    // Helper function to format price in user's currency
    const formatPrice = (amount, originalCurrency = 'USD') => {
        return formatCurrency(amount, originalCurrency, userCurrency, exchangeRates);
    };

    // Helper function to convert price to user's currency
    const convertPrice = (amount, originalCurrency = 'USD') => {
        return convertCurrency(amount, originalCurrency, userCurrency, exchangeRates);
    };

    const value = {
        userCurrency,
        setUserCurrency: updateCurrency,
        exchangeRates,
        loading,
        formatPrice,
        convertPrice,
        availableCurrencies: getAllCurrencies(),
        priorityCurrencies: PRIORITY_CURRENCIES,
    };

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
};

// Custom hook to use currency context
export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};

export default CurrencyProvider;
