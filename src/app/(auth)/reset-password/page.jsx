import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import AuthLayout from "@/components/auth/AuthLayout";

export const metadata = {
    title: "Reset Password | Margdarshak - Set New Account Password",
    description: "Set a new secure password for your Margdarshak account to regain access to your studies. Easy password reset for students.",
    keywords: ["reset password", "new password", "account security", "student login", "Margdarshak"],
    alternates: {
        canonical: "https://www.margdarshak.com/reset-password",
    },
};

export default function ResetPasswordPage() {
    return (
        <AuthLayout>
            <ResetPasswordForm />
        </AuthLayout>
    );
}
