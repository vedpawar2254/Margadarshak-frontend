import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import AuthLayout from "@/components/auth/AuthLayout";

export const metadata = {
    title: "Forgot Password | Margdarshak - Reset Your Account Password",
    description: "Reset your Margdarshak account password to regain access to your learning journey. Secure and easy password recovery for students.",
    keywords: ["forgot password", "password reset", "account recovery", "student login", "Margdarshak support"],
    alternates: {
        canonical: "https://www.margdarshak.com/forgot-password",
    },
};

export default function ForgotPasswordPage() {
    return (
        <AuthLayout>
            <ForgotPasswordForm />
        </AuthLayout>
    );
}
