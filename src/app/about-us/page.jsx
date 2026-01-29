import Image from 'next/image';

export const metadata = {
    title: 'About Us | Margdarshak - Guiding Futures, Beyond Degrees',
    description: 'Margdarshak bridges the gap between education and employability through innovative mentorship, practical training, and career guidance.',
    keywords: 'Margdarshak, career guidance, mentorship, tier 2 cities, tier 3 cities, employability, skill development, education',
};

export default function AboutUsPage() {
    return (
        <div className="bg-[#F8F9FA] min-h-screen font-jakarta text-[#1F2937] selection:bg-[#0EA5E9] selection:text-white overflow-x-hidden">

            {/* 1. Ultra Premium Hero Section */}
            <section className="relative pt-32 pb-32 lg:pb-40 px-4 text-center overflow-hidden bg-white">
                {/* Background Decor */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-blue-50/80 via-indigo-50/50 to-transparent blur-[80px] rounded-full opacity-60" />
                    <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-teal-50/40 rounded-full blur-[100px]" />
                    <div className="absolute top-40 left-0 w-[300px] h-[300px] bg-purple-50/30 rounded-full blur-[80px]" />
                </div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md border border-gray-100 rounded-full text-xs font-[800] uppercase tracking-[0.2em] mb-10 text-blue-600 shadow-xl shadow-blue-900/5 hover:-translate-y-1 transition-all">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        Who We Are
                    </div>

                    <h1 className="text-[48px] md:text-[80px] font-[900] text-[#0F172A] mb-8 leading-[1.05] tracking-tight">
                        Guiding Futures, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0052cc] via-[#0EA5E9] to-[#0052cc]">
                            Beyond Degrees.
                        </span>
                    </h1>

                    <p className="text-[#64748B] text-lg md:text-[22px] mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
                        At Margdarshak, we don’t just educate—we guide, empower, and uplift futures ensuring skills match ambition regardless of geography.
                    </p>
                </div>
            </section>

            <div className="max-w-[1280px] mx-auto px-4 md:px-8 space-y-32 pb-40">

                {/* 2. Vision & Mission - Light Theme */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
                    {/* Vision Card */}
                    <div className="group relative bg-white/80 rounded-[48px] p-10 md:p-14 border border-blue-100 overflow-hidden shadow-xl shadow-blue-900/5 hover:border-blue-200 transition-colors duration-300">
                        {/* Abstract BG */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-50 to-purple-50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

                        <div className="relative z-10 h-full flex flex-col">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl mb-10 border border-blue-100 shadow-sm group-hover:scale-110 transition-transform duration-500">
                                🌟
                            </div>
                            <h2 className="text-[32px] md:text-[40px] font-[900] text-[#0F172A] mb-6 tracking-tight leading-tight">
                                Our Vision
                            </h2>
                            <p className="text-[#64748B] text-lg md:text-[19px] leading-relaxed font-medium mb-10 flex-1">
                                To empower students from Tier 2 and Tier 3 cities to become confident, skilled, and career-ready individuals by bridging the gap between education and employability through simplified, inclusive, and practical learning.
                            </p>
                            <div className="pt-8 border-t border-gray-100">
                                <p className="text-blue-600/80 text-base font-bold italic">
                                    "Where skills, confidence, and clarity matter more than just degrees."
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Mission Card */}
                    <div className="group relative bg-white rounded-[48px] p-10 md:p-14 border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden hover:border-blue-100 transition-colors duration-300">
                        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-bl from-teal-50 to-transparent rounded-full opacity-60 blur-3xl" />

                        <div className="relative z-10 h-full flex flex-col">
                            <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-3xl mb-10 border border-teal-100 shadow-sm group-hover:scale-110 transition-transform duration-500">
                                🎯
                            </div>
                            <h2 className="text-[32px] md:text-[40px] font-[900] text-[#0F172A] mb-6 tracking-tight leading-tight">
                                Our Mission
                            </h2>
                            <p className="text-[#64748B] text-lg md:text-[19px] leading-relaxed font-medium mb-10">
                                To bridge the gap between college learning and corporate readiness through mentorship, practical training, and career guidance.
                            </p>

                            <ul className="space-y-5 mt-auto">
                                {[
                                    'Deliver industry-relevant training & mentorship.',
                                    'Create career-ready youth through hands-on learning.',
                                    'Foster holistic growth: knowledge + confidence.',
                                    'Build a supportive community of mentors & learners.'
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start gap-4 group/item">
                                        <div className="w-6 h-6 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0 mt-0.5 border border-teal-100 group-hover/item:bg-teal-100 transition-colors">
                                            <svg className="w-3 h-3 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <span className="text-[#334155] font-[700] text-[15px] leading-snug group-hover/item:text-teal-700 transition-colors">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 3. Core Values - Modern Grid */}
                <section>
                    <div className="text-center mb-20">
                        <span className="text-blue-600 font-[800] uppercase tracking-widest text-xs mb-3 block">Our Philosophy</span>
                        <h2 className="text-[40px] md:text-[56px] font-[900] text-[#0F172A] tracking-tight leading-[1.1]">
                            Core Values that <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">Drive Us</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: '🌉',
                                color: 'blue',
                                title: 'Bridging Skills',
                                desc: 'Closing the gap between academic theory and real-world industry demands with practical skills.'
                            },
                            {
                                icon: '💡',
                                color: 'amber',
                                title: 'Simplification',
                                desc: 'Transforming complex career paths into clear, actionable, and understandable steps for everyone.'
                            },
                            {
                                icon: '🚀',
                                color: 'purple',
                                title: 'Upliftment',
                                desc: 'Building confidence, communication, and mindset to help youth unlock their full potential.'
                            },
                            {
                                icon: '🌍',
                                color: 'teal',
                                title: 'Inclusive Access',
                                desc: 'Democratizing quality mentorship for students across Tier 2 & Tier 3 cities ensuring equal opportunity.'
                            }
                        ].map((value, idx) => (
                            <div key={idx} className="group bg-white p-8 md:p-10 rounded-[32px] border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:shadow-gray-200/50 hover:-translate-y-2 relative overflow-hidden">
                                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-${value.color}-500 to-${value.color}-300 opacity-0 group-hover:opacity-100 transition-opacity`} />

                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 bg-gray-50 group-hover:bg-${value.color}-50 text-${value.color}-600`}>
                                    {value.icon}
                                </div>
                                <h3 className="text-[22px] font-[800] text-[#0F172A] mb-4 group-hover:text-blue-700 transition-colors">{value.title}</h3>
                                <p className="text-[#64748B] text-[15px] leading-relaxed font-medium">
                                    {value.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. Founders - Premium Layout */}
                <section className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] rounded-[48px] p-8 md:p-16 border border-white shadow-2xl shadow-blue-900/5 relative overflow-hidden">
                    {/* Decor */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-white to-transparent rounded-full blur-3xl opacity-60 pointer-events-none" />
                    <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-100 rounded-full blur-[80px] opacity-40 mix-blend-multiply" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-24 items-center">
                        <div className="space-y-8">
                            <div>
                                <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-[11px] font-[900] uppercase tracking-wider mb-6">Built on Experience</div>
                                <h2 className="text-[40px] md:text-[52px] font-[900] text-[#0F172A] mb-8 tracking-tight leading-[1.1]">
                                    Driven by Purpose, <br />
                                    <span className="text-gray-400">Founded on Expertise.</span>
                                </h2>

                                <div className="space-y-6 text-[#475569] text-lg leading-relaxed font-medium">
                                    <p>
                                        Margdarshak is founded by seasoned professionals with over <strong className="text-blue-900">a decade of collective corporate experience</strong> across Operations, Finance, HR, and Training.
                                    </p>
                                    <p>
                                        Having witnessed the gap between formal degrees and career readiness, we realized that talent isn't limited to metros—but access to the right guidance is.
                                    </p>
                                    <p>
                                        Our approach blends industry insight with empathy—helping learners build not just skills, but also confidence and direction.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white/60 p-8 rounded-3xl border border-white shadow-sm backdrop-blur-sm relative">
                                <span className="absolute -top-4 -left-2 text-6xl text-blue-100 font-serif">“</span>
                                <p className="text-[#1E293B] font-[700] italic text-lg leading-relaxed relative z-10 pl-4">
                                    We aim to give back our expertise to the next generation—guiding young minds to become skilled, confident, and future-ready professionals, regardless of where they come from.
                                </p>
                            </div>
                        </div>

                        {/* Visual for Founders */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-blue-600 rounded-[40px] rotate-3 opacity-10 group-hover:rotate-6 transition-transform duration-500" />
                            <div className="bg-white rounded-[40px] aspect-[4/5] relative overflow-hidden flex flex-col items-center justify-center text-center p-10 border border-white shadow-xl">
                                <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center text-6xl mb-8 shadow-inner border border-blue-100 group-hover:scale-110 transition-transform duration-500">
                                    👥
                                </div>
                                <h3 className="text-3xl font-[900] text-[#0F172A] mb-2 tracking-tight">The Founders</h3>
                                <div className="w-12 h-1 bg-blue-500 rounded-full mb-6" />
                                <p className="text-gray-500 font-[600] text-sm uppercase tracking-widest leading-loose">
                                    Operations • Finance • HR <br /> Training & Development
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. Our Journey - Light Premium Theme */}
                <section className="bg-white rounded-[48px] p-10 md:p-24 relative overflow-hidden shadow-2xl shadow-blue-900/5 border border-gray-100">
                    {/* Background */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-50 to-transparent rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-70" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-50 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4 opacity-60" />

                    <div className="relative z-10 max-w-4xl mx-auto text-center">
                        <h2 className="text-[40px] md:text-[60px] font-[900] mb-12 tracking-tight text-[#0F172A] leading-tight">
                            The Margdarshak Story
                        </h2>

                        <div className="space-y-10 text-xl md:text-[22px] text-[#475569] leading-relaxed font-medium">
                            <p>
                                It started with a simple observation: Students work hard for degrees, but often graduate feeling lost. <span className="text-[#0F172A] font-bold">"What next? Am I ready?"</span>
                            </p>
                            <p>
                                This uncertainty is amplified in Tier 2 & 3 cities. We wanted to change that.
                            </p>
                            <p>
                                What began as mentoring a few students has grown into a movement to make learning <span className="text-blue-600 font-bold">simple</span>, guidance <span className="text-blue-600 font-bold">honest</span>, and skills <span className="text-blue-600 font-bold">accessible</span>.
                            </p>
                        </div>

                        <div className="mt-20">
                            <h3 className="text-[28px] md:text-[40px] font-[900] text-[#0F172A] tracking-tight">
                                "When guidance is honest,<br className="hidden md:block" /> futures become stronger."
                            </h3>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
