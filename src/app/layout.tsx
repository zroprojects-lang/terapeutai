import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TerapeutAI - Gestao Inteligente para Terapeutas Holísticos',
  description: 'Plataforma de gestao de clientes com IA para terapeutas holísticos — Reiki, Constelação Familiar, Florais, Acupuntura. Prontuário, pacotes de sessões e controle financeiro.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
