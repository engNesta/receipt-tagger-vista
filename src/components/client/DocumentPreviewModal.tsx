
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, FileText, Calendar, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import FileViewer from '@/components/ui/file-viewer';
import type { Document } from '@/pages/clients/ClientView';

interface DocumentPreviewModalProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
}

const getFileTypeColor = (type: Document['type']) => {
  switch (type) {
    case 'pdf':
      return 'bg-red-100 text-red-800';
    case 'image':
      return 'bg-blue-100 text-blue-800';
    case 'excel':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getFileTypeLabel = (type: Document['type']) => {
  switch (type) {
    case 'pdf':
      return 'PDF Document';
    case 'image':
      return 'Image';
    case 'excel':
      return 'Excel Spreadsheet';
    default:
      return 'Document';
  }
};

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document,
  isOpen,
  onClose
}) => {
  if (!document) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5" />
              <span className="truncate">{document.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getFileTypeColor(document.type)}>
                {getFileTypeLabel(document.type)}
              </Badge>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Document Preview */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 rounded-lg p-4 h-full min-h-[400px]">
              <FileViewer
                src={document.url}
                alt={document.name}
                className="w-full h-full"
                aspectRatio="aspect-[3/4]"
                fallbackContent={
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <div className="bg-gray-100 rounded-full p-6 mb-4">
                      <FileText className="w-12 h-12" />
                    </div>
                    <p className="text-lg font-medium mb-2">{getFileTypeLabel(document.type)}</p>
                    <p className="text-sm text-center">{document.name}</p>
                  </div>
                }
              />
            </div>
          </div>

          {/* Document Details */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Document Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">File Name</p>
                    <p className="font-medium">{document.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Upload Date</p>
                    <p className="font-medium">{document.uploadedAt.toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">File Type</p>
                    <p className="font-medium">{getFileTypeLabel(document.type)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">Actions</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Download Original
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
