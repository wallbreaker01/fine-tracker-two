"use client"

import { SignUpInput } from "@/lib/formValidation"
import { useAuthForm, SignInErrors, SignUpErrors } from "./AuthFormContext"
import { FormField } from "./FormField"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { authRoutes, FormLabels } from "@/lib/constants"


export function AuthFormContent() {

    const { mode, isSignIn, formData, errors, isSubmitting, successMessage, handleInputChange, handleSubmit } = useAuthForm()
    const isSignUp = mode === "sign-up"
    const label = FormLabels[mode]

    return (
        <div className='w-full max-w-md p-8 space-y-6 bg-card rounded-xl shadow-lg border'>
            <div className='space-y-2 text-center'>
                <h1 className='text-2xl font-bold text-foreground'>{label.title}</h1>
                <p className='text-sm text-muted-foreground'>{label.subtitle}</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-2">
                {isSignUp && (
                    <FormField
                        id='name'
                        label='Full Name'
                        placeholder='John doe'
                        value={(formData as SignUpInput).name}
                        onChange={(value) => handleInputChange("name", value)}
                        error={(errors as SignUpErrors)?.name}
                        disabled={isSubmitting}
                    />
                )}
                <FormField
                    id="email"
                    label="Email Address"
                    type="email"
                    placeholder="john@gmail.com"
                    value={formData.email || ""}
                    onChange={(value) => handleInputChange("email", value)}
                    error={isSignIn ? (errors as SignInErrors)?.email : (errors as SignUpErrors)?.email}
                    disabled={isSubmitting}
                />
                <FormField
                    id="password"
                    label="Password"
                    type="password"
                    placeholder="********"
                    value={formData.password || ""}
                    onChange={(value) => handleInputChange("password", value)}
                    error={isSignIn ? (errors as SignInErrors)?.password : (errors as SignUpErrors)?.password}
                    disabled={isSubmitting}
                />
                {isSignUp && (
                    <FormField
                        id='confirmPassword'
                        label='Confirm Password'
                        type='password'
                        placeholder='Enter Password Again'
                        value={(formData as SignUpInput).confirmPassword || ""}

                        onChange={(value) => handleInputChange("confirmPassword", value)}
                        error={(errors as SignUpErrors)?.confirmPassword}
                        disabled={isSubmitting}
                    />
                )}
                <Button type='submit' className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Processing..." : label.submitLabel}
                </Button>
            </form>

            <div className="text-center text-sm">
                {label.altPrompt}
                <Link href={isSignIn ? authRoutes.signUp : authRoutes.signIn} className="text-primary ml-1">
                    {label.altLinkLabel}
                </Link>
            </div>
            {successMessage && (
                <div className='p-4 bg-green-500/10'>
                    <p className='text-sm text-green-600 font-medium'>{successMessage}</p>
                </div>
            )}

        </div>
    )
}
