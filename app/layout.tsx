import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Arpita Panda | AI Solutions, Business Analysis & Product',
  description:
    'AI Solutions Analyst turning ambiguous business problems into practical AI solutions — problem framing, solution design, prototyping and evaluation.',
  openGraph: {
    title: 'Arpita Panda | AI Solutions, Business Analysis & Product',
    description:
      'Turning business problems into practical AI solutions. Independent projects in AI operations, product design and evaluation.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-paper font-sans text-ink antialiased">
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  )
}
