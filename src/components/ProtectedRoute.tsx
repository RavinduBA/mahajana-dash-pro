import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  console.log("🛡️ ProtectedRoute check:", { isLoading, isAuthenticated, user });

  // Show loading screen while checking authentication
  if (isLoading) {
    console.log("⏳ ProtectedRoute: Still loading...");
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <img
            src="/MahajanaSuper.jpg"
            alt="Mahajana Super"
            className="h-12 w-12 rounded-lg object-cover mx-auto animate-pulse"
          />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log("❌ ProtectedRoute: Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render protected content
  console.log("✅ ProtectedRoute: Authenticated, rendering content");
  return <>{children}</>;
}
