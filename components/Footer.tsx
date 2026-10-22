import Link from 'next/link'

const CONTACT = {
  email: 'arpita.panda.work@gmail.com',
  linkedin: 'https://www.linkedin.com/in/itsarpitapanda',
  github: 'https://github.com/alllthatmattersbiz-sys',
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-serif text-base font-semibold text-ink">Arpita Panda</p>
            <p className="mt-1 text-sm text-ink-muted">
              AI solutions, business analysis and product delivery.
            </p>
          </div>

          <div className="flex gap-6 text-sm">
            <Link href="/projects" className="text-ink-muted hover:text-ink">
              Projects
            </Link>
            <Link href="/about" className="text-ink-muted hover:text-ink">
              About
            </Link>
            <a href={`mailto:${CONTACT.email}`} className="text-ink-muted hover:text-ink">
              Email
            </a>
            <a
              href={CONTACT.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-muted hover:text-ink"
            >
              LinkedIn
            </a>
            <a
              href={CONTACT.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-muted hover:text-ink"
            >
              GitHub
            </a>
          </div>
        </div>

        <p className="mt-10 text-xs text-ink-muted">© {year} Arpita Panda.</p>
      </div>
    </footer>
  )
}
