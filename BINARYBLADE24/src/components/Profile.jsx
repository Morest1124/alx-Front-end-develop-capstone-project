import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext"; // Import AuthContext
import { getUserProfile } from "../api"; //Import the api endpoint

const ProfilePage = () => {
  const { user: authUser } = useContext(AuthContext); // Get user from AuthContext
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!authUser || !authUser.userId) {
        setLoading(false);
        setError("No user ID found. Please log in.");
        return;
      }

      try {
        const userData = await getUserProfile(authUser.userId);
        setUser(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [authUser]); // Dependency array ensures this runs when authUser changes

  // Show a loading message while fetching data
  if (loading) {
    return <div>Loading profile...</div>;
  }

  //  Show an error message if something went wrong
  if (error) {
    return <div>Error: {error}</div>;
  }

  // 6. Display the user's profile information
  if (!user) {
    return <div>No user data found.</div>;
  }

  return (
    <div>
      <img
        src={user.profile_picture || 'https://via.placeholder.com/150'}
        alt="Profile"
        className="w-24 h-24 rounded-full mr-4"
      />
      <h1>{user.username}'s Profile</h1>
      <p>Email: {user.email}</p>
      <p>Bio: {user.bio}</p>
      <p>Level: {user.level}</p>
      <p>Rating: {user.rating}</p>
    </div>
  );
};

export default ProfilePage;
