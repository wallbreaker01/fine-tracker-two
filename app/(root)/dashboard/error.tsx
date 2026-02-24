"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

type DashboardErrorProps = {
    error: Error & { digest?: string };
    reset: () => void;
};

export default function DashboardError({ error, reset }: DashboardErrorProps) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="rounded-xl border border-red-500/30 bg-gray-800 p-6">
            <h2 className="text-xl font-semibold text-gray-400">Dashboard failed to load</h2>
            <p className="mt-2 text-sm text-gray-500">Please try again. If this keeps happening, check the server logs.</p>
            <Button className="mt-4" onClick={reset} type="button">
                Try Again
            </Button>
        </div>
    );
}