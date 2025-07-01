
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import { useImageCleanup } from '@/hooks/useImageCleanup';

interface CleanupButtonProps {
  onCleanupComplete?: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

const CleanupButton: React.FC<CleanupButtonProps> = ({ 
  onCleanupComplete, 
  variant = 'outline',
  size = 'default'
}) => {
  const { isCleaningUp, runCleanup } = useImageCleanup();

  const handleCleanup = async () => {
    const result = await runCleanup('manual');
    
    if (result.success && onCleanupComplete) {
      onCleanupComplete();
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCleanup}
      disabled={isCleaningUp}
      className="flex items-center gap-2"
    >
      {isCleaningUp ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
      {isCleaningUp ? 'Cleaning...' : 'Clean Up Invalid Images'}
    </Button>
  );
};

export default CleanupButton;
