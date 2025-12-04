import React, { useState, useEffect } from "react";
import { User, Mail, Lock, MapPin, CreditCard, Phone } from "lucide-react";
import Loader from "./Loader";
import InputField from "./InputField";
import RoleSelector from "./RoleSelector";
import { getCountries } from "../api";

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
  phoneNumber,
  setPhoneNumber,
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
  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await getCountries();
        setCountries(data);
      } catch (error) {
        console.error("Failed to fetch countries:", error);
      } finally {
        setLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {apiError && (
        <div
          className="bg-[var(--color-error-light)] border border-[var(--color-error)] text-[var(--color-error)] px-4 py-3 rounded relative"
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
        error={errors.firstName}
      />
      <InputField
        label="Last Name"
        type="text"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
        disabled={loading}
        error={errors.lastName}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MapPin className="inline w-4 h-4 mr-2" />
          Country
        </label>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
          disabled={loading || loadingCountries}
          className={`w-full px-4 py-2 border ${errors.country ? "border-red-500" : "border-gray-300"
            } rounded-md focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed`}
        >
          <option value="">
            {loadingCountries ? "Loading countries..." : "Select your country"}
          </option>
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
        {errors.country && (
          <p className="text-red-500 text-sm mt-1">{errors.country}</p>
        )}
      </div>

      <InputField
        label="ID Number"
        type="text"
        value={identityNumber}
        onChange={(e) => setIdentityNumber(e.target.value)}
        required
        disabled={loading}
        error={errors.identityNumber}
      />
      <InputField
        label="Phone Number"
        type="text"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        required
        disabled={loading}
        error={errors.phoneNumber}
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
          className="w-full px-4 py-2 font-medium text-white bg-[var(--color-accent)] rounded-md hover:bg-[var(--color-accent-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent)] disabled:opacity-50 flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader size="small" color="white" />
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
