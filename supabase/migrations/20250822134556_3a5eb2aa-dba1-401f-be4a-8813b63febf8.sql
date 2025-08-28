
-- 1) Tabela de sessões de admin
create table if not exists public.admin_sessions (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references public.admin_users(id) on delete cascade,
  token uuid not null unique default gen_random_uuid(),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '8 hours',
  revoked boolean not null default false
);

create index if not exists admin_sessions_token_idx on public.admin_sessions(token);
create index if not exists admin_sessions_expires_at_idx on public.admin_sessions(expires_at);

alter table public.admin_sessions enable row level security;

-- Políticas: ninguém acessa diretamente as sessões (apenas via funções)
drop policy if exists "No direct access to admin_sessions" on public.admin_sessions;
create policy "No direct access to admin_sessions"
on public.admin_sessions
as restrictive
for all
using (false)
with check (false);

-- 2) Funções utilitárias de autenticação/sessão

create or replace function public.get_admin_id_from_token(p_token uuid)
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select admin_id
  from public.admin_sessions s
  where s.token = p_token
    and s.revoked = false
    and s.expires_at > now()
  limit 1
$$;

-- Cria (ou renova) sessão
create or replace function public.admin_create_session(admin_email text, admin_password text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  adm record;
  sess_id uuid;
  sess_token uuid;
  result json;
begin
  -- Localiza admin ativo
  select id, email, password_hash, name, is_active
    into adm
  from public.admin_users
  where email = admin_email and is_active = true;

  if not found then
    return json_build_object('success', false, 'message', 'Credenciais inválidas');
  end if;

  -- ATENÇÃO: Substituir por verificação de hash (bcrypt) em produção
  if adm.password_hash <> admin_password then
    return json_build_object('success', false, 'message', 'Credenciais inválidas');
  end if;

  -- Atualiza last_login
  update public.admin_users set last_login = now() where id = adm.id;

  -- Cria sessão
  insert into public.admin_sessions (admin_id)
  values (adm.id)
  returning id, token into sess_id, sess_token;

  result := json_build_object(
    'success', true,
    'token', sess_token,
    'admin', json_build_object(
      'id', adm.id,
      'email', adm.email,
      'name', adm.name
    )
  );

  return result;
end;
$$;

create or replace function public.admin_logout(p_token uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.admin_sessions
  set revoked = true
  where token = p_token;
end;
$$;

-- 3) Triggers para updated_at
-- Função já existe: public.update_updated_at_column()
-- Criar triggers nas tabelas que têm updated_at

drop trigger if exists set_updated_at_services on public.services;
create trigger set_updated_at_services
before update on public.services
for each row
execute function public.update_updated_at_column();

drop trigger if exists set_updated_at_portfolio_projects on public.portfolio_projects;
create trigger set_updated_at_portfolio_projects
before update on public.portfolio_projects
for each row
execute function public.update_updated_at_column();

-- 4) RPCs de manutenção (SECURITY DEFINER)

