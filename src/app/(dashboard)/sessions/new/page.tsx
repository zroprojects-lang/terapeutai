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
import type { Patient, Package } from '@/types/database'

const HOLISTIC_TECHNIQUES = [
  'Reiki',
  'Constelação Familiar',
  'Barras de Access',
  'Florais de Bach',
  'Acupuntura',
  'Thetahealing',
  'Hipnoterapia',
  'PNL',
  'Meditação Guiada',
  'Aromaterapia',
  'Cristaloterapia',
]

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
  const [techniques, setTechniques] = useState<string[]>([])
  const [customTechnique, setCustomTechnique] = useState('')
  const [protocols, setProtocols] = useState('')
  const [intention, setIntention] = useState('')
  const [openness, setOpenness] = useState(5)
  const [nextSteps, setNextSteps] = useState('')
  const [packageId, setPackageId] = useState<string>('')
  const [activePackages, setActivePackages] = useState<Package[]>([])
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

  useEffect(() => {
    async function loadPackages() {
      if (!patientId) {
        setActivePackages([])
        return
      }
      const { data } = await supabase
        .from('packages')
        .select('*')
        .eq('patient_id', patientId)
        .eq('status', 'ativo')
        .order('created_at', { ascending: false })

      if (data) setActivePackages(data as Package[])
    }
    loadPackages()
  }, [patientId])

  function toggleTechnique(tech: string) {
    setTechniques((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    )
  }

  function addCustomTechnique() {
    if (customTechnique.trim() && !techniques.includes(customTechnique.trim())) {
      setTechniques((prev) => [...prev, customTechnique.trim()])
      setCustomTechnique('')
    }
  }

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

    const allTags = tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : []
    const sessionData: any = {
      patient_id: patientId,
      therapist_id: user.id,
      date: new Date(date).toISOString(),
      duration_minutes: duration,
      status,
      session_notes: [
        intention && `**Intenção:** ${intention}`,
        techniques.length && `**Técnicas:** ${techniques.join(', ')}`,
        protocols && `**Protocolos/Materiais:** ${protocols}`,
        notes,
        nextSteps && `**Próximos passos:** ${nextSteps}`,
      ].filter(Boolean).join('\n\n'),
      mood_rating: mood,
      tags: [...new Set([...allTags, ...techniques.map(t => t.toLowerCase())])],
      ai_summary: aiSummary,
      ai_patterns: aiPatterns,
      package_id: packageId || null,
    }

    const { data, error } = await supabase.from('sessions').insert(sessionData).select().single()

    if (error) {
      toast.error('Erro ao registrar sessão')
      setLoading(false)
      return
    }

    if (packageId && status === 'realizada') {
      const pkg = activePackages.find((p) => p.id === packageId)
      if (pkg) {
        const newUsed = pkg.used_sessions + 1
        const newStatus = newUsed >= pkg.total_sessions ? 'concluido' : 'ativo'
        await supabase.from('packages').update({
          used_sessions: newUsed,
          status: newStatus,
        }).eq('id', packageId)
      }
    }

    toast.success('Sessão registrada com sucesso')
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
        <h2 className="text-3xl font-bold tracking-tight">Nova sessão</h2>
        <p className="text-muted-foreground">Registre os detalhes da sessão holística.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label>Cliente *</Label>
              <Select value={patientId} onValueChange={(v) => v && setPatientId(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
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
                <Label>Duração (min)</Label>
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

            {activePackages.length > 0 && (
              <div className="space-y-2">
                <Label>Vincular ao pacote</Label>
                <Select value={packageId} onValueChange={(v) => setPackageId(v || '')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sessão avulsa (sem pacote)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Sessão avulsa</SelectItem>
                    {activePackages.map((pkg) => (
                      <SelectItem key={pkg.id} value={pkg.id}>
                        {pkg.name} ({pkg.used_sessions}/{pkg.total_sessions} usadas)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>Técnica(s) utilizada(s)</Label>
              <div className="flex flex-wrap gap-2">
                {HOLISTIC_TECHNIQUES.map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => toggleTechnique(tech)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      techniques.includes(tech)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-muted-foreground border-input hover:bg-muted'
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={customTechnique}
                  onChange={(e) => setCustomTechnique(e.target.value)}
                  placeholder="Outra técnica..."
                  className="flex-1"
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomTechnique() } }}
                />
                <Button type="button" variant="outline" size="sm" onClick={addCustomTechnique}>
                  Adicionar
                </Button>
              </div>
              {techniques.filter(t => !HOLISTIC_TECHNIQUES.includes(t)).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {techniques.filter(t => !HOLISTIC_TECHNIQUES.includes(t)).map((tech) => (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => toggleTechnique(tech)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium border bg-primary text-primary-foreground border-primary"
                    >
                      {tech} ×
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Intenção da sessão</Label>
              <Input
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                placeholder="Qual era o foco ou intenção trabalhada?"
              />
            </div>

            <div className="space-y-2">
              <Label>Nível de abertura do cliente (1-10)</Label>
              <div className="flex items-center gap-4">
                <Input
                  type="range"
                  min={1}
                  max={10}
                  value={openness}
                  onChange={(e) => setOpenness(Number(e.target.value))}
                  className="flex-1"
                />
                <Badge variant={openness >= 7 ? 'default' : openness >= 4 ? 'secondary' : 'destructive'} className="text-lg w-10 justify-center">
                  {openness}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Percepções do terapeuta *</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={6}
                placeholder="Descreva suas percepções, movimentos energéticos observados, reações do cliente..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Protocolos e materiais</Label>
              <Input
                value={protocols}
                onChange={(e) => setProtocols(e.target.value)}
                placeholder="Quais ferramentas/materiais foram usados nessa sessão?"
              />
            </div>

            <div className="space-y-2">
              <Label>Próximos passos</Label>
              <Textarea
                value={nextSteps}
                onChange={(e) => setNextSteps(e.target.value)}
                rows={3}
                placeholder="O que foi combinado para o cliente praticar até a próxima sessão?"
              />
            </div>

            <div className="space-y-2">
              <Label>Tags (separadas por vírgula)</Label>
              <Input
                placeholder="campo energético, bloqueio, liberação"
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
