import { useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePortfolio, type PortfolioItem } from "@/hooks/usePortfolio";

interface PortfolioGridProps {
  items?: PortfolioItem[];
  showFilters?: boolean;
  maxItems?: number;
  className?: string;
}

export function PortfolioGrid({ 
  items: propItems, 
  showFilters = false, 
  maxItems,
  className 
}: PortfolioGridProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  
  // Use hook data if no items are provided as props
  const { data: hookItems = [], isLoading } = usePortfolio();
  const items = propItems || hookItems;

  if (isLoading && !propItems) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  const displayItems = maxItems ? items.slice(0, maxItems) : items;
  const filteredItems = activeFilter === "all" 
    ? displayItems 
    : displayItems.filter(item => item.category === activeFilter);

  const categories = ["all", ...Array.from(new Set(items.map(item => item.category)))];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Filter Buttons */}
      {showFilters && (
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 focus-visible",
                activeFilter === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {category === "all" ? "Todos" : category}
            </button>
          ))}
        </div>
      )}

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group relative overflow-hidden rounded-2xl bg-card hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Link 
              to={`/portfolio/${item.slug}`}
              className="block relative"
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={`Projeto ${item.title} - ${item.location}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-brand-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-brand-white">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-brand-gray mb-1">
                        {item.location}
                      </p>
                      <div className="flex items-center space-x-3">
                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                          {item.category}
                        </span>
                        <span className="text-xs text-brand-gray">
                          {item.year}
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-2 flex-shrink-0" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Show All Button */}
      {maxItems && items.length > maxItems && (
        <div className="text-center">
          <Link
            to="/portfolio"
            className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-semibold hover:bg-primary/90 transition-colors focus-visible"
          >
            <span>Ver todo o portfólio</span>
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}