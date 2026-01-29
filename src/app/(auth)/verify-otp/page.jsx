"use client";

import React, { useState, useEffect } from "react";
import AuthLayout from "../../../components/auth/AuthLayout";
import OTPForm from "../../../components/auth/OTPForm";
import { useAuth } from "../../../hooks/useAuth";
import { useRouter } from "next/navigation";

export default function VerifyOTPPage() {
    const [email, setEmail] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem("pending_email") || "";
        }
        return "";
    });
    const { verifyOTP, requestOTP, loading, error } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!email) {
            router.push("/register");
        }
    }, [email, router]);

    const handleVerify = async (otp) => {
        try {
            await verifyOTP({ email, otp });
            localStorage.removeItem("pending_email");
            router.push("/courses"); // Or wherever you want to redirect after verification
        } catch (err) {
            console.error("OTP Verification failed:", err);
        }
    };

    const handleResend = async () => {
        try {
            // Find saved data to resend OTP
            const savedData = JSON.parse(localStorage.getItem("registration_data") || "{}");
            await requestOTP(savedData);
        } catch (err) {
            console.error("OTP Resend failed:", err);
        }
    };

    return (
        <AuthLayout>
            <div className="max-w-md w-full">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                        {error}
                    </div>
                )}
                <OTPForm
                    email={email}
                    onVerify={handleVerify}
                    onResend={handleResend}
                    isLoading={loading}
                />
            </div>
        </AuthLayout>
    );
}
