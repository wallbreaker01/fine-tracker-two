import { Skeleton } from "@/components/ui/skeleton"

type AuthFormSkeletonProps = {
    showName?: boolean
}

export function AuthFormSkeleton({ showName = false }: AuthFormSkeletonProps) {
    const fields = [
        showName ? { key: "name", labelWidth: "w-16" } : null,
        { key: "email", labelWidth: "w-14" },
        { key: "password", labelWidth: "w-20" },
        showName ? { key: "confirm", labelWidth: "w-28" } : null,
    ].filter(Boolean) as { key: string; labelWidth: string }[]

    return (
        <div className="w-full max-w-md rounded-lg border border-border p-6" role="status" aria-busy="true"aria-label="Loading authentication form">
            <div className="mb-6 space-y-2">
                <Skeleton className="h-8 w-36" aria-hidden />
                <Skeleton className="h-4 w-64" aria-hidden />
            </div>

            <div className="space-y-4">
                {fields.map((field) => (
                    <div key={field.key} className="space-y-2">
                        <Skeleton className={`h-4 ${field.labelWidth}`} aria-hidden />
                        <Skeleton className="h-10 w-full" aria-hidden />
                    </div>
                ))}
                <Skeleton className="h-10 w-full" aria-hidden />
            </div>
            <Skeleton className="mt-4 h-4 w-48" aria-hidden />
        </div>
    )
}