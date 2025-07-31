import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClients } from '@/contexts/ClientContext';
import { useAccountingWizard } from '@/contexts/AccountingWizardContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar } from 'lucide-react';
import WizardProgressBar from '@/components/accounting/WizardProgressBar';
import TolkaStep from '@/components/accounting/steps/TolkaStep';
import IdentifieraStep from '@/components/accounting/steps/IdentifieraStep';
import BokforaStep from '@/components/accounting/steps/BokforaStep';
import type { ProcessingStep } from '@/types/accounting';

const AccountingWizard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { clients } = useClients();
  const { session, initializeSession, setCurrentStep } = useAccountingWizard();

  const client = clients.find(c => c.id === id);
  const currentMonth = new Date().toLocaleDateString('sv-SE', { year: 'numeric', month: 'long' });

  useEffect(() => {
    if (id && !session) {
      initializeSession(id, currentMonth);
    }
  }, [id, session, initializeSession, currentMonth]);

  if (!client) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Klient hittades inte</h2>
            <Button onClick={() => navigate('/clients')}>
              Tillbaka till klientlista
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Laddar session...</p>
        </div>
      </div>
    );
  }

  const handleStepClick = (stepId: ProcessingStep['id']) => {
    setCurrentStep(stepId);
  };

  const renderCurrentStep = () => {
    switch (session.currentStep) {
      case 'tolka':
        return <TolkaStep />;
      case 'identifiera':
        return <IdentifieraStep />;
      case 'bokfora':
        return <BokforaStep />;
      default:
        return <TolkaStep />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/clients')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Tillbaka
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{client.companyName}</h1>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {currentMonth}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <WizardProgressBar 
            currentStep={session.currentStep} 
            onStepClick={handleStepClick}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default AccountingWizard;