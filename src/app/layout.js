import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata = {
  title: {
    default: "Margdarshak - Empowering Students to Achieve Their Dreams",
    template: "%s | Margdarshak"
  },
  description: "Margdarshak empowers students from Tier 2 and Tier 3 cities to become confident, skilled, and career-ready individuals by bridging the gap between education and employability through simplified, inclusive, and practical learning.",
  keywords: ["online education", "student mentorship", "career guidance", "affordable learning", "skill development", "education platform"],
  authors: [{ name: "Margdarshak", url: "https://www.margdarshak.com" }],
  creator: "Margdarshak",
  publisher: "Margdarshak",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.margdarshak.com",
    title: "Margdarshak - Empowering Students to Achieve Their Dreams",
    description: "Margdarshak empowers students from Tier 2 and Tier 3 cities to become confident, skilled, and career-ready individuals by bridging the gap between education and employability through simplified, inclusive, and practical learning.",
    siteName: "Margdarshak",
    images: [
      {
        url: "/og-image.jpg", // You can add an og image in public folder
        width: 1200,
        height: 630,
        alt: "Margdarshak - Empowering Students",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Margdarshak - Empowering Students to Achieve Their Dreams",
    description: "Empowering students from Tier 2 and Tier 3 cities with quality education and mentorship.",
    images: ["/twitter-image.jpg"], // You can add a twitter image in public folder
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://www.margdarshak.com",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

import LayoutWrapper from "@/components/layout/LayoutWrapper";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${plusJakarta.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {process.env.NEXT_PUBLIC_GA_ID ? <GoogleAnalytics GA_ID={process.env.NEXT_PUBLIC_GA_ID} /> : null}
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
