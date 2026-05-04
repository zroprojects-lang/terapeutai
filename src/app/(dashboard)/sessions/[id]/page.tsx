import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { EditSessionDialog } from '@/components/sessions/edit-session-dialog'
import { DeleteSessionDialog } from '@/components/sessions/delete-session-dialog'

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: session } = await supabase
    .from('sessions')
    .select('*, patients(id, name)')
    .eq('id', id)
    .eq('therapist_id', user.id)
    .single()

  if (!session) notFound()

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/patients/${session.patient_id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight">
            Sessao — {(session as any).patients?.name}
          </h2>
          <p className="text-muted-foreground">
            {new Date(session.date).toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <EditSessionDialog session={session} />
          <DeleteSessionDialog sessionId={session.id} patientId={session.patient_id} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">Humor</p>
            <p className="text-3xl font-bold">{session.mood_rating}/10</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">Duracao</p>
            <p className="text-3xl font-bold">{session.duration_minutes} min</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge className="text-lg mt-1">{session.status}</Badge>
          </CardContent>
        </Card>
      </div>

      {session.ai_summary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Resumo gerado por IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{session.ai_summary}</p>
            <p className="text-xs text-muted-foreground mt-3 italic">
              Sugestao gerada por IA para consideracao do profissional.
            </p>
          </CardContent>
        </Card>
      )}

      {session.ai_patterns && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Padroes identificados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(session.ai_patterns as any).themes?.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-1">Temas</p>
                <div className="flex gap-1 flex-wrap">
                  {(session.ai_patterns as any).themes.map((t: string) => (
                    <Badge key={t} variant="outline">{t}</Badge>
                  ))}
                </div>
              </div>
            )}
            {(session.ai_patterns as any).attention_points?.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-1">Pontos de atencao</p>
                <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                  {(session.ai_patterns as any).attention_points.map((p: string, i: number) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            )}
            {(session.ai_patterns as any).evolution && (
              <div>
                <p className="text-sm font-medium mb-1">Percepcao de evolucao</p>
                <Badge variant={
                  (session.ai_patterns as any).evolution === 'melhora' ? 'default' :
                  (session.ai_patterns as any).evolution === 'piora' ? 'destructive' : 'secondary'
                }>
                  {(session.ai_patterns as any).evolution}
                </Badge>
                {(session.ai_patterns as any).evolution_reason && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {(session.ai_patterns as any).evolution_reason}
                  </p>
                )}
              </div>
            )}
            <p className="text-xs text-muted-foreground italic">
              Sugestao gerada por IA para consideracao do profissional.
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Notas da sessao</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm whitespace-pre-wrap">{session.session_notes}</p>
        </CardContent>
      </Card>

      {session.tags?.length > 0 && (
        <div className="flex gap-1 flex-wrap">
          {session.tags.map((tag: string) => (
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
        </div>
      )}
    </div>
  )
}
