import React from "react";

export const metadata = {
    title: 'Privacy Policy | Margdarshak',
    description: 'Read our Privacy Policy to understand how we collect, use, and protect your personal information.',
    keywords: 'privacy policy, data protection, margdarshak privacy, gdpr, personal information',
};

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-[#1a1a1a]">
            {/* Header / Hero Section */}
            <div className="pt-20 md:pt-28 pb-10 md:pb-12 px-4 text-center max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 font-sans">
                    <span className="text-[#004880]">Privacy Policy</span>
                    <span className="text-black"> – </span>
                    <br className="md:hidden" />
                    <span className="text-black">Margdarshak</span>
                </h1>
                <p className="text-gray-600 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed font-medium font-sans">
                    Last Updated: 01-Feb-2026
                </p>
            </div>

            <main className="max-w-4xl mx-auto px-4 pb-24 space-y-12 text-gray-700 leading-relaxed text-sm md:text-base">

                {/* 1. Introduction */}
                <section>
                    <h2 className="text-2xl font-bold text-[#004880] mb-4">1. Introduction</h2>
                    <p>
                        Welcome to Margdarshak, your privacy is one of our main priorities. This Privacy Policy document explains how we collect, use, and protect your personal information when you visit our website <a href="https://www.margdarshakacademy.com" className="text-blue-600 hover:underline">www.margdarshakacademy.com</a>.
                    </p>
                    <p className="mt-2">
                        By accessing or using our Website, you agree to this Privacy Policy and its terms. If you do not agree, please do not use our Website.
                    </p>
                    <p className="mt-2 text-gray-500 italic">
                        If you have any questions or concerns about this Privacy Policy, you may contact us at <a href="mailto:tech.margdarshakk@gmail.com" className="text-blue-600 hover:underline">tech.margdarshakk@gmail.com</a>.
                    </p>
                </section>

                {/* 2. Applicability */}
                <section>
                    <h2 className="text-2xl font-bold text-[#004880] mb-4">2. Applicability</h2>
                    <p>This Privacy Policy applies to:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Information collected through our Website and online activities.</li>
                        <li>Visitors and registered users interacting with our Website.</li>
                    </ul>
                    <p className="mt-2">
                        This policy does not apply to information collected offline or through other channels not operated by us.
                    </p>
                </section>

                {/* 3. Consent */}
                <section>
                    <h2 className="text-2xl font-bold text-[#004880] mb-4">3. Consent</h2>
                    <p>
                        By using our Website, you hereby consent to our Privacy Policy and agree to its terms.
                    </p>
                </section>

                {/* 4. Information We Collect */}
                <section>
                    <h2 className="text-2xl font-bold text-[#004880] mb-4">4. Information We Collect</h2>
                    <p>We may collect the following types of information:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>Personal Identification Information:</strong> Name, email address, phone number, company name, and address.</li>
                        <li><strong>Account Registration Information:</strong> Username, password, and related credentials.</li>
                        <li><strong>Communication Data:</strong> Contents of messages, feedback, or attachments you send us directly.</li>
                        <li><strong>Technical Data:</strong> IP address, browser type, device details, date and time of visit, pages viewed, and referring URLs.</li>
                        <li><strong>Cookies and Usage Data:</strong> Information on your preferences and activity on our Website.</li>
                    </ul>
                </section>

                {/* 5. How We Use Your Information */}
                <section>
                    <h2 className="text-2xl font-bold text-[#004880] mb-4">5. How We Use Your Information</h2>
                    <p>We use the collected information to:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Provide, operate, and maintain our Website and services.</li>
                        <li>Improve and personalize user experience.</li>
                        <li>Understand how users engage with our Website.</li>
                        <li>Communicate with you for customer support, updates, or promotional purposes.</li>
                        <li>Send emails, newsletters, and notifications.</li>
                        <li>Detect, prevent, and address fraud, security issues, or technical problems.</li>
                        <li>Comply with legal obligations.</li>
                    </ul>
                </section>

                {/* 6. Log Files */}
                <section>
                    <h2 className="text-2xl font-bold text-[#004880] mb-4">6. Log Files</h2>
                    <p>Margdarshak follows a standard procedure of using log files. These files log visitors when they visit websites — a common practice among hosting companies.</p>
                    <p className="mt-2">The information collected includes IP addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and number of clicks.</p>
                    <p className="mt-2">This data is used for analyzing trends, administering the site, and improving user experience. No personally identifiable information is linked to these log files.</p>
                </section>

                {/* 7. Cookies and Web Beacons */}
                <section>
                    <h2 className="text-2xl font-bold text-[#004880] mb-4">7. Cookies and Web Beacons</h2>
                    <p>Like most websites, Margdarshak uses cookies to store information about visitors’ preferences and activity.</p>
                    <p className="mt-2">Cookies help us optimize your experience by customizing website content based on browser type or other data.</p>
                    <p className="mt-2">You can choose to disable cookies through your browser settings. For detailed guidance, visit your browser’s support site.</p>
                </section>

                {/* 8. Google Advertising and Third-Party Cookies */}
                <section>
                    <h2 className="text-2xl font-bold text-[#004880] mb-4">8. Google Advertising and Third-Party Cookies</h2>
                    <p>Our Website may use Google services that employ cookies (including DoubleClick DART cookies) to serve ads based on your visit to www.margdarshakacademy.com and other sites.</p>
                    <p className="mt-2">
                        You may opt out of personalized ads by visiting: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://policies.google.com/technologies/ads</a>.
                    </p>
                    <p className="mt-2">
                        We may also partner with other advertisers who use similar technologies (cookies, JavaScript, or web beacons) for analytics or ads. Margdarshak has no control over third-party cookies.
                    </p>
                </section>

                {/* 9. Third-Party Privacy Policies */}
                <section>
                    <h2 className="text-2xl font-bold text-[#004880] mb-4">9. Third-Party Privacy Policies</h2>
                    <p>
                        Our Privacy Policy does not apply to other advertisers or websites. Please refer to their respective privacy policies for detailed practices and opt-out options.
                    </p>
                </section>

                {/* 10. Data Retention */}
                <section>
                    <h2 className="text-2xl font-bold text-[#004880] mb-4">10. Data Retention</h2>
                    <p>We retain personal data only for as long as necessary to:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Provide services,</li>
                        <li>Fulfill the purposes outlined in this policy, or</li>
                        <li>Comply with legal obligations.</li>
                    </ul>
                    <p className="mt-2">
                        Users may request deletion of their data by contacting us at <a href="mailto:tech.margdarshakk@gmail.com" className="text-blue-600 hover:underline">tech.margdarshakk@gmail.com</a>.
                    </p>
                </section>

                {/* 11. Data Security */}
                <section>
                    <h2 className="text-2xl font-bold text-[#004880] mb-4">11. Data Security</h2>
                    <p>
                        We adopt reasonable security practices and procedures as required under the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.
                    </p>
                    <p className="mt-2">
                        These include administrative, technical, and physical safeguards to prevent unauthorized access, misuse, or disclosure of your personal information.
                    </p>
                </section>

                {/* 12. Sensitive Personal Data */}
                <section>
                    <h2 className="text-2xl font-bold text-[#004880] mb-4">12. Sensitive Personal Data</h2>
                    <p>If we collect Sensitive Personal Data (such as financial or health information), it will only be:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Collected with your explicit consent,</li>
                        <li>Used for specific lawful purposes, and</li>
                        <li>Protected in accordance with applicable Indian data protection laws.</li>
                    </ul>
                </section>

                {/* 13. International Data Transfers */}
                <section>
                    <h2 className="text-2xl font-bold text-[#004880] mb-4">13. International Data Transfers</h2>
                    <p>Your data may be processed or stored on servers located outside India. By using our Website, you consent to such transfer in compliance with applicable data protection laws.</p>
                </section>

                {/* 14. Your Data Protection Rights (GDPR & CCPA) */}
                <section>
                    <h2 className="text-2xl font-bold text-[#004880] mb-4">14. Your Data Protection Rights (GDPR & CCPA)</h2>
                    <p>Depending on your location, you may have certain data protection rights, including:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Right to Access</li>
                        <li>Right to Rectification</li>
                        <li>Right to Erasure</li>
                        <li>Right to Restrict or Object</li>
                        <li>Right to Data Portability</li>
                        <li>Right to Opt-Out (CCPA)</li>
                    </ul>
                    <p className="mt-2">
                        If you wish to exercise any of these rights, contact us at <a href="mailto:tech.margdarshakk@gmail.com" className="text-blue-600 hover:underline">tech.margdarshakk@gmail.com</a>. We will respond within one month, as required by law.
                    </p>
                </section>

                {/* 15. Children’s Privacy */}
                <section>
                    <h2 className="text-2xl font-bold text-[#004880] mb-4">15. Children’s Privacy</h2>
                    <p>
                        Protecting children’s privacy online is important to us. Margdarshak does not knowingly collect any personal information from children under 13.
                    </p>
                    <p className="mt-2">
                        If you believe your child has provided such information, please contact us immediately. We will promptly delete it from our records.
                    </p>
                </section>

                {/* 16. Grievance Officer */}
                <section>
                    <h2 className="text-2xl font-bold text-[#004880] mb-4">16. Grievance Officer (as per Indian IT Act)</h2>
                    <p>In compliance with the Information Technology Act, 2000, the Grievance Officer for Margdarshak is:</p>
                    <div className="mt-3 p-4 bg-gray-50 border border-gray-100 rounded-lg">
                        <p><strong>Name:</strong> Ravi</p>
                        <p><strong>Email:</strong> <a href="mailto:tech.margdarshakk@gmail.com" className="text-blue-600 hover:underline">tech.margdarshakk@gmail.com</a></p>
                        <p><strong>Address:</strong> Delhi/NCR</p>
                        <p><strong>Response Time:</strong> Within one month of receiving a request or complaint.</p>
                    </div>
                </section>

                {/* 17. Updates to this Privacy Policy */}
                <section>
                    <h2 className="text-2xl font-bold text-[#004880] mb-4">17. Updates to this Privacy Policy</h2>
                    <p>
                        We may update this Privacy Policy periodically. The updated version will be posted on this page with a revised “Last Updated” date.
                        We encourage users to review this page regularly to stay informed of any changes.
                    </p>
                </section>

                {/* 18. Governing Law & Jurisdiction */}
                <section>
                    <h2 className="text-2xl font-bold text-[#004880] mb-4">18. Governing Law & Jurisdiction</h2>
                    <p>
                        This Privacy Policy shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with this Policy shall be subject to the exclusive jurisdiction of the courts in Delhi, India.
                    </p>
                </section>

            </main>
        </div>
    );
}
