import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/auth/session"

type AuthLayoutProps = {
  children: ReactNode
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const sessionUser = await getSessionUser()

  if (sessionUser) {
    redirect("/dashboard")
  }

  return <main className="flex min-h-screen items-center justify-center px-4">{children}</main>
}