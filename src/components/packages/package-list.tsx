'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, AlertTriangle } from 'lucide-react'
import { NewPackageDialog } from './new-package-dialog'
import type { Package } from '@/types/database'

interface PackageListProps {
  packages: Package[]
  patientId: string
  patientName: string
}

export function PackageList({ packages, patientId, patientName }: PackageListProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  const statusColors: Record<string, string> = {
    ativo: 'bg-green-100 text-green-800',
    concluido: 'bg-blue-100 text-blue-800',
    expirado: 'bg-gray-100 text-gray-800',
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Pacote
        </Button>
      </div>

      {packages.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">Nenhum pacote cadastrado para este cliente.</p>
            <Button onClick={() => setDialogOpen(true)}>Criar primeiro pacote</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {packages.map((pkg) => {
            const progress = pkg.total_sessions > 0 ? (pkg.used_sessions / pkg.total_sessions) * 100 : 0
            const remaining = pkg.total_sessions - pkg.used_sessions
            const isLow = remaining <= 2 && pkg.status === 'ativo'

            return (
              <Card key={pkg.id} className={isLow ? 'border-orange-300' : ''}>
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{pkg.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Início: {new Date(pkg.start_date).toLocaleDateString('pt-BR')}
                        {pkg.expiration_date && ` • Exp: ${new Date(pkg.expiration_date).toLocaleDateString('pt-BR')}`}
                      </p>
                    </div>
                    <Badge className={statusColors[pkg.status] || ''}>
                      {pkg.status}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{pkg.used_sessions} de {pkg.total_sessions} sessões usadas</span>
                      <span className="font-medium">{remaining} restantes</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full transition-all"
                        style={{
                          width: `${Math.min(progress, 100)}%`,
                          backgroundColor: isLow ? '#f97316' : '#4A7C6F',
                        }}
                      />
                    </div>
                  </div>

                  {isLow && (
                    <div className="flex items-center gap-2 text-xs text-orange-600">
                      <AlertTriangle className="h-3 w-3" />
                      {remaining === 0 ? 'Todas as sessões foram usadas' : `Apenas ${remaining} sessão(ões) restante(s)`}
                    </div>
                  )}

                  <div className="flex justify-between text-sm pt-1">
                    <span className="text-muted-foreground">
                      Valor: R$ {pkg.total_value.toFixed(2)}
                    </span>
                    <span className={pkg.paid_value < pkg.total_value ? 'text-orange-600 font-medium' : 'text-green-600 font-medium'}>
                      Pago: R$ {pkg.paid_value.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <NewPackageDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        patientId={patientId}
        patientName={patientName}
      />
    </div>
  )
}
