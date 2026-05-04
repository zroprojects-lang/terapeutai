'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { FileX, CalendarX, Receipt } from 'lucide-react'

const problems = [
  {
    icon: FileX,
    title: 'Prontuarios desorganizados',
    description: 'Cadernos, planilhas e documentos espalhados. Na hora de buscar uma informacao do paciente, e uma batalha.',
    color: '#E8985E',
    bg: '#E8985E12',
  },
  {
    icon: CalendarX,
    title: 'Agenda fora de controle',
    description: 'Pacientes que faltam sem avisar, horarios dificeis de gerenciar e tempo precioso perdido em reagendamentos.',
    color: '#7C5C8A',
    bg: '#7C5C8A12',
  },
  {
    icon: Receipt,
    title: 'Financeiro confuso',
    description: 'Sem saber ao certo o que foi pago, o que esta em aberto. O controle financeiro vira mais uma fonte de estresse.',
    color: '#E8985E',
    bg: '#E8985E12',
  },
]

export function ProblemSection() {
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
          <h2 className="font-bold mb-4" style={{ fontSize: 'clamp(28px, 4vw, 40px)', color: '#2D2D2D', letterSpacing: '-0.02em' }}>
            Voce se formou para cuidar de pessoas,
            <br />
            <span style={{ color: '#7C5C8A' }}>nao para fazer planilhas</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#6B7280' }}>
            A maioria dos terapeutas perde horas por semana em tarefas administrativas que poderiam ser automatizadas.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((problem, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <div
                className="rounded-2xl p-6 h-full transition-transform hover:scale-105 cursor-default"
                style={{ backgroundColor: problem.bg, border: `1px solid ${problem.color}25` }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${problem.color}20` }}
                >
                  <problem.icon className="h-6 w-6" style={{ color: problem.color }} />
                </div>
                <h3 className="font-semibold text-lg mb-2" style={{ color: '#2D2D2D' }}>
                  {problem.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                  {problem.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
