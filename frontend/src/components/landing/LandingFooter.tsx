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
    <footer className="border-t border-[#E8E7E3] bg-white px-8 pt-16 pb-10">
      <div className="mx-auto max-w-[1120px]">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="h-7 w-7 rounded-[8px] bg-[#111110] flex items-center justify-center shrink-0">
                <span className="text-white text-[11px] font-bold tracking-tight">M</span>
              </div>
              <span className="text-[15px] font-semibold text-[#111110] tracking-[-0.02em]">Mentra</span>
            </div>
            <p className="text-[12px] text-[#9B9B97] leading-relaxed max-w-[160px]">
              The AI-powered LMS for modern institutions.
            </p>
          </div>

          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#C8C6C1]">{group}</p>
              <ul className="space-y-2.5">
                {items.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-[13px] text-[#6B6B67] hover:text-[#111110] transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E8E7E3] pt-6">
          <p className="text-[12px] text-[#9B9B97]">© {new Date().getFullYear()} Mentra. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
