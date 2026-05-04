-- Add plan to therapists
alter table public.therapists
  add column if not exists plan varchar not null default 'gratuito'
  check (plan in ('gratuito', 'profissional', 'clinica'));

alter table public.therapists
  add column if not exists plan_activated_at timestamptz;
