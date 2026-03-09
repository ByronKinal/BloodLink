const FALLBACK_OUT_OF_SCOPE_MESSAGE =
  'Solo puedo responder preguntas relacionadas con donación de sangre. No soy apto para responder temas fuera de ese contexto.';

const SAFETY_NOTE =
  'Esta información es orientativa y no sustituye una evaluación médica profesional.';

const FALLBACK_IN_SCOPE_MESSAGE =
  'Entiendo que tu pregunta es sobre donación de sangre. Puedo darte orientación general, pero para una evaluación precisa según tu situación particular y normativa local, el personal del banco de sangre es la mejor fuente. ¿Hay algún aspecto específico sobre tu salud o requisitos de donación que quieras consultar?';

const DONATION_CONTEXT_KEYWORDS = [
  'donar',
  'donacion',
  'donación',
  'sangre',
  'hemodonacion',
  'hemodonación',
  'banco de sangre',
  'plaquetas',
  'plasma',
  'hemoglobina',
  'transfusion',
  'transfusión',
  'grupo sanguineo',
  'grupo sanguíneo',
  'rh',
  'peso minimo',
  'peso mínimo',
  'requisito',
  'requisitos',
  'quien puede donar',
  'edad minima',
  'edad mínima',
  'intervalo',
  'enfermo',
  'fiebre',
  'gripe',
  'medicamento',
  'antibiotico',
  'antibiótico',
  'vacuna',
  'tatuaje',
  'cirugia',
  'cirugía',
  'embarazo',
  'lactancia',
  'alcohol',
  'drogas',
  'vih',
  'hepatitis',
  'presion arterial',
  'presión arterial',
  'ets',
  'enfermedad de trasmision sexual',
  'enfermedad de transmisión sexual',
  'sifilis',
  'sífilis',
  'gonorrea',
  'clamidia',
  'tricomoniasis',
  'herpes',
  'condiloma',
  'verrugas genitales',
  'infección sexual',
  'infeccion sexual',
  'paludismo',
  'malaria',
  'chagas',
  'enfermedad de chagas',
  'tuberculosis',
  'tb',
  'leucemia',
  'cancer',
  'cáncer',
  'diabetes',
  'hipertension',
  'hipertensión',
  'asma',
  'mareo',
  'desmayo',
  'sincope',
  'condición médica',
  'historial médico',
  'medicamentos que tomo',
  'puedo donar si',
  'puedo donar con',
  'me permite donar',
  'impedimento para donar',
  'contraindicación',
  'riesgo de donación',
];

const normalizeText = (text = '') =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

const isDonationRelatedQuestion = (question = '') => {
  const normalizedQuestion = normalizeText(question);

  if (!normalizedQuestion) {
    return false;
  }

  return DONATION_CONTEXT_KEYWORDS.some((keyword) =>
    normalizedQuestion.includes(normalizeText(keyword))
  );
};

