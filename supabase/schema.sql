create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  image_url text,
  sort_order integer not null default 1,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.categories
add column if not exists image_url text;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  name text not null,
  description text,
  price numeric(10, 2) not null default 0,
  image_url text,
  badge text,
  is_available boolean not null default true,
  is_active boolean not null default true,
  sort_order integer not null default 1,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.settings (
  id integer primary key default 1 check (id = 1),
  cafe_name text not null default 'Coffeeine',
  logo_url text,
  hero_title text not null default 'Coffee, crafted with calm precision.',
  hero_subtitle text not null default 'Modern cafe menu built for quick QR ordering and beautiful brand presentation.',
  instagram_url text,
  phone text,
  address text,
  working_hours text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists categories_sort_order_idx on public.categories(sort_order);
create index if not exists categories_is_active_idx on public.categories(is_active);
create index if not exists products_category_sort_idx on public.products(category_id, sort_order);
create index if not exists products_is_active_idx on public.products(is_active);
create index if not exists products_is_available_idx on public.products(is_available);

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at
before update on public.categories
for each row
execute function public.set_updated_at();

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

drop trigger if exists settings_set_updated_at on public.settings;
create trigger settings_set_updated_at
before update on public.settings
for each row
execute function public.set_updated_at();

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.settings enable row level security;

insert into storage.buckets (id, name, public)
values ('coffeeine-media', 'coffeeine-media', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can read active categories" on public.categories;
create policy "Public can read active categories"
on public.categories
for select
using (is_active = true);

drop policy if exists "Authenticated can manage categories" on public.categories;
create policy "Authenticated can manage categories"
on public.categories
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
on public.products
for select
using (
  is_active = true
  and exists (
    select 1
    from public.categories
    where categories.id = products.category_id
      and categories.is_active = true
  )
);

drop policy if exists "Authenticated can manage products" on public.products;
create policy "Authenticated can manage products"
on public.products
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can read settings" on public.settings;
create policy "Public can read settings"
on public.settings
for select
using (true);

drop policy if exists "Authenticated can manage settings" on public.settings;
create policy "Authenticated can manage settings"
on public.settings
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can read Coffeeine media" on storage.objects;
create policy "Public can read Coffeeine media"
on storage.objects
for select
using (bucket_id = 'coffeeine-media');

drop policy if exists "Authenticated can upload Coffeeine media" on storage.objects;
create policy "Authenticated can upload Coffeeine media"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'coffeeine-media');

drop policy if exists "Authenticated can update Coffeeine media" on storage.objects;
create policy "Authenticated can update Coffeeine media"
on storage.objects
for update
to authenticated
using (bucket_id = 'coffeeine-media')
with check (bucket_id = 'coffeeine-media');

drop policy if exists "Authenticated can delete Coffeeine media" on storage.objects;
create policy "Authenticated can delete Coffeeine media"
on storage.objects
for delete
to authenticated
using (bucket_id = 'coffeeine-media');

comment on table public.categories is 'Coffeeine menu categories.';
comment on table public.products is 'Coffeeine menu products linked to categories.';
comment on table public.settings is 'Singleton table for global cafe info and hero content.';

-- Starter note:
-- These policies allow any authenticated Supabase user to manage content.
-- The app additionally supports an ADMIN_EMAILS allow-list in environment variables.
-- For stricter database-level control, replace the authenticated policies with a role/email claim check.
