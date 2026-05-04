import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Plus } from 'lucide-react'
import { MoodChart } from '@/components/charts/mood-chart'
import { EditPatientDialog } from '@/components/patients/edit-patient-dialog'
import { DeletePatientDialog } from '@/components/patients/delete-patient-dialog'

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: patient } = await supabase
    .from('patients')
    .select('*')
    .eq('id', id)
    .eq('therapist_id', user.id)
    .single()

  if (!patient) notFound()

  const { data: sessions } = await supabase
    .from('sessions')
    .select('*')
    .eq('patient_id', id)
    .eq('therapist_id', user.id)
    .order('date', { ascending: false })

  const completedSessions = sessions?.filter((s) => s.status === 'realizada') || []

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/patients">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight">{patient.name}</h2>
            <Badge>{patient.status}</Badge>
          </div>
          {patient.initial_complaint && (
            <p className="text-muted-foreground mt-1">{patient.initial_complaint}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/sessions/new?patient=${id}`}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova sessao
            </Button>
          </Link>
          <EditPatientDialog patient={patient} />
          <DeletePatientDialog patientId={patient.id} patientName={patient.name} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de sessoes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessions?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Humor medio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedSessions.length > 0
                ? (completedSessions.reduce((acc, s) => acc + s.mood_rating, 0) / completedSessions.length).toFixed(1)
                : '-'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ultimo humor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedSessions[0]?.mood_rating || '-'}/10
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Desde</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(patient.created_at).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="timeline">
        <TabsList>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="evolution">Evolucao</TabsTrigger>
          <TabsTrigger value="info">Dados</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4 mt-4">
          {sessions && sessions.length > 0 ? (
            sessions.map((session) => (
              <Link key={session.id} href={`/sessions/${session.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer mb-4">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {new Date(session.date).toLocaleDateString('pt-BR')}
                        </span>
                        <Badge variant={session.status === 'realizada' ? 'default' : 'secondary'}>
                          {session.status}
                        </Badge>
                        {session.ai_summary && <Badge variant="outline">IA</Badge>}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Humor: {session.mood_rating}/10
                      </span>
                    </div>
                    {session.ai_summary && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                        {session.ai_summary}
                      </p>
                    )}
                    {!session.ai_summary && session.session_notes && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                        {session.session_notes}
                      </p>
                    )}
                    <div className="flex gap-1 flex-wrap mt-3">
                      {session.tags?.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground mb-4">Nenhuma sessao registrada.</p>
                <Link href={`/sessions/new?patient=${id}`}>
                  <Button>Registrar primeira sessao</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="evolution" className="mt-4">
          {completedSessions.length >= 2 ? (
            <Card>
              <CardHeader>
                <CardTitle>Evolucao do humor</CardTitle>
              </CardHeader>
              <CardContent>
                <MoodChart
                  data={completedSessions
                    .slice()
                    .reverse()
                    .map((s) => ({
                      date: new Date(s.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
                      mood: s.mood_rating,
                    }))}
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  Registre pelo menos 2 sessoes para ver a evolucao.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="info" className="mt-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{patient.email || 'Nao informado'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Telefone</p>
                  <p className="text-sm text-muted-foreground">{patient.phone || 'Nao informado'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Data de nascimento</p>
                  <p className="text-sm text-muted-foreground">
                    {patient.birth_date
                      ? new Date(patient.birth_date).toLocaleDateString('pt-BR')
                      : 'Nao informado'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <p className="text-sm text-muted-foreground">{patient.status}</p>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-1">Queixa inicial</p>
                <p className="text-sm text-muted-foreground">
                  {patient.initial_complaint || 'Nao informado'}
                </p>
              </div>
              {patient.notes && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium mb-1">Observacoes</p>
                    <p className="text-sm text-muted-foreground">{patient.notes}</p>
                  </div>
                </>
              )}
              <Separator />
              <div>
                <p className="text-sm font-medium mb-1">Tags</p>
                <div className="flex gap-1 flex-wrap">
                  {patient.tags?.length > 0 ? (
                    patient.tags.map((tag: string) => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhuma tag</p>
                  )}
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-1">LGPD</p>
                <p className="text-sm text-muted-foreground">
                  {patient.lgpd_consent_recorded
                    ? `Consentimento registrado em ${patient.lgpd_consent_at ? new Date(patient.lgpd_consent_at).toLocaleDateString('pt-BR') : 'data nao registrada'}`
                    : 'Consentimento nao registrado'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
