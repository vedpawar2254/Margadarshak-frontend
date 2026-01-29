const MissionSection = () => {
    const cards = [
        {
            title: "Our Vision",
            description: "Making world-class education accessible to every student in smaller cities across India.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#0f52ba]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            bgColor: "bg-blue-50",
            iconBg: "bg-blue-100"
        },
        {
            title: "Our Community",
            description: "A supportive network of learners, mentors, and educators growing together.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-yellow-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
            ),
            bgColor: "bg-yellow-50",
            iconBg: "bg-yellow-100"
        },
        {
            title: "Our Value",
            description: "Integrity, excellence, and unwavering commitment to student success.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
            ),
            bgColor: "bg-green-50",
            iconBg: "bg-green-100"
        }
    ];

    return (
        <section className="py-10 md:py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-[#0f52ba] mb-6">
                        Empowering Dream Beyond Boundaries
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        To empower students from Tier 2 and Tier 3 cities to become confident, skilled, and career-ready individuals by bridging the gap between education and employability through simplified, inclusive, and practical learning.                    </p>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        We envision a future where a student’s growth is not limited by geography, background, or access to resources, and where skills, confidence, and clarity matter more than just degrees.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {cards.map((card, index) => (
                        <div key={index} className={`${card.bgColor} rounded-2xl p-6 text-center hover:shadow-lg transition-shadow duration-300`}>
                            <div className={`w-12 h-12 mx-auto rounded-full ${card.iconBg} flex items-center justify-center mb-6`}>
                                {card.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{card.title}</h3>
                            <p className="text-gray-600">{card.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MissionSection;
