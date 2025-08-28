import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, FileText, AlertTriangle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const IntegrityChannel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [wantsToIdentify, setWantsToIdentify] = useState("sim");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Relato enviado com sucesso!",
      description: "Seu relato foi recebido e será tratado com total confidencialidade.",
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
            
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-2xl mb-6">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Canal de Integridade
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Um canal seguro e confidencial para relatar questões éticas, 
              de compliance e integridade. Sua identidade pode ser mantida em sigilo.
            </p>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Confidencial</h3>
                <p className="text-sm text-muted-foreground">
                  Todos os relatos são tratados com absoluta confidencialidade 
                  e podem ser anônimos.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl">
                  <AlertTriangle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Seguro</h3>
                <p className="text-sm text-muted-foreground">
                  Ambiente protegido contra retaliações, garantindo a segurança 
                  do comunicante.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Transparente</h3>
                <p className="text-sm text-muted-foreground">
                  Processo claro e transparente de investigação e tratamento 
                  das questões reportadas.
                </p>
              </div>
            </div>

            <div className="bg-muted p-6 rounded-2xl mb-12">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                O que você pode reportar:
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Violações de normas éticas e de conduta</li>
                <li>• Irregularidades em processos ou procedimentos</li>
                <li>• Conflitos de interesse</li>
                <li>• Discriminação ou assédio</li>
                <li>• Questões de segurança do trabalho</li>
                <li>• Uso inadequado de recursos da empresa</li>
                <li>• Fraudes ou corrupção</li>
                <li>• Outras questões de compliance</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-background p-8 rounded-2xl shadow-lg">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Formulário de Relato
                </h2>
                <p className="text-muted-foreground">
                  Preencha as informações abaixo. Campos marcados com * são obrigatórios.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="location">Localidade *</Label>
                    <Input
                      id="location"
                      name="location"
                      type="text"
                      placeholder="Cidade/Estado onde ocorreu"
                      required
                      className="focus-visible"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unit">Unidade *</Label>
                    <Select name="unit" required>
                      <SelectTrigger className="focus-visible">
                        <SelectValue placeholder="Selecione a unidade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sede">Sede - Itaguaí</SelectItem>
                        <SelectItem value="obras">Canteiros de Obras</SelectItem>
                        <SelectItem value="escritorio">Escritórios</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Deseja se identificar? *</Label>
                  <RadioGroup
                    value={wantsToIdentify}
                    onValueChange={setWantsToIdentify}
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sim" id="identify-yes" />
                      <Label htmlFor="identify-yes">Sim</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="nao" id="identify-no" />
                      <Label htmlFor="identify-no">Não (anônimo)</Label>
                    </div>
                  </RadioGroup>
                </div>

                {wantsToIdentify === "sim" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Seu nome</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Nome completo"
                        className="focus-visible"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="profile">Perfil</Label>
                      <Select name="profile">
                        <SelectTrigger className="focus-visible">
                          <SelectValue placeholder="Seu relacionamento com a empresa" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="funcionario">Funcionário</SelectItem>
                          <SelectItem value="terceirizado">Terceirizado</SelectItem>
                          <SelectItem value="fornecedor">Fornecedor</SelectItem>
                          <SelectItem value="cliente">Cliente</SelectItem>
                          <SelectItem value="comunidade">Comunidade</SelectItem>
                          <SelectItem value="outros">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Select name="category" required>
                    <SelectTrigger className="focus-visible">
                      <SelectValue placeholder="Selecione a categoria do relato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="etica">Questões Éticas</SelectItem>
                      <SelectItem value="discriminacao">Discriminação/Assédio</SelectItem>
                      <SelectItem value="seguranca">Segurança do Trabalho</SelectItem>
                      <SelectItem value="fraude">Fraude/Corrupção</SelectItem>
                      <SelectItem value="conflito">Conflito de Interesse</SelectItem>
                      <SelectItem value="recursos">Uso Inadequado de Recursos</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição do ocorrido *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Descreva detalhadamente o que aconteceu, quando, onde, quem estava envolvido, etc. Quanto mais detalhes, melhor poderemos investigar."
                    rows={8}
                    required
                    className="focus-visible"
                  />
                  <p className="text-xs text-muted-foreground">
                    Inclua informações como: O que aconteceu? Quando? Onde? Quem estava envolvido? 
                    Há testemunhas? Já foi reportado antes?
                  </p>
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
                    Declaro que as informações fornecidas são verdadeiras e concordo com o 
                    tratamento confidencial dos dados de acordo com nossa{" "}
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
                      Enviando relato...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Relato
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Documents Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
              Documentos Relacionados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-2xl p-6 text-center">
                <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Código de Conduta
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Conheça nossos princípios éticos e diretrizes de conduta.
                </p>
                <Button variant="outline" size="sm" className="rounded-xl">
                  Baixar PDF
                </Button>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 text-center">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Política de Integridade
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Nossa política de combate à corrupção e conflitos de interesse.
                </p>
                <Button variant="outline" size="sm" className="rounded-xl">
                  Baixar PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IntegrityChannel;