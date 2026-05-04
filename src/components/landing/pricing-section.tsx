'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Check } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: 'Gratuito',
    price: 'R$ 0',
    period: 'para sempre',
    description: 'Para comecar e explorar a plataforma.',
    features: [
      'Ate 3 pacientes',
      'Prontuario digital',
      'Agenda basica',
      'Export de dados (LGPD)',
      'Consentimento LGPD',
    ],
    cta: 'Comecar Gratis',
    ctaHref: '/register',
    highlighted: false,
    color: '#4A7C6F',
  },
  {
    name: 'Profissional',
    price: 'R$ 79',
    period: '/mes',
    description: 'Para terapeutas com consultorio ativo.',
    badge: 'Mais Popular',
    features: [
      'Pacientes ilimitados',
      'IA: resumos automaticos',
      'Deteccao de padroes',
      'Graficos de evolucao',
      'Agenda completa',
      'Audit log completo',
      'Suporte por email',
    ],
    cta: 'Testar 14 dias gratis',
    ctaHref: '/register',
    highlighted: true,
    color: '#7C5C8A',
  },
  {
    name: 'Clinica',
    price: 'R$ 199',
    period: '/mes',
    description: 'Para clinicas com multiplos profissionais.',
    features: [
      'Tudo do Profissional',
      'Ate 5 profissionais',
      'Dashboard administrativo',
      'Relatorios avancados',
      'Suporte prioritario',
      'Onboarding dedicado',
    ],
    cta: 'Falar com consultor',
    ctaHref: '/register',
    highlighted: false,
    color: '#4A7C6F',
  },
]

export function PricingSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="precos" ref={ref} className="py-24" style={{ backgroundColor: '#fff' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2
            className="font-bold mb-4"
            style={{ fontSize: 'clamp(28px, 4vw, 40px)', color: '#2D2D2D', letterSpacing: '-0.02em' }}
          >
            Invista na sua pratica.
            <br />
            <span style={{ color: '#4A7C6F' }}>O retorno comeca no primeiro dia.</span>
          </h2>
          <p className="text-lg" style={{ color: '#6B7280' }}>
            Sem fidelidade. Cancele quando quiser.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative rounded-2xl p-6"
              style={{
                border: plan.highlighted ? `2px solid ${plan.color}` : '1px solid #e5e7eb',
                backgroundColor: plan.highlighted ? `${plan.color}08` : '#fff',
                boxShadow: plan.highlighted ? `0 8px 32px ${plan.color}20` : 'none',
              }}
            >
              {plan.badge && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white whitespace-nowrap"
                  style={{ backgroundColor: plan.color }}
                >
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-bold text-lg mb-1" style={{ color: '#2D2D2D' }}>{plan.name}</h3>
                <p className="text-sm mb-4" style={{ color: '#6B7280' }}>{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="font-bold" style={{ fontSize: '36px', color: '#2D2D2D', letterSpacing: '-0.02em' }}>
                    {plan.price}
                  </span>
                  <span className="text-sm" style={{ color: '#6B7280' }}>{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm" style={{ color: '#2D2D2D' }}>
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${plan.color}20` }}
                    >
                      <Check className="h-3 w-3" style={{ color: plan.color }} />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href={plan.ctaHref}>
                <button
                  className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: plan.highlighted ? plan.color : 'transparent',
                    color: plan.highlighted ? '#fff' : plan.color,
                    border: plan.highlighted ? 'none' : `1.5px solid ${plan.color}`,
                  }}
                >
                  {plan.cta}
                </button>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center text-sm mt-8"
          style={{ color: '#6B7280' }}
        >
          * Planos pagos em fase de lancamento. Hoje todos os recursos estao disponiveis gratuitamente para usuarios beta.
        </motion.p>
      </div>
    </section>
  )
}
