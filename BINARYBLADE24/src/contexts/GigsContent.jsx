import React, { useState } from 'react';

const gigs = [
  {
    id: 1,
    title: 'I will create a professional logo design',
    price: 500,
    delivery_days: 3,
    rating: 4.9,
    thumbnail: 'https://via.placeholder.com/300x200.png?text=Logo+Design',
  },
  {
    id: 2,
    title: 'I will build a responsive WordPress website',
    price: 10000,
    delivery_days: 7,
    rating: 4.8,
    thumbnail: 'https://via.placeholder.com/300x200.png?text=WordPress+Site',
  },
];

const GigsContent = () => {
  const [showForm, setShowForm] = useState(false);
  const [pricingModel, setPricingModel] = useState('package');
  const [gigData, setGigData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    tags: '',
    basicPrice: '',
    basicDelivery: '',
    basicDescription: '',
    standardPrice: '',
    standardDelivery: '',
    standardDescription: '',
    premiumPrice: '',
    premiumDelivery: '',
    premiumDescription: '',
    hourlyRate: '',
    requirements: '',
    deliverables: '',
    timeline: '',
    revisions: '',
    communication: '',
    gigImage: null,
    gigVideo: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGigData({ ...gigData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setGigData({ ...gigData, [name]: files[0] });
  };


  return (
    <div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Form */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Create a New Gig</h2>
                    <form>
                        {/* Gig Details */}
                        <div className="border-b pb-4 mb-4">
                            <h3 className="text-xl font-semibold mb-2">Gig Details</h3>
                            <div className="mb-4">
                                <label htmlFor="title" className="block text-gray-700 font-bold mb-2">Gig Title</label>
                                <input type="text" id="title" name="title" value={gigData.title} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg" placeholder="e.g., I will create a professional logo design" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="description" className="block text-gray-700 font-bold mb-2">Gig Description</label>
                                <textarea id="description" name="description" value={gigData.description} onChange={handleInputChange} rows="4" className="w-full px-4 py-2 border rounded-lg" placeholder="Describe your gig in detail..."></textarea>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label htmlFor="category" className="block text-gray-700 font-bold mb-2">Category</label>
                                    <select id="category" name="category" value={gigData.category} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg">
                                        <option>Web Development</option>
                                        <option>Design</option>
                                        <option>Marketing</option>
                                        <option>Writing</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="tags" className="block text-gray-700 font-bold mb-2">Tags</label>
                                    <input type="text" id="tags" name="tags" value={gigData.tags} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg" placeholder="e.g., logo, branding, design" />
                                </div>
                            </div>
                        </div>

                        {/* Pricing and Packages */}
                        <div className="border-b pb-4 mb-4">
                            <h3 className="text-xl font-semibold mb-2">Pricing and Packages</h3>
                            <div className="flex items-center mb-4">
                                <label className="mr-4">
                                    <input type="radio" name="pricingModel" value="package" checked={pricingModel === 'package'} onChange={() => setPricingModel('package')} />
                                    Package Pricing
                                </label>
                                <label>
                                    <input type="radio" name="pricingModel" value="hourly" checked={pricingModel === 'hourly'} onChange={() => setPricingModel('hourly')} />
                                    Hourly Rate
                                </label>
                            </div>

                            {pricingModel === 'package' ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="border p-4 rounded-lg">
                                        <h4 className="text-lg font-bold mb-2">Basic</h4>
                                        <div className="mb-2">
                                            <label htmlFor="basicPrice" className="block text-sm font-medium text-gray-700">Price (R)</label>
                                            <input type="number" id="basicPrice" name="basicPrice" value={gigData.basicPrice} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" />
                                        </div>
                                        <div className="mb-2">
                                            <label htmlFor="basicDelivery" className="block text-sm font-medium text-gray-700">Delivery Days</label>
                                            <input type="number" id="basicDelivery" name="basicDelivery" value={gigData.basicDelivery} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" />
                                        </div>
                                        <div>
                                            <label htmlFor="basicDescription" className="block text-sm font-medium text-gray-700">Description</label>
                                            <textarea id="basicDescription" name="basicDescription" value={gigData.basicDescription} onChange={handleInputChange} rows="3" className="w-full px-3 py-2 border rounded-lg"></textarea>
                                        </div>
                                    </div>
                                    <div className="border p-4 rounded-lg">
                                        <h4 className="text-lg font-bold mb-2">Standard</h4>
                                        <div className="mb-2">
                                            <label htmlFor="standardPrice" className="block text-sm font-medium text-gray-700">Price (R)</label>
                                            <input type="number" id="standardPrice" name="standardPrice" value={gigData.standardPrice} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" />
                                        </div>
                                        <div className="mb-2">
                                            <label htmlFor="standardDelivery" className="block text-sm font-medium text-gray-700">Delivery Days</label>
                                            <input type="number" id="standardDelivery" name="standardDelivery" value={gigData.standardDelivery} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" />
                                        </div>
                                        <div>
                                            <label htmlFor="standardDescription" className="block text-sm font-medium text-gray-700">Description</label>
                                            <textarea id="standardDescription" name="standardDescription" value={gigData.standardDescription} onChange={handleInputChange} rows="3" className="w-full px-3 py-2 border rounded-lg"></textarea>
                                        </div>
                                    </div>
                                    <div className="border p-4 rounded-lg">
                                        <h4 className="text-lg font-bold mb-2">Premium</h4>
                                        <div className="mb-2">
                                            <label htmlFor="premiumPrice" className="block text-sm font-medium text-gray-700">Price (R)</label>
                                            <input type="number" id="premiumPrice" name="premiumPrice" value={gigData.premiumPrice} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" />
                                        </div>
                                        <div className="mb-2">
                                            <label htmlFor="premiumDelivery" className="block text-sm font-medium text-gray-700">Delivery Days</label>
                                            <input type="number" id="premiumDelivery" name="premiumDelivery" value={gigData.premiumDelivery} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" />
                                        </div>
                                        <div>
                                            <label htmlFor="premiumDescription" className="block text-sm font-medium text-gray-700">Description</label>
                                            <textarea id="premiumDescription" name="premiumDescription" value={gigData.premiumDescription} onChange={handleInputChange} rows="3" className="w-full px-3 py-2 border rounded-lg"></textarea>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <label htmlFor="hourlyRate" className="block text-gray-700 font-bold mb-2">Hourly Rate (R)</label>
                                    <input type="number" id="hourlyRate" name="hourlyRate" value={gigData.hourlyRate} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg" placeholder="e.g., 25" />
                                </div>
                            )}
                        </div>

                        {/* Requirements and Deliverables */}
                        <div className="border-b pb-4 mb-4">
                            <h3 className="text-xl font-semibold mb-2">Requirements and Deliverables</h3>
                            <div className="mb-4">
                                <label htmlFor="requirements" className="block text-gray-700 font-bold mb-2">Requirements</label>
                                <textarea id="requirements" name="requirements" value={gigData.requirements} onChange={handleInputChange} rows="3" className="w-full px-4 py-2 border rounded-lg" placeholder="What do you need from the client to get started?"></textarea>
                            </div>
                            <div>
                                <label htmlFor="deliverables" className="block text-gray-700 font-bold mb-2">Deliverables</label>
                                <textarea id="deliverables" name="deliverables" value={gigData.deliverables} onChange={handleInputChange} rows="3" className="w-full px-4 py-2 border rounded-lg" placeholder="What will you deliver to the client?"></textarea>
                            </div>
                        </div>

                        {/* Visuals and Media */}
                        <div className="border-b pb-4 mb-4">
                            <h3 className="text-xl font-semibold mb-2">Visuals and Media</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="gigImage" className="block text-gray-700 font-bold mb-2">Gig Image</label>
                                    <label htmlFor="gigImage" className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Upload Image</label>
                                    <input type="file" id="gigImage" name="gigImage" onChange={handleFileChange} className="hidden" />
                                </div>
                                <div>
                                    <label htmlFor="gigVideo" className="block text-gray-700 font-bold mb-2">Gig Video</label>
                                    <label htmlFor="gigVideo" className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Upload Video</label>
                                    <input type="file" id="gigVideo" name="gigVideo" onChange={handleFileChange} className="hidden" accept="video/*" />
                                </div>
                            </div>
                        </div>

                        {/* Additional Details */}
                        <div className="border-b pb-4 mb-4">
                            <h3 className="text-xl font-semibold mb-2">Additional Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="timeline" className="block text-gray-700 font-bold mb-2">Estimated Timeline (Days)</label>
                                    <input type="number" id="timeline" name="timeline" value={gigData.timeline} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg" />
                                </div>
                                <div>
                                    <label htmlFor="revisions" className="block text-gray-700 font-bold mb-2">Number of Revisions</label>
                                    <input type="number" id="revisions" name="revisions" value={gigData.revisions} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg" />
                                </div>
                                <div>
                                    <label htmlFor="communication" className="block text-gray-700 font-bold mb-2">Communication</label>
                                    <input type="text" id="communication" name="communication" value={gigData.communication} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg" placeholder="e.g., Via platform chat" />
                                </div>
                            </div>
                        </div>

                      <button type="submit" className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">Create Gig</button>
                    </form>
                </div>

                {/* Preview */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Live Preview</h2>
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <img src={gigData.gigImage ? URL.createObjectURL(gigData.gigImage) : 'https://via.placeholder.com/300x200.png?text=Your+Gig+Image'} alt="Gig Thumbnail" className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h3 className="text-lg font-bold text-gray-800 mb-2">{gigData.title || 'Your Gig Title'}</h3>
                            <p className="text-gray-600 mb-2">{gigData.category}</p>
                            <div className="flex justify-between items-center">
                                <p className="text-lg font-bold text-green-600">{pricingModel === 'package' ? `R${gigData.basicPrice || '0'}` : `R${gigData.hourlyRate || '0'}/hr`}</p>
                                <div className="flex items-center">
                                    <span className="text-yellow-500">★</span>
                                    <span className="ml-1 text-gray-600">Not rated yet</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
  );
};

export default GigsContent;