'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
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
import type { Session } from '@/types/database'

export function EditSessionDialog({ session }: { session: Session }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState(session.date.split('T')[0])
  const [duration, setDuration] = useState(session.duration_minutes)
  const [status, setStatus] = useState(session.status)
  const [notes, setNotes] = useState(session.session_notes)
  const [mood, setMood] = useState(session.mood_rating)
  const [tags, setTags] = useState(session.tags?.join(', ') || '')
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from('sessions')
      .update({
        date: new Date(date).toISOString(),
        duration_minutes: duration,
        status,
        session_notes: notes,
        mood_rating: mood,
        tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      })
      .eq('id', session.id)

    if (error) {
      toast.error('Erro ao atualizar sessao')
      setLoading(false)
      return
    }

    toast.success('Sessao atualizada')
    setOpen(false)
    setLoading(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <Pencil className="h-4 w-4 mr-2" />
        Editar
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar sessao</DialogTitle>
          <DialogDescription>Atualize os dados da sessao.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Data</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Duracao (min)</Label>
              <Input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} min={1} max={480} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => v && setStatus(v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="realizada">Realizada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                  <SelectItem value="falta">Falta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Humor (1-10)</Label>
            <div className="flex items-center gap-4">
              <Input
                type="range" min={1} max={10} value={mood}
                onChange={(e) => setMood(Number(e.target.value))}
                className="flex-1"
              />
              <Badge variant={mood >= 7 ? 'default' : mood >= 4 ? 'secondary' : 'destructive'} className="w-10 justify-center">
                {mood}
              </Badge>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Notas da sessao</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={6} required />
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
