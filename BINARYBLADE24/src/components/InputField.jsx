import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const InputField = ({ label, type, value, onChange, required, disabled, error }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative mt-1">
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          className={`w-full px-3 py-2 border ${error ? "border-[var(--color-error)]" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] ${isPassword ? "pr-10" : ""}`}
          required={required}
          disabled={disabled}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[var(--color-accent)] focus:outline-none"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-[var(--color-error)]">{error}</p>}
    </div>
  );
};

export default InputField;
