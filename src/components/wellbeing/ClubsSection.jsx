'use client';

const clubs = [
    {
        title: '5 AM Club',
        icon: '🌅',
        desc: 'Build discipline, mental clarity, and strong morning routines with early risers.',
        tags: ['Daily Motivation', 'Habit Building', 'Community'],
        members: '2.4K members',
        type: 'COMMUNITY DRIVEN'
    },
    {
        title: 'Mindfulness Club',
        icon: '🧘',
        desc: 'Practice meditation, stress management, and mental clarity through guided sessions.',
        tags: ['Meditation', 'Mental Wellness', 'Calm Focus'],
        members: '1.8K members',
        type: 'PEER LED'
    },
    {
        title: 'Growth Club',
        icon: '🚀',
        desc: 'Stay inspired with peer support, growth challenges, and collective achievement.',
        tags: ['Motivation', 'Growth Mindset', 'Peer Support'],
        members: '3.1K members',
        type: 'COMMUNITY DRIVEN'
    }
];

export default function ClubsSection() {
    return (
        <section className="bg-[#eff6ff] py-24 px-4 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-[32px] md:text-[40px] font-[800] text-[#111827] mb-4 tracking-tight">Well Being Clubs</h2>
                    <p className="text-[#4B5563] max-w-2xl mx-auto text-lg font-medium leading-relaxed">
                        Join peer-driven communities built on mutual support, habit-building, and shared growth. Find your tribe and thrive together.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {clubs.map((club, idx) => (
                        <div key={idx} className="group bg-white rounded-[24px] p-8 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col h-full hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300">
                            <div className="text-[48px] mb-6 transform group-hover:scale-110 transition-transform duration-300">{club.icon}</div>
                            <h3 className="text-[22px] font-[700] text-[#111827] mb-3">{club.title}</h3>
                            <p className="text-[#6B7280] text-base mb-6 flex-grow leading-relaxed">
                                {club.desc}
                            </p>

                            <div className="flex flex-wrap gap-2.5 mb-8">
                                {club.tags.map((tag, tIdx) => (
                                    <span key={tIdx} className="bg-[#EFF6FF] text-[#2563EB] text-[11px] font-[700] px-3 py-1.5 rounded-md uppercase tracking-wide">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-auto pt-6 border-t border-gray-50">
                                <div className="flex items-center gap-3 mb-5 text-[13px] font-[600] text-[#9CA3AF] uppercase tracking-wider">
                                    <div className="flex items-center gap-1.5 text-[#6B7280]">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                        {club.members}
                                    </div>
                                    <span className="text-gray-200">|</span>
                                    <span className="text-[#9CA3AF]">{club.type}</span>
                                </div>
                                <button className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-[600] py-3.5 rounded-[12px] transition-all shadow-md shadow-blue-200 hover:shadow-blue-300 flex items-center justify-center gap-2 text-[15px] group-hover:bg-[#1e40af]">
                                    Join Now <span aria-hidden="true" className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
