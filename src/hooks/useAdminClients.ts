
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createAdminClient } from '@/integrations/supabase/adminClient';
// import { supabase } from '@/integrations/supabase/client'; // removido: não usar cliente anônimo para upload
import { Client } from './useClients';
import { toast } from 'sonner';
import { toStorageSafeBase } from '@/lib/utils';

interface CreateClientData {
  name: string;
  slug?: string;
  logo_url?: string;
  website?: string;
  display_order?: number;
  is_active?: boolean;
}

interface UpdateClientData extends CreateClientData {
  id: string;
}

export const useAdminClients = () => {
  const queryClient = useQueryClient();

  // Get all clients (including inactive)
  const getClients = useQuery({
    queryKey: ['admin-clients'],
    queryFn: async () => {
      const admin = createAdminClient();
      const { data, error } = await admin
        .from('clients')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        throw error;
      }

      return data as Client[];
    },
  });

  // Create client
  const createClient = useMutation({
    mutationFn: async (clientData: CreateClientData) => {
      const token = sessionStorage.getItem('admin_token');
      if (!token) throw new Error('No admin token');

      const slug = clientData.slug || toStorageSafeBase(clientData.name);

      const admin = createAdminClient();
      const { data, error } = await admin.rpc('admin_upsert_client', {
        p_token: token,
        p_id: null,
        p_name: clientData.name,
        p_slug: slug,
        p_logo_url: clientData.logo_url || null,
        p_website: clientData.website || null,
        p_display_order: clientData.display_order || 0,
        p_is_active: clientData.is_active !== false,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clients'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Cliente criado com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao criar cliente');
    },
  });

  // Update client
  const updateClient = useMutation({
    mutationFn: async (clientData: UpdateClientData) => {
      const token = sessionStorage.getItem('admin_token');
      if (!token) throw new Error('No admin token');

      const admin = createAdminClient();
      const { data, error } = await admin.rpc('admin_upsert_client', {
        p_token: token,
        p_id: clientData.id,
        p_name: clientData.name,
        p_slug: clientData.slug || toStorageSafeBase(clientData.name),
        p_logo_url: clientData.logo_url || null,
        p_website: clientData.website || null,
        p_display_order: clientData.display_order || 0,
        p_is_active: clientData.is_active !== false,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clients'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Cliente atualizado com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar cliente');
    },
  });

  // Delete client
  const deleteClient = useMutation({
    mutationFn: async (clientId: string) => {
      const token = sessionStorage.getItem('admin_token');
      if (!token) throw new Error('No admin token');

      const admin = createAdminClient();
      const { error } = await admin.rpc('admin_delete_client', {
        p_token: token,
        p_id: clientId,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clients'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Cliente excluído com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao excluir cliente');
    },
  });

  // Update client logo
  const updateClientLogo = useMutation({
    mutationFn: async ({ clientId, logoUrl }: { clientId: string; logoUrl: string }) => {
      const token = sessionStorage.getItem('admin_token');
      if (!token) throw new Error('No admin token');

      const admin = createAdminClient();
      const { error } = await admin.rpc('admin_update_client_logo', {
        p_token: token,
        p_client_id: clientId,
        p_logo_url: logoUrl,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clients'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
    onError: (error) => {
      console.error('updateClientLogo error:', error);
    },
  });

  // Remove client logo (also deletes from storage)
  const removeClientLogo = useMutation({
    mutationFn: async (clientId: string) => {
      const token = sessionStorage.getItem('admin_token');
      if (!token) throw new Error('No admin token');

      const admin = createAdminClient();

      // Best-effort: remove any files under the client's folder
      try {
        const list = await admin.storage.from('clients').list(clientId, { limit: 100 });
        const paths = (list.data || []).map((obj) => `${clientId}/${obj.name}`);
        if (paths.length) {
          await admin.storage.from('clients').remove(paths);
        }
      } catch (e) {
        // ignore storage cleanup errors
      }

      const { error } = await admin.rpc('admin_remove_client_logo', {
        p_token: token,
        p_client_id: clientId,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clients'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Logo removida com sucesso');
    },
    onError: () => {
      toast.error('Erro ao remover logo');
    },
  });

  // Upload logo file (usa Admin client + token) — garante único arquivo por cliente
  const uploadLogo = useMutation({
    mutationFn: async ({ file, clientSlug, clientId }: { file: File; clientSlug: string; clientId: string }) => {
      const token = sessionStorage.getItem('admin_token');
      if (!token) throw new Error('No admin token');

      const admin = createAdminClient();

      const safeSlug = toStorageSafeBase(clientSlug);
      const fileExt = (file.name.split('.').pop() || 'png').toLowerCase();
      const folder = clientId; // pasta canônica por cliente
      const filePath = `${folder}/logo.${fileExt}`;

      // Limpa arquivos antigos (pasta do cliente)
      try {
        const list = await admin.storage.from('clients').list(folder, { limit: 100 });
        const paths = (list.data || []).map((o) => `${folder}/${o.name}`);
        if (paths.length) {
          await admin.storage.from('clients').remove(paths);
        }
      } catch {}

      // Limpa arquivos legados na raiz baseados no slug (ex.: slug.png)
      try {
        const rootList = await admin.storage.from('clients').list('', { limit: 100 });
        const legacy = (rootList.data || [])
          .filter((o) => o.name.startsWith(`${safeSlug}.`))
          .map((o) => o.name);
        if (legacy.length) {
          await admin.storage.from('clients').remove(legacy);
        }
      } catch {}

      const { error: uploadError } = await admin.storage
        .from('clients')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = admin.storage
        .from('clients')
        .getPublicUrl(filePath);

      return publicUrl;
    },
    onError: (error) => {
      console.error('uploadLogo error:', error);
    },
  });

  return {
    clients: getClients.data || [],
    isLoading: getClients.isLoading,
    error: getClients.error,
    createClient,
    updateClient,
    deleteClient,
    updateClientLogo,
    removeClientLogo,
    uploadLogo,
    refetch: getClients.refetch,
  };
};
