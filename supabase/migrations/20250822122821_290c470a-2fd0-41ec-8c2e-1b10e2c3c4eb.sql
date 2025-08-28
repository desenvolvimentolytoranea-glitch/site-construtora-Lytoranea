-- Adicionar novos serviços: Pedreira e Concreteira
INSERT INTO public.services (
  title,
  slug,
  short_description,
  full_description,
  icon,
  display_order,
  created_at,
  updated_at
) VALUES 
(
  'Pedreira',
  'pedreira',
  'Extração e fornecimento de materiais pétreos para construção civil',
  'Operação de pedreira própria com extração, beneficiamento e fornecimento de agregados pétreos (brita, cascalho, pó de pedra) para obras de infraestrutura. Garantimos qualidade certificada e logística eficiente para atender grandes volumes de demanda com controle rigoroso de granulometria e resistência dos materiais.',
  'Pickaxe',
  13,
  now(),
  now()
),
(
  'Concreteira',
  'concreteira', 
  'Produção e fornecimento de concreto usinado com controle de qualidade',
  'Central de produção de concreto usinado com tecnologia moderna e controle rigoroso de qualidade. Fornecemos diversos tipos de concreto (convencional, bombeável, auto-adensável) com entrega programada através de caminhões betoneira. Atendemos obras residenciais, comerciais e de infraestrutura com dosagens personalizadas conforme especificações técnicas.',
  'Truck',
  14,
  now(),
  now()
);