export function sanitizeForAI(text: string, replacements: Record<string, string> = {}): string {
  let sanitized = text

  for (const [original, placeholder] of Object.entries(replacements)) {
    if (original) {
      sanitized = sanitized.replace(new RegExp(escapeRegex(original), 'gi'), placeholder)
    }
  }

  sanitized = sanitized.replace(/\d{3}\.\d{3}\.\d{3}-\d{2}/g, '[CPF]')
  sanitized = sanitized.replace(/\(\d{2}\)\s?\d{4,5}-\d{4}/g, '[TELEFONE]')
  sanitized = sanitized.replace(/[\w.-]+@[\w.-]+\.\w+/g, '[EMAIL]')

  return sanitized
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
