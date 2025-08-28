import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram, Facebook, Linkedin, Youtube } from "lucide-react";
import { siteConfig } from "@/lib/site.config";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main footer content - 3 columns as in reference, NO CTA section above */}
      <div className="container max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: About */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              Sobre a Lytorânea
            </h3>
            <p className="text-sm leading-relaxed">
              Especialistas em obras de infraestrutura com mais de uma década 
              de experiência, transformando projetos em realidade com eficiência, 
              inovação e compromisso com a excelência.
            </p>
            <div className="flex space-x-4 mt-6">
              <a
                href={siteConfig.socialMedia.instagram}
                className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label="Instagram da Lytorânea"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.socialMedia.facebook}
                className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label="Facebook da Lytorânea"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.socialMedia.linkedin}
                className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label="LinkedIn da Lytorânea"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.socialMedia.youtube}
                className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label="YouTube da Lytorânea"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              Links Rápidos
            </h3>
            <nav className="flex flex-col space-y-2">
              <Link
                to="/quem-somos"
                className="text-sm hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                Quem Somos
              </Link>
              <Link
                to="/servicos"
                className="text-sm hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                Serviços
              </Link>
              <Link
                to="/portfolio"
                className="text-sm hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                Portfólio
              </Link>
              <Link
                to="/canal-de-integridade"
                className="text-sm hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                Canal de Integridade
              </Link>
              <Link
                to="/contato"
                className="text-sm hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                Contato
              </Link>
              <Link
                to="/privacidade"
                className="text-sm hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                Política de Privacidade
              </Link>
            </nav>
          </div>

          {/* Column 3: Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              Contato
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 mt-1 text-gray-400 flex-shrink-0" />
                <address className="not-italic text-sm">
                  {siteConfig.contact.address.full}
                </address>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <a 
                  href={`tel:${siteConfig.contact.phone.replace(/\D/g, '')}`}
                  className="text-sm hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {siteConfig.contact.phone}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <a 
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-sm hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {siteConfig.contact.email}
                </a>
              </div>
            </div>
            <div className="pt-2">
              <h4 className="text-sm font-medium text-white mb-2">
                Horário de Funcionamento:
              </h4>
              <div className="text-sm space-y-1">
                <div>{siteConfig.contact.businessHours.weekdays}</div>
                <div>{siteConfig.contact.businessHours.friday}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom line - copyright */}
      <div className="border-t border-gray-800">
        <div className="container max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <div>
              © {new Date().getFullYear()} Construtora Lytorânea. Todos os direitos reservados.
            </div>
            <div className="mt-2 md:mt-0">
              Desenvolvido com tecnologia e inovação.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}