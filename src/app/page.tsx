import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">TerapeutAI</h1>
          <div className="flex gap-2">
            <Link href="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/register">
              <Button>Criar conta</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center">
        <div className="container mx-auto px-4 py-16 text-center max-w-2xl">
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            Gestao inteligente para seu consultorio
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Documente sessoes, acompanhe a evolucao dos seus pacientes e receba insights com IA.
            Tudo em conformidade com a LGPD.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg">Comecar gratuitamente</Button>
            </Link>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div>
              <h3 className="font-semibold mb-2">Prontuario com IA</h3>
              <p className="text-sm text-muted-foreground">
                Resumos automaticos das sessoes e deteccao de padroes ao longo do tempo.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">LGPD Compliant</h3>
              <p className="text-sm text-muted-foreground">
                Dados sensiveis protegidos, consentimento registrado, audit log completo.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Evolucao do Paciente</h3>
              <p className="text-sm text-muted-foreground">
                Graficos de humor, temas recorrentes e alertas de regressao ou melhora.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        TerapeutAI — Seus dados protegidos, seus pacientes acompanhados.
      </footer>
    </div>
  )
}
