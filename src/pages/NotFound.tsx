import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">Página não encontrada</h2>
          <p className="text-muted-foreground">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="/" 
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-semibold hover:bg-primary/90 transition-colors focus-visible"
          >
            Voltar ao início
          </a>
          <a 
            href="/contato" 
            className="inline-flex items-center justify-center px-6 py-3 border border-border text-foreground rounded-2xl font-semibold hover:bg-accent/50 transition-colors focus-visible"
          >
            Fale conosco
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
