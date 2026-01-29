"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CourseQuerySection = () => {
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        course: '',
        email: '',
        mobile: '',
        message: '' // New Message Field
    });
    const [status, setStatus] = useState('idle'); // idle, sending, success, error

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');

        try {
            const res = await fetch('/api/v1/contact/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setFormData({ name: '', location: '', course: '', email: '', mobile: '', message: '' });
                // Auto close success message after 3 seconds
                setTimeout(() => setStatus('idle'), 3000);
            } else {
                console.error("Submission failed:", data);
                setStatus('error');
                setTimeout(() => setStatus('idle'), 3000);
            }
        } catch (error) {
            console.error("Submission error:", error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <section className="py-20 bg-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-16 items-start">

                    {/* Left Side - Content */}
                    <div className="lg:w-1/3 pt-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
                            Can't Find Your Course?
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Tell us what you want to learn! Whether it's a specific coding language, a regional exam prep, or a vocational skill—Margdarshak is here to bring it to your city.
                        </p>
                    </div>

                    {/* Right Side - Form */}
                    <div className="lg:w-2/3 w-full">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div className="space-y-2">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        required
                                    />
                                </div>

                                {/* Location */}
                                <div className="space-y-2">
                                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                                    <select
                                        id="location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
                                        required
                                    >
                                        <option value="" disabled>Select</option>
                                        <option value="Delhi">Delhi</option>
                                        <option value="Mumbai">Mumbai</option>
                                        <option value="Bangalore">Bangalore</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            {/* Courses */}
                            <div className="space-y-2">
                                <label htmlFor="course" className="block text-sm font-medium text-gray-700">Courses</label>
                                <select
                                    id="course"
                                    name="course"
                                    value={formData.course}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
                                    required
                                >
                                    <option value="" disabled>Select</option>
                                    <option value="Web Development">Web Development</option>
                                    <option value="Data Science">Data Science</option>
                                    <option value="UPSC">UPSC</option>
                                    <option value="JEE/NEET">JEE/NEET</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Email */}
                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email id</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="John@gmail.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        required
                                    />
                                </div>

                                {/* Mobile */}
                                <div className="space-y-2">
                                    <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">Mobile Number</label>
                                    <input
                                        type="tel"
                                        id="mobile"
                                        name="mobile"
                                        placeholder="+91 0000000000"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Message Field (New) */}
                            <div className="space-y-2">
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message (Optional)</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    placeholder="Any specific requirements or questions..."
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={status === 'sending'}
                                className={`w-full bg-[#333333] hover:bg-black text-white font-bold py-3.5 rounded-lg transition-all duration-300 shadow-lg ${status === 'sending' ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {status === 'sending' ? 'Sending...' : 'Submit'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* SEND POPUP / MODAL */}
            <AnimatePresence>
                {status !== 'idle' && status !== 'sending' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none px-4"
                    >
                        {/* Backdrop */}
                        {/* Actually for a popup, we might not want a full backdrop blocking everything if it auto-closes, 
                            but user said "show send popup". Let's make it a nice centered Card. */}

                        <div className={`bg-white rounded-2xl shadow-2xl p-8 border ${status === 'success' ? 'border-green-100' : 'border-red-100'} max-w-sm w-full mx-auto text-center pointer-events-auto`}>
                            {status === 'success' ? (
                                <>
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-green-600">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Query Sent!</h3>
                                    <p className="text-gray-600">We have received your details. Our team will contact you shortly.</p>
                                </>
                            ) : (
                                <>
                                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-red-600">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h3>
                                    <p className="text-gray-600">Could not send your query. Please check your connection and try again.</p>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default CourseQuerySection;
