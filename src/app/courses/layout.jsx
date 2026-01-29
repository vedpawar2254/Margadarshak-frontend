export const metadata = {
    title: 'Explore Courses | Margdarshak',
    description: 'Browse our extensive collection of courses designed to specific career paths. From technology to business, find the perfect course to elevate your skills.',
    keywords: 'online courses, career development, skill learning, margdarshak courses, tech education',
    openGraph: {
        title: 'Explore Courses | Margdarshak',
        description: 'Browse our extensive collection of courses designed to specific career paths. From technology to business, find the perfect course to elevate your skills.',
        type: 'website',
        url: 'https://margdarshak.com/courses',
        siteName: 'Margdarshak',
        locale: 'en_US',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Explore Courses | Margdarshak',
        description: 'Browse our extensive collection of courses designed to specific career paths.',
    }
};

export default function CoursesLayout({ children }) {
    return (
        <>
            {children}
        </>
    );
}
