
import React from 'react';
import { FileText, DollarSign, Package, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface TagFiltersProps {
  selectedTag: string | null;
  onTagClick: (tagKey: string) => void;
}

const TagFilters: React.FC<TagFiltersProps> = ({ selectedTag, onTagClick }) => {
  const { getText } = useLanguage();

  const tags = [
    { name: getText('vendor'), icon: FileText, key: 'vendor' },
    { name: getText('price'), icon: DollarSign, key: 'price' },
    { name: getText('productName'), icon: Package, key: 'productName' },
    { name: getText('verificationLetter'), icon: CheckCircle, key: 'verificationLetter' }
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {tags.map((tag) => {
        const IconComponent = tag.icon;
        return (
          <Button
            key={tag.key}
            variant={selectedTag === tag.key ? "default" : "outline"}
            onClick={() => onTagClick(tag.key)}
            className="flex items-center gap-2 transition-all duration-200 hover:scale-105"
          >
            <IconComponent size={16} />
            {tag.name}
          </Button>
        );
      })}
    </div>
  );
};

export default TagFilters;
