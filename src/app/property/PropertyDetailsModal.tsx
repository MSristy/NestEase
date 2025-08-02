import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface PropertyDetailsModalProps {
  open: boolean;
  onClose: () => void;
  loading: boolean;
}

const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({ open, onClose, loading }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full">
        <DialogHeader>
          <DialogTitle>Property Details</DialogTitle>
          <DialogDescription>
            View detailed information about this property
          </DialogDescription>
        </DialogHeader>
        {loading ? (
          // ... existing code ...
        ) : (
          // ... existing code ...
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PropertyDetailsModal; 