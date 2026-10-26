'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const navItems = [
  { label: 'About', href: '/#about' },
  { label: 'Approach', href: '/#approach' },
  { label: 'Work', href: '/#work' },
  { label: 'Contact', href: '/#contact' },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-offwhite-border bg-offwhite/90 backdrop-blur">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="leading-tight">
            <span className="font-serif text-lg font-semibold tracking-tight text-offwhite-ink">
              ARPITA PANDA<span className="text-mint">.</span>
            </span>
            <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-widest text-offwhite-muted">
              AI Solutions · Business · Delivery
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={
                  item.label === 'Contact'
                    ? 'text-sm font-medium text-offwhite-ink underline decoration-mint decoration-2 underline-offset-4 hover:text-mint'
                    : 'text-sm font-medium text-offwhite-muted hover:text-offwhite-ink'
                }
              >
                {item.label}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-offwhite-ink md:hidden"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {isOpen && (
          <div id="mobile-menu" className="space-y-4 border-t border-offwhite-border pb-6 pt-4 md:hidden">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block text-sm font-medium text-offwhite-muted hover:text-offwhite-ink"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
