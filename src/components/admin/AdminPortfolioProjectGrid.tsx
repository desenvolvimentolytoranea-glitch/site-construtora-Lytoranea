import React, { useState } from 'react';
import { PortfolioProject } from '@/hooks/useAdminPortfolio';
import { AdminPortfolioProjectCard } from './AdminPortfolioProjectCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FolderOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface AdminPortfolioProjectGridProps {
  projects: PortfolioProject[];
  onEdit: (project: PortfolioProject) => void;
  onDelete: (project: PortfolioProject) => void;
  onManageImages: (project: PortfolioProject) => void;
}

const PROJECTS_PER_PAGE = 9;

export const AdminPortfolioProjectGrid: React.FC<AdminPortfolioProjectGridProps> = ({
  projects,
  onEdit,
  onDelete,
  onManageImages,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [projectToDelete, setProjectToDelete] = useState<PortfolioProject | null>(null);

  const totalPages = Math.ceil(projects.length / PROJECTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
  const endIndex = startIndex + PROJECTS_PER_PAGE;
  const currentProjects = projects.slice(startIndex, endIndex);

  const handleDeleteClick = (project: PortfolioProject) => {
    setProjectToDelete(project);
  };

  const handleConfirmDelete = () => {
    if (projectToDelete) {
      onDelete(projectToDelete);
      setProjectToDelete(null);
    }
  };

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">Nenhum projeto cadastrado</h3>
              <p className="text-muted-foreground">
                Crie seu primeiro projeto do portfólio usando o formulário acima.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Projetos do Portfólio</h2>
          <p className="text-muted-foreground">
            {projects.length} {projects.length === 1 ? 'projeto' : 'projetos'} cadastrados
          </p>
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentProjects.map((project) => (
          <AdminPortfolioProjectCard
            key={project.id}
            project={project}
            onEdit={onEdit}
            onDelete={handleDeleteClick}
            onManageImages={onManageImages}
          />
        ))}
      </div>

      <AlertDialog open={!!projectToDelete} onOpenChange={() => setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o projeto "{projectToDelete?.title}"?
              Esta ação não pode ser desfeita e todas as imagens associadas também serão removidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir projeto
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};