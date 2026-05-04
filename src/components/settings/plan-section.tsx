'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Zap } from 'lucide-react'
import type { Therapist } from '@/types/database'

const CHECKOUT_URL = 'https://app.flowpay.cash/checkout/0087d9de6ca6e901'

const planDetails = {
  gratuito: {
    label: 'Gratuito',
    color: '#6B7280',
    features: ['Ate 3 pacientes', 'Prontuario basico', 'Agenda', 'Export LGPD'],
  },
  profissional: {
    label: 'Profissional',
    color: '#4A7C6F',
    features: ['Pacientes ilimitados', 'IA: resumos e padroes', 'Graficos de evolucao', 'Agenda completa', 'Audit log'],
  },
  clinica: {
    label: 'Clinica',
    color: '#7C5C8A',
    features: ['Tudo do Profissional', 'Ate 5 profissionais', 'Dashboard administrativo', 'Suporte prioritario'],
  },
}

export function PlanSection({ therapist }: { therapist: Therapist }) {
  const current = planDetails[therapist.plan]

  function buildCheckoutUrl(plan: string) {
    const params = new URLSearchParams({
      utm_source: 'terapeutai',
      utm_medium: 'dashboard',
      utm_campaign: 'upgrade',
      utm_content: therapist.email,
      utm_term: plan,
    })
    return `${CHECKOUT_URL}?${params.toString()}`
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Plano atual</CardTitle>
          <Badge
            className="text-sm px-3 py-1"
            style={{
              backgroundColor: `${current.color}15`,
              color: current.color,
              border: `1px solid ${current.color}30`,
            }}
          >
            {current.label}
          </Badge>
        </div>
        <CardDescription>
          {therapist.plan === 'gratuito'
            ? 'Voce esta no plano gratuito. Faca upgrade para desbloquear todos os recursos.'
            : `Plano ativado em ${therapist.plan_activated_at ? new Date(therapist.plan_activated_at).toLocaleDateString('pt-BR') : 'data nao registrada'}.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current plan features */}
        <div className="rounded-xl p-4" style={{ backgroundColor: `${current.color}08`, border: `1px solid ${current.color}20` }}>
          <p className="text-sm font-medium mb-3" style={{ color: current.color }}>
            Incluido no seu plano:
          </p>
          <ul className="space-y-2">
            {current.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm" style={{ color: '#2D2D2D' }}>
                <Check className="h-4 w-4 flex-shrink-0" style={{ color: current.color }} />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Upgrade options */}
        {therapist.plan === 'gratuito' && (
          <div className="space-y-3">
            <p className="text-sm font-medium" style={{ color: '#2D2D2D' }}>Fazer upgrade:</p>

            <div className="rounded-xl p-4" style={{ border: '1px solid #4A7C6F40', backgroundColor: '#4A7C6F05' }}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#2D2D2D' }}>Profissional</p>
                  <p className="text-xs" style={{ color: '#6B7280' }}>Pacientes ilimitados + IA completa</p>
                </div>
                <span className="font-bold" style={{ color: '#4A7C6F' }}>R$ 79/mes</span>
              </div>
              <a href={buildCheckoutUrl('profissional')} target="_blank" rel="noopener noreferrer">
                <button
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
                  style={{ backgroundColor: '#4A7C6F', border: 'none' }}
                >
                  <Zap className="h-4 w-4" />
                  Assinar Profissional
                </button>
              </a>
            </div>

            <div className="rounded-xl p-4" style={{ border: '1px solid #7C5C8A40', backgroundColor: '#7C5C8A05' }}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#2D2D2D' }}>Clinica</p>
                  <p className="text-xs" style={{ color: '#6B7280' }}>Multiplos profissionais</p>
                </div>
                <span className="font-bold" style={{ color: '#7C5C8A' }}>R$ 199/mes</span>
              </div>
              <a href={buildCheckoutUrl('clinica')} target="_blank" rel="noopener noreferrer">
                <button
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
                  style={{ backgroundColor: '#7C5C8A', border: 'none' }}
                >
                  <Zap className="h-4 w-4" />
                  Assinar Clinica
                </button>
              </a>
            </div>

            <p className="text-xs text-center" style={{ color: '#6B7280' }}>
              Sem fidelidade. Cancele quando quiser.
            </p>
          </div>
        )}

        {therapist.plan !== 'gratuito' && (
          <p className="text-xs" style={{ color: '#6B7280' }}>
            Para cancelar ou alterar seu plano, entre em contato: suporte@terapeutai.com.br
          </p>
        )}
      </CardContent>
    </Card>
  )
}
