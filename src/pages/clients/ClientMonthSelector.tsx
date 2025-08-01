import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Calendar, Eye, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useClients } from '@/contexts/ClientContext';

const ClientMonthSelector = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { clients } = useClients();
  
  const client = clients.find(c => c.id === id);
  
  // Generate last 12 months
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return {
      value: date.toISOString().slice(0, 7), // YYYY-MM format
      display: date.toLocaleDateString('sv-SE', { year: 'numeric', month: 'long' }),
      year: date.getFullYear(),
      month: date.getMonth() + 1
    };
  });

  const handleStartBookkeeping = (monthValue: string, monthDisplay: string) => {
    navigate(`/accounting/${id}?month=${monthValue}&monthDisplay=${encodeURIComponent(monthDisplay)}`);
  };

  const handleViewSummary = (monthValue: string) => {
    navigate(`/clients/${id}/summary?month=${monthValue}`);
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/clients')}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Tillbaka till klientlista
          </Button>
          
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{client.companyName}</h1>
              <p className="text-gray-600 mt-1">Välj månad för bokföring</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {months.map((month) => (
            <Card key={month.value} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  {month.display}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600">
                  <p>Status: Inte påbörjad</p>
                  <p>Kvitton: 0</p>
                  <p>Transaktioner: 0</p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleStartBookkeeping(month.value, month.display)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    size="sm"
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Starta bokföring
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => handleViewSummary(month.value)}
                    size="sm"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientMonthSelector;