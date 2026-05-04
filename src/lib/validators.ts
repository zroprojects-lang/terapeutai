import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email invalido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email invalido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  specialty: z.enum(['psicologo', 'holistico', 'ambos']),
  crp_number: z.string().optional(),
})

export const patientSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email invalido').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  birth_date: z.string().optional().or(z.literal('')),
  initial_complaint: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
  tags: z.array(z.string()).default([]),
  lgpd_consent_recorded: z.boolean().default(false),
})

export const sessionSchema = z.object({
  patient_id: z.string().uuid(),
  date: z.string(),
  duration_minutes: z.number().min(1).max(480).default(50),
  status: z.enum(['realizada', 'cancelada', 'falta']).default('realizada'),
  session_notes: z.string().min(1, 'Notas da sessao sao obrigatorias'),
  mood_rating: z.number().min(1).max(10),
  tags: z.array(z.string()).default([]),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type PatientInput = z.infer<typeof patientSchema>
export type SessionInput = z.infer<typeof sessionSchema>
