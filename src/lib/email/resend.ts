import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendWelcomeEmail(name: string, email: string) {
  const firstName = name.split(' ')[0]

  const { error } = await resend.emails.send({
    from: 'TerapeutAI <onboarding@resend.dev>',
    to: email,
    subject: `Bem-vindo ao TerapeutAI, ${firstName}!`,
    html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bem-vindo ao TerapeutAI</title>
</head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color:#0f172a;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">TerapeutAI</h1>
              <p style="margin:8px 0 0;color:#94a3b8;font-size:14px;">Gestao inteligente para terapeutas</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 16px;color:#0f172a;font-size:20px;font-weight:600;">Ola, ${firstName}! 👋</h2>
              <p style="margin:0 0 16px;color:#475569;font-size:15px;line-height:1.6;">
                Sua conta no TerapeutAI foi criada com sucesso. Estamos felizes em ter voce por aqui!
              </p>
              <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.6;">
                Com o TerapeutAI voce pode:
              </p>
              <!-- Features list -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
                    <span style="color:#0f172a;font-size:14px;">📋 <strong>Documentar sessoes</strong> com notas estruturadas</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
                    <span style="color:#0f172a;font-size:14px;">🤖 <strong>Resumos automaticos</strong> com IA apos cada sessao</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
                    <span style="color:#0f172a;font-size:14px;">📈 <strong>Acompanhar a evolucao</strong> dos seus pacientes</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;">
                    <span style="color:#0f172a;font-size:14px;">🔒 <strong>100% LGPD compliant</strong> — seus dados protegidos</span>
                  </td>
                </tr>
              </table>
              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://terapeutai.vercel.app/dashboard" style="display:inline-block;background-color:#0f172a;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:15px;font-weight:600;">
                      Acessar minha conta
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- First steps -->
          <tr>
            <td style="background-color:#f8fafc;padding:24px 40px;border-top:1px solid #e2e8f0;">
              <p style="margin:0 0 12px;color:#0f172a;font-size:14px;font-weight:600;">Primeiros passos sugeridos:</p>
              <p style="margin:0 0 6px;color:#64748b;font-size:13px;">1. Cadastre seu primeiro paciente</p>
              <p style="margin:0 0 6px;color:#64748b;font-size:13px;">2. Registre uma sessao e experimente o resumo por IA</p>
              <p style="margin:0;color:#64748b;font-size:13px;">3. Confira o grafico de evolucao do paciente</p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="margin:0;color:#94a3b8;font-size:12px;">
                Voce recebeu este email porque criou uma conta no TerapeutAI.<br>
                Em caso de duvidas, responda este email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  })

  if (error) {
    console.error('Failed to send welcome email:', error)
  }
}
