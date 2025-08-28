
import React, { useEffect, useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { useServices, Service } from '@/hooks/useServices';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { ServiceImageUploader } from '@/components/ServiceImageUploader';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Save, Plus, Edit, Trash2 } from 'lucide-react';

export const AdminServiceForm: React.FC = () => {
  const { token, isAuthenticated } = useAdmin();
  const { data: services, isLoading } = useServices();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [selectedServiceId, setSelectedServiceId] = useState<string>('new');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);


  useEffect(() => {
    if (selectedServiceId === 'new') {
      // Reset form for new service
      setTitle('');
      setSlug('');
      setShortDescription('');
      setFullDescription('');
      setIcon('');
      setDisplayOrder(0);
    } else {
      // Load selected service data
      const service = services?.find(s => s.id === selectedServiceId);
      if (service) {
        setTitle(service.title);
        setSlug(service.slug);
        setShortDescription(service.short_description);
        setFullDescription(service.full_description || '');
        setIcon(service.icon || '');
        setDisplayOrder(service.display_order);
      }
    }
  }, [selectedServiceId, services]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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

    const serviceId = selectedServiceId === 'new' ? null : selectedServiceId;
    const selectedService = services?.find(s => s.id === selectedServiceId);
    
    const { error } = await supabase.rpc('admin_upsert_service', {
      p_token: token,
      p_id: serviceId,
      p_title: title,
      p_slug: slug,
      p_short_description: shortDescription,
      p_full_description: fullDescription || null,
      p_icon: icon || null,
      p_display_order: displayOrder,
      p_image_url: selectedService?.image_url || null,
    });

    if (error) {
      console.error('Erro ao salvar serviço:', error);
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar o serviço.',
        variant: 'destructive',
      });
      return;
    }

    await queryClient.invalidateQueries({ queryKey: ['services'] });
    toast({
      title: 'Serviço salvo',
      description: serviceId ? 'Serviço atualizado com sucesso.' : 'Serviço criado com sucesso.',
    });
    
    if (selectedServiceId === 'new') {
      // Reset form after creating new service
      setTitle('');
      setSlug('');
      setShortDescription('');
      setFullDescription('');
      setIcon('');
      setDisplayOrder(0);
    }
  };

  const handleDelete = async () => {
    if (selectedServiceId === 'new' || !isAuthenticated || !token) return;

    // Note: Implement delete function in Supabase if needed
    toast({
      title: 'Funcionalidade em desenvolvimento',
      description: 'A exclusão de serviços será implementada em breve.',
      variant: 'destructive',
    });
  };

  const selectedService = services?.find(s => s.id === selectedServiceId);

  return (
    <div className="space-y-6">
      {/* Service Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Selecionar Serviço
            <Button 
              onClick={() => setSelectedServiceId('new')} 
              size="sm"
              variant={selectedServiceId === 'new' ? 'default' : 'outline'}
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Serviço
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedServiceId} onValueChange={setSelectedServiceId}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Selecione um serviço para editar..." />
            </SelectTrigger>
            <SelectContent className="bg-background border z-50">
              <SelectItem value="new">
                <span className="font-medium text-primary">+ Novo Serviço</span>
              </SelectItem>
              {(services || []).map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{service.title}</span>
                    <Badge variant="secondary" className="ml-2">
                      {service.display_order}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Service Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {selectedServiceId === 'new' ? (
              <>
                <div className="flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  Novo Serviço
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center">
                  <Edit className="w-5 h-5 mr-2" />
                  Editar Serviço
                </div>
                {selectedServiceId !== 'new' && (
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
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
                <label className="text-sm text-muted-foreground">Ícone (Lucide)</label>
                <Input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="ex: Wrench" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Ordem de Exibição</label>
                <Input 
                  type="number" 
                  value={displayOrder} 
                  onChange={(e) => setDisplayOrder(Number(e.target.value))} 
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground">Descrição Resumida</label>
              <Textarea 
                value={shortDescription} 
                onChange={(e) => setShortDescription(e.target.value)} 
                rows={3}
                required 
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground">Descrição Completa</label>
              <Textarea 
                value={fullDescription} 
                onChange={(e) => setFullDescription(e.target.value)} 
                rows={6}
                placeholder="Descrição detalhada do serviço..." 
              />
            </div>

            <Separator />

            {/* Image Management */}
            <div>
              <label className="text-sm text-muted-foreground mb-4 block">Imagem do Serviço</label>
              {selectedService && (
                <ServiceImageUploader service={selectedService} />
              )}
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="flex items-center">
                <Save className="w-4 h-4 mr-2" />
                {selectedServiceId === 'new' ? 'Criar serviço' : 'Salvar alterações'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
