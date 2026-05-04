'use client'

import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: 'Os dados dos meus pacientes estao seguros?',
    answer: 'Sim. Toda a comunicacao e feita via HTTPS com criptografia TLS. Os dados ficam armazenados no Supabase com Row Level Security — cada terapeuta so acessa seus proprios dados. Estamos em conformidade com a LGPD, incluindo consentimento registrado, audit log e direito a portabilidade dos dados.',
  },
  {
    question: 'Preciso instalar algum programa?',
    answer: 'Nao. O TerapeutAI e 100% online. Funciona no navegador do computador, tablet ou celular. Nao ha instalacao, nao ha atualizacoes manuais.',
  },
  {
    question: 'A plataforma segue as normas do CFP?',
    answer: 'Sim. O prontuario eletronico e compativel com a Resolucao CFP 001/2009. A IA e posicionada como ferramenta de apoio — todas as sugestoes geradas vem com disclaimer claro de que a decisao final e sempre do profissional. Nenhum diagnostico e feito pela IA.',
  },
  {
    question: 'Funciona no celular?',
    answer: 'Sim. O layout e responsivo e funciona bem em smartphones e tablets. Voce pode registrar sessoes, consultar a agenda e acessar fichas de pacientes diretamente pelo celular.',
  },
  {
    question: 'Como funciona a IA nos prontuarios?',
    answer: 'Apos registrar as notas de uma sessao, voce pode clicar em "Gerar resumo com IA". A IA analisa o texto, identifica temas principais, pontos de atencao e percebe a evolucao do paciente em relacao ao historico. Os dados sao anonimizados antes de serem enviados para a IA — nome, telefone e email do paciente nunca chegam ao modelo.',
  },
  {
    question: 'Posso exportar os dados dos meus pacientes?',
    answer: 'Sim. Voce pode exportar todos os dados de um paciente a qualquer momento em formato JSON — isso garante a portabilidade de dados exigida pela LGPD. O export inclui ficha completa e historico de todas as sessoes.',
  },
  {
    question: 'Quanto custa?',
    answer: 'Durante o beta, todos os recursos estao disponiveis gratuitamente. Os planos pagos (Profissional a R$79/mes e Clinica a R$199/mes) serao ativados em breve, com aviso previo para todos os usuarios.',
  },
]

export function FaqSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" ref={ref} className="py-24" style={{ backgroundColor: '#FAFAF8' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
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
            Perguntas frequentes
          </h2>
          <p className="text-lg" style={{ color: '#6B7280' }}>
            Tire suas duvidas sobre o TerapeutAI.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="rounded-2xl overflow-hidden"
              style={{ border: '1px solid #e5e7eb', backgroundColor: '#fff' }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left transition-colors hover:bg-gray-50"
              >
                <span className="font-medium text-sm pr-4" style={{ color: '#2D2D2D' }}>
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="h-4 w-4" style={{ color: '#6B7280' }} />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="px-6 pb-4 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
