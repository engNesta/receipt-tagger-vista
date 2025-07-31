
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ClientProvider } from "@/contexts/ClientContext";
import { ClientDocumentProvider } from "@/contexts/ClientDocumentContext";
import { AccountingWizardProvider } from "@/contexts/AccountingWizardContext";
import { APP_CONFIG } from "@/constants";

// Lazy-loaded components
const Index = lazy(() => import("@/pages/Index"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const ClientList = lazy(() => import("@/pages/clients/ClientList"));
const AddClient = lazy(() => import("@/pages/clients/AddClient"));
const ClientCreated = lazy(() => import("@/pages/clients/ClientCreated"));
const ClientManage = lazy(() => import("@/pages/clients/ClientManage"));
const ClientDeleted = lazy(() => import("@/pages/clients/ClientDeleted"));
const ClientView = lazy(() => import("@/pages/clients/ClientView"));
const AccountingWizard = lazy(() => import("@/pages/accounting/AccountingWizard"));
const MatchingReport = lazy(() => import("@/pages/MatchingReport"));
const SIEGenerated = lazy(() => import("@/pages/SIEGenerated"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <ClientProvider>
            <ClientDocumentProvider>
              <AccountingWizardProvider>
              <Toaster />
              <Sonner />
            <BrowserRouter>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path={APP_CONFIG.ROUTES.HOME} element={<Index />} />
                  <Route path={APP_CONFIG.ROUTES.CLIENTS} element={<ClientList />} />
                  <Route path={APP_CONFIG.ROUTES.CLIENTS_ADD} element={<AddClient />} />
                  <Route path="/clients/created" element={<ClientCreated />} />
                  <Route path={APP_CONFIG.ROUTES.CLIENTS_MANAGE} element={<ClientManage />} />
                  <Route path="/clients/deleted" element={<ClientDeleted />} />
                  <Route path="/clients/:id/view" element={<ClientView />} />
                  <Route path="/client/:id" element={<AccountingWizard />} />
                  <Route path={APP_CONFIG.ROUTES.MATCHING_REPORT} element={<MatchingReport />} />
                  <Route path={APP_CONFIG.ROUTES.SIE_GENERATED} element={<SIEGenerated />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
              </AccountingWizardProvider>
            </ClientDocumentProvider>
          </ClientProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
