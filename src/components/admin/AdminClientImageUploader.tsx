import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useAdminClients } from '@/hooks/useAdminClients';
import { Client } from '@/hooks/useClients';
import { toast } from 'sonner';

interface AdminClientImageUploaderProps {
  client: Client;
  onLogoUpdate?: (logoUrl: string | null) => void;
}

export const AdminClientImageUploader = ({ client, onLogoUpdate }: AdminClientImageUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  
  const { uploadLogo, updateClientLogo, removeClientLogo } = useAdminClients();

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Arquivo muito grande. O tamanho máximo é 5MB.');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    
    let previewUrl: string | null = null;
    let logoUrl: string | null = null;
    
    try {
      // Create preview
      previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      
      setUploadProgress(20);

      // Step 1: Upload file to storage
      try {
        logoUrl = await uploadLogo.mutateAsync({
          file,
          clientSlug: client.slug,
          clientId: client.id,
        });
        setUploadProgress(60);
      } catch (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error('Falha no upload do arquivo para o storage');
      }

      // Step 2: Update client record in database
      try {
        await updateClientLogo.mutateAsync({
          clientId: client.id,
          logoUrl
        });
        setUploadProgress(100);
      } catch (dbError) {
        console.error('Database update error:', dbError);
        
        // Rollback: try to remove the uploaded file
        try {
          await removeClientLogo.mutateAsync(client.id);
        } catch (rollbackError) {
          console.error('Rollback failed:', rollbackError);
        }
        
        throw new Error('Falha ao atualizar registro no banco de dados');
      }
      
      // Clean up preview
      URL.revokeObjectURL(previewUrl);
      setPreview(null);
      
      toast.success('Logo atualizada com sucesso!');
      
      // Notify parent form about the logo update
      onLogoUpdate?.(logoUrl);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido no upload da imagem';
      toast.error(errorMessage);
      
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreview(null);
      }
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    multiple: false,
    disabled: uploading
  });

  const removeImage = async () => {
    try {
      await removeClientLogo.mutateAsync(client.id);
      onLogoUpdate?.(null); // Notify parent that logo was removed
    } catch (error) {
      toast.error('Erro ao remover logo');
    }
  };

  const currentImage = preview || client.logo_url;

  return (
    <div className="space-y-4">
      {/* Preview atual */}
      {currentImage && (
        <div className="relative w-full max-w-xs mx-auto">
          <img
            src={currentImage}
            alt={`Logo do ${client.name}`}
            className="w-full h-32 object-contain bg-muted rounded-md border"
          />
          {!uploading && client.logo_url && (
            <Button
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
              onClick={removeImage}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}

      {/* Progress bar durante upload */}
      {uploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="w-full" />
          <p className="text-sm text-muted-foreground text-center">
            Fazendo upload... {uploadProgress}%
          </p>
        </div>
      )}

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
          ${uploading ? 'pointer-events-none opacity-50' : ''}
          hover:border-primary hover:bg-primary/5
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-2">
          <Upload className="h-8 w-8 text-muted-foreground" />
          
          {isDragActive ? (
            <p className="text-sm text-muted-foreground">
              Solte a imagem aqui...
            </p>
          ) : (
            <>
              <p className="text-sm font-medium">
                {client.logo_url ? 'Substituir logo' : 'Adicionar logo'}
              </p>
              <p className="text-xs text-muted-foreground">
                Clique aqui ou arraste uma imagem
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, JPEG, GIF ou WEBP (máx. 5MB)
              </p>
            </>
          )}
        </div>
      </div>

      {/* Alert se não há imagem */}
      {!currentImage && !uploading && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Este cliente não possui logo. Faça upload de uma imagem para melhorar a apresentação.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};