const RULES = [
  {
    triggers: ['requisitos', ['edad', 'peso'], 'quien puede donar'],
    answer:
      'Requisitos generales: tener buena salud, pesar al menos 50 kg, cumplir la edad permitida por tu banco de sangre (frecuentemente 18 a 65), no tener fiebre ni infecciones activas y llevar documento de identificación.',
  },
  {
    triggers: [
      'cada cuanto',
      'intervalo',
      'cada cuanto puedo donar',
      ['hombre', 'donar'],
      ['mujer', 'donar'],
    ],
    answer:
      'Como guía general para sangre total: hombres cada 3 meses y mujeres cada 4 meses. El intervalo exacto puede variar según normativa local y tu evaluación médica.',
  },
  {
    triggers: ['fiebre', 'gripe', 'resfriado', 'covid', 'enfermo'],
    answer:
      'Si tienes fiebre, gripe, infección o te sientes enfermo, debes esperar a recuperarte por completo antes de donar. Te evaluarán signos vitales y síntomas el día de la cita.',
  },
  {
    triggers: ['antibiotico', 'medicamento', 'medicina', 'tratamiento'],
    answer:
      'Depende del medicamento y del motivo por el que lo tomas. Con antibióticos, normalmente se espera a terminar el tratamiento y estar sin síntomas. Lleva el nombre del fármaco para una evaluación segura.',
  },
  {
    triggers: ['vacuna', 'vacunado', 'vacunacion'],
    answer:
      'Después de vacunarte, el tiempo de espera depende del tipo de vacuna y de si presentaste síntomas. Si hubo fiebre o malestar importante, espera a recuperarte y confirma el intervalo con el banco de sangre.',
  },
  {
    triggers: ['tatuaje', 'piercing', 'perforacion', 'microblading'],
    answer:
      'Tras tatuaje, piercing o microblading suele requerirse un periodo de espera (con frecuencia 4 a 12 meses, según normativa local y condiciones de bioseguridad). Verifica el criterio de tu centro.',
  },
  {
    triggers: ['embarazo', 'embarazada', 'lactancia', 'postparto'],
    answer:
      'Durante el embarazo no se recomienda donar sangre. En lactancia o postparto se requiere evaluación individual y, en muchos centros, un tiempo de espera para proteger a la madre y al bebé.',
  },
  {
    triggers: ['alcohol', 'tomar', 'bebi', 'beber'],
    answer:
      'Evita alcohol antes de donar. Llega bien hidratado, con comida ligera previa y sin ayuno prolongado para reducir riesgo de mareo.',
  },
  {
    triggers: ['ayuno', 'comer', 'desayunar', 'hidratar', 'agua', 'dormir'],
    answer:
      'Antes de donar: duerme bien, hidrátate y come ligero (evita comidas muy grasosas). No es recomendable llegar en ayunas.',
  },
  {
    triggers: ['anemia', 'hemoglobina', 'hierro'],
    answer:
      'Si tienes anemia o hemoglobina baja, probablemente no podrás donar temporalmente. En el banco de sangre se mide hemoglobina para decidir si es seguro donar ese día.',
  },
  {
    triggers: ['presion', 'hipertension', 'hipotension'],
    answer:
      'La presión arterial debe estar en rangos seguros el día de la donación. Si tienes hipertensión o hipotensión, puedes requerir valoración adicional según control clínico y tratamiento.',
  },
  {
    triggers: ['cirugia', 'operacion', 'extraccion dental', 'muela'],
    answer:
      'Después de cirugía o procedimiento dental puede requerirse espera temporal. El tiempo depende del tipo de procedimiento, sangrado, antibióticos y recuperación clínica.',
  },
  {
    triggers: ['vih', 'hepatitis', 'infeccion', 'sida'],
    answer:
      'Para seguridad del receptor, antecedentes de infecciones transmisibles relevantes pueden impedir donar de forma temporal o permanente. El banco de sangre te orientará con criterios oficiales y confidenciales.',
  },
  {
    triggers: ['ets', 'trasmision sexual', 'transmisión sexual', 'sifilis', 'gonorrea', 'clamidia', 'herpes', ['enfermedad', 'sexual']],
    answer:
      'Si tienes o tuviste una enfermedad de transmisión sexual, el banco de sangre requiere información detallada para evaluar el riesgo residual. Algunas condiciones pueden ser temporales tras tratamiento y cura documentada, mientras que otras pueden requerir exclusión prolongada. La evaluación es confidencial y basada en criterios de seguridad transfusional.',
  },
  {
    triggers: ['grupo sanguineo', 'rh', 'o negativo', 'o positivo', 'a positivo'],
    answer:
      'Todos los grupos sanguíneos son valiosos. O negativo suele ser muy solicitado para emergencias, pero cualquier tipo de sangre puede ayudar a pacientes que la necesitan.',
  },
  {
    triggers: ['plaquetas', 'plasma', 'apheresis', 'aferesis'],
    answer:
      'Además de sangre total, puedes donar plaquetas o plasma por aféresis. Los requisitos e intervalos cambian según el componente y protocolo del centro.',
  },
  {
    triggers: ['proceso', 'como donar', 'que pasa cuando dono', 'pasos para donar'],
    answer:
      'Proceso típico: registro, entrevista médica, control de signos y hemoglobina, donación (unos minutos), y observación breve con hidratación posterior.',
  },
  {
    triggers: [['puedo', 'donar', 'si'], ['puedo', 'donar', 'con'], ['puedo', 'donar', 'aunque'], 'me permite donar', 'me deja donar', 'puedo ser donante'],
    answer:
      'La capacidad para donar depende de tu condición específica. Las donaciones requieren estar en buen estado general, sin infecciones activas y cumplir requisitos de edad, peso y hemoglobina. Para una evaluación precisa de tu situación particular, el personal del banco de sangre hará preguntas detalladas y realizará exámenes estándar (signos vitales, hemoglobina, antecedentes médicos).',
  },
];

const includesAll = (text, words = []) =>
  words.every((word) => text.includes(normalizeText(word)));

const getTriggerScore = (normalizedQuestion, trigger) => {
  if (Array.isArray(trigger)) {
    return includesAll(normalizedQuestion, trigger) ? 3 + trigger.length : 0;
  }

  const normalizedTrigger = normalizeText(trigger);

  if (!normalizedQuestion.includes(normalizedTrigger)) {
    return 0;
  }

  // Reward multi-word phrases because they are usually more specific.
  const wordsCount = normalizedTrigger.split(/\s+/).filter(Boolean).length;
  return wordsCount > 1 ? 3 + wordsCount : 1;
};

const findBestRule = (normalizedQuestion) => {
  let bestRule = null;
  let bestScore = 0;

  for (const rule of RULES) {
    const score = rule.triggers.reduce(
      (total, trigger) => total + getTriggerScore(normalizedQuestion, trigger),
      0
    );

    if (score > bestScore) {
      bestRule = rule;
      bestScore = score;
    }
  }

  return bestRule;
};

export const askDonationAssistant = async (question) => {
  if (!isDonationRelatedQuestion(question)) {
    return {
      success: true,
      inScope: false,
      answer: FALLBACK_OUT_OF_SCOPE_MESSAGE,
    };
  }

  const normalizedQuestion = normalizeText(question);
  const matchedRule = findBestRule(normalizedQuestion);
  
  let answer;
  if (matchedRule) {
    answer = `${matchedRule.answer} ${SAFETY_NOTE}`;
  } else {
    // Si la pregunta es sobre donación pero no tiene regla específica,
    // responde reconociendo que es sobre donación pero recomienda confirmación
    const contextItems = [];
    if (normalizedQuestion.includes('puedo') || normalizedQuestion.includes('me permite')) {
      contextItems.push('tu eligibilidad');
    }
    if (normalizedQuestion.includes('riesgo') || normalizedQuestion.includes('peligro')) {
      contextItems.push('los riesgos potenciales');
    }
    if (normalizedQuestion.includes('cuando') || normalizedQuestion.includes('cuanto tiempo')) {
      contextItems.push('los plazos de espera');
    }
    
    const contextPhrase = contextItems.length > 0 
      ? ` Aunque no tengo una respuesta predefinida para ${contextItems.join(' y ')},`
      : '';
    
    answer = `Entiendo que tu pregunta es sobre donación de sangre.${contextPhrase} el banco de sangre puede evaluarte correctamente según tu situación particular y normativa local. Te recomendamos que contactes directamente para una evaluación precisa. ${SAFETY_NOTE}`;
  }

  return {
    success: true,
    inScope: true,
    answer,
  };
};
