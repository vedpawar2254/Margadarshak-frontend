"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/navigation";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { validateEmail, validatePassword } from "../../utils/validation";

const LoginForm = () => {
    const { login, loading, error, loginWithGoogle } = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        // Clear error when user starts typing
        if (name === "email") {
            setEmailError("");
        } else if (name === "password") {
            setPasswordError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate inputs
        let isValid = true;

        if (!validateEmail(formData.email)) {
            setEmailError("Please enter a valid email address");
            isValid = false;
        }

        if (!formData.password) {
            setPasswordError("Password is required");
            isValid = false;
        }

        if (!isValid) return;

        try {
            const response = await login({ email: formData.email, password: formData.password });
            const user = response?.data?.student || response?.data?.user;

            // Check for stored redirect intent (from AuthActionButton)
            const redirectIntent = sessionStorage.getItem('redirectAfterLogin');
            sessionStorage.removeItem('redirectAfterLogin');

            if (redirectIntent) {
                // User had an intended destination - go there
                router.push(redirectIntent);
            } else if (user?.email === 'namanjainpy@gmail.com') {
                router.push("/admin");
            } else {
                router.push("/courses");
            }
        } catch (err) {
            console.error("Login failed:", err);
        }
    };

    return (
        <section className="w-full" aria-labelledby="login-heading">
            <div className="mb-10 text-center lg:text-left">
                <h2 id="login-heading" className="text-5xl font-bold text-[#02599C]">Welcome back!</h2>
                <p className="mt-2 text-gray-500">
                    Enter your credentials to access your account
                </p>
            </div>

            {error && (
                <div role="alert" className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="space-y-1">
                    <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        error={emailError}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                            </svg>
                        }
                    />
                    {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                </div>

                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <Link
                            href="/forgot-password"
                            className="text-sm font-semibold text-[#003B73] hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <Input
                        id="password"
                        name="password"
                        type={isPasswordVisible ? "text" : "password"}
                        placeholder="Enter your password"
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
                    Sign In
                </Button>

                <div className="relative my-8 text-center">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <span className="relative px-4 text-sm text-gray-400 bg-white">
                        or continue with
                    </span>
                </div>

                <div className="grid gap-4">
                    <Button
                        variant="outline"
                        className="w-full flex items-center py-2.5"
                        type="button"
                        onClick={loginWithGoogle}
                        aria-label="Sign in with Google"
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                    </Button>
                </div>
            </form>

            <div className="mt-10 text-center">
                <p className="text-gray-500 text-sm">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/register"
                        className="font-bold text-[#003B73] hover:underline"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default LoginForm;