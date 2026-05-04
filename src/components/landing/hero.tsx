'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Brain, Shield, TrendingUp } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden" style={{ backgroundColor: '#FAFAF8' }}>
      {/* Background gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: '#4A7C6F' }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-15 blur-3xl"
          style={{ backgroundColor: '#7C5C8A' }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{ backgroundColor: '#4A7C6F20', color: '#4A7C6F' }}
            >
              <span>✨</span>
              <span>Plataforma feita para terapeutas brasileiros</span>
            </motion.div>

            <h1
              className="font-bold leading-tight mb-6"
              style={{
                fontSize: 'clamp(36px, 5vw, 56px)',
                color: '#2D2D2D',
                letterSpacing: '-0.02em',
                lineHeight: '1.15',
              }}
            >
              Cuide dos seus{' '}
              <span style={{ color: '#4A7C6F' }}>pacientes.</span>
              <br />
              A gente cuida da{' '}
              <span style={{ color: '#7C5C8A' }}>sua gestao.</span>
            </h1>

            <p className="text-lg mb-8 leading-relaxed" style={{ color: '#6B7280' }}>
              Prontuario eletronico com IA, agenda e acompanhamento de evolucao — tudo em um so lugar.
              Para que seu tempo seja dedicado ao que realmente importa: seus pacientes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link href="/register">
                <button
                  className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all hover:scale-105 active:scale-95"
                  style={{ backgroundColor: '#E8985E', fontSize: '16px' }}
                >
                  Comecar Gratuitamente
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
              <a href="#funcionalidades">
                <button
                  className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-medium transition-all hover:scale-105"
                  style={{ color: '#4A7C6F', backgroundColor: 'transparent', fontSize: '16px', border: '1.5px solid #4A7C6F' }}
                >
                  Ver funcionalidades
                </button>
              </a>
            </div>

            {/* Trust signals */}
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2 text-sm" style={{ color: '#6B7280' }}>
                <Shield className="h-4 w-4" style={{ color: '#4A7C6F' }} />
                LGPD Compliant
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: '#6B7280' }}>
                <Brain className="h-4 w-4" style={{ color: '#7C5C8A' }} />
                IA para prontuarios
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: '#6B7280' }}>
                <TrendingUp className="h-4 w-4" style={{ color: '#E8985E' }} />
                Evolucao em graficos
              </div>
            </div>
          </motion.div>

          {/* Right: Dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div
              className="rounded-2xl p-6 shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #4A7C6F15, #7C5C8A10)',
                border: '1px solid #4A7C6F30',
                transform: 'perspective(1000px) rotateY(-5deg) rotateX(2deg)',
              }}
            >
              {/* Fake dashboard UI */}
              <div className="bg-white rounded-xl p-4 shadow-sm mb-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-4 w-32 rounded" style={{ backgroundColor: '#4A7C6F20' }} />
                  <div className="h-6 w-20 rounded-full text-xs flex items-center justify-center font-medium" style={{ backgroundColor: '#4A7C6F15', color: '#4A7C6F' }}>
                    IA ativo
                  </div>
                </div>
                <div className="space-y-2">
                  {[8, 6, 9, 7, 8].map((mood, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: mood >= 7 ? '#4A7C6F' : '#E8985E' }} />
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{ width: `${mood * 10}%`, backgroundColor: mood >= 7 ? '#4A7C6F' : '#E8985E' }}
                        />
                      </div>
                      <span className="text-xs font-medium" style={{ color: '#6B7280' }}>{mood}/10</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="h-3 w-24 rounded mb-3" style={{ backgroundColor: '#7C5C8A20' }} />
                <div className="space-y-2">
                  <div className="h-3 w-full rounded" style={{ backgroundColor: '#f1f5f9' }} />
                  <div className="h-3 w-4/5 rounded" style={{ backgroundColor: '#f1f5f9' }} />
                  <div className="h-3 w-3/4 rounded" style={{ backgroundColor: '#f1f5f9' }} />
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-5 w-16 rounded-full text-xs flex items-center justify-center" style={{ backgroundColor: '#4A7C6F15', color: '#4A7C6F' }}>
                    melhora ↑
                  </div>
                  <div className="h-5 w-20 rounded-full text-xs flex items-center justify-center" style={{ backgroundColor: '#7C5C8A15', color: '#7C5C8A' }}>
                    ansiedade
                  </div>
                </div>
              </div>
            </div>

            {/* Floating cards */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-4 -right-4 bg-white rounded-xl p-3 shadow-lg"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#4A7C6F20' }}>
                  <Brain className="h-4 w-4" style={{ color: '#4A7C6F' }} />
                </div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: '#2D2D2D' }}>Resumo gerado</p>
                  <p className="text-xs" style={{ color: '#6B7280' }}>IA identificou padrao</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute -bottom-4 -left-4 bg-white rounded-xl p-3 shadow-lg"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E8985E20' }}>
                  <TrendingUp className="h-4 w-4" style={{ color: '#E8985E' }} />
                </div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: '#2D2D2D' }}>Evolucao positiva</p>
                  <p className="text-xs" style={{ color: '#6B7280' }}>Humor: 5 → 8 em 4 semanas</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
