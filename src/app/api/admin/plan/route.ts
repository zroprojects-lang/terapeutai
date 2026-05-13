import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  const key = request.nextUrl.searchParams.get('key')
  if (key !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
  }

  const { therapist_id, plan } = await request.json()

  if (!therapist_id || !plan) {
    return NextResponse.json({ error: 'therapist_id e plan obrigatorios' }, { status: 400 })
  }

  if (!['gratuito', 'profissional', 'clinica'].includes(plan)) {
    return NextResponse.json({ error: 'Plano invalido' }, { status: 400 })
  }

  const { error } = await adminSupabase
    .from('therapists')
    .update({
      plan,
      plan_activated_at: plan !== 'gratuito' ? new Date().toISOString() : null,
    })
    .eq('id', therapist_id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, therapist_id, plan })
}
