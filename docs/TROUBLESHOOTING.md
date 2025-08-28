# Guia de Troubleshooting - Construtora Lytorânea

## 🔧 Problemas Comuns e Soluções

Este documento lista os problemas mais frequentes e suas soluções para o website da Construtora Lytorânea.

## 🖼️ Problemas com Imagens

### ❌ Imagens não carregam ou aparecem quebradas

**Sintomas:**
- Ícones de imagem quebrada
- Imagens em branco
- Erro 404 nas URLs de imagem

**Diagnóstico:**
```sql
-- Verificar URLs de imagem no banco
SELECT title, image_url 
FROM public.services 
WHERE image_url IS NOT NULL;

SELECT title, main_image_url 
FROM public.portfolio_projects 
WHERE main_image_url IS NOT NULL;

-- Verificar se buckets são públicos
SELECT name, public 
FROM storage.buckets;
```

**Soluções:**

1. **Bucket não público:**
```sql
UPDATE storage.buckets 
SET public = true 
WHERE name IN ('services', 'portfolio');
```

2. **URL incorreta:**
   - Verificar se a URL segue o padrão: `https://vitxtbotmtxfytusptbf.supabase.co/storage/v1/object/public/BUCKET/PATH`
   - Corrigir URLs no banco de dados

3. **Arquivo não existe:**
   - Verificar se o arquivo foi realmente uploadado
   - Re-upload da imagem se necessário

### ❌ Imagens muito lentas para carregar

**Soluções:**
1. **Otimizar tamanho:** Reduzir resolução para máx. 1920px
2. **Comprimir:** Usar ferramentas online para reduzir tamanho
3. **Formato adequado:** JPG para fotos, PNG para logos

## 📊 Problemas com Dados

### ❌ Serviços não aparecem na página

**Diagnóstico:**
```sql
-- Verificar se há serviços cadastrados
SELECT COUNT(*) as total_services FROM public.services;

-- Listar todos os serviços
SELECT id, title, slug, display_order 
FROM public.services 
ORDER BY display_order ASC;

-- Verificar políticas RLS
SELECT * FROM pg_policies WHERE tablename = 'services';
```

**Soluções:**

1. **Nenhum serviço cadastrado:**
```sql
-- Inserir serviço de exemplo
INSERT INTO public.services (title, slug, short_description, display_order)
VALUES ('Drenagem Urbana', 'drenagem-urbana', 'Sistemas de drenagem para áreas urbanas', 0);
```

2. **RLS bloqueando acesso:**
```sql
-- Verificar se política de leitura existe
CREATE POLICY "Services are publicly readable" 
ON public.services FOR SELECT 
USING (true);
```

### ❌ Projeto específico não carrega

**Diagnóstico:**
```sql
-- Buscar projeto por slug
SELECT * FROM public.portfolio_projects 
WHERE slug = 'SLUG_DO_PROJETO';

-- Verificar se categoria existe
SELECT p.title, c.name as category
FROM public.portfolio_projects p
LEFT JOIN public.portfolio_categories c ON p.category_id = c.id
WHERE p.slug = 'SLUG_DO_PROJETO';
```

**Soluções:**
1. **Projeto não existe:** Verificar se o slug está correto
2. **Categoria inválida:** Corrigir o `category_id`
3. **RLS bloqueando:** Verificar políticas de acesso

## 🌐 Problemas de Navegação

### ❌ Página 404 para rotas válidas

**Sintomas:**
- URLs como `/servicos/drenagem` retornam 404
- Navegação direta não funciona

**Diagnóstico:**
1. Verificar se as rotas estão definidas em `App.tsx`
2. Conferir se o slug no banco corresponde à URL

**Soluções:**

1. **Rota não definida:** Adicionar rota em `App.tsx`:
```tsx
<Route path="/servicos/:slug" element={<ServiceDetail />} />
```

2. **Slug incorreto:** Corrigir no banco:
```sql
UPDATE public.services 
SET slug = 'drenagem-urbana' 
WHERE id = 'ID_DO_SERVICO';
```

### ❌ Menu dropdown não funciona

**Sintomas:**
- Menu de serviços não abre
- Links do dropdown não funcionam

**Diagnóstico:**
- Verificar console do navegador para erros JavaScript
- Testar se os dados de serviços estão sendo carregados

**Soluções:**
1. **Dados não carregam:** Verificar hook `useServices()`
2. **Componente quebrado:** Verificar `Header.tsx`

## 📱 Problemas de Responsividade

### ❌ Layout quebrado em mobile

**Sintomas:**
- Elementos sobrepostos
- Texto cortado
- Botões inacessíveis

**Diagnóstico:**
- Testar em diferentes tamanhos de tela
- Usar DevTools para simular dispositivos

**Soluções:**
1. **Classes Tailwind:** Usar breakpoints responsivos (`sm:`, `md:`, `lg:`)
2. **Overflow:** Adicionar `overflow-x-hidden` se necessário
3. **Flexbox:** Usar `flex-wrap` em containers

## 🔌 Problemas de Conexão

### ❌ Erro de conexão com Supabase

**Sintomas:**
- Erro: "Failed to fetch"
- Dados não carregam
- Timeout de requests

**Diagnóstico:**
```javascript
// Testar conexão no console do navegador
import { supabase } from '@/integrations/supabase/client';
supabase.from('services').select('*').then(console.log);
```

