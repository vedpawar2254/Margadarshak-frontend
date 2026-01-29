'use client';

// Helper to render icons based on string name
const getIconElement = (iconName) => {
    switch (iconName) {
        case 'brain': return <span className="text-2xl">🧠</span>;
        case 'leaf': return <span className="text-2xl">🍃</span>;
        case 'meditation': return <span className="text-2xl">🧘</span>;
        case 'heart': return <span className="text-2xl">❤️</span>;
        default: return <span className="text-2xl">📌</span>;
    }
};

export default function ResourcesSection({ topics, expandedId, toggleTopic }) {
    return (
        <section className="py-24 px-4 bg-white relative">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-14">
                    <span className="inline-block bg-[#EFF6FF] text-[#3B82F6] text-[13px] font-[700] px-4 py-1.5 rounded-full uppercase tracking-wider mb-5 hover:bg-blue-100 transition-colors cursor-default">
                        Resources
                    </span>
                    <h2 className="text-[32px] md:text-[40px] font-[800] text-[#111827] mb-3">Wellness Dimensions</h2>
                    <p className="text-[#6B7280] text-lg">Explore comprehensive resources across multiple dimensions of your well-being</p>
                </div>

                <div className="max-h-[720px] overflow-y-auto pr-2 custom-scrollbar">
                    <div className="flex flex-col gap-5 pb-4">
                        {topics.map((topic) => {
                            const isExpanded = expandedId === topic.id;
                            return (
                                <div
                                    key={topic.id}
                                    className={`bg-white rounded-[20px] transition-all duration-300 overflow-hidden
                                        ${isExpanded ? 'border-2 border-[#3B82F6] shadow-xl ring-4 ring-blue-50/50 scale-[1.01]' : 'border border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md'}
                                    `}
                                >
                                    <button
                                        onClick={() => toggleTopic(topic.id)}
                                        className="w-full text-left p-6 md:p-7 flex items-start md:items-center gap-6 focus:outline-none group"
                                    >
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl transition-all duration-300 ${isExpanded ? 'bg-[#EFF6FF] text-[#2563EB] scale-110' : 'bg-gray-50 text-gray-500 group-hover:bg-gray-100 group-hover:text-gray-700'}`}>
                                            {getIconElement(topic.icon)}
                                        </div>
                                        <div className="flex-grow pt-1 md:pt-0">
                                            <h3 className={`text-[19px] font-[700] mb-1 transition-colors ${isExpanded ? 'text-[#1F2937]' : 'text-[#374151]'}`}>{topic.title}</h3>
                                            <p className="text-[#6B7280] text-[15px] font-normal md:block hidden leading-relaxed">{topic.shortDescription}</p>
                                        </div>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isExpanded ? 'bg-blue-100 text-blue-600 rotate-180' : 'bg-transparent text-gray-400 group-hover:bg-gray-50'}`}>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </button>

                                    {/* Expanded Content */}
                                    <div className={`transition-[max-height,opacity] duration-500 ease-in-out px-6 md:px-7 ${isExpanded ? 'max-h-[2000px] opacity-100 pb-8' : 'max-h-0 opacity-0 pb-0 overflow-hidden'}`}>
                                        <div className="border-t border-gray-100 pt-8 mt-2 animate-fade-in">
                                            {topic.subtopics && topic.subtopics.map((subtopic, sIdx) => (
                                                <div key={subtopic.id} className="mb-8 last:mb-0 pl-2">
                                                    <h4 className="flex items-center gap-3 text-[16px] font-[700] text-[#111827] mb-4">
                                                        <span className="w-2 h-2 rounded-full bg-[#3B82F6]"></span>
                                                        {subtopic.title}
                                                    </h4>
                                                    <ul className="space-y-3 pl-5 border-l-[2px] border-[#F3F4F6] ml-[3px]">
                                                        {topic.subtopics[sIdx].points && topic.subtopics[sIdx].points.map((point) => (
                                                            <li key={point.id} className="text-[#4B5563] text-[15px] leading-relaxed pl-4 relative before:absolute before:left-[-21px] before:top-[10px] before:w-[5px] before:h-[1px] before:bg-gray-300 hover:text-gray-900 transition-colors">
                                                                {point.text}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <style jsx>{`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 6px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: #f1f1f1;
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #d1d5db;
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #9ca3af;
                    }
                `}</style>
            </div>
        </section>
    );
}
