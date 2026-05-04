export function buildSessionSummaryPrompt(
  sessionNotes: string,
  previousSessions: { date: string; summary: string; mood: number; tags: string[] }[]
): string {
  const history = previousSessions.length > 0
    ? previousSessions
        .map((s) => `- ${s.date} | Humor: ${s.mood}/10 | Temas: ${s.tags.join(', ')} | ${s.summary || 'Sem resumo'}`)
        .join('\n')
    : 'Primeira sessao registrada.'

  return `Voce e um assistente de documentacao clinica para terapeutas brasileiros.

REGRAS ESTRITAS:
- NAO faca diagnosticos
- NAO prescreva tratamentos
- NAO use linguagem definitiva ("o paciente tem", "isso indica com certeza")
- USE linguagem sugestiva ("o paciente parece apresentar", "pode ser relevante explorar")
- APENAS identifique padroes e sugira pontos de atencao
- RESPONDA em portugues brasileiro
- Seja conciso e objetivo

HISTORICO DE SESSOES ANTERIORES:
${history}

NOTAS DA SESSAO ATUAL:
${sessionNotes}

Retorne APENAS um JSON valido (sem markdown, sem code blocks) com esta estrutura:
{
  "resumo": "Resumo de 3-5 frases da sessao",
  "temas": ["tema1", "tema2"],
  "pontos_atencao": ["ponto1", "ponto2"],
  "evolucao": "melhora" | "estavel" | "piora",
  "evolucao_razao": "Explicacao breve da percepcao de evolucao"
}`
}
