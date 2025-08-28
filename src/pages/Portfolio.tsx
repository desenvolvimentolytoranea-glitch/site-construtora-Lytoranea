import { PortfolioGrid } from "@/components/PortfolioGrid";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { usePortfolio } from "@/hooks/usePortfolio";

const Portfolio = () => {
  const { data: portfolioData = [], isLoading, error } = usePortfolio();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Carregando portfólio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Erro ao carregar portfólio</h1>
          <p className="text-muted-foreground">Tente novamente mais tarde.</p>
        </div>
      </div>
    );
  }

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
              Nosso Portfólio
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Conheça alguns dos nossos principais projetos executados com 
              excelência, inovação e compromisso com a qualidade ao longo dos anos.
            </p>
            
            <div className="flex flex-wrap gap-6 justify-center text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>100+ Projetos Concluídos</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>15+ Anos de Experiência</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Clientes Satisfeitos</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <PortfolioGrid 
            items={portfolioData}
            showFilters={true}
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">100+</div>
              <div className="text-muted-foreground">Obras Executadas</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">15+</div>
              <div className="text-muted-foreground">Anos de Mercado</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">50+</div>
              <div className="text-muted-foreground">Profissionais</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">98%</div>
              <div className="text-muted-foreground">Satisfação dos Clientes</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;