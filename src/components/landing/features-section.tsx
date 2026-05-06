'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Brain, Calendar, TrendingUp, Shield, FileText, Package, DollarSign } from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'Prontuário Holístico com IA',
    description: 'Registre sessões e gere resumos automáticos com IA que entende vocabulário energético, técnicas e protocolos holísticos. Sem traduzir para linguagem médica.',
    color: '#7C5C8A',
    tag: 'Inteligência Artificial',
  },
  {
    icon: Package,
    title: 'Pacotes de Sessões',
    description: 'Venda e controle pacotes de 5, 10 ou mais sessões. Saiba exatamente quantas sessões cada cliente usou e quanto ainda tem disponível.',
    color: '#E8985E',
    tag: 'Gestão',
  },
  {
    icon: DollarSign,
    title: 'Controle Financeiro com PIX',
    description: 'Registre pagamentos por PIX, dinheiro ou transferência. Veja quem pagou, quem está pendente e quanto você recebeu no mês.',
    color: '#4A7C6F',
    tag: 'Financeiro',
  },
  {
    icon: Calendar,
    title: 'Agenda Organizada',
    description: 'Gerencie sua agenda com calendário visual. Agende atendimentos, controle faltas e mantenha sua rotina sob controle.',
    color: '#4A7C6F',
    tag: 'Produtividade',
  },
  {
    icon: TrendingUp,
    title: 'Evolução do Cliente',
    description: 'Acompanhe a evolução de abertura energética e temas ao longo das sessões com gráficos visuais. Veja claramente quando o cliente está progredindo.',
    color: '#E8985E',
    tag: 'Insights',
  },
  {
    icon: Shield,
    title: '100% LGPD Compliant',
    description: 'Dados dos seus clientes protegidos por lei. Consentimento registrado, exportação de dados e criptografia em trânsito.',
    color: '#7C5C8A',
    tag: 'Segurança',
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
