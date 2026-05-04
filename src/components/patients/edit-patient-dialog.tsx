'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
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
import { Pencil } from 'lucide-react'
import type { Patient } from '@/types/database'

export function EditPatientDialog({ patient, onUpdated }: { patient: Patient; onUpdated?: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(patient.name)
  const [email, setEmail] = useState(patient.email || '')
  const [phone, setPhone] = useState(patient.phone || '')
  const [birthDate, setBirthDate] = useState(patient.birth_date || '')
  const [initialComplaint, setInitialComplaint] = useState(patient.initial_complaint || '')
  const [notes, setNotes] = useState(patient.notes || '')
  const [tags, setTags] = useState(patient.tags?.join(', ') || '')
  const [status, setStatus] = useState(patient.status)
  const supabase = createClient()
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from('patients')
      .update({
        name,
        email: email || null,
        phone: phone || null,
        birth_date: birthDate || null,
        initial_complaint: initialComplaint || null,
        notes: notes || null,
        tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        status,
      })
      .eq('id', patient.id)

    if (error) {
      toast.error('Erro ao atualizar paciente')
      setLoading(false)
      return
    }

    toast.success('Paciente atualizado')
    setOpen(false)
    setLoading(false)
    router.refresh()
    onUpdated?.()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <Pencil className="h-4 w-4 mr-2" />
        Editar
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar paciente</DialogTitle>
          <DialogDescription>Atualize os dados do paciente.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Nome *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nascimento</Label>
              <Input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => v && setStatus(v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Queixa inicial</Label>
            <Textarea value={initialComplaint} onChange={(e) => setInitialComplaint(e.target.value)} rows={2} />
          </div>
          <div className="space-y-2">
            <Label>Observacoes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
          </div>
          <div className="space-y-2">
            <Label>Tags (separadas por virgula)</Label>
            <Input value={tags} onChange={(e) => setTags(e.target.value)} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
