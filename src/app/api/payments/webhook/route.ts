import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service role client to bypass RLS for plan updates
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface GmailPubSubMessage {
  message: {
    data: string // base64 encoded
    messageId: string
    publishTime: string
  }
  subscription: string
}

export async function POST(request: NextRequest) {
  // Verify this is from Google Pub/Sub
  const secret = request.nextUrl.searchParams.get('secret')
  if (secret !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body: GmailPubSubMessage = await request.json()

  // Decode the Pub/Sub message
  const decoded = Buffer.from(body.message.data, 'base64').toString('utf-8')
  let gmailNotification: { emailAddress: string; historyId: string }

  try {
    gmailNotification = JSON.parse(decoded)
  } catch {
    return NextResponse.json({ error: 'Invalid message' }, { status: 400 })
  }

  // Fetch the email using Gmail API
  const emailContent = await fetchLatestEmail(gmailNotification.historyId)

  if (!emailContent) {
    return NextResponse.json({ ok: true })
  }

  // Check if it's a FlowPay payment confirmation
  const isPaymentConfirmation = isFlowPayConfirmation(emailContent)

  if (!isPaymentConfirmation) {
    return NextResponse.json({ ok: true })
  }

  // Extract customer email and plan from the email
  const { customerEmail, plan } = extractPaymentInfo(emailContent)

  if (!customerEmail) {
    console.error('Could not extract customer email from FlowPay email')
    return NextResponse.json({ ok: true })
  }

  // Update the therapist plan
  const { error } = await supabase
    .from('therapists')
    .update({
      plan,
      plan_activated_at: new Date().toISOString(),
    })
    .eq('email', customerEmail)

  if (error) {
    console.error('Failed to update plan:', error)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }

  console.log(`Plan updated to ${plan} for ${customerEmail}`)
  return NextResponse.json({ ok: true })
}

async function fetchLatestEmail(historyId: string): Promise<string | null> {
  const accessToken = process.env.GMAIL_ACCESS_TOKEN
  if (!accessToken) {
    console.error('GMAIL_ACCESS_TOKEN not configured')
    return null
  }

  try {
    // Get history to find the new message ID
    const historyRes = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/history?startHistoryId=${historyId}&historyTypes=messageAdded`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )

    if (!historyRes.ok) return null

    const historyData = await historyRes.json()
    const messages = historyData.history?.[0]?.messagesAdded
    if (!messages?.length) return null

    const messageId = messages[0].message.id

    // Fetch the full message
    const msgRes = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )

    if (!msgRes.ok) return null

    const msg = await msgRes.json()

    // Extract text from message parts
    const parts = msg.payload?.parts || [msg.payload]
    for (const part of parts) {
      if (part.mimeType === 'text/plain' || part.mimeType === 'text/html') {
        const data = part.body?.data
        if (data) {
          return Buffer.from(data, 'base64').toString('utf-8')
        }
      }
    }

    return null
  } catch (err) {
    console.error('Error fetching email:', err)
    return null
  }
}

function isFlowPayConfirmation(emailContent: string): boolean {
  // FlowPay envia de team@flowpay.cash com assunto "Novo pagamento recebido"
  return (
    emailContent.includes('flowpay.cash') ||
    emailContent.includes('Novo pagamento recebido') ||
    emailContent.includes('Novo Pagamento')
  )
}

function extractPaymentInfo(emailContent: string): { customerEmail: string | null; plan: 'profissional' | 'clinica' } {
  // Estrategia 1: email embutido no UTM utm_content (passado pelo botao de upgrade)
  const utmEmailRegex = /utm_content=([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/
  const utmMatch = emailContent.match(utmEmailRegex)

  // Estrategia 2: campo "Comprador" na tabela do email da FlowPay
  // Formato esperado: "Comprador\nNome do Cliente\nemail@exemplo.com"
  const compradorEmailRegex = /Comprador[\s\S]{0,100}?([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/i
  const compradorMatch = emailContent.match(compradorEmailRegex)

  // Estrategia 3: qualquer email no corpo, excluindo os conhecidos
  const allEmailsRegex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g
  const allEmails = emailContent.match(allEmailsRegex) || []
  const fallbackEmail = allEmails.find(
    (e) =>
      !e.includes('flowpay') &&
      !e.includes('terapeutai') &&
      e !== 'tidilodo@gmail.com' &&
      e !== 'team@flowpay.cash'
  ) || null

  const customerEmail = utmMatch?.[1] || compradorMatch?.[1] || fallbackEmail

  // Determinar plano pelo utm_term ou pelo produto no email
  const isClinica =
    emailContent.toLowerCase().includes('utm_term=clinica') ||
    emailContent.toLowerCase().includes('clinica')
  const plan = isClinica ? 'clinica' : 'profissional'

  return { customerEmail, plan }
}
