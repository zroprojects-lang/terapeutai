-- Appointments table
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  therapist_id uuid not null references public.therapists(id) on delete cascade,
  patient_id uuid not null references public.patients(id) on delete cascade,
  date timestamptz not null,
  duration_minutes integer not null default 50,
  status varchar not null default 'agendado' check (status in ('agendado', 'realizado', 'cancelado', 'falta')),
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index if not exists idx_appointments_therapist on public.appointments(therapist_id);
create index if not exists idx_appointments_date on public.appointments(therapist_id, date);

alter table public.appointments enable row level security;

create policy "appointments_select_own" on public.appointments
  for select using (auth.uid() = therapist_id);
create policy "appointments_insert_own" on public.appointments
  for insert with check (auth.uid() = therapist_id);
create policy "appointments_update_own" on public.appointments
  for update using (auth.uid() = therapist_id);
create policy "appointments_delete_own" on public.appointments
  for delete using (auth.uid() = therapist_id);

create trigger appointments_updated_at
  before update on public.appointments
  for each row execute function public.update_updated_at();
