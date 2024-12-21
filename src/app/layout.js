import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL('https://starttest.online'),
  title: 'StartTest.Online - AI-Powered Online Examination Platform',
  description: 'Create, conduct and evaluate secure online exams with AI proctoring and real-time analytics. Trusted by 500+ educational institutions.',
  keywords: 'online exam platform, AI proctoring, exam software, digital assessment',
  openGraph: {
    title: 'StartTest.Online - Transform Your Online Testing Process',
    description: 'AI-powered examination platform with real-time proctoring and analytics',
    images: [
      {
        // url: 'images/image-400.webp',
        width: 1200,
        height: 630,
        alt: 'StartTest.Online Platform Interface',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StartTest.Online - AI-Powered Examination Platform',
    description: 'Secure online testing platform with AI proctoring',
    // images: ['images/twitter.png'],
  },
  alternates: {
    canonical: 'https://starttest.online',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        {/* <Navbar/> */}
        {children}
      </body>
    </html>
  );
}
