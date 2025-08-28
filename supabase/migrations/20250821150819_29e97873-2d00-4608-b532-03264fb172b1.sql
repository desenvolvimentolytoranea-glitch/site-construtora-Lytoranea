-- Create portfolio categories table
CREATE TABLE public.portfolio_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create portfolio projects table
CREATE TABLE public.portfolio_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category_id UUID REFERENCES public.portfolio_categories(id) NOT NULL,
  location TEXT NOT NULL,
  year TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  client TEXT,
  main_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create portfolio images table
CREATE TABLE public.portfolio_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.portfolio_projects(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  is_main BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.portfolio_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_images ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (no auth needed for portfolio)
CREATE POLICY "Portfolio categories are publicly readable" 
ON public.portfolio_categories 
FOR SELECT 
USING (true);

CREATE POLICY "Portfolio projects are publicly readable" 
ON public.portfolio_projects 
FOR SELECT 
USING (true);

CREATE POLICY "Portfolio images are publicly readable" 
ON public.portfolio_images 
FOR SELECT 
USING (true);

-- Create storage bucket for portfolio images
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true);

-- Create storage policies for portfolio images
CREATE POLICY "Portfolio images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'portfolio');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_portfolio_projects_updated_at
BEFORE UPDATE ON public.portfolio_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial categories
INSERT INTO public.portfolio_categories (name, slug) VALUES
('Loteamentos', 'loteamentos'),
('Pavimentação', 'pavimentacao'),
('Saneamento', 'saneamento'),
('Obras de Arte', 'obras-de-arte'),
('Drenagem', 'drenagem'),
('Urbanização', 'urbanizacao');

-- Insert initial projects (using existing data)
WITH category_ids AS (
  SELECT 
    id as loteamentos_id,
    (SELECT id FROM public.portfolio_categories WHERE slug = 'pavimentacao') as pavimentacao_id,
    (SELECT id FROM public.portfolio_categories WHERE slug = 'saneamento') as saneamento_id,
    (SELECT id FROM public.portfolio_categories WHERE slug = 'obras-de-arte') as obras_arte_id,
    (SELECT id FROM public.portfolio_categories WHERE slug = 'drenagem') as drenagem_id,
    (SELECT id FROM public.portfolio_categories WHERE slug = 'urbanizacao') as urbanizacao_id
  FROM public.portfolio_categories WHERE slug = 'loteamentos'
)
INSERT INTO public.portfolio_projects (title, category_id, location, year, slug, description, client, main_image_url) 
SELECT 
  title, category_id, location, year, slug, description, client, main_image_url
FROM (
  SELECT 
    'Condomínio Residencial Verde' as title,
    c.loteamentos_id as category_id,
    'Itaguaí, RJ' as location,
    '2023' as year,
    'condominio-residencial-verde' as slug,
    'Desenvolvimento completo de loteamento residencial com infraestrutura moderna e sustentável.' as description,
    'Incorporadora Verde Ltda.' as client,
    '/portfolio-residential.jpg' as main_image_url
  FROM category_ids c
  UNION ALL
  SELECT 
    'Rodovia BR-101 - Trecho Seropédica',
    c.pavimentacao_id,
    'Seropédica, RJ',
    '2022',
    'rodovia-br-101-seropedica',
    'Pavimentação asfáltica de 15km da BR-101 com tecnologia de ponta.',
    'DNIT',
    '/portfolio-highway.jpg'
  FROM category_ids c
  UNION ALL
  SELECT 
    'Estação de Tratamento de Água',
    c.saneamento_id,
    'Mangaratiba, RJ',
    '2023',
    'estacao-tratamento-agua-mangaratiba',
    'Construção de ETA com capacidade de 50 mil litros/hora.',
    'CEDAE',
    '/portfolio-water-treatment.jpg'
  FROM category_ids c
  UNION ALL
  SELECT 
    'Ponte Sobre Rio Guandu',
    c.obras_arte_id,
    'Nova Iguaçu, RJ',
    '2021',
    'ponte-rio-guandu',
    'Construção de ponte de concreto armado com 120m de extensão.',
    'Prefeitura de Nova Iguaçu',
    '/portfolio-highway.jpg'
  FROM category_ids c
  UNION ALL
  SELECT 
    'Sistema de Drenagem Centro',
    c.drenagem_id,
    'Seropédica, RJ',
    '2022',
    'drenagem-centro-seropedica',
    'Implementação de sistema de drenagem urbana no centro da cidade.',
    'Prefeitura de Seropédica',
    '/portfolio-water-treatment.jpg'
  FROM category_ids c
  UNION ALL
  SELECT 
    'Urbanização Bairro Industrial',
    c.urbanizacao_id,
    'Itaguaí, RJ',
    '2023',
    'urbanizacao-bairro-industrial',
    'Projeto de urbanização completa incluindo vias, calçadas e paisagismo.',
    'Prefeitura de Itaguaí',
    '/portfolio-residential.jpg'
  FROM category_ids c
) projects;