import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Política de Privacidade - TerapeutAI',
}

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen py-16 px-4" style={{ backgroundColor: '#FAFAF8' }}>
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm mb-8 hover:underline" style={{ color: '#4A7C6F' }}>
          <ArrowLeft className="h-4 w-4" />
          Voltar ao site
        </Link>

        <h1 className="text-3xl font-bold mb-2" style={{ color: '#2D2D2D' }}>Política de Privacidade</h1>
        <p className="text-sm mb-8" style={{ color: '#6B7280' }}>Última atualização: 05 de maio de 2026</p>

        <div className="prose prose-sm max-w-none space-y-6" style={{ color: '#4B5563' }}>
          <section>
            <h2 className="text-lg font-semibold" style={{ color: '#2D2D2D' }}>1. Introdução</h2>
            <p>
              O TerapeutAI (&quot;nós&quot;, &quot;nosso&quot;) é uma plataforma de gestão para terapeutas holísticos que se compromete com a proteção dos dados pessoais de seus usuários e dos clientes cadastrados na plataforma, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold" style={{ color: '#2D2D2D' }}>2. Dados que coletamos</h2>
            <p><strong>Do terapeuta (usuário da plataforma):</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Nome completo e email (para autenticação)</li>
              <li>Especialidade e modalidades terapêuticas</li>
              <li>Dados de uso da plataforma</li>
            </ul>
            <p className="mt-3"><strong>Dos clientes do terapeuta (cadastrados pelo usuário):</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Nome, email, telefone, data de nascimento</li>
              <li>Registros de sessões e notas terapêuticas</li>
              <li>Dados de pacotes e pagamentos</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold" style={{ color: '#2D2D2D' }}>3. Como usamos os dados</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Fornecer os serviços da plataforma (gestão de clientes, sessões, pacotes)</li>
              <li>Gerar resumos com IA (dados são anonimizados antes do envio — nomes, emails e telefones são removidos)</li>
              <li>Melhorar a experiência do usuário</li>
              <li>Cumprir obrigações legais</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold" style={{ color: '#2D2D2D' }}>4. Proteção dos dados</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Comunicação criptografada via HTTPS/TLS</li>
              <li>Row Level Security (RLS) no banco de dados — cada terapeuta acessa apenas seus dados</li>
              <li>Dados armazenados em servidores na região sa-east-1 (São Paulo)</li>
              <li>Acesso restrito apenas ao terapeuta responsável pelo cadastro</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold" style={{ color: '#2D2D2D' }}>5. Compartilhamento de dados</h2>
            <p>
              Não vendemos, alugamos ou compartilhamos dados pessoais com terceiros para fins comerciais. Os dados podem ser compartilhados apenas com:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Provedores de infraestrutura (Supabase, Vercel) — sob contrato de proteção de dados</li>
              <li>Provedores de IA (para geração de resumos) — dados anonimizados, sem identificação pessoal</li>
              <li>Autoridades competentes, quando exigido por lei</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold" style={{ color: '#2D2D2D' }}>6. Direitos do titular (LGPD)</h2>
            <p>Tanto o terapeuta quanto seus clientes têm direito a:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados incompletos ou desatualizados</li>
              <li>Solicitar a exclusão dos dados</li>
              <li>Exportar dados em formato legível (portabilidade)</li>
              <li>Revogar consentimento a qualquer momento</li>
            </ul>
            <p className="mt-2">
              O terapeuta pode exportar todos os dados de um cliente a qualquer momento pela plataforma. Para solicitações adicionais, entre em contato: <strong>contato@terapeutai.com.br</strong>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold" style={{ color: '#2D2D2D' }}>7. Retenção de dados</h2>
            <p>
              Os dados são mantidos enquanto a conta do terapeuta estiver ativa. Após exclusão da conta, os dados são removidos em até 30 dias, exceto quando a retenção for necessária por obrigação legal.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold" style={{ color: '#2D2D2D' }}>8. Contato</h2>
            <p>
              Para dúvidas sobre privacidade ou exercício de direitos: <strong>contato@terapeutai.com.br</strong>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
