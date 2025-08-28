import { HeroSection } from "@/components/HeroSection";
import { ServiceCard } from "@/components/ServiceCard";
import { PortfolioGrid } from "@/components/PortfolioGrid";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { siteConfig } from "@/lib/site.config";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useServices } from "@/hooks/useServices";
import { useClients } from "@/hooks/useClients";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// ... keep existing code (imports)

const Index = () => {
  const { data: portfolioData = [], isLoading: portfolioLoading } = usePortfolio();
  const { data: servicesData = [], isLoading: servicesLoading } = useServices();
  const { data: clients = [], isLoading: clientsLoading } = useClients();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Quem Somos - Teaser Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wide text-gray-900">
              Quem Somos
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              A Lytorânea é especializada em obras de infraestrutura, 
              combinando eficiência operacional, inovação tecnológica e 
              vasta experiência para entregar projetos que transformam 
              comunidades e impulsionam o desenvolvimento.
            </p>
            <Button 
              asChild
              className="bg-[#DD2C00] hover:bg-[#C62400] text-white px-6 py-3 rounded-full font-semibold transition-all duration-300"
            >
              <Link to="/quem-somos">
                Saiba mais
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section with Carousel/Slider */}
      <section className="py-16 md:py-20 grid-bg">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wide text-gray-900 mb-4">
              Serviços
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Especialistas em soluções completas de infraestrutura, 
              oferecemos serviços de alta qualidade para transformar projetos em realidade.
            </p>
          </div>

          {/* Services Carousel - 3 Cards */}
          <div className="max-w-7xl mx-auto px-4">
            {servicesLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="gap-6 overflow-visible">
                  {servicesData.map((service) => (
                    <CarouselItem key={service.id} className="basis-full sm:basis-1/2 lg:basis-1/3">
                      <ServiceCard
                        title={service.title}
                        description={service.short_description}
                        image={service.image_url}
                        href={`/servicos/${service.slug}`}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex -left-12 bg-white/10 border-white/20 text-white hover:bg-white/20" />
                <CarouselNext className="hidden sm:flex -right-12 bg-white/10 border-white/20 text-white hover:bg-white/20" />
              </Carousel>
            )}
          </div>
        </div>
      </section>

      {/* Portfolio Section - 3x3 Grid */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wide text-gray-900 mb-4">
              Portfólio
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Conheça alguns dos nossos principais projetos executados 
              com excelência e compromisso com a qualidade.
            </p>
          </div>

          {/* Portfolio Grid - Dense Layout */}
          {portfolioLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {portfolioData.slice(0, 9).map((project) => (
                <Link
                  key={project.id}
                  to={`/portfolio/${project.slug}`}
                  className="group relative aspect-square overflow-hidden rounded-lg bg-gray-200 hover:scale-[1.02] transition-all duration-300"
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Overlay with title on hover */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-center text-white p-4">
                      <h3 className="font-semibold text-lg mb-1">{project.title}</h3>
                      <p className="text-sm opacity-90">{project.location} • {project.year}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main Clients Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wide text-gray-900 mb-4">
              Principais Clientes
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Parcerias sólidas construídas ao longo dos anos com empresas e órgãos de referência.
            </p>
          </div>

          {/* Client Logos Grid */}
          {clientsLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : clients && clients.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {clients.map((client) => (
                <div
                  key={client.id}
                  className="aspect-square flex items-center justify-center p-6 hover:shadow-lg transition-shadow duration-300"
                  title={client.name}
                >
                  {client.logo_url ? (
                    <img
                      src={client.logo_url}
                      alt={`Logo ${client.name}`}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center">
                      <span className="text-xs text-gray-400 text-center px-2">
                        {client.name}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600">
              <p>Nenhum cliente cadastrado ainda</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
