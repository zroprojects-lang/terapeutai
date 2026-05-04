import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ patientId: string }> }
) {
  const { patientId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
  }

  const { data: patient } = await supabase
    .from('patients')
    .select('*')
    .eq('id', patientId)
    .eq('therapist_id', user.id)
    .single()

  if (!patient) {
    return NextResponse.json({ error: 'Paciente nao encontrado' }, { status: 404 })
  }

  const { data: sessions } = await supabase
    .from('sessions')
    .select('*')
    .eq('patient_id', patientId)
    .eq('therapist_id', user.id)
    .order('date', { ascending: true })

  await supabase.from('audit_logs').insert({
    therapist_id: user.id,
    action: 'EXPORT',
    entity: 'patient',
    entity_id: patientId,
    ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
  })

  const exportData = {
    export_date: new Date().toISOString(),
    format: 'LGPD_PORTABLE_V1',
    patient,
    sessions: sessions || [],
    metadata: {
      total_sessions: sessions?.length || 0,
      date_range: sessions?.length ? {
        first: sessions[0].date,
        last: sessions[sessions.length - 1].date,
      } : null,
    },
  }

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="paciente_${patientId}_export.json"`,
    },
  })
}
