import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Termos de Uso - TerapeutAI',
}

export default function TermosPage() {
  return (
    <div className="min-h-screen py-16 px-4" style={{ backgroundColor: '#FAFAF8' }}>
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm mb-8 hover:underline" style={{ color: '#4A7C6F' }}>
          <ArrowLeft className="h-4 w-4" />
          Voltar ao site
        </Link>

        <h1 className="text-3xl font-bold mb-2" style={{ color: '#2D2D2D' }}>Termos de Uso</h1>
        <p className="text-sm mb-8" style={{ color: '#6B7280' }}>Última atualização: 05 de maio de 2026</p>

        <div className="prose prose-sm max-w-none space-y-6" style={{ color: '#4B5563' }}>
          <section>
            <h2 className="text-lg font-semibold" style={{ color: '#2D2D2D' }}>1. Aceitação dos Termos</h2>
            <p>
              Ao criar uma conta no TerapeutAI, você concorda com estes Termos de Uso. Se não concordar, não utilize a plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold" style={{ color: '#2D2D2D' }}>2. Descrição do Serviço</h2>
            <p>
              O TerapeutAI é uma plataforma SaaS de gestão para terapeutas holísticos que oferece:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Cadastro e gestão de clientes</li>
              <li>Registro de sessões terapêuticas</li>
              <li>Pacotes de sessões e controle financeiro</li>
              <li>Geração de resumos com inteligência artificial</li>
              <li>Agenda de atendimentos</li>
              <li>Exportação de dados (LGPD)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold" style={{ color: '#2D2D2D' }}>3. Responsabilidades do Usuário</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Manter suas credenciais de acesso em sigilo</li>
              <li>Garantir que possui consentimento de seus clientes para registrar dados na plataforma</li>
              <li>Utilizar a plataforma apenas para fins legítimos de gestão terapêutica</li>
              <li>Não armazenar conteúdo ilegal ou que viole direitos de terceiros</li>
              <li>Responsabilizar-se pela veracidade dos dados cadastrados</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold" style={{ color: '#2D2D2D' }}>4. Limitações da IA</h2>
            <p>
              A inteligência artificial integrada ao TerapeutAI é uma <strong>ferramenta de apoio</strong> para documentação. Ela:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>NÃO realiza diagnósticos</li>
              <li>NÃO substitui a avaliação profissional do terapeuta</li>
              <li>NÃO prescreve tratamentos</li>
              <li>Gera sugestões que devem ser revisadas pelo profissional antes do uso</li>
            </ul>
            <p className="mt-2">
              A decisão final sobre qualquer registro, observação ou conduta terapêutica é <strong>exclusivamente do profissional</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold" style={{ color: '#2D2D2D' }}>5. Planos e Pagamento</h2>
            <p>
              Durante a fase beta, todos os recursos estão disponíveis gratuitamente. Os planos pagos serão ativados com aviso prévio de no mínimo 30 dias. Não há fidelidade — o cancelamento pode ser feito a qualquer momento.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold" style={{ color: '#2D2D2D' }}>6. Disponibilidade</h2>
            <p>
              Nos esforçamos para manter a plataforma disponível 24/7, mas não garantimos disponibilidade ininterrupta. Manutenções programadas serão comunicadas com antecedência.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold" style={{ color: '#2D2D2D' }}>7. Propriedade Intelectual</h2>
            <p>
              O TerapeutAI e sua interface são propriedade da empresa. Os dados cadastrados pelo terapeuta permanecem de propriedade do terapeuta e podem ser exportados a qualquer momento.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold" style={{ color: '#2D2D2D' }}>8. Cancelamento e Exclusão</h2>
            <p>
              O usuário pode solicitar o cancelamento de sua conta e exclusão de todos os dados a qualquer momento. A exclusão será processada em até 30 dias úteis.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold" style={{ color: '#2D2D2D' }}>9. Alterações nos Termos</h2>
            <p>
              Podemos atualizar estes termos periodicamente. Alterações significativas serão comunicadas por email com 15 dias de antecedência.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold" style={{ color: '#2D2D2D' }}>10. Contato</h2>
            <p>
              Para dúvidas: <strong>contato@terapeutai.com.br</strong>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
