"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const AuthLayout = ({ children }) => {
    const stats = [
        { label: "Students Guided", value: "500+" },
        { label: "Certified Tutors", value: "15+" },
        { label: "Success Rate", value: "95%" },
    ];

    const features = [
        {
            title: "Online + Offline Classes",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
            ),
        },
        {
            title: "Expert Mentorship",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                </svg>
            ),
        },
        {
            title: "Career Support",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.425 4.708 5.25 5.25 0 0 0 2.263 6.941c.213.116.433.221.66.314m15.044-11.963a50.64 50.64 0 0 1 2.425 4.708 5.25 5.25 0 0 1-2.263 6.941c-.213.116-.433.221-.66.314m-15.044-11.963C6.345 9.38 9.079 9 12 9s5.655.38 7.74 1.147m-15.482 0a50.717 50.717 0 0 1 3.15-5.53A5.25 5.25 0 0 1 12 3c3.042 0 5.424 2.181 6.132 5.068a50.719 50.719 0 0 1 3.15 5.53m-15.482-10.61A50.47 50.47 0 0 0 12 4.5c2.147 0 4.19.134 6.182.39" />
                </svg>
            ),
        },
        {
            title: "Affordable Pricing",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.425 4.708 5.25 5.25 0 0 0 2.263 6.941c.213.116.433.221.66.314m15.044-11.963a50.64 50.64 0 0 1 2.425 4.708 5.25 5.25 0 0 1-2.263 6.941c-.213.116-.433.221-.66.314m-15.044-11.963C6.345 9.38 9.079 9 12 9s5.655.38 7.74 1.147m-15.482 0a50.717 50.717 0 0 1 3.15-5.53A5.25 5.25 0 0 1 12 3c3.042 0 5.424 2.181 6.132 5.068a50.719 50.719 0 0 1 3.15 5.53m-15.482-10.61A50.47 50.47 0 0 0 12 4.5c2.147 0 4.19.134 6.182.39" />
                </svg>
            ),
        },
    ];

    return (
        <div className="h-screen grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
            {/* Left Side: Gradient Background & Branding */}
            <aside className="hidden lg:flex flex-col justify-between p-8 relative overflow-hidden bg-[#004880] h-full">
                {/* Background Decorative Pattern */}
                <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-[#004E89] via-transparent to-transparent opacity-40" aria-hidden="true"></div>
                <div className="absolute bottom-0 left-0 right-0 h-1/2 z-0 bg-linear-to-t from-[#003566] to-transparent opacity-60" aria-hidden="true"></div>

                <header className="relative z-10">
                    <Link href="/" className="flex items-center text-white hover:opacity-90 transition-opacity">
                        <Image
                            src="/Mwhitelogo.png"
                            alt="Margdarshak Logo - Empowering Students to Achieve Their Dreams"
                            width={43}
                            height={43}
                            className="w-13 h-15 mr-0"
                        />
                        <span className="text-2xl font-extrabold mt-2.5 tracking-tight">Margdarshak</span>
                    </Link>

                    <div className="mt-16 max-w-md">
                        <h1 className="text-4xl font-extrabold text-white leading-tight">
                            Empowering Students to <br />
                            <span className="text-[#FFC300]">Achieve Their Dreams</span>
                        </h1>
                        <p className="mt-5 text-lg text-blue-100/80 leading-relaxed">
                            To empower students from Tier 2 and Tier 3 cities to become confident, skilled, and career-ready individuals by bridging the gap between education and employability through simplified, inclusive, and practical learning.                        </p>
                    </div>

                    <div className="mt-12 grid grid-cols-3 gap-6">
                        {stats.map((stat, index) => (
                            <div key={index}>
                                <strong className="text-3xl font-bold text-[#FFC300]">{stat.value}</strong>
                                <p className="mt-1 text-blue-100/60 font-medium text-sm">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </header>

                <div className="relative z-10 grid grid-cols-2 gap-3 mt-auto" role="list">
                    {features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2 bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-xl" role="listitem">
                            <div className="bg-[#FFC300]/20 p-1.5 rounded-lg text-[#FFC300]">
                                {feature.icon}
                            </div>
                            <span className="text-white font-medium text-xs">{feature.title}</span>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Right Side: Form Container */}
            <main className="flex flex-col bg-white h-full overflow-y-auto">
                <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-8">
                    <div className="max-w-md w-full mx-auto">
                        <Link href="/" className="lg:hidden flex items-center mb-4 text-[#004880] hover:opacity-90 transition-opacity">
                            <Image
                                src="/Mbluelogo.png"
                                alt="Margdarshak Logo - Empowering Students to Achieve Their Dreams"
                                width={40}
                                height={40}
                                className="w-13 h-15 mr-1"
                            />
                            <span className="text-2xl font-extrabold mt-2.5 tracking-tight">Margdarshak</span>
                        </Link>
                        {children}
                    </div>
                </div>

                {/* Footer */}
                <footer className="px-6 sm:px-10 lg:px-16 py-6 border-t border-gray-100 mt-auto">
                    <div className="flex flex-col items-center space-y-3">
                        <p className="text-xs text-gray-500">© 2025 Margdarshak. All rights reserved.</p>
                        <nav className="flex space-x-4" aria-label="Legal navigation">
                            <a href="/privacy" className="text-xs text-gray-400 hover:text-gray-600">Privacy Policy</a>
                        </nav>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default AuthLayout;