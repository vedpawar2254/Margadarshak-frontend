"use client";
import { useState } from 'react';
import ResumeBuilderSelection from './ResumeBuilderSelection';

const PlacementCareerSection = ({ onResumeClick }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        mobile: '',
        email: '',
        status: 'Student',
        reason: 'Career confusion',
        concern: ''
    });
    const [submitStatus, setSubmitStatus] = useState('idle'); // idle, submitting, success, error

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus('submitting');

        try {
            const response = await fetch('/api/v1/contact/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.fullName,
                    location: 'Placement Page',
                    course: 'Career Guidance',
                    email: formData.email,
                    mobile: formData.mobile,
                    message: `Status: ${formData.status}\nReason: ${formData.reason}\nConcern: ${formData.concern || 'N/A'}`
                })
            });

            if (response.ok) {
                setSubmitStatus('success');
                setFormData({ fullName: '', mobile: '', email: '', status: 'Student', reason: 'Career confusion', concern: '' });
                setTimeout(() => setSubmitStatus('idle'), 5000);
            } else {
                setSubmitStatus('error');
                setTimeout(() => setSubmitStatus('idle'), 3000);
            }
        } catch (error) {
            console.error('Form submission error:', error);
            setSubmitStatus('error');
            setTimeout(() => setSubmitStatus('idle'), 3000);
        }
    };

    return (
        <section className="py-20 bg-gray-50 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
                {/* SECTION 1: HEADER */}
                <div className="text-center max-w-3xl mx-auto">
                    <div className="inline-block bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 tracking-wide">
                        Your Career, Our Mission
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                        Placement <span className="text-[#0f52ba]">&</span> Career Success Hub
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        From crafting the perfect resume to acing your dream interview—we provide the tools, training, and mentorship to launch your career globally.
                    </p>
                </div>

                {/* SECTION 2: FEATURE CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Card 1: Career Guidance */}
                    <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                        <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-2xl">
                            👥
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Career guidance</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Connect with our vast network of hiring partners across multiple industries to find the perfect role for your skills.
                        </p>
                    </div>

                    {/* Card 2: Resume Builder */}
                    <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                        <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-2xl">
                            📄
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Resume builder</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Build industry-ready resumes with our ATS-friendly templates designed by HR experts to get you shortlisted.
                        </p>
                    </div>
                </div>

                {/* SECTION 3: ONE-TO-ONE GUIDANCE */}
                <div>
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            One-to-One <span className="text-[#0f52ba]">Career Guidance</span>
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Choosing the right career can feel confusing—but you don't have to figure it out alone. Gain clarity, confidence, and direction through our structured guidance process.
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-16">
                        {/* Left Column: Info Content */}
                        <div className="lg:w-1/2">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Beyond Degrees: Your Path to <span className="text-[#0f52ba]">Success</span>
                            </h3>
                            <p className="text-gray-600 mb-10 leading-relaxed">
                                The Margdarshak Career Guidance Cell offers personalized support to help students and young professionals understand their interests, strengths, and goals.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {[
                                    { icon: "👤", title: "1-on-1 Sessions", desc: "Personalized attention for your unique journey." },
                                    { icon: "💼", title: "Job Readiness", desc: "Prepare for the professional world with confidence." },
                                    { icon: "📊", title: "Skill Analysis", desc: "Identify and develop high-demand market skills." },
                                    { icon: "🧭", title: "Career Clarity", desc: "Navigate your next steps with a clear roadmap." }
                                ].map((item, idx) => (
                                    <div key={idx} className="bg-gray-50 rounded-xl p-6">
                                        <div className="text-blue-600 text-xl mb-3 bg-white w-10 h-10 rounded-lg flex items-center justify-center shadow-sm">
                                            {item.icon}
                                        </div>
                                        <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                                        <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Column: Inquiry Form */}
                        <div className="lg:w-1/2">
                            <div className="bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-gray-100 p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                                    Career Guidance Inquiry
                                </h3>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Full name</label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-gray-50 focus:bg-white text-gray-900"
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Mobile Number</label>
                                            <input
                                                type="tel"
                                                name="mobile"
                                                value={formData.mobile}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-gray-50 focus:bg-white text-gray-900"
                                                placeholder="+91 0000000000"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Email Id</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-gray-50 focus:bg-white text-gray-900"
                                            placeholder="john@gmail.com"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Current Status</label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-gray-50 focus:bg-white text-gray-900"
                                        >
                                            <option>Student</option>
                                            <option>Working Professional</option>
                                            <option>Career Switcher</option>
                                            <option>Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Reason for Career Guidance</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {['Career confusion', 'Skill guidance', 'Job readiness', 'Career change', 'Higher studies', 'Other'].map((option) => (
                                                <label key={option} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="reason"
                                                        value={option}
                                                        checked={formData.reason === option}
                                                        onChange={handleChange}
                                                        className="text-blue-600 focus:ring-blue-500 w-4 h-4 border-gray-300"
                                                    />
                                                    <span className="text-sm text-gray-600">{option}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Your Concern</label>
                                        <textarea
                                            name="concern"
                                            value={formData.concern}
                                            onChange={handleChange}
                                            rows="3"
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-gray-50 focus:bg-white resize-none text-gray-900"
                                            placeholder="Briefly tell us what guidance you are looking for..."
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitStatus === 'submitting'}
                                        className="w-full bg-[#0f52ba] hover:bg-[#0a4096] text-white font-bold py-3.5 rounded-lg transition-colors shadow-md hover:shadow-lg mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {submitStatus === 'submitting' ? 'Submitting...' : 'Submit Inquiry'}
                                    </button>

                                    {submitStatus === 'success' && (
                                        <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-4 py-3 mt-3 text-center">
                                            ✓ Inquiry submitted successfully. Our team will contact you within 24–48 working hours.
                                        </div>
                                    )}
                                    {submitStatus === 'error' && (
                                        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mt-3 text-center">
                                            ✗ Failed to submit. Please try again.
                                        </div>
                                    )}
                                    {submitStatus === 'idle' && (
                                        <p className="text-xs text-center text-gray-400 mt-2">
                                            Our team will contact you within 24–48 working hours.
                                        </p>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION 4: RESUME UPLOAD CTA */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-12 md:p-16 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#0f52ba] mb-6">
                        Take the First Step Toward the Right Career Path                    </h2>
                    <p className="text-gray-600 max-w-3xl mx-auto mb-10 text-lg leading-relaxed">
                        Share a few details about your background, skills, and job preferences. The Margdarshak team will review your information and guide you toward suitable opportunities based on your profile.                    </p>

                    <a href="https://docs.google.com/forms/d/1LgTpIsYUMyDsuqZ8YSWkoDCiNsLOdWYYOIUefZZLxWA/preview" target="_blank" rel="noopener noreferrer">
                        <button className="bg-[#0f52ba] hover:bg-[#0a4096] text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-2 text-lg group">
                            Upload Your Details
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                    </a>

                    <div className="flex flex-wrap items-center justify-center gap-8 mt-10">
                        <div className="flex items-center gap-2 text-gray-600">
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <span className="text-sm font-medium">100% Secure & Private</span>
                        </div>
                    </div>
                </div>

                {/* SECTION 5: RESUME BUILDER SELECTION */}
                <ResumeBuilderSelection />
            </div>
        </section>
    );
};

export default PlacementCareerSection;
