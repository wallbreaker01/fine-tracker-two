'use client';

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { navItems } from '@/lib/constants'



const NavItems: React.FC = () => {
  const pathname = usePathname() || '/'

  return (
    <nav aria-label="Main navigation">
      <ul className="space-y-1">
        {navItems.map((item) => {
          const active =pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <li key={item.href}>
              <Link href={item.href} className={clsx(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                  active ?
                    'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-muted'
                )}
              >
                <span>{item.title}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default NavItems