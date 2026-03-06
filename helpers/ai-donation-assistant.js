import OpenAI from 'openai';

const FALLBACK_OUT_OF_SCOPE_MESSAGE =
  'Solo puedo responder preguntas relacionadas con donación de sangre. No soy apto para responder temas fuera de ese contexto.';

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

let client;

const getOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  return client;
};

const DONATION_SYSTEM_PROMPT = `
Eres un asistente médico informativo de BloodLink especializado EXCLUSIVAMENTE en dudas sobre donación de sangre.

Reglas obligatorias:
1) Solo responde preguntas relacionadas con donación de sangre, requisitos, contraindicaciones, tiempos de espera y preparación para donar.
2) Si la pregunta no es de donación de sangre, responde exactamente:
"Solo puedo responder preguntas relacionadas con donación de sangre. No soy apto para responder temas fuera de ese contexto."
3) Responde en español, claro y breve.
4) Nunca inventes datos. Si no estás seguro, dilo con claridad y recomienda consultar un banco de sangre o profesional de salud.
5) Incluye una nota breve de seguridad: "Esta información es orientativa y no sustituye una evaluación médica profesional.".
`;

const OPENAI_ASSISTANT_MODEL = 'gpt-4o-mini';

export const askDonationAssistant = async (question) => {
  if (!isDonationRelatedQuestion(question)) {
    return {
      success: true,
      inScope: false,
      answer: FALLBACK_OUT_OF_SCOPE_MESSAGE,
    };
  }

  const openai = getOpenAIClient();

  if (!openai) {
    const error = new Error(
      'OPENAI_API_KEY no está configurada. Configura la API key para usar el asistente IA.'
    );
    error.status = 503;
    throw error;
  }

  const response = await openai.responses.create({
    model: OPENAI_ASSISTANT_MODEL,
    temperature: 0.2,
    max_output_tokens: 350,
    input: [
      {
        role: 'system',
        content: DONATION_SYSTEM_PROMPT,
      },
      {
        role: 'user',
        content: question,
      },
    ],
  });

  const answer =
    response.output_text?.trim() ||
    'No pude generar una respuesta en este momento. Intenta nuevamente.';

  return {
    success: true,
    inScope: true,
    answer,
  };
};
