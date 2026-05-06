'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

interface NewPackageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patientId: string
  patientName: string
}

export function NewPackageDialog({ open, onOpenChange, patientId, patientName }: NewPackageDialogProps) {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [totalSessions, setTotalSessions] = useState(10)
  const [totalValue, setTotalValue] = useState('')
  const [paidValue, setPaidValue] = useState('')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [expirationDate, setExpirationDate] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('Sessão expirada')
      setLoading(false)
      return
    }

    const { error } = await supabase.from('packages').insert({
      therapist_id: user.id,
      patient_id: patientId,
      name: name || `Pacote ${totalSessions} sessões - ${patientName}`,
      total_sessions: totalSessions,
      used_sessions: 0,
      total_value: parseFloat(totalValue) || 0,
      paid_value: parseFloat(paidValue) || 0,
      start_date: startDate,
      expiration_date: expirationDate || null,
      status: 'ativo',
    })

    if (error) {
      toast.error('Erro ao criar pacote')
      setLoading(false)
      return
    }

    toast.success('Pacote criado com sucesso')
    onOpenChange(false)
    resetForm()
    router.refresh()
  }

  function resetForm() {
    setName('')
    setTotalSessions(10)
    setTotalValue('')
    setPaidValue('')
    setStartDate(new Date().toISOString().split('T')[0])
    setExpirationDate('')
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo Pacote de Sessões</DialogTitle>
          <DialogDescription>
            Crie um pacote para {patientName}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pkg-name">Nome do pacote</Label>
            <Input
              id="pkg-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`Ex: Pacote Reiki ${totalSessions} sessões`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pkg-total">Total de sessões *</Label>
              <Input
                id="pkg-total"
                type="number"
                min={1}
                value={totalSessions}
                onChange={(e) => setTotalSessions(Number(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pkg-value">Valor total (R$)</Label>
              <Input
                id="pkg-value"
                type="number"
                step="0.01"
                min={0}
                value={totalValue}
                onChange={(e) => setTotalValue(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pkg-paid">Valor já pago (R$)</Label>
            <Input
              id="pkg-paid"
              type="number"
              step="0.01"
              min={0}
              value={paidValue}
              onChange={(e) => setPaidValue(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pkg-start">Data de início *</Label>
              <Input
                id="pkg-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pkg-exp">Data de expiração</Label>
              <Input
                id="pkg-exp"
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Criar Pacote'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
