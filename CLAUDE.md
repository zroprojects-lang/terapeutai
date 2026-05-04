@AGENTS.md

# TerapeutAI

SaaS de gestao de pacientes para terapeutas holisticos e psicologos, com IA para analise de padroes.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Supabase (PostgreSQL + Auth + RLS)
- Claude API (Anthropic) para funcionalidades de IA
- Vercel (deploy)

## Estrutura

- `src/app/(auth)/` — Login e registro
- `src/app/(dashboard)/` — Area logada (dashboard, patients, sessions, settings)
- `src/app/api/` — API routes (patients, sessions, ai/summarize, export)
- `src/components/ui/` — shadcn/ui components
- `src/components/` — Components do app (patients, sessions, charts, layout)
- `src/lib/supabase/` — Supabase clients (client.ts, server.ts, middleware.ts)
- `src/lib/ai/` — AI utilities (sanitize.ts, prompts.ts)
- `src/lib/validators.ts` — Zod schemas
- `src/types/database.ts` — TypeScript types
- `supabase/migrations/` — SQL migrations

## Comandos

- `npm run dev` — Dev server
- `npm run build` — Build
- `npm run lint` — ESLint

## Convencoes

- Server Components por padrao, Client Components apenas quando necessario ('use client')
- Supabase server client em Server Components: `import { createClient } from '@/lib/supabase/server'`
- Supabase browser client em Client Components: `import { createClient } from '@/lib/supabase/client'`
- RLS garante isolamento de dados por terapeuta
- Dados sensiveis de pacientes devem ser anonimizados antes de enviar para IA (sanitizeForAI)
- Toda operacao em dados sensiveis deve gerar audit_log
- IA nunca diagnostica — apenas sugere pontos de atencao com disclaimer
