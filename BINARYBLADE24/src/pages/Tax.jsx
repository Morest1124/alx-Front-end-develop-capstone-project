import React, { useState } from 'react';

const Tax = () => {
  const [country, setCountry] = useState('US');

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
  };

  const renderTaxInfo = () => {
    switch (country) {
      case 'US':
        return <p>Here is the tax information for the United States.</p>;
      case 'CA':
        return <p>Here is the tax information for Canada.</p>;
      case 'ZA':
        return <p>Here is the tax information for South Africa.</p>;
      default:
        return <p>Please select a country to see the tax information.</p>;
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-4xl font-bold mb-4">Tax Information</h2>
      <div className="mb-4">
        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
          Select your country:
        </label>
        <select
          id="country"
          name="country"
          value={country}
          onChange={handleCountryChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md"
        >
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          <option value="ZA">South Africa</option>
        </select>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {renderTaxInfo()}
      </div>
    </div>
  );
};

export default Tax;
