'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { NewPatientDialog } from '@/components/patients/new-patient-dialog'

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  async function loadPatients() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('patients')
      .select('*, sessions(count)')
      .eq('therapist_id', user.id)
      .order('created_at', { ascending: false })

    setPatients(data || [])
    setLoading(false)
  }

  useEffect(() => { loadPatients() }, [])

  const filtered = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.tags?.some((t: string) => t.toLowerCase().includes(search.toLowerCase()))
  )

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
          <p className="text-muted-foreground">{patients.length} pacientes cadastrados</p>
        </div>
        <NewPatientDialog onCreated={loadPatients} />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm">Carregando...</p>
      ) : filtered.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((patient) => (
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
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
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
            <p className="text-muted-foreground mb-4">
              {search ? 'Nenhum paciente encontrado.' : 'Nenhum paciente cadastrado ainda.'}
            </p>
            {!search && <NewPatientDialog onCreated={loadPatients} />}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
