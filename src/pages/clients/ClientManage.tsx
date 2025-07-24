
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useClients } from '@/contexts/ClientContext';

const ClientManage = () => {
  const navigate = useNavigate();
  const { clients, deleteClient } = useClients();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);

  const handleDeleteClick = (clientId: string) => {
    setClientToDelete(clientId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (clientToDelete) {
      deleteClient(clientToDelete);
      setDeleteDialogOpen(false);
      setClientToDelete(null);
      navigate('/clients/deleted');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setClientToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/clients')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Clients
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Clients</h1>
            <p className="text-gray-600 mt-2">Delete clients from your system</p>
          </div>
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
                  
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeleteClick(client.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {clients.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No clients to manage</h3>
            <p className="text-gray-600">There are no clients in your system yet.</p>
          </div>
        )}

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the client
                and remove all their data from your system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleDeleteCancel}>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default ClientManage;
