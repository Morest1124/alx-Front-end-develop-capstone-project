import React, { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { GigsContext } from '../contexts/GigsContext';

const CreateGigForm = () => {
  const navigate = useNavigate();
  const { addGig } = useContext(GigsContext);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    duration: "",
    skills: "",
    requirements: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const projectData = {
        ...formData,
        skills: formData.skills.split(",").map((skill) => skill.trim()),
        budget: parseFloat(formData.budget),
      };

      await addGig(projectData);
      setSuccess(true);
      setFormData({
        title: "",
        description: "",
        budget: "",
        duration: "",
        skills: "",
        requirements: "",
      });

      // Show success message and navigate
      setTimeout(() => {
        navigate("/gigs");
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">
        Create a New Gig
      </h2>
      <p className="text-gray-600 mb-6">
        Set your base price for the Simple package. Medium and Expert tiers will be calculated automatically.
      </p>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-600 rounded-md">
          Gig created successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Gig Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-600500 focus:border-sky-600500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-600500 focus:border-sky-600500"
            rows="5"
            required
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Base Price (Simple Package) - ZAR
            </label>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-600500 focus:border-sky-600500"
              required
              min="1"
              step="0.01"
            />
            <p className="mt-1 text-xs text-gray-500">
              This is the starting price for the Simple package
            </p>

            {/* Pricing Tier Preview */}
            {formData.budget && parseFloat(formData.budget) > 0 && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-xs font-semibold text-blue-900 mb-2">Pricing Tiers Preview:</p>
                <div className="space-y-1 text-xs text-blue-800">
                  <div className="flex justify-between">
                    <span>🥉 Simple:</span>
                    <span className="font-bold">R{parseFloat(formData.budget).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🥈 Medium:</span>
                    <span className="font-bold">R{(parseFloat(formData.budget) * 1.5).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🥇 Expert:</span>
                    <span className="font-bold">R{(parseFloat(formData.budget) * 2.0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Duration (e.g., "2 weeks", "3 months")
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-600500 focus:border-sky-600500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Required Skills (comma-separated)
          </label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g., React, Node.js, Python"
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-600500 focus:border-sky-600500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Requirements
          </label>
          <textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-600500 focus:border-sky-600500"
            rows="3"
            placeholder="List any specific requirements or qualifications needed"
            required
          ></textarea>
        </div>

        <div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-medium text-white bg-sky-600 rounded-md hover:bg-sky-600700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-600500 disabled:bg-sky-600400"
            disabled={loading}
          >
            {loading ? "Creating Gig..." : "Create Gig"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateGigForm;
