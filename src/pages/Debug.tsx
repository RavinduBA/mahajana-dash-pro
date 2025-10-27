import { useAuth } from "@/contexts/AuthContext";

export default function Debug() {
  const { user, isAuthenticated, isLoading } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Authentication</h1>

      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="font-semibold">Loading State:</h2>
          <p>{isLoading ? "Loading..." : "Not Loading"}</p>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold">Authentication State:</h2>
          <p>{isAuthenticated ? "✅ Authenticated" : "❌ Not Authenticated"}</p>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold">User Data:</h2>
          {user ? (
            <pre className="bg-gray-100 p-2 rounded mt-2">
              {JSON.stringify(user, null, 2)}
            </pre>
          ) : (
            <p>No user data</p>
          )}
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold">LocalStorage Token:</h2>
          <p className="break-all text-sm">
            {localStorage.getItem("admin_token") || "No token found"}
          </p>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold">LocalStorage User:</h2>
          <pre className="bg-gray-100 p-2 rounded mt-2 text-xs overflow-auto">
            {localStorage.getItem("admin_user") || "No user data found"}
          </pre>
        </div>
      </div>
    </div>
  );
}
