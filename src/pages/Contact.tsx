import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { siteConfig } from "@/lib/site.config";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Mensagem enviada com sucesso!",
      description: "Entraremos em contato em breve. Obrigado pelo interesse!",
    });
    
    setIsLoading(false);
    (e.target as HTMLFormElement).reset();
  };

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
              Entre em Contato
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Estamos prontos para transformar seu projeto em realidade. 
              Entre em contato e descubra como podemos ajudar.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  Envie sua mensagem
                </h2>
                <p className="text-muted-foreground">
                  Preencha o formulário abaixo e nossa equipe entrará em contato 
                  em breve para discutir seu projeto.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Seu nome completo"
                      required
                      className="focus-visible"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"  
                      required
                      className="focus-visible"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Assunto *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="Assunto da mensagem"
                    required
                    className="focus-visible"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Descreva seu projeto ou dúvidas..."
                    rows={6}
                    required
                    className="focus-visible"
                  />
                </div>

                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="consent"
                    name="consent"
                    required
                    className="mt-1"
                  />
                  <Label htmlFor="consent" className="text-sm text-muted-foreground leading-relaxed">
                    Concordo com o tratamento dos meus dados pessoais de acordo com a{" "}
                    <Link to="/privacidade" className="text-primary hover:underline">
                      Política de Privacidade
                    </Link>
                    .
                  </Label>
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={isLoading}
                  className="w-full md:w-auto rounded-2xl"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Mensagem
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  Informações de Contato
                </h2>
                <p className="text-muted-foreground">
                  Entre em contato conosco através dos canais abaixo ou visite 
                  nosso escritório.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground">Endereço</h3>
                    <address className="not-italic text-muted-foreground">
                      {siteConfig.contact.address.full}
                    </address>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground">Telefone</h3>
                    <a 
                      href={`tel:${siteConfig.contact.phone.replace(/\D/g, '')}`}
                      className="text-muted-foreground hover:text-foreground transition-colors focus-visible"
                    >
                      {siteConfig.contact.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground">E-mail</h3>
                    <a 
                      href={`mailto:${siteConfig.contact.email}`}
                      className="text-muted-foreground hover:text-foreground transition-colors focus-visible"
                    >
                      {siteConfig.contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground">Horário de Funcionamento</h3>
                    <div className="text-muted-foreground space-y-1">
                      <div>{siteConfig.contact.businessHours.weekdays}</div>
                      <div>{siteConfig.contact.businessHours.friday}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="aspect-video bg-muted rounded-2xl flex items-center justify-center">
                <div className="text-center space-y-2">
                  <MapPin className="h-8 w-8 text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">Mapa do Google em breve</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;