'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const navItems = [
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-paper/90 backdrop-blur">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="font-serif text-lg font-semibold text-ink">
            Arpita Panda
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-ink-muted hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/contact" className="btn-primary text-sm">
              Get in touch
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-ink md:hidden"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {isOpen && (
          <div className="space-y-4 border-t border-border pb-6 pt-4 md:hidden">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block text-sm font-medium text-ink-muted hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="btn-primary w-full justify-center text-sm"
            >
              Get in touch
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
