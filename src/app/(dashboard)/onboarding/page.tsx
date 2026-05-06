'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { ArrowRight, Check } from 'lucide-react'

const MODALITIES = [
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

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [modalities, setModalities] = useState<string[]>([])
  const [sessionType, setSessionType] = useState<string>('')
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [clientDemand, setClientDemand] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  function toggleModality(mod: string) {
    setModalities((prev) =>
      prev.includes(mod) ? prev.filter((m) => m !== mod) : [...prev, mod]
    )
  }

  async function handleFinish() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('Sessão expirada')
      setLoading(false)
      return
    }

    if (clientName.trim()) {
      await supabase.from('patients').insert({
        therapist_id: user.id,
        name: clientName,
        phone: clientPhone || null,
        initial_complaint: clientDemand || null,
        status: 'ativo',
        tags: modalities.length > 0 ? modalities.slice(0, 3) : [],
        lgpd_consent_recorded: false,
      })
    }

    toast.success('Bem-vindo ao TerapeutAI!')
    router.push('/dashboard')
    router.refresh()
  }

  function handleSkip() {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Vamos configurar sua conta</h1>
          <p className="text-muted-foreground">Passo {step} de 3 — leva menos de 1 minuto</p>
          <div className="flex gap-2 justify-center mt-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className="h-2 w-16 rounded-full transition-colors"
                style={{ backgroundColor: s <= step ? '#4A7C6F' : '#e5e7eb' }}
              />
            ))}
          </div>
        </div>

        {step === 1 && (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h2 className="text-lg font-semibold">Qual sua principal modalidade?</h2>
              <p className="text-sm text-muted-foreground">Selecione uma ou mais.</p>
              <div className="flex flex-wrap gap-2">
                {MODALITIES.map((mod) => (
                  <button
                    key={mod}
                    type="button"
                    onClick={() => toggleModality(mod)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                      modalities.includes(mod)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-muted-foreground border-input hover:bg-muted'
                    }`}
                  >
                    {modalities.includes(mod) && <Check className="h-3 w-3 inline mr-1" />}
                    {mod}
                  </button>
                ))}
              </div>
              <div className="pt-4 flex justify-end">
                <Button onClick={() => setStep(2)} disabled={modalities.length === 0}>
                  Próximo
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h2 className="text-lg font-semibold">Como você costuma atender?</h2>
              <p className="text-sm text-muted-foreground">Isso nos ajuda a personalizar sua experiência.</p>
              <div className="space-y-3">
                {[
                  { value: 'avulsas', label: 'Sessões avulsas', desc: 'Cada sessão é cobrada individualmente' },
                  { value: 'pacotes', label: 'Pacotes de sessões', desc: 'Vendo pacotes fechados (5, 10, etc.)' },
                  { value: 'ambos', label: 'Ambos', desc: 'Atendo com sessões avulsas e pacotes' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSessionType(opt.value)}
                    className={`w-full text-left p-4 rounded-xl border transition-colors ${
                      sessionType === opt.value
                        ? 'border-primary bg-primary/5'
                        : 'border-input hover:bg-muted'
                    }`}
                  >
                    <p className="font-medium text-sm">{opt.label}</p>
                    <p className="text-xs text-muted-foreground">{opt.desc}</p>
                  </button>
                ))}
              </div>
              <div className="pt-4 flex justify-between">
                <Button variant="ghost" onClick={() => setStep(1)}>Voltar</Button>
                <Button onClick={() => setStep(3)} disabled={!sessionType}>
                  Próximo
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h2 className="text-lg font-semibold">Cadastre seu primeiro cliente</h2>
              <p className="text-sm text-muted-foreground">Ou pule para explorar a plataforma primeiro.</p>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Nome do cliente</Label>
                  <Input
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Nome completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Demanda principal</Label>
                  <Input
                    value={clientDemand}
                    onChange={(e) => setClientDemand(e.target.value)}
                    placeholder="O que traz o cliente até você?"
                  />
                </div>
              </div>
              <div className="pt-4 flex justify-between">
                <Button variant="ghost" onClick={() => setStep(2)}>Voltar</Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleSkip}>Pular por agora</Button>
                  <Button onClick={handleFinish} disabled={loading}>
                    {loading ? 'Salvando...' : clientName ? 'Cadastrar e entrar' : 'Entrar'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
