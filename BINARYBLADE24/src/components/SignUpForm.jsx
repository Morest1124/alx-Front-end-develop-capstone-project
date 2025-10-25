import React from "react";
import InputField from "./InputField";
import RoleSelector from "./RoleSelector";

const SignUpForm = ({
  username,
  setUsername,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  country,
  setCountry,
  identityNumber,
  setIdentityNumber,
  email,
  setEmail,
  password,
  setPassword,
  role,
  setRole,
  handleSubmit,
  errors,
  loading,
  apiError,
  setApiError,
}) => {

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {apiError && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {apiError}</span>
          <span
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setApiError(null)}
          >
            <svg
              className="fill-current h-6 w-6 text-red-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </span>
        </div>
      )}

      <InputField
        label="Username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        disabled={loading}
        error={errors.username}
      />
      <InputField
        label="First Name"
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
        disabled={loading}
        error={errors.first_name}
      />
      <InputField
        label="Last Name"
        type="text"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
        disabled={loading}
        error={errors.last_name}
      />
      <InputField
        label="Country"
        type="text"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        required
        disabled={loading}
        error={errors.country_origin}
      />
      <InputField
        label="ID Number"
        type="text"
        value={identityNumber}
        onChange={(e) => setIdentityNumber(e.target.value)}
        required
        disabled={loading}
        error={errors.identity_number}
      />
      <InputField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={loading}
        error={errors.email}
      />
      <InputField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        disabled={loading}
        error={errors.password}
      />
      <RoleSelector role={role} setRole={setRole} />
      <div>
        {" "}
        <button
          type="submit"
          className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Signing up...
            </>
          ) : (
            "Sign Up"
          )}
        </button>
      </div>
    </form>
  );
};

export default SignUpForm;
