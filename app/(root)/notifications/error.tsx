'use client';

export default function NotificationError({ error }: { error: string }) {
    return (
        <div className="min-h-screen text-white p-6 ml-6">
            <h1 className="text-2xl font-bold mb-4">Notifications</h1>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <p className="text-red-400">{error}</p>
            </div>
        </div>
    );
}