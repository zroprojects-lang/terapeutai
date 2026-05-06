'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import type { TherapistSpecialty } from '@/types/database'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [specialty, setSpecialty] = useState<TherapistSpecialty>('psicologo')
  const [crpNumber, setCrpNumber] = useState('')
  const [lgpdConsent, setLgpdConsent] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()

    if (!lgpdConsent) {
      toast.error('Voce precisa aceitar os termos de uso e politica de privacidade')
      return
    }

    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          specialty,
          crp_number: crpNumber || null,
        },
      },
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    if (data.user) {
      const { error: profileError } = await supabase.from('therapists').insert({
        id: data.user.id,
        email,
        name,
        specialty,
        crp_number: crpNumber || null,
        lgpd_consent_at: new Date().toISOString(),
      })

      if (profileError) {
        toast.error('Erro ao criar perfil. Tente novamente.')
        setLoading(false)
        return
      }

      // Send welcome email (non-blocking)
      fetch('/api/auth/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      }).catch(() => {}) // silently ignore errors
    }

    toast.success('Conta criada com sucesso!')
    router.push('/onboarding')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">TerapeutAI</CardTitle>
          <CardDescription>Crie sua conta gratuita</CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label>Especialidade</Label>
              <Select value={specialty} onValueChange={(v) => v && setSpecialty(v as TherapistSpecialty)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="psicologo">Psicologo(a)</SelectItem>
                  <SelectItem value="holistico">Terapeuta Holistico(a)</SelectItem>
                  <SelectItem value="ambos">Ambos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(specialty === 'psicologo' || specialty === 'ambos') && (
              <div className="space-y-2">
                <Label htmlFor="crp">Numero do CRP</Label>
                <Input
                  id="crp"
                  placeholder="00/00000"
                  value={crpNumber}
                  onChange={(e) => setCrpNumber(e.target.value)}
                />
              </div>
            )}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="lgpd"
                checked={lgpdConsent}
                onChange={(e) => setLgpdConsent(e.target.checked)}
                className="mt-1"
              />
              <Label htmlFor="lgpd" className="text-sm font-normal leading-snug">
                Li e aceito os termos de uso e a politica de privacidade. Concordo com o tratamento dos meus dados conforme a LGPD.
              </Label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Criando conta...' : 'Criar conta'}
            </Button>
            <p className="text-sm text-muted-foreground">
              Ja tem conta?{' '}
              <Link href="/login" className="text-primary underline">
                Entrar
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
