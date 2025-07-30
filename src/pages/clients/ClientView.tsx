
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Mail, Hash, FolderOpen, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useClients } from '@/contexts/ClientContext';
import { DocumentFolderStructure } from '@/components/client/DocumentFolderStructure';
import { DocumentPreviewModal } from '@/components/client/DocumentPreviewModal';
import { ClientDocumentUploadModal } from '@/components/client/ClientDocumentUploadModal';

export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'excel';
  url: string;
  uploadedAt: Date;
}

const ClientView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { clients } = useClients();
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const client = clients.find(c => c.id === id);

  const handleDocumentClick = (document: Document) => {
    setSelectedDocument(document);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setSelectedDocument(null);
  };

  const handleDocumentsUploaded = () => {
    setRefreshKey(prev => prev + 1); // Force refresh of folder structure
  };

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
      <div className="max-w-7xl mx-auto px-4 py-8">
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
              <p className="text-gray-600 mt-1">Document Folder View</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Client Info Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Client Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Building2 className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Company</p>
                    <p className="font-medium">{client.companyName}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Hash className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Reg. Number</p>
                    <p className="font-medium">{client.registrationNumber}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{client.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Document Folder Structure */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FolderOpen className="w-5 h-5" />
                    <span>Document Folders - 2024</span>
                  </div>
                  <Button onClick={() => setIsUploadModalOpen(true)}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Documents
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DocumentFolderStructure 
                  key={refreshKey}
                  clientId={id!}
                  onDocumentClick={handleDocumentClick}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Document Preview Modal */}
        <DocumentPreviewModal
          document={selectedDocument}
          isOpen={isPreviewOpen}
          onClose={closePreview}
        />

        {/* Document Upload Modal */}
        <ClientDocumentUploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          clientId={id!}
          onDocumentsUploaded={handleDocumentsUploaded}
        />
      </div>
    </div>
  );
};

export default ClientView;
