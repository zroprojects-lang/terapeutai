# TerapeutAI - Gestao Inteligente para Terapeutas

## Visao Geral

Plataforma SaaS de documentacao e gestao de pacientes para terapeutas holisticos e psicologos, com analise de padroes por IA. O diferencial e transformar anotacoes de sessoes em insights acionaveis: deteccao de padroes, evolucao do paciente e sugestoes de pontos de atencao.

**Principio central:** IA sugere, terapeuta decide. Sempre.

---

## Problema

- Maioria dos terapeutas usa caderno, planilha ou Notion para registrar sessoes
- Nao ha analise sistematica de evolucao do paciente ao longo do tempo
- Dificuldade em identificar padroes que se repetem entre sessoes
- Falta de compliance LGPD nos metodos atuais (caderno nao tem criptografia)
- Concorrentes existentes (Psicomanager, Clinicanuvem, Simplesmente) nao oferecem IA

## Publico-alvo

| Segmento | Estimativa Brasil | Disposicao a pagar |
|----------|-------------------|--------------------|
| Psicologos (CRP ativo) | ~400.000 | Media-alta (R$49-99/mes) |
| Terapeutas holisticos | ~200.000+ | Media-baixa (R$29-49/mes) |
| Psicanalistas | ~50.000 | Media (R$49-79/mes) |

**Foco inicial:** Psicologos com consultorio proprio que atendem 10+ pacientes por semana.
Holisticos como expansao secundaria (menos regulacao, mas menor ticket).

---

## Concorrencia

| Produto | Preco | IA | LGPD | Holisticos | Fraqueza |
|---------|-------|----|------|------------|----------|
| Psicomanager | R$69-149/mes | Nao | Parcial | Nao | Sem inteligencia, interface datada |
| Clinicanuvem | R$49-99/mes | Nao | Parcial | Nao | Generico (clinicas medicas) |
| Simplesmente | R$39-79/mes | Nao | Basico | Nao | Apenas agenda + prontuario basico |
| Jane App | US$54-79/mes | Nao | Nao (HIPAA) | Sim | Gringo, caro, sem LGPD |
| TherapyNotes | US$49/mes | Nao | Nao (HIPAA) | Nao | Americano, compliance EUA |
| Notion/Planilha | R$0 | Nao | Nao | N/A | Sem estrutura, sem seguranca |

**Gap claro:** Nenhum oferece IA para analise de padroes. Nenhum foca em holisticos. Poucos levam LGPD a serio.

---

## Diferencial Competitivo

1. **IA aplicada ao prontuario** - Resumos automaticos, deteccao de padroes, alertas de regressao
2. **Compliance LGPD nativo** - Criptografia, consentimento, audit log, portabilidade, direito ao esquecimento
3. **Nicho duplo** - Psicologos E holisticos no mesmo produto (abordagens configuráveis)
4. **Custo acessivel** - Precificacao para realidade brasileira

---

## Funcionalidades

### MVP (Semanas 1-4) - O minimo para validar

- [ ] Auth (email + senha)
- [ ] Cadastro e listagem de pacientes
- [ ] Registro de sessao (texto livre + humor 1-10 + tags)
- [ ] Timeline do paciente (historico de sessoes)
- [ ] Resumo automatico da sessao por IA
- [ ] Deteccao basica de padroes (frequencia de temas, variacao de humor)
- [ ] Grafico de evolucao do humor ao longo do tempo
- [ ] Export PDF do prontuario
- [ ] Consentimento LGPD do terapeuta e registro de consentimento do paciente
- [ ] Audit log basico (quem acessou o que, quando)

### Fase 2 (Apos validacao com beta testers)

- [ ] Agenda com recorrencia e lembretes por email
- [ ] Controle financeiro (pagamentos por sessao, inadimplencia)
- [ ] Dashboard com metricas do consultorio
- [ ] IA avancada: sugestoes de pontos de atencao, alertas de regressao
- [ ] Rastreamento multi-dimensional (ansiedade, humor, sono, energia, autoestima)
- [ ] Autenticacao 2FA
- [ ] Busca e filtros avancados

