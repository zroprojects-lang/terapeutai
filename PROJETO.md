# TerapeutAI - Gestao Inteligente para Terapeutas

## Status: MVP funcional em desenvolvimento local

**Ultimo update: Mai 2026**

---

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
2. **Compliance LGPD nativo** - Consentimento, audit log, portabilidade, direito ao esquecimento
3. **Nicho duplo** - Psicologos E holisticos no mesmo produto (abordagens configuráveis)
4. **Custo acessivel** - Precificacao para realidade brasileira

---

## Funcionalidades

### MVP - Implementado e funcionando

- [x] Auth (email + senha via Supabase)
- [x] Cadastro e listagem de pacientes
- [x] Registro de sessao (texto livre + humor 1-10 + tags + duracao + status)
- [x] Timeline do paciente (historico de sessoes)
- [x] Resumo automatico da sessao por IA (Groq / Llama 3.3 70B)
- [x] Deteccao de padroes: temas, pontos de atencao, percepcao de evolucao
- [x] Grafico de evolucao do humor ao longo do tempo
- [x] Export de dados do paciente (portabilidade LGPD - JSON)
- [x] Consentimento LGPD do terapeuta e registro de consentimento do paciente
- [x] Audit log (quem acessou o que, quando)
- [x] Row Level Security no Supabase (isolamento por terapeuta)
- [x] Dashboard com metricas do consultorio
- [x] Pagina de configuracoes com info LGPD

### Fase 2 (Apos validacao com beta testers)

- [ ] Agenda com recorrencia e lembretes por email
- [ ] Controle financeiro (pagamentos por sessao, inadimplencia)
- [ ] IA avancada: alertas de regressao, padroes sazonais
- [ ] Rastreamento multi-dimensional (ansiedade, humor, sono, energia, autoestima)
- [ ] Autenticacao 2FA
- [ ] Busca e filtros avancados
- [ ] Export PDF do prontuario

### Fase 3 (Escala)

- [ ] Planos pagos via Mercado Pago
- [ ] Onboarding guiado para novos terapeutas
- [ ] Templates de prontuario por abordagem (TCC, psicanalitica, holisticas)
- [ ] Relatorios avancados com IA
- [ ] App PWA otimizado para mobile

---

## Arquitetura Tecnica

### Stack atual

| Camada | Tecnologia | Custo |
|--------|-----------|-------|
| Frontend | Next.js 16 (App Router) + TypeScript | Gratis |
| UI | Tailwind CSS v4 + shadcn/ui (base-ui) | Gratis |
| Backend | Next.js API Routes | Gratis |
| Banco de dados | Supabase (PostgreSQL) | Gratis ate 500MB |
| Auth | Supabase Auth | Gratis ate 50k users |
| IA | Groq API (Llama 3.3 70B) | Gratis (rate limits) |
| Deploy | Vercel (local por enquanto) | Gratis |

### Custo estimado de infraestrutura

| Fase | Users | Custo/mes |
|------|-------|-----------|
| MVP/Beta atual | 0-10 | R$ 0 |
| Lancamento | 10-50 | R$ 0-50 |
| Crescimento | 50-200 | R$ 100-200 |
| Escala | 200-500 | R$ 200-400 |

### Estrutura do projeto

```
terapeutai/
├── src/
│   ├── app/
│   │   ├── (auth)/             # Login e registro
│   │   ├── (dashboard)/        # Area logada
│   │   │   ├── dashboard/      # Metricas do consultorio
│   │   │   ├── patients/       # Listagem + ficha do paciente
│   │   │   │   └── [id]/       # Timeline, evolucao, dados
│   │   │   ├── sessions/
│   │   │   │   ├── new/        # Registro de sessao + IA
│   │   │   │   └── [id]/       # Detalhe da sessao
│   │   │   └── settings/       # Config + LGPD
│   │   ├── api/
│   │   │   ├── ai/summarize/   # Groq: resumo + padroes
│   │   │   ├── patients/       # CRUD pacientes
│   │   │   └── export/[id]/    # Export LGPD (JSON)
│   │   ├── layout.tsx
│   │   └── page.tsx            # Landing page
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── patients/           # NewPatientDialog
│   │   ├── charts/             # MoodChart (barras CSS)
│   │   └── layout/             # Sidebar
│   ├── lib/
│   │   ├── supabase/           # client.ts, server.ts, middleware.ts
│   │   ├── ai/                 # sanitize.ts, prompts.ts
│   │   └── validators.ts       # Zod schemas
│   └── types/database.ts       # TypeScript types
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── .env.local                  # Nao commitar
├── .env.local.example
├── PROJETO.md
└── CLAUDE.md
```

