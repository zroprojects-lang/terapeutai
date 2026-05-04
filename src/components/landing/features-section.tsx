'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Brain, Calendar, TrendingUp, Shield, FileText } from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'Prontuario com IA',
    description: 'Registre sessoes e gere resumos automaticos com IA. Identifique padroes ao longo do tempo e tenha o historico completo do paciente em segundos.',
    color: '#7C5C8A',
    tag: 'Inteligencia Artificial',
  },
  {
    icon: Calendar,
    title: 'Agenda Organizada',
    description: 'Gerencie sua agenda com calendario visual. Agende consultas, controle faltas e mantenha sua rotina de atendimentos sob controle.',
    color: '#4A7C6F',
    tag: 'Produtividade',
  },
  {
    icon: TrendingUp,
    title: 'Evolucao do Paciente',
    description: 'Acompanhe a evolucao de humor e temas ao longo das sessoes com graficos visuais. Veja claramente quando o paciente esta progredindo.',
    color: '#E8985E',
    tag: 'Insights',
  },
  {
    icon: FileText,
    title: 'Ficha Completa',
    description: 'Cadastro detalhado com queixa inicial, historico, tags e notas. Tudo organizado e facil de encontrar na hora que voce precisar.',
    color: '#4A7C6F',
    tag: 'Organizacao',
  },
  {
    icon: Shield,
    title: '100% LGPD Compliant',
    description: 'Dados dos seus pacientes protegidos por lei. Consentimento registrado, audit log, exportacao de dados e criptografia em transito.',
    color: '#7C5C8A',
    tag: 'Seguranca',
  },
]

export function FeaturesSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="funcionalidades" ref={ref} className="py-24" style={{ backgroundColor: '#fff' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4"
            style={{ backgroundColor: '#4A7C6F15', color: '#4A7C6F' }}
          >
            Funcionalidades
          </div>
          <h2
            className="font-bold mb-4"
            style={{ fontSize: 'clamp(28px, 4vw, 40px)', color: '#2D2D2D', letterSpacing: '-0.02em' }}
          >
            Tudo que voce precisa
            <br />
            <span style={{ color: '#4A7C6F' }}>em uma plataforma intuitiva</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#6B7280' }}>
            Desenvolvido especialmente para a realidade do terapeuta brasileiro, com as ferramentas certas e sem complicacao.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group rounded-2xl p-6 transition-all hover:shadow-lg hover:-translate-y-1 cursor-default"
              style={{ border: '1px solid #e5e7eb', backgroundColor: '#fff' }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${feature.color}15` }}
              >
                <feature.icon className="h-6 w-6" style={{ color: feature.color }} />
              </div>
              <div
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium mb-3"
                style={{ backgroundColor: `${feature.color}12`, color: feature.color }}
              >
                {feature.tag}
              </div>
              <h3 className="font-semibold text-lg mb-2" style={{ color: '#2D2D2D' }}>
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                {feature.description}
              </p>
            </motion.div>
          ))}

          {/* CTA card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="rounded-2xl p-6 flex flex-col justify-between"
            style={{ background: 'linear-gradient(135deg, #4A7C6F, #7C5C8A)' }}
          >
            <div>
              <h3 className="font-bold text-xl text-white mb-3">
                Pronto para comecar?
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
                Crie sua conta gratis e experimente todas as funcionalidades sem precisar de cartao de credito.
              </p>
            </div>
            <a href="/register" className="mt-6 block">
              <button
                className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105"
                style={{ backgroundColor: '#E8985E', color: '#fff', border: 'none' }}
              >
                Comecar Gratuitamente
              </button>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