**Soluções:**

1. **URL/Key incorretos:** Verificar `client.ts`:
```typescript
const SUPABASE_URL = "https://vitxtbotmtxfytusptbf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiI...";
```

2. **CORS:** Adicionar domínio nas configurações do Supabase
3. **Rede:** Verificar conectividade

### ❌ RLS bloqueando queries

**Sintomas:**
- Queries retornam array vazio
- Erro de permissão

**Diagnóstico:**
```sql
-- Verificar se RLS está habilitado
SELECT tablename, enable_rls 
FROM pg_tables 
WHERE schemaname = 'public';

-- Listar políticas existentes
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

**Soluções:**
```sql
-- Criar política de leitura pública para cada tabela
CREATE POLICY "Enable read access for all users" 
ON public.services FOR SELECT 
USING (true);

CREATE POLICY "Enable read access for all users" 
ON public.portfolio_projects FOR SELECT 
USING (true);

CREATE POLICY "Enable read access for all users" 
ON public.portfolio_categories FOR SELECT 
USING (true);

CREATE POLICY "Enable read access for all users" 
ON public.portfolio_images FOR SELECT 
USING (true);
```

## 🚀 Problemas de Performance

### ❌ Site muito lento

**Sintomas:**
- Carregamento > 3 segundos
- Imagens demoram para aparecer

**Diagnóstico:**
- Usar Lighthouse para auditoria
- Verificar Network tab no DevTools
- Analisar tamanho das imagens

**Soluções:**

1. **Imagens grandes:**
   - Redimensionar para máx. 1920px largura
   - Comprimir com qualidade 80-85%
   - Converter para WebP se possível

2. **Muitas requests:**
   - Implementar lazy loading
   - Otimizar queries do banco

3. **Bundle grande:**
   - Code splitting automático do Vite
   - Remover dependências não utilizadas

## 🔍 Problemas de SEO

### ❌ Meta tags não aparecem

**Sintomas:**
- Título genérico nas abas
- Prévia ruim nas redes sociais
- SEO baixo

**Soluções:**

1. **Adicionar meta tags:** Em cada página:
```tsx
useEffect(() => {
  document.title = "Título da Página - Construtora Lytorânea";
  
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', 'Descrição específica da página');
  }
}, []);
```

2. **Open Graph:** Para redes sociais:
```html
<meta property="og:title" content="Título para redes sociais" />
<meta property="og:description" content="Descrição para redes sociais" />
<meta property="og:image" content="URL da imagem de prévia" />
```

## 🛠️ Ferramentas de Debug

### Console do Navegador
```javascript
// Testar conexão Supabase
import { supabase } from '@/integrations/supabase/client';

// Buscar serviços
supabase.from('services').select('*').then(console.log);

// Buscar projetos
supabase.from('portfolio_projects').select(`
  *,
  portfolio_categories(*),
  portfolio_images(*)
`).then(console.log);

// Testar storage
supabase.storage.from('services').list().then(console.log);
```

### SQL Queries de Debug
```sql
-- Verificar integridade dos dados
SELECT 
  'services' as table_name,
  COUNT(*) as total_records,
  COUNT(CASE WHEN image_url IS NOT NULL THEN 1 END) as with_images
FROM public.services
UNION ALL
SELECT 
  'portfolio_projects',
  COUNT(*),
  COUNT(CASE WHEN main_image_url IS NOT NULL THEN 1 END)
FROM public.portfolio_projects;

-- Verificar relacionamentos
SELECT 
  p.title,
  c.name as category,
  COUNT(i.id) as image_count
FROM public.portfolio_projects p
LEFT JOIN public.portfolio_categories c ON p.category_id = c.id
LEFT JOIN public.portfolio_images i ON p.id = i.project_id
GROUP BY p.id, p.title, c.name;
```

## 📞 Quando Pedir Ajuda

### Informações Necessárias
Ao reportar problemas, inclua:

1. **URL exata** onde o problema ocorre
2. **Navegador e versão** (Chrome, Firefox, Safari)
3. **Dispositivo** (Desktop, mobile, tablet)
4. **Mensagem de erro** completa
5. **Passos** para reproduzir o problema
6. **Screenshots** se relevante

### Links Úteis para Debug
- **Supabase Dashboard:** [https://supabase.com/dashboard/project/vitxtbotmtxfytusptbf](https://supabase.com/dashboard/project/vitxtbotmtxfytusptbf)
- **SQL Editor:** [https://supabase.com/dashboard/project/vitxtbotmtxfytusptbf/sql](https://supabase.com/dashboard/project/vitxtbotmtxfytusptbf/sql)
- **Storage:** [https://supabase.com/dashboard/project/vitxtbotmtxfytusptbf/storage](https://supabase.com/dashboard/project/vitxtbotmtxfytusptbf/storage)

### Checklist Antes de Pedir Ajuda

- [ ] ✅ Verifiquei logs no console do navegador
- [ ] ✅ Testei em modo incógnito
- [ ] ✅ Verifiquei se dados existem no banco
- [ ] ✅ Confirmei URLs de imagem no storage
- [ ] ✅ Testei em outro navegador/dispositivo
- [ ] ✅ Documentei passos para reproduzir
- [ ] ✅ Tentei soluções básicas deste guia

---

*Mantenha este documento atualizado conforme novos problemas e soluções são descobertos.*