### Modelo de dados

```
therapists         — perfil do terapeuta (1:1 com auth.users)
patients           — pacientes do terapeuta (RLS por therapist_id)
sessions           — sessoes de atendimento (RLS por therapist_id)
audit_logs         — log LGPD de todas operacoes sensiveis
```

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

### Implementacao atual

| Requisito LGPD | Status | Implementacao |
|----------------|--------|---------------|
| Consentimento | Feito | Checkbox no registro do terapeuta + campo no cadastro do paciente |
| Criptografia em transito | Feito | HTTPS via Vercel/Supabase |
| Isolamento de dados | Feito | Row Level Security no Supabase |
| Audit log | Feito | Tabela audit_logs com todas operacoes |
| Portabilidade | Feito | GET /api/export/[patientId] retorna JSON completo |
| Anonimizacao para IA | Feito | sanitizeForAI() remove nome, CPF, telefone, email antes de enviar |
| Criptografia em repouso | Pendente Fase 2 | AES-256-CBC application-level |
| Direito ao esquecimento | Pendente Fase 2 | Endpoint de exclusao completa |
| DPO | Pendente escala | Terceirizado antes de 50+ clientes |
| Termos de uso / PP | Pendente beta | Advogado antes de abrir para o publico |

### IA e LGPD

- Dados anonimizados antes de enviar para Groq (nome, CPF, telefone, email substituidos)
- IA nunca recebe dados identificaveis do paciente
- Disclaimer em toda saida de IA: "Sugestao gerada por IA para consideracao do profissional"
- IA nao faz diagnostico — apenas identifica padroes e sugere pontos de atencao

### Custos legais pendentes

| Item | Custo estimado | Quando |
|------|----------------|--------|
| Advogado: termos de uso + politica de privacidade | R$ 1.500-3.000 | Antes do beta publico |
| DPO terceirizado | R$ 500-2.000/mes | Antes de escalar (50+ clientes) |

---

## Funcionalidades de IA

### Implementado (Nivel 1)

**Resumo automatico da sessao**
- Input: Notas brutas do terapeuta apos a sessao
- Output: Resumo + temas + pontos de atencao + percepcao de evolucao
- Modelo: Llama 3.3 70B via Groq API (gratis)
- Anonimizacao automatica antes de enviar

**Deteccao de padroes por sessao**
- Temas recorrentes identificados automaticamente
- Percepcao de evolucao: melhora / estavel / piora com justificativa
- Tags sugeridas automaticamente com base nos temas

### Proximo (Nivel 2 - Fase 2)

- Alertas: paciente faltou N vezes, regressao detectada, platô prolongado
- Analise historica: comparar evolucao ao longo de meses
- Rastreamento multi-dimensional (ansiedade, sono, energia, autoestima)

---

## Modelo de Negocio

### Precificacao (a validar com publico-alvo)

| Plano | Preco | Pacientes | IA | Alvo |
|-------|-------|-----------|-----|------|
| Gratuito | R$ 0 | Ate 3 | Nao | Experimentacao |
| Essencial | R$ 39/mes | Ate 25 | 15 resumos/mes | Terapeutas em inicio |
| Profissional | R$ 79/mes | Ilimitado | Ilimitado + padroes + alertas | Consultorio estabelecido |

### Projecao (conservadora)

