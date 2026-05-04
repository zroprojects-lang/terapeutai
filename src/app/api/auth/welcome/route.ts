import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendWelcomeEmail } from '@/lib/email/resend'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
  }

  const body = await request.json()
  const { name, email } = body

  if (!name || !email) {
    return NextResponse.json({ error: 'Nome e email obrigatorios' }, { status: 400 })
  }

  if (!process.env.RESEND_API_KEY) {
    // Silently skip if not configured
    return NextResponse.json({ ok: true })
  }

  await sendWelcomeEmail(name, email)
  return NextResponse.json({ ok: true })
}
