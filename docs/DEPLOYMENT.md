# Guia de Deploy - Construtora Lytorânea

## 🚀 Visão Geral

Este documento explica como fazer o deploy do website da Construtora Lytorânea na plataforma Lovable e configurar um domínio customizado.

## 📋 Pré-requisitos

- Projeto configurado no Lovable
- Banco de dados Supabase configurado e populado
- Imagens uploadeadas no Supabase Storage
- Código testado localmente

## 🌐 Deploy na Plataforma Lovable

### Passo 1: Acesso ao Projeto
1. Entre no [Editor Lovable](https://lovable.dev/projects/84a69d03-f82d-494b-87b9-3af4a9543388)
2. Certifique-se de que todas as alterações estão salvas

### Passo 2: Publicar o Site
1. Clique no botão **"Publish"** no canto superior direito
2. Aguarde o processo de build ser concluído
3. O site ficará disponível em: `https://SEU-PROJETO.lovable.app`

### Passo 3: Verificar Deploy
- ✅ Página inicial carrega corretamente
- ✅ Navegação entre páginas funciona
- ✅ Imagens do Supabase são exibidas
- ✅ Dados dos serviços e portfólio aparecem
- ✅ Responsividade em mobile/tablet
- ✅ Links de contato funcionam

## 🔗 Configurar Domínio Customizado

### Pré-requisitos de Domínio
- Plano pago no Lovable
- Domínio próprio registrado
- Acesso ao painel de DNS do domínio

### Passo 1: Configurar no Lovable
1. No projeto, vá para **Project** → **Settings** → **Domains**
2. Clique em **"Connect Domain"**
3. Digite seu domínio (ex: `lytoranea.com.br`)
4. Anote os registros DNS fornecidos

### Passo 2: Configurar DNS
Configure os seguintes registros no seu provedor DNS:

```dns
Tipo: CNAME
Nome: www
Valor: [fornecido pelo Lovable]
TTL: 300

Tipo: A
Nome: @
Valor: [IP fornecido pelo Lovable]
TTL: 300
```

### Passo 3: Verificar Propagação
- Aguarde até 24h para propagação DNS
- Teste acesso via domínio customizado
- Verifique certificado SSL automático

## 🔧 Configuração de Ambiente

### Variáveis de Produção
As seguintes configurações são automáticas na Lovable:

```javascript
// Configuração do Supabase em produção
const SUPABASE_URL = "https://vitxtbotmtxfytusptbf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiI...";
```

### Build Configuration
```json
{
  "build": {
    "command": "npm run build",
    "publish": "dist",
    "environment": {
      "NODE_VERSION": "18"
    }
  }
}
```

## 📊 Monitoramento Pós-Deploy

### Analytics Lovable
- Acesse as métricas no dashboard do projeto
- Monitore visitantes únicos, page views, tempo de sessão
- Verifique performance e erros

### Supabase Monitoring
- [Database Logs](https://supabase.com/dashboard/project/vitxtbotmtxfytusptbf/logs/postgres-logs)
- [API Logs](https://supabase.com/dashboard/project/vitxtbotmtxfytusptbf/logs/edge-logs)
- [Storage Usage](https://supabase.com/dashboard/project/vitxtbotmtxfytusptbf/storage/usage)

### Performance Metrics
Monitore essas métricas importantes:
- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Time to Interactive:** < 3s
- **Cumulative Layout Shift:** < 0.1

## 🔄 CI/CD e Atualizações

### Deploy Automático
- Mudanças feitas no Lovable são deployadas automaticamente
- Backup automático antes de cada deploy
- Rollback disponível em caso de problemas

### Fluxo de Atualização Recomendado
1. **Desenvolvimento:** Faça alterações no editor Lovable
2. **Teste:** Verifique funcionamento na prévia
3. **Deploy:** Publique as alterações
4. **Verificação:** Teste o site em produção
5. **Monitoramento:** Acompanhe métricas por 24h

### Rollback de Emergência
1. Acesse o histórico de versões no Lovable
2. Clique em **"Revert"** na versão desejada
3. Confirme o rollback
4. Verifique se o problema foi resolvido

## 🛡️ Segurança e Backup

### Backup Automático
- **Código:** Versionamento automático no Lovable
- **Database:** Backup diário automático no Supabase
- **Storage:** Replicação automática de arquivos

### Configurações de Segurança
```sql
-- Verificar políticas RLS ativas
SELECT tablename, enable_rls 
FROM pg_tables 
WHERE schemaname = 'public' AND enable_rls = true;

-- Verificar políticas de Storage
SELECT * FROM storage.policies;
```

### SSL e HTTPS
- Certificado SSL automático via Lovable
- Redirect HTTP → HTTPS ativado
- HSTS headers configurados

## 🔍 SEO e Indexação

### Configuração Pós-Deploy
1. **Google Search Console:**
   - Adicione a propriedade do domínio
   - Submeta o sitemap XML
   - Monitore indexação

2. **Meta Tags Verificadas:**
   ```html
   <meta name="description" content="...">
   <meta property="og:title" content="...">
   <meta property="og:description" content="...">
   <meta property="og:image" content="...">
   ```

3. **Robots.txt:**
   ```
   User-agent: *
   Allow: /
   
   Sitemap: https://seudominio.com.br/sitemap.xml
   ```

## 📱 PWA (Progressive Web App)

### Configuração Opcional
Para melhorar a experiência mobile:

1. **Manifest.json:**
```json
{
  "name": "Construtora Lytorânea",
  "short_name": "Lytorânea",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#22c55e",
  "background_color": "#ffffff"
}
```

2. **Service Worker:** Para cache offline
3. **App Icons:** Diversos tamanhos para diferentes dispositivos

## 📈 Otimização de Performance

### Técnicas Implementadas
- **Lazy Loading:** Imagens carregadas sob demanda
- **Code Splitting:** Divisão automática de bundles
- **CDN:** Supabase Storage com distribuição global
- **Compression:** Gzip automático pelo Lovable

### Monitoramento Contínuo
```javascript
// Web Vitals monitoring
function measureWebVitals() {
  // Core Web Vitals são medidos automaticamente
  // pelo Lovable Analytics
}
```

## 🚨 Troubleshooting

### Problemas Comuns

#### 1. Imagens não carregam
```sql
-- Verificar URLs no banco
SELECT image_url FROM public.services WHERE image_url IS NOT NULL;
SELECT image_url FROM public.portfolio_projects WHERE main_image_url IS NOT NULL;

-- Verificar bucket público
SELECT * FROM storage.buckets WHERE public = true;
```

#### 2. Dados não aparecem
```sql
-- Verificar se há dados nas tabelas
SELECT COUNT(*) FROM public.services;
SELECT COUNT(*) FROM public.portfolio_projects;

-- Verificar políticas RLS
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

#### 3. Erros de CORS
- Verificar configuração do Supabase
- Confirmar domínio na lista de Origins permitidas

### Logs de Debug
- **Lovable Console:** Erros de JavaScript
- **Supabase Logs:** Erros de API/Database
- **Network Tab:** Requests falhando

## 📞 Suporte e Contatos

### Links de Emergência
- **Lovable Support:** [Discord Community](https://discord.gg/lovable)
- **Supabase Status:** [https://status.supabase.com](https://status.supabase.com)
- **Project Dashboard:** [https://lovable.dev/projects/84a69d03-f82d-494b-87b9-3af4a9543388](https://lovable.dev/projects/84a69d03-f82d-494b-87b9-3af4a9543388)

### Checklist Final de Deploy

- [ ] ✅ Site carrega sem erros
- [ ] ✅ Todas as páginas navegáveis
- [ ] ✅ Imagens do Supabase funcionam
- [ ] ✅ Dados aparecem corretamente
- [ ] ✅ Responsividade OK
- [ ] ✅ Links externos funcionam
- [ ] ✅ Forms de contato testados
- [ ] ✅ SEO meta tags configuradas
- [ ] ✅ Performance > 90 no Lighthouse
- [ ] ✅ Domínio customizado (se aplicável)
- [ ] ✅ SSL certificado ativo
- [ ] ✅ Analytics configurado
- [ ] ✅ Monitoramento ativo

## 🎯 Próximos Passos

Após o deploy bem-sucedido:

1. **Conteúdo:** Popular com dados reais dos projetos
2. **SEO:** Otimizar para palavras-chave do setor
3. **Analytics:** Configurar Google Analytics
4. **Marketing:** Integrar com redes sociais
5. **Performance:** Monitorar e otimizar continuamente

---

*Este guia deve ser atualizado conforme novas funcionalidades são adicionadas ao projeto.*