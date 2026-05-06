'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

function ResetPasswordForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const code = searchParams.get('code')

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) {
          setError(true)
          toast.error('Link expirado ou inválido. Solicite um novo.')
        } else {
          setReady(true)
        }
      })
    } else {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === 'PASSWORD_RECOVERY') {
          setReady(true)
        }
      })

      const timeout = setTimeout(() => {
        if (!ready) setError(true)
      }, 5000)

      return () => {
        subscription.unsubscribe()
        clearTimeout(timeout)
      }
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem')
      return
    }

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      toast.error('Erro ao atualizar senha. O link pode ter expirado.')
      setLoading(false)
      return
    }

    toast.success('Senha atualizada com sucesso')
    router.push('/dashboard')
  }

  if (error) {
    return (
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Link inválido ou expirado</CardTitle>
          <CardDescription>
            O link de recuperação pode ter expirado. Solicite um novo link.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button onClick={() => router.push('/forgot-password')}>
            Solicitar novo link
          </Button>
        </CardFooter>
      </Card>
    )
  }

  if (!ready) {
    return (
      <Card className="w-full max-w-md text-center">
        <CardContent className="py-8">
          <p className="text-muted-foreground">Verificando link de recuperação...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Nova senha</CardTitle>
        <CardDescription>Escolha uma senha segura para sua conta.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Nova senha</Label>
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
            <Label htmlFor="confirm">Confirmar nova senha</Label>
            <Input
              id="confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar nova senha'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Suspense
        fallback={
          <Card className="w-full max-w-md text-center">
            <CardContent className="py-8">
              <p className="text-muted-foreground">Carregando...</p>
            </CardContent>
          </Card>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  )
}
