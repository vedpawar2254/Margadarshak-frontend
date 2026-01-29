import LoginForm from "@/components/auth/LoginForm";
import AuthLayout from "@/components/auth/AuthLayout";

export const metadata = {
    title: "Login | Margdarshak - Empowering Students",
    description: "Sign in to your Margdarshak account to access affordable and high-quality education and mentorship.",
    keywords: "Margdarshak login, student education, mentorship platform",
};

export default function LoginPage() {
    return (
        <AuthLayout>
            <LoginForm />
        </AuthLayout>
    );
}
