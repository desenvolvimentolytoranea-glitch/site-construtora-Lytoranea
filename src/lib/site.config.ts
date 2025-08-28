export const siteConfig = {
  name: "Construtora Lytorânea",
  description: "Construtora especializada em obras de infraestrutura com eficiência, inovação e experiência.",
  url: "https://lytoranea.com.br",
  
  contact: {
    address: {
      street: "Via Coletora, Lote 19 - Quadra C",
      district: "ZONA INDUSTRIAL",
      city: "Itaguaí",
      state: "RJ",
      zipCode: "23812-035",
      full: "Via Coletora, Lote 19 - Quadra C - ZONA INDUSTRIAL, Itaguaí - RJ, 23812-035"
    },
    phone: "(21) 2688-2063",
    email: "lytoranea@lytoranea.com.br",
    businessHours: {
      weekdays: "Segunda a Quinta: 7h às 17h",
      friday: "Sexta: 7h às 16h"
    }
  },

  services: [
    {
      id: "barragens",
      title: "Barragens",
      description: "Construção e manutenção de barragens para contenção de água e rejeitos.",
      slug: "barragens"
    },
    {
      id: "condominios-loteamentos",
      title: "Condomínios e Loteamentos",
      description: "Desenvolvimento de infraestrutura para empreendimentos habitacionais.",
      slug: "condominios-loteamentos"
    },
    {
      id: "contencoes",
      title: "Contenções",
      description: "Obras de contenção de encostas e estabilização de taludes.",
      slug: "contencoes"
    },
    {
      id: "drenagem-pluvial",
      title: "Drenagem Pluvial",
      description: "Sistemas de captação e escoamento de águas pluviais.",
      slug: "drenagem-pluvial"
    },
    {
      id: "irrigacao",
      title: "Irrigação",
      description: "Implantação de sistemas de irrigação para agricultura e paisagismo.",
      slug: "irrigacao"
    },
    {
      id: "obras-arte-especiais",
      title: "Obras de Arte Especiais",
      description: "Construção de pontes, viadutos e estruturas especiais.",
      slug: "obras-arte-especiais"
    },
    {
      id: "pavimentacao",
      title: "Pavimentação",
      description: "Pavimentação asfáltica e rígida para vias urbanas e rodoviárias.",
      slug: "pavimentacao"
    },
    {
      id: "recuperacao-ambiental",
      title: "Recuperação Ambiental",
      description: "Projetos de recuperação e preservação de áreas degradadas.",
      slug: "recuperacao-ambiental"
    },
    {
      id: "restauracao-conservacao-rodovias",
      title: "Restauração e Conservação de Rodovias",
      description: "Manutenção e restauração de pavimentos rodoviários.",
      slug: "restauracao-conservacao-rodovias"
    },
    {
      id: "saneamento",
      title: "Saneamento",
      description: "Obras de saneamento básico e tratamento de efluentes.",
      slug: "saneamento"
    },
    {
      id: "terraplenagem",
      title: "Terraplenagem",
      description: "Movimentação de terra e preparação de terrenos.",
      slug: "terraplenagem"
    },
    {
      id: "urbanizacao",
      title: "Urbanização",
      description: "Projetos de urbanização e infraestrutura urbana.",
      slug: "urbanizacao"
    }
  ],

  socialMedia: {
    instagram: "#",
    facebook: "#",
    linkedin: "#",
    youtube: "#"
  },

  navigation: [
    { name: "Home", href: "/" },
    { name: "Quem Somos", href: "/quem-somos" },
    { name: "Serviços", href: "/servicos", hasDropdown: true },
    { name: "Portfólio", href: "/portfolio" },
    { name: "Canal de Integridade", href: "/canal-de-integridade" },
    { name: "Contato", href: "/contato" }
  ]
};

export type Service = (typeof siteConfig.services)[0];
export type NavigationItem = (typeof siteConfig.navigation)[0];