
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { useServices } from '@/hooks/useServices';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useAdminClients } from '@/hooks/useAdminClients';
import { AdminServiceForm } from '@/components/admin/AdminServiceForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { LogOut, Wrench, FolderOpen, Users, Star, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { admin, logout, isAuthenticated, initializing } = useAdmin();
  const { data: services, isLoading: loadingServices } = useServices();
  const { data: portfolioData, isLoading: loadingPortfolio } = usePortfolio();
  const { clients, isLoading: loadingClients } = useAdminClients();

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

  if (loadingServices || loadingPortfolio || loadingClients) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalServices = services?.length || 0;
  const totalProjects = portfolioData?.length || 0;
  const totalClients = clients?.length || 0;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Painel Administrativo</h1>
            <p className="text-muted-foreground">
              Bem-vindo, <span className="font-medium">{admin?.name}</span>
            </p>
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
              <CardTitle className="text-sm font-medium">Total de Serviços</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalServices}</div>
              <p className="text-xs text-muted-foreground">
                {totalServices === 1 ? 'serviço cadastrado' : 'serviços cadastrados'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projetos no Portfólio</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProjects}</div>
              <p className="text-xs text-muted-foreground">
                {totalProjects === 1 ? 'projeto no portfólio' : 'projetos no portfólio'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Principais Clientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClients}</div>
              <p className="text-xs text-muted-foreground">
                {totalClients === 1 ? 'cliente cadastrado' : 'clientes cadastrados'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avaliação</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8</div>
              <p className="text-xs text-muted-foreground">satisfação dos clientes</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Conteúdo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full justify-start">
                <Link to="/admin/portfolio">
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Administrar Portfólio
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/admin/clients">
                  <Users className="w-4 h-4 mr-2" />
                  Administrar Clientes
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground">
                Gerencie projetos do portfólio, categorias, imagens e clientes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Links Úteis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/" target="_blank">
                  Ver Site Público
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/portfolio" target="_blank">
                  Ver Portfólio
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Separator className="mb-8" />

        {/* Services Management */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Gerenciar Serviços</h2>
          <AdminServiceForm />
        </div>
      </div>
    </div>
  );
};

export default Admin;
