# Configuracao do Webhook Gmail para Pagamentos

## Visao Geral

O sistema detecta emails de confirmacao de pagamento da FlowPay via Google Cloud Pub/Sub.

## Variaveis de Ambiente Necessarias

Adicionar no .env.local e no Vercel:

```
SUPABASE_SERVICE_ROLE_KEY=    # Settings > API no Supabase
WEBHOOK_SECRET=               # Qualquer string aleatoria (ex: openssl rand -hex 32)
GMAIL_ACCESS_TOKEN=           # Token OAuth2 do Gmail (ver abaixo)
ADMIN_SECRET=                 # String secreta para ativacao manual
```

## Passos de Configuracao

### 1. Google Cloud Console

1. Acesse console.cloud.google.com
2. Crie um projeto ou use o existente (o mesmo do Gemini se tiver)
3. Ative a Gmail API: APIs & Services > Enable APIs > Gmail API
4. Ative o Cloud Pub/Sub: APIs & Services > Enable APIs > Cloud Pub/Sub

### 2. Criar topico Pub/Sub

```bash
gcloud pubsub topics create gmail-payments
gcloud pubsub subscriptions create gmail-payments-sub \
  --topic=gmail-payments \
  --push-endpoint=https://terapeutai.vercel.app/api/payments/webhook?secret=SEU_WEBHOOK_SECRET \
  --ack-deadline=30
```

### 3. Permissao para Gmail enviar para Pub/Sub

```bash
gcloud pubsub topics add-iam-policy-binding gmail-payments \
  --member="serviceAccount:gmail-api-push@system.gserviceaccount.com" \
  --role="roles/pubsub.publisher"
```

### 4. OAuth2 para Gmail API

1. Google Cloud > APIs & Services > Credentials
2. Create OAuth 2.0 Client ID > Desktop app
3. Baixar o JSON de credenciais
4. Usar o OAuth Playground (oauth2.googleapis.com/tokeninfo) para gerar um refresh token com escopo: https://www.googleapis.com/auth/gmail.readonly
5. Salvar o access token em GMAIL_ACCESS_TOKEN

IMPORTANTE: Access tokens expiram em 1h. Para producao, implementar refresh automatico com o refresh token.

### 5. Configurar Gmail Watch

Chamar a Gmail API para configurar o watch no inbox:

```bash
curl -X POST https://gmail.googleapis.com/gmail/v1/users/me/watch \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "topicName": "projects/SEU_PROJECT_ID/topics/gmail-payments",
    "labelIds": ["INBOX"]
  }'
```

O watch expira em 7 dias — precisa ser renovado periodicamente.

### 6. TODO: Ajustar o parser do email

Apos receber o primeiro email de confirmacao da FlowPay, atualizar as funcoes em:
`src/app/api/payments/webhook/route.ts`

- `isFlowPayConfirmation()`: adicionar o assunto/remetente real
- `extractPaymentInfo()`: ajustar regex para o formato real do email

## Ativacao Manual (Para Testes)

```bash
curl -X POST https://terapeutai.vercel.app/api/payments/activate \
  -H "Content-Type: application/json" \
  -H "Cookie: [seu cookie de sessao]" \
  -d '{"plan": "profissional", "admin_secret": "SEU_ADMIN_SECRET"}'
```

## Limitacoes

- Access token OAuth2 expira em 1h (implementar refresh em producao)
- Gmail Watch expira em 7 dias (renovar via cron job)
- O parser depende do formato do email da FlowPay (atualizar apos ver email real)
