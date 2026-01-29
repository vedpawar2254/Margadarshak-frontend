const WhyChooseUsSection = () => {
    const features = [
        {
            title: "Affordable & Accessible",
            description: "Quality education at prices designed for Tier 2 & 3 families.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            bg: "bg-[#0f52ba]"
        },
        {
            title: "Certified Tutors",
            description: "Learn from experienced educators with proven track records.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                </svg>
            ),
            bg: "bg-green-500"
        },
        {
            title: "Online + Offline Classes",
            description: "Flexible learning modes to suit your comfort and schedule.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                </svg>
            ),
            bg: "bg-orange-500"
        },
        {
            title: "Local Language Support",
            description: "Learn in your preferred language - Hindi, English, and regional languages.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
                </svg>
            ),
            bg: "bg-purple-600"
        }
    ];

    return (
        <section className="py-10 md:py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                        Why Choose <span className="text-[#0f52ba]">Margdarshak?</span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        We're committed to providing the best learning experience tailored for students in smaller cities.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {features.map((feature, index) => (
                        <div key={index} className="text-center">
                            <div className={`w-16 h-16 mx-auto rounded-xl ${feature.bg} flex items-center justify-center mb-6 shadow-lg`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                            <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-green-50 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <div className="text-[#0f52ba] text-3xl font-bold mb-1">₹999</div>
                        <div className="text-gray-600 text-sm">Starting from per month</div>
                    </div>
                    <div className="h-12 w-px bg-gray-300 hidden md:block"></div>
                    <div className="text-center md:text-left">
                        <div className="text-green-600 text-3xl font-bold mb-1">24/7</div>
                        <div className="text-gray-600 text-sm">Doubt resolution support</div>
                    </div>
                    <div className="h-12 w-px bg-gray-300 hidden md:block"></div>
                    <div className="text-center md:text-left">
                        <div className="text-orange-500 text-3xl font-bold mb-1">100%</div>
                        <div className="text-gray-600 text-sm">Money-back guarantee</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUsSection;
