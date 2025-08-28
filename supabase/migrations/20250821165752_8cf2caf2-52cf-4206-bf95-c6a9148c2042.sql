-- Create services table
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL,
  full_description TEXT,
  image_url TEXT,
  icon TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Services are publicly readable" 
ON public.services 
FOR SELECT 
USING (true);

-- Create storage bucket for services
INSERT INTO storage.buckets (id, name, public) VALUES ('services', 'services', true);

-- Create storage policies for services
CREATE POLICY "Service images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'services');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert all 13 services
INSERT INTO public.services (title, slug, short_description, full_description, image_url, icon, display_order) VALUES
('Desassoreamento', 'desassoreamento', 'Limpeza e desobstrução de rios, córregos e canais de drenagem.', 'Serviço especializado em remoção de sedimentos e detritos que obstruem cursos d''água, garantindo o fluxo adequado e prevenindo enchentes. Utilizamos equipamentos modernos para dragagem e limpeza eficiente.', '/service-drainage.jpg', 'Waves', 1),
('Canalização', 'canalizacao', 'Construção e revestimento de canais para direcionamento de águas.', 'Execução de obras de canalização para controle e direcionamento do fluxo de águas pluviais e fluviais. Incluímos revestimento em concreto, gabião e outras soluções técnicas adequadas.', '/service-drainage.jpg', 'GitBranch', 2),
('Saneamento', 'saneamento', 'Sistemas completos de tratamento de água e esgoto.', 'Desenvolvimento de projetos e execução de obras de saneamento básico, incluindo estações de tratamento de água e esgoto, redes coletoras e sistemas de distribuição.', '/service-bridges.jpg', 'Droplets', 3),
('Drenagem', 'drenagem', 'Sistemas de drenagem urbana e pluvial para controle de águas.', 'Projetos e execução de sistemas de drenagem urbana, incluindo galerias pluviais, bocas de lobo, dissipadores de energia e bacias de contenção para prevenção de enchentes.', '/service-drainage.jpg', 'CloudRain', 4),
('Terraplanagem', 'terraplanagem', 'Movimentação de terra e preparação de terrenos.', 'Serviços de escavação, aterro, compactação e nivelamento de terrenos. Preparação completa do solo para fundações e infraestrutura, com controle rigoroso de qualidade.', '/service-paving.jpg', 'Mountain', 5),
('Pavimentação', 'pavimentacao', 'Pavimentação asfáltica e de concreto para vias urbanas e rodoviárias.', 'Execução completa de pavimentação em asfalto e concreto, desde a preparação da base até o acabamento final. Atendemos projetos urbanos, rodoviários e industriais com alta qualidade.', '/service-paving.jpg', 'Road', 6),
('Sinalização', 'sinalizacao', 'Sinalização viária horizontal e vertical completa.', 'Implementação de sinalização de trânsito horizontal (faixas, símbolos) e vertical (placas, semáforos), seguindo normas técnicas e garantindo a segurança viária.', '/service-paving.jpg', 'Navigation', 7),
('Manutenção', 'manutencao', 'Manutenção preventiva e corretiva de infraestrutura.', 'Serviços de manutenção em vias públicas, sistemas de drenagem, pontes e demais estruturas de infraestrutura urbana, garantindo durabilidade e funcionalidade.', '/service-bridges.jpg', 'Wrench', 8),
('Tapa-buraco', 'tapa-buraco', 'Reparos emergenciais e definitivos em pavimentos.', 'Execução de reparos em pavimentos asfálticos e de concreto, desde remendos emergenciais até restauração completa de trechos danificados, utilizando técnicas e materiais apropriados.', '/service-paving.jpg', 'CircleDot', 9),
('Urbanização', 'urbanizacao', 'Projetos completos de urbanização e infraestrutura urbana.', 'Desenvolvimento de projetos de loteamentos, parques urbanos, praças e demais equipamentos de infraestrutura urbana, incluindo sistema viário, drenagem e paisagismo.', '/service-bridges.jpg', 'Building', 10),
('Edificações', 'edificacoes', 'Construção de prédios públicos e estruturas institucionais.', 'Execução de obras de edificações públicas, escolas, postos de saúde, centros administrativos e outras construções institucionais, com foco em funcionalidade e durabilidade.', '/service-bridges.jpg', 'Home', 11),
('Obras de Arte Especiais', 'obras-arte-especiais', 'Construção de pontes, viadutos e estruturas especiais.', 'Execução de obras de arte especiais como pontes, viadutos, túneis, muros de contenção e outras estruturas de grande complexidade técnica, utilizando tecnologia de ponta.', '/service-bridges.jpg', 'Bridge', 12),
('Locação de Máquinas e Equipamentos', 'locacao-maquinas-equipamentos', 'Aluguel de equipamentos pesados para construção civil e infraestrutura.', 'Locação de máquinas e equipamentos pesados para construção civil, terraplanagem, pavimentação e demais obras de infraestrutura. Frota moderna e bem conservada com operadores qualificados disponíveis.', '/service-paving.jpg', 'Truck', 13);