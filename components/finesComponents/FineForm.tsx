"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fineSchema, type FineInput } from "@/lib/formValidation";

type MemberOption = {
    id: number;
    name: string;
};

type FineFormProps = {
    mode: "add" | "edit";
    members: MemberOption[];
    fineId?: number;
    initialValues?: FineInput;
};

export function FineForm({ mode, members, fineId, initialValues }: FineFormProps) {
    const router = useRouter();
    const [requestError, setRequestError] = useState<string | null>(null);

    const form = useForm<FineInput>({
        resolver: zodResolver(fineSchema),
        defaultValues: {
            userId: initialValues?.userId ?? 0,
            reason: initialValues?.reason ?? "",
            amount: initialValues?.amount ?? 0,
            date: initialValues?.date ?? new Date().toISOString().slice(0, 10),
        },
    })
    useEffect(() => {
        if (!initialValues) return;

        form.reset({
            userId: initialValues.userId,
            reason: initialValues.reason,
            amount: initialValues.amount,
            date: new Date(initialValues.date).toISOString().slice(0, 10),
        });
    }, [initialValues, form]);

    const isSubmitting = form.formState.isSubmitting;
    const onSubmit = async (values: FineInput) => {

        try {
            setRequestError(null);
            const endpoint = mode === "add" ? "/api/fines" : `/api/fines/${fineId}`;
            const method = mode === "add" ? "POST" : "PUT";

            const response = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            const data = (await response.json()) as { success?: boolean; message?: string };

            if (!response.ok || !data.success) {
                setRequestError(data.message ?? "Could not save fine");
                return;
            }

            const message = encodeURIComponent(
                data.message ?? (mode === "add" ? "Fine added successfully" : "Fine updated successfully"),
            )
            router.push(`/fines?toast=${message}&type=success`);
            router.refresh();

        } catch (error) {
            setRequestError("Something went wrong. Please try again.");
        }
    };

    return (
        <Form {...form}>
            <form className="space-y-5 rounded-lg border border-border p-5"
                onSubmit={form.handleSubmit(onSubmit)}>
                <FormField control={form.control} name="userId" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Member</FormLabel>
                        <Select value={String(field.value)} onValueChange={(value) => field.onChange(Number(value))}>
                            <FormControl>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select member" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {members.map((member) => (
                                    <SelectItem key={member.id} value={String(member.id)}>{member.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
                />

                <FormField control={form.control} name="reason" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Reason</FormLabel>
                        <FormControl><Input placeholder="PC not shutdown" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />

                {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"> */}
                <FormField control={form.control} name="amount" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                            <Input type="number" min="0" step="1.00" value={field.value} onChange={(event) => field.onChange(Number(event.target.value))} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />

                <FormField control={form.control} name="date" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl><Input type="date" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                {/* </div> */}
                <div className="flex items-center justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => router.push("/fines")}>Cancel</Button>
                    <Button type="submit">
                        {isSubmitting ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                        {mode === "add" ? "Add Fine" : "Update Fine"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}









