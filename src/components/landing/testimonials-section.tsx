'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Dra. Carla Mendes',
    specialty: 'Terapeuta Holística e Reiki Master, São Paulo - SP',
    text: 'Finalmente uma ferramenta que fala a minha língua. Consigo registrar o que realmente acontece nas sessões, sem precisar adaptar tudo pra um vocabulário médico que não tem nada a ver com o meu trabalho.',
    avatar: 'C',
    gender: 'f',
  },
  {
    name: 'Rodrigo Alves',
    specialty: 'Constelador Familiar e Coach Transpessoal, Belo Horizonte - MG',
    text: 'O controle de pacotes de sessões mudou minha vida. Antes eu anotava tudo no caderno e perdia o controle. Agora sei exatamente quem usou quantas sessões e quem ainda tem crédito.',
    avatar: 'R',
    gender: 'm',
  },
  {
    name: 'Bia Corrêa',
    specialty: 'Terapeuta de Florais e Acupunturista, Florianópolis - SC',
    text: 'A IA entende o que eu escrevo. Não fica tentando traduzir "campo áurico" pra CID. Isso fez toda a diferença pra eu realmente usar a plataforma no dia a dia.',
    avatar: 'B',
    gender: 'f',
  },
]

export function TestimonialsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-20" style={{ backgroundColor: '#FAFAF8' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2
            className="font-bold mb-4"
            style={{ fontSize: 'clamp(28px, 4vw, 40px)', color: '#2D2D2D', letterSpacing: '-0.02em' }}
          >
            O que dizem nossos primeiros terapeutas
          </h2>
          <p className="text-lg" style={{ color: '#6B7280' }}>
            Terapeutas holísticos que já estão usando o TerapeutAI no dia a dia.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="rounded-2xl p-6 flex flex-col"
              style={{ border: '1px solid #e5e7eb', backgroundColor: '#fff' }}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-current" style={{ color: '#E8985E' }} />
                ))}
              </div>

              <p className="text-sm leading-relaxed flex-1 mb-6" style={{ color: '#4B5563' }}>
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                  style={{ backgroundColor: t.gender === 'f' ? '#7C5C8A' : '#4A7C6F' }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#2D2D2D' }}>{t.name}</p>
                  <p className="text-xs" style={{ color: '#6B7280' }}>{t.specialty}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
