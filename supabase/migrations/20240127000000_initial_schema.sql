-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto"; -- For immutable logs signing if needed

-- ENUMS --
create type user_role as enum ('ADMIN_TIC', 'ANALISTA_SOC', 'RESPONSABLE_RIESGO', 'AUDITOR_INTERNO', 'DIRECTIVO');
create type classification_level as enum ('PUBLICA', 'USO_INTERNO', 'RESTRINGIDA');
create type asset_type as enum ('SERVIDOR', 'APLICATIVO', 'RED', 'RADIO', 'ESTACION', 'SIG', 'USUARIO', 'OTRO');
create type vulnerability_status as enum ('ABIERTA', 'MITIGADA', 'ACEPTADA');
create type incident_severity as enum ('BAJA', 'MEDIA', 'ALTA', 'CRITICA');
create type control_maturity as enum ('INEXISTENTE', 'INICIAL', 'REPETIBLE', 'DEFINIDO', 'GESTIONADO', 'OPTIMIZADO');

-- PROFILES (Extends auth.users) --
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  role user_role not null default 'RESPONSABLE_RIESGO',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ASSETS --
create table assets (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  type asset_type not null,
  criticality int check (criticality between 1 and 5),
  confidentiality int check (confidentiality between 1 and 5),
  integrity int check (integrity between 1 and 5),
  availability int check (availability between 1 and 5),
  classification classification_level not null default 'USO_INTERNO',
  owner_id uuid references profiles(id),
  location text, -- Sede, parque, etc.
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- VULNERABILITIES --
create table vulnerabilities (
  id uuid primary key default uuid_generate_v4(),
  asset_id uuid references assets(id) on delete cascade,
  cve text,
  description text not null,
  severity numeric, -- CVSS score
  status vulnerability_status default 'ABIERTA',
  detected_at timestamptz default now(),
  mitigation_deadline timestamptz,
  mitigated_at timestamptz
);

-- INCIDENTS --
create table incidents (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  severity incident_severity not null,
  asset_id uuid references assets(id) on delete set null,
  detected_at timestamptz default now(),
  status text default 'OPEN', -- OPEN, CLOSED, INVESTIGATING
  root_cause text
);

-- CONTROLS --
create table controls (
  id uuid primary key default uuid_generate_v4(),
  code text not null unique, -- e.g. "A.5.1"
  name text not null,
  description text,
  framework text default 'ISO27001'
);

-- CONTROL EVALUATIONS (Asset specific) --
create table asset_controls (
  id uuid primary key default uuid_generate_v4(),
  asset_id uuid references assets(id) on delete cascade,
  control_id uuid references controls(id) on delete cascade,
  maturity control_maturity default 'INICIAL',
  effectiveness numeric check (effectiveness between 0 and 100),
  evaluated_at timestamptz default now(),
  next_evaluation_at timestamptz,
  unique(asset_id, control_id)
);

-- AUDIT LOGS (Immutable) --
create table audit_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  details jsonb,
  created_at timestamptz default now()
);

-- FUNCTION: Update updated_at --
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_assets_updated_at before update on assets for each row execute procedure update_updated_at();

-- RLS POLICIES --

alter table profiles enable row level security;
alter table assets enable row level security;
alter table vulnerabilities enable row level security;
alter table incidents enable row level security;
alter table controls enable row level security;
alter table asset_controls enable row level security;
alter table audit_logs enable row level security;

-- Helper function to get user role
create or replace function get_my_role()
returns user_role as $$
  select role from public.profiles where id = auth.uid() limit 1;
$$ language sql security definer stable;

-- PROFILES Policies
create policy "Public profiles read" on profiles for select using (true);
create policy "Admin can update profiles" on profiles for update using (get_my_role() = 'ADMIN_TIC');

-- ASSETS Policies
create policy "Read assets" on assets for select using (true);
create policy "Admin/SOC create assets" on assets for insert with check (get_my_role() in ('ADMIN_TIC', 'ANALISTA_SOC'));
create policy "Admin/SOC update assets" on assets for update using (get_my_role() in ('ADMIN_TIC', 'ANALISTA_SOC'));
-- Auditor is read-only by default

-- VULNERABILITIES Policies
create policy "Read vulns" on vulnerabilities for select using (true);
create policy "SOC manage vulns" on vulnerabilities for all using (get_my_role() in ('ADMIN_TIC', 'ANALISTA_SOC'));

-- INCIDENTS Policies
create policy "Read incidents" on incidents for select using (true);
create policy "SOC manage incidents" on incidents for all using (get_my_role() in ('ADMIN_TIC', 'ANALISTA_SOC'));

-- AUDIT LOGS (Insert only, no update/delete)
create policy "Read logs based on role" on audit_logs for select using (get_my_role() in ('ADMIN_TIC', 'AUDITOR_INTERNO', 'DIRECTIVO'));
create policy "System create logs" on audit_logs for insert with check (true); -- Allow triggers/app to insert

