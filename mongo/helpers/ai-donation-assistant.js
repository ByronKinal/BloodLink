const SAFETY_NOTE =
  'Esta información es orientativa y no sustituye una evaluación médica profesional.';
const AI_SUSPENDED_MESSAGE =
  'Servicio suspendido: el asistente de IA no está disponible en este momento.';
const OUT_OF_SCOPE_MESSAGE =
  'No soy apto para responder esas preguntas. Solo puedo responder dudas relacionadas con donacion de sangre.';
const LIMIT_MESSAGE =
  'Tu pregunta excede el limite permitido. Resume tu duda para poder ayudarte.';
const MAX_QUESTION_LENGTH = 500;

const DEFAULT_OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const DEFAULT_OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const normalizeText = (text = '') =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

const includesAny = (text, keywords = []) =>
  keywords.some((keyword) => text.includes(keyword));

const DONATION_CONTEXT_KEYWORDS = [
  'donar',
  'donacion',
  'donación',
  'sangre',
  'donante',
  'banco de sangre',
  'hemoglobina',
  'plaquetas',
  'plasma',
  'grupo sanguineo',
  'grupo sanguíneo',
  'rh',
  'tipo de sangre',
  'puedo donar',
  'requisitos para donar',
  'tatuaje',
  'vacuna',
  'antibiotico',
  'embarazo',
  'lactancia',
];

const isDonationRelatedQuestion = (question = '') => {
  const normalizedQuestion = normalizeText(question);

  if (!normalizedQuestion) {
    return false;
  }

  return DONATION_CONTEXT_KEYWORDS.some((keyword) =>
    normalizedQuestion.includes(normalizeText(keyword))
  );
};

const buildFallbackAnswer = (question = '') => {
  const cleanQuestion = String(question || '').trim();
  const normalizedQuestion = normalizeText(cleanQuestion);

  if (!cleanQuestion) {
    return 'Escribe tu duda y te responderé de forma directa sobre donación de sangre.';
  }

  if (includesAny(normalizedQuestion, ['tatuaje', 'piercing', 'microblading', 'perforacion'])) {
    return 'Si te tatuaste, normalmente debes esperar entre 4 y 12 meses antes de donar, según la normativa local y las condiciones de bioseguridad del lugar donde lo realizaste. La decisión final la toma el banco de sangre en la entrevista médica.';
  }

  if (includesAny(normalizedQuestion, ['edad', 'peso', 'requisito'])) {
    return 'Como regla general, para donar sangre debes estar en buen estado de salud, cumplir el rango de edad aceptado por el banco de sangre y pesar al menos 50 kg.';
  }

  if (includesAny(normalizedQuestion, ['medicamento', 'antibiotico', 'tratamiento', 'vacuna'])) {
    return 'Si tomas medicamentos o antibióticos, o te vacunaste recientemente, la aptitud para donar depende del fármaco, motivo y síntomas actuales. Lleva el nombre del medicamento y la fecha de última dosis para evaluación segura.';
  }

  if (includesAny(normalizedQuestion, ['embarazo', 'lactancia', 'postparto'])) {
    return 'Durante el embarazo no se recomienda donar sangre. En lactancia o postparto puede existir un tiempo de espera y se requiere valoración individual en el banco de sangre.';
  }

  return `Sobre tu pregunta: "${cleanQuestion}". En términos generales, sí es posible donar en muchos casos, pero depende de tu estado de salud actual, antecedentes médicos y criterios del banco de sangre. Si me compartes más contexto (fecha, síntomas, tratamiento o diagnóstico), te doy una respuesta más puntual.`;
};

const askOpenAI = async (question) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }

  const isOpenRouterKey = apiKey.startsWith('sk-or-v1-');
  const apiUrl =
    process.env.OPENAI_BASE_URL ||
    (isOpenRouterKey ? DEFAULT_OPENROUTER_API_URL : DEFAULT_OPENAI_API_URL);

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const payloadModel =
    isOpenRouterKey && !model.includes('/') ? `openai/${model}` : model;

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  };

  if (isOpenRouterKey) {
    headers['HTTP-Referer'] = process.env.OPENROUTER_REFERER || 'http://localhost:3006';
    headers['X-Title'] = process.env.OPENROUTER_APP_NAME || 'BloodLink';
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: payloadModel,
      temperature: 0.4,
      max_tokens: 260,
      messages: [
        {
          role: 'system',
          content:
            'Eres un asistente de donacion de sangre. Responde en espanol claro, directo y breve. Da orientacion general, no diagnostiques, y menciona cuando debe consultarse al banco de sangre.',
        },
        {
          role: 'user',
          content: String(question || ''),
        },
      ],
    }),
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  return typeof content === 'string' && content.trim() ? content.trim() : null;
};

export const askDonationAssistant = async (question) => {
  const cleanQuestion = String(question || '').trim();

  if (cleanQuestion.length > MAX_QUESTION_LENGTH) {
    return {
      success: false,
      inScope: false,
      answer: LIMIT_MESSAGE,
      message: LIMIT_MESSAGE,
    };
  }

  if (!isDonationRelatedQuestion(cleanQuestion)) {
    return {
      success: false,
      inScope: false,
      answer: OUT_OF_SCOPE_MESSAGE,
      message: OUT_OF_SCOPE_MESSAGE,
    };
  }

  let answer = null;

  try {
    answer = await askOpenAI(cleanQuestion);
  } catch (_error) {
    answer = null;
  }

  if (!answer) {
    return {
      success: false,
      inScope: false,
      answer: AI_SUSPENDED_MESSAGE,
      message: AI_SUSPENDED_MESSAGE,
    };
  }

  return {
    success: true,
    inScope: true,
    answer: `${answer} ${SAFETY_NOTE}`,
  };
};
