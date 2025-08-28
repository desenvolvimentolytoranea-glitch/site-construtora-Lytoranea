
-- 1) Adiciona coluna service_id e índice
alter table public.portfolio_projects
  add column if not exists service_id uuid references public.services(id) on delete set null;

create index if not exists portfolio_projects_service_id_idx
  on public.portfolio_projects(service_id);

-- 2) Backfill: tenta casar por slug
update public.portfolio_projects p
set service_id = s.id
from public.services s
join public.portfolio_categories c on c.id = p.category_id
where p.service_id is null
  and s.slug = c.slug;

-- 3) Backfill adicional: tenta casar por nome/título (case-insensitive)
update public.portfolio_projects p
set service_id = s.id
from public.services s
join public.portfolio_categories c on c.id = p.category_id
where p.service_id is null
  and lower(s.title) = lower(c.name);

-- 4) Nova função RPC com suporte a service_id
create or replace function public.admin_upsert_portfolio_project_v2(
  p_token uuid,
  p_id uuid,
  p_category_id uuid,
  p_title text,
  p_slug text,
  p_location text,
  p_year text,
  p_description text,
  p_client text,
  p_main_image_url text,
  p_service_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin uuid;
  v_id uuid;
begin
  v_admin := public.get_admin_id_from_token(p_token);
  if v_admin is null then
    raise exception 'unauthorized';
  end if;

  if p_id is null then
    insert into public.portfolio_projects (
      category_id, title, slug, location, year, description, client, main_image_url, service_id
    ) values (
      p_category_id, p_title, p_slug, p_location, p_year, p_description, p_client, p_main_image_url, p_service_id
    )
    returning id into v_id;
  else
    update public.portfolio_projects
    set category_id = p_category_id,
        title = p_title,
        slug = p_slug,
        location = p_location,
        year = p_year,
        description = p_description,
        client = p_client,
        main_image_url = p_main_image_url,
        service_id = p_service_id
    where id = p_id
    returning id into v_id;
  end if;

  return v_id;
end;
$$;
