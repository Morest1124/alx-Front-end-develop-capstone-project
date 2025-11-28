import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { GigsContext } from "../contexts/GigsContext";
import { useRouter } from "../contexts/Routers";
import { formatToZAR } from "../utils/currency";

const Gigs = () => {
  const { user } = useContext(AuthContext);
  const { gigs, loading } = useContext(GigsContext);
  const { navigate } = useRouter();

  const handleContact = (e, gig) => {
    e.stopPropagation();
    alert(`Contacting ${gig.owner_details?.first_name || 'freelancer'}`);
  };

  const handleViewGig = (gig) => {
    navigate(`/projects/${gig.id}`);
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading gigs...</p>
      </div>
    );
  }

  if (gigs.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-2">No Gigs Available</h2>
        <p className="text-gray-500">Check back soon for freelancer services!</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-2">Find Talent - Browse Freelancer Services</h2>
      <p className="text-gray-600 mb-6">
        Browse {gigs.length} available {gigs.length === 1 ? 'service' : 'services'} from freelancers
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {gigs.map((gig) => {
          return (
            <div
              key={gig.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl overflow-hidden cursor-pointer transition-all duration-200"
              onClick={() => handleViewGig(gig)}
            >
              {/* Thumbnail or Gradient Placeholder */}
              {gig.thumbnail ? (
                <img
                  src={gig.thumbnail}
                  alt={gig.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">
                    {gig.title.charAt(0)}
                  </span>
                </div>
              )}

              <div className="p-6">
                {/* Freelancer Info */}
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold mr-3">
                    {gig.owner_details?.first_name?.charAt(0) || 'F'}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">
                      {gig.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      By {gig.owner_details?.first_name} {gig.owner_details?.last_name}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                  {gig.description}
                </p>

                {/* Price and Badge */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">Starting at</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatToZAR(gig.budget || gig.price)}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                    GIG
                  </span>
                </div>

                {/* Contact Button for Clients */}
                {user.isLoggedIn && user.role?.toUpperCase() === "CLIENT" && (
                  <button
                    onClick={(e) => handleContact(e, gig)}
                    className="w-full mt-4 px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    Contact Freelancer
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Gigs;
