import { AuthForm } from "@/components/authComponents/AuthForm"

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <AuthForm mode="sign-in" />
    </main>
  )
}