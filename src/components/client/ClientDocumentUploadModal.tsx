import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';
import { useClientDocuments } from '@/contexts/ClientDocumentContext';
import { useToast } from '@/hooks/use-toast';
import UploadSection from '@/components/UploadSection';

interface ClientDocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  onDocumentsUploaded?: () => void;
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const categories = [
  { id: 'receipts', name: 'Receipts' },
  { id: 'invoices_paid', name: 'Invoices Paid' },
  { id: 'invoices_sent', name: 'Invoices Sent' },
  { id: 'bank_statements', name: 'Bank Statements' }
];

export const ClientDocumentUploadModal: React.FC<ClientDocumentUploadModalProps> = ({
  isOpen,
  onClose,
  clientId,
  onDocumentsUploaded
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const { addDocuments } = useClientDocuments();
  const { toast } = useToast();

  const handleFileUpload = (files: File[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!selectedMonth || !selectedCategory || uploadedFiles.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select month, category, and upload at least one file.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    try {
      const documents = await addDocuments(clientId, selectedMonth, selectedCategory, uploadedFiles);
      
      toast({
        title: "Upload Successful",
        description: `${documents.length} document(s) uploaded to ${selectedMonth} - ${categories.find(c => c.id === selectedCategory)?.name}`,
      });

      // Reset form
      setSelectedMonth('');
      setSelectedCategory('');
      setUploadedFiles([]);
      
      onDocumentsUploaded?.();
      onClose();
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload documents. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setSelectedMonth('');
      setSelectedCategory('');
      setUploadedFiles([]);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>Upload Documents</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Month Selection */}
          <div className="space-y-2">
            <Label htmlFor="month">Select Month</Label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a month..." />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month} 2024
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category">Select Category</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a category..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* File Upload Area */}
          <div className="space-y-2">
            <Label>Upload Files</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                type="file"
                multiple
                accept="image/*,application/pdf,.xlsx,.xls"
                onChange={(e) => {
                  if (e.target.files) {
                    handleFileUpload(Array.from(e.target.files));
                  }
                }}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700">
                    Drop files here or click to browse
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Supports PDF, JPG, PNG, and Excel files
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Files ({uploadedFiles.length})</Label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm truncate">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      disabled={isUploading}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={handleClose} disabled={isUploading}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!selectedMonth || !selectedCategory || uploadedFiles.length === 0 || isUploading}
            >
              {isUploading ? 'Uploading...' : `Upload ${uploadedFiles.length} File(s)`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};