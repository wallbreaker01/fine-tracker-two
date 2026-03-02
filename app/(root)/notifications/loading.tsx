export default function NotificationsLoading() {
    return (
      <div className="min-h-screen text-white p-6 ml-6">
        <h1 className="text-2xl font-bold mb-4">Notifications</h1>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 rounded-lg bg-gray-700 animate-pulse">
              <div className="h-4 bg-gray-600 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-600 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
}