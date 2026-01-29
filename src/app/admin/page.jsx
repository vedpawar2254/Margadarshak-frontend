'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/services/api';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCourses: 0,
        totalBlogs: 0,
        totalEvents: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Fetch system stats
            const response = await api.get('/admin/users/stats');
            if (response.data) {
                setStats(response.data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const dashboardCards = [
        {
            title: 'Users',
            icon: '👥',
            iconBg: '#dbeafe',
            iconColor: '#3b82f6',
            description: 'View all users, block/remove users, verify mentors',
            href: '/admin/users'
        },
        {
            title: 'Courses',
            icon: '📚',
            iconBg: '#fce7f3',
            iconColor: '#ec4899',
            description: 'Upload videos, PDFs, create quizzes, edit/delete courses',
            href: '/admin/courses',
            count: stats.totalCourses
        },
        {
            title: 'Blogs',
            icon: '📝',
            iconBg: '#d1fae5',
            iconColor: '#10b981',
            description: 'Write, publish, edit, and delete blogs',
            href: '/admin/blogs'
        },
        {
            title: 'Books',
            icon: '📖',
            iconBg: '#fef3c7',
            iconColor: '#f59e0b',
            description: 'View all book uploads, delete books',
            href: '/admin/books'
        },
        {
            title: 'Mentors',
            icon: '👨‍🏫',
            iconBg: '#dbeafe',
            iconColor: '#3b82f6',
            description: 'Manage mentor profiles',
            href: '/admin/mentors'
        },
        {
            title: 'Placement',
            icon: '💼',
            iconBg: '#fce7f3',
            iconColor: '#ec4899',
            description: 'Manage partner companies',
            href: '/admin/placement'
        },
        {
            title: 'Events',
            icon: '📅',
            iconBg: '#fee2e2',
            iconColor: '#ef4444',
            description: 'Add events, upload photos, mark as completed',
            href: '/admin/events'
        },
        {
            title: 'Donations',
            icon: '🎁',
            iconBg: '#dbeafe',
            iconColor: '#3b82f6',
            description: 'Manage book donations',
            href: '/admin/donations'
        },
        {
            title: 'Well Being',
            icon: '💚',
            iconBg: '#d1fae5',
            iconColor: '#10b981',
            description: 'Add remedies',
            href: '/admin/wellbeing'
        }
    ];

    return (
        <div>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    color: '#1f2937',
                    marginBottom: '8px'
                }}>
                    Admin Dashboard
                </h1>
                <p style={{ color: '#6b7280', fontSize: '16px' }}>
                    Manage all aspects of the Margdarshak platform. Access user management, course creation, content publishing, and analytics.
                </p>
            </div>

            {/* Stats Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginBottom: '40px'
            }}>
                <StatCard title="Total Users" value={loading ? '-' : stats.totalUsers} icon="👥" />
                <StatCard title="Total Courses" value={loading ? '-' : stats.totalCourses} icon="📚" />
                <StatCard title="Total Blogs" value={loading ? '-' : stats.totalBlogs} icon="📝" />
                <StatCard title="Total Events" value={loading ? '-' : stats.totalEvents} icon="📅" />
            </div>

            {/* Management Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px'
            }}>
                {dashboardCards.map((card) => (
                    <DashboardCard key={card.title} {...card} />
                ))}
            </div>
        </div>
    );
}

function StatCard({ title, value, icon }) {
    return (
        <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <div>
                <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>{title}</p>
                <p style={{ fontSize: '28px', fontWeight: '700', color: '#1f2937' }}>{value}</p>
            </div>
            <span style={{ fontSize: '32px' }}>{icon}</span>
        </div>
    );
}

function DashboardCard({ title, icon, iconBg, iconColor, description, href, count }) {
    return (
        <Link href={href} style={{ textDecoration: 'none' }}>
            <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}
                onMouseOver={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <span style={{
                        width: '40px',
                        height: '40px',
                        background: iconBg,
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px'
                    }}>
                        {icon}
                    </span>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>{title}</h3>
                    {count !== undefined && (
                        <span style={{
                            marginLeft: 'auto',
                            background: '#dbeafe',
                            color: '#3b82f6',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '14px',
                            fontWeight: '600'
                        }}>
                            {count}
                        </span>
                    )}
                </div>
                <p style={{ color: '#6b7280', fontSize: '14px', flex: 1, marginBottom: '16px' }}>
                    {description}
                </p>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: '#3b82f6',
                    fontWeight: '500',
                    fontSize: '14px'
                }}>
                    Manage <span>→</span>
                </div>
            </div>
        </Link>
    );
}
