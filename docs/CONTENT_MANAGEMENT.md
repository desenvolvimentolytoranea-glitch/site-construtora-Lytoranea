# Gerenciamento de Conteúdo - Manual Completo

## 📋 Visão Geral

Este manual explica como adicionar, editar e gerenciar todo o conteúdo do website da Construtora Lytorânea através do painel do Supabase.

## 🖼️ Como Adicionar Imagens

### Passo 1: Acesse o Storage do Supabase
1. Entre no [Dashboard do Supabase](https://supabase.com/dashboard/project/vitxtbotmtxfytusptbf/storage/buckets)
2. Vá para a seção **Storage** → **Buckets**

### Passo 2: Escolha o Bucket Correto
- **`services`**: Para imagens de serviços
- **`portfolio`**: Para imagens de projetos

### Passo 3: Upload da Imagem

#### Para Serviços:
1. Entre no bucket `services`
2. Crie uma pasta com o nome do serviço (ex: `drenagem-urbana`)
3. Faça upload da imagem (formatos: JPG, PNG, WebP)
4. Clique na imagem → **Copy URL**
5. Use essa URL na tabela `services`

#### Para Projetos:
1. Entre no bucket `portfolio`
2. Crie uma pasta com o nome do projeto (ex: `rodovia-br-101`)
3. Faça upload de todas as imagens do projeto
4. Copie as URLs de cada imagem
5. Use as URLs nas tabelas `portfolio_projects` e `portfolio_images`

### Passo 4: Obter URL da Imagem
```
Exemplo de URL gerada:
https://vitxtbotmtxfytusptbf.supabase.co/storage/v1/object/public/services/drenagem-urbana/imagem-principal.jpg
```

## 🔧 Gerenciar Serviços

### Adicionar Novo Serviço

1. **Acesse o SQL Editor:**
   [https://supabase.com/dashboard/project/vitxtbotmtxfytusptbf/sql/new](https://supabase.com/dashboard/project/vitxtbotmtxfytusptbf/sql/new)

2. **Execute o comando SQL:**
```sql
INSERT INTO public.services (
  title, 
  slug, 
  short_description, 
  full_description, 
  image_url, 
  icon, 
  display_order
) VALUES (
  'Nome do Serviço',
  'nome-do-servico',
  'Descrição resumida que aparece no card',
  'Descrição completa com detalhes técnicos, benefícios e processo de execução.',
  'https://vitxtbotmtxfytusptbf.supabase.co/storage/v1/object/public/services/nome-do-servico/imagem.jpg',
  'Construction',
  10
);
```

### Campos Explicados:
- **title**: Nome exibido do serviço
- **slug**: URL amigável (sem espaços, acentos ou caracteres especiais)
- **short_description**: Texto do card (máx. 150 caracteres)
- **full_description**: Descrição completa para página de detalhes
- **image_url**: URL da imagem do Supabase Storage
- **icon**: Nome do ícone [Lucide React](https://lucide.dev/)
- **display_order**: Ordem de exibição (0 = primeiro)

### Editar Serviço Existente

```sql
UPDATE public.services 
SET 
  title = 'Novo Título',
  short_description = 'Nova descrição resumida',
  full_description = 'Nova descrição completa',
  image_url = 'nova-url-da-imagem.jpg'
WHERE slug = 'slug-do-servico';
```

### Listar Todos os Serviços

```sql
SELECT id, title, slug, short_description, display_order 
FROM public.services 
ORDER BY display_order ASC;
```

## 🏗️ Gerenciar Portfólio

### 1. Adicionar Nova Categoria

```sql
INSERT INTO public.portfolio_categories (name, slug) 
VALUES ('Nome da Categoria', 'nome-da-categoria');
```

### 2. Adicionar Novo Projeto

```sql
INSERT INTO public.portfolio_projects (
  title,
  slug,
  description,
  client,
  year,
  location,
  category_id,
  main_image_url
) VALUES (
  'Nome do Projeto',
  'nome-do-projeto',
  'Descrição detalhada do projeto, incluindo escopo, desafios e soluções implementadas.',
  'Nome do Cliente',
  '2024',
  'Cidade, Estado',
  'ID_DA_CATEGORIA_AQUI',  -- Obtido da consulta de categorias
  'https://vitxtbotmtxfytusptbf.supabase.co/storage/v1/object/public/portfolio/nome-do-projeto/principal.jpg'
);
```

### 3. Buscar ID da Categoria

```sql
SELECT id, name, slug 
FROM public.portfolio_categories 
ORDER BY name ASC;
```

### 4. Adicionar Imagens ao Projeto

```sql
-- Primeiro, obtenha o ID do projeto
SELECT id FROM public.portfolio_projects WHERE slug = 'nome-do-projeto';

-- Depois, adicione as imagens
INSERT INTO public.portfolio_images (
  project_id,
  image_url,
  alt_text,
  is_main,
  display_order
) VALUES 
  ('ID_DO_PROJETO', 'url-imagem-1.jpg', 'Descrição da imagem 1', true, 0),
  ('ID_DO_PROJETO', 'url-imagem-2.jpg', 'Descrição da imagem 2', false, 1),
  ('ID_DO_PROJETO', 'url-imagem-3.jpg', 'Descrição da imagem 3', false, 2);
```

### Campos do Projeto Explicados:
- **title**: Nome do projeto
- **slug**: URL amigável
- **description**: Descrição técnica detalhada
- **client**: Nome do cliente/órgão contratante
- **year**: Ano de realização (formato texto)
- **location**: "Cidade, Estado" ou "Região"
- **category_id**: UUID da categoria (obtido via consulta)
- **main_image_url**: Imagem principal do projeto

### Campos da Imagem Explicados:
- **project_id**: UUID do projeto
- **image_url**: URL completa da imagem
- **alt_text**: Descrição para acessibilidade
- **is_main**: true apenas para imagem principal
- **display_order**: Ordem na galeria (0, 1, 2...)

## 📝 Consultas Úteis

### Ver Todos os Projetos com Categorias
```sql
SELECT 
  p.title,
  p.slug,
  p.year,
  p.location,
  p.client,
  c.name as category
FROM public.portfolio_projects p
JOIN public.portfolio_categories c ON p.category_id = c.id
ORDER BY p.year DESC;
```

### Ver Projeto com Todas as Imagens
```sql
SELECT 
  p.title,
  p.description,
  p.main_image_url,
  i.image_url,
  i.alt_text,
  i.display_order
FROM public.portfolio_projects p
LEFT JOIN public.portfolio_images i ON p.id = i.project_id
WHERE p.slug = 'nome-do-projeto'
ORDER BY i.display_order ASC;
```

### Contar Projetos por Categoria
```sql
SELECT 
  c.name,
  COUNT(p.id) as total_projetos
FROM public.portfolio_categories c
LEFT JOIN public.portfolio_projects p ON c.id = p.category_id
GROUP BY c.id, c.name
ORDER BY total_projetos DESC;
```

## 🎯 Boas Práticas

### Para Imagens:
- **Formato:** JPG para fotos, PNG para logos/ícones
- **Tamanho:** Máx. 2MB por imagem
- **Resolução:** 1920x1080px (Full HD) para imagens principais
- **Nomes:** Descritivos em português (ex: `fachada-principal.jpg`)

### Para Textos:
- **Títulos:** Máx. 60 caracteres
- **Descrições curtas:** Máx. 150 caracteres
- **Descrições completas:** 200-500 palavras
- **SEO:** Incluir palavras-chave relevantes

### Para Slugs:
- **Formato:** `palavras-separadas-por-hifen`
- **Caracteres:** Apenas letras, números e hífens
- **Únicos:** Cada slug deve ser exclusivo
- **Descritivos:** Que identifiquem o conteúdo

### Para Organização:
- **Categorias:** Máx. 10 categorias
- **Ordem:** Display_order sequencial (0, 10, 20...)
- **Consistência:** Padrão uniforme em nomes e descrições

## ⚠️ Cuidados Importantes

### ❌ Não Fazer:
- Deletar registros sem backup
- Usar acentos em slugs
- Deixar campos obrigatórios vazios
- Upload de imagens muito grandes (>5MB)
- Modificar IDs manualmente

### ✅ Sempre Fazer:
- Testar URLs de imagem antes de salvar
- Verificar slugs únicos
- Fazer backup antes de mudanças grandes
- Usar descrições alt para acessibilidade
- Manter ordem lógica (display_order)

## 🔄 Fluxo de Trabalho Recomendado

### Para Novo Serviço:
1. 📸 Preparar imagem (otimizar tamanho)
2. 📁 Upload no Storage (`services/nome-servico/`)
3. 📋 Inserir dados na tabela `services`
4. 🔍 Testar página `/servicos/nome-servico`
5. ✅ Verificar se aparece na listagem

### Para Novo Projeto:
1. 📸 Preparar todas as imagens
2. 📁 Upload no Storage (`portfolio/nome-projeto/`)
3. 🗂️ Criar categoria (se necessária)
4. 📋 Inserir projeto na tabela `portfolio_projects`
5. 🖼️ Adicionar imagens na tabela `portfolio_images`
6. 🔍 Testar página `/portfolio/nome-projeto`
7. ✅ Verificar galeria e filtros

## 📞 Suporte

### Links Úteis:
- **SQL Editor:** [https://supabase.com/dashboard/project/vitxtbotmtxfytusptbf/sql](https://supabase.com/dashboard/project/vitxtbotmtxfytusptbf/sql)
- **Storage:** [https://supabase.com/dashboard/project/vitxtbotmtxfytusptbf/storage](https://supabase.com/dashboard/project/vitxtbotmtxfytusptbf/storage)
- **Tabelas:** [https://supabase.com/dashboard/project/vitxtbotmtxfytusptbf/editor](https://supabase.com/dashboard/project/vitxtbotmtxfytusptbf/editor)

### Em Caso de Problemas:
1. Verificar se a URL da imagem está acessível
2. Confirmar que os IDs das FKs existem
3. Validar se todos os campos obrigatórios foram preenchidos
4. Testar a query no SQL Editor antes de executar
5. Consultar logs em caso de erro

## 📊 Exemplo Prático Completo

### Cenário: Adicionar serviço "Pavimentação Asfáltica"

```sql
-- 1. Inserir o serviço
INSERT INTO public.services (
  title, 
  slug, 
  short_description, 
  full_description, 
  image_url, 
  icon, 
  display_order
) VALUES (
  'Pavimentação Asfáltica',
  'pavimentacao-asfaltica',
  'Execução de pavimentos asfálticos para vias urbanas e rodoviárias com alta qualidade e durabilidade.',
  'Serviço especializado em pavimentação asfáltica incluindo preparação de base, aplicação de primer, execução de camadas asfálticas e acabamento. Utilizamos equipamentos modernos e materiais de primeira qualidade, garantindo pavimentos duráveis e seguros para tráfego leve e pesado.',
  'https://vitxtbotmtxfytusptbf.supabase.co/storage/v1/object/public/services/pavimentacao-asfaltica/pavimento-asfalto.jpg',
  'Road',
  30
);

-- 2. Verificar se foi inserido
SELECT title, slug, display_order 
FROM public.services 
WHERE slug = 'pavimentacao-asfaltica';
```

**Resultado esperado:** O serviço aparecerá na página `/servicos` e terá sua própria página em `/servicos/pavimentacao-asfaltica`.