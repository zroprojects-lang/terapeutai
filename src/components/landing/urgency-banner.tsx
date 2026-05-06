'use client'

import { useState } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'

export function UrgencyBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="relative w-full py-2.5 px-4 text-center text-sm text-white" style={{ backgroundColor: '#22c55e' }}>
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 flex-wrap">
        <span>✨ Beta gratuito aberto — todos os recursos liberados até 31/05.</span>
        <Link href="/register" className="font-bold underline underline-offset-2 hover:no-underline">
          Garanta seu acesso agora.
        </Link>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/20 transition-colors"
        aria-label="Fechar banner"
      >
        <X className="h-4 w-4 text-white" />
      </button>
    </div>
  )
}
