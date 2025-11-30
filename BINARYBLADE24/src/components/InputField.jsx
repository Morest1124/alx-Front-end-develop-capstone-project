import React from "react";

const InputField = ({ label, type, value, onChange, required, disabled, error }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 mt-1 border ${error ? "border-[var(--color-error)]" : "border-gray-300"
          } rounded-md shadow-sm focus:outline-none focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]`}
        required={required}
        disabled={disabled}
      />
      {error && <p className="mt-2 text-sm text-[var(--color-error)]">{error}</p>}
    </div>
  );
};

export default InputField;
