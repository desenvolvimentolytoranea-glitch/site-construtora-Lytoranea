
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Check, AlertCircle } from 'lucide-react';
import { createAdminClient } from '@/integrations/supabase/adminClient';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import type { Service } from '@/hooks/useServices';
import { useAdmin } from '@/contexts/AdminContext';
import { toStorageSafeBase } from '@/lib/utils';

interface ServiceImageUploaderProps {
  service: Service;
}

export const ServiceImageUploader: React.FC<ServiceImageUploaderProps> = ({ service }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { token, isAuthenticated } = useAdmin();

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
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      const fileExt = (file.name.split('.').pop() || 'jpg').toLowerCase();
      const safeSlug = toStorageSafeBase(service.slug || 'servico');
      const fileName = `${safeSlug}-${Date.now()}.${fileExt}`;

      const adminClient = createAdminClient();
      
      const { error: uploadError } = await adminClient.storage
        .from('services')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = adminClient.storage
        .from('services')
        .getPublicUrl(fileName);

      // Usa RPC com token de sessão admin
      const { error: rpcError } = await adminClient.rpc('admin_update_service_image', {
        p_token: token,
        p_service_id: service.id,
        p_image_url: publicUrl,
      });

      if (rpcError) {
        throw rpcError;
      }

      // Remove imagem antiga se houver
      if (service.image_url) {
        const oldFileName = service.image_url.split('/').pop();
        if (oldFileName && oldFileName !== fileName) {
          await adminClient.storage.from('services').remove([oldFileName]);
        }
      }

      queryClient.invalidateQueries({ queryKey: ['services'] });

      toast({
        title: 'Imagem atualizada com sucesso!',
        description: 'A imagem foi enviada e já está disponível no site.',
      });

      setTimeout(() => {
        setPreview(null);
        URL.revokeObjectURL(previewUrl);
      }, 2000);

    } catch (error) {
      const message = (error as any)?.message?.toString() || '';
      const isInvalidKey = /invalidkey|invalid key/i.test(message);
      toast({
        title: 'Erro no upload',
        description: isInvalidKey
          ? 'O nome do arquivo era inválido para o Storage. Tente novamente; agora sanitizamos os nomes automaticamente.'
          : 'Não foi possível enviar a imagem. Tente novamente.',
        variant: 'destructive',
      });
      
      if (preview) {
        URL.revokeObjectURL(preview);
        setPreview(null);
      }
    } finally {
      setUploading(false);
    }
  }, [service, toast, queryClient, preview, isAuthenticated, token]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    disabled: uploading
  });

  const removeImage = async () => {
    if (!service.image_url) return;
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
      const fileName = service.image_url.split('/').pop();
      if (fileName) {
        await adminClient.storage.from('services').remove([fileName]);
      }

      const { error: rpcError } = await adminClient.rpc('admin_remove_service_image', {
        p_token: token,
        p_service_id: service.id,
      });

      if (rpcError) throw rpcError;

      queryClient.invalidateQueries({ queryKey: ['services'] });

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

  return (
    <div className="space-y-4">
      {(service.image_url || preview) && (
        <div className="relative">
          <img
            src={preview || service.image_url || ''}
            alt={service.title}
            className="w-full h-32 object-cover rounded-md border"
          />
          {!uploading && !preview && (
            <Button
              onClick={removeImage}
              size="sm"
              variant="destructive"
              className="absolute top-2 right-2"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/50 rounded-md flex items-center justify-center">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto mb-2"></div>
                <p className="text-sm">Enviando...</p>
              </div>
            </div>
          )}
          {preview && !uploading && (
            <div className="absolute inset-0 bg-green-500/20 rounded-md flex items-center justify-center">
              <Check className="w-8 h-8 text-green-600" />
            </div>
          )}
        </div>
      )}

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
                  <p className="text-sm text-foreground">
                    {service.image_url ? 'Substituir imagem' : 'Adicionar imagem'}
                  </p>
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

      {!service.image_url && !preview && (
        <div className="flex items-center gap-2 text-amber-600">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">Sem imagem</span>
        </div>
      )}
    </div>
  );
};
