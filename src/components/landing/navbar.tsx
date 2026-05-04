'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#4A7C6F' }}>
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="font-bold text-lg" style={{ color: '#2D2D2D' }}>TerapeutAI</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#funcionalidades" className="text-sm transition-colors" style={{ color: '#6B7280' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#4A7C6F')}
            onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}>
            Funcionalidades
          </a>
          <a href="#precos" className="text-sm transition-colors" style={{ color: '#6B7280' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#4A7C6F')}
            onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}>
            Precos
          </a>
          <a href="#faq" className="text-sm transition-colors" style={{ color: '#6B7280' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#4A7C6F')}
            onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}>
            FAQ
          </a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" className="text-sm" style={{ color: '#2D2D2D' }}>
              Entrar
            </Button>
          </Link>
          <Link href="/register">
            <Button
              className="text-sm text-white rounded-xl px-5"
              style={{ backgroundColor: '#E8985E', border: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#d4834a')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#E8985E')}
            >
              Comecar Gratis
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-4 space-y-4">
          <a href="#funcionalidades" className="block text-sm py-2" style={{ color: '#6B7280' }} onClick={() => setMenuOpen(false)}>Funcionalidades</a>
          <a href="#precos" className="block text-sm py-2" style={{ color: '#6B7280' }} onClick={() => setMenuOpen(false)}>Precos</a>
          <a href="#faq" className="block text-sm py-2" style={{ color: '#6B7280' }} onClick={() => setMenuOpen(false)}>FAQ</a>
          <Link href="/login" onClick={() => setMenuOpen(false)}>
            <Button variant="outline" className="w-full">Entrar</Button>
          </Link>
          <Link href="/register" onClick={() => setMenuOpen(false)}>
            <Button className="w-full text-white" style={{ backgroundColor: '#E8985E', border: 'none' }}>
              Comecar Gratis
            </Button>
          </Link>
        </div>
      )}
    </header>
  )
}