| Marco | Quando | Users pagantes | MRR |
|-------|--------|----------------|-----|
| Beta privado | Mes 2 | 0 (gratis) | R$ 0 |
| Lancamento | Mes 3 | 5-10 | R$ 300-600 |
| Tracao inicial | Mes 6 | 30-50 | R$ 1.500-3.000 |
| Break-even infra | Mes 4 | ~10 | R$ 500 |
| Meta ano 1 | Mes 12 | 100-200 | R$ 6.000-12.000 |

---

## Estrategia de Aquisicao (Baixo Custo)

### Pre-lancamento

1. **Entrevistas de validacao** - 10 terapeutas, entender a dor real
2. **Landing page** - Headline + proposta de valor + lista de espera (email)
3. **Lead magnet** - "Template de prontuario LGPD compliant" em PDF (pedir email para baixar)

### Pos-lancamento

1. **Conteudo organico** - Posts no Instagram/LinkedIn sobre gestao para terapeutas e LGPD
2. **SEO** - Blog com artigos: "Como fazer prontuario terapeutico", "LGPD para psicologos"
3. **Comunidades** - Grupos de terapeutas no WhatsApp/Telegram/Facebook
4. **Parcerias** - Escolas de formacao, supervisores clinicos, associacoes
5. **Product-led** - Plano gratuito generoso, trial 14 dias do Pro

---

## Riscos e Mitigacoes

| Risco | Probabilidade | Impacto | Mitigacao |
|-------|---------------|---------|-----------|
| Terapeutas nao confiam em nuvem | Alta | Alto | Transparencia, RLS visivel, depoimentos de beta testers |
| Regulamentacao muda (CFP ou LGPD) | Media | Alto | IA sempre como sugestao, acompanhar regulamentacao |
| Groq muda limites do free tier | Media | Medio | Estrutura abstrata — facil trocar para OpenAI ou Anthropic |
| Churn alto apos primeiros meses | Media | Alto | Lock-in via historico de dados e evolucao do paciente |
| Concorrente copia feature de IA | Media | Medio | Velocidade, nicho holistico, relacionamento com comunidade |

---

## Proximos Passos

### Imediato (antes do beta)
- [ ] Advogado para termos de uso e politica de privacidade
- [ ] Desabilitar confirmacao de email no Supabase (producao)
- [ ] Deploy no Vercel com dominio proprio
- [ ] Testar fluxo completo com 2-3 terapeutas conhecidos

### Fase 2 (apos primeiros usuarios)
- [ ] Agenda com recorrencia
- [ ] Financeiro basico
- [ ] Criptografia application-level (AES-256)
- [ ] Endpoint de exclusao completa (direito ao esquecimento)
- [ ] Planos pagos (Mercado Pago)

---

## Decisoes Tomadas

| Decisao | Escolha | Motivo |
|---------|---------|--------|
| Stack | Next.js + Supabase + Vercel | Custo zero, deploy simples, auth pronto |
| UI | shadcn/ui (base-ui v4) | Componentes prontos, acessiveis |
| IA | Groq (Llama 3.3 70B) | Gratis, sem cartao, qualidade suficiente para MVP |
| Banco | Supabase PostgreSQL | RLS nativo, auth integrado, free tier generoso |
| Auth | Supabase Auth (email/senha) | Integrado, sem custo, suficiente para MVP |

## Decisoes em Aberto

- [ ] Nome definitivo (TerapeutAI esta bom ou mudar?)
- [ ] Mercado Pago ou Stripe para pagamentos?
- [ ] PWA desde o inicio ou apenas web responsivo?

---

## Credenciais e Servicos

| Servico | Conta | Observacao |
|---------|-------|------------|
| Supabase | zroprojects@gmail.com | Projeto: terapeutai, regiao sa-east-1 |
| Groq | - | Free tier, chave no .env.local |
| Vercel | - | Ainda nao configurado |

---

## Referencias

- LGPD: Lei 13.709/2018
- CFP Resolucao 001/2009 (Prontuario)
- CFP Resolucao 011/2018 (Tecnologia)
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- Groq Docs: https://console.groq.com/docs