### Fase 3 (Escala)

- [ ] Planos pagos via Stripe ou Mercado Pago
- [ ] Onboarding guiado para novos terapeutas
- [ ] Templates de prontuario por abordagem (TCC, psicanalitica, holisticas)
- [ ] Relatorios avancados com IA
- [ ] API para integracoes
- [ ] App PWA otimizado para mobile

---

## Arquitetura Tecnica

### Stack

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| Frontend | Next.js 14 (App Router) + TypeScript | SSR, API routes no mesmo projeto, ecossistema maduro |
| UI | Tailwind CSS + shadcn/ui | Velocidade de desenvolvimento, design consistente |
| Backend | Next.js API Routes | Mesmo deploy, sem servidor separado |
| Banco de dados | Supabase (PostgreSQL) | Free tier generoso, Row Level Security, auth built-in |
| Auth | Supabase Auth | Gratis ate 50k users, integrado |
| IA | Claude API (Anthropic) | Qualidade superior para analise de texto em portugues |
| Deploy | Vercel | Free tier, integrado com Next.js |
| Email | Resend | Free tier 3k/mes, API simples |

### Custo estimado de infraestrutura

| Fase | Users | Custo/mes |
|------|-------|-----------|
| MVP/Beta | 0-10 | R$ 0 (free tiers) |
| Lancamento | 10-50 | R$ 50-100 |
| Crescimento | 50-200 | R$ 150-300 |
| Escala | 200-500 | R$ 300-500 |

### Estrutura do projeto

```
terapeutai/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Rotas de login/registro
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/        # Area logada
│   │   │   ├── dashboard/      # Pagina inicial
│   │   │   ├── patients/       # Listagem e ficha do paciente
│   │   │   │   └── [id]/       # Detalhes do paciente
│   │   │   ├── sessions/       # Registro e historico de sessoes
│   │   │   │   └── [id]/
│   │   │   └── settings/       # Config do terapeuta
│   │   ├── api/                # API Routes
│   │   │   ├── patients/
│   │   │   ├── sessions/
│   │   │   ├── ai/
│   │   │   └── export/
│   │   ├── layout.tsx
│   │   └── page.tsx            # Landing page
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── patients/           # Componentes de pacientes
│   │   ├── sessions/           # Componentes de sessoes
│   │   └── charts/             # Graficos de evolucao
│   ├── lib/
│   │   ├── supabase/           # Client e server Supabase
│   │   ├── ai/                 # Integracao com Claude API
│   │   ├── encryption.ts       # Criptografia de dados sensiveis
│   │   └── validators.ts       # Schemas Zod
│   ├── services/
│   │   ├── patients.ts
│   │   ├── sessions.ts
│   │   └── ai-analysis.ts
│   ├── hooks/                  # React hooks customizados
│   └── types/                  # TypeScript types
├── supabase/
│   └── migrations/             # SQL migrations
├── public/
├── .env.local                  # Variaveis de ambiente (nao commitar)
├── PROJETO.md                  # Este arquivo
└── CLAUDE.md                   # Instrucoes para Claude Code
```

### Modelo de dados (MVP)

