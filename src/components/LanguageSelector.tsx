
import React from 'react';
import { Languages } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { Trans } from '@/components/Trans';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center justify-center gap-2">
      <Languages className="h-4 w-4 text-gray-600" />
      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en"><Trans text="English" /></SelectItem>
          <SelectItem value="sv"><Trans text="Svenska" /></SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
