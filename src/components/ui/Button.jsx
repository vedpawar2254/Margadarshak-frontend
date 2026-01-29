"use client";

import React from "react";

const Button = ({
    children,
    type = "button",
    variant = "primary",
    className = "",
    isLoading = false,
    icon: Icon,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-[#003B73] text-white hover:bg-[#002B54] focus:ring-[#003B73]",
        outline: "border-2 border-gray-200 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-300",
        ghost: "bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-200",
    };

    return (
        <button
            type={type}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-current"
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
            ) : null}
            {children}
            {!isLoading && Icon && (
                <span className="ml-2">
                    {Icon}
                </span>
            )}
        </button>
    );
};

export default Button;
