'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { Plus } from 'lucide-react'

export function NewPatientDialog({ onCreated }: { onCreated?: () => void } = {}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [initialComplaint, setInitialComplaint] = useState('')
  const [tags, setTags] = useState('')
  const [lgpdConsent, setLgpdConsent] = useState(false)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('Sessao expirada')
      setLoading(false)
      return
    }

    const { error } = await supabase.from('patients').insert({
      therapist_id: user.id,
      name,
      email: email || null,
      phone: phone || null,
      birth_date: birthDate || null,
      initial_complaint: initialComplaint || null,
      tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      lgpd_consent_recorded: lgpdConsent,
      lgpd_consent_at: lgpdConsent ? new Date().toISOString() : null,
      status: 'ativo',
    })

    if (error) {
      toast.error('Erro ao cadastrar paciente')
      setLoading(false)
      return
    }

    toast.success('Paciente cadastrado com sucesso')
    setOpen(false)
    resetForm()
    onCreated?.()
  }

  function resetForm() {
    setName('')
    setEmail('')
    setPhone('')
    setBirthDate('')
    setInitialComplaint('')
    setTags('')
    setLgpdConsent(false)
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="h-4 w-4 mr-2" />
        Novo paciente
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Cadastrar paciente</DialogTitle>
          <DialogDescription>
            Preencha os dados do paciente. Campos com * sao obrigatorios.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patient-name">Nome completo *</Label>
            <Input
              id="patient-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patient-email">Email</Label>
              <Input
                id="patient-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patient-phone">Telefone</Label>
              <Input
                id="patient-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="patient-birth">Data de nascimento</Label>
            <Input
              id="patient-birth"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patient-complaint">Queixa inicial</Label>
            <Textarea
              id="patient-complaint"
              value={initialComplaint}
              onChange={(e) => setInitialComplaint(e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patient-tags">Tags (separadas por virgula)</Label>
            <Input
              id="patient-tags"
              placeholder="ansiedade, depressao, relacionamento"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="patient-lgpd"
              checked={lgpdConsent}
              onChange={(e) => setLgpdConsent(e.target.checked)}
              className="mt-1"
            />
            <Label htmlFor="patient-lgpd" className="text-sm font-normal leading-snug">
              Paciente foi informado e consentiu com o registro digital dos seus dados conforme a LGPD.
            </Label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Cadastrar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
