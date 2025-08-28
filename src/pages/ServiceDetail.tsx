import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useService } from "@/hooks/useServices";
import NotFound from "./NotFound";

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: service, isLoading, error } = useService(slug!);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !service) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-secondary grid-bg overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">

            {/* Back Button */}
            <Link 
              to="/servicos"
              className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors focus-visible mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar aos serviços</span>
            </Link>
            
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground">
                {service.title}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
                {service.short_description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Details */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-12">
            
            {/* Image + About Service Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Service Image */}
              {service.image_url && (
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden shadow-2xl">
                  <img
                    src={service.image_url}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
              )}
              
              {/* About Service */}
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-foreground">
                  Sobre o serviço
                </h2>
                <div className="prose prose-lg text-muted-foreground">
                  <p>{service.full_description || service.short_description}</p>
                </div>
              </div>
            </div>

            {/* Main Features */}
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-8">
                Principais características
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex items-start space-x-3">
                  <Star className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Alta Qualidade</h4>
                    <p className="text-sm text-muted-foreground">
                      Utilizamos materiais de primeira linha e tecnologia de ponta
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Prazo Garantido</h4>
                    <p className="text-sm text-muted-foreground">
                      Cumprimos rigorosamente os prazos estabelecidos
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Cobertura Regional</h4>
                    <p className="text-sm text-muted-foreground">
                      Atendemos toda a região metropolitana do Rio de Janeiro
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Construindo o futuro com você
            </h2>
            <p className="text-lg opacity-90">
              Nossa equipe está preparada para atende-lo. Entre em contato conosco
            </p>
            <Button 
              asChild 
              size="lg" 
              variant="secondary"
              className="rounded-2xl font-semibold"
            >
              <Link to="/contato">
                Fale conosco
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;