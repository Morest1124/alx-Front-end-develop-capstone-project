import React from "react";
import { Link } from "../contexts/Routers";

const Gigs = () => {
  const gigs = [
    {
      id: 1,
      title: "I will create a professional website for your business",
      freelancer: "John Doe",
      price: 500,
      rating: 4.9,
      reviews: 120,
      image: "https://via.placeholder.com/300x200",
    },
    {
      id: 2,
      title: "I will design a stunning logo for your brand",
      freelancer: "Jane Smith",
      price: 150,
      rating: 4.8,
      reviews: 85,
      image: "https://via.placeholder.com/300x200",
    },
    {
      id: 3,
      title: "I will write engaging content for your blog",
      freelancer: "Peter Jones",
      price: 50,
      rating: 4.9,
      reviews: 200,
      image: "https://via.placeholder.com/300x200",
    },
    {
      id: 4,
      title: "I will create a professional website for your business",
      freelancer: "John Doe",
      price: 500,
      rating: 4.9,
      reviews: 120,
      image: "https://via.placeholder.com/300x200",
    },
    {
      id: 5,
      title: "I will design a stunning logo for your brand",
      freelancer: "Jane Smith",
      price: 150,
      rating: 4.8,
      reviews: 85,
      image: "https://via.placeholder.com/300x200",
    },
    {
      id: 6,
      title: "I will write engaging content for your blog",
      freelancer: "Peter Jones",
      price: 50,
      rating: 4.9,
      reviews: 200,
      image: "https://via.placeholder.com/300x200",
    },
  ];

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Gigs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {gigs.map((gig) => (
          <div
            key={gig.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={gig.image}
              alt={gig.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{gig.title}</h3>
              <p className="text-gray-600 mb-4">By {gig.freelancer}</p>
              <div className="flex justify-between items-center">
                <p className="text-lg font-bold text-gray-800">${gig.price}</p>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-yellow-500 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                  <p className="text-gray-600">
                    {gig.rating} ({gig.reviews} reviews)
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Link to="/freelancer/proposals">
                  <button className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Contact
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gigs;
