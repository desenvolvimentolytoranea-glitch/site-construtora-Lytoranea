import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminProvider } from "@/contexts/AdminContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Portfolio from "./pages/Portfolio";
import PortfolioDetail from "./pages/PortfolioDetail";
import Contact from "./pages/Contact";
import IntegrityChannel from "./pages/IntegrityChannel";
import Privacy from "./pages/Privacy";
import Admin from "./pages/Admin";
import AdminPortfolio from "./pages/AdminPortfolio";
import AdminClients from "./pages/AdminClients";
import NotFound from "./pages/NotFound";

const App = () => {
  const queryClient = React.useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
      },
    },
  }), []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AdminProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/quem-somos" element={<About />} />
                  <Route path="/servicos" element={<Services />} />
                  <Route path="/servicos/:slug" element={<ServiceDetail />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/portfolio/:slug" element={<PortfolioDetail />} />
                  <Route path="/contato" element={<Contact />} />
                  <Route path="/canal-de-integridade" element={<IntegrityChannel />} />
                  <Route path="/privacidade" element={<Privacy />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/admin/portfolio" element={<AdminPortfolio />} />
                  <Route path="/admin/clients" element={<AdminClients />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </AdminProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
