-- Tullinge Bilteknik Database Schema
-- Run this in the Supabase SQL Editor

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================
-- SERVICES TABLE
-- ============================================
create table public.services (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text unique not null,
  description text not null default '',
  long_description text not null default '',
  icon text not null default 'Wrench',
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.services enable row level security;

create policy "Public can read visible services"
  on public.services for select
  using (true);

create policy "Authenticated users can insert services"
  on public.services for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update services"
  on public.services for update
  to authenticated
  using (true);

create policy "Authenticated users can delete services"
  on public.services for delete
  to authenticated
  using (true);

-- ============================================
-- ARTICLES TABLE
-- ============================================
create table public.articles (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text unique not null,
  excerpt text not null default '',
  content text not null default '',
  cover_image text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.articles enable row level security;

create policy "Public can read published articles"
  on public.articles for select
  using (true);

create policy "Authenticated users can insert articles"
  on public.articles for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update articles"
  on public.articles for update
  to authenticated
  using (true);

create policy "Authenticated users can delete articles"
  on public.articles for delete
  to authenticated
  using (true);

-- ============================================
-- LEADS TABLE
-- ============================================
create table public.leads (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null default '',
  phone text not null default '',
  service_interest text,
  message text not null default '',
  status text not null default 'new' check (status in ('new', 'booked', 'in_progress', 'completed')),
  reg_number text,
  car_model text,
  selected_services text[],
  preferred_time text,
  notes text,
  source_page text not null default '',
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

create policy "Anyone can insert leads"
  on public.leads for insert
  with check (true);

create policy "Authenticated users can read leads"
  on public.leads for select
  to authenticated
  using (true);

create policy "Authenticated users can update leads"
  on public.leads for update
  to authenticated
  using (true);

create policy "Authenticated users can delete leads"
  on public.leads for delete
  to authenticated
  using (true);

-- ============================================
-- MECHANICS TABLE
-- ============================================
create table public.mechanics (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text unique,
  is_active boolean default true,
  created_at timestamptz not null default now()
);

alter table public.mechanics enable row level security;

create policy "Authenticated users can read mechanics"
  on public.mechanics for select
  to authenticated
  using (true);

create policy "Authenticated users can manage mechanics"
  on public.mechanics for all
  to authenticated
  using (true)
  with check (true);

-- ============================================
-- BOOKINGS TABLE
-- ============================================
create table public.bookings (
  id uuid default gen_random_uuid() primary key,
  lead_id uuid not null references public.leads(id) on delete cascade,
  mechanic_id uuid not null references public.mechanics(id) on delete restrict,
  scheduled_date date not null,
  start_time time not null,
  end_time time not null,
  notes text,
  created_at timestamptz not null default now(),
  constraint valid_time_range check (end_time > start_time)
);

create index idx_bookings_date on public.bookings(scheduled_date);
create index idx_bookings_mechanic on public.bookings(mechanic_id, scheduled_date);

alter table public.bookings enable row level security;

create policy "Authenticated users can read bookings"
  on public.bookings for select
  to authenticated
  using (true);

create policy "Authenticated users can manage bookings"
  on public.bookings for all
  to authenticated
  using (true)
  with check (true);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_services_updated
  before update on public.services
  for each row execute function public.handle_updated_at();

create trigger on_articles_updated
  before update on public.articles
  for each row execute function public.handle_updated_at();

-- ============================================
-- SEED DATA: SERVICES
-- ============================================
insert into public.services (title, slug, description, long_description, icon, sort_order) values
  ('Service & underhåll', 'service-underhall', 'Regelbunden service förlänger bilens livslängd och håller den i toppskick.', 'Vi utför service enligt tillverkarens rekommendationer på alla bilmärken. Regelbunden service är det bästa sättet att hålla din bil i gott skick och förebygga dyra reparationer. Vi använder kvalitetsdelar och godkända oljor.', 'Settings', 1),
  ('Bromsar', 'bromsar', 'Säkra bromsar är livsviktigt. Vi byter bromsbelägg, skivor och vätskor.', 'Bromsarna är bilens viktigaste säkerhetssystem. Vi kontrollerar, reparerar och byter bromsbelägg, bromsskivor, bromstrummor och bromsvätska. Vi utför även bromsjustering och felsökning av ABS-system.', 'ShieldCheck', 2),
  ('Däck & hjul', 'dack-hjul', 'Däckbyte, balansering, och hjulinställning för säker körning året runt.', 'Vi erbjuder säsongsbyte av däck, balansering, hjulinställning och reparation av punkteringar. Vi hjälper dig även att välja rätt däck för din bil och körstil. Förvaring av däck kan ordnas.', 'Circle', 3),
  ('AC-service', 'ac-service', 'Håll kupén sval med regelbunden AC-service och påfyllning.', 'En väl fungerande AC är viktig för komforten i bilen. Vi utför AC-service, påfyllning av köldmedium, läcksökning och reparation. Rekommenderat att serva AC:n vartannat år.', 'Thermometer', 4),
  ('Felsökning & diagnostik', 'felsökning-diagnostik', 'Modern diagnosutrustning för att hitta och lösa problem snabbt.', 'Med avancerad diagnosutrustning kan vi snabbt identifiera fel i bilens elektronik, motor och övriga system. Vi läser felkoder, utför funktionstester och ger dig en tydlig rapport med åtgärdsförslag.', 'Search', 5),
  ('Besiktningsförberedelse', 'besiktningsförberedelse', 'Vi förbereder din bil inför besiktningen så att den klarar sig.', 'Undvik obehagliga överraskningar vid besiktningen. Vi går igenom din bil enligt besiktningsprotokoll och åtgärdar eventuella brister innan du kör till besiktningen. Sparar tid och pengar.', 'ClipboardCheck', 6),
  ('Oljebyte', 'oljebyte', 'Regelbundet oljebyte skyddar motorn och förlänger dess livslängd.', 'Vi byter motorolja och oljefilter enligt tillverkarens specifikationer. Rätt olja i rätt mängd är avgörande för motorns hälsa. Vi använder alltid godkända oljor som passar just din bil.', 'Droplets', 7),
  ('Avgassystem', 'avgassystem', 'Reparation och byte av avgasrör, katalysator och ljuddämpare.', 'Ett fungerande avgassystem är viktigt för både miljön och bilens prestanda. Vi reparerar och byter avgasrör, katalysatorer, ljuddämpare och lambdasonder. Vi utför även avgastester.', 'Wind', 8),
  ('Koppling & växellåda', 'koppling-vaxellada', 'Expert på kopplingsbyten och reparation av manuella och automatiska växellådor.', 'Vi utför kopplingsbyten, reparation av växellådor (både manuella och automatiska), samt byte av växellådsolja. Symptom som slirande koppling, svårt att lägga i växlar eller oljud bör undersökas snarast.', 'Cog', 9),
  ('Elektronik & elsystem', 'elektronik-elsystem', 'Felsökning och reparation av bilens elsystem och elektronik.', 'Moderna bilar har avancerad elektronik. Vi felsöker och reparerar startmotorer, generatorer, belysning, centrallås, elvindrutetorkare och övrig elektronik. Vi hjälper även med batteribyten och laddningsproblem.', 'Zap', 10);

-- ============================================
-- STORAGE BUCKET
-- ============================================
-- Run this separately or via Supabase Dashboard:
-- Create a public bucket called "images"
-- insert into storage.buckets (id, name, public) values ('images', 'images', true);