```
therapists
├── id: uuid (PK)
├── email: varchar (unique)
├── name: varchar
├── specialty: enum (psicologo, holistico, ambos)
├── crp_number: varchar (nullable, para psicologos)
├── lgpd_consent_at: timestamp
└── created_at: timestamp

patients
├── id: uuid (PK)
├── therapist_id: uuid (FK -> therapists)
├── name: varchar [ENCRYPTED]
├── email: varchar [ENCRYPTED] (nullable)
├── phone: varchar [ENCRYPTED] (nullable)
├── birth_date: date [ENCRYPTED] (nullable)
├── status: enum (ativo, inativo, alta)
├── initial_complaint: text [ENCRYPTED]
├── lgpd_consent_recorded: boolean
├── lgpd_consent_at: timestamp (nullable)
├── notes: text [ENCRYPTED]
├── tags: jsonb
├── created_at: timestamp
└── updated_at: timestamp

sessions
├── id: uuid (PK)
├── patient_id: uuid (FK -> patients)
├── therapist_id: uuid (FK -> therapists)
├── date: timestamp
├── duration_minutes: integer
├── status: enum (realizada, cancelada, falta)
├── session_notes: text [ENCRYPTED]
├── mood_rating: integer (1-10)
├── tags: jsonb
├── ai_summary: text [ENCRYPTED]
├── ai_patterns: jsonb [ENCRYPTED]
├── created_at: timestamp
└── updated_at: timestamp

audit_logs
├── id: uuid (PK)
├── therapist_id: uuid (FK -> therapists)
├── action: varchar (CREATE, READ, UPDATE, DELETE, EXPORT)
├── entity: varchar
├── entity_id: uuid
├── ip_address: varchar
├── created_at: timestamp
```

Nota sobre criptografia: Campos marcados [ENCRYPTED] usam criptografia application-level (AES-256-CBC). Isso significa que buscas e ordenacoes nesses campos nao funcionam diretamente no banco. Para o MVP, busca de pacientes sera pelo ID ou por campos nao cifrados (tags, status). Se busca por nome for critica, considerar criptografia deterministica ou busca em indice separado.

---

## Compliance LGPD

### Obrigacoes legais

Dados de saude sao **dados sensiveis** pela LGPD (Art. 5, II). Bases legais aplicaveis:
- **Consentimento explicito** do titular (Art. 7, I + Art. 11, I)
- **Tutela da saude** por profissionais da area (Art. 7, VIII + Art. 11, II, f)

### Regulamentacao profissional

Para psicologos (CFP):
- Prontuario obrigatorio (Resolucao CFP 001/2009)
- Guarda minima de 5 anos apos ultimo atendimento
- Sigilo profissional inviolavel
- Tecnologia permitida com ressalvas (Resolucao CFP 011/2018)

Para holisticos:
- Sem conselho regulador com forca de lei (vantagem para compliance)
- LGPD se aplica integralmente

### Implementacao tecnica

| Requisito LGPD | Implementacao |
|-----------------|---------------|
| Consentimento | Termo digital no cadastro do terapeuta + registro de consentimento do paciente |
| Criptografia em repouso | AES-256-CBC nos campos sensiveis |
| Criptografia em transito | HTTPS (TLS 1.3) via Vercel |
| Direito ao esquecimento | Endpoint de exclusao completa de dados do paciente |
| Portabilidade | Export JSON + PDF dos dados do paciente |
| Audit log | Registro automatico de toda operacao em dados sensiveis |
| Minimizacao | Coletar apenas dados necessarios para o atendimento |
| Retencao | Respeitar 5 anos CFP; apos isso, alerta para exclusao |
| DPO | Terceirizado (necessario antes de escalar, nao no MVP beta) |

### IA e LGPD

- Dados enviados para API de IA devem ser **anonimizados** (substituir nomes, CPFs, telefones, emails por placeholders)
- IA nunca recebe dados identificaveis do paciente
- Resultados da IA armazenados criptografados junto da sessao
- Disclaimer em toda saida de IA: "Sugestao gerada por IA para consideracao do profissional"
- IA nao faz diagnostico — apenas identifica padroes e sugere pontos de atencao

### Custos legais estimados

| Item | Custo estimado | Quando |
|------|----------------|--------|
| Advogado: termos de uso + politica de privacidade | R$ 1.500-3.000 | Antes do beta publico |
| DPO terceirizado | R$ 500-2.000/mes | Antes de escalar (50+ clientes) |
| Registro no ROPA (Registro de Operacoes) | Incluso no advogado | Antes do beta publico |

---

## Funcionalidades de IA - Detalhamento

### Nivel 1: Assistente de documentacao (MVP)

