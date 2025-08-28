
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PortfolioProject {
  id: string;
  title: string;
  slug: string;
  location: string;
  year: string;
  description: string | null;
  client: string | null;
  main_image_url: string | null;
  category_id: string;
  service_id?: string | null; // Added back as optional to satisfy form usage
  created_at: string;
  updated_at: string;
  portfolio_categories: {
    name: string;
    slug: string;
  };
  services?: {
    title: string;
    slug: string;
  } | null;
}

export interface PortfolioCategory {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface PortfolioImage {
  id: string;
  project_id: string;
  image_url: string;
  alt_text: string | null;
  is_main: boolean;
  display_order: number;
  created_at: string;
}

export const useAdminPortfolioProjects = () => {
  return useQuery({
    queryKey: ["admin-portfolio-projects"],
    queryFn: async (): Promise<PortfolioProject[]> => {
      const { data, error } = await supabase
        .from("portfolio_projects")
        .select(`
          id,
          title,
          slug,
          location,
          year,
          description,
          client,
          main_image_url,
          category_id,
          created_at,
          updated_at,
          portfolio_categories!inner(name, slug)
        `) // Removed invalid "services(title, slug)" to avoid SelectQueryError
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching portfolio projects:", error);
        throw error;
      }

      return data || [];
    },
  });
};

export const useAdminPortfolioCategories = () => {
  return useQuery({
    queryKey: ["admin-portfolio-categories"],
    queryFn: async (): Promise<PortfolioCategory[]> => {
      const { data, error } = await supabase
        .from("portfolio_categories")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching portfolio categories:", error);
        throw error;
      }

      return data || [];
    },
  });
};

export const usePortfolioImages = (projectId: string) => {
  return useQuery({
    queryKey: ["portfolio-images", projectId],
    queryFn: async (): Promise<PortfolioImage[]> => {
      const { data, error } = await supabase
        .from("portfolio_images")
        .select("*")
        .eq("project_id", projectId)
        .order("display_order");

      if (error) {
        console.error("Error fetching portfolio images:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!projectId,
  });
};
