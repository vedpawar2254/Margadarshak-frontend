"use client";

import React, { useState, useEffect, useRef } from "react";
import Button from "../ui/Button";

const OTPForm = ({ onVerify, onResend, email, isLoading }) => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [timer, setTimer] = useState(30);
    const inputRefs = useRef([]);

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onVerify(otp.join(""));
    };

    const handleResend = () => {
        setTimer(30);
        onResend();
    };

    return (
        <div className="w-full">
            <div className="mb-8 text-center lg:text-left">
                <h2 className="text-2xl font-bold text-gray-900">Verify your email</h2>
                <p className="mt-1 text-sm text-gray-500">
                    We've sent a 6-digit code to <span className="font-semibold text-gray-900">{email}</span>
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex justify-between gap-2 max-w-xs mx-auto lg:mx-0">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="w-12 h-12 text-center text-xl font-bold border border-gray-200 rounded-xl focus:border-[#003B73] focus:ring-1 focus:ring-[#003B73] outline-none transition-all"
                        />
                    ))}
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    isLoading={isLoading}
                    disabled={otp.some(d => !d)}
                >
                    Verify OTP
                </Button>
            </form>

            <div className="mt-8 text-center lg:text-left">
                <p className="text-sm text-gray-500">
                    Didn't receive the code?{" "}
                    {timer > 0 ? (
                        <span className="text-gray-400 font-medium">Resend in {timer}s</span>
                    ) : (
                        <button
                            onClick={handleResend}
                            className="text-[#003B73] font-bold hover:underline"
                        >
                            Resend Code
                        </button>
                    )}
                </p>
            </div>
        </div>
    );
};

export default OTPForm;
