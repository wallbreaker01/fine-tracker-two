"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

type FinesErrorProps = {
    error: Error & { digest?: string };
    reset: () => void;
};

export default function FinesError({ error, reset }: FinesErrorProps) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="rounded-xl border border-red-500/30 bg-gray-800 p-6">
            <h2 className="text-xl font-semibold text-gray-400">Fines page failed to load</h2>
            <p className="mt-2 text-sm text-gray-500">Please retry. If it continues, check server logs.</p>
            <Button className="mt-4" onClick={reset} type="button">
                Try Again
            </Button>
        </div>
    );
}
