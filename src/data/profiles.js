// ─── ETAPA 3: Perfis Espirituais ──────────────────────────────────────────────
// Edite aqui os perfis, versículos, missões e lógica de seleção

export const spiritualProfiles = {
  ester: {
    id: 'ester',
    name: 'Perfil Ester',
    emoji: '👑',
    tagline: 'Tempo de coragem e posicionamento',
    description:
      'Você está em uma temporada onde Deus te chama para agir com coragem. Assim como Ester, há algo que você precisa enfrentar com fé. Não é hora de se esconder — é hora de se posicionar.',
    verse: '"Quem sabe se para um momento como este você chegou ao reino?" — Ester 4.14',
    mission:
      'Esta semana, dê um passo de coragem que você tem adiado. Pode ser uma conversa, uma decisão ou um ato de fé.',
  },
  neemias: {
    id: 'neemias',
    name: 'Perfil Neemias',
    emoji: '🏗️',
    tagline: 'Tempo de reconstrução e responsabilidade',
    description:
      'Você está em uma fase de reconstruir algo — pode ser uma área da sua vida, um relacionamento, hábitos ou sua intimidade com Deus. Como Neemias, você sente o peso da responsabilidade e o desejo de ver as coisas restauradas.',
    verse: '"A mão bondosa de meu Deus estava sobre mim." — Neemias 2.8',
    mission:
      'Identifique uma área que precisa de reconstrução e dedique um tempo intencional a ela durante a semana.',
  },
  davi: {
    id: 'davi',
    name: 'Perfil Davi',
    emoji: '🎶',
    tagline: 'Tempo de adoração, sensibilidade e constância',
    description:
      'Como Davi, seu coração é sensível ao coração de Deus. Você está em um tempo de adoração profunda, onde mesmo nos desafios, a resposta é buscar a presença de Deus. Sua constância é um testemunho.',
    verse: '"Uma coisa peço ao Senhor, e somente essa procuro: que eu possa morar na casa do Senhor todos os dias da minha vida." — Salmo 27.4',
    mission:
      'Reserve 10 minutos por dia, nessa semana, somente para adorar — sem pedir nada, só estar na presença de Deus.',
  },
  rute: {
    id: 'rute',
    name: 'Perfil Rute',
    emoji: '🌾',
    tagline: 'Tempo de fidelidade, cuidado e relacionamento',
    description:
      'Você está em um tempo de fidelidade nos relacionamentos e no cuidado com as pessoas ao seu redor. Como Rute, você escolhe ficar mesmo quando o caminho é difícil. Seu amor é prático e transforma vidas.',
    verse: '"Onde tu morreres, morrerei eu, e ali serei sepultada." — Rute 1.17',
    mission:
      'Demonstre cuidado concreto a alguém próximo essa semana — uma visita, uma ligação, um gesto de serviço.',
  },
  pedro: {
    id: 'pedro',
    name: 'Perfil Pedro',
    emoji: '⚓',
    tagline: 'Tempo de amadurecimento, restauração e firmeza',
    description:
      'Como Pedro, você passou ou está passando por situações que testaram sua fé. Mas Deus não desistiu de você — Ele está te restaurando e preparando para ser mais firme do que nunca. Suas falhas não definem seu destino.',
    verse: '"Eu roguei por ti, para que a tua fé não desfaleça." — Lucas 22.32',
    mission:
      'Aceite a restauração de Deus em uma área específica. Se preciso, ore: "Senhor, me restaura naquilo que eu abandonei."',
  },
}

// Lógica de determinação do perfil baseada nas respostas
export function determineProfile(journeyAnswers, quizScore) {
  const { study, area } = journeyAnswers

  // Mapeamento de estudos para perfis
  const studyMap = {
    Ester: 'ester',
    'O Bom Pastor': 'davi',
    'Romanos 12': 'neemias',
    'Renovação da mente': 'pedro',
    Obediência: 'rute',
    Comunhão: 'rute',
    Outro: null,
  }

  // Mapeamento de áreas para perfis
  const areaMap = {
    Fé: 'pedro',
    Oração: 'davi',
    Perdão: 'pedro',
    Obediência: 'ester',
    Constância: 'davi',
    Serviço: 'rute',
    Relacionamentos: 'rute',
    Confiança: 'neemias',
  }

  const studyProfile = studyMap[study] || null
  const areaProfile = areaMap[area] || null

  // Combina estudo e área — estudo tem prioridade
  const profileId = studyProfile || areaProfile || 'ester'

  return spiritualProfiles[profileId]
}
