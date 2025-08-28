
import React, { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const AdminCategoryForm: React.FC = () => {
  const { token, isAuthenticated } = useAdmin();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

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

    const { error } = await supabase.rpc('admin_upsert_portfolio_category', {
      p_token: token,
      p_id: null,
      p_name: name,
      p_slug: slug,
    });

    if (error) {
      console.error('Erro ao salvar categoria:', error);
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar a categoria.',
        variant: 'destructive',
      });
      return;
    }

    await queryClient.invalidateQueries({ queryKey: ['portfolio-categories'] });

    toast({
      title: 'Categoria criada',
      description: 'Categoria adicionada com sucesso.',
    });

    setName('');
    setSlug('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciar Categorias do Portfólio</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Nome</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Slug</label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} required />
          </div>
          <div className="flex justify-end">
            <Button type="submit">Criar categoria</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
