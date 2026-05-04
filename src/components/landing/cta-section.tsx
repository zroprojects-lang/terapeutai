'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function CtaSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-24" style={{ backgroundColor: '#fff' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="rounded-3xl p-12 text-center"
          style={{ background: 'linear-gradient(135deg, #4A7C6F, #7C5C8A)' }}
        >
          <h2
            className="font-bold text-white mb-4"
            style={{ fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-0.02em' }}
          >
            Sua proxima sessao pode ser diferente
          </h2>
          <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Comece hoje gratuitamente e descubra como e atender sem estresse administrativo.
          </p>
          <Link href="/register">
            <button
              className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-semibold text-base transition-all hover:scale-105 active:scale-95"
              style={{ backgroundColor: '#E8985E', color: '#fff', border: 'none' }}
            >
              Criar Minha Conta Gratis
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
          <p className="mt-4 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Setup em 2 minutos &bull; Sem cartao de credito &bull; Cancele quando quiser
          </p>
        </motion.div>
      </div>
    </section>
  )
}
