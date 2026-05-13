import { Suspense } from 'react'
import AdminContent from './admin-content'

export default function AdminPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    }>
      <AdminContent />
    </Suspense>
  )
}
