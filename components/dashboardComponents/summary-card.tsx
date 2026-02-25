import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type SummaryCardProps = {
    title: string;
    value: string;
    subtitle?: string;
    state?: "default" | "empty" | "error";
};

export function SummaryCard({ title, value, subtitle, state = "default" }: SummaryCardProps) {
    
    const stateLabel = 
    state =='error'? "Unable to load" : state === "empty"? "No data": subtitle;


    return (
        <Card className="gap-3  bg-yellow-100  py-4">
            <CardHeader className="px-4">
                <CardDescription className="text-xs font-medium uppercase tracking-wide text-black">{title}</CardDescription>
            </CardHeader>
            <CardContent className="px-4">
                <CardTitle className="text-2xl font-bold text-black sm:text-3xl">{value}</CardTitle>
                <p className="mt-1 text-xs text-black">{stateLabel ?? " "}</p>
            </CardContent>
        </Card>
    );
}
