import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // Authentication is temporarily disabled - always allow access
  // Backend authentication will be implemented later
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <img
            src="/MahajanaSuper.jpg"
            alt="Mahajana Super"
            className="h-12 w-12 rounded-lg object-cover mx-auto"
          />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Temporarily always return children (no authentication check)
  return <>{children}</>;
}
