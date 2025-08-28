
import React, { useEffect, useState, useCallback } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { PortfolioProject, useAdminPortfolioCategories } from '@/hooks/useAdminPortfolio';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useDropzone } from 'react-dropzone';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createAdminClient } from '@/integrations/supabase/adminClient';
import { Upload, X, Trash2 } from 'lucide-react';

interface AdminPortfolioProjectFormProps {
  selectedProject?: PortfolioProject | null;
  onProjectSaved?: () => void;
}

export const AdminPortfolioProjectForm: React.FC<AdminPortfolioProjectFormProps> = ({
  selectedProject,
  onProjectSaved,
}) => {
  const { token, isAuthenticated } = useAdmin();
  const { data: categories } = useAdminPortfolioCategories();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [uploading, setUploading] = useState(false);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [location, setLocation] = useState('');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');
  const [client, setClient] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [mainImageUrl, setMainImageUrl] = useState('');

  useEffect(() => {
    if (selectedProject) {
      setTitle(selectedProject.title || '');
      setSlug(selectedProject.slug || '');
      setLocation(selectedProject.location || '');
      setYear(selectedProject.year || '');
      setDescription(selectedProject.description || '');
      setClient(selectedProject.client || '');
      setCategoryId(selectedProject.category_id || '');
      setMainImageUrl(selectedProject.main_image_url || '');
    } else {
      setTitle('');
      setSlug('');
      setLocation('');
      setYear('');
      setDescription('');
      setClient('');
      setCategoryId('');
      setMainImageUrl('');
    }
  }, [selectedProject]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !token) {
      toast({
        title: 'Acesso negado',
        description: 'Faça login como administrador.',
        variant: 'destructive',
      });
      return;
    }

    if (!categoryId) {
      toast({
        title: 'Categoria obrigatória',
        description: 'Selecione uma categoria para o projeto.',
        variant: 'destructive',
      });
      return;
    }

    const payload = {
      p_token: token,
      p_id: selectedProject ? selectedProject.id : null,
      p_category_id: categoryId,
      p_title: title,
      p_slug: slug,
      p_location: location,
      p_year: year,
      p_description: description || null,
      p_client: client || null,
      p_main_image_url: mainImageUrl || null,
    };

    const { error } = await supabase.rpc('admin_upsert_portfolio_project', payload);
    if (error) {
      console.error('Erro ao salvar projeto:', error);
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar o projeto.',
        variant: 'destructive',
      });
      return;
    }

    await queryClient.invalidateQueries({ queryKey: ['admin-portfolio-projects'] });
    await queryClient.invalidateQueries({ queryKey: ['portfolio'] });
    toast({
      title: 'Projeto salvo',
      description: selectedProject ? 'Projeto atualizado com sucesso.' : 'Projeto criado com sucesso.',
    });
    
    if (!selectedProject) {
      // Reset form after creating new project
      setTitle('');
      setSlug('');
      setLocation('');
      setYear('');
      setDescription('');
      setClient('');
      setCategoryId('');
      setMainImageUrl('');
    }
    
    onProjectSaved?.();
  };

  const handleDelete = async () => {
    if (!selectedProject || !isAuthenticated || !token) return;

    const { error } = await supabase.rpc('admin_delete_portfolio_project', {
      p_token: token,
      p_id: selectedProject.id,
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

    // Reset form
    setTitle('');
    setSlug('');
    setLocation('');
    setYear('');
    setDescription('');
    setClient('');
    setCategoryId('');
    setMainImageUrl('');
    
    onProjectSaved?.();
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!isAuthenticated || !token) {
      toast({
        title: 'Acesso negado',
        description: 'Faça login como administrador para enviar imagens.',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Arquivo muito grande',
        description: 'O arquivo deve ter no máximo 5MB',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `main-${Date.now()}.${fileExt}`;

      const adminClient = createAdminClient();
      
      const { error: uploadError } = await adminClient.storage
        .from('portfolio')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = adminClient.storage
        .from('portfolio')
        .getPublicUrl(fileName);

      setMainImageUrl(publicUrl);
      
      toast({
        title: 'Imagem enviada!',
        description: 'A imagem principal foi enviada com sucesso.',
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Erro no upload',
        description: 'Não foi possível enviar a imagem. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  }, [toast, isAuthenticated, token]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    disabled: uploading
  });

  const removeMainImage = () => {
    setMainImageUrl('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {selectedProject ? 'Editar Projeto' : 'Novo Projeto'}
          {selectedProject && (
            <Button
              type="button"
              onClick={handleDelete}
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm text-muted-foreground">Categoria</label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Selecione uma categoria..." />
              </SelectTrigger>
              <SelectContent className="bg-background border z-50">
                {(categories || []).map((category) => (
                  <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">Título</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Slug</label>
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">Localização</label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Ano</label>
              <Input value={year} onChange={(e) => setYear(e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Cliente</label>
            <Input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Opcional" />
          </div>

          {/* Image Upload Section */}
          <div className="space-y-4">
            <label className="text-sm text-muted-foreground">Imagem Principal</label>
            
            {mainImageUrl ? (
              <div className="relative">
                <img
                  src={mainImageUrl}
                  alt="Imagem principal"
                  className="w-full h-48 object-cover rounded-md border"
                />
                <Button
                  type="button"
                  onClick={removeMainImage}
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                  ${isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary'}
                  ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <input {...getInputProps()} />
                
                <div className="space-y-2">
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="text-sm text-muted-foreground">Enviando imagem...</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
                      {isDragActive ? (
                        <p className="text-sm text-primary">Solte a imagem aqui...</p>
                      ) : (
                        <>
                          <p className="text-sm text-foreground">Adicionar imagem principal</p>
                          <p className="text-xs text-muted-foreground">
                            Arraste e solte ou clique para selecionar
                          </p>
                          <p className="text-xs text-muted-foreground">
                            JPG, PNG ou WebP (máx. 5MB)
                          </p>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Descrição</label>
            <Textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              rows={4}
              placeholder="Descrição detalhada do projeto..." 
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit">
              {selectedProject ? 'Salvar alterações' : 'Criar projeto'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
