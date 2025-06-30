
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Toaster />
      </Router>
    </LanguageProvider>
  );
}

export default App;
