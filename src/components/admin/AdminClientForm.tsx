import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAdminClients } from '@/hooks/useAdminClients';
import { Client } from '@/hooks/useClients';
import { AdminClientImageUploader } from './AdminClientImageUploader';
import { toStorageSafeBase } from '@/lib/utils';

const clientSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  slug: z.string().min(1, 'Slug é obrigatório'),
  website: z.string().optional(),
  display_order: z.number().min(0, 'Ordem deve ser um número positivo'),
  is_active: z.boolean(),
  logo_url: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface AdminClientFormProps {
  client?: Client;
  onSuccess?: () => void;
}

export const AdminClientForm = ({ client, onSuccess }: AdminClientFormProps) => {
  const [isEditing, setIsEditing] = useState(!!client);
  const [currentLogoUrl, setCurrentLogoUrl] = useState(client?.logo_url || '');
  const { createClient, updateClient } = useAdminClients();

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: client?.name || '',
      slug: client?.slug || '',
      website: client?.website || '',
      display_order: client?.display_order || 0,
      is_active: client?.is_active ?? true,
      logo_url: client?.logo_url || '',
    },
  });

  // Update form when logo changes
  const handleLogoUpdate = (newLogoUrl: string | null) => {
    const logoUrl = newLogoUrl || '';
    setCurrentLogoUrl(logoUrl);
    form.setValue('logo_url', logoUrl);
  };

  const watchedName = form.watch('name');

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    form.setValue('name', value);
    if (!isEditing) {
      const generatedSlug = toStorageSafeBase(value);
      form.setValue('slug', generatedSlug);
    }
  };

  const onSubmit = async (data: ClientFormData) => {
    try {
      if (client) {
        await updateClient.mutateAsync({
          id: client.id,
          name: data.name,
          slug: data.slug,
          website: data.website,
          display_order: data.display_order,
          is_active: data.is_active,
          logo_url: data.logo_url || currentLogoUrl, // Use current logo URL
        });
      } else {
        await createClient.mutateAsync({
          name: data.name,
          slug: data.slug,
          website: data.website,
          display_order: data.display_order,
          is_active: data.is_active,
        });
      }

      if (!client) {
        form.reset();
      }
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
    }
  };

  const isLoading = createClient.isPending || updateClient.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {client ? 'Editar Cliente' : 'Novo Cliente'}
        </CardTitle>
        <CardDescription>
          {client 
            ? 'Atualize as informações do cliente'
            : 'Adicione um novo cliente à lista de principais clientes'
          }
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Cliente</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Empresa ABC Ltda"
                      {...field}
                      onChange={(e) => handleNameChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="empresa-abc-ltda"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    URL amigável para o cliente (gerado automaticamente)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website (Opcional)</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://www.exemplo.com.br"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="display_order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ordem de Exibição</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    Quanto menor o número, mais acima aparece na lista
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Cliente Ativo</FormLabel>
                    <FormDescription>
                      Clientes ativos aparecem na página pública
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading
                ? (client ? 'Atualizando...' : 'Criando...')
                : (client ? 'Atualizar Cliente' : 'Criar Cliente')
              }
            </Button>
          </form>
        </Form>

        {/* Image uploader - only show for existing clients */}
        {client && (
          <div className="pt-4 border-t">
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Logo do Cliente</Label>
                <p className="text-sm text-muted-foreground">
                  Faça upload da logo do cliente em alta qualidade
                </p>
              </div>
              <AdminClientImageUploader 
                client={client} 
                onLogoUpdate={handleLogoUpdate}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};