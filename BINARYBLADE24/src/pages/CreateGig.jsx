import React, { useState, useContext } from "react";
import { createGig } from "../api";
import { useRouter } from "../contexts/Routers";
import { useCurrency } from '../contexts/CurrencyContext';
import { AuthContext } from '../contexts/AuthContext';
const CreateGig = () => {
  const { navigate } = useRouter();
  const { formatPrice, userCurrency, exchangeRates } = useCurrency(); // Import Currency Context context
  const [gigData, setGigData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGigData({ ...gigData, [name]: value });
  };

  const handleImageChange = (e) => {
    setGigData({ ...gigData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Convert Price from User Currency to USD (Base Currency)
    // Backend expects USD
    let priceInUSD = gigData.price;
    if (userCurrency !== 'USD') {
      // Inverse calculation: UserValue / Rate = BaseValue
      if (exchangeRates[userCurrency]) {
        priceInUSD = parseFloat(gigData.price) / exchangeRates[userCurrency];
      }
    }

    const formData = new FormData();
    formData.append("title", gigData.title);
    formData.append("description", gigData.description);
    formData.append("category", gigData.category);
    formData.append("price", priceInUSD);
    if (gigData.image) {
      formData.append("image", gigData.image);
    }

    try {
      await createGig(formData);
      navigate("/freelancer/gigs");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Create a New Gig</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-[var(--color-error-light)] border border-[var(--color-error)] text-[var(--color-error)] px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Gig Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={gigData.title}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Gig Description
          </label>
          <textarea
            name="description"
            id="description"
            rows="4"
            value={gigData.description}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] sm:text-sm"
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            name="category"
            id="category"
            value={gigData.category}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] sm:text-sm"
            required
          >
            <option value="">Select a category</option>
            <option value="web-development">Web Development</option>
            <option value="graphic-design">Graphic Design</option>
            <option value="digital-marketing">Digital Marketing</option>
            <option value="writing-translation">Writing & Translation</option>
          </select>
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price ({userCurrency})
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">{userCurrency}</span>
            <input
              type="number"
              name="price"
              id="price"
              value={gigData.price}
              onChange={handleChange}
              className="mt-1 block w-full pl-12 pr-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] sm:text-sm"
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Upload Image
          </label>
          <input
            type="file"
            name="image"
            id="image"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-accent-light)] file:text-[var(--color-accent)] hover:file:bg-[var(--color-accent-hover)] hover:file:text-white"
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white btn-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent)]"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Gig"}
          </button>
        </div>
      </form >
    </div >
  );
};

export default CreateGig;