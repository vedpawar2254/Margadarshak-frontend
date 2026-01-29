import React from "react";

export const metadata = {
    title: 'Refund Policy | Margdarshak',
    description: 'Read our transparent refund policy regarding courses, assessments, and digital products.',
    robots: {
        index: false,
        follow: true,
    },
};

export default function RefundPolicyPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-[#1a1a1a]">
            {/* Header / Hero Section */}
            <div className="pt-20 md:pt-28 pb-10 md:pb-12 px-4 text-center max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 font-sans">
                    <span className="text-[#004880]">Refund Policy</span>
                    <span className="text-black"> – </span>
                    <br className="md:hidden" />
                    <span className="text-black">Margdarshakk</span>
                </h1>
                <p className="text-gray-600 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed font-medium font-sans">
                    At Margdarshakk, we strive to provide learners with high-quality online courses, training modules,
                    and test assessments. Your satisfaction is important to us. However, since our offerings are digital
                    and accessible immediately upon purchase, our refund policy is designed to be fair and transparent.
                </p>
            </div>

            <main className="max-w-6xl mx-auto px-4 pb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 lg:gap-20 items-start">
                    {/* Left Column */}
                    <div className="space-y-12">
                        {/* 1. No Refund Policy */}
                        <section>
                            <h3 className="text-xl font-bold text-[#004880] mb-5 font-sans">
                                1. No Refund Policy for Completed Purchases
                            </h3>
                            <p className="text-gray-600 mb-4 leading-relaxed font-sans">
                                Once a course, test, or digital product is purchased through Razorpay and access is granted to the user, the transaction is non-refundable.
                            </p>
                            <div className="bg-[#fff9f0] border border-orange-100 rounded-xl py-4 px-5">
                                <p className="text-[#854d0e] text-sm md:text-base font-medium font-sans">
                                    Digital learning content cannot be returned, downloaded access cannot be revoked, and hence refunds cannot be processed after access is provided.
                                </p>
                            </div>
                        </section>

                        {/* 2. Exceptions */}
                        <section>
                            <h3 className="text-xl font-bold text-[#004880] mb-5 font-sans">
                                2. Exceptions – Eligible for Refund
                            </h3>
                            <p className="text-gray-600 mb-4 font-medium text-sm md:text-base font-sans">
                                Refunds may be considered only in the following cases:
                            </p>
                            <ul className="space-y-6">
                                <li className="flex gap-3 text-gray-600 leading-relaxed font-sans">
                                    <div className="mt-1 shrink-0 w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                        <span className="text-xs font-bold">1</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-sm md:text-base">Duplicate Payment</h4>
                                        <p className="text-sm mt-1">If you have been charged twice for the same course or assessment, please notify us within 7 days. We will verify and refund the duplicate payment.</p>
                                    </div>
                                </li>
                                <li className="flex gap-3 text-gray-600 leading-relaxed font-sans">
                                    <div className="mt-1 shrink-0 w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                        <span className="text-xs font-bold">2</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-sm md:text-base">Technical Error</h4>
                                        <p className="text-sm mt-1">If a payment was made but access to the purchased course/test was not granted due to a technical issue on our end, we will verify the error and provide a refund or grant access.</p>
                                    </div>
                                </li>
                                <li className="flex gap-3 text-gray-600 leading-relaxed font-sans">
                                    <div className="mt-1 shrink-0 w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                        <span className="text-xs font-bold">3</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-sm md:text-base">Incorrect Purchase</h4>
                                        <p className="text-sm mt-1">If a user accidentally purchases the wrong course and has not accessed or started it, a refund request may be made within 48 hours.</p>
                                    </div>
                                </li>
                            </ul>
                        </section>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-10 md:space-y-12">
                        {/* 3. Refund Request Process */}
                        <section>
                            <h3 className="text-xl font-bold text-[#004880] mb-5 font-sans">
                                3. Refund Request Process
                            </h3>
                            <div className="bg-[#f0f7ff] border border-blue-100 rounded-2xl p-6">
                                <p className="text-gray-700 font-medium mb-4">To request a refund (in eligible cases):</p>
                                <ol className="space-y-4 list-decimal pl-5 text-gray-600">
                                    <li>
                                        <span className="font-medium text-gray-800">Send an email</span> to <a href="mailto:tech.margdarshakk@gmail.com" className="text-blue-600 hover:underline">tech.margdarshakk@gmail.com</a> with the following details:
                                        <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                                            <li>Full Name</li>
                                            <li>Registered Email ID / Phone Number</li>
                                            <li>Transaction ID (from Razorpay receipt)</li>
                                            <li>Reason for Refund Request</li>
                                        </ul>
                                    </li>
                                    <li>
                                        Our support team will review your request and respond within 5–7 business days.
                                    </li>
                                </ol>
                            </div>
                        </section>

                        {/* 4. Processing Time & 5. Non-Transferable */}
                        <section className="space-y-8">
                            <div>
                                <h3 className="text-lg font-bold text-[#004880] mb-3 font-sans">4. Refund Processing Time</h3>
                                <ul className="space-y-2 text-gray-600 text-sm md:text-base list-disc pl-5">
                                    <li>Approved refunds will be processed through Razorpay to the original payment method.</li>
                                    <li>It may take 7–10 business days for the amount to reflect in your account, depending on your bank or payment provider.</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-[#004880] mb-3 font-sans">5. Non-Transferable</h3>
                                <p className="text-gray-600 text-sm md:text-base">
                                    Refunds (where applicable) will only be made to the original payer. Course access or refunds cannot be transferred to another individual.
                                </p>
                            </div>
                        </section>

                        {/* 6. Contact Us */}
                        <section>
                            <h3 className="text-xl font-bold text-[#004880] mb-5 font-sans">6. Contact Us</h3>
                            <div className="flex flex-col gap-3">
                                <p className="text-gray-600">If you have any questions or need assistance, please contact:</p>
                                <a href="mailto:tech.margdarshakk@gmail.com" className="flex items-center gap-3 text-[#004880] font-bold group">
                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    </div>
                                    tech.margdarshakk@gmail.com
                                </a>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            {/* Footer Disclaimer */}
            <div className="bg-white border-t border-gray-100 py-6 px-4">
                <div className="max-w-6xl mx-auto flex items-start gap-2 text-gray-400 text-[10px] leading-relaxed">
                    <span className="text-yellow-600 shrink-0 mt-0.5">⚠️</span>
                    <p>
                        <span className="font-bold">Margdarshak</span> operates in a learning and guidance capacity. All services are provided in good faith with full transparency during the pre-registration phase.
                    </p>
                </div>
            </div>
        </div>
    );
}


