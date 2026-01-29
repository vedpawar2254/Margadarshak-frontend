import Link from 'next/link';

const ResumeBuilderSelection = () => {
    return (
        <div className="py-16 w-full">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Professional <span className="text-[#0f52ba]">Resume Builder</span>
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                    Whether you're a fresher or an experienced pro, we'll help you craft a standout resume.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* Student / Fresher Card */}
                <div className="bg-[#e0f2fe] rounded-3xl p-8 border border-blue-100 hover:shadow-xl transition-all duration-300 group">
                    <div className="w-16 h-16 bg-[#d1fae5] rounded-full flex items-center justify-center mb-6 text-3xl shadow-sm group-hover:scale-110 transition-transform">
                        🎓
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Student / Fresher</h3>
                    <ul className="space-y-3 mb-8 text-gray-700">
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                            Academic-focused layout
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                            Highlights Projects & Skills
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                            Objective-driven introduction
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                            Certifications section
                        </li>
                    </ul>
                    <Link
                        href="/placement/resume-builder/beginner"
                        className="inline-flex items-center text-[#0f52ba] font-bold hover:text-[#0a4096] transition-colors gap-1 group/link"
                    >
                        Create Beginner Resume <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>

                {/* Working Professional Card */}
                <div className="bg-[#dbeafe] rounded-3xl p-8 border border-blue-200 hover:shadow-xl transition-all duration-300 group">
                    <div className="w-16 h-16 bg-[#e0e7ff] rounded-full flex items-center justify-center mb-6 text-3xl shadow-sm group-hover:scale-110 transition-transform">
                        💼
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Working Professional</h3>
                    <ul className="space-y-3 mb-8 text-gray-700">
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                            Experience-focused layout
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                            Highlights Role & Expertise
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                            Professional Summary
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                            Advanced certifications
                        </li>
                    </ul>
                    <Link
                        href="/placement/resume-builder/experienced"
                        className="inline-flex items-center text-[#0f52ba] font-bold hover:text-[#0a4096] transition-colors gap-1 group/link"
                    >
                        Create Pro Resume <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResumeBuilderSelection;
