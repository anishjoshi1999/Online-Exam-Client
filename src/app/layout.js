import "./globals.css";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

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
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}
