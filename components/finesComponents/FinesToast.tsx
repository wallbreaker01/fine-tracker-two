// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { CheckCircle2, CircleAlert, X } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";

// type FinesToastProps = {
//     message?: string;
//     type?: "success" | "error";
// };

// export function FinesToast({ message, type = "success" }: FinesToastProps) {
//     const [open, setOpen] = useState(Boolean(message));

//     useEffect(() => {
//         if (!message) return;

//         setOpen(true);
//         const timer = setTimeout(() => {
//             setOpen(false);
//         }, 3000);

//         return () => clearTimeout(timer);
//     }, [message]);

//     const Icon = useMemo(() => (type === "error" ? CircleAlert : CheckCircle2), [type]);

//     if (!message || !open) {
//         return null;
//     }

//     return (
//         <div
//             className={cn(
//                 "fixed right-4 bottom-4 z-50 flex items-center gap-3 rounded-md border px-4 py-3 shadow-lg",
//                 type === "error"
//                     ? "border-destructive/40 bg-destructive/10 text-destructive"
//                     : "border-border bg-card text-card-foreground",
//             )}
//             role="status"
//             aria-live="polite"
//         >
//             <Icon className="size-4" />
//             <p className="text-sm">{message}</p>
//             <Button
//                 type="button"
//                 variant="ghost"
//                 size="icon-xs"
//                 className="ml-1"
//                 onClick={() => setOpen(false)}
//             >
//                 <X className="size-3.5" />
//             </Button>
//         </div>
//     );
// }
