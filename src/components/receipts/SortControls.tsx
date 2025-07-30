
import React from 'react';
import { ArrowUpAZ, ArrowDownZA } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Trans } from '@/components/Trans';

interface SortControlsProps {
  selectedTag: string | null;
  sortOrder: 'asc' | 'desc' | null;
  onSortClick: (order: 'asc' | 'desc') => void;
}

const SortControls: React.FC<SortControlsProps> = ({ selectedTag, sortOrder, onSortClick }) => {

  if (!selectedTag) return null;

  return (
    <div className="flex gap-2 mb-6">
      <Button
        variant={sortOrder === 'asc' ? "default" : "outline"}
        onClick={() => onSortClick('asc')}
        className="flex items-center gap-2"
        size="sm"
      >
        <ArrowUpAZ size={16} />
        <Trans text="Ascending" />
      </Button>
      <Button
        variant={sortOrder === 'desc' ? "default" : "outline"}
        onClick={() => onSortClick('desc')}
        className="flex items-center gap-2"
        size="sm"
      >
        <ArrowDownZA size={16} />
        <Trans text="Descending" />
      </Button>
    </div>
  );
};

export default SortControls;
