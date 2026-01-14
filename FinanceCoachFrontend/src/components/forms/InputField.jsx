// src/components/forms/InputField.jsx
import React from "react";

export default function InputField({
  label,
  id,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  error = null,
  required = false,
  disabled = false,
  autoComplete,
  className = "",
}) {
  return (
    <div className={`flex flex-col mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={id || name}
          className="mb-1 font-semibold text-gray-700 dark:text-gray-300"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={id || name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        className={`border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-200 ${
          error ? "border-red-500 focus:ring-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="mt-1 text-red-600 text-sm">{error}</p>}
    </div>
  );
}
