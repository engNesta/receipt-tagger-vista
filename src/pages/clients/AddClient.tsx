
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useClients } from '@/contexts/ClientContext';

// Dummy Fortnox client data
const mockFortnoxClients = [
  {
    id: 'FTX001',
    name: 'Tech Solutions AB',
    organisationNumber: '556123-4567',
    email: 'info@techsolutions.se',
    address: 'Storgatan 15, Stockholm',
    vatNumber: 'SE556123456701',
    status: 'Active'
  },
  {
    id: 'FTX002', 
    name: 'Nordic Design Studio',
    organisationNumber: '556789-0123',
    email: 'hello@nordicdesign.se',
    address: 'Kungsgatan 42, Göteborg',
    vatNumber: 'SE556789012301',
    status: 'Active'
  },
  {
    id: 'FTX003',
    name: 'Green Energy Solutions',
    organisationNumber: '556456-7890',
    email: 'contact@greenenergy.se',
    address: 'Eco Street 8, Malmö',
    vatNumber: 'SE556456789001',
    status: 'Active'
  },
  {
    id: 'FTX004',
    name: 'Digital Marketing Pro',
    organisationNumber: '556234-5678',
    email: 'team@digitalmarketing.se',
    address: 'Medievägen 12, Stockholm',
    vatNumber: 'SE556234567801',
    status: 'Inactive'
  },
  {
    id: 'FTX005',
    name: 'Consulting Partners',
    organisationNumber: '556345-6789',
    email: 'info@consultingpartners.se',
    address: 'Business Park 5, Uppsala',
    vatNumber: 'SE556345678901',
    status: 'Active'
  }
];

const AddClient = () => {
  const navigate = useNavigate();
  const { addClient } = useClients();
  const [isLoading, setIsLoading] = useState(true);
  const [fortnoxClients, setFortnoxClients] = useState(mockFortnoxClients);

  // Simulate fetching clients from Fortnox
  useEffect(() => {
    const fetchFortnoxClients = async () => {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setFortnoxClients(mockFortnoxClients);
      setIsLoading(false);
    };

    fetchFortnoxClients();
  }, []);

  const handleAddClient = (fortnoxClient: typeof mockFortnoxClients[0]) => {
    const newClient = {
      companyName: fortnoxClient.name,
      registrationNumber: fortnoxClient.organisationNumber,
      email: fortnoxClient.email
    };
    addClient(newClient);
    navigate('/clients/created');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/clients')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Clients
          </Button>
          
          <div className="text-center">
            <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4">
              <Building2 className="w-8 h-8 text-blue-600 mx-auto" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Import Clients from Fortnox</h1>
            <p className="text-gray-600 mt-2">Select clients to import from your Fortnox account</p>
          </div>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                <span className="text-gray-600">Fetching clients from Fortnox...</span>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Available Clients ({fortnoxClients.length})
              </h2>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Fortnox Connected
              </Badge>
            </div>

            <div className="grid gap-4">
              {fortnoxClients.map((client) => (
                <Card key={client.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">{client.name}</h3>
                          <Badge 
                            variant={client.status === 'Active' ? 'default' : 'secondary'}
                            className={client.status === 'Active' ? 'bg-green-100 text-green-800 border-green-200' : ''}
                          >
                            {client.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Org Nr:</span> {client.organisationNumber}
                          </div>
                          <div>
                            <span className="font-medium">Email:</span> {client.email}
                          </div>
                          <div>
                            <span className="font-medium">Address:</span> {client.address}
                          </div>
                          <div>
                            <span className="font-medium">VAT:</span> {client.vatNumber}
                          </div>
                        </div>
                      </div>
                      <div className="ml-4">
                        <Button 
                          onClick={() => handleAddClient(client)}
                          disabled={client.status !== 'Active'}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Import Client
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {fortnoxClients.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
                  <p className="text-gray-600">No clients were found in your Fortnox account.</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddClient;
