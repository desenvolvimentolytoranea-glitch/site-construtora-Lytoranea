-- Create clients table
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  website TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Clients are publicly readable" 
ON public.clients 
FOR SELECT 
USING (is_active = true);

-- Create storage bucket for client logos
INSERT INTO storage.buckets (id, name, public) VALUES ('clients', 'clients', true);

-- Create storage policies for client logos
CREATE POLICY "Client logos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'clients');

CREATE POLICY "Admins can upload client logos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'clients' AND public.is_admin_session());

CREATE POLICY "Admins can update client logos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'clients' AND public.is_admin_session());

CREATE POLICY "Admins can delete client logos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'clients' AND public.is_admin_session());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON public.clients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create admin functions for client management
CREATE OR REPLACE FUNCTION public.admin_upsert_client(
  p_token UUID,
  p_id UUID,
  p_name TEXT,
  p_slug TEXT,
  p_logo_url TEXT,
  p_website TEXT,
  p_display_order INTEGER,
  p_is_active BOOLEAN
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin UUID;
  v_id UUID;
BEGIN
  v_admin := public.get_admin_id_from_token(p_token);
  IF v_admin IS NULL THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;

  IF p_id IS NULL THEN
    INSERT INTO public.clients (name, slug, logo_url, website, display_order, is_active)
    VALUES (p_name, p_slug, p_logo_url, p_website, COALESCE(p_display_order, 0), COALESCE(p_is_active, true))
    RETURNING id INTO v_id;
  ELSE
    UPDATE public.clients
    SET name = p_name,
        slug = p_slug,
        logo_url = p_logo_url,
        website = p_website,
        display_order = COALESCE(p_display_order, display_order),
        is_active = COALESCE(p_is_active, is_active)
    WHERE id = p_id
    RETURNING id INTO v_id;
  END IF;

  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_delete_client(
  p_token UUID,
  p_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin UUID;
BEGIN
  v_admin := public.get_admin_id_from_token(p_token);
  IF v_admin IS NULL THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;

  DELETE FROM public.clients WHERE id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_update_client_logo(
  p_token UUID,
  p_client_id UUID,
  p_logo_url TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin UUID;
BEGIN
  v_admin := public.get_admin_id_from_token(p_token);
  IF v_admin IS NULL THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;

  UPDATE public.clients
  SET logo_url = p_logo_url
  WHERE id = p_client_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_remove_client_logo(
  p_token UUID,
  p_client_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin UUID;
BEGIN
  v_admin := public.get_admin_id_from_token(p_token);
  IF v_admin IS NULL THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;

  UPDATE public.clients
  SET logo_url = NULL
  WHERE id = p_client_id;
END;
$$;