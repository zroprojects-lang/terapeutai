-- TerapeutAI - Initial Schema
-- Run this in the Supabase SQL Editor

-- Therapists table
create table if not exists public.therapists (
  id uuid primary key references auth.users(id) on delete cascade,
  email varchar not null unique,
  name varchar not null,
  specialty varchar not null check (specialty in ('psicologo', 'holistico', 'ambos')),
  crp_number varchar,
  lgpd_consent_at timestamptz,
  created_at timestamptz default now() not null
);

-- Patients table
create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  therapist_id uuid not null references public.therapists(id) on delete cascade,
  name varchar not null,
  email varchar,
  phone varchar,
  birth_date date,
  status varchar not null default 'ativo' check (status in ('ativo', 'inativo', 'alta')),
  initial_complaint text,
  lgpd_consent_recorded boolean default false,
  lgpd_consent_at timestamptz,
  notes text,
  tags jsonb default '[]'::jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Sessions table
create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  therapist_id uuid not null references public.therapists(id) on delete cascade,
  date timestamptz not null,
  duration_minutes integer not null default 50,
  status varchar not null default 'realizada' check (status in ('realizada', 'cancelada', 'falta')),
  session_notes text not null,
  mood_rating integer not null check (mood_rating >= 1 and mood_rating <= 10),
  tags jsonb default '[]'::jsonb,
  ai_summary text,
  ai_patterns jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Audit logs table (LGPD)
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  therapist_id uuid not null references public.therapists(id) on delete cascade,
  action varchar not null check (action in ('CREATE', 'READ', 'UPDATE', 'DELETE', 'EXPORT')),
  entity varchar not null,
  entity_id uuid,
  ip_address varchar,
  created_at timestamptz default now() not null
);

-- Indexes
create index if not exists idx_patients_therapist on public.patients(therapist_id);
create index if not exists idx_patients_status on public.patients(therapist_id, status);
create index if not exists idx_sessions_patient on public.sessions(patient_id);
create index if not exists idx_sessions_therapist on public.sessions(therapist_id);
create index if not exists idx_sessions_date on public.sessions(therapist_id, date desc);
create index if not exists idx_audit_logs_therapist on public.audit_logs(therapist_id);

-- Row Level Security (RLS)
alter table public.therapists enable row level security;
alter table public.patients enable row level security;
alter table public.sessions enable row level security;
alter table public.audit_logs enable row level security;

-- Therapists: users can only see/edit their own profile
create policy "therapists_select_own" on public.therapists
  for select using (auth.uid() = id);
create policy "therapists_insert_own" on public.therapists
  for insert with check (auth.uid() = id);
create policy "therapists_update_own" on public.therapists
  for update using (auth.uid() = id);

-- Patients: therapists can only access their own patients
create policy "patients_select_own" on public.patients
  for select using (auth.uid() = therapist_id);
create policy "patients_insert_own" on public.patients
  for insert with check (auth.uid() = therapist_id);
create policy "patients_update_own" on public.patients
  for update using (auth.uid() = therapist_id);
create policy "patients_delete_own" on public.patients
  for delete using (auth.uid() = therapist_id);

-- Sessions: therapists can only access their own sessions
create policy "sessions_select_own" on public.sessions
  for select using (auth.uid() = therapist_id);
create policy "sessions_insert_own" on public.sessions
  for insert with check (auth.uid() = therapist_id);
create policy "sessions_update_own" on public.sessions
  for update using (auth.uid() = therapist_id);
create policy "sessions_delete_own" on public.sessions
  for delete using (auth.uid() = therapist_id);

-- Audit logs: therapists can only see their own logs, insert only
create policy "audit_select_own" on public.audit_logs
  for select using (auth.uid() = therapist_id);
create policy "audit_insert_own" on public.audit_logs
  for insert with check (auth.uid() = therapist_id);

-- Updated_at trigger
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger patients_updated_at
  before update on public.patients
  for each row execute function public.update_updated_at();

create trigger sessions_updated_at
  before update on public.sessions
  for each row execute function public.update_updated_at();
