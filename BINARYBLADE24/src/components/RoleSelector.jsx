import React from "react";

const RoleSelector = ({ role, setRole }) => {
  return (
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
        <label htmlFor="client" className="ml-2 block text-sm text-gray-900">
          Client
        </label>
      </div>
    </div>
  );
};

export default RoleSelector;
