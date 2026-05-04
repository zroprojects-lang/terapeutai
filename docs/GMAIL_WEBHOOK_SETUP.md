# Configuracao do Webhook Gmail para Pagamentos

## Status: PENDENTE — OAuth2 com erro redirect_uri_mismatch

## Visao Geral

O sistema detecta emails de confirmacao de pagamento da FlowPay (remetente: team@flowpay.cash,
assunto: "Novo pagamento recebido") via Google Cloud Pub/Sub e atualiza o plano do terapeuta automaticamente.

## Variaveis de Ambiente

Ja configuradas no .env.local e Vercel:
- SUPABASE_SERVICE_ROLE_KEY ✅
- WEBHOOK_SECRET=terapeutai_webhook_2026 ✅
- ADMIN_SECRET=terapeutai_admin_2026 ✅
- GMAIL_ACCESS_TOKEN ❌ pendente (bloqueado pelo erro OAuth2)

## O que ja foi feito

- [x] Projeto criado no Google Cloud
- [x] Gmail API ativada
- [x] Cloud Pub/Sub API ativada
- [x] Topico `gmail-payments` criado
- [x] Subscription push apontando para `https://terapeutai.vercel.app/api/payments/webhook?secret=terapeutai_webhook_2026`
- [x] Permissao `gmail-api-push@system.gserviceaccount.com` como Pub/Sub Publisher
- [x] OAuth client ID criado (Desktop app)
- [ ] Access token gerado — BLOQUEADO

## Problema atual

Erro `400: redirect_uri_mismatch` no OAuth Playground ao tentar gerar o access token.

### Solucao para retomar amanha

1. Va em **console.cloud.google.com > APIs & Services > Credentials**
2. Clique no OAuth client ID criado
3. Em **Authorized redirect URIs**, confirme que contem:
   ```
   https://developers.google.com/oauthplayground
   ```
4. Salve e aguarde 2-3 minutos
5. Acesse **developers.google.com/oauthplayground**
6. Clique no icone de engrenagem (canto superior direito)
7. Marque **Use your own OAuth credentials**
8. Cole Client ID e Client Secret do JSON baixado
9. No campo de escopos cole: `https://www.googleapis.com/auth/gmail.readonly`
10. Clique **Authorize APIs** > selecione `tidilodo@gmail.com` > Allow
11. Clique **Exchange authorization code for tokens**
12. Copie o `access_token` e passe para o Claude Code

### Apos obter o token

Rodar no terminal:
```bash
# Salvar token no Vercel
npx vercel env add GMAIL_ACCESS_TOKEN production

# Ativar Gmail Watch (substituir SEU_PROJECT_ID e SEU_ACCESS_TOKEN)
curl -X POST https://gmail.googleapis.com/gmail/v1/users/me/watch \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "topicName": "projects/SEU_PROJECT_ID/topics/gmail-payments",
    "labelIds": ["INBOX"]
  }'
```

O watch expira em 7 dias — renovar periodicamente.

## Ativacao Manual de Plano (Para Testes Imediatos)

Enquanto o webhook nao esta configurado, ativar plano manualmente via curl:

```bash
curl -X POST https://terapeutai.vercel.app/api/payments/activate \
  -H "Content-Type: application/json" \
  -H "Cookie: [cookie de sessao do dashboard]" \
  -d '{"plan": "profissional", "admin_secret": "terapeutai_admin_2026"}'
```

## Formato do Email FlowPay (Confirmado)

- Remetente: team@flowpay.cash
- Assunto: "Novo pagamento recebido — R$ XX,XX"
- Corpo: badge "Novo Pagamento" + tabela com Produto, Valor, Comprador

O parser em `src/app/api/payments/webhook/route.ts` ja esta atualizado para este formato.
Estrategias em cascata:
1. UTM utm_content=EMAIL_DO_USUARIO (passado pelo botao de upgrade)
2. Campo "Comprador" na tabela do email
3. Fallback: qualquer email no corpo excluindo conhecidos

## Limitacoes

- Access token OAuth2 expira em 1h — para producao implementar refresh automatico com refresh token
- Gmail Watch expira em 7 dias — renovar via cron job ou manualmente
