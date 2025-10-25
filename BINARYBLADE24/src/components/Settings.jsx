import React, { useState, useContext } from 'react';
import { updateUserProfilePicture } from '../api';
import { AuthContext } from '../contexts/AuthContext';

const Settings = () => {
  const { user } = useContext(AuthContext);
  const [profilePicture, setProfilePicture] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSave = async () => {
    if (profilePicture) {
      try {
        setLoading(true);
        setError(null);
        await updateUserProfilePicture(user.userId, profilePicture);
        // Optionally, you can refresh the user data here to show the new picture
        alert('Profile picture updated successfully!');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="flex items-center mb-4">
        <img
          src={user.profile_picture || 'https://via.placeholder.com/150'}
          alt="Profile"
          className="w-24 h-24 rounded-full mr-4"
        />
        <div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>
      <div>
        <label htmlFor="profilePicture" className="block mb-2">Update Profile Picture</label>
        <input type="file" id="profilePicture" onChange={handleFileChange} />
      </div>
      <button
        onClick={handleSave}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        Save
      </button>
    </div>
  );
};

export default Settings;