**Resumo automatico da sessao**
- Input: Notas brutas do terapeuta apos a sessao
- Output: Resumo estruturado com temas-chave e pontos de atencao
- Modelo: Claude API (Sonnet para custo-beneficio)
- Custo estimado: ~R$ 0.01-0.03 por resumo

**Deteccao basica de padroes**
- Analisar ultimas N sessoes e identificar temas recorrentes
- Variacao do humor ao longo do tempo
- Frequencia de presenca/ausencia

### Nivel 2: Analise avancada (Fase 2)

**Rastreamento multi-dimensional**
- Alem do humor, rastrear: ansiedade, sono, energia, autoestima, relacionamentos
- Graficos de evolucao por dimensao
- Deteccao automatica de melhora/piora/estagnacao

**Alertas inteligentes**
- Paciente faltou N vezes consecutivas
- Regressao significativa detectada
- Padrao sazonal identificado
- Muito tempo sem sessao registrada

### Nivel 3: Sugestoes (Fase 3)

**Pontos de atencao para o terapeuta**
- "Paciente mencionou tema X em 7 das ultimas 10 sessoes"
- "Humor medio caiu de 7 para 4 nos ultimos 3 meses"
- "Considerar revisar abordagem atual dado plato nos ultimos 5 encontros"

Todas as sugestoes acompanhadas de disclaimer obrigatorio.

### Prompt base para analise (referencia)

```
Voce e um assistente de documentacao clinica para terapeutas.

REGRAS:
- NAO faca diagnosticos
- NAO prescreva tratamentos
- NAO use linguagem definitiva ("o paciente tem", "isso indica")
- USE linguagem sugestiva ("o paciente parece apresentar", "pode ser relevante explorar")
- APENAS identifique padroes e sugira pontos de atencao
- RESPONDA em portugues brasileiro

TAREFA:
Analise as notas da sessao e o historico resumido. Retorne:
1. Resumo da sessao (3-5 frases)
2. Temas principais identificados
3. Padroes observados em relacao ao historico
4. Pontos de atencao para o terapeuta
5. Percepcao de evolucao (melhora / estavel / piora) com justificativa
```

---

## Modelo de Negocio

### Precificacao (a validar com publico-alvo)

| Plano | Preco | Pacientes | IA | Alvo |
|-------|-------|-----------|-----|------|
| Gratuito | R$ 0 | Ate 3 | Nao | Experimentacao |
| Essencial | R$ 39/mes | Ate 25 | 15 resumos/mes | Terapeutas em inicio |
| Profissional | R$ 79/mes | Ilimitado | Ilimitado + padroes + alertas | Consultorio estabelecido |

Nota: Precos sao hipotese inicial. Validar com entrevistas antes de implementar cobranca.

### Projecao (conservadora)

| Marco | Quando | Users pagantes | MRR |
|-------|--------|----------------|-----|
| Beta | Mes 2 | 0 (gratis) | R$ 0 |
| Lancamento | Mes 3 | 5-10 | R$ 300-600 |
| Tracao inicial | Mes 6 | 30-50 | R$ 1.500-3.000 |
| Break-even infra | Mes 4 | ~10 | R$ 500 |
| Meta ano 1 | Mes 12 | 100-200 | R$ 6.000-12.000 |

Break-even de infra e rapido (~10 clientes). Break-even considerando tempo investido depende do custo de oportunidade do fundador.

---

## Estrategia de Aquisicao (Baixo Custo)

### Pre-lancamento

1. **Entrevistas de validacao** - 10 terapeutas, entender a dor real
2. **Landing page** - Headline + proposta de valor + lista de espera (email)
3. **Lead magnet** - "Template de prontuario LGPD compliant" em PDF (pedir email para baixar)

### Pos-lancamento

