import { getSessionUser } from "@/lib/auth/session";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent } from "../ui/card";
import { getUserProfile } from "@/lib/database/fines";

export async function ProfileSection() {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
        return (
            <div className="space-y-6">
                <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6 text-center">
                    <p className="text-lg font-medium text-destructive">Error</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        No user session found. Please log in.
                    </p>
                </div>
            </div>
        );
    }
    const profileData = await getUserProfile(sessionUser.id);
    if (!profileData) {
        return (
            <div className="space-y-6">
                <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6 text-center">
                    <p className="text-lg font-medium text-destructive">Error</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Failed to load profile data.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <Card>
            <CardContent className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-border">
                <div className="flex items-center gap-4">
                    <Avatar className="h-24 w-24 rounded-full bg-muted shrink-0">
                        <AvatarImage src={profileData.image ?? "/placeholder-user.jpg"} alt={profileData.name ?? "User"} />
                        <AvatarFallback className="text-2xl font-semibold">{profileData.initials ?? ""}</AvatarFallback>
                    </Avatar>
                </div>

                <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-center">
                    <div className="text-center sm:text-left sm:col-span-2 md:col-span-1">
                        <p className="text-2xl font-bold text-foreground">{profileData.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">User Profile</p>
                    </div>

                    <div className="text-center sm:text-left">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
                        <p className="text-sm text-foreground break-all">{profileData.email}</p>
                    </div>

                    <div className="rounded-md bg-muted/10 p-4 text-center col-span-1 sm:col-span-2 md:col-span-1">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Total Fines</p>
                        <p className="text-lg font-bold text-destructive">৳{Number(profileData.totalFineAmount ?? 0).toLocaleString()}</p>
                    </div>

                    <div className="rounded-md bg-muted/10 p-4 text-center col-span-1 sm:col-span-2 md:col-span-1">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Fine Count</p>
                        <p className="text-lg font-bold text-orange-600">{profileData.fineCount ?? 0}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}