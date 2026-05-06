export type TherapistSpecialty = 'psicologo' | 'holistico' | 'ambos'

export type PatientStatus = 'ativo' | 'inativo' | 'alta'

export type SessionStatus = 'realizada' | 'cancelada' | 'falta'

export type AuditAction = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'EXPORT'

export interface Therapist {
  id: string
  email: string
  name: string
  specialty: TherapistSpecialty
  crp_number: string | null
  lgpd_consent_at: string | null
  plan: 'gratuito' | 'profissional' | 'clinica'
  plan_activated_at: string | null
  created_at: string
}

export interface Patient {
  id: string
  therapist_id: string
  name: string
  email: string | null
  phone: string | null
  birth_date: string | null
  status: PatientStatus
  initial_complaint: string | null
  lgpd_consent_recorded: boolean
  lgpd_consent_at: string | null
  notes: string | null
  tags: string[]
  created_at: string
  updated_at: string
}

export interface Session {
  id: string
  patient_id: string
  therapist_id: string
  date: string
  duration_minutes: number
  status: SessionStatus
  session_notes: string
  mood_rating: number
  tags: string[]
  ai_summary: string | null
  ai_patterns: AiPatterns | null
  package_id: string | null
  created_at: string
  updated_at: string
}

export interface AiPatterns {
  themes: string[]
  attention_points: string[]
  evolution: 'melhora' | 'estavel' | 'piora'
  evolution_reason: string
}

export interface AuditLog {
  id: string
  therapist_id: string
  action: AuditAction
  entity: string
  entity_id: string
  ip_address: string | null
  created_at: string
}

export interface PatientWithSessions extends Patient {
  sessions: Session[]
}

export type PackageStatus = 'ativo' | 'concluido' | 'expirado'

export type PaymentMethod = 'pix' | 'dinheiro' | 'transferencia' | 'cartao'

export type TransactionStatus = 'pago' | 'pendente'

export interface Package {
  id: string
  therapist_id: string
  patient_id: string
  name: string
  total_sessions: number
  used_sessions: number
  total_value: number
  paid_value: number
  start_date: string
  expiration_date: string | null
  status: PackageStatus
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  therapist_id: string
  patient_id: string | null
  package_id: string | null
  description: string
  amount: number
  payment_method: PaymentMethod
  status: TransactionStatus
  payment_date: string
  notes: string | null
  created_at: string
}

export type AppointmentStatus = 'agendado' | 'realizado' | 'cancelado' | 'falta'

export interface Appointment {
  id: string
  therapist_id: string
  patient_id: string
  date: string
  duration_minutes: number
  status: AppointmentStatus
  notes: string | null
  created_at: string
  updated_at: string
}
