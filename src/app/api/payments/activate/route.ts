import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  // Only allow authenticated therapists to call this (for testing their own account)
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
  }

  const body = await request.json()
  const { plan, admin_secret } = body

  // Allow self-activation only with admin secret (for testing)
  if (admin_secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
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
    .eq('id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, plan })
}
