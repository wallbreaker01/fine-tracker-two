import { ProfileSection } from '@/components/profileComponents/ProfileSection';
import { FineHistory } from '@/components/profileComponents/FineHistory';

export default async function ProfilePage() {
  try {
    return (
      <div className="space-y-6">
        <ProfileSection />
        <FineHistory />
      </div>
    )

  } catch (error) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6 text-center">
          <p className="text-lg font-medium text-destructive">Error</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {(error as Error).message || 'An error occurred while loading your profile'}
          </p>
        </div>
      </div>
    )
  }
}