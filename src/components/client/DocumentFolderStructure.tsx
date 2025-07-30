
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Calendar, FolderOpen, FileText, FileImage, FileSpreadsheet } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useClientDocuments } from '@/contexts/ClientDocumentContext';
import type { Document } from '@/pages/clients/ClientView';

interface DocumentFolderStructureProps {
  clientId: string;
  onDocumentClick: (document: Document) => void;
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const categories = [
  { id: 'receipts', name: 'Receipts', icon: FileText },
  { id: 'invoices_paid', name: 'Invoices Paid', icon: FileText },
  { id: 'invoices_sent', name: 'Invoices Sent', icon: FileText },
  { id: 'bank_statements', name: 'Bank Statements', icon: FileSpreadsheet }
];

// This function is no longer used - documents come from ClientDocumentContext

const DocumentIcon: React.FC<{ type: Document['type'] }> = ({ type }) => {
  switch (type) {
    case 'pdf':
      return <FileText className="w-4 h-4 text-red-600" />;
    case 'image':
      return <FileImage className="w-4 h-4 text-blue-600" />;
    case 'excel':
      return <FileSpreadsheet className="w-4 h-4 text-green-600" />;
    default:
      return <FileText className="w-4 h-4 text-gray-600" />;
  }
};

export const DocumentFolderStructure: React.FC<DocumentFolderStructureProps> = ({ 
  clientId, 
  onDocumentClick 
}) => {
  const [openMonths, setOpenMonths] = useState<string[]>([]);
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  
  const { getDocumentsByMonthCategory } = useClientDocuments();

  const toggleMonth = (month: string) => {
    setOpenMonths(prev => 
      prev.includes(month) 
        ? prev.filter(m => m !== month)
        : [...prev, month]
    );
  };

  const toggleCategory = (monthCategory: string) => {
    setOpenCategories(prev => 
      prev.includes(monthCategory) 
        ? prev.filter(c => c !== monthCategory)
        : [...prev, monthCategory]
    );
  };

  return (
    <div className="space-y-4">
      {months.map((month) => {
        const isMonthOpen = openMonths.includes(month);
        const monthDocuments = categories.reduce((acc, category) => {
          return acc + getDocumentsByMonthCategory(clientId, month, category.id).length;
        }, 0);

        return (
          <div key={month} className="border border-gray-200 rounded-lg">
            <Collapsible open={isMonthOpen} onOpenChange={() => toggleMonth(month)}>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full justify-between p-4 h-auto hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">{month} 2024</span>
                    <Badge variant="secondary" className="text-xs">
                      {monthDocuments} documents
                    </Badge>
                  </div>
                  {isMonthOpen ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="px-4 pb-4">
                <div className="space-y-3 ml-8">
                  {categories.map((category) => {
                    const categoryKey = `${month}-${category.id}`;
                    const isCategoryOpen = openCategories.includes(categoryKey);
                    const documents = getDocumentsByMonthCategory(clientId, month, category.id);
                    const CategoryIcon = category.icon;

                    return (
                      <div key={category.id} className="border border-gray-100 rounded-md">
                        <Collapsible open={isCategoryOpen} onOpenChange={() => toggleCategory(categoryKey)}>
                          <CollapsibleTrigger asChild>
                            <Button 
                              variant="ghost" 
                              className="w-full justify-between p-3 h-auto hover:bg-gray-50"
                            >
                              <div className="flex items-center space-x-2">
                                <CategoryIcon className="w-4 h-4 text-gray-600" />
                                <span className="text-sm font-medium">{category.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {documents.length}
                                </Badge>
                              </div>
                              {isCategoryOpen ? (
                                <ChevronDown className="w-3 h-3" />
                              ) : (
                                <ChevronRight className="w-3 h-3" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          
                          <CollapsibleContent className="px-3 pb-3">
                            <div className="space-y-2 ml-6">
                              {documents.length > 0 ? (
                                documents.map((document) => (
                                  <Button
                                    key={document.id}
                                    variant="ghost"
                                    className="w-full justify-start p-2 h-auto hover:bg-blue-50"
                                    onClick={() => onDocumentClick(document)}
                                  >
                                    <div className="flex items-center space-x-2">
                                      <DocumentIcon type={document.type} />
                                      <span className="text-sm">{document.name}</span>
                                    </div>
                                  </Button>
                                ))
                              ) : (
                                <p className="text-xs text-gray-500 py-2">No documents</p>
                              )}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        );
      })}
    </div>
  );
};
