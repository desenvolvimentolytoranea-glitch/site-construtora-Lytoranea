import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Eye, FileText } from "lucide-react";
import { siteConfig } from "@/lib/site.config";

const Privacy = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-secondary grid-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <nav className="flex items-center justify-center mb-8">
              <Link 
                to="/"
                className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors focus-visible"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Voltar ao início</span>
              </Link>
            </nav>
            
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-2xl mb-6">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Política de Privacidade
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Transparência no tratamento dos seus dados pessoais de acordo 
              com a Lei Geral de Proteção de Dados (LGPD).
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-lg max-w-none">
            <div className="bg-muted p-6 rounded-2xl mb-8">
              <p className="text-muted-foreground mb-0">
                <strong>Última atualização:</strong> Dezembro de 2024<br />
                <strong>Vigência:</strong> Esta política está em vigor desde a data de sua publicação.
              </p>
            </div>

            <div className="space-y-12">
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center">
                  <FileText className="h-6 w-6 text-primary mr-2" />
                  1. Informações Gerais
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    A <strong className="text-foreground">{siteConfig.name}</strong>, pessoa jurídica de direito privado, 
                    com sede na {siteConfig.contact.address.full}, doravante denominada "Lytorânea", 
                    "nós", "nossa" ou "empresa", é responsável pelo tratamento dos dados pessoais 
                    coletados através de nosso website e demais canais de comunicação.
                  </p>
                  <p>
                    Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e 
                    protegemos suas informações pessoais, em conformidade com a Lei Geral de 
                    Proteção de Dados (LGPD - Lei nº 13.709/2018) e demais normas aplicáveis.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center">
                  <Eye className="h-6 w-6 text-primary mr-2" />
                  2. Dados Coletados
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <h3 className="text-lg font-semibold text-foreground">2.1 Dados fornecidos voluntariamente</h3>
                  <p>Coletamos as seguintes informações quando você:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Preenche nossos formulários de contato: nome, e-mail, telefone, empresa, mensagem</li>
                    <li>Solicita orçamentos: dados do projeto, localização, prazo desejado</li>
                    <li>Utiliza nosso Canal de Integridade: informações do relato, dados de identificação (quando não anônimo)</li>
                    <li>Se inscreve em nossa newsletter: nome e e-mail</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-foreground mt-6">2.2 Dados coletados automaticamente</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Informações de navegação: endereço IP, tipo de dispositivo, navegador</li>
                    <li>Dados de uso do website: páginas visitadas, tempo de permanência</li>
                    <li>Cookies e tecnologias similares para melhorar sua experiência</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">3. Finalidades do Tratamento</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>Utilizamos seus dados pessoais para as seguintes finalidades:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong className="text-foreground">Comunicação:</strong> responder suas dúvidas, fornecer informações sobre nossos serviços</li>
                    <li><strong className="text-foreground">Orçamentos:</strong> elaborar propostas comerciais personalizadas</li>
                    <li><strong className="text-foreground">Compliance:</strong> investigar e tratar relatos do Canal de Integridade</li>
                    <li><strong className="text-foreground">Marketing:</strong> enviar informações sobre projetos, novidades e conteúdo relevante (com seu consentimento)</li>
                    <li><strong className="text-foreground">Melhoria dos serviços:</strong> analisar o uso do website para aprimorar a experiência</li>
                    <li><strong className="text-foreground">Cumprimento legal:</strong> atender obrigações legais e regulamentares</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">4. Bases Legais</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>O tratamento de seus dados pessoais está fundamentado nas seguintes bases legais:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong className="text-foreground">Consentimento:</strong> para envio de marketing e newsletter</li>
                    <li><strong className="text-foreground">Execução de contrato:</strong> para elaboração de propostas e execução de serviços</li>
                    <li><strong className="text-foreground">Legítimo interesse:</strong> para melhoria dos serviços e segurança</li>
                    <li><strong className="text-foreground">Cumprimento de obrigação legal:</strong> quando exigido por lei</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">5. Compartilhamento</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros, 
                    exceto nas seguintes situações:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Com prestadores de serviços (hospedagem, e-mail marketing) sob contratos de confidencialidade</li>
                    <li>Por determinação legal ou ordem judicial</li>
                    <li>Para proteção dos direitos, propriedade ou segurança da empresa</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">6. Segurança</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Implementamos medidas técnicas e organizacionais adequadas para proteger 
                    seus dados pessoais contra acesso não autorizado, alteração, divulgação 
                    ou destruição, incluindo:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Criptografia de dados em trânsito e em repouso</li>
                    <li>Controles de acesso rígidos</li>
                    <li>Monitoramento e auditoria regulares</li>
                    <li>Treinamento regular da equipe sobre proteção de dados</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">7. Seus Direitos</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>Você possui os seguintes direitos em relação aos seus dados pessoais:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong className="text-foreground">Acesso:</strong> obter informações sobre o tratamento dos seus dados</li>
                    <li><strong className="text-foreground">Correção:</strong> solicitar a correção de dados incompletos ou incorretos</li>
                    <li><strong className="text-foreground">Exclusão:</strong> solicitar a eliminação dos dados (quando aplicável)</li>
                    <li><strong className="text-foreground">Portabilidade:</strong> receber seus dados em formato estruturado</li>
                    <li><strong className="text-foreground">Oposição:</strong> opor-se ao tratamento dos dados</li>
                    <li><strong className="text-foreground">Revogação:</strong> retirar o consentimento a qualquer momento</li>
                  </ul>
                  <p>
                    Para exercer seus direitos, entre em contato conosco através do e-mail{" "}
                    <a href={`mailto:${siteConfig.contact.email}`} className="text-primary hover:underline">
                      {siteConfig.contact.email}
                    </a>
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">8. Retenção</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Mantemos seus dados pessoais apenas pelo tempo necessário para cumprir 
                    as finalidades descritas, respeitando prazos legais e contratuais:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Dados de contato: enquanto houver relacionamento comercial ativo</li>
                    <li>Dados de marketing: até a retirada do consentimento</li>
                    <li>Dados de compliance: conforme prazos legais aplicáveis</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">9. Alterações</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Esta Política de Privacidade pode ser atualizada periodicamente. 
                    Recomendamos que você consulte regularmente esta página para 
                    ficar ciente de eventuais modificações. A data da última 
                    atualização está indicada no início do documento.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">10. Contato</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Para questões relacionadas a esta Política de Privacidade ou 
                    ao tratamento dos seus dados pessoais, entre em contato:
                  </p>
                  <div className="bg-muted p-4 rounded-xl">
                    <p className="mb-2"><strong className="text-foreground">E-mail:</strong> {siteConfig.contact.email}</p>
                    <p className="mb-2"><strong className="text-foreground">Telefone:</strong> {siteConfig.contact.phone}</p>
                    <p className="mb-0"><strong className="text-foreground">Endereço:</strong> {siteConfig.contact.address.full}</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;