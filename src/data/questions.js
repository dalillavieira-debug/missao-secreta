// ─── ETAPA 1: Perguntas de Reflexão ───────────────────────────────────────────
// Edite aqui as perguntas e opções da jornada espiritual

export const journeyQuestions = [
  {
    id: 'study',
    type: 'multiple',
    question: 'Qual estudo mais te marcou nos últimos meses?',
    options: [
      'Ester',
      'O Bom Pastor',
      'Romanos 12',
      'Renovação da mente',
      'Obediência',
      'Comunhão',
      'Outro',
    ],
  },
  {
    id: 'area',
    type: 'multiple',
    question: 'Qual área Deus mais tem trabalhado em você?',
    options: [
      'Fé',
      'Oração',
      'Perdão',
      'Obediência',
      'Constância',
      'Serviço',
      'Relacionamentos',
      'Confiança',
    ],
  },
  {
    id: 'word',
    type: 'open-short',
    question: 'Qual palavra define sua caminhada espiritual hoje?',
    placeholder: 'Uma palavra...',
  },
  {
    id: 'challenge',
    type: 'open',
    question: 'Qual tem sido seu maior desafio espiritual neste tempo?',
    placeholder: 'Compartilhe com honestidade...',
  },
  {
    id: 'nextStep',
    type: 'open',
    question:
      'Se Deus quisesse continuar em você o que Ele começou nos últimos meses, qual seria seu próximo passo de obediência?',
    placeholder: 'Seu próximo passo...',
  },
]
