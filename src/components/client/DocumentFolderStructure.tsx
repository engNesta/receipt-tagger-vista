
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Calendar, FolderOpen, FileText, FileImage, FileSpreadsheet } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

// Generate dummy documents for each month/category
const generateDummyDocuments = (month: string, category: string): Document[] => {
  const documentTypes: Array<{ type: Document['type'], extension: string }> = [
    { type: 'pdf', extension: 'pdf' },
    { type: 'image', extension: 'jpg' },
    { type: 'excel', extension: 'xlsx' }
  ];

  const count = Math.floor(Math.random() * 5) + 1; // 1-5 documents per category
  
  return Array.from({ length: count }, (_, index) => {
    const docType = documentTypes[Math.floor(Math.random() * documentTypes.length)];
    return {
      id: `${month}-${category}-${index + 1}`,
      name: `${category}_${month}_${index + 1}.${docType.extension}`,
      type: docType.type,
      url: `https://via.placeholder.com/400x600/f0f0f0/666666?text=${category}_${month}_${index + 1}`,
      uploadedAt: new Date(2024, months.indexOf(month), Math.floor(Math.random() * 28) + 1)
    };
  });
};

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
          return acc + generateDummyDocuments(month, category.id).length;
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
                    const documents = generateDummyDocuments(month, category.id);
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
