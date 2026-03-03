"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail, SidebarTrigger } from '@/components/ui/sidebar'
import { iconMap, navItems } from '@/lib/constants'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

type AuthUser = {
  id: number
  name: string
  email: string
  avatar?: string | null
}

type NotificationItem = {
  isRead: boolean
}

type SideMenuProps = {
  children: React.ReactNode
}

const SideMenu: React.FC<SideMenuProps> = ({ children }) => {
  const router = useRouter()
  const pathname = usePathname() || '/'
  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false)
  const [user, setUser] = React.useState<AuthUser | null>(null)
  const [unreadCount, setUnreadCount] = React.useState(0)

  React.useEffect(() => {
    const loadUser = () => {
      const rawUser = localStorage.getItem('fineTrackerUser')
      if (!rawUser) {
        setUser(null)
        return
      }

      try {
        setUser(JSON.parse(rawUser) as AuthUser)
      } catch {
        localStorage.removeItem('fineTrackerUser')
        setUser(null)
      }
    }

    loadUser()
    window.addEventListener('fineTrackerUserUpdated', loadUser)

    return () => {
      window.removeEventListener('fineTrackerUserUpdated', loadUser)
    }
  }, [])

  React.useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch('/api/notification')
        const data = (await response.json()) as { success?: boolean; data?: NotificationItem[] }
        if (data.success && Array.isArray(data.data)) {
          const unread = data.data.filter((notification) => !notification.isRead).length
          setUnreadCount(unread)
        }

      } catch (error) {
        console.error('Failed to fetch unread notifications count:', error);
      }
    }
    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 3000)
    return () => clearInterval(interval)
  }, [])

  const onSignOut = async () => {
    await fetch('/api/auth/sign-out', { method: 'POST' })
    localStorage.removeItem('fineTrackerUser')
    setIsProfileMenuOpen(false)
    router.replace('/sign-in')
    router.refresh()
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-md px-2 py-1.5"
          >
            <div className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-md text-lg font-semibold">
              <Image src="/favicon.ico" alt="Fine Tracker Logo" width={40} height={40} />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-semibold leading-tight">Fine Tracker</p>
              <p className="text-xs text-sidebar-foreground/70">
                We collect fines for fun!
              </p>
            </div>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            {/* <SidebarGroupLabel>Navigation</SidebarGroupLabel> */}
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => {
                  const Icon = iconMap[item.href] ?? iconMap['/']
                  const isRoot = item.href === '/'
                  const isActive = isRoot
                    ? pathname === '/'
                    : pathname === item.href || pathname.startsWith(item.href + '/')

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.href}>
                          <Icon className="text-sidebar-foreground/70" />
                          <span>{item.title}</span>
                          {item.href === '/notifications' && unreadCount > 0 && (
                            <span className="right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
                              {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              className="bg-sidebar-accent/40 flex w-full items-center gap-3 rounded-md px-3 py-2 text-left"
            >
              <Avatar className="h-9 w-9 rounded-md">
                <AvatarImage src={user?.avatar ?? ''} alt={user?.name ?? 'User'} />
                <AvatarFallback className="rounded-md bg-primary text-primary-foreground font-semibold text-sm">
                  {user?.name?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium leading-tight">{user?.name}</p>
                <p className="truncate text-xs text-sidebar-foreground/70">
                  {user?.email}
                </p>
              </div>
            </button>

            {isProfileMenuOpen ? (
              <div className="bg-background absolute bottom-14 left-0 z-10 w-full rounded-md border p-2 shadow-sm">
                <Button type="button" variant="ghost" className="w-full justify-start" onClick={onSignOut}>
                  Sign Out
                </Button>
              </div>
            ) : null}
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarRail />
      <SidebarInset>
        <header className="flex h-16 items-center gap-3 border-b px-4">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-lg font-semibold lg:hidden">Fine Tracker</h1>
        </header>
        <div className="flex-1 px-4 py-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default SideMenu