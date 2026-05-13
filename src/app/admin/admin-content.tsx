'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Users, FileText, Shield, Crown } from 'lucide-react'

interface TherapistWithStats {
  id: string
  email: string
  name: string
  specialty: string
  plan: string
  plan_activated_at: string | null
  created_at: string
  patient_count: number
  session_count: number
}

export default function AdminContent() {
  const searchParams = useSearchParams()
  const key = searchParams.get('key')

  const [therapists, setTherapists] = useState<TherapistWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    if (!key) {
      setError('Chave de acesso não fornecida. Use ?key=SUA_CHAVE')
      setLoading(false)
      return
    }
    fetchTherapists()
  }, [key])

  async function fetchTherapists() {
    setLoading(true)
    const res = await fetch(`/api/admin?key=${key}`)
    if (!res.ok) {
      setError('Chave inválida ou erro no servidor')
      setLoading(false)
      return
    }
    const data = await res.json()
    setTherapists(data.therapists)
    setLoading(false)
  }

  async function updatePlan(therapistId: string, plan: string) {
    setUpdating(therapistId)
    const res = await fetch(`/api/admin/plan?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ therapist_id: therapistId, plan }),
    })
    if (res.ok) {
      setTherapists((prev) =>
        prev.map((t) =>
          t.id === therapistId
            ? { ...t, plan, plan_activated_at: plan !== 'gratuito' ? new Date().toISOString() : null }
            : t
        )
      )
    }
    setUpdating(null)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalTherapists = therapists.length
  const totalPatients = therapists.reduce((acc, t) => acc + t.patient_count, 0)
  const totalSessions = therapists.reduce((acc, t) => acc + t.session_count, 0)
  const paidPlans = therapists.filter((t) => t.plan !== 'gratuito').length

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin — TerapeutAI</h1>
            <p className="text-muted-foreground">Gestão de usuários e planos beta</p>
          </div>
          <Badge variant="outline" className="gap-1">
            <Shield className="h-3 w-3" />
            Admin
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Terapeutas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTherapists}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes cadastrados</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPatients}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sessões registradas</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSessions}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Planos ativos</CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paidPlans}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Terapeutas cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium">Nome</th>
                    <th className="pb-3 font-medium">Email</th>
                    <th className="pb-3 font-medium">Especialidade</th>
                    <th className="pb-3 font-medium">Clientes</th>
                    <th className="pb-3 font-medium">Sessões</th>
                    <th className="pb-3 font-medium">Cadastro</th>
                    <th className="pb-3 font-medium">Plano</th>
                  </tr>
                </thead>
                <tbody>
                  {therapists.map((t) => (
                    <tr key={t.id} className="border-b last:border-0">
                      <td className="py-3 font-medium">{t.name || '—'}</td>
                      <td className="py-3 text-muted-foreground">{t.email}</td>
                      <td className="py-3">
                        <Badge variant="secondary">{t.specialty}</Badge>
                      </td>
                      <td className="py-3">{t.patient_count}</td>
                      <td className="py-3">{t.session_count}</td>
                      <td className="py-3 text-muted-foreground">
                        {new Date(t.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <Select
                            defaultValue={t.plan}
                            onValueChange={(val) => {
                              if (val) updatePlan(t.id, val)
                            }}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="gratuito">Gratuito</SelectItem>
                              <SelectItem value="profissional">Profissional</SelectItem>
                              <SelectItem value="clinica">Clínica</SelectItem>
                            </SelectContent>
                          </Select>
                          {updating === t.id && (
                            <span className="text-xs text-muted-foreground">Salvando...</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {therapists.length === 0 && (
                <p className="py-8 text-center text-muted-foreground">Nenhum terapeuta cadastrado ainda.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
