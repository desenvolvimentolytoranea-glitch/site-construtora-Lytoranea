import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/ServiceCard";
import { useServices } from "@/hooks/useServices";

const About = () => {
  const { data: services, isLoading } = useServices();
  
  // Filter for main services to display - dynamic loading from database
  const featuredServices = services?.filter(service => 
    ['pavimentacao', 'obras-arte-especiais', 'drenagem'].includes(service.slug)
  ) || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gray-50 grid-bg">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <nav className="flex items-center justify-center mb-8">
              <Link 
                to="/"
                className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Voltar ao início</span>
              </Link>
            </nav>
            
            <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-wide text-gray-900">
              Quem Somos
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Desde 2006, a Construtora Lytorânea é referência em obras públicas e infraestrutura urbana. 
              Com sede em Itaguaí/RJ, atuamos em diversas regiões do Brasil, executando projetos que unem 
              inovação, qualidade técnica e comprometimento social.
            </p>
          </div>
        </div>
      </section>

      {/* Three Text Blocks Side by Side - Exact Layout from Reference */}
      <section className="py-16 md:py-24">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Nossa Experiência */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold uppercase tracking-wide text-gray-900">
                Nossa Experiência
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Somos líderes em infraestrutura urbana e viária, com forte atuação em projetos de:
              </p>
              <ul className="text-gray-600 leading-relaxed list-disc pl-6 space-y-1">
                <li>Pavimentação e requalificação rodoviária</li>
                <li>Execução de drenagem pluvial e saneamento</li>
                <li>Requalificação e urbanização de espaços públicos</li>
                <li>Construção de calçadas, praças e ciclovias</li>
                <li>Obras de arte especiais, como pontes e passarelas</li>
              </ul>
              <p className="text-gray-600 leading-relaxed">
                Cada projeto é conduzido por uma equipe técnica experiente, garantindo 
                eficiência, segurança e durabilidade em todas as fases.
              </p>
            </div>

            {/* Inovação e Qualidade */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold uppercase tracking-wide text-gray-900">
                Inovação e Qualidade
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Na Lytorânea, a excelência é um compromisso. Utilizamos métodos modernos 
                de engenharia, equipamentos de ponta e os mais altos padrões de controle 
                tecnológico para assegurar obras que superam expectativas e entregam 
                resultados concretos à sociedade.
              </p>
            </div>

            {/* Parcerias e Compromisso */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold uppercase tracking-wide text-gray-900">
                Parcerias e Compromisso
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Desenvolvemos nossos projetos em parceria com órgãos públicos e privados, 
                sempre com transparência, seriedade e foco no impacto positivo para as comunidades.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Acreditamos que o trabalho em equipe e a responsabilidade são a base para 
                o sucesso de qualquer obra, construindo relações sólidas de confiança com 
                clientes, parceiros e a população atendida.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services Cards - Trio Below Text */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wide text-gray-900 mb-4">
              Principais Serviços
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Conheça algumas de nossas especialidades em infraestrutura
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoading ? (
              // Loading placeholder
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 aspect-video rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))
            ) : (
              featuredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  title={service.title}
                  description={service.short_description}
                  image={service.image_url}
                  href={`/servicos/${service.slug}`}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Slogan Final */}
      <section className="py-8 bg-gray-900">
        <div className="container max-w-7xl mx-auto px-6 text-center">
          <p className="text-xl md:text-2xl font-bold text-white">
            Construtora Lytorânea – Construindo o futuro com você.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;