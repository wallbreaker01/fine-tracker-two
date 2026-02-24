import SideMenu from '@/components/SideMenu'
import React from 'react'
import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/auth/session'

type Props = { children: React.ReactNode }

const Layout = async ({ children }: Props) => {
  const sessionUser = await getSessionUser()

  if (!sessionUser) {
    redirect('/sign-in')
  }

  return (
    <SideMenu>{children}</SideMenu>
  )
}

export default Layout