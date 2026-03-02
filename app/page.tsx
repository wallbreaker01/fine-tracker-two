import { redirect } from "next/navigation"
import { AuthForm } from "@/components/authComponents/AuthForm"
import { getSessionUser } from "@/lib/auth/session"

export default async function HomePage() {
  const sessionUser = await getSessionUser()

  if (sessionUser) {
    redirect("/dashboard")
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <AuthForm mode="sign-in" />
    </main>
  )
}