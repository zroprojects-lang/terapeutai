'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DollarSign, TrendingUp, Users, Calendar, Plus } from 'lucide-react'
import { toast } from 'sonner'
import type { Transaction, Patient } from '@/types/database'

export default function FinanceiroPage() {
  const [transactions, setTransactions] = useState<(Transaction & { patient_name?: string })[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7))
  const [filterStatus, setFilterStatus] = useState<string>('todos')
  const supabase = createClient()

  // Form state
  const [formPatientId, setFormPatientId] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formAmount, setFormAmount] = useState('')
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0])
  const [formMethod, setFormMethod] = useState<string>('pix')
  const [formStatus, setFormStatus] = useState<string>('pago')
  const [formNotes, setFormNotes] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [filterMonth, filterStatus])

  async function loadData() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const startDate = `${filterMonth}-01`
    const endDate = new Date(parseInt(filterMonth.split('-')[0]), parseInt(filterMonth.split('-')[1]), 0)
      .toISOString().split('T')[0]

    let query = supabase
      .from('transactions')
      .select('*')
      .eq('therapist_id', user.id)
      .gte('payment_date', startDate)
      .lte('payment_date', endDate)
      .order('payment_date', { ascending: false })

    if (filterStatus !== 'todos') {
      query = query.eq('status', filterStatus)
    }

    const [txResult, patientsResult] = await Promise.all([
      query,
      supabase.from('patients').select('id, name').eq('therapist_id', user.id).order('name'),
    ])

    if (patientsResult.data) setPatients(patientsResult.data as Patient[])

    if (txResult.data) {
      const enriched = txResult.data.map((tx: any) => ({
        ...tx,
        patient_name: patientsResult.data?.find((p: any) => p.id === tx.patient_id)?.name || '—',
      }))
      setTransactions(enriched)
    }

    setLoading(false)
  }

  const totalReceived = transactions.filter(t => t.status === 'pago').reduce((sum, t) => sum + t.amount, 0)
  const totalPending = transactions.filter(t => t.status === 'pendente').reduce((sum, t) => sum + t.amount, 0)
  const totalSessions = transactions.length
  const ticketMedio = totalSessions > 0 ? totalReceived / transactions.filter(t => t.status === 'pago').length || 0 : 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('Sessão expirada')
      setSaving(false)
      return
    }

    const { error } = await supabase.from('transactions').insert({
      therapist_id: user.id,
      patient_id: formPatientId || null,
      description: formDescription,
      amount: parseFloat(formAmount),
      payment_method: formMethod,
      status: formStatus,
      payment_date: formDate,
      notes: formNotes || null,
    })

    if (error) {
      toast.error('Erro ao registrar pagamento')
      setSaving(false)
      return
    }

    toast.success('Pagamento registrado')
    setDialogOpen(false)
    resetForm()
    loadData()
  }

  function resetForm() {
    setFormPatientId('')
    setFormDescription('')
    setFormAmount('')
    setFormDate(new Date().toISOString().split('T')[0])
    setFormMethod('pix')
    setFormStatus('pago')
    setFormNotes('')
    setSaving(false)
  }

  const methodLabels: Record<string, string> = {
    pix: 'PIX',
    dinheiro: 'Dinheiro',
    transferencia: 'Transferência',
    cartao: 'Cartão',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Financeiro</h2>
          <p className="text-muted-foreground">Controle de pagamentos e receitas.</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Registrar pagamento
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Recebido no mês</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {totalReceived.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pendente</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              R$ {totalPending.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Transações</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSessions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ticket médio</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {ticketMedio.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 items-center">
        <div className="space-y-1">
          <Label className="text-xs">Mês</Label>
          <Input
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="w-40"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Status</Label>
          <Select value={filterStatus} onValueChange={(v) => v && setFilterStatus(v)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="pago">Pago</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Carregando...</p>
          ) : transactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma transação neste período.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 font-medium">Data</th>
                    <th className="text-left py-3 font-medium">Cliente</th>
                    <th className="text-left py-3 font-medium">Descrição</th>
                    <th className="text-right py-3 font-medium">Valor</th>
                    <th className="text-left py-3 font-medium">Forma</th>
                    <th className="text-left py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b last:border-0">
                      <td className="py-3">
                        {new Date(tx.payment_date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-3">{tx.patient_name}</td>
                      <td className="py-3">{tx.description}</td>
                      <td className="py-3 text-right font-medium">
                        R$ {tx.amount.toFixed(2)}
                      </td>
                      <td className="py-3">
                        <Badge variant="outline">{methodLabels[tx.payment_method] || tx.payment_method}</Badge>
                      </td>
                      <td className="py-3">
                        <Badge variant={tx.status === 'pago' ? 'default' : 'secondary'}>
                          {tx.status === 'pago' ? 'Pago' : 'Pendente'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Registrar Pagamento</DialogTitle>
            <DialogDescription>Registre um novo pagamento recebido ou pendente.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Cliente</Label>
              <Select value={formPatientId} onValueChange={(v) => setFormPatientId(v || '')}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar cliente (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Sem cliente vinculado</SelectItem>
                  {patients.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Descrição *</Label>
              <Input
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Ex: Sessão avulsa, Pagamento pacote Reiki 10x"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valor (R$) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  min={0}
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Data *</Label>
                <Input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Forma de pagamento</Label>
                <Select value={formMethod} onValueChange={(v) => v && setFormMethod(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="dinheiro">Dinheiro</SelectItem>
                    <SelectItem value="transferencia">Transferência</SelectItem>
                    <SelectItem value="cartao">Cartão</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formStatus} onValueChange={(v) => v && setFormStatus(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pago">Pago</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Observações</Label>
              <Textarea
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                rows={2}
                placeholder="Observações opcionais..."
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Salvando...' : 'Registrar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
