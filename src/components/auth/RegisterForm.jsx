"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/navigation";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { validateEmail, validatePassword, validatePhone, validateName } from "../../utils/validation";

const RegisterForm = () => {
    const { requestOTP, verifyOTP, loading, error, canResendOtp, otpCooldown, otpRetries } = useAuth();
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: Details, 2: OTP
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        currentClass: "",
        password: "",
        confirmPassword: "",
        agreedToTerms: false,
    });
    const [otp, setOtp] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    // Validation errors
    const [errors, setErrors] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const nextStep = async (e) => {
        e.preventDefault();

        // Step 1: Details -> OTP
        if (step === 1) {
            // Validate all fields before proceeding
            let isValid = true;
            const newErrors = {};

            if (!validateName(formData.fullName)) {
                newErrors.fullName = "Please enter a valid name (at least 2 characters)";
                isValid = false;
            }

            if (!validateEmail(formData.email)) {
                newErrors.email = "Please enter a valid email address";
                isValid = false;
            }

            if (!validatePhone(formData.phone)) {
                newErrors.phone = "Please enter a valid phone number (10-15 digits)";
                isValid = false;
            }

            if (!validatePassword(formData.password).isValid) {
                newErrors.password = "Password must be at least 8 characters with uppercase, lowercase, number, and special character";
                isValid = false;
            }

            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = "Passwords do not match";
                isValid = false;
            }

            if (!formData.agreedToTerms) {
                alert("Please agree to the Terms of Service and Privacy Policy");
                isValid = false;
            }

            setErrors(newErrors);

            if (!isValid) return;

            try {
                // Request OTP with the collected details (including password)
                const result = await requestOTP({
                    name: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                    currentClass: formData.currentClass,
                });

                // Store form data in localStorage temporarily, including the student ID from the response
                localStorage.setItem("registration_details", JSON.stringify({
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    currentClass: formData.currentClass,
                    password: formData.password,
                    studentId: result?.data?.student?.id, // Store the student ID for verification
                }));

                setStep(2); // Move to OTP step
            } catch (err) {
                console.error("Failed to send OTP:", err);
            }
        }
        // Step 2: OTP -> Complete Registration
        else if (step === 2) {
            if (otp.length !== 6) {
                alert("Please enter a valid 6-digit OTP");
                return;
            }

            try {
                // Get stored details
                const details = JSON.parse(localStorage.getItem("registration_details") || "{}");

                // Verify the OTP - this should verify the user and return tokens
                const verifyData = {
                    otp: otp,
                };

                // Include studentId if available, otherwise fallback to email
                if (details.studentId) {
                    verifyData.studentId = details.studentId;
                } else {
                    verifyData.email = details.email;
                }

                const result = await verifyOTP(verifyData);

                // If verification successful, complete registration
                if (result.success || result.data) {
                    // Clear temporary storage
                    localStorage.removeItem("registration_details");

                    // Redirect to dashboard since user is now registered and logged in
                    router.push("/courses");
                }
            } catch (err) {
                console.error("OTP verification failed:", err);
            }
        }
    };

    const prevStep = () => {
        if (step === 2) {
            setStep(1);
        }
    };

    const handleSubmit = async (e) => {
        // This shouldn't be reached since we now complete registration after OTP verification
        e.preventDefault();
        router.push("/courses"); // Redirect to courses for consistency
    };

    const classes = ["Class 9", "Class 10", "Class 11", "Class 12", "Graduate", "Other"];

    // Function to handle OTP input
    const handleOtpChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) && value.length <= 6) {
            setOtp(value);
        }
    };

    return (
        <section className="w-full" aria-labelledby="register-heading">
            <div className="mb-8 text-center lg:text-left">
                <h2 id="register-heading" className="text-4xl flex justify-center font-bold text-[#02599C]">Create Your Account</h2>
                <p className="mt-2 flex justify-center text-gray-500">
                    Start your learning journey with Margdarshak
                </p>
            </div>

            {error && (
                <div role="alert" className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* Progress Stepper */}
            <div className="flex items-center mb-10 w-full max-w-xs mx-auto" role="progressbar" aria-valuenow={step} aria-valuemin="1" aria-valuemax="2">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${step >= 1 ? "bg-[#003B73] border-[#003B73] text-white" : "border-gray-200 text-gray-400"}`}>
                    {step > 1 ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                    ) : "1"}
                </div>
                <div className={`flex-1 h-1 mx-2 transition-all duration-300 ${step >= 2 ? "bg-[#003B73]" : "bg-gray-100"}`} aria-hidden="true"></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${step === 2 ? "bg-[#003B73] border-[#003B73] text-white" : "border-gray-200 text-gray-400"}`}>
                    2
                </div>
            </div>

            <form onSubmit={(e) => {
                if (step === 1 || step === 2) {
                    nextStep(e);
                } else {
                    handleSubmit(e);
                }
            }} className="space-y-6" noValidate>
                {step === 1 ? (
                    // Step 1: Collect user details
                    <>
                        <div className="space-y-1">
                            <Input
                                label="Full Name"
                                name="fullName"
                                placeholder="Enter your full name"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                error={errors.fullName}
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                    </svg>
                                }
                            />
                            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                        </div>
                        <div className="space-y-1">
                            <Input
                                label="Email Address"
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                error={errors.email}
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                    </svg>
                                }
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>
                        <div className="space-y-1">
                            <Input
                                label="Phone Number"
                                name="phone"
                                type="tel"
                                placeholder="9876543210"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                error={errors.phone}
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                    </svg>
                                }
                            />
                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                        </div>
                        <div className="space-y-1">
                            <Input
                                label="Create Password"
                                name="password"
                                type={isPasswordVisible ? "text" : "password"}
                                placeholder="Create a strong password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                error={errors.password}
                                isVisible={isPasswordVisible}
                                onToggleVisibility={() => setIsPasswordVisible(!isPasswordVisible)}
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0V10.5m-2.25 1.35h13.5c.621 0 1.125.504 1.125 1.125v6.75c0 .621-.504 1.125-1.125 1.125H5.25a1.125 1.125 0 0 1-1.125-1.125v-6.75c0-.621.504-1.125 1.125-1.125Z" />
                                    </svg>
                                }
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>
                        <div className="space-y-1">
                            <Input
                                label="Confirm Password"
                                name="confirmPassword"
                                type={isPasswordVisible ? "text" : "password"}
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                error={errors.confirmPassword}
                                isVisible={isPasswordVisible}
                                onToggleVisibility={() => setIsPasswordVisible(!isPasswordVisible)}
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0V10.5m-2.25 1.35h13.5c.621 0 1.125.504 1.125 1.125v6.75c0 .621-.504 1.125-1.125 1.125H5.25a1.125 1.125 0 0 1-1.125-1.125v-6.75c0-.621.504-1.125 1.125-1.125Z" />
                                    </svg>
                                }
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                        </div>
                        <div className="flex items-start">
                            <input
                                id="agreedToTerms"
                                name="agreedToTerms"
                                type="checkbox"
                                checked={formData.agreedToTerms}
                                onChange={handleChange}
                                required
                                className="mt-1 h-4 w-4 text-[#003B73] focus:ring-[#003B73] border-gray-300 rounded cursor-pointer"
                            />
                            <label htmlFor="agreedToTerms" className="ml-2 block text-sm text-gray-500 cursor-pointer">
                                I agree to the{" "}
                                {" "}and{" "}
                                <Link href="/privacy" className="text-[#003B73] font-semibold hover:underline">Privacy Policy</Link>
                            </label>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            isLoading={loading}
                            disabled={loading}
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            }
                        >
                            Send OTP
                        </Button>
                    </>
                ) : (
                    // Step 2: Enter OTP
                    <>
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Verify Your Account</h3>
                            <p className="text-gray-500">
                                We've sent a 6-digit code to <span className="font-semibold">{formData.email}</span>
                            </p>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="otp-input" className="block text-sm font-medium text-gray-700 mb-2">
                                Enter OTP
                            </label>
                            <Input
                                id="otp-input"
                                type="text"
                                placeholder="Enter 6-digit code"
                                value={otp}
                                onChange={handleOtpChange}
                                maxLength={6}
                                required
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0V10.5m-2.25 1.35h13.5c.621 0 1.125.504 1.125 1.125v6.75c0 .621-.504 1.125-1.125 1.125H5.25a1.125 1.125 0 0 1-1.125-1.125v-6.75c0-.621.504-1.125 1.125-1.125Z" />
                                    </svg>
                                }
                            />
                        </div>

                        <div className="text-center text-sm text-gray-500 mb-6">
                            Didn't receive the code?{" "}
                            <button
                                type="button"
                                className={`font-semibold ${canResendOtp ? 'text-[#003B73] hover:underline' : 'text-gray-400 cursor-not-allowed'}`}
                                disabled={!canResendOtp}
                                onClick={async () => {
                                    if (!canResendOtp) return;
                                    // Resend OTP functionality
                                    try {
                                        const details = JSON.parse(localStorage.getItem("registration_details") || "{}");
                                        await requestOTP({
                                            name: details.fullName,
                                            email: details.email,
                                            phone: details.phone,
                                            currentClass: details.currentClass,
                                            password: details.password,
                                        });
                                    } catch (err) {
                                        console.error("Failed to resend OTP:", err);
                                    }
                                }}
                            >
                                {otpCooldown > 0
                                    ? `Resend in ${otpCooldown}s`
                                    : otpRetries <= 0
                                        ? 'No retries left'
                                        : 'Resend'}
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <Button variant="outline" onClick={prevStep} className="w-full">
                                Back
                            </Button>
                            <Button
                                type="submit"
                                className="w-full"
                                isLoading={loading}
                                disabled={loading || otp.length !== 6}
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                }
                            >
                                Verify & Complete
                            </Button>
                        </div>
                    </>
                )}
            </form>

            <div className="mt-10 text-center">
                <p className="text-gray-500 text-sm">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-bold text-[#003B73] hover:underline"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default RegisterForm;