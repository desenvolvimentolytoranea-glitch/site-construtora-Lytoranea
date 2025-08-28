import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  title: string;
  description: string;
  image?: string;
  href: string;
  className?: string;
}

export function ServiceCard({ title, description, image, href, className }: ServiceCardProps) {
  return (
    <Link
      to={href}
      className={cn(
        "group relative block overflow-hidden rounded-2xl bg-card hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:shadow-2xl",
        className
      )}
    >
      {/* Background Image */}
      {image && (
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={`Serviço de ${title}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </div>
      )}

      {/* Content Overlay */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-t from-brand-black/90 via-brand-black/40 to-transparent",
        !image && "relative bg-card border border-border"
      )}>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-brand-white">
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-brand-gray line-clamp-2 mb-4">
            {description}
          </p>
          <div className="flex items-center text-sm font-medium text-primary">
            <span>Saiba mais</span>
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>

      {/* Card without image variant */}
      {!image && (
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {description}
          </p>
          <div className="flex items-center text-sm font-medium text-primary">
            <span>Saiba mais</span>
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      )}
    </Link>
  );
}