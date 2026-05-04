'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { UserPlus, Users, Sparkles } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Crie sua conta em 2 minutos',
    description: 'Cadastro simples com nome, email e especialidade. Sem burocracia, sem cartao de credito.',
    color: '#4A7C6F',
  },
  {
    number: '02',
    icon: Users,
    title: 'Cadastre seus pacientes',
    description: 'Adicione os dados dos seus pacientes, configure sua agenda e importe seu historico de atendimentos.',
    color: '#7C5C8A',
  },
  {
    number: '03',
    icon: Sparkles,
    title: 'Atenda com mais leveza',
    description: 'Registre sessoes, gere resumos com IA e acompanhe a evolucao dos seus pacientes com graficos claros.',
    color: '#E8985E',
  },
]

export function HowItWorks() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-24" style={{ backgroundColor: '#FAFAF8' }}>
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
            Como funciona
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: '#6B7280' }}>
            Tres passos simples para transformar a gestao do seu consultorio.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connector line desktop */}
          <div
            className="hidden md:block absolute top-16 left-1/6 right-1/6 h-0.5 opacity-20"
            style={{ backgroundColor: '#4A7C6F' }}
          />

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="flex flex-col items-center text-center"
              >
                <div className="relative mb-6">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-md"
                    style={{ backgroundColor: `${step.color}15`, border: `2px solid ${step.color}30` }}
                  >
                    <step.icon className="h-7 w-7" style={{ color: step.color }} />
                  </div>
                  <div
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: step.color }}
                  >
                    {i + 1}
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-3" style={{ color: '#2D2D2D' }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
