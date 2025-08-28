import React from 'react';
import { PortfolioProject } from '@/hooks/useAdminPortfolio';
import { AdminPortfolioImageUploader } from './AdminPortfolioImageUploader';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AdminPortfolioImageModalProps {
  project: PortfolioProject | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AdminPortfolioImageModal: React.FC<AdminPortfolioImageModalProps> = ({
  project,
  open,
  onOpenChange,
}) => {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciar Imagens - {project.title}</DialogTitle>
        </DialogHeader>
        <AdminPortfolioImageUploader project={project} />
      </DialogContent>
    </Dialog>
  );
};