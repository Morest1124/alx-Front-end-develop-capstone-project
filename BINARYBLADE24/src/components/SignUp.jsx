import React, { useState, useContext } from "react";
import { Link } from "../contexts/Routers";
import { AuthContext } from "../contexts/AuthContext";
import AuthLayout from "./AuthLayout";
import SignUpForm from "./SignUpForm";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [identityNumber, setIdentityNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("freelancer");
  const {
    register,
    loading,
    error: apiError,
    setError: setApiError,
  } = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors

    const newErrors = {};
    if (!username) newErrors.username = "Username is required.";
    if (!firstName) newErrors.firstName = "First name is required.";
    if (!lastName) newErrors.lastName = "Last name is required.";
    if (!country) newErrors.country = "Country is required.";
    if (!identityNumber) newErrors.identityNumber = "ID number is required.";
    if (!phoneNumber) newErrors.phoneNumber = "Phone number is required.";
    if (!email) newErrors.email = "Email is required.";
    if (!password) newErrors.password = "Password is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const userData = {
      username,
      firstName,
      lastName,
      country,
      identityNumber,
      phoneNumber,
      email,
      password,
      roles: [role.toUpperCase()], // User Role if IsClient or IsFreelancer
    };
    try {
      await register(userData, role);
      // The context will navigate to the appropriate dashboard on success
    } catch (err) {
      console.error("Caught registration error in component:", err);
      if (err.response && err.response.data) {
        const apiErrors = err.response.data;
        const newErrors = {};
        for (const key in apiErrors) {
          newErrors[key] = apiErrors[key][0]; // Take the first error message for each field
        }
        setErrors(newErrors);
      } else {
        setApiError("An unexpected error occurred.");
      }
    }
  };

  return (
    <AuthLayout title="Sign Up">
      <SignUpForm
        username={username}
        setUsername={setUsername}
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        country={country}
        setCountry={setCountry}
        identityNumber={identityNumber}
        setIdentityNumber={setIdentityNumber}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        role={role}
        setRole={setRole}
        handleSubmit={handleSubmit}
        errors={errors}
        loading={loading}
        apiError={apiError}
        setApiError={setApiError}
      />
      <p className="text-sm text-center text-gray-600">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Log In
        </Link>
      </p>
    </AuthLayout>
  );
};

export default SignUp;
