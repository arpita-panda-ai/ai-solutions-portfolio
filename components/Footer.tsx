const CONTACT = {
  email: 'arpita.panda.work@gmail.com',
  linkedin: 'https://www.linkedin.com/in/itsarpitapanda',
  github: 'https://github.com/arpita-panda-ai',
}

export default function Footer() {
  return (
    <footer className="border-t border-offwhite-border bg-offwhite">
      <div className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-serif text-base font-semibold text-offwhite-ink">Arpita Panda</p>
            <p className="mt-1 text-sm text-offwhite-muted">
              AI Solutions · Business Analysis · Product Delivery
            </p>
          </div>

          <div className="flex gap-6 text-sm">
            <a
              href="/Arpita-Panda-CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-offwhite-muted hover:text-offwhite-ink"
            >
              CV
            </a>
            <a
              href={CONTACT.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-offwhite-muted hover:text-offwhite-ink"
            >
              LinkedIn
            </a>
            <a
              href={CONTACT.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-offwhite-muted hover:text-offwhite-ink"
            >
              GitHub
            </a>
            <a href={`mailto:${CONTACT.email}`} className="text-offwhite-muted hover:text-offwhite-ink">
              Email
            </a>
          </div>
        </div>

        <p className="mt-10 text-xs text-offwhite-muted">
          © 2026 Arpita Panda. Independent portfolio projects.
        </p>
      </div>
    </footer>
  )
}
