'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Loader2, Sparkles } from 'lucide-react'
import type { Patient } from '@/types/database'

export default function NewSessionPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [patientId, setPatientId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [duration, setDuration] = useState(50)
  const [status, setStatus] = useState<'realizada' | 'cancelada' | 'falta'>('realizada')
  const [notes, setNotes] = useState('')
  const [mood, setMood] = useState(5)
  const [tags, setTags] = useState('')
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiSummary, setAiSummary] = useState<string | null>(null)
  const [aiPatterns, setAiPatterns] = useState<any>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    async function loadPatients() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('patients')
        .select('id, name, status')
        .eq('therapist_id', user.id)
        .eq('status', 'ativo')
        .order('name')

      if (data) setPatients(data as Patient[])

      const preselected = searchParams.get('patient')
      if (preselected) setPatientId(preselected)
    }
    loadPatients()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!patientId) {
      toast.error('Selecione um paciente')
      return
    }
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('Sessao expirada')
      setLoading(false)
      return
    }

    const { data, error } = await supabase.from('sessions').insert({
      patient_id: patientId,
      therapist_id: user.id,
      date: new Date(date).toISOString(),
      duration_minutes: duration,
      status,
      session_notes: notes,
      mood_rating: mood,
      tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      ai_summary: aiSummary,
      ai_patterns: aiPatterns,
    }).select().single()

    if (error) {
      toast.error('Erro ao registrar sessao')
      setLoading(false)
      return
    }

    toast.success('Sessao registrada com sucesso')
    router.push(`/patients/${patientId}`)
    router.refresh()
  }

  async function handleAiSummary() {
    if (!notes.trim()) {
      toast.error('Escreva as notas da sessao antes de gerar o resumo')
      return
    }
    setAiLoading(true)

    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: patientId,
          session_notes: notes,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Erro ao gerar resumo')
      }

      const data = await res.json()
      setAiSummary(data.summary)
      if (data.patterns) {
        setAiPatterns(data.patterns)
      }

      if (data.patterns?.themes?.length) {
        const currentTags = tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : []
        const newTags = [...new Set([...currentTags, ...data.patterns.themes])]
        setTags(newTags.join(', '))
      }

      toast.success('Resumo gerado com IA')
    } catch (err: any) {
      toast.error(err.message || 'Erro ao gerar resumo com IA')
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Nova sessao</h2>
        <p className="text-muted-foreground">Registre os detalhes da sessao.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label>Paciente *</Label>
              <Select value={patientId} onValueChange={(v) => v && setPatientId(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um paciente" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Data *</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Duracao (min)</Label>
                <Input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  min={1}
                  max={480}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={(v) => v && setStatus(v as 'realizada' | 'cancelada' | 'falta')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realizada">Realizada</SelectItem>
                    <SelectItem value="cancelada">Cancelada</SelectItem>
                    <SelectItem value="falta">Falta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Humor do paciente (1-10) *</Label>
              <div className="flex items-center gap-4">
                <Input
                  type="range"
                  min={1}
                  max={10}
                  value={mood}
                  onChange={(e) => setMood(Number(e.target.value))}
                  className="flex-1"
                />
                <Badge variant={mood >= 7 ? 'default' : mood >= 4 ? 'secondary' : 'destructive'} className="text-lg w-10 justify-center">
                  {mood}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notas da sessao *</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={8}
                placeholder="Descreva o que aconteceu na sessao..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Tags (separadas por virgula)</Label>
              <Input
                placeholder="ansiedade, familia, trabalho"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>

            {aiSummary && (
              <div className="rounded-lg bg-muted p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-medium">Resumo gerado por IA</span>
                </div>
                <p className="text-sm text-muted-foreground">{aiSummary}</p>
                <p className="text-xs text-muted-foreground italic">
                  Sugestao gerada por IA para consideracao do profissional.
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Registrar sessao'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleAiSummary}
                disabled={aiLoading || !notes.trim()}
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Gerar resumo com IA
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
