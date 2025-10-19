import React, { useState, useEffect } from "react";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";

// A new component for a single, animated gig card
const GigCard = ({ gig }) => {
  // Use our custom hook to get a ref and the intersecting state
  const [ref, isIntersecting] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-500 ease-in-out ${
        isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <img
        src={gig.image}
        alt={gig.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold">{gig.title}</h3>
        <div className="flex items-center mt-2">
          <img
            src={gig.avatar}
            alt={gig.freelancer}
            className="w-8 h-8 rounded-full"
          />
          <p className="ml-2 text-gray-600">{gig.freelancer}</p>
        </div>
        <div className="flex justify-between items-center mt-4">
          <p className="text-lg font-bold text-green-600">${gig.price}</p>
          <div className="flex items-center">
            <span className="text-yellow-500">★</span>
            <span className="ml-1 text-gray-600">
              {gig.rating} ({gig.reviews} reviews)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const FindWork = () => {
  const [gigs, setGigs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("/db.json")
      .then((res) => res.json())
      .then((data) => setGigs(data.gigs));
  }, []);

  const filteredGigs = gigs.filter((gig) =>
    gig.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-4xl font-bold mb-4">Find Your Next Project</h2>
        <input
          type="text"
          placeholder="Search for gigs..."
          className="w-full px-4 py-2 border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredGigs.map((gig) => (
          <GigCard key={gig.id} gig={gig} />
        ))}
      </div>
    </div>
  );
};

export default FindWork;
