"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { ZodIssue } from "zod"

import { FormField } from "@/components/authComponents/FormField"
import { Button } from "@/components/ui/button"
import { SignInInput, SignUpInput, signInSchema, signUpSchema, } from "@/lib/formValidation"

type Mode = "sign-in" | "sign-up"

type SignInErrors = Partial<Record<keyof SignInInput, string>>
type SignUpErrors = Partial<Record<keyof SignUpInput, string>>

type AuthFormProps = {
    mode: Mode
}

type AuthResponse = {
    success: boolean
    message: string
    emailSent?: boolean
    emailError?: string
    user?: {
        id: number
        name: string
        email: string
    }
}

function mapZodIssues<T extends string>(issues: ZodIssue[]): Partial<Record<T, string>> {
    return issues.reduce((acc, issue) => {
        const path = issue.path[0]
        if (typeof path === "string" && !acc[path as T]) {
            acc[path as T] = issue.message
        }
        return acc
    }, {} as Partial<Record<T, string>>)
}

const signInInitialState: SignInInput = {
    email: "",
    password: "",
}

const signUpInitialState: SignUpInput = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
}

const authRoutes = {
    signIn: "/sign-in",
    signUp: "/sign-up",
    dashboard: "/dashboard",
} as const

async function postAuth(endpoint: string, payload: SignInInput | SignUpInput): Promise<AuthResponse> {
    const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })

    const data = (await response.json()) as AuthResponse

    if (!response.ok) {
        return {
            success: false,
            message: data.message || "Authentication failed",
        }
    }

    return data
}

export function AuthForm({ mode }: AuthFormProps) {
    const router = useRouter()
    const isSignIn = mode === "sign-in"

    const [signInValues, setSignInValues] = useState<SignInInput>(signInInitialState)
    const [signUpValues, setSignUpValues] = useState<SignUpInput>(signUpInitialState)
    const [errors, setErrors] = useState<SignInErrors | SignUpErrors>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
        null
    )

    const title = isSignIn ? "Sign In" : "Create Account"
    const subtitle = isSignIn
        ? "Sign in to continue to Fine Tracker"
        : "Create an account to start tracking fines"
    const submitLabel = isSignIn ? "Sign In" : "Create Account"
    const altPrompt = isSignIn ? "Don’t have an account? " : "Already have an account? "
    const altLinkLabel = isSignIn ? "Sign Up" : "Sign In"

    const setField = (field: string, value: string) => {
        setFeedback(null)
        if (isSignIn) {
            setSignInValues((prev) => ({ ...prev, [field]: value }))
            setErrors((prev) => ({ ...prev, [field]: undefined }))
            return
        }

        setSignUpValues((prev) => ({ ...prev, [field]: value }))
        setErrors((prev) => ({ ...prev, [field]: undefined }))
    }

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setFeedback(null)

        if (isSignIn) {
            const parsed = signInSchema.safeParse(signInValues)
            if (!parsed.success) {
                setErrors(mapZodIssues<keyof SignInInput & string>(parsed.error.issues))
                return
            }

            setIsSubmitting(true)
            const result = await postAuth("/api/auth/sign-in", parsed.data)
            setIsSubmitting(false)

            if (!result.success) {
                setFeedback({ type: "error", message: result.message })
                return
            }

            if (result.user) {
                localStorage.setItem("fineTrackerUser", JSON.stringify(result.user))
            }

            setFeedback({ type: "success", message: result.message })
            router.push(authRoutes.dashboard)
            return
        }

        const parsed = signUpSchema.safeParse(signUpValues)
        if (!parsed.success) {
            setErrors(mapZodIssues<keyof SignUpInput & string>(parsed.error.issues))
            return
        }

        setIsSubmitting(true)
        const result = await postAuth("/api/auth/sign-up", parsed.data)
        setIsSubmitting(false)

        if (!result.success) {
            setFeedback({ type: "error", message: result.message })
            return
        }

        if (result.emailSent === false) {
            setFeedback({
                type: "error",
                message: result.emailError
                    ? `${result.message}. ${result.emailError}`
                    : result.message,
            })
            return
        }

        setFeedback({ type: "success", message: result.message })
        router.push(authRoutes.signIn)
    }

    return (
        <div className="w-full max-w-md rounded-lg border border-border p-6">
            <div className="mb-6 space-y-1">
                <h1 className="text-2xl font-semibold">{title}</h1>
                <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>

            <form className="space-y-4" onSubmit={onSubmit}>
                {!isSignIn ? (
                    <FormField
                        id="name"
                        label="Name"
                        value={signUpValues.name}
                        onChange={(value) => setField("name", value)}
                        placeholder="Jane Doe"
                        error={(errors as SignUpErrors).name}
                        disabled={isSubmitting}
                    />
                ) : null}

                <FormField
                    id="email"
                    label="Email"
                    type="email"
                    value={isSignIn ? signInValues.email : signUpValues.email}
                    onChange={(value) => setField("email", value)}
                    placeholder="user@example.com"
                    error={isSignIn ? (errors as SignInErrors).email : (errors as SignUpErrors).email}
                    disabled={isSubmitting}
                />

                <FormField
                    id="password"
                    label="Password"
                    type="password"
                    value={isSignIn ? signInValues.password : signUpValues.password}
                    onChange={(value) => setField("password", value)}
                    placeholder="Enter password"
                    error={isSignIn ? (errors as SignInErrors).password : (errors as SignUpErrors).password}
                    disabled={isSubmitting}
                />

                {!isSignIn ? (
                    <FormField
                        id="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        value={signUpValues.confirmPassword}
                        onChange={(value) => setField("confirmPassword", value)}
                        placeholder="Re-enter password"
                        error={(errors as SignUpErrors).confirmPassword}
                        disabled={isSubmitting}
                    />
                ) : null}

                <Button className="w-full" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Please wait..." : submitLabel}
                </Button>
            </form>

            {feedback ? (
                <p
                    className={`mt-3 text-sm ${feedback.type === "error" ? "text-destructive" : "text-green-600"
                        }`}
                >
                    {feedback.message}
                </p>
            ) : null}

            <p className="mt-4 text-sm text-muted-foreground">
                {altPrompt}
                <Link href={isSignIn ? authRoutes.signUp : authRoutes.signIn} className="text-foreground underline">
                    {altLinkLabel}
                </Link>
            </p>
        </div>
    )
}
