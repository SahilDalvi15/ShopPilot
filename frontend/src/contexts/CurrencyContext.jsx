import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

// Base exchange rates (Base: INR)
// In a real production app, this would be fetched from an API
const EXCHANGE_RATES = {
  INR: 1,
  USD: 0.012, // 1 INR = 0.012 USD
  EUR: 0.011, // 1 INR = 0.011 EUR
  GBP: 0.0095 // 1 INR = 0.0095 GBP
};

const CURRENCY_SYMBOLS = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£'
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    const savedCurrency = localStorage.getItem('shoppilot_currency');
    return savedCurrency || 'INR';
  });

  useEffect(() => {
    localStorage.setItem('shoppilot_currency', currency);
  }, [currency]);

  const formatPrice = (inrPrice) => {
    if (inrPrice === undefined || inrPrice === null) return '';
    
    // Convert to target currency
    const convertedPrice = inrPrice * EXCHANGE_RATES[currency];

    // Format the number
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: currency === 'INR' ? 0 : 2,
    }).format(convertedPrice);
  };

  const value = {
    currency,
    setCurrency,
    formatPrice,
    availableCurrencies: Object.keys(EXCHANGE_RATES),
    currencySymbol: CURRENCY_SYMBOLS[currency]
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};
