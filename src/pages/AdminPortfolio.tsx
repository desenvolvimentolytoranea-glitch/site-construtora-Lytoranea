import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { useAdminPortfolioProjects, useAdminPortfolioCategories, PortfolioProject } from '@/hooks/useAdminPortfolio';
import { AdminPortfolioProjectForm } from '@/components/admin/AdminPortfolioProjectForm';
import { AdminPortfolioProjectGrid } from '@/components/admin/AdminPortfolioProjectGrid';
import { AdminPortfolioImageModal } from '@/components/admin/AdminPortfolioImageModal';
import { AdminCategoryForm } from '@/components/admin/AdminCategoryForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { LogOut, FolderOpen, Image, Grid3X3, ArrowLeft, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

const AdminPortfolio: React.FC = () => {
  const navigate = useNavigate();
  const { admin, logout, isAuthenticated, initializing, token } = useAdmin();
  const { data: projects, isLoading: loadingProjects } = useAdminPortfolioProjects();
  const { data: categories, isLoading: loadingCategories } = useAdminPortfolioCategories();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageModalProject, setImageModalProject] = useState<PortfolioProject | null>(null);

  useEffect(() => {
    if (!initializing && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, initializing, navigate]);

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (loadingProjects || loadingCategories) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalProjects = projects?.length || 0;
  const projectsWithImages = projects?.filter(p => p.main_image_url)?.length || 0;
  const projectsWithoutImages = totalProjects - projectsWithImages;
  const totalCategories = categories?.length || 0;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleEditProject = (project: PortfolioProject) => {
    setSelectedProject(project);
  };

  const handleDeleteProject = async (project: PortfolioProject) => {
    if (!isAuthenticated || !token) return;

    const { error } = await supabase.rpc('admin_delete_portfolio_project', {
      p_token: token,
      p_id: project.id,
    });

    if (error) {
      console.error('Error deleting project:', error);
      toast({
        title: 'Erro ao excluir',
        description: 'Não foi possível excluir o projeto.',
        variant: 'destructive',
      });
      return;
    }

    await queryClient.invalidateQueries({ queryKey: ['admin-portfolio-projects'] });
    await queryClient.invalidateQueries({ queryKey: ['portfolio'] });
    
    toast({
      title: 'Projeto excluído',
      description: 'O projeto foi excluído com sucesso.',
    });

    // Clear selection if the deleted project was selected
    if (selectedProject?.id === project.id) {
      setSelectedProject(null);
    }
  };

  const handleManageImages = (project: PortfolioProject) => {
    setImageModalProject(project);
    setImageModalOpen(true);
  };

  const handleNewProject = () => {
    setSelectedProject(null);
  };

  const handleProjectSaved = () => {
    setSelectedProject(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="sm">
              <Link to="/admin">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Painel
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Administração do Portfólio</h1>
              <p className="text-muted-foreground">
                Bem-vindo, <span className="font-medium">{admin?.name}</span>
              </p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Projetos</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProjects}</div>
              <p className="text-xs text-muted-foreground">
                {totalProjects === 1 ? 'projeto cadastrado' : 'projetos cadastrados'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Com Imagem Principal</CardTitle>
              <Image className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{projectsWithImages}</div>
              <p className="text-xs text-muted-foreground">
                projetos com imagem principal
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sem Imagem Principal</CardTitle>
              <Image className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{projectsWithoutImages}</div>
              <p className="text-xs text-muted-foreground">
                projetos necessitam de imagem
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categorias</CardTitle>
              <Grid3X3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCategories}</div>
              <p className="text-xs text-muted-foreground">
                categorias disponíveis
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Project Management */}
        <div className="space-y-8">
          {/* Project Form */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Gerenciar Projetos</h2>
            <Button onClick={handleNewProject} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Novo Projeto
            </Button>
          </div>
          
          <AdminPortfolioProjectForm 
            selectedProject={selectedProject}
            onProjectSaved={handleProjectSaved}
          />
          
          <Separator />
          
          {/* Projects Grid */}
          <AdminPortfolioProjectGrid
            projects={projects || []}
            onEdit={handleEditProject}
            onDelete={handleDeleteProject}
            onManageImages={handleManageImages}
          />

          <Separator />
          
          {/* Categories Management */}
          <AdminCategoryForm />
        </div>

        {/* Image Management Modal */}
        <AdminPortfolioImageModal
          project={imageModalProject}
          open={imageModalOpen}
          onOpenChange={setImageModalOpen}
        />
      </div>
    </div>
  );
};

export default AdminPortfolio;