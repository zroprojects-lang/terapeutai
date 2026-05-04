import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sanitizeForAI } from '@/lib/ai/sanitize'
import { buildSessionSummaryPrompt } from '@/lib/ai/prompts'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
  }

  const body = await request.json()
  const { patient_id, session_notes } = body

  if (!session_notes?.trim()) {
    return NextResponse.json({ error: 'Notas da sessao sao obrigatorias' }, { status: 400 })
  }

  const { data: patient } = await supabase
    .from('patients')
    .select('name')
    .eq('id', patient_id)
    .eq('therapist_id', user.id)
    .single()

  const { data: previousSessions } = await supabase
    .from('sessions')
    .select('date, ai_summary, mood_rating, tags')
    .eq('patient_id', patient_id)
    .eq('therapist_id', user.id)
    .eq('status', 'realizada')
    .order('date', { ascending: false })
    .limit(10)

  const sanitizedNotes = sanitizeForAI(session_notes, {
    [patient?.name || '']: '[PACIENTE]',
  })

  const history = (previousSessions || []).map((s) => ({
    date: new Date(s.date).toLocaleDateString('pt-BR'),
    summary: s.ai_summary || '',
    mood: s.mood_rating,
    tags: s.tags || [],
  }))

  const prompt = buildSessionSummaryPrompt(sanitizedNotes, history)

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'API de IA nao configurada. Configure ANTHROPIC_API_KEY no .env.local' },
      { status: 500 }
    )
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [
          { role: 'user', content: prompt },
        ],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Anthropic API error:', err)
      return NextResponse.json(
        { error: 'Erro ao chamar API de IA' },
        { status: 500 }
      )
    }

    const aiResponse = await response.json()
    const content = aiResponse.content?.[0]?.text || ''

    let parsed
    try {
      parsed = JSON.parse(content)
    } catch {
      return NextResponse.json({
        summary: content,
        patterns: null,
      })
    }

    await supabase.from('audit_logs').insert({
      therapist_id: user.id,
      action: 'CREATE',
      entity: 'ai_analysis',
      entity_id: patient_id,
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
    })

    return NextResponse.json({
      summary: parsed.resumo || content,
      patterns: {
        themes: parsed.temas || [],
        attention_points: parsed.pontos_atencao || [],
        evolution: parsed.evolucao || 'estavel',
        evolution_reason: parsed.evolucao_razao || '',
      },
    })
  } catch (error) {
    console.error('AI summarize error:', error)
    return NextResponse.json(
      { error: 'Erro interno ao processar IA' },
      { status: 500 }
    )
  }
}