-- 4.1 Services
create or replace function public.admin_upsert_service(
  p_token uuid,
  p_id uuid,
  p_title text,
  p_slug text,
  p_short_description text,
  p_full_description text,
  p_icon text,
  p_display_order integer,
  p_image_url text
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
    insert into public.services (title, slug, short_description, full_description, icon, display_order, image_url)
    values (p_title, p_slug, p_short_description, p_full_description, p_icon, coalesce(p_display_order, 0), p_image_url)
    returning id into v_id;
  else
    update public.services
    set title = p_title,
        slug = p_slug,
        short_description = p_short_description,
        full_description = p_full_description,
        icon = p_icon,
        display_order = coalesce(p_display_order, display_order),
        image_url = p_image_url
    where id = p_id
    returning id into v_id;
  end if;

  return v_id;
end;
$$;

create or replace function public.admin_update_service_image(
  p_token uuid,
  p_service_id uuid,
  p_image_url text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin uuid;
begin
  v_admin := public.get_admin_id_from_token(p_token);
  if v_admin is null then
    raise exception 'unauthorized';
  end if;

  update public.services
  set image_url = p_image_url
  where id = p_service_id;
end;
$$;

create or replace function public.admin_remove_service_image(
  p_token uuid,
  p_service_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin uuid;
begin
  v_admin := public.get_admin_id_from_token(p_token);
  if v_admin is null then
    raise exception 'unauthorized';
  end if;

  update public.services
  set image_url = null
  where id = p_service_id;
end;
$$;

-- 4.2 Portfolio Categories
create or replace function public.admin_upsert_portfolio_category(
  p_token uuid,
  p_id uuid,
  p_name text,
  p_slug text
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
    insert into public.portfolio_categories (name, slug)
    values (p_name, p_slug)
    returning id into v_id;
  else
    update public.portfolio_categories
    set name = p_name,
        slug = p_slug
    where id = p_id
    returning id into v_id;
  end if;

  return v_id;
end;
$$;

create or replace function public.admin_delete_portfolio_category(
  p_token uuid,
  p_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin uuid;
begin
  v_admin := public.get_admin_id_from_token(p_token);
  if v_admin is null then
    raise exception 'unauthorized';
  end if;

  delete from public.portfolio_categories where id = p_id;
end;
$$;

-- 4.3 Portfolio Projects
create or replace function public.admin_upsert_portfolio_project(
  p_token uuid,
  p_id uuid,
  p_category_id uuid,
  p_title text,
  p_slug text,
  p_location text,
  p_year text,
  p_description text,
  p_client text,
  p_main_image_url text
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
      category_id, title, slug, location, year, description, client, main_image_url
    ) values (
      p_category_id, p_title, p_slug, p_location, p_year, p_description, p_client, p_main_image_url
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
        main_image_url = p_main_image_url
    where id = p_id
    returning id into v_id;
  end if;

  return v_id;
end;
$$;

create or replace function public.admin_delete_portfolio_project(
  p_token uuid,
  p_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin uuid;
begin
  v_admin := public.get_admin_id_from_token(p_token);
  if v_admin is null then
    raise exception 'unauthorized';
  end if;

  delete from public.portfolio_projects where id = p_id;
end;
$$;

-- 4.4 Portfolio Images
create or replace function public.admin_add_portfolio_image(
  p_token uuid,
  p_project_id uuid,
  p_image_url text,
  p_alt_text text,
  p_is_main boolean,
  p_display_order integer
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

  if coalesce(p_is_main, false) then
    -- zera anteriores como principal
    update public.portfolio_images
    set is_main = false
    where project_id = p_project_id;
  end if;

  insert into public.portfolio_images (
    project_id, image_url, alt_text, is_main, display_order
  ) values (
    p_project_id, p_image_url, p_alt_text, coalesce(p_is_main, false), coalesce(p_display_order, 0)
  )
  returning id into v_id;

  return v_id;
end;
$$;

create or replace function public.admin_delete_portfolio_image(
  p_token uuid,
  p_image_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin uuid;
begin
  v_admin := public.get_admin_id_from_token(p_token);
  if v_admin is null then
    raise exception 'unauthorized';
  end if;

  delete from public.portfolio_images where id = p_image_id;
end;
$$;

create or replace function public.admin_set_main_portfolio_image(
  p_token uuid,
  p_image_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin uuid;
  v_project uuid;
begin
  v_admin := public.get_admin_id_from_token(p_token);
  if v_admin is null then
    raise exception 'unauthorized';
  end if;

  select project_id into v_project from public.portfolio_images where id = p_image_id;

  if v_project is null then
    raise exception 'image_not_found';
  end if;

  update public.portfolio_images set is_main = false where project_id = v_project;
  update public.portfolio_images set is_main = true where id = p_image_id;
end;
$$;
