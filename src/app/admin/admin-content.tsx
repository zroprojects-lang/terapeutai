'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Users, FileText, Shield, Crown, Link2, MousePointerClick, UserPlus, Plus, Trash2 } from 'lucide-react'

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

interface Affiliate {
  id: string
  therapist_id: string
  code: string
  clicks: number
  conversions: number
  active: boolean
  created_at: string
  therapists: { name: string; email: string } | null
}

export default function AdminContent() {
  const searchParams = useSearchParams()
  const key = searchParams.get('key')

  const [tab, setTab] = useState<'users' | 'affiliates'>('users')
  const [therapists, setTherapists] = useState<TherapistWithStats[]>([])
  const [affiliates, setAffiliates] = useState<Affiliate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)

  const [newCode, setNewCode] = useState('')
  const [newTherapistId, setNewTherapistId] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (!key) {
      setError('Chave de acesso não fornecida. Use ?key=SUA_CHAVE')
      setLoading(false)
      return
    }
    fetchAll()
  }, [key])

  async function fetchAll() {
    setLoading(true)
    const [tRes, aRes] = await Promise.all([
      fetch(`/api/admin?key=${key}`),
      fetch(`/api/admin/affiliates?key=${key}`),
    ])
    if (!tRes.ok) {
      setError('Chave inválida ou erro no servidor')
      setLoading(false)
      return
    }
    const tData = await tRes.json()
    setTherapists(tData.therapists)
    if (aRes.ok) {
      const aData = await aRes.json()
      setAffiliates(aData.affiliates)
    }
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

  async function createAffiliate() {
    if (!newCode || !newTherapistId) return
    setCreating(true)
    const res = await fetch(`/api/admin/affiliates?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ therapist_id: newTherapistId, code: newCode }),
    })
    if (res.ok) {
      setNewCode('')
      setNewTherapistId('')
      const aRes = await fetch(`/api/admin/affiliates?key=${key}`)
      if (aRes.ok) {
        const aData = await aRes.json()
        setAffiliates(aData.affiliates)
      }
    }
    setCreating(false)
  }

  async function deleteAffiliate(id: string) {
    await fetch(`/api/admin/affiliates?key=${key}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setAffiliates((prev) => prev.filter((a) => a.id !== id))
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
  const totalClicks = affiliates.reduce((acc, a) => acc + a.clicks, 0)
  const totalConversions = affiliates.reduce((acc, a) => acc + a.conversions, 0)

  const paidTherapists = therapists.filter((t) => t.plan !== 'gratuito')
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''

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

        <div className="flex gap-2">
          <Button
            variant={tab === 'users' ? 'default' : 'outline'}
            onClick={() => setTab('users')}
          >
            <Users className="h-4 w-4 mr-2" />
            Usuários
          </Button>
          <Button
            variant={tab === 'affiliates' ? 'default' : 'outline'}
            onClick={() => setTab('affiliates')}
          >
            <Link2 className="h-4 w-4 mr-2" />
            Afiliados
          </Button>
        </div>

        {tab === 'users' && (
          <>
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
          </>
        )}

        {tab === 'affiliates' && (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Links ativos</CardTitle>
                  <Link2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{affiliates.filter((a) => a.active).length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de cliques</CardTitle>
                  <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalClicks}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversões</CardTitle>
                  <UserPlus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalConversions}</div>
                  {totalClicks > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {((totalConversions / totalClicks) * 100).toFixed(1)}% de conversão
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Criar link de afiliado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-1 block">Terapeuta</label>
                    <Select
                      value={newTherapistId}
                      onValueChange={(val) => { if (val) setNewTherapistId(val) }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um terapeuta" />
                      </SelectTrigger>
                      <SelectContent>
                        {paidTherapists.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.name || t.email} ({t.plan})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-48">
                    <label className="text-sm font-medium mb-1 block">Código</label>
                    <Input
                      placeholder="ex: joana-reiki"
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                    />
                  </div>
                  <Button onClick={createAffiliate} disabled={creating || !newCode || !newTherapistId}>
                    <Plus className="h-4 w-4 mr-1" />
                    Criar
                  </Button>
                </div>
                {newCode && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Link: {baseUrl}/register?ref={newCode.toLowerCase().replace(/\s+/g, '-')}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Links de afiliados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-3 font-medium">Terapeuta</th>
                        <th className="pb-3 font-medium">Código</th>
                        <th className="pb-3 font-medium">Link</th>
                        <th className="pb-3 font-medium">Cliques</th>
                        <th className="pb-3 font-medium">Conversões</th>
                        <th className="pb-3 font-medium">Taxa</th>
                        <th className="pb-3 font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {affiliates.map((a) => (
                        <tr key={a.id} className="border-b last:border-0">
                          <td className="py-3 font-medium">
                            {a.therapists?.name || a.therapists?.email || '—'}
                          </td>
                          <td className="py-3">
                            <Badge variant="outline">{a.code}</Badge>
                          </td>
                          <td className="py-3 text-muted-foreground text-xs">
                            /register?ref={a.code}
                          </td>
                          <td className="py-3">{a.clicks}</td>
                          <td className="py-3">{a.conversions}</td>
                          <td className="py-3">
                            {a.clicks > 0
                              ? `${((a.conversions / a.clicks) * 100).toFixed(1)}%`
                              : '—'}
                          </td>
                          <td className="py-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteAffiliate(a.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {affiliates.length === 0 && (
                    <p className="py-8 text-center text-muted-foreground">Nenhum afiliado cadastrado ainda.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
