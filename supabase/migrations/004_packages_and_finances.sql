-- TerapeutAI - Pacotes de Sessões e Controle Financeiro
-- Run this in the Supabase SQL Editor

-- Packages table
create table if not exists public.packages (
  id uuid primary key default gen_random_uuid(),
  therapist_id uuid not null references public.therapists(id) on delete cascade,
  patient_id uuid not null references public.patients(id) on delete cascade,
  name varchar not null,
  total_sessions integer not null check (total_sessions > 0),
  used_sessions integer not null default 0 check (used_sessions >= 0),
  total_value decimal(10,2) not null default 0,
  paid_value decimal(10,2) not null default 0,
  start_date date not null default current_date,
  expiration_date date,
  status varchar not null default 'ativo' check (status in ('ativo', 'concluido', 'expirado')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Add package_id to sessions table
alter table public.sessions add column if not exists package_id uuid references public.packages(id) on delete set null;

-- Financial transactions table
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  therapist_id uuid not null references public.therapists(id) on delete cascade,
  patient_id uuid references public.patients(id) on delete set null,
  package_id uuid references public.packages(id) on delete set null,
  description varchar not null,
  amount decimal(10,2) not null,
  payment_method varchar not null check (payment_method in ('pix', 'dinheiro', 'transferencia', 'cartao')),
  status varchar not null default 'pago' check (status in ('pago', 'pendente')),
  payment_date date not null default current_date,
  notes text,
  created_at timestamptz default now() not null
);

-- Indexes
create index if not exists idx_packages_therapist on public.packages(therapist_id);
create index if not exists idx_packages_patient on public.packages(patient_id);
create index if not exists idx_packages_status on public.packages(therapist_id, status);
create index if not exists idx_transactions_therapist on public.transactions(therapist_id);
create index if not exists idx_transactions_date on public.transactions(therapist_id, payment_date desc);
create index if not exists idx_transactions_status on public.transactions(therapist_id, status);
create index if not exists idx_sessions_package on public.sessions(package_id);

-- RLS
alter table public.packages enable row level security;
alter table public.transactions enable row level security;

-- Packages: therapists can only access their own packages
create policy "packages_select_own" on public.packages
  for select using (auth.uid() = therapist_id);
create policy "packages_insert_own" on public.packages
  for insert with check (auth.uid() = therapist_id);
create policy "packages_update_own" on public.packages
  for update using (auth.uid() = therapist_id);
create policy "packages_delete_own" on public.packages
  for delete using (auth.uid() = therapist_id);

-- Transactions: therapists can only access their own transactions
create policy "transactions_select_own" on public.transactions
  for select using (auth.uid() = therapist_id);
create policy "transactions_insert_own" on public.transactions
  for insert with check (auth.uid() = therapist_id);
create policy "transactions_update_own" on public.transactions
  for update using (auth.uid() = therapist_id);
create policy "transactions_delete_own" on public.transactions
  for delete using (auth.uid() = therapist_id);

-- Updated_at trigger for packages
create trigger packages_updated_at
  before update on public.packages
  for each row execute function public.update_updated_at();
