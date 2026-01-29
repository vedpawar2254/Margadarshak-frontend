"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Link from "next/link";
import { api } from "../../services/api";
import { validatePassword } from "../../utils/validation";
import { useAuth } from "../../hooks/useAuth";

const ResetPasswordForm = () => {
    const router = useRouter();
    const { verifyResetOTP } = useAuth();
    const [step, setStep] = useState(1); // 1: Enter OTP, 2: Set new password
    const [email, setEmail] = useState(() => {
        // Get email from query params or sessionStorage (more secure than localStorage)
        if (typeof window !== 'undefined') {
            return sessionStorage.getItem('resetEmail') || '';
        }
        return '';
    });
    const [otp, setOtp] = useState("");
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");
    const [otpError, setOtpError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    // Store studentId after OTP verification
    const [studentId, setStudentId] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "otp") {
            setOtp(value);
            if (otpError) setOtpError("");
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));

            // Clear error when user starts typing
            if (name === "password" && passwordError) {
                setPasswordError("");
            } else if (name === "confirmPassword" && confirmPasswordError) {
                setConfirmPasswordError("");
            }
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();

        // Validate OTP
        if (!otp || otp.length !== 6) {
            setOtpError("Please enter a valid 6-digit OTP");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            // Verify the OTP using the API
            const result = await verifyResetOTP({
                email: email,
                otp: otp
            });

            if (result.success) {
                setStudentId(result.data?.studentId);
                setStep(2); // Move to step 2 - set new password
            } else {
                setError(result.message || "Invalid OTP. Please try again.");
            }
        } catch (err) {
            setError(err.message || "Invalid OTP. Please try again.");
            console.error("OTP verification error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate passwords
        let isValid = true;

        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isValid) {
            setPasswordError("Password must be at least 8 characters with uppercase, lowercase, number, and special character");
            isValid = false;
        }

        if (formData.password !== formData.confirmPassword) {
            setConfirmPasswordError("Passwords do not match");
            isValid = false;
        }

        if (!isValid) return;

        setIsLoading(true);
        setError("");

        try {
            await api.post("/auth/reset-password", {
                email: email,
                studentId: studentId, // Send studentId instead of OTP after verification
                newPassword: formData.password
            });

            setIsSuccess(true);
            // Clear the reset email from sessionStorage after successful password reset
            if (typeof window !== 'undefined') {
                sessionStorage.removeItem('resetEmail');
            }
        } catch (err) {
            setError(err.message || "Failed to reset password. Please try again.");
            console.error("Reset password error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="w-full text-center">
                <div className="mb-8 flex justify-center">
                    <div className="bg-green-100 p-4 rounded-full text-green-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-10 h-10">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Password reset</h2>
                <p className="mt-4 text-gray-500 leading-relaxed">
                    Your password has been successfully reset. <br />
                    You can now use your new password to sign in.
                </p>
                <div className="mt-10">
                    <Link href="/login">
                        <Button className="w-full">
                            Sign In to Your Account
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (step === 1) {
        // Step 1: Enter OTP
        return (
            <div className="w-full">
                <div className="mb-10 text-center lg:text-left">
                    <h2 className="text-3xl font-bold text-gray-900">Reset your password</h2>
                    <p className="mt-2 text-gray-500">
                        Enter the 6-digit code sent to your email
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                        {error}
                    </div>
                )}

                <form onSubmit={handleOtpSubmit} className="space-y-6">
                    <div className="space-y-1">
                        <Input
                            label="Enter OTP"
                            name="otp"
                            type="text"
                            placeholder="Enter 6-digit code"
                            value={otp}
                            onChange={handleChange}
                            maxLength={6}
                            required
                            error={otpError}
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0V10.5m-2.25 1.35h13.5c.621 0 1.125.504 1.125 1.125v6.75c0 .621-.504 1.125-1.125 1.125H5.25a1.125 1.125 0 0 1-1.125-1.125v-6.75c0-.621.504-1.125 1.125-1.125Z" />
                                </svg>
                            }
                        />
                        {otpError && <p className="text-red-500 text-sm mt-1">{otpError}</p>}
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        isLoading={isLoading}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        }
                    >
                        Verify & Continue
                    </Button>
                </form>

                <div className="mt-10 text-center">
                    <p className="text-sm text-gray-500">
                        Didn't receive the code? Check your spam folder or <button
                            type="button"
                            className="text-[#003B73] font-semibold hover:underline"
                            onClick={() => router.push('/forgot-password')} // Go back to forgot password page
                        >
                            request again
                        </button>
                    </p>
                </div>
            </div>
        );
    } else {
        // Step 2: Set new password
        return (
            <div className="w-full">
                <div className="mb-10 text-center lg:text-left">
                    <h2 className="text-3xl font-bold text-gray-900">Set new password</h2>
                    <p className="mt-2 text-gray-500">
                        Please enter your new password below
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1">
                        <Input
                            label="New Password"
                            name="password"
                            type={isPasswordVisible ? "text" : "password"}
                            placeholder="Create a strong password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            error={passwordError}
                            isVisible={isPasswordVisible}
                            onToggleVisibility={() => setIsPasswordVisible(!isPasswordVisible)}
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0V10.5m-2.25 1.35h13.5c.621 0 1.125.504 1.125 1.125v6.75c0 .621-.504 1.125-1.125 1.125H5.25a1.125 1.125 0 0 1-1.125-1.125v-6.75c0-.621.504-1.125 1.125-1.125Z" />
                                </svg>
                            }
                        />
                        {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                    </div>
                    <div className="space-y-1">
                        <Input
                            label="Confirm New Password"
                            name="confirmPassword"
                            type={isPasswordVisible ? "text" : "password"}
                            placeholder="Confirm your new password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            error={confirmPasswordError}
                            isVisible={isPasswordVisible}
                            onToggleVisibility={() => setIsPasswordVisible(!isPasswordVisible)}
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0V10.5m-2.25 1.35h13.5c.621 0 1.125.504 1.125 1.125v6.75c0 .621-.504 1.125-1.125 1.125H5.25a1.125 1.125 0 0 1-1.125-1.125v-6.75c0-.621.504-1.125 1.125-1.125Z" />
                                </svg>
                            }
                        />
                        {confirmPasswordError && <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>}
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        isLoading={isLoading}
                    >
                        Reset Password
                    </Button>
                </form>

                <div className="mt-10 text-center">
                    <Link
                        href="/login"
                        className="flex items-center justify-center text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        Back to Sign In
                    </Link>
                </div>
            </div>
        );
    }

}

export default ResetPasswordForm;
