import RegisterForm from "@/components/auth/RegisterForm";
import AuthLayout from "@/components/auth/AuthLayout";

export const metadata = {
    title: "Create Account | Margdarshak - Empowering Students",
    description: "Join Margdarshak today and start your journey towards achieving your dreams with expert mentorship and quality classes.",
    keywords: "Margdarshak register, create account, student mentorship",
};

export default function RegisterPage() {
    return (
        <AuthLayout>
            <RegisterForm />
        </AuthLayout>
    );
}
