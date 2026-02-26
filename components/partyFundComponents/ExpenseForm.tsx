"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { expenseSchema, type ExpenseInput } from "@/lib/formValidation";

export function ExpenseForm() {
    const router = useRouter();
    const [requestError, setRequestError] = useState<string | null>(null);
    const onSubmit = async (values: ExpenseInput) => {
        try{
            setRequestError(null);
            const response = await fetch("/api/party/expense", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            const data = (await response.json()) as {success?: boolean, message?: string};
            if(!response.ok || !data.success){
                setRequestError(data.message ?? "Could not save expense");
                return;
            }
            router.push("/party");
            router.refresh();
        } catch(error) {
            setRequestError("Something went wrong. Please try again.");
        }
    }
    const form = useForm<ExpenseInput>({
        resolver: zodResolver(expenseSchema),
        defaultValues: {
            description: "",
            price: 0,
        },
    })
    const isSubmitting = form.formState.isSubmitting;

    return (
        <Form {...form}>
            <form className="space-y-5 rounded-lg border border-border p-5" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter expense description" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />

                <FormField control={form.control} name="price" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Price (৳)</FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                placeholder="0.00"
                                step="1.00"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <Button type='submit' disabled={isSubmitting} className="w-full">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add Expense
                </Button>
            </form>
        </Form>
    )
}