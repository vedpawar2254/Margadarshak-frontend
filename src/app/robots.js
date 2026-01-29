export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/profile/', '/dashboard/'],
        },
        sitemap: 'https://www.margdarshak.com/sitemap.xml',
    }
}
