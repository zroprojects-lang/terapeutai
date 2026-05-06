@AGENTS.md

# TerapeutAI

SaaS de gestão de clientes para terapeutas holísticos brasileiros, com IA para análise de padrões e linguagem holística.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui (usa @base-ui/react, NÃO Radix)
- Supabase (PostgreSQL + Auth + RLS) — região sa-east-1
- Groq API (Llama 3.3 70B) para funcionalidades de IA
- Vercel (deploy)

## Estrutura

- `src/app/(auth)/` — Login, registro, forgot-password, reset-password
- `src/app/(dashboard)/` — Área logada (dashboard, patients, sessions, settings, financeiro, onboarding)
- `src/app/api/` — API routes (patients, sessions, ai/summarize, export, payments)
- `src/app/privacidade/` e `src/app/termos/` — Páginas legais públicas
- `src/components/ui/` — shadcn/ui components
- `src/components/landing/` — Landing page (hero, features, testimonials, pricing, faq, footer, urgency-banner, feedback-button)
- `src/components/packages/` — Sistema de pacotes de sessões
- `src/components/patients/` — Componentes de clientes (new, edit, delete, anamnese)
- `src/components/sessions/` — Componentes de sessões
- `src/components/layout/` — Sidebar
- `src/lib/supabase/` — Supabase clients (client.ts, server.ts, middleware.ts)
- `src/lib/ai/` — AI utilities (sanitize.ts, prompts.ts) — prompt holístico
- `src/types/database.ts` — TypeScript types (Patient, Session, Package, Transaction)
- `supabase/migrations/` — SQL migrations (001-004)

## Comandos

- `npm run dev` — Dev server
- `npm run build` — Build
- `npm run lint` — ESLint

## Convenções

- Server Components por padrão, Client Components apenas quando necessário ('use client')
- Supabase server client em Server Components: `import { createClient } from '@/lib/supabase/server'`
- Supabase browser client em Client Components: `import { createClient } from '@/lib/supabase/client'`
- RLS garante isolamento de dados por terapeuta
- Dados sensíveis de clientes devem ser anonimizados antes de enviar para IA (sanitizeForAI)
- IA nunca diagnostica — apenas sugere pontos de atenção com disclaimer
- Linguagem: "cliente" (não "paciente") no contexto holístico
- Dialog (shadcn/ui): usa `render={<Button />}` em vez de `asChild`
- Select `onValueChange` recebe `string | null` — sempre checar antes de setar state
- Middleware: rotas públicas definidas em array `publicPaths` em middleware.ts
- useSearchParams() deve estar dentro de Suspense boundary
