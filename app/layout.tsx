import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
  title: 'Arpita Panda | AI Solutions Analyst & Business Analyst',
  description:
    'Portfolio of Arpita Panda, an AI Solutions Analyst combining business analysis, requirements gathering and hands-on AI prototyping to solve real problems.',
  openGraph: {
    title: 'Arpita Panda | AI Solutions Analyst & Business Analyst',
    description:
      'Portfolio of Arpita Panda, an AI Solutions Analyst combining business analysis, requirements gathering and hands-on AI prototyping to solve real problems.',
    type: 'website',
  },
}

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Arpita Panda',
  jobTitle: 'AI Solutions Analyst',
  sameAs: [
    'https://www.linkedin.com/in/itsarpitapanda',
    'https://github.com/arpita-panda-ai',
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-paper font-sans text-ink antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <Navigation />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
