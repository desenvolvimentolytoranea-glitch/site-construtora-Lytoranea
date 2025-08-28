
import React from 'react';
import { PortfolioProject } from '@/hooks/useAdminPortfolio';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Images, MapPin, Calendar } from 'lucide-react';

interface AdminPortfolioProjectCardProps {
  project: PortfolioProject;
  onEdit: (project: PortfolioProject) => void;
  onDelete: (project: PortfolioProject) => void;
  onManageImages: (project: PortfolioProject) => void;
}

export const AdminPortfolioProjectCard: React.FC<AdminPortfolioProjectCardProps> = ({
  project,
  onEdit,
  onDelete,
  onManageImages,
}) => {
  const categoryLabel = project.services?.title || project.portfolio_categories?.name || 'Sem categoria';

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        {/* Image */}
        <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden rounded-t-lg">
          {project.main_image_url ? (
            <img
              src={project.main_image_url}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-muted-foreground text-sm">Sem imagem</div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{project.title}</h3>
            <p className="text-sm text-primary font-medium">{categoryLabel}</p>
          </div>

          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3" />
              <span className="line-clamp-1">{project.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              <span>{project.year}</span>
            </div>
            {project.client && (
              <div className="text-xs">
                <strong>Cliente:</strong> {project.client}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => onEdit(project)}
              size="sm"
              variant="outline"
              className="flex-1"
            >
              <Edit className="w-3 h-3 mr-1" />
              Editar
            </Button>
            <Button
              onClick={() => onManageImages(project)}
              size="sm"
              variant="outline"
            >
              <Images className="w-3 h-3" />
            </Button>
            <Button
              onClick={() => onDelete(project)}
              size="sm"
              variant="outline"
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
