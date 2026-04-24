const personas = {
  henrique: {
    name: "Henrique",
    desc: "Adulto (40 anos) com dores na lombar. Foco: Fortalecimento profundo e progressão para academia.",
    hasGym: true,
    homeFreq: "Diário (20-25 min)",
    gymFreq: "2-3x/semana",
    tips: {
      w1: "Foco na respiração diafragmática. Não prenda o ar durante as isometrias.",
      w5: "Aumente levemente as séries em casa. Mantenha a forma perfeita na academia.",
      w9: "Hora de adicionar carga na academia. Priorize técnica sobre peso."
    }
  },
  carmem: {
    name: "Carmem",
    desc: "Adulto (35 anos) com dores cervicais. Foco: Flexores profundos do pescoço e mobilidade escapular.",
    hasGym: true,
    homeFreq: "Diário (15-20 min)",
    gymFreq: "2x/semana",
    tips: {
      w1: "Evite telas inclinadas. Mantenha o queixo paralelo ao chão.",
      w5: "Alongue peitorais entre as séries de academia.",
      w9: "Foque em trapézio médio/inferior. Evite encolher os ombros."
    }
  },
  jose: {
    name: "José",
    desc: "Idoso (80+) com ciático/lombar. Foco: Segurança, peso corporal e mobilidade suave.",
    hasGym: false,
    homeFreq: "Diário (10-15 min)",
    gymFreq: "N/A (Somente domiciliar)",
    tips: {
      w1: "Faça os exercícios após 1h de acordado. Hidrate-se bem.",
      w5: "Se sentir formigamento, reduza a amplitude imediatamente.",
      w9: "Mantenha a cadência lenta. Qualidade > Quantidade."
    }
  },
  rose: {
    name: "Rose",
    desc: "Idosa (60+) sem dores crônicas. Foco: Manutenção, equilíbrio e prevenção.",
    hasGym: false,
    homeFreq: "4-5x/semana",
    gymFreq: "N/A (Somente domiciliar)",
    tips: {
      w1: "Consistência é mais importante que intensidade.",
      w5: "Adicione 2s extras nas isometrias.",
      w9: "Incorpore os movimentos na rotina diária (levantar, caminhar)."
    }
  }
};

const exercises = {
  home: {
    cervical: [
      { name: "Chin Tucks (Retração)", desc: "Sentado, retraia o queixo como se fizesse 'papo duplo'. 5s hold.", sets: 3, reps: 10 },
      { name: "Isometria Multidirecional", desc: "Resista com a mão na testa/lado/trás. 10s hold por direção.", sets: 1, reps: 5 }
    ],
    thoracic: [
      { name: "Prone T & Y", desc: "De bruços, erga braços em T e Y. Foque no meio das costas.", sets: 2, reps: 10 }
    ],
    lumbar: [
      { name: "McGill Curl-up", desc: "Mão sob lombar, eleve ombros poucos cm. 10s hold.", sets: 3, reps: 10 },
      { name: "Side Plank Modificado", desc: "Joelhos apoiados, quadril elevado. 10s hold/lado.", sets: 2, reps: 5 },
      { name: "Bird Dog", desc: "4 apoios, braço e perna opostos elevados. Sem rodar quadril. 10s hold.", sets: 2, reps: 6 }
    ]
  },
  gym: [
    { name: "Deadlift Leve (Halter/Barra)", desc: "Dobradiça de quadril, coluna neutra.", sets: 3, reps: "10-12" },
    { name: "Remada Unilateral", desc: "Serrote no banco. Antirrotacional.", sets: 3, reps: "10-12" },
    { name: "Farmer's Carry", desc: "Caminhada com pesos. Postura ereta.", sets: 3, reps: "30m" },
    { name: "Weighted Plank", desc: "Prancha tradicional. Glúteos travados.", sets: 3, reps: "45s" }
  ]
};

const progression = {
  w1_4: { phase: "Adaptação Neurológica", homeHold: "10s", gymLoad: "Leve", rest: "60-90s", volume: "3x10-12" },
  w5_8: { phase: "Resistência & Endurance", homeHold: "12s", gymLoad: "Mesma carga", rest: "45-60s", volume: "3x12-15" },
  w9_12: { phase: "Hipertrofia & Tensão", homeHold: "15s", gymLoad: "+2.5 a 5kg", rest: "60s", volume: "3x8-10" }
};

const painMessages = [
  { max: 0, msg: "0: Livre de dor. Continue a progressão.", type: "neutral" },
  { max: 3, msg: "1-3: Desconforto muscular normal. Pode progredir.", type: "neutral" },
  { max: 6, msg: "4-6: Atenção. Reduza amplitude/carga e foque na forma.", type: "warning" },
  { max: 10, msg: "7-10: Interrompa. Consulte um profissional imediatamente.", type: "danger" }
];

const visualGuideData = [
  { name: "McGill Curl-up", text: "🧍 Postura Inicial: Deitado de costas. Uma perna estendida, outra flexionada. Mãos sob a curvatura lombar. 🏃 Movimento: Eleve apenas cabeça/ombros como um bloco rígido. ⚠️ Alerta: Não curve o pescoço. Mantenha a respiração contínua." },
  { name: "Bird Dog", text: "🧍 Postura Inicial: Quadrúpede. Mãos sob ombros, joelhos sob quadris. 🏃 Movimento: Estenda braço direito à frente e perna esquerda atrás simultaneamente. ⚠️ Alerta: Quadril deve permanecer perfeitamente plano. Não eleve além da linha da coluna." },
  { name: "Chin Tucks", text: "🧍 Postura Inicial: Sentado ou em pé, costas retas. Olhar à frente. 🏃 Movimento: Deslize o queixo para trás no mesmo plano horizontal. ⚠️ Alerta: Não incline a cabeça para cima ou para baixo. Sinta alongar a nuca." }
];