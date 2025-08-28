-- Add missing projects that exist in the original hardcoded data
INSERT INTO public.portfolio_projects (title, category_id, location, year, slug, description, client, main_image_url)
SELECT 
  'Contenção de Encosta - Zona Sul',
  (SELECT id FROM public.portfolio_categories WHERE slug = 'obras-de-arte'),
  'Itaguaí, RJ',
  '2022',
  'contencao-encosta-zona-sul',
  'Projeto de contenção e estabilização de encosta em área residencial da zona sul.',
  'Prefeitura de Itaguaí',
  '/portfolio-highway.jpg'
WHERE NOT EXISTS (
  SELECT 1 FROM public.portfolio_projects WHERE slug = 'contencao-encosta-zona-sul'
);

-- Add more projects to complete the portfolio
INSERT INTO public.portfolio_projects (title, category_id, location, year, slug, description, client, main_image_url)
SELECT * FROM (
  SELECT 
    'Barragem de Contenção',
    (SELECT id FROM public.portfolio_categories WHERE slug = 'obras-de-arte'),
    'Mangaratiba, RJ',
    '2021',
    'barragem-contencao',
    'Construção de barragem para contenção de águas pluviais.',
    'INEA',
    '/portfolio-water-treatment.jpg'
  WHERE NOT EXISTS (SELECT 1 FROM public.portfolio_projects WHERE slug = 'barragem-contencao')
  
  UNION ALL
  
  SELECT 
    'Pavimentação Centro Histórico',
    (SELECT id FROM public.portfolio_categories WHERE slug = 'pavimentacao'),
    'Seropédica, RJ',
    '2023',
    'pavimentacao-centro-historico',
    'Revitalização e pavimentação de vias do centro histórico.',
    'Prefeitura de Seropédica',
    '/portfolio-residential.jpg'
  WHERE NOT EXISTS (SELECT 1 FROM public.portfolio_projects WHERE slug = 'pavimentacao-centro-historico')
) AS new_projects;