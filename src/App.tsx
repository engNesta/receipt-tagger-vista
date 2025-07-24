
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ClientProvider } from "@/contexts/ClientContext";
import AuthGuard from "@/components/auth/AuthGuard";

const Index = lazy(() => import("@/pages/Index"));
const RawDrop = lazy(() => import("@/pages/RawDrop"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const ClientList = lazy(() => import("@/pages/clients/ClientList"));
const AddClient = lazy(() => import("@/pages/clients/AddClient"));
const ClientCreated = lazy(() => import("@/pages/clients/ClientCreated"));
const ClientManage = lazy(() => import("@/pages/clients/ClientManage"));
const ClientDeleted = lazy(() => import("@/pages/clients/ClientDeleted"));
const ClientView = lazy(() => import("@/pages/clients/ClientView"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <ClientProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AuthGuard>
                <Suspense fallback={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading...</p>
                    </div>
                  </div>
                }>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/rawdrop" element={<RawDrop />} />
                    <Route path="/clients" element={<ClientList />} />
                    <Route path="/clients/add" element={<AddClient />} />
                    <Route path="/clients/created" element={<ClientCreated />} />
                    <Route path="/clients/manage" element={<ClientManage />} />
                    <Route path="/clients/deleted" element={<ClientDeleted />} />
                    <Route path="/clients/:id/view" element={<ClientView />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </AuthGuard>
            </BrowserRouter>
          </ClientProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
