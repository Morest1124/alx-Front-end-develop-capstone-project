import React from 'react';
import { formatToZAR } from '../utils/currency';

const JobPreview = ({ jobDetails }) => {
  const { title, description, budget, image } = jobDetails;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {image && <img src={URL.createObjectURL(image)} alt={title} className="w-full h-48 object-cover" />}
      <div className="p-6">
        <h3 className="text-xl font-semibold">{title || 'Job Title'}</h3>
        <p className="text-gray-600 mt-2">{description || 'Job description...'}</p>
        <div className="flex justify-between items-center mt-4">
          <p className="text-lg font-bold text-green-600">{formatToZAR(budget || '0')}</p>
        </div>
      </div>
    </div>
  );
};

export default JobPreview;
