'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/services/api';

export default function BlogsClient() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);
    const observerRef = useRef(null);
    const limit = 9;

    const fetchBlogs = useCallback(async (pageNum, query, append = false) => {
        try {
            if (pageNum === 1) setLoading(true);
            else setLoadingMore(true);

            const endpoint = query.trim()
                ? `/blogs/search?q=${encodeURIComponent(query)}&page=${pageNum}&limit=${limit}`
                : `/blogs?page=${pageNum}&limit=${limit}`;

            const response = await api.get(endpoint);

            if (response.success) {
                const newBlogs = response.data || [];
                setBlogs(prev => append ? [...prev, ...newBlogs] : newBlogs);
                setHasMore(response.pagination?.hasMore ?? newBlogs.length === limit);
            }
        } catch (err) {
            console.error('Error fetching blogs:', err);
            setError(err.message);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);

    useEffect(() => {
        fetchBlogs(1, '');
    }, [fetchBlogs]);

    const handleSearch = () => {
        setSearchQuery(searchInput);
        setPage(1);
        fetchBlogs(1, searchInput, false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
                    const nextPage = page + 1;
                    setPage(nextPage);
                    fetchBlogs(nextPage, searchQuery, true);
                }
            },
            { threshold: 0.1 }
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => observer.disconnect();
    }, [hasMore, loadingMore, loading, page, searchQuery, fetchBlogs]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Category colors for badges (Tailwind classes)
    const getCategoryStyles = (index) => {
        const styles = [
            'bg-blue-100 text-blue-700',
            'bg-pink-100 text-pink-700',
            'bg-green-100 text-green-700',
            'bg-amber-100 text-amber-700',
            'bg-indigo-100 text-indigo-700'
        ];
        return styles[index % styles.length];
    };

    const BlogSkeleton = () => (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <div className="h-48 bg-gray-200 animate-pulse" />
            <div className="p-6 space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
                <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Hero Header */}
            <div className="relative w-full h-[500px] flex flex-col items-center justify-center text-center px-4">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/image.png"
                        alt="Blogs Hero"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 max-w-4xl mx-auto space-y-6">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-sm">
                        Blogs <span className="text-[#3b82f6]">&</span> Insights
                    </h1>
                    <h2 className="text-2xl md:text-3xl font-bold text-white/95 max-w-2xl mx-auto leading-snug drop-shadow-sm">
                        Career, Skills & Mindset — All in One Place
                    </h2>
                    <p className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-sm">
                        This page brings together practical guidance, industry insights, and mindset support to help students and early professionals grow with clarity and confidence.
                    </p>

                    {/* Search Bar */}
                    <div className="mt-8 max-w-2xl mx-auto w-full">
                        <div className="relative flex items-center bg-white rounded-full p-2 shadow-xl transform transition-transform focus-within:scale-105">
                            <div className="pl-6 text-gray-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="What do you want to learn?"
                                className="flex-1 px-4 py-3 bg-transparent text-gray-800 placeholder-gray-400 text-lg focus:outline-none"
                            />
                            <button
                                onClick={handleSearch}
                                className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white px-8 py-3 rounded-full font-bold text-lg transition-colors shadow-md"
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Blog Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-10 relative z-20">
                {error && (
                    <div className="text-center p-8 bg-red-50 rounded-xl text-red-600 mb-8 border border-red-100">
                        ⚠️ {error}
                    </div>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => <BlogSkeleton key={i} />)}
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="text-6xl mb-4">📝</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            {searchQuery ? 'No blogs found' : 'No blogs yet'}
                        </h2>
                        <p className="text-gray-500">
                            {searchQuery ? 'Try a different search term' : 'Check back later for new content'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {blogs.map((blog, index) => (
                                <Link
                                    key={blog.id}
                                    href={`/blogs/${blog.slug || blog.id}`}
                                    className="group"
                                >
                                    <article className="h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group-hover:-translate-y-1">
                                        {/* Cover Image */}
                                        <div className="relative h-56 overflow-hidden">
                                            {blog.coverImage ? (
                                                <Image
                                                    src={blog.coverImage}
                                                    alt={blog.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-tr from-blue-500 to-purple-600" />
                                            )}

                                            {/* Featured Badge */}
                                            {index === 0 && (
                                                <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                                                    Featured
                                                </span>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 flex flex-col flex-1">
                                            {/* Category Badge */}
                                            <div className="mb-4">
                                                <span className="inline-block px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide bg-emerald-100 text-emerald-700">
                                                    {blog.category || 'Insights'}
                                                </span>
                                            </div>

                                            <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                                                {blog.title}
                                            </h2>

                                            <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                                                {blog.shortDescription || blog.content?.substring(0, 150) + '...'}
                                            </p>

                                            {/* Author & Meta */}
                                            <div className="mt-auto pt-4 border-t border-gray-50 flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-sm overflow-hidden relative border border-gray-200">
                                                    {blog.authorImage ? (
                                                        <Image src={blog.authorImage} alt={blog.author} fill className="object-cover" />
                                                    ) : (
                                                        <span>{(blog.author && blog.author.length < 20) ? blog.author.charAt(0).toUpperCase() : 'M'}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">
                                                        {(blog.author && blog.author.length < 25) ? blog.author : 'Margdarshak Team'}
                                                    </p>
                                                    <p className="text-xs text-gray-500 font-medium">
                                                        {formatDate(blog.publishedAt || blog.createdAt)}
                                                        {blog.readingTime && ` · ${blog.readingTime} min read`}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>

                        <div ref={observerRef} className="h-10 mt-10" />

                        {loadingMore && (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-600" />
                            </div>
                        )}

                        {!hasMore && blogs.length > 0 && (
                            <p className="text-center text-gray-400 py-10 text-sm font-medium">
                                You've reached the end 🎉
                            </p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
