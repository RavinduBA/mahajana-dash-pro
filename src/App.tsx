import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Branches from "./pages/Branches";
import Brands from "./pages/Brands";
import Promotions from "./pages/Promotions";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
          <Route path="/products" element={<DashboardLayout><Products /></DashboardLayout>} />
          <Route path="/categories" element={<DashboardLayout><Categories /></DashboardLayout>} />
          <Route path="/branches" element={<DashboardLayout><Branches /></DashboardLayout>} />
          <Route path="/brands" element={<DashboardLayout><Brands /></DashboardLayout>} />
          <Route path="/promotions" element={<DashboardLayout><Promotions /></DashboardLayout>} />
          <Route path="/notifications" element={<DashboardLayout><Notifications /></DashboardLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
