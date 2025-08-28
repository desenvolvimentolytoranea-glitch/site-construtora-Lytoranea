import { ServiceCard } from "@/components/ServiceCard";
import { useServices } from "@/hooks/useServices";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Services = () => {
  const { data: services = [], isLoading, error } = useServices();
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
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Nossos Serviços
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Especialistas em soluções completas de infraestrutura, oferecemos 
              uma ampla gama de serviços com tecnologia de ponta e compromisso 
              com a excelência.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Erro ao carregar serviços. Tente novamente mais tarde.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  title={service.title}
                  description={service.short_description}
                  image={service.image_url}
                  href={`/servicos/${service.slug}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Precisa de um orçamento personalizado?
            </h2>
            <p className="text-lg opacity-90">
              Nossa equipe está pronta para avaliar seu projeto e oferecer 
              a melhor solução em infraestrutura para suas necessidades.
            </p>
            <Button 
              asChild 
              size="lg" 
              variant="secondary"
              className="rounded-2xl font-semibold"
            >
              <Link to="/contato">
                Solicitar orçamento
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;