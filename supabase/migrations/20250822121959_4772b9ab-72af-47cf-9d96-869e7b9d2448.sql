-- Remover serviço "Tapa-buraco" e atualizar "Manutenção"
begin;

-- 1) Atualizar descrições do serviço Manutenção para incorporar tapa-buraco
update public.services
set 
  short_description = trim(both from coalesce(short_description, '')) || ' Inclui reparos de pavimento (tapa-buraco).',
  full_description = case
    when coalesce(full_description, '') = '' then 'Inclui serviços de reparo localizado em pavimentos asfálticos e de concreto (tapa-buraco), fresagem e recomposição, selagem de trincas e tratamento de panelas, garantindo segurança e durabilidade viária.'
    else full_description || E'\n\nInclui serviços de reparo localizado em pavimentos asfálticos e de concreto (tapa-buraco), fresagem e recomposição, selagem de trincas e tratamento de panelas, garantindo segurança e durabilidade viária.'
  end,
  updated_at = now()
where id = '21468c45-d1fd-4489-bdc5-dfb53382f3cf'; -- slug: manutencao

-- 2) Remover o serviço Tapa-buraco
delete from public.services 
where id = '2f96b145-0463-4867-a812-4319c21da396'; -- slug: tapa-buraco

-- 3) Renumerar a ordem de exibição para manter sequência contínua
with ordered as (
  select id, row_number() over (order by display_order asc, title asc) as new_order
  from public.services
)
update public.services s
set display_order = o.new_order,
    updated_at = now()
from ordered o
where s.id = o.id;

commit;