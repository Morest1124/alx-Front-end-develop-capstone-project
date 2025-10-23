import React, { useState, useContext } from "react";
import { Link } from "../contexts/Routers";
import { AuthContext } from "../contexts/AuthContext";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [identityNumber, setIdentityNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("freelancer");

  // Destructure the error variable from the context
  const { register, loading, error } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      username,
      first_name: firstName,
      last_name: lastName,
      country_origin: country,
      identity_number: identityNumber,
      email,
      password,
      role: [role.toUpperCase()], // User Role if IsClient or IsFreelancer
    };
    try {
      await register(userData, role);
      // The context will navigate to /login on success
    } catch (err) {
      console.error("Caught registration error in component:", err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 py-12">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Sign Up
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ID Number
            </label>
            <input
              type="text"
              value={identityNumber}
              onChange={(e) => setIdentityNumber(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
              disabled={loading}
            />
          </div>
          <div>
            {" "}
            <label className="block text-sm font-medium text-gray-700">
              Register as
            </label>
            <div className="flex items-center mt-1">
              <input
                id="freelancer"
                name="role"
                type="radio"
                value="freelancer"
                checked={role === "freelancer"}
                onChange={(e) => setRole(e.target.value)}
                className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <label
                htmlFor="freelancer"
                className="ml-2 block text-sm text-gray-900"
              >
                Freelancer
              </label>
            </div>
            <div className="flex items-center mt-1">
              <input
                id="client"
                name="role"
                type="radio"
                value="client"
                checked={role === "client"}
                onChange={(e) => setRole(e.target.value)}
                className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <label
                htmlFor="client"
                className="ml-2 block text-sm text-gray-900"
              >
                Client
              </label>
            </div>
          </div>{" "}
          <div>
            {" "}
            <button
              type="submit"
              className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
