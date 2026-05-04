'use client'

import Link from 'next/link'
import { Shield, Lock } from 'lucide-react'

export function Footer() {
  return (
    <footer className="py-16 border-t" style={{ backgroundColor: '#fff' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#4A7C6F' }}>
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="font-bold text-lg" style={{ color: '#2D2D2D' }}>TerapeutAI</span>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#6B7280' }}>
              Gestao inteligente para terapeutas e psicologos brasileiros.
            </p>
            <div className="flex gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#4A7C6F15', color: '#4A7C6F' }}>
                <Shield className="h-3 w-3" />
                LGPD Compliant
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#7C5C8A15', color: '#7C5C8A' }}>
                <Lock className="h-3 w-3" />
                Dados Criptografados
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4" style={{ color: '#2D2D2D' }}>Produto</h4>
            <ul className="space-y-2">
              {['Funcionalidades', 'Precos', 'FAQ'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="text-sm transition-colors" style={{ color: '#6B7280' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#4A7C6F')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4" style={{ color: '#2D2D2D' }}>Plataforma</h4>
            <ul className="space-y-2">
              {[
                { label: 'Entrar', href: '/login' },
                { label: 'Criar conta', href: '/register' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm transition-colors" style={{ color: '#6B7280' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#4A7C6F')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4" style={{ color: '#2D2D2D' }}>Legal</h4>
            <ul className="space-y-2">
              {['Politica de Privacidade', 'Termos de Uso', 'LGPD'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm transition-colors" style={{ color: '#6B7280' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#4A7C6F')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm" style={{ color: '#6B7280' }}>
            © 2026 TerapeutAI. Todos os direitos reservados.
          </p>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            Feito com 💚 para terapeutas brasileiros
          </p>
        </div>
      </div>
    </footer>
  )
}
