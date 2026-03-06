"use client"

import Link from "next/link"
import { FormField } from "@/components/authComponents/FormField"
import { Button } from "@/components/ui/button"
import { authRoutes } from "@/lib/constants"
import { useAuthForm, SignInErrors, SignUpErrors } from "@/components/authComponents/AuthFormContext"
import { SignInInput, SignUpInput } from "@/lib/formValidation"

const FormLabels = {
    "sign-in": {
        title: "Sign In",
        subtitle: "Sign in to continue to Fine Tracker",
        submitLabel: "Sign In",
        altPrompt: "Don't have an account? ",
        altLinkLabel: "Sign Up",
    },
    "sign-up": {
        title: "Create Account",
        subtitle: "Create an account to start tracking fines",
        submitLabel: "Create Account",
        altPrompt: "Already have an account? ",
        altLinkLabel: "Sign In",
    },
}

export function AuthFormContent() {
    const { mode, isSignIn, values, errors, isSubmitting, setField, onSubmit } = useAuthForm()
    const labels = FormLabels[mode]

    return (
        <div className="w-full max-w-md rounded-lg border  p-6">
            <div className="mb-6 space-y-1">
                <h1 className="text-2xl font-semibold">{labels.title}</h1>
                <p className="text-sm text-muted-foreground">{labels.subtitle}</p>
            </div>

            <form className="space-y-4" onSubmit={onSubmit}>
                {!isSignIn && (
                    <FormField
                        id="name"
                        label="Name"
                        value={(values as SignUpInput).name}
                        onChange={(value) => setField("name", value)}
                        placeholder="John Doe"
                        error={(errors as SignUpErrors).name}
                        disabled={isSubmitting}
                    />
                )}

                <FormField
                    id="email"
                    label="Email"
                    type="email"
                    value={values.email}
                    onChange={(value) => setField("email", value)}
                    placeholder="user@example.com"
                    error={isSignIn ? (errors as SignInErrors).email : (errors as SignUpErrors).email}
                    disabled={isSubmitting}
                />

                <FormField
                    id="password"
                    label="Password"
                    type="password"
                    value={values.password}
                    onChange={(value) => setField("password", value)}
                    placeholder="Enter password"
                    error={isSignIn ? (errors as SignInErrors).password : (errors as SignUpErrors).password}
                    disabled={isSubmitting}
                />

                {!isSignIn && (
                    <FormField
                        id="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        value={(values as SignUpInput).confirmPassword}
                        onChange={(value) => setField("confirmPassword", value)}
                        placeholder="Re-enter password"
                        error={(errors as SignUpErrors).confirmPassword}
                        disabled={isSubmitting}
                    />
                )}

                <Button className="w-full" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Please wait..." : labels.submitLabel}
                </Button>
            </form>

            <p className="mt-4 text-sm text-muted-foreground">
                {labels.altPrompt}
                <Link
                    href={isSignIn ? authRoutes.signUp : authRoutes.signIn}
                    className="text-foreground underline"
                >
                    {labels.altLinkLabel}
                </Link>
            </p>
        </div>
    )
}
