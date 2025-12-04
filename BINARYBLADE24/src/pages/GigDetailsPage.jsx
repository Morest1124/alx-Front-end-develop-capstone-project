import React, { useState, useEffect } from 'react';
import { useRouter } from '../contexts/Routers';
import { getGig } from '../api';
import { useCurrency } from '../contexts/CurrencyContext';

const GigDetailsPage = ({ gigId }) => {
  const { navigate } = useRouter();
  const [gig, setGig] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (gigId) {
      setIsLoading(true);
      getGig(gigId).then(data => {
        setGig(data);
        if (data && data.image) {
          setMainImage(data.image);
        }
        setIsLoading(false);
      });
    }
  }, [gigId]);

  if (isLoading) {
    return <div className="text-center py-10">Loading gig details...</div>;
  }

  if (!gig) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">Gig Not Found</h2>
        <p className="text-gray-600 mb-6">We couldn't find the gig you were looking for.</p>
        <button onClick={() => navigate('/find-work')} className="btn-primary py-2 px-4">
          &larr; Back to Gigs
        </button>
      </div>
    );
  }

  const allImages = [gig.image, ...(gig.extra_images || [])].filter(Boolean);

  return (
    <div className="container mx-auto p-4 lg:p-8 bg-white rounded-lg shadow-lg mt-6">
      <button onClick={() => navigate('/find-work')} className="mb-6 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
        &larr; Back to Gigs
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Image Gallery */}
        <div className="lg:col-span-2">
          <div className="main-image mb-4">
            <img src={mainImage} alt={gig.title} className="w-full h-auto object-cover rounded-lg shadow-md" style={{ maxHeight: '500px' }} />
          </div>
          <div className="thumbnail-images grid grid-cols-3 sm:grid-cols-4 gap-2">
            {allImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className={`w-full h-24 object-cover rounded-md cursor-pointer border-2 ${mainImage === img ? 'border-[var(--color-accent)]' : 'border-transparent'}`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Gig Details */}
        <div className="lg:col-span-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{gig.title}</h1>
          <div className="flex items-center mb-4">
            <img src={gig.avatar} alt={gig.freelancer} className="w-10 h-10 rounded-full mr-3" />
            <span className="text-lg text-gray-700 font-medium">{gig.freelancer}</span>
          </div>
          <div className="flex items-center text-yellow-500 mb-4">
            <span className="font-bold text-xl mr-1">{gig.rating}</span>
            <span>&#9733;</span>
            <span className="text-gray-600 ml-2">({gig.reviews} reviews)</span>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Project Details</h2>
            <p className="text-gray-600 mb-4">
              This is a placeholder description. A detailed overview of the project requirements, deliverables, and scope would be displayed here.
            </p>
            <div className="price text-3xl font-bold text-[var(--color-success)]">
              {formatPrice(gig.price, 'USD')}
            </div>
            <button className="mt-6 w-full btn-success py-3 px-6 text-lg font-semibold transition-transform transform hover:scale-105">
              Accept Offer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigDetailsPage;