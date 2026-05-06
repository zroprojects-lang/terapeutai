'use client'

import { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'

export function FeedbackButton() {
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // TODO: integrar com email/webhook (Resend, Slack, etc.)
    setSubmitted(true)
    setTimeout(() => {
      setOpen(false)
      setSubmitted(false)
      setMessage('')
      setEmail('')
    }, 2000)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full text-white text-sm font-medium shadow-lg hover:scale-105 transition-transform"
        style={{ backgroundColor: '#4A7C6F' }}
      >
        <MessageCircle className="h-4 w-4" />
        <span className="hidden sm:inline">Dar sugestão</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 p-1 rounded hover:bg-gray-100 transition-colors"
            >
              <X className="h-4 w-4" style={{ color: '#6B7280' }} />
            </button>

            {submitted ? (
              <div className="text-center py-8">
                <p className="text-lg font-semibold mb-2" style={{ color: '#4A7C6F' }}>
                  Obrigado pela sugestão! 💚
                </p>
                <p className="text-sm" style={{ color: '#6B7280' }}>
                  Sua opinião nos ajuda a construir uma ferramenta melhor.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 className="font-bold text-lg mb-1" style={{ color: '#2D2D2D' }}>
                  Sua sugestão
                </h3>
                <p className="text-sm mb-4" style={{ color: '#6B7280' }}>
                  Estamos em beta — sua opinião conta muito.
                </p>

                <div className="space-y-3">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="O que podemos melhorar?"
                    rows={4}
                    required
                    className="w-full rounded-xl border px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#4A7C6F]"
                    style={{ borderColor: '#e5e7eb' }}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Seu email (opcional)"
                    className="w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2"
                    style={{ borderColor: '#e5e7eb' }}
                  />
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all hover:scale-105 active:scale-95"
                    style={{ backgroundColor: '#4A7C6F' }}
                  >
                    Enviar sugestão
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
