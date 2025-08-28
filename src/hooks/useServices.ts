import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Service {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string | null;
  image_url: string | null;
  icon: string | null;
  display_order: number;
}

export const useServices = () => {
  return useQuery({
    queryKey: ["services"],
    queryFn: async (): Promise<Service[]> => {
      const { data, error } = await supabase
        .from("services")
        .select("*");

      if (error) {
        console.error("Error fetching services:", error);
        throw error;
      }

      // Sort alphabetically using Portuguese locale
      const sortedData = (data || []).sort((a, b) => 
        new Intl.Collator('pt-BR', { sensitivity: 'base' }).compare(a.title, b.title)
      );

      return sortedData;
    },
  });
};

export const useService = (slug: string) => {
  return useQuery({
    queryKey: ["service", slug],
    queryFn: async (): Promise<Service | null> => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        console.error("Error fetching service:", error);
        throw error;
      }

      return data;
    },
  });
};