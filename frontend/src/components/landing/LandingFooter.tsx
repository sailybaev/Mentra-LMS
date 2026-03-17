import Link from 'next/link'

const links = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
  ],
  Platform: [
    { label: 'For Faculty', href: '/register' },
    { label: 'For Students', href: '/register' },
    { label: 'For Admins', href: '/register' },
  ],
  Company: [
    { label: 'Sign in', href: '/login' },
    { label: 'Register', href: '/register' },
  ],
}

export function LandingFooter() {
  return (
    <footer className="border-t border-zinc-100 bg-white px-6 pt-16 pb-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 text-white text-xs font-bold">M</div>
              <span className="font-semibold text-zinc-900">Mentra</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-[160px]">
              The AI-powered LMS for modern institutions.
            </p>
          </div>
          {/* Links */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-300">{group}</p>
              <ul className="space-y-2.5">
                {items.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-zinc-100 pt-6">
          <p className="text-xs text-zinc-400">© {new Date().getFullYear()} Mentra. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
