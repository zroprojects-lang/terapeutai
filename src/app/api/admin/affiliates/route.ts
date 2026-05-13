import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get('key')
  if (key !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
  }

  const { data: affiliates, error } = await adminSupabase
    .from('affiliates')
    .select('*, therapists(name, email)')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ affiliates: affiliates || [] })
}

export async function POST(request: NextRequest) {
  const key = request.nextUrl.searchParams.get('key')
  if (key !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
  }

  const { therapist_id, code } = await request.json()

  if (!therapist_id || !code) {
    return NextResponse.json({ error: 'therapist_id e code obrigatorios' }, { status: 400 })
  }

  const { data, error } = await adminSupabase
    .from('affiliates')
    .insert({ therapist_id, code: code.toLowerCase().replace(/\s+/g, '-') })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ affiliate: data })
}

export async function DELETE(request: NextRequest) {
  const key = request.nextUrl.searchParams.get('key')
  if (key !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
  }

  const { id } = await request.json()

  if (!id) {
    return NextResponse.json({ error: 'id obrigatorio' }, { status: 400 })
  }

  const { error } = await adminSupabase
    .from('affiliates')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
