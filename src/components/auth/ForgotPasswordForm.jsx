"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";
import { validateEmail } from "../../utils/validation";

const ForgotPasswordForm = () => {
    const router = useRouter();
    const { requestPasswordReset, otpCooldown, canResendOtp } = useAuth();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState("");
    const [emailError, setEmailError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate email
        if (!validateEmail(email)) {
            setEmailError("Please enter a valid email address");
            return;
        }

        // Check cooldown
        if (!canResendOtp) {
            setError(`Please wait ${otpCooldown} seconds before requesting again`);
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            // Use AuthContext's requestPasswordReset which handles cooldown tracking
            await requestPasswordReset(email);
            // Store email in sessionStorage for password reset flow (more secure - clears on browser close)
            sessionStorage.setItem('resetEmail', email);
            // Show success state, then redirect
            setIsSubmitted(true);
            // Navigate to reset password page
            router.push('/reset-password');
        } catch (err) {
            setError(err.message || "Failed to send reset email. Please try again.");
            console.error("Forgot password error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (!validateEmail(email)) {
            setEmailError("Please enter a valid email address");
            return;
        }

        // Check cooldown
        if (!canResendOtp) {
            setError(`Please wait ${otpCooldown} seconds before requesting again`);
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            // Use AuthContext's requestPasswordReset which handles cooldown tracking
            await requestPasswordReset(email);
            // Store email in sessionStorage for password reset flow (more secure - clears on browser close)
            sessionStorage.setItem('resetEmail', email);
            // Redirect to reset password page after OTP is sent
            setTimeout(() => {
                router.push('/reset-password');
            }, 1500); // Wait 1.5 seconds before redirecting
        } catch (err) {
            setError(err.message || "Failed to resend reset email. Please try again.");
            console.error("Resend error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="w-full text-center">
                <div className="mb-8 flex justify-center">
                    <div className="bg-green-100 p-4 rounded-full text-green-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-10 h-10">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Check your email</h2>
                <p className="mt-4 text-gray-500 leading-relaxed">
                    We have sent a 6-digit OTP to <br />
                    <span className="font-semibold text-gray-900">{email}</span>
                </p>
                <div className="mt-10">
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                            setIsSubmitted(false);
                            setEmail("");
                            setEmailError("");
                        }}
                    >
                        Enter different email
                    </Button>
                </div>
                <p className="mt-8 text-sm text-gray-500">
                    Didn&apos;t receive the email?{" "}
                    <button
                        type="button"
                        className={`font-semibold ${canResendOtp ? 'text-[#003B73] hover:underline' : 'text-gray-400 cursor-not-allowed'}`}
                        onClick={handleResend}
                        disabled={isLoading || !canResendOtp}
                    >
                        {otpCooldown > 0 ? `Resend in ${otpCooldown}s` : 'Click to resend'}
                    </button>
                </p>
                <div className="mt-8">
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

    return (
        <div className="w-full">
            <div className="mb-10 text-center lg:text-left">
                <h2 className="text-3xl font-bold text-gray-900">Forgot your password?</h2>
                <p className="mt-2 text-gray-500">
                    No worries, we&apos;ll send you an OTP to reset your password
                </p>
            </div>

            <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl mb-10">
                <p className="text-sm text-blue-800 leading-relaxed">
                    Enter the email address associated with your account and we&apos;ll send you a 6-digit OTP to reset your password.
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-1">
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (emailError) setEmailError("");
                        }}
                        error={emailError}
                        required
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                            </svg>
                        }
                    />
                    {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
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
                    Send OTP Code
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

            <div className="mt-12 text-center">
                <p className="text-gray-500 text-sm">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/register"
                        className="font-bold text-[#003B73] hover:underline"
                    >
                        Sign up for free
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPasswordForm;
