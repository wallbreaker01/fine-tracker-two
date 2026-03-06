"use client"

import { createContext, useContext, useState, FormEvent, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { ZodIssue } from "zod"
import { SignInInput, SignUpInput, signInSchema, signUpSchema } from "@/lib/formValidation"
import { AuthResponse } from "@/lib/types"
import { authRoutes, signInInitialState, signUpInitialState } from "@/lib/constants"

export type Mode = "sign-in" | "sign-up"
export type SignInErrors = Partial<Record<keyof SignInInput, string>>
export type SignUpErrors = Partial<Record<keyof SignUpInput, string>>

interface Feedback {
    type: "success" | "error"
    message: string
}

interface AuthFormContextType {
    mode: Mode
    isSignIn: boolean
    values: SignInInput | SignUpInput
    errors: SignInErrors | SignUpErrors
    isSubmitting: boolean
    feedback: Feedback | null
    setField: (field: string, value: string) => void
    onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
}

const AuthFormContext = createContext<AuthFormContextType | undefined>(undefined) //global container for fortState

// Utility: Convert Zod errors to field errors
function mapZodIssues<T extends string>(issues: ZodIssue[]): Partial<Record<T, string>> {
    return issues.reduce((acc, issue) => {
        const path = issue.path[0]
        if (typeof path === "string" && !acc[path as T]) {
            acc[path as T] = issue.message
        }
        return acc
    }, {} as Partial<Record<T, string>>)
}

// Make auth API call
async function postAuth(endpoint: string, payload: SignInInput | SignUpInput): Promise<AuthResponse> {
    const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })
    return response.json()
}

export function AuthFormProvider({ children, mode }: { children: ReactNode; mode: Mode }) {
    const router = useRouter()
    const isSignIn = mode === "sign-in"

    // Single state for form values (cleaner than managing sign-in and sign-up separately)
    const [values, setValues] = useState<SignInInput | SignUpInput>(
        isSignIn ? signInInitialState : signUpInitialState
    )
    const [errors, setErrors] = useState<SignInErrors | SignUpErrors>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [feedback, setFeedback] = useState<Feedback | null>(null)

    // Update a single field
    const setField = (field: string, value: string) => {
        setFeedback(null)
        setValues((prev) => ({ ...prev, [field]: value }))
        setErrors((prev) => ({ ...prev, [field]: undefined }))
    }

    // Handle form submission
    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setFeedback(null)

        // Validate
        const schema = isSignIn ? signInSchema : signUpSchema
        const parsed = schema.safeParse(values)
        if (!parsed.success) {
            setErrors(mapZodIssues(parsed.error.issues))
            return
        }

        // Submit
        setIsSubmitting(true)
        const endpoint = isSignIn ? "/api/auth/sign-in" : "/api/auth/sign-up"
        const result = await postAuth(endpoint, parsed.data)
        setIsSubmitting(false)

        // Handle errors
        if (!result.success) {
            setFeedback({ type: "error", message: result.message })
            return
        }

        // Sign-in success
        if (isSignIn) {
            if (result.user) {
                localStorage.setItem("fineTrackerUser", JSON.stringify(result.user))
            }
            setFeedback({ type: "success", message: result.message })
            router.push(authRoutes.dashboard)
            return
        }

        // Sign-up logic
        if (result.emailSent === false) {
            setFeedback({
                type: "error",
                message: result.emailError ? `${result.message}. ${result.emailError}` : result.message,
            })
            return
        }

        setFeedback({ type: "success", message: result.message })
        router.push(authRoutes.signIn)
    }

    const value = { mode, isSignIn, values, errors, isSubmitting, feedback, setField, onSubmit }

    return <AuthFormContext.Provider value={value}>{children}</AuthFormContext.Provider>
}

export function useAuthForm() {
    const context = useContext(AuthFormContext)
    if (!context) throw new Error("useAuthForm must be used within AuthFormProvider")
    return context
}
