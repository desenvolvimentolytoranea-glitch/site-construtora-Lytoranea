import { useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site.config";
import { useServices } from "@/hooks/useServices";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AdminLoginModal } from "@/components/AdminLoginModal";
import { useAdmin } from "@/contexts/AdminContext";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const location = useLocation();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { data: services = [] } = useServices();
  const { isAuthenticated } = useAdmin();
  const navigate = useNavigate();
  
  const isActive = (href: string) => location.pathname === href;
  
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsServicesOpen(true);
  };
  
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsServicesOpen(false);
    }, 150); // 150ms delay to prevent accidental closes
  };
  
  return <>
      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="skip-link" tabIndex={0}>
        Pular para o conteúdo principal
      </a>
      
      {/* Header with curved design */}
      <header className="sticky top-0 z-50 bg-white">
        {/* Fundo vermelho que se estende até a borda esquerda */}
        <div className="absolute inset-y-0 left-0 bg-[hsl(var(--brand-red))]" style={{
        width: 'calc(50vw - 600px + 220px)',
        borderBottomRightRadius: '80px'
      }}></div>
        
        <div className="relative z-10 mx-auto max-w-[1200px] flex items-center">
          {/* BLOCO ESQUERDO COLORIDO (Lytorânea) */}
          <div className="relative h-16 md:h-20 w-[220px] text-white flex items-center pl-6 isolate">
            {/* Logo */}
            <Link to="/" className="hover:opacity-90 transition-opacity focus:outline-none rounded" aria-label="Construtora Lytorânea - Página inicial">
              <img 
                src="logo.svg" 
                alt="Lytorânea Construtora" 
                className="h-8 md:h-10 w-auto"
              />
            </Link>
            
            {/* Curvatura suave - elemento branco com clip-path */}
            
          </div>

          {/* NAV TEXTO — sem caixas/bordas */}
          <nav className="hidden md:flex items-center gap-8 ml-6 text-[hsl(var(--brand-red))] font-medium" role="navigation" aria-label="Navegação principal">
            {siteConfig.navigation.map(item => <div key={item.name} className="relative">
                {item.hasDropdown ? <div className="relative group">
                    <DropdownMenu open={isServicesOpen} onOpenChange={setIsServicesOpen}>
                      <DropdownMenuTrigger asChild>
                        <button className={cn("flex items-center gap-1 hover:underline underline-offset-4 transition-colors focus:outline-none rounded", isActive(item.href) ? "underline" : "")} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} aria-expanded={isServicesOpen} aria-haspopup="true">
                          <span>{item.name}</span>
                          <ChevronDown className={cn("h-3 w-3 transition-transform", isServicesOpen && "rotate-180")} />
                        </button>
                      </DropdownMenuTrigger>
                      
                      <DropdownMenuContent className="w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50" sideOffset={0} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        <div className="p-4 space-y-1">
                          {services.map((service) => (
                            <DropdownMenuItem key={service.id} asChild>
                              <Link 
                                to={`/servicos/${service.slug}`} 
                                className={cn(
                                  "block p-2 rounded-md hover:bg-gray-50 transition-colors focus:outline-none w-full",
                                  service.title === "Locação de Máquinas e Equipamentos" && "min-h-[60px]"
                                )}
                              >
                                <div className="text-sm font-medium text-gray-900">
                                  {service.title}
                                </div>
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </div>
                        <DropdownMenuSeparator />
                        <div className="p-4">
                          <DropdownMenuItem asChild>
                            <Link to="/servicos" className="block text-center text-sm font-medium text-[hsl(var(--brand-red))] hover:opacity-80 transition-opacity focus:outline-none w-full">
                              Ver todos os serviços
                            </Link>
                          </DropdownMenuItem>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div> : <Link to={item.href} className={cn("hover:underline underline-offset-4 transition-colors focus:outline-none rounded", isActive(item.href) ? "underline" : "")}>
                    {item.name}
                  </Link>}
              </div>)}
          </nav>

          {/* Admin Button - Desktop */}
          <div className="hidden md:block ml-auto mr-6">
            {isAuthenticated ? (
              <Button
                onClick={() => navigate('/admin')}
                variant="ghost"
                size="sm"
                className="text-[hsl(var(--brand-red))] hover:bg-[hsl(var(--brand-red))]/10"
              >
                <User className="w-4 h-4 mr-2" />
                Admin
              </Button>
            ) : (
              <Button
                onClick={() => setIsAdminModalOpen(true)}
                variant="ghost"
                size="sm"
                className="text-[hsl(var(--brand-red))] hover:bg-[hsl(var(--brand-red))]/10"
              >
                <User className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden ml-auto mr-6 p-2 text-[hsl(var(--brand-red))] hover:opacity-80 focus:outline-none rounded" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-expanded={isMenuOpen} aria-label="Abrir menu de navegação">
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && <div className="md:hidden border-t border-gray-200 bg-white">
            <nav className="px-6 py-6 space-y-3" role="navigation" aria-label="Navegação móvel">
              {siteConfig.navigation.map(item => <div key={item.name}>
                  {item.hasDropdown ? <>
                      <button onClick={() => setIsServicesOpen(!isServicesOpen)} className="flex items-center justify-between w-full text-left font-medium text-[hsl(var(--brand-red))] hover:underline underline-offset-4 focus:outline-none" aria-expanded={isServicesOpen}>
                        <span>{item.name}</span>
                        <ChevronDown className={cn("h-4 w-4 transition-transform", isServicesOpen && "rotate-180")} />
                      </button>
                      {isServicesOpen && <div className="mt-2 ml-4 space-y-1">
                          {services.map((service) => (
                            <Link 
                              key={service.id} 
                              to={`/servicos/${service.slug}`} 
                              className="block py-2 text-sm text-gray-600 hover:text-gray-900 focus:outline-none" 
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {service.title}
                            </Link>
                          ))}
                          <Link to="/servicos" className="block py-2 text-sm text-[hsl(var(--brand-red))] hover:opacity-80 focus:outline-none" onClick={() => setIsMenuOpen(false)}>
                            Ver todos os serviços
                          </Link>
                        </div>}
                    </> : <Link to={item.href} className={cn("block font-medium text-[hsl(var(--brand-red))] hover:underline underline-offset-4 focus:outline-none", isActive(item.href) ? "underline" : "")} onClick={() => setIsMenuOpen(false)}>
                      {item.name}
                    </Link>}
                </div>)}
              
              {/* Admin Button - Mobile */}
              <div className="pt-3 border-t border-gray-200">
                {isAuthenticated ? (
                  <Link 
                    to="/admin" 
                    className="flex items-center gap-2 font-medium text-[hsl(var(--brand-red))] hover:underline underline-offset-4 focus:outline-none"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Admin
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      setIsAdminModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 font-medium text-[hsl(var(--brand-red))] hover:underline underline-offset-4 focus:outline-none"
                  >
                    <User className="w-4 h-4" />
                    Login Admin
                  </button>
                )}
              </div>
            </nav>
          </div>}
      </header>

      {/* Admin Login Modal */}
      <AdminLoginModal
        open={isAdminModalOpen}
        onOpenChange={setIsAdminModalOpen}
      />
    </>;
}