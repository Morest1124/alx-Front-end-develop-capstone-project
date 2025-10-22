import React, { useState, useEffect } from "react";
import { getUserProfile } from "../api"; //Import the api endpoint

const ProfilePage = () => {
  // 2. Set up state to hold the user data, loading status, and any errors
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3. Fetch the data when the component is first rendered
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // For this example, we'll fetch user with ID 1
        const userId = user.ID;
        const userData = await getUserProfile(userId);
        setUser(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []); // The empty array ensures this runs only once

  // Show a loading message while fetching data
  if (loading) {
    return <div>Loading profile...</div>;
  }

  //  Show an error message if something went wrong
  if (error) {
    return <div>Error: {error}</div>;
  }

  // 6. Display the user's profile information
  return (
    <div>
      <h1>{user.username}'s Profile</h1>
      <p>Email: {user.email}</p>
      <p>Bio: {user.bio}</p>
      <p>Level: {user.level}</p>
      <p>Rating: {user.rating}</p>
    </div>
  );
};

export default ProfilePage;
