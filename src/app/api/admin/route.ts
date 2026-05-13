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

  const { data: therapists, error } = await adminSupabase
    .from('therapists')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const stats = await Promise.all(
    (therapists || []).map(async (t) => {
      const [patients, sessions] = await Promise.all([
        adminSupabase
          .from('patients')
          .select('*', { count: 'exact', head: true })
          .eq('therapist_id', t.id),
        adminSupabase
          .from('sessions')
          .select('*', { count: 'exact', head: true })
          .eq('therapist_id', t.id),
      ])

      return {
        ...t,
        patient_count: patients.count || 0,
        session_count: sessions.count || 0,
      }
    })
  )

  return NextResponse.json({ therapists: stats })
}
