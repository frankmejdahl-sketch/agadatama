import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Shield } from "lucide-react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Shield className="h-8 w-8 text-primary animate-pulse" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  return <>{children}</>;
}