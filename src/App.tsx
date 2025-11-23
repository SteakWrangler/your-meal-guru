import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Suggestions from "./pages/Suggestions";
import Instructions from "./pages/Instructions";
import Ingredients from "./pages/Ingredients";
import Recreate from "./pages/Recreate";
import Enhance from "./pages/Enhance";
import Planning from "./pages/Planning";
import DietGuide from "./pages/DietGuide";
import NutritionAnalysis from "./pages/NutritionAnalysis";
import CalorieEstimator from "./pages/CalorieEstimator";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
