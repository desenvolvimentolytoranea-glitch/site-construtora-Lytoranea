import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { siteConfig } from "@/lib/site.config";
import heroImage from "@/assets/hero-construction.jpg";

const heroTexts = ["EFICIÊNCIA", "INOVAÇÃO", "EXPERIÊNCIA"];

export function HeroSection() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % heroTexts.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      id="main-content"
      className="relative h-[82vh] md:h-[92vh] overflow-hidden"
      aria-label="Seção principal da página"
    >
      {/* Background Image/Video with overlay */}
      <div className="absolute inset-0">
        {isMobile ? (
          <img
            src={heroImage}
            alt="Construção civil com maquinário pesado"
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            src="https://cdn.pixabay.com/video/2025/08/25/299711.mp4"
            poster={heroImage}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Vídeo de fundo mostrando construção civil com maquinário pesado"
          />
        )}
        {/* Simplified overlay */}
        <div className="absolute inset-0 bg-black/45"></div>
      </div>

      {/* BLOCO MOVIDO PARA O CANTO ESQUERDO INFERIOR */}
      <div className="absolute left-4 bottom-8 md:left-16 md:bottom-20 z-10 text-left max-w-3xl">
        <h1 className="text-white uppercase font-extrabold tracking-wide leading-tight text-4xl sm:text-5xl md:text-6xl">
          Construindo com
        </h1>

        <div className="relative mt-2">
          {heroTexts.map((text, index) => (
            <span
              key={text}
              className={cn(
                "block uppercase font-extrabold leading-none transition-all duration-1000 text-4xl sm:text-5xl md:text-6xl",
                "text-[hsl(var(--brand-red))]",
                index === currentTextIndex 
                  ? "opacity-100 transform translate-y-0" 
                  : "opacity-0 transform translate-y-4 absolute top-0"
              )}
              aria-live={index === currentTextIndex ? "polite" : undefined}
            >
              {text}
            </span>
          ))}
        </div>

        <p className="mt-4 text-white/80 max-w-xl text-lg">
          {siteConfig.description}
        </p>

        <div className="mt-6">
          <Link 
            to="/servicos"
            className="inline-block bg-[hsl(var(--brand-red))] text-white rounded-full px-6 py-3 hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[hsl(var(--brand-red))] transition-all duration-300"
          >
            Conheça nossos serviços
          </Link>
        </div>
      </div>
    </section>
  );
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}