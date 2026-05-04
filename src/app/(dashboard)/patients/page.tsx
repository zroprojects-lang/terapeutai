import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus } from 'lucide-react'
import { NewPatientDialog } from '@/components/patients/new-patient-dialog'

export default async function PatientsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: patients } = await supabase
    .from('patients')
    .select('*, sessions(count)')
    .eq('therapist_id', user.id)
    .order('created_at', { ascending: false })

  const statusColor: Record<string, 'default' | 'secondary' | 'outline'> = {
    ativo: 'default',
    inativo: 'secondary',
    alta: 'outline',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pacientes</h2>
          <p className="text-muted-foreground">{patients?.length || 0} pacientes cadastrados</p>
        </div>
        <NewPatientDialog />
      </div>

      {patients && patients.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {patients.map((patient: any) => (
            <Link key={patient.id} href={`/patients/${patient.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{patient.name}</CardTitle>
                    <Badge variant={statusColor[patient.status] || 'default'}>
                      {patient.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground space-y-1">
                    {patient.initial_complaint && (
                      <p className="line-clamp-2">{patient.initial_complaint}</p>
                    )}
                    <p>{patient.sessions?.[0]?.count || 0} sessoes registradas</p>
                    <div className="flex gap-1 flex-wrap mt-2">
                      {patient.tags?.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Nenhum paciente cadastrado ainda.</p>
            <NewPatientDialog />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