1. **Conteudo organico** - Posts no Instagram/LinkedIn sobre gestao para terapeutas e LGPD
2. **SEO** - Blog com artigos: "Como fazer prontuario terapeutico", "LGPD para psicologos", "Gestao de consultorio"
3. **Comunidades** - Participar (sem spam) de grupos de terapeutas no WhatsApp/Telegram/Facebook
4. **Parcerias** - Escolas de formacao, supervisores clinicos, associacoes
5. **Product-led** - Plano gratuito generoso, trial 14 dias do Pro

---

## Riscos e Mitigacoes

| Risco | Probabilidade | Impacto | Mitigacao |
|-------|---------------|---------|-----------|
| Terapeutas nao confiam em nuvem para dados de pacientes | Alta | Alto | Transparencia sobre seguranca, criptografia visivel, depoimentos de beta testers |
| Regulamentacao muda (CFP ou LGPD) | Media | Alto | Manter IA como sugestao, nunca diagnostico; acompanhar regulamentacao |
| Provider de IA muda precos/termos | Media | Medio | Abstrair provider, poder trocar Claude por OpenAI ou local |
| Churn alto apos primeiros meses | Media | Alto | Criar lock-in via historico de dados, evolucao do paciente |
| Concorrente grande copia feature de IA | Media | Medio | Velocidade de execucao, nicho holistico, relacionamento com comunidade |
| Complexidade de criptografia atrasa MVP | Media | Medio | Fase 1 com Supabase RLS + HTTPS; criptografia application-level na fase 2 |

---

## Roadmap de Execucao

### Semana 0: Validacao (ANTES de codar)

- [ ] Entrevistar 10 terapeutas (5 psicologos, 5 holisticos)
- [ ] Perguntar: quanto pagam hoje, o que incomoda, o que falta
- [ ] Criar landing page com lista de espera
- [ ] Meta: 50 emails cadastrados = sinal verde para continuar
- [ ] Definir nome final do produto e registrar dominio

### Semanas 1-2: Fundacao + Core

- [ ] Setup Next.js + Supabase + Vercel
- [ ] Auth (login/registro com Supabase Auth)
- [ ] Layout base com sidebar (shadcn/ui)
- [ ] CRUD pacientes (cadastro, listagem, ficha)
- [ ] Consentimento LGPD no cadastro do terapeuta
- [ ] Row Level Security no Supabase (terapeuta so ve seus dados)
- [ ] Migration inicial do banco

### Semanas 3-4: Sessoes + IA

- [ ] Registro de sessao (notas + humor + tags)
- [ ] Timeline do paciente (historico de sessoes)
- [ ] Integracao Claude API para resumo automatico
- [ ] Anonimizacao de dados antes de enviar para IA
- [ ] Deteccao basica de padroes (temas recorrentes, variacao de humor)
- [ ] Grafico simples de evolucao do humor
- [ ] Export PDF do prontuario
- [ ] Audit log basico

### Semana 5: Beta privado

- [ ] Convidar 5-10 terapeutas da lista de espera
- [ ] Acompanhar uso, coletar feedback
- [ ] Corrigir bugs criticos
- [ ] Iterar baseado em feedback real

### Apos validacao: Fase 2

- [ ] Agenda com recorrencia
- [ ] Financeiro basico
- [ ] Dashboard
- [ ] IA avancada (alertas, multi-dimensional)
- [ ] Planos pagos
- [ ] 2FA
- [ ] Advogado para termos e politica de privacidade

---

## Decisoes em aberto

- [ ] Nome definitivo do produto (TerapeutAI? TherapyOS? Outro?)
- [ ] Criptografia application-level no MVP ou apenas na Fase 2?
- [ ] Claude API ou OpenAI? (Claude recomendado por qualidade em portugues)
- [ ] Mercado Pago ou Stripe para pagamentos? (Stripe mais facil, Mercado Pago mais brasileiro)
- [ ] PWA desde o inicio ou apenas web responsivo?

---

## Referencias

- LGPD: Lei 13.709/2018 - http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/L13709.htm
- CFP Resolucao 001/2009 (Prontuario)
- CFP Resolucao 011/2018 (Tecnologia)
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- shadcn/ui: https://ui.shadcn.com
