import type { Metadata } from 'next'
import { Mail, Linkedin, Github } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact | Arpita Panda',
}

const CONTACT = {
  email: 'arpita.panda.work@gmail.com',
  linkedin: 'https://www.linkedin.com/in/itsarpitapanda',
  github: 'https://github.com/arpita-panda-ai',
}

const links = [
  { label: 'Email', value: CONTACT.email, href: `mailto:${CONTACT.email}`, icon: Mail },
  { label: 'LinkedIn', value: 'linkedin.com/in/itsarpitapanda', href: CONTACT.linkedin, icon: Linkedin },
  { label: 'GitHub', value: 'github.com/arpita-panda-ai', href: CONTACT.github, icon: Github },
]

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="text-3xl text-ink sm:text-4xl">Contact</h1>
      <p className="mt-4 max-w-xl text-ink-muted">
        The easiest way to reach me is email or LinkedIn. I'll respond as soon as I can.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {links.map(({ label, value, href, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="card flex flex-col gap-3 p-6 hover:border-accent"
          >
            <Icon size={20} className="text-accent" />
            <div>
              <p className="text-sm font-medium text-ink">{label}</p>
              <p className="mt-1 break-all text-xs text-ink-muted">{value}</p>
            </div>
          </a>
        ))}
      </div>
    </main>
  )
}
