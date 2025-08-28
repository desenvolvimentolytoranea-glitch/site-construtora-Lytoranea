import { useState } from 'react';
import { MoreHorizontal, Edit, Trash2, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Client } from '@/hooks/useClients';
import { useAdminClients } from '@/hooks/useAdminClients';

interface AdminClientCardProps {
  client: Client;
  onEdit: (client: Client) => void;
}

export const AdminClientCard = ({ client, onEdit }: AdminClientCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { deleteClient } = useAdminClients();

  const handleDelete = async () => {
    try {
      await deleteClient.mutateAsync(client.id);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
    }
  };

  return (
    <Card className="relative group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <h3 className="font-semibold text-lg leading-tight">
              {client.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              Ordem: {client.display_order}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant={client.is_active ? "default" : "secondary"}>
              {client.is_active ? (
                <><Eye className="h-3 w-3 mr-1" /> Ativo</>
              ) : (
                <><EyeOff className="h-3 w-3 mr-1" /> Inativo</>
              )}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(client)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                {client.website && (
                  <DropdownMenuItem asChild>
                    <a
                      href={client.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visitar Site
                    </a>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {/* Logo preview */}
          {client.logo_url ? (
            <div className="w-full h-24 bg-muted rounded-md flex items-center justify-center">
              <img
                src={client.logo_url}
                alt={`Logo do ${client.name}`}
                className="max-h-20 max-w-full object-contain"
              />
            </div>
          ) : (
            <div className="w-full h-24 bg-muted rounded-md flex items-center justify-center text-muted-foreground text-sm">
              Nenhuma logo
            </div>
          )}

          {/* Client info */}
          <div className="space-y-1">
            <p className="text-sm">
              <span className="font-medium">Slug:</span> {client.slug}
            </p>
            
            {client.website && (
              <p className="text-sm">
                <span className="font-medium">Website:</span>{' '}
                <a
                  href={client.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {client.website}
                </a>
              </p>
            )}

            <p className="text-xs text-muted-foreground">
              Criado em {new Date(client.created_at).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      </CardContent>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Cliente</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o cliente "{client.name}"? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};