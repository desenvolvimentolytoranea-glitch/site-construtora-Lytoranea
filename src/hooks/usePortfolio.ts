import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  location: string;
  year: string;
  image: string;
  slug: string;
}

export const usePortfolio = () => {
  return useQuery({
    queryKey: ["portfolio"],
    queryFn: async (): Promise<PortfolioItem[]> => {
      const { data, error } = await supabase
        .from("portfolio_projects")
        .select(`
          id,
          title,
          location,
          year,
          slug,
          main_image_url,
          portfolio_categories!inner(name)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching portfolio:", error);
        throw error;
      }

      return (data || []).map((project) => ({
        id: project.id,
        title: project.title,
        category: project.portfolio_categories.name,
        location: project.location,
        year: project.year,
        image: project.main_image_url,
        slug: project.slug,
      }));
    },
  });
};

export const usePortfolioCategories = () => {
  return useQuery({
    queryKey: ["portfolio-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolio_categories")
        .select("name, slug")
        .order("name");

      if (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }

      return data || [];
    },
  });
};