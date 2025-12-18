import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useMobileTheme } from "@/hooks/use-mobile-theme";
import { useNetworkStatus } from "@/hooks/use-network-status";
import OfflineBanner from "./components/OfflineBanner";
import LoadingSpinner from "./components/LoadingSpinner";

// Eager load Index page (homepage) for fast initial load
import Index from "./pages/Index";

// Lazy load all other pages for code splitting
const Suggestions = lazy(() => import("./pages/Suggestions"));
const Instructions = lazy(() => import("./pages/Instructions"));
const Ingredients = lazy(() => import("./pages/Ingredients"));
const Recreate = lazy(() => import("./pages/Recreate"));
const Enhance = lazy(() => import("./pages/Enhance"));
const Planning = lazy(() => import("./pages/Planning"));
const DietGuide = lazy(() => import("./pages/DietGuide"));
const NutritionAnalysis = lazy(() => import("./pages/NutritionAnalysis"));
const CalorieEstimator = lazy(() => import("./pages/CalorieEstimator"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Support = lazy(() => import("./pages/Support"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const AppContent = () => {
  // Sync mobile status bar with theme
  useMobileTheme();

  // Monitor network status
  const networkStatus = useNetworkStatus();

  return (
    <>
      {!networkStatus.connected && <OfflineBanner />}
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/suggestions" element={<Suggestions />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/ingredients" element={<Ingredients />} />
          <Route path="/recreate" element={<Recreate />} />
          <Route path="/enhance" element={<Enhance />} />
          <Route path="/planning" element={<Planning />} />
          <Route path="/diet" element={<DietGuide />} />
          <Route path="/nutrition-analysis" element={<NutritionAnalysis />} />
          <Route path="/calorie-estimator" element={<CalorieEstimator />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/support" element={<Support />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
