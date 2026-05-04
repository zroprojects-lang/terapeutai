'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { ChevronLeft, ChevronRight, Plus, Clock, User } from 'lucide-react'

const MONTHS = ['Janeiro','Fevereiro','Marco','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const STATUS_COLORS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  agendado: 'default',
  realizado: 'secondary',
  cancelado: 'destructive',
  falta: 'outline',
}

export default function AgendaPage() {
  const today = new Date()
  const [month, setMonth] = useState(today.getMonth() + 1)
  const [year, setYear] = useState(today.getFullYear())
  const [appointments, setAppointments] = useState<any[]>([])
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')

  // New appointment form
  const [patientId, setPatientId] = useState('')
  const [apptDate, setApptDate] = useState('')
  const [apptTime, setApptTime] = useState('09:00')
  const [duration, setDuration] = useState(50)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  const loadData = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const [apptRes, patientRes] = await Promise.all([
      fetch(`/api/appointments?month=${month}&year=${year}`),
      supabase.from('patients').select('id, name').eq('therapist_id', user.id).eq('status', 'ativo').order('name'),
    ])

    const apptData = await apptRes.json()
    setAppointments(Array.isArray(apptData) ? apptData : [])
    setPatients(patientRes.data || [])
    setLoading(false)
  }, [month, year])

  useEffect(() => { loadData() }, [loadData])

  function prevMonth() {
    if (month === 1) { setMonth(12); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }

  function nextMonth() {
    if (month === 12) { setMonth(1); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  function getDaysInMonth() {
    return new Date(year, month, 0).getDate()
  }

  function getFirstDayOfMonth() {
    return new Date(year, month - 1, 1).getDay()
  }

  function getAppointmentsForDay(day: number) {
    return appointments.filter(a => {
      const d = new Date(a.date)
      return d.getDate() === day && d.getMonth() + 1 === month && d.getFullYear() === year
    })
  }

  function handleDayClick(day: number) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    setApptDate(dateStr)
    setSelectedDate(dateStr)
    setDialogOpen(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!patientId || !apptDate) {
      toast.error('Selecione paciente e data')
      return
    }
    setSaving(true)

    const datetime = `${apptDate}T${apptTime}:00`

    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patient_id: patientId, date: datetime, duration_minutes: duration, notes }),
    })

    if (!res.ok) {
      toast.error('Erro ao agendar')
      setSaving(false)
      return
    }

    toast.success('Consulta agendada')
    setDialogOpen(false)
    setPatientId('')
    setApptTime('09:00')
    setDuration(50)
    setNotes('')
    setSaving(false)
    loadData()
  }

  async function updateStatus(id: string, status: string) {
    const res = await fetch('/api/appointments', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    if (res.ok) {
      toast.success('Status atualizado')
      loadData()
    }
  }

  async function deleteAppointment(id: string) {
    const res = await fetch(`/api/appointments?id=${id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('Consulta removida')
      loadData()
    }
  }

  const daysInMonth = getDaysInMonth()
  const firstDay = getFirstDayOfMonth()
  const todayAppointments = appointments.filter(a => {
    const d = new Date(a.date)
    return d.toDateString() === today.toDateString()
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Agenda</h2>
          <p className="text-muted-foreground">{appointments.length} consultas em {MONTHS[month - 1]}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button />}>
            <Plus className="h-4 w-4 mr-2" />
            Agendar
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Agendar consulta</DialogTitle>
              <DialogDescription>Preencha os dados da consulta.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label>Paciente *</Label>
                <Select value={patientId} onValueChange={(v) => v && setPatientId(v)}>
                  <SelectTrigger><SelectValue placeholder="Selecione um paciente" /></SelectTrigger>
                  <SelectContent>
                    {patients.map((p: any) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data *</Label>
                  <Input type="date" value={apptDate} onChange={(e) => setApptDate(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Horario *</Label>
                  <Input type="time" value={apptTime} onChange={(e) => setApptTime(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Duracao (min)</Label>
                <Input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} min={15} max={480} />
              </div>
              <div className="space-y-2">
                <Label>Observacoes</Label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Agendar'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Today's appointments */}
      {todayAppointments.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Hoje</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {todayAppointments.map((a: any) => (
              <div key={a.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium">
                    {new Date(a.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{a.patients?.name}</p>
                    <p className="text-xs text-muted-foreground">{a.duration_minutes} min</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={STATUS_COLORS[a.status]}>{a.status}</Badge>
                  <Select value={a.status} onValueChange={(v) => v && updateStatus(a.id, v)}>
                    <SelectTrigger className="h-7 w-28 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agendado">Agendado</SelectItem>
                      <SelectItem value="realizado">Realizado</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                      <SelectItem value="falta">Falta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Calendar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle>{MONTHS[month - 1]} {year}</CardTitle>
            <Button variant="ghost" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 mb-2">
            {['Dom','Seg','Ter','Qua','Qui','Sex','Sab'].map(d => (
              <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const dayAppts = getAppointmentsForDay(day)
              const isToday = day === today.getDate() && month === today.getMonth() + 1 && year === today.getFullYear()
              return (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={`min-h-[60px] p-1 rounded-md border text-left hover:bg-muted transition-colors ${isToday ? 'border-primary bg-primary/5' : 'border-transparent'}`}
                >
                  <span className={`text-xs font-medium ${isToday ? 'text-primary' : ''}`}>{day}</span>
                  <div className="space-y-0.5 mt-1">
                    {dayAppts.slice(0, 2).map((a: any) => (
                      <div key={a.id} className="text-xs bg-primary/10 rounded px-1 truncate">
                        {new Date(a.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} {a.patients?.name?.split(' ')[0]}
                      </div>
                    ))}
                    {dayAppts.length > 2 && (
                      <div className="text-xs text-muted-foreground px-1">+{dayAppts.length - 2}</div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Month list */}
      {appointments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Todas as consultas — {MONTHS[month - 1]}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {appointments.map((a: any) => (
              <div key={a.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <div className="text-sm text-muted-foreground w-20">
                    {new Date(a.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    {' '}
                    {new Date(a.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{a.patients?.name}</p>
                    {a.notes && <p className="text-xs text-muted-foreground">{a.notes}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={STATUS_COLORS[a.status]}>{a.status}</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive h-7 px-2 text-xs"
                    onClick={() => deleteAppointment(a.id)}
                  >
                    Remover
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
