import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Branches from "./pages/Branches";
import Brands from "./pages/Brands";
import Promotions from "./pages/Promotions";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import StaffManagement from "./pages/StaffManagement";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Debug from "./pages/Debug";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  console.log("🚀 App component rendering...");

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/debug" element={<Debug />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Dashboard />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/products"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Products />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/categories"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Categories />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/branches"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Branches />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/brands"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Brands />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/promotions"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Promotions />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Notifications />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Profile />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/staff"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <StaffManagement />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
