import { ProfileSection } from '@/components/profileComponents/ProfileSection';
import { FineHistory } from '@/components/profileComponents/FineHistory';

export default async function ProfilePage() {
  try {
    return (
      <div className="space-y-6">
        {/* <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-semibold">Profile</h2>
            <p className="mt-1 text-sm text-gray-500">Manage your profile information.</p>
          </div>
        </div > */}
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










//   const [profileData, fineHistory] = await Promise.all([
//     getUserProfile(sessionUser.id),
//     getUserFineHistory(sessionUser.id),
//   ]);

//   if (!profileData) {
//     return (
//       <div className="space-y-6">
//         <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6 text-center">
//           <p className="text-lg font-medium text-destructive">Error</p>
//           <p className="mt-2 text-sm text-muted-foreground">
//             Failed to load profile data.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   