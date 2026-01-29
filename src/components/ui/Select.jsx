"use client";

import React from "react";

const Select = ({
    label,
    options = [],
    error,
    className = "",
    ...props
}) => {
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    className={`w-full bg-white border outline-none rounded-xl py-2.5 px-4 transition-all duration-200 appearance-none
                    ${error
                            ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                            : "border-gray-200 focus:border-[#003B73] focus:ring-1 focus:ring-[#003B73]"
                        }
                    text-gray-900 font-sans`}
                    {...props}
                >
                    <option value="" disabled>Select an option</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                </div>
            </div>
            {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
        </div>
    );
};

export default Select;
