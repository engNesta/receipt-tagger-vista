
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Building2, Eye, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useClients } from '@/contexts/ClientContext';

const ClientList = () => {
  const { clients } = useClients();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
            <p className="text-gray-600 mt-2">Manage your clients and their information</p>
          </div>
          
          <Link to="/clients/add">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Client
            </Button>
          </Link>
        </div>

        <div className="grid gap-4">
          {clients.map((client) => (
            <Card key={client.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{client.companyName}</h3>
                      <p className="text-sm text-gray-600">Reg. No: {client.registrationNumber}</p>
                      <p className="text-sm text-gray-600">{client.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => navigate(`/clients/${client.id}/months`)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Calculator className="w-4 h-4 mr-2" />
                      Starta bokföring
                    </Button>
                    <Link to={`/clients/${client.id}/view`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {clients.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No clients yet</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first client</p>
            <Link to="/clients/add">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Client
              </Button>
            </Link>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-center">
            <Link to="/clients/manage">
              <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                Manage Clients
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientList;
