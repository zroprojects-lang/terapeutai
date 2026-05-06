'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

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
  'Outra',
]

interface AnamneseFormProps {
  patientId: string
  existingData?: any
}

export function AnamneseForm({ patientId, existingData }: AnamneseFormProps) {
  const [loading, setLoading] = useState(false)
  const [howFound, setHowFound] = useState(existingData?.how_found || '')
  const [mainDemand, setMainDemand] = useState(existingData?.main_demand || '')
  const [goals, setGoals] = useState(existingData?.goals || '')
  const [previousTherapy, setPreviousTherapy] = useState(existingData?.previous_therapy || '')
  const [contraindications, setContraindications] = useState(existingData?.contraindications || '')
  const [energyObservations, setEnergyObservations] = useState(existingData?.energy_observations || '')
  const [mainModality, setMainModality] = useState(existingData?.main_modality || '')
  const [protocols, setProtocols] = useState(existingData?.protocols || '')
  const [lgpdConsent, setLgpdConsent] = useState(existingData?.lgpd_consent || false)
  const [consentName, setConsentName] = useState(existingData?.consent_name || '')
  const [sunSign, setSunSign] = useState(existingData?.sun_sign || '')
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const anamneseData = {
      how_found: howFound,
      main_demand: mainDemand,
      goals,
      previous_therapy: previousTherapy,
      contraindications,
      energy_observations: energyObservations,
      main_modality: mainModality,
      protocols,
      lgpd_consent: lgpdConsent,
      consent_name: consentName,
      sun_sign: sunSign,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from('patients')
      .update({ notes: JSON.stringify(anamneseData) })
      .eq('id', patientId)

    if (error) {
      toast.error('Erro ao salvar ficha de anamnese')
      setLoading(false)
      return
    }

    toast.success('Ficha de anamnese salva com sucesso')
    setLoading(false)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Signo solar</Label>
                <Select value={sunSign} onValueChange={(v) => setSunSign(v || '')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Opcional" />
                  </SelectTrigger>
                  <SelectContent>
                    {['Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem', 'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'].map((sign) => (
                      <SelectItem key={sign} value={sign}>{sign}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Como chegou até você</Label>
                <Select value={howFound} onValueChange={(v) => setHowFound(v || '')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="indicacao">Indicação</SelectItem>
                    <SelectItem value="redes_sociais">Redes sociais</SelectItem>
                    <SelectItem value="busca_online">Busca online</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Demanda e Contexto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Demanda principal *</Label>
              <Textarea
                value={mainDemand}
                onChange={(e) => setMainDemand(e.target.value)}
                rows={3}
                placeholder="O que traz o cliente até a terapia?"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Objetivos que deseja alcançar</Label>
              <Textarea
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                rows={3}
                placeholder="O que o cliente espera alcançar com as sessões?"
              />
            </div>
            <div className="space-y-2">
              <Label>Já fez algum tipo de terapia holística antes? Qual?</Label>
              <Input
                value={previousTherapy}
                onChange={(e) => setPreviousTherapy(e.target.value)}
                placeholder="Ex: Reiki há 2 anos, Florais de Bach"
              />
            </div>
            <div className="space-y-2">
              <Label>Contraindicações conhecidas</Label>
              <Input
                value={contraindications}
                onChange={(e) => setContraindications(e.target.value)}
                placeholder="Alguma contraindicação relevante?"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Campo Energético</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Observações iniciais sobre energia/campo</Label>
              <Textarea
                value={energyObservations}
                onChange={(e) => setEnergyObservations(e.target.value)}
                rows={4}
                placeholder="Suas percepções iniciais sobre o campo energético do cliente..."
              />
            </div>
            <div className="space-y-2">
              <Label>Modalidade principal que será trabalhada</Label>
              <Select value={mainModality} onValueChange={(v) => setMainModality(v || '')}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a modalidade" />
                </SelectTrigger>
                <SelectContent>
                  {MODALITIES.map((mod) => (
                    <SelectItem key={mod} value={mod}>{mod}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Protocolos previstos</Label>
              <Textarea
                value={protocols}
                onChange={(e) => setProtocols(e.target.value)}
                rows={3}
                placeholder="Protocolos e abordagens planejadas para este cliente..."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Termos e Consentimento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="lgpd-consent"
                checked={lgpdConsent}
                onChange={(e) => setLgpdConsent(e.target.checked)}
                className="mt-1"
              />
              <Label htmlFor="lgpd-consent" className="font-normal leading-snug">
                O cliente foi informado sobre o processo terapêutico e consente com o registro de dados (LGPD)
              </Label>
            </div>
            <div className="space-y-2">
              <Label>Assinatura digital (nome completo como confirmação)</Label>
              <Input
                value={consentName}
                onChange={(e) => setConsentName(e.target.value)}
                placeholder="Nome completo do cliente"
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Salvando...' : 'Salvar Ficha de Anamnese'}
        </Button>
      </div>
    </form>
  )
}
