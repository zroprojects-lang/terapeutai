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
