import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/referral?code=xxx — track click
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  if (!code) {
    return NextResponse.json({ error: 'code obrigatorio' }, { status: 400 })
  }

  const { data: affiliate } = await adminSupabase
    .from('affiliates')
    .select('id, active')
    .eq('code', code.toLowerCase())
    .single()

  if (!affiliate || !affiliate.active) {
    return NextResponse.json({ valid: false })
  }

  await adminSupabase.rpc('increment_affiliate_clicks', { affiliate_id: affiliate.id })

  return NextResponse.json({ valid: true })
}

// POST /api/referral — register conversion
export async function POST(request: NextRequest) {
  const { code, email, therapist_id } = await request.json()

  if (!code || !email) {
    return NextResponse.json({ error: 'code e email obrigatorios' }, { status: 400 })
  }

  const { data: affiliate } = await adminSupabase
    .from('affiliates')
    .select('id')
    .eq('code', code.toLowerCase())
    .eq('active', true)
    .single()

  if (!affiliate) {
    return NextResponse.json({ ok: false })
  }

  await adminSupabase
    .from('referrals')
    .insert({
      affiliate_id: affiliate.id,
      referred_therapist_id: therapist_id || null,
      referred_email: email,
      status: 'registered',
    })

  // Increment conversions
  await adminSupabase.rpc('increment_affiliate_conversions', { affiliate_id: affiliate.id })

  return NextResponse.json({ ok: true })
}
