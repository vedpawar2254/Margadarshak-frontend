import Image from "next/image";

// Enhanced SEO Metadata
export const metadata = {
  title: "Margdarshak - Empowering Students in Tier 2 & 3 Cities | Career Mentorship & Courses",
  description: "Margdarshak empowers students from Tier 2 and Tier 3 cities to achieve their dreams with quality education, expert mentorship, and career guidance. Join our community today.",
  keywords: ["Margdarshak", "Career Mentorship", "Online Courses", "Tier 2 Cities Education", "Tier 3 Cities Education", "Student Guidance", "Career Counseling", "Skill Development", "Margdarshak Education"],
  authors: [{ name: "Margdarshak Team" }],
  creator: "Margdarshak",
  publisher: "Margdarshak",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://www.margdarshak.com/",
  },
  openGraph: {
    title: "Margdarshak - Empowering Students to Achieve Their Dreams",
    description: "Quality education and expert mentorship for students in Tier 2 & 3 cities. Transform your career journey with Margdarshak.",
    url: "https://www.margdarshak.com/",
    siteName: "Margdarshak",
    images: [
      {
        url: "https://www.margdarshak.com/og-image.jpg", // Ensure this image exists or use a valid placeholder
        width: 1200,
        height: 630,
        alt: "Margdarshak - Empowering Students",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Margdarshak - Career Mentorship & Education",
    description: "Empowering students in Tier 2 & 3 cities with quality education and expert guidance.",
    creator: "@margdarshak", // Placeholder handler
    images: ["https://www.margdarshak.com/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "Margdarshak",
  "url": "https://www.margdarshak.com",
  "logo": "https://www.margdarshak.com/logo.png",
  "sameAs": [
    "https://www.facebook.com/margdarshak",
    "https://twitter.com/margdarshak",
    "https://www.instagram.com/margdarshak",
    "https://www.linkedin.com/company/margdarshak"
  ],
  "description": "Margdarshak empowers students from Tier 2 and Tier 3 cities to achieve their dreams with quality education and expert mentorship.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Education Street", // Placeholder
    "addressLocality": "Delhi NCR",
    "postalCode": "110001",
    "addressCountry": "IN"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-9876543210",
    "contactType": "customer service",
    "areaServed": "IN",
    "availableLanguage": ["en", "hi"]
  }
};

import dynamic from 'next/dynamic';
import HeroSection from "@/components/landing/HeroSection";
// Lazy load below-the-fold content
const MissionSection = dynamic(() => import("@/components/landing/MissionSection"), {
  loading: () => <div className="h-96 flex items-center justify-center text-gray-400">Loading Mission...</div>
});
const FeaturesSection = dynamic(() => import("@/components/landing/FeaturesSection"), {
  loading: () => <div className="h-96 flex items-center justify-center text-gray-400">Loading Features...</div>
});
const WhyChooseUsSection = dynamic(() => import("@/components/landing/WhyChooseUsSection"), {
  loading: () => <div className="h-96 flex items-center justify-center text-gray-400">Loading...</div>
});
const TestimonialsSection = dynamic(() => import("@/components/landing/TestimonialsSection"), {
  loading: () => <div className="h-96 flex items-center justify-center text-gray-400">Loading Testimonials...</div>
});
const CourseQuerySection = dynamic(() => import("@/components/landing/CourseQuerySection"), {
  loading: () => <div className="h-96 flex items-center justify-center text-gray-400">Loading Form...</div>
});
const SuccessStoriesSection = dynamic(() => import("@/components/landing/SuccessStoriesSection"), {
  loading: () => <div className="h-96 flex items-center justify-center text-gray-400">Loading Stories...</div>
});

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <MissionSection />
      <FeaturesSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <CourseQuerySection />
      <SuccessStoriesSection />
    </div>
  );
}
