"use client";

import { Loader2, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type FineRowActionsProps = {
    fineId: number;
};

export function FineRowActions({ fineId }: FineRowActionsProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {

        try {
            setIsDeleting(true);
            const response = await fetch(`/api/fines/${fineId}`, {
                method: "DELETE",
            });

            const data = (await response.json()) as { success?: boolean; message?: string };

            const params = new URLSearchParams(searchParams.toString());
            params.set("toast", data.message ?? "Fine deleted successfully");
            params.set("type", data.success ? "success" : "error");
            router.replace(`${pathname}?${params.toString()}`);
            router.refresh();

        } catch (error) {
            const params = new URLSearchParams(searchParams.toString());
            params.set("toast", "Failed to delete fine");
            params.set("type", "error");
            router.replace(`${pathname}?${params.toString()}`);
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <div className="flex items-center justify-end gap-2">
            <Button asChild variant="ghost" size="icon-sm" aria-label="Edit fine">
                <Link href={`/fines/edit/${fineId}`}>
                    <Pencil className="size-4" />
                </Link>
            </Button>

            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon-sm" aria-label="Delete fine" disabled={isDeleting}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                        {isDeleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete fine?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone. The record will be removed permanently.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            variant="destructive"
                            className="text-white hover:text-white"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}







