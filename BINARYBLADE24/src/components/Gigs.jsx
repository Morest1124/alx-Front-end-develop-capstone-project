import React, { useState } from 'react';

const gigs = [
  {
    id: 1,
    title: "I will create a professional logo design",
    price: 50,
    delivery_days: 3,
    rating: 4.9,
    thumbnail: "https://via.placeholder.com/300x200.png?text=Logo+Design",
  },
  {
    id: 2,
    title: "I will build a responsive WordPress website",
    price: 200,
    delivery_days: 7,
    rating: 4.8,
    thumbnail: "https://via.placeholder.com/300x200.png?text=WordPress+Site",
  },
  {
    id: 3,
    title: "I will create a professional logo design",
    price: 50,
    delivery_days: 3,
    rating: 4.9,
    thumbnail: "https://via.placeholder.com/300x200.png?text=Logo+Design",
  },
  {
    id: 4,
    title: "I will build a responsive WordPress website",
    price: 200,
    delivery_days: 7,
    rating: 4.8,
    thumbnail: "https://via.placeholder.com/300x200.png?text=WordPress+Site",
  },
  {
    id: 5,
    title: "I will create a professional logo design",
    price: 50,
    delivery_days: 3,
    rating: 4.9,
    thumbnail: "https://via.placeholder.com/300x200.png?text=Logo+Design",
  },
  {
    id: 6,
    title: "I will build a responsive WordPress website",
    price: 200,
    delivery_days: 7,
    rating: 4.8,
    thumbnail: "https://via.placeholder.com/300x200.png?text=WordPress+Site",
  },
  {
    id: 7,
    title: "I will create a professional logo design",
    price: 50,
    delivery_days: 3,
    rating: 4.9,
    thumbnail: "https://via.placeholder.com/300x200.png?text=Logo+Design",
  },
  {
    id: 8,
    title: "I will build a responsive WordPress website",
    price: 200,
    delivery_days: 7,
    rating: 4.8,
    thumbnail: "https://via.placeholder.com/300x200.png?text=WordPress+Site",
  },
  {
    id: 9,
    title: "I will create a professional logo design",
    price: 50,
    delivery_days: 3,
    rating: 4.9,
    thumbnail: "https://via.placeholder.com/300x200.png?text=Logo+Design",
  },
  {
    id: 2,
    title: "I will build a responsive WordPress website",
    price: 200,
    delivery_days: 7,
    rating: 4.8,
    thumbnail: "https://via.placeholder.com/300x200.png?text=WordPress+Site",
  },
];

const GigsPage = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Gigs</h1>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {showForm ? 'Cancel' : 'Create New Gig'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Create a New Gig</h2>
            <form>
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 font-bold mb-2">Gig Title</label>
                <input type="text" id="title" className="w-full px-4 py-2 border rounded-lg" placeholder="e.g., I will create a professional logo design" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="price" className="block text-gray-700 font-bold mb-2">Price (R)</label>
                  <input type="number" id="price" className="w-full px-4 py-2 border rounded-lg" placeholder="e.g., 50" />
                </div>
                <div>
                  <label htmlFor="delivery_days" className="block text-gray-700 font-bold mb-2">Delivery Days</label>
                  <input type="number" id="delivery_days" className="w-full px-4 py-2 border rounded-lg" placeholder="e.g., 3" />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700 font-bold mb-2">Description</label>
                <textarea id="description" rows="4" className="w-full px-4 py-2 border rounded-lg" placeholder="Describe your gig in detail..."></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="thumbnail" className="block text-gray-700 font-bold mb-2">Thumbnail Image</label>
                <input type="file" id="thumbnail" className="w-full" />
              </div>
              <button type="submit" className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">Create Gig</button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.map(gig => (
            <div key={gig.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={gig.thumbnail} alt={gig.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{gig.title}</h3>
                <div className="flex justify-between items-center">
                  <p className="text-lg font-bold text-green-600">R{gig.price}</p>
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1 text-gray-600">{gig.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GigsPage;
