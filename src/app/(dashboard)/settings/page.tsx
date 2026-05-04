import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ChangePasswordForm } from '@/components/settings/change-password-form'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: therapist } = await supabase
    .from('therapists')
    .select('*')
    .eq('id', user.id)
    .single()

  const { count: auditCount } = await supabase
    .from('audit_logs')
    .select('*', { count: 'exact', head: true })
    .eq('therapist_id', user.id)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configuracoes</h2>
        <p className="text-muted-foreground">Gerencie sua conta e preferencias.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Nome</span>
            <span className="text-sm text-muted-foreground">{therapist?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Email</span>
            <span className="text-sm text-muted-foreground">{therapist?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Especialidade</span>
            <Badge variant="outline">{therapist?.specialty}</Badge>
          </div>
          {therapist?.crp_number && (
            <div className="flex justify-between">
              <span className="text-sm font-medium">CRP</span>
              <span className="text-sm text-muted-foreground">{therapist.crp_number}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>LGPD e Privacidade</CardTitle>
          <CardDescription>Informacoes sobre conformidade e seus dados.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Consentimento LGPD</span>
            <Badge>{therapist?.lgpd_consent_at ? 'Registrado' : 'Pendente'}</Badge>
          </div>
          {therapist?.lgpd_consent_at && (
            <div className="flex justify-between">
              <span className="text-sm font-medium">Data do consentimento</span>
              <span className="text-sm text-muted-foreground">
                {new Date(therapist.lgpd_consent_at).toLocaleDateString('pt-BR')}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-sm font-medium">Registros de auditoria</span>
            <span className="text-sm text-muted-foreground">{auditCount || 0} acoes registradas</span>
          </div>
          <Separator />
          <p className="text-xs text-muted-foreground">
            Todos os dados sensiveis dos seus pacientes sao armazenados com protecao.
            Voce pode exportar ou excluir dados a qualquer momento, conforme a LGPD.
          </p>
        </CardContent>
      </Card>

      <ChangePasswordForm />
    </div>
  )
}
