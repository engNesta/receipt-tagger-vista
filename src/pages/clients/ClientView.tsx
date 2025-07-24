
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Mail, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useClients } from '@/contexts/ClientContext';

const ClientView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { clients } = useClients();
  
  const client = clients.find(c => c.id === id);

  if (!client) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Client Not Found</h1>
          <Button onClick={() => navigate('/clients')}>
            Back to Clients
          </Button>
        </div>
      </div>
    );
  }

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
          
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{client.companyName}</h1>
              <p className="text-gray-600 mt-1">Client Details</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Building2 className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Company Name</p>
                  <p className="font-medium">{client.companyName}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Hash className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Registration Number</p>
                  <p className="font-medium">{client.registrationNumber}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-medium">{client.email}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-medium">{client.createdAt.toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientView;
