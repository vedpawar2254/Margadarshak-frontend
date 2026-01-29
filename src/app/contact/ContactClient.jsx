'use client';

import { useState } from 'react';
import { api } from '@/services/api';
import Button from '@/components/ui/Button';

export default function ContactClient() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        inquiryType: 'Courses',
        message: ''
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const INQUIRY_OPTIONS = [
        'Courses',
        'Books / Study Material',
        'Workshops / Training Programs',
        'Career Guidance',
        'Internship / Placement Support',
        'Other'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleInquirySelect = (option) => {
        setFormData(prev => ({
            ...prev,
            inquiryType: option
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const response = await api.post('/contact/query', formData);

            if (response.success) {
                setSuccess(true);
                setFormData({
                    name: '',
                    email: '',
                    mobile: '',
                    inquiryType: 'Courses',
                    message: ''
                });
            } else {
                setError(response.message || 'Something went wrong. Please try again.');
            }
        } catch (err) {
            setError(err.message || 'Failed to send message. Please checking your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
                <div className="bg-white rounded-[32px] shadow-xl overflow-hidden border border-gray-100 p-8 md:p-12">

                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-extrabold text-[#004880] mb-4">Margdarshak – Inquiry Form</h1>
                        <p className="text-lg text-gray-600">We'd love to hear from you. Please fill out the form below.</p>
                    </div>

                    {success ? (
                        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center animate-fade-in">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                                ✓
                            </div>
                            <h2 className="text-2xl font-bold text-green-800 mb-2">Thank You!</h2>
                            <p className="text-green-700 mb-6">
                                Your message has been sent successfully. Check your email for a confirmation.
                            </p>
                            <Button onClick={() => setSuccess(false)} className="bg-green-600 text-white hover:bg-green-700">
                                Send Another Message
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* 1. Name */}
                            <div className="space-y-2">
                                <label className="block text-gray-700 font-bold text-lg" htmlFor="name">
                                    1️⃣ Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-800 placeholder-gray-400"
                                    placeholder="Enter your full name"
                                />
                            </div>

                            {/* 2. Email */}
                            <div className="space-y-2">
                                <label className="block text-gray-700 font-bold text-lg" htmlFor="email">
                                    2️⃣ Email ID
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-800 placeholder-gray-400"
                                    placeholder="Enter your email address"
                                />
                            </div>

                            {/* 3. Mobile */}
                            <div className="space-y-2">
                                <label className="block text-gray-700 font-bold text-lg" htmlFor="mobile">
                                    3️⃣ Mobile Number
                                </label>
                                <input
                                    type="tel"
                                    id="mobile"
                                    name="mobile"
                                    required
                                    pattern="[0-9]{10}"
                                    title="Please enter a valid 10-digit mobile number"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-800 placeholder-gray-400"
                                    placeholder="Enter your mobile number"
                                />
                            </div>

                            {/* 4. Inquiry Type */}
                            <div className="space-y-4">
                                <label className="block text-gray-700 font-bold text-lg">
                                    4️⃣ You are inquiring about
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {INQUIRY_OPTIONS.map((option) => (
                                        <button
                                            type="button"
                                            key={option}
                                            onClick={() => handleInquirySelect(option)}
                                            className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all text-left flex items-center justify-between
                        ${formData.inquiryType === option
                                                    ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm ring-1 ring-blue-500'
                                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                                                }`}
                                        >
                                            {option}
                                            {formData.inquiryType === option && <span className="text-blue-500">✓</span>}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 5. Message */}
                            <div className="space-y-2">
                                <label className="block text-gray-700 font-bold text-lg" htmlFor="message">
                                    5️⃣ Your Question / Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows="4"
                                    maxLength="500" // Approx 100-150 words
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-800 placeholder-gray-400 resize-none"
                                    placeholder="Please describe your requirement so we can guide you better..."
                                />
                                <div className="text-right text-xs text-gray-400">
                                    Max 500 characters
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
                                    {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#004880] hover:bg-[#003660] text-white font-bold text-xl py-4 rounded-xl shadow-lg transition-transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending...
                                        </span>
                                    ) : (
                                        "Submit Inquiry"
                                    )}
                                </Button>
                            </div>

                        </form>
                    )}

                </div>
            </main>

        </div>
    );
}
