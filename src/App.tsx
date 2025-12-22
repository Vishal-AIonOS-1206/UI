import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import Overview from "@/pages/Overview";
import ExecutiveCockpit from "./pages/ExecutiveCockpit";
import Datasets from "./pages/Datasets";
import DatasetReport from "./pages/DatasetReport";
import Explainability from "./pages/Explainability";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route
            path="/*"
            element={
              <MainLayout>
                <Routes>
                  <Route path="/dashboard" element={<Overview />} />
                  <Route path="/executive" element={<ExecutiveCockpit />} />
                  <Route path="/datasets" element={<Datasets />} />
                  <Route path="/dataset/:domain/:schema/:dataset" element={<DatasetReport />} />
                  <Route path="/explainability" element={<Explainability />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </MainLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
