import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Check, AlertCircle, Image as ImageIcon, Star } from 'lucide-react';
import { createAdminClient } from '@/integrations/supabase/adminClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { usePortfolioImages, PortfolioProject } from '@/hooks/useAdminPortfolio';
import { useAdmin } from '@/contexts/AdminContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toStorageSafeBase } from '@/lib/utils';

interface AdminPortfolioImageUploaderProps {
  project: PortfolioProject;
}

export const AdminPortfolioImageUploader: React.FC<AdminPortfolioImageUploaderProps> = ({ project }) => {
  const [uploading, setUploading] = useState(false);
  const [altText, setAltText] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { token, isAuthenticated } = useAdmin();
  const { data: images = [] } = usePortfolioImages(project.id);

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
      const fileExt = (file.name.split('.').pop() || 'jpg').toLowerCase();
      const safeSlug = toStorageSafeBase(project.slug || 'projeto');
      const fileName = `${safeSlug}-${Date.now()}.${fileExt}`;

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

      const { error: rpcError } = await adminClient.rpc('admin_add_portfolio_image', {
        p_token: token,
        p_project_id: project.id,
        p_image_url: publicUrl,
        p_alt_text: altText || null,
        p_is_main: images.length === 0, // First image is main by default
        p_display_order: displayOrder || images.length,
      });

      if (rpcError) {
        throw rpcError;
      }

      await queryClient.invalidateQueries({ queryKey: ['portfolio-images', project.id] });
      await queryClient.invalidateQueries({ queryKey: ['admin-portfolio-projects'] });

      toast({
        title: 'Imagem adicionada com sucesso!',
        description: 'A imagem foi enviada e já está disponível no projeto.',
      });

      setAltText('');
      setDisplayOrder(0);

    } catch (error) {
      console.error('Upload error:', error);
      const message = (error as any)?.message?.toString() || '';
      const isInvalidKey = /invalidkey|invalid key/i.test(message);
      toast({
        title: 'Erro no upload',
        description: isInvalidKey
          ? 'O nome do arquivo era inválido para o Storage. Tente novamente; agora sanitizamos os nomes automaticamente.'
          : 'Não foi possível enviar a imagem. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  }, [project, toast, queryClient, isAuthenticated, token, altText, displayOrder, images.length]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    disabled: uploading
  });

  const removeImage = async (imageId: string) => {
    if (!isAuthenticated || !token) {
      toast({
        title: 'Acesso negado',
        description: 'Faça login como administrador para remover imagens.',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    const adminClient = createAdminClient();
    
    try {
      const image = images.find(img => img.id === imageId);
      if (image) {
        const fileName = image.image_url.split('/').pop();
        if (fileName) {
          await adminClient.storage.from('portfolio').remove([fileName]);
        }
      }

      const { error: rpcError } = await adminClient.rpc('admin_delete_portfolio_image', {
        p_token: token,
        p_image_id: imageId,
      });

      if (rpcError) throw rpcError;

      await queryClient.invalidateQueries({ queryKey: ['portfolio-images', project.id] });
      await queryClient.invalidateQueries({ queryKey: ['admin-portfolio-projects'] });

      toast({
        title: 'Imagem removida',
        description: 'A imagem foi removida com sucesso.',
      });

    } catch (error) {
      console.error('Remove error:', error);
      toast({
        title: 'Erro ao remover',
        description: 'Não foi possível remover a imagem.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const setMainImage = async (imageId: string) => {
    if (!isAuthenticated || !token) return;

    try {
      const adminClient = createAdminClient();
      const { error } = await adminClient.rpc('admin_set_main_portfolio_image', {
        p_token: token,
        p_image_id: imageId,
      });

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['portfolio-images', project.id] });
      await queryClient.invalidateQueries({ queryKey: ['admin-portfolio-projects'] });

      toast({
        title: 'Imagem principal atualizada',
        description: 'A imagem principal foi alterada com sucesso.',
      });

    } catch (error) {
      console.error('Set main image error:', error);
      toast({
        title: 'Erro ao definir imagem principal',
        description: 'Não foi possível alterar a imagem principal.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Galeria do Projeto: {project.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Existing Images */}
        {images.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">
              Imagens Existentes ({images.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.image_url}
                    alt={image.alt_text || 'Portfolio image'}
                    className="w-full h-32 object-cover rounded-md border"
                  />
                  {image.is_main && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Principal
                    </div>
                  )}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    {!image.is_main && (
                      <Button
                        onClick={() => setMainImage(image.id)}
                        size="sm"
                        variant="secondary"
                        className="h-6 w-6 p-0"
                      >
                        <Star className="w-3 h-3" />
                      </Button>
                    )}
                    <Button
                      onClick={() => removeImage(image.id)}
                      size="sm"
                      variant="destructive"
                      className="h-6 w-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  {image.alt_text && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-xs">
                      {image.alt_text}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Form */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">
            Adicionar Nova Imagem
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">Texto Alternativo</label>
              <Input 
                value={altText} 
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Descrição da imagem para acessibilidade..."
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Ordem de Exibição</label>
              <Input 
                type="number"
                value={displayOrder} 
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
          </div>

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
                      <p className="text-sm text-foreground">Adicionar imagem ao projeto</p>
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
        </div>

        {images.length === 0 && (
          <div className="flex items-center gap-2 text-amber-600">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">Nenhuma imagem adicionada ao projeto</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
