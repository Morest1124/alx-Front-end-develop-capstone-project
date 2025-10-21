import React, { useState } from 'react';
import JobPreview from '../components/JobPreview';
import { createJob } from '../api';
import { convertToZAR } from '../utils/currency';

const PostJob = () => {
  const [jobDetails, setJobDetails] = useState({
    title: '',
    description: '',
    budget: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setJobDetails((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const budgetInZAR = convertToZAR(jobDetails.budget, 'USD');
      const jobDetailsWithZAR = { ...jobDetails, budget: budgetInZAR };
      await createJob(jobDetailsWithZAR);
      alert('Job posted successfully!');
      // Optionally, you can redirect the user to another page
      // navigate('/client/dashboard');
    } catch (error) {
      console.error('Failed to post job:', error);
      alert('Failed to post job. Please try again.');
    }
  };

  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-4xl font-bold mb-4">Post a Job</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Job Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={jobDetails.title}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Job Description
            </label>
            <textarea
              name="description"
              id="description"
              rows="4"
              value={jobDetails.description}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
              Budget (USD)
            </label>
            <input
              type="number"
              name="budget"
              id="budget"
              value={jobDetails.budget}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Optional: Add an image
            </label>
            <input
              type="file"
              name="image"
              id="image"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Post Job
            </button>
          </div>
        </form>
      </div>
      <div>
        <h3 className="text-2xl font-bold mb-4">Preview</h3>
        <JobPreview jobDetails={jobDetails} />
      </div>
    </div>
  );
};

export default PostJob;