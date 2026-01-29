'use client';

import { useState, useEffect, useRef } from 'react';
import { api } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const HighlightsCarousel = dynamic(() => import('@/components/events/HighlightsCarousel'), {
    loading: () => <div className="h-64 flex items-center justify-center text-gray-400 font-jakarta">Loading Highlights...</div>
});
const WorkshopsCarousel = dynamic(() => import('@/components/events/WorkshopsCarousel'), {
    loading: () => <div className="h-64 flex items-center justify-center text-gray-400 font-jakarta">Loading Workshops...</div>
});

export default function EventsClient() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);
    const workshopsRef = useRef(null);
    const highlightsRef = useRef(null);

    // Donation state
    const { user, loading: authLoading } = useAuth();
    const [donations, setDonations] = useState([]);

    // Form state
    const [donationForm, setDonationForm] = useState({
        bookTitle: '',
        authorName: '',
        category: '',
        condition: '',
        copies: 1,
        phone: ''
    });
    const [donationLoading, setDonationLoading] = useState(false);
    const [donationSuccess, setDonationSuccess] = useState(false);

    useEffect(() => {
        fetchBooks();
        fetchDonations();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await api.get('/books');
            setBooks(response.data || []);
        } catch (err) {
            console.error('Failed to load books:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchDonations = async () => {
        try {
            const response = await api.get('/donations/published');
            setDonations(response.data || []);
        } catch (error) {
            console.error('Failed to fetch donations:', error);
        }
    };

    const handleDonationChange = (e) => {
        const { name, value } = e.target;
        setDonationForm(prev => ({ ...prev, [name]: value }));
    };

    const submitDonation = async (e) => {
        e.preventDefault();
        if (!user) return;

        setDonationLoading(true);
        try {
            const donorName = user?.name || '';
            const donorEmail = user?.email || '';

            await api.post('/donations', {
                ...donationForm,
                donorName,
                donorEmail
            });

            setDonationSuccess(true);
            setDonationForm({
                bookTitle: '',
                authorName: '',
                category: '',
                condition: '',
                copies: 1,
                phone: ''
            });

            fetchDonations();
            setTimeout(() => setDonationSuccess(false), 5000);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to submit donation');
        } finally {
            setDonationLoading(false);
        }
    };

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 320;
            if (direction === 'left') {
                scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    const scrollToSection = (ref) => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const BookCard = ({ book }) => {
        const categoryColors = {
            'finance': 'bg-[#1D4ED8]',
            'business': 'bg-[#0EA5E9]',
            'personal development': 'bg-[#4F46E5]',
            'economics': 'bg-[#0891B2]',
            'technology': 'bg-[#1e40af]'
        };
        const activeColor = categoryColors[book.category?.toLowerCase()] || 'bg-[#1e40af]';

        return (
            <div className="bg-white rounded-[20px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 w-[220px] flex-shrink-0 group">
                {/* Image Section - Compact Height */}
                <div className="h-[240px] bg-[#f8fafc] relative overflow-hidden">
                    {book.coverImage ? (
                        <Image
                            src={book.coverImage}
                            alt={book.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 220px"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-blue-50 to-indigo-100 font-jakarta">
                            📚
                        </div>
                    )}
                    {book.rating && (
                        <div className="absolute top-3 right-3 bg-[#1e40af]/90 text-white px-2.5 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 shadow-md backdrop-blur-md">
                            <span className="text-white text-[12px]">★</span>
                            <span>{book.rating}</span>
                        </div>
                    )}
                </div>

                {/* Content Section - Compact Padding */}
                <div className="p-4">
                    <div className="text-blue-600 text-[10px] font-black uppercase tracking-[0.15em] mb-2">
                        {book.category}
                    </div>
                    <h3 className="text-[#111827] font-[800] text-[15px] mb-1 line-clamp-2 h-10 leading-snug">
                        {book.title}
                    </h3>
                    <p className="text-gray-400 text-[12px] mb-4 truncate font-medium">
                        {book.authorName}
                    </p>
                    <div className={`inline-block px-4 py-2 ${activeColor} text-white rounded-lg text-[10px] font-black tracking-widest uppercase shadow-sm active:scale-95 transition-all w-full text-center`}>
                        View Details
                    </div>
                </div>
            </div>
        );
    };

    const categories = ['Finance', 'Business', 'Economics', 'Personal Development', 'Marketing', 'Technology', 'Other'];
    const conditions = ['New', 'Like New', 'Good', 'Fair'];

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center bg-white font-jakarta">
                <div className="w-10 h-10 border-[3px] border-gray-100 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="bg-[#FBFBFB] min-h-screen font-jakarta text-[#1F2937]">
            {/* 1. Hero Section */}
            <section className="pt-24 pb-28 px-4 text-center bg-white relative">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-[44px] md:text-[64px] font-[900] text-[#003B5C] mb-8 leading-[1.1] tracking-tight">
                        Events & Workshops at <br />
                        Margdarshak
                    </h1>
                    <p className="text-[#64748B] text-lg md:text-[21px] mb-12 max-w-3xl mx-auto leading-relaxed font-medium opacity-90">
                        Experience experiential learning through curated workshops, interactive events, and knowledge-sharing sessions. Grow your skills and connect with industry experts.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-5 justify-center">
                        <button
                            onClick={() => scrollToSection(workshopsRef)}
                            className="bg-[#003B5C] hover:bg-[#002a42] text-white font-[800] py-4.5 px-10 rounded-xl shadow-2xl transition-all flex items-center justify-center gap-2.5"
                        >
                            View Upcoming Workshops <span className="text-xl">▾</span>
                        </button>
                        <button
                            onClick={() => scrollToSection(highlightsRef)}
                            className="bg-white border-2 border-teal-500 text-teal-600 hover:bg-teal-50 font-[800] py-4.5 px-10 rounded-xl transition-all"
                        >
                            Explore Past Highlights
                        </button>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-32 pb-32">
                {/* 2. Upcoming Workshops Section */}
                <section ref={workshopsRef} className="scroll-mt-24">
                    <WorkshopsCarousel />
                </section>

                {/* 3. Past Highlights Section */}
                <section ref={highlightsRef} className="scroll-mt-24">
                    <HighlightsCarousel />
                </section>

                {/* 4. Recommended Books Section */}
                <section className="bg-white rounded-[40px] p-8 md:p-14 relative border border-gray-50 shadow-sm overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex flex-col gap-4 mb-14">
                            <div className="flex items-center gap-4">
                                <span className="text-4xl">📖</span>
                                <h2 className="text-[36px] md:text-[44px] font-[900] text-[#1E3A8A] tracking-tight">Recommended Books</h2>
                            </div>
                            <p className="text-[#64748B] text-lg md:text-[19px] max-w-2xl leading-relaxed font-medium">
                                Top book recommendations for career, business, and personal growth handpicked by our experts to succeed.
                            </p>
                        </div>

                        {/* Carousel */}
                        <div className="relative group/carousel">
                            <button
                                onClick={() => scroll('left')}
                                className="absolute -left-6 md:-left-8 top-[140px] w-14 h-14 bg-white rounded-full shadow-2xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-blue-600 z-10 transition-all hover:scale-110 opacity-0 group-hover/carousel:opacity-100 cursor-pointer"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                className="absolute -right-6 md:-right-8 top-[140px] w-14 h-14 bg-white rounded-full shadow-2xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-blue-600 z-10 transition-all hover:scale-110 opacity-0 group-hover/carousel:opacity-100 cursor-pointer"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                            </button>

                            <div
                                ref={scrollRef}
                                className="flex gap-8 overflow-x-auto pb-14 hide-scrollbar snap-x snap-mandatory scroll-smooth"
                            >
                                {books.map((book) => (
                                    <div key={book.id} className="snap-start pt-2">
                                        <BookCard book={book} />
                                    </div>
                                ))}
                                {books.length === 0 && (
                                    <div className="w-full h-[300px] flex items-center justify-center text-gray-400 font-medium">No books recommended yet.</div>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-gray-50 pt-8">
                                <div className="flex gap-3">
                                    {[...Array(Math.min(5, books.length))].map((_, i) => (
                                        <div key={i} className={`h-2.5 rounded-full transition-all duration-500 ${i === 0 ? 'w-10 bg-blue-600' : 'w-2.5 bg-blue-100'}`} />
                                    ))}
                                </div>
                                <button className="bg-[#1D4ED8] hover:bg-blue-800 text-white rounded-2xl px-10 py-4 font-[800] text-[15px] shadow-xl shadow-blue-900/10 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                    Download Recommended Books
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. Donate Books Section */}
                <section className="scroll-mt-24">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-4xl">🏢</span>
                        <h2 className="text-[36px] font-[900] text-[#1E3A8A] tracking-tight">Donate Books to Margdarshak</h2>
                    </div>
                    <p className="text-[#64748B] text-lg mb-16 max-w-2xl font-medium opacity-90 leading-relaxed">
                        Help build our library and support student learning. Donate books related to commerce, business, economics, and personal development.
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 xl:gap-20">
                        {/* LEFT: Info Column */}
                        <div className="space-y-8">
                            <div className="bg-[#ECFDF5] p-10 rounded-[32px] border border-green-100 group shadow-sm">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-sm border border-green-50 font-bold">📖</div>
                                <h3 className="text-xl font-[800] text-[#065F46] mb-3">Support Learning</h3>
                                <p className="text-[#065F46]/70 text-[15px] leading-relaxed font-medium">Your book donations directly help students access quality educational resources.</p>
                            </div>
                            <div className="bg-[#EFF6FF] p-10 rounded-[32px] border border-blue-100 group shadow-sm">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-sm border border-blue-50 font-bold">📍</div>
                                <h3 className="text-xl font-[800] text-[#1E40AF] mb-3">Easy Process</h3>
                                <p className="text-[#1E40AF]/70 text-[15px] leading-relaxed font-medium">Simple form submission and we'll handle the rest. Get recognition for your contribution.</p>
                            </div>

                            <div className="pt-4 px-2">
                                <h3 className="font-extrabold text-[#111827] mb-8 uppercase text-[12px] tracking-[0.2em] opacity-40">Why Choose Us?</h3>
                                <ul className="space-y-5">
                                    {['Support student learning', 'Reduce waste by reusing', 'Build community knowledge', 'Get donor recognition'].map((item) => (
                                        <li key={item} className="flex items-center gap-4 text-[#374151] font-[700] text-[15px]">
                                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                                <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* RIGHT: Form */}
                        <div className="bg-white rounded-[40px] border border-gray-100 p-8 md:p-12 shadow-2xl shadow-gray-200/40 relative">
                            {!user && !authLoading ? (
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-[4px] z-20 flex items-center justify-center p-12 text-center rounded-[40px]">
                                    <div className="max-w-md">
                                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl shadow-inner border border-blue-100">🔐</div>
                                        <h3 className="text-[26px] font-[900] text-blue-900 mb-4 tracking-tight">Login to Donate</h3>
                                        <p className="text-[#64748B] mb-10 font-medium text-lg opacity-90 leading-relaxed">Join our donor community to contribute. It only takes a second to sign in!</p>
                                        <Link href="/login?returnTo=/events">
                                            <button className="bg-blue-600 hover:bg-blue-700 text-white font-[800] py-5 px-14 rounded-2xl shadow-xl shadow-blue-600/30 transition-all hover:-translate-y-1 active:scale-95">
                                                Login Now
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            ) : null}

                            <form onSubmit={submitDonation} className="space-y-14">
                                <div className="space-y-10">
                                    <div>
                                        <h3 className="text-[22px] font-[900] text-[#111827] mb-2 tracking-tight">Book Details</h3>
                                        <p className="text-[#64748B] text-[15px] font-medium opacity-70">Tell us about the book you'd like to donate</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                                        <div className="space-y-3">
                                            <label className="text-sm font-[800] text-gray-800 ml-1">Book Title <span className="text-red-500">*</span></label>
                                            <input type="text" name="bookTitle" required value={donationForm.bookTitle} onChange={handleDonationChange} placeholder="e.g., The Intelligent Investor" className="w-full bg-[#F9FAFB] border-gray-100 rounded-[16px] py-4 px-5 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-400 font-bold border-2" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-sm font-[800] text-gray-800 ml-1">Author Name <span className="text-red-500">*</span></label>
                                            <input type="text" name="authorName" required value={donationForm.authorName} onChange={handleDonationChange} placeholder="e.g., Benjamin Graham" className="w-full bg-[#F9FAFB] border-gray-100 rounded-[16px] py-4 px-5 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-400 font-bold border-2" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-sm font-[800] text-gray-800 ml-1">Category <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <select name="category" required value={donationForm.category} onChange={handleDonationChange} className="w-full bg-[#F9FAFB] border-gray-100 rounded-[16px] py-4 pl-5 pr-12 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold border-2 appearance-none">
                                                    <option value="">Select a category</option>
                                                    {categories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                                                </select>
                                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-sm font-[800] text-gray-800 ml-1">Book Condition <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <select name="condition" required value={donationForm.condition} onChange={handleDonationChange} className="w-full bg-[#F9FAFB] border-gray-100 rounded-[16px] py-4 pl-5 pr-12 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold border-2 appearance-none">
                                                    <option value="">Select condition</option>
                                                    {conditions.map(cond => (<option key={cond} value={cond}>{cond}</option>))}
                                                </select>
                                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 space-y-3">
                                            <label className="text-sm font-[800] text-gray-800 ml-1">Number of Copies</label>
                                            <input type="number" name="copies" min="1" value={donationForm.copies} onChange={handleDonationChange} className="w-full bg-[#F9FAFB] border-gray-100 rounded-[16px] py-4 px-5 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold border-2" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-10 pt-10 border-t border-gray-50">
                                    <div>
                                        <h3 className="text-[22px] font-[900] text-[#111827] mb-2 tracking-tight">Your Information</h3>
                                        <p className="text-[#64748B] text-[15px] font-medium opacity-70">Tell us about you so we can contact you</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                                        <div className="space-y-3">
                                            <label className="text-sm font-[800] text-gray-800 ml-1">Full Name <span className="text-red-500">*</span></label>
                                            <input type="text" value={user?.name || ''} readOnly className="w-full bg-gray-50 border-gray-100 rounded-[16px] py-4 px-5 text-gray-500 font-bold border-2" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-sm font-[800] text-gray-800 ml-1">Email <span className="text-red-500">*</span></label>
                                            <input type="email" value={user?.email || ''} readOnly className="w-full bg-gray-50 border-gray-100 rounded-[16px] py-4 px-5 text-gray-500 font-bold border-2" />
                                        </div>
                                        <div className="md:col-span-2 space-y-3">
                                            <label className="text-sm font-[800] text-gray-800 ml-1">Phone Number <span className="text-red-500">*</span></label>
                                            <input type="tel" name="phone" required value={donationForm.phone} onChange={handleDonationChange} placeholder="+91 XXXX XXXX" className="w-full bg-[#F9FAFB] border-gray-100 rounded-[16px] py-4 px-5 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-400 font-bold border-2" />
                                        </div>
                                    </div>

                                    <div>
                                        {donationSuccess && (
                                            <div className="bg-green-50 border-2 border-green-100 rounded-2xl p-5 text-green-700 text-center font-black mb-10 transition-all">
                                                ✓ Thank you! Your donation request has been submitted.
                                            </div>
                                        )}
                                        <button disabled={donationLoading} type="submit" className="w-full py-5 bg-[#1E3A8A] hover:bg-[#1E40AF] text-white rounded-[20px] font-black text-lg shadow-2xl shadow-blue-900/30 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50">
                                            {donationLoading ? 'SUBMITTING...' : 'SUBMIT BOOK DONATION'}
                                        </button>
                                        <p className="text-center text-[#64748B] text-[13px] font-medium mt-6 opacity-70 italic">
                                            We'll review your submission and contact you within 2-3 business days.
                                        </p>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>

                {/* 6. Book a Trainer Banner */}
                <section className="bg-gradient-to-br from-[#1E3A8A] to-[#1E40AF] rounded-[48px] overflow-hidden shadow-2xl shadow-blue-900/10">
                    <div className="flex flex-col md:flex-row items-center justify-between p-12 md:p-20 gap-10">
                        <div className="flex-1 space-y-6 text-center md:text-left">
                            <h2 className="text-[36px] md:text-[52px] font-[900] text-white leading-tight tracking-tight">
                                Book a Trainer for Corporate <br className="hidden lg:block" />& Company Workshops
                            </h2>
                            <p className="text-blue-100 text-lg md:text-xl font-medium opacity-80 max-w-2xl">
                                Our team will connect with you to understand your requirements and propose a suitable trainer.
                            </p>
                        </div>
                        <a href="https://docs.google.com/forms/d/1AB6GVYvR3mlOLR_0uxaOkCKhnz2VBnCjdIU-VClZLQE/preview" target="_blank" rel="noopener noreferrer">
                            <button className="bg-white hover:bg-gray-100 text-[#1E3A8A] font-[900] py-5 px-12 rounded-2xl shadow-2xl text-[19px] transition-all hover:scale-105 active:scale-95 whitespace-nowrap">
                                Book a Trainer
                            </button>
                        </a>
                    </div>
                </section>

                {/* 7. Sports & Recreation */}
                <section className="scroll-mt-28">
                    <div className="flex flex-col gap-2 mb-10">
                        <h2 className="text-[32px] md:text-[40px] font-[900] text-gray-900 tracking-tight">Sports & Recreation</h2>
                        <p className="text-[#64748B] text-lg font-medium opacity-60 italic">Coming Soon - Explore athletic programs and tournaments</p>
                    </div>

                    <div className="bg-[#FFF5F5]/60 border-2 border-[#FFE4E4] border-dashed rounded-[40px] p-10 md:p-14 group relative overflow-hidden transition-all hover:bg-[#FFF5F5]">
                        <div className="absolute top-6 right-8 bg-white px-5 py-1.5 rounded-full text-[12px] font-black text-[#E11D48] uppercase tracking-[0.1em] border border-[#FECDD3] shadow-sm">Starting Soon</div>
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-10">
                            <div className="w-20 h-20 bg-white rounded-[24px] flex items-center justify-center text-5xl shadow-xl border border-red-50 group-hover:rotate-6 transition-transform">⚽</div>
                            <div className="flex-1 space-y-3">
                                <h3 className="text-[28px] font-[800] text-gray-900 tracking-tight">Sports Programs</h3>
                                <p className="text-[#64748B] text-lg leading-relaxed max-w-3xl font-medium opacity-80">Participate in various sports and recreational activities designed to promote health, teamwork, and relaxation.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 8. Quiz Competitions */}
                <section className="scroll-mt-28 pb-12">
                    <div className="flex flex-col gap-2 mb-10">
                        <h2 className="text-[32px] md:text-[40px] font-[900] text-gray-900 tracking-tight">Quiz Competitions</h2>
                        <p className="text-[#64748B] text-lg font-medium opacity-60 italic">Coming Soon - Test your knowledge and skills</p>
                    </div>

                    <div className="bg-[#eff6ff]/60 border-2 border-[#dbeafe] border-dashed rounded-[40px] p-10 md:p-14 group relative overflow-hidden transition-all hover:bg-[#eff6ff]">
                        <div className="absolute top-6 right-8 bg-white px-5 py-1.5 rounded-full text-[12px] font-black text-[#2563EB] uppercase tracking-[0.1em] border border-[#BFDBFE] shadow-sm">Launching Soon</div>
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-10">
                            <div className="w-20 h-20 bg-white rounded-[24px] flex items-center justify-center text-5xl shadow-xl border border-blue-50 group-hover:-rotate-6 transition-transform">🧠</div>
                            <div className="flex-1 space-y-3">
                                <h3 className="text-[28px] font-[800] text-gray-900 tracking-tight">Quiz Championship</h3>
                                <p className="text-[#64748B] text-lg leading-relaxed max-w-3xl font-medium opacity-80">Participate in exciting quiz competitions covering various subjects. Win prizes and showcase your knowledge!</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}
