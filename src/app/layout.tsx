import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'File Tree Generator - Transform Ideas into Projects',
  description: 'Transform your file structures into complete projects with intelligent content generation. Perfect for developers using AI code generation.',
  keywords: ['file generator', 'project setup', 'developer tools', 'nextjs', 'react'],
  authors: [{ name: 'File Tree Generator' }],
  creator: 'File Tree Generator',
  publisher: 'File Tree Generator',
  openGraph: {
    title: 'File Tree Generator',
    description: 'Transform file structures into complete projects with generated content',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'File Tree Generator',
    description: 'Transform file structures into complete projects with generated content',
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
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased bg-gray-50 min-h-screen`}>
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t bg-white py-8 mt-16">
            <div className="max-w-6xl mx-auto px-6 text-center text-gray-600">
              <p>&copy; 2025 File Tree Generator. Built with Next.js and deployed on Vercel.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
