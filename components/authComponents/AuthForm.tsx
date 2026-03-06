"use client"

import { AuthFormProvider } from "@/components/authComponents/AuthFormContext"
import { AuthFormContent } from "@/components/authComponents/AuthFormContent"

type Mode = "sign-in" | "sign-up"

type AuthFormProps = {
    mode: Mode
}

export function AuthForm({ mode }: AuthFormProps) {
    return (
        <AuthFormProvider mode={mode}>
            <AuthFormContent />
        </AuthFormProvider>
    )
}
