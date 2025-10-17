import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { GigsContext } from "../contexts/GigsContext";

const Gigs = () => {
  const { user } = useContext(AuthContext);
  const { gigs, loading } = useContext(GigsContext);

  const handleContact = (e, gig) => {
    e.stopPropagation();
    alert(`Contacting ${gig.freelancer}`);
  };

  const handleViewGig = (gig) => {
    alert(`Navigating to overview for gig: ${gig.title}`);
    alert(`Navigating to payment for gig: ${gig.title}`);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading gigs...</div>;
  }

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Gigs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {gigs.map((gig) => (
          <div
            key={gig.id}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
            onClick={() => handleViewGig(gig)}
          >
            <img
              src={gig.image}
              alt={gig.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center mb-4">
                <img
                  src={gig.avatar}
                  alt={gig.freelancer}
                  className="w-10 h-10 rounded-full mr-4"
                />
                <h3 className="text-xl font-semibold">{gig.title}</h3>
              </div>
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
                {user.isLoggedIn && user.role === 'client' && (
                  <button 
                    onClick={(e) => handleContact(e, gig)}
                    className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Contact Freelancer
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gigs;
