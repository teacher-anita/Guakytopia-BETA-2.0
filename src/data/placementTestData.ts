import { PlacementQuestion } from '../types';

export const OFFICIAL_GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/1tTWnvpLsnLkcIivBui2RLxgkXxXJ97tOFMkic-d88so/edit';

export const PLACEMENT_TEST_QUESTIONS: PlacementQuestion[] = [
  // ==========================================
  // PARTE 1: FUNDAMENTOS BÁSICOS & A1 (1 - 18)
  // ==========================================
  {
    id: 1,
    part: 1,
    partTitle: 'Parte 1: Fundamentos y Saludos Básicos',
    category: 'grammar',
    question: 'Choose the correct word: “I _____ from Venezuela.”',
    options: ['a) am', 'b) is', 'c) are', "d) be"],
    correctAnswer: 'a',
    explanation: 'Con el pronombre "I" (primera persona singular), la conjugación correcta del verbo To Be en presente es "am".'
  },
  {
    id: 2,
    part: 1,
    partTitle: 'Parte 1: Fundamentos y Saludos Básicos',
    category: 'grammar',
    question: 'Choose the correct word: “She _____ to work every day.”',
    options: ['a) go', 'b) goes', 'c) going', 'd) gone'],
    correctAnswer: 'b',
    explanation: 'En presente simple con tercera persona singular (He / She / It), agregamos "-es" al verbo go: "goes".'
  },
  {
    id: 3,
    part: 1,
    partTitle: 'Parte 1: Fundamentos y Saludos Básicos',
    category: 'grammar',
    question: 'Choose the correct sentence:',
    options: ['a) I am a student.', 'b) I am student.', 'c) I is student.', 'd) I a student.'],
    correctAnswer: 'a',
    explanation: 'En inglés se requiere el artículo indefinido "a" antes de profesiones y ocupaciones en singular: "I am a student".'
  },
  {
    id: 4,
    part: 1,
    partTitle: 'Parte 1: Fundamentos y Saludos Básicos',
    category: 'grammar',
    question: 'Choose the correct word: “My sister _____ 24 years old.”',
    options: ['a) has', 'b) have', 'c) is', 'd) are'],
    correctAnswer: 'c',
    explanation: 'En inglés, la edad se expresa siempre con el verbo To Be ("is"), nunca con "have" o "has".'
  },
  {
    id: 5,
    part: 1,
    partTitle: 'Parte 1: Fundamentos y Saludos Básicos',
    category: 'grammar',
    question: 'Choose the correct word: “We _____ ready for our English class.”',
    options: ['a) are', 'b) is', 'c) am', 'd) be'],
    correctAnswer: 'a',
    explanation: 'Con el pronombre plural "We", el verbo To Be correspondiente es "are".'
  },
  {
    id: 6,
    part: 1,
    partTitle: 'Parte 1: Fundamentos y Saludos Básicos',
    category: 'grammar',
    question: 'Choose the correct word: “He _____ two cell phones.”',
    options: ['a) have', 'b) has', 'c) is', 'd) having'],
    correctAnswer: 'b',
    explanation: 'La forma de tercera persona singular del verbo "to have" es "has".'
  },
  {
    id: 7,
    part: 1,
    partTitle: 'Parte 1: Fundamentos y Saludos Básicos',
    category: 'grammar',
    question: 'Choose the correct sentence:',
    options: ['a) She don’t like coffee.', 'b) She doesn’t like coffee.', 'c) She not like coffee.', 'd) She isn’t like coffee.'],
    correctAnswer: 'b',
    explanation: 'En presente simple negativo con He/She/It se usa el auxiliar "doesn’t" más el verbo en forma base: "She doesn’t like coffee".'
  },
  {
    id: 8,
    part: 1,
    partTitle: 'Parte 1: Fundamentos y Saludos Básicos',
    category: 'grammar',
    question: 'Choose the correct sentence:',
    options: ['a) They are happy today.', 'b) They is happy today.', 'c) They am happy today.', 'd) They be happy today.'],
    correctAnswer: 'a',
    explanation: 'Con el pronombre "They", el verbo To Be es "are".'
  },
  {
    id: 9,
    part: 1,
    partTitle: 'Parte 1: Fundamentos y Saludos Básicos',
    category: 'grammar',
    question: 'Choose the correct question word: “_____ is your teacher?” — “Her name is Waky.”',
    options: ['a) What', 'b) Who', 'c) Where', 'd) How'],
    correctAnswer: 'b',
    explanation: '"Who" se utiliza para preguntar por personas e identidades.'
  },
  {
    id: 10,
    part: 1,
    partTitle: 'Parte 1: Fundamentos y Saludos Básicos',
    category: 'grammar',
    question: 'Choose the correct question: “_____ do you live?” — “In Caracas.”',
    options: ['a) When', 'b) Why', 'c) Where', 'd) Who'],
    correctAnswer: 'c',
    explanation: '"Where" es la palabra interrogativa para preguntar sobre lugares de residencia o ubicación.'
  },
  {
    id: 11,
    part: 1,
    partTitle: 'Parte 1: Fundamentos y Saludos Básicos',
    category: 'vocabulary',
    question: 'Choose the correct word for the number: “12”',
    options: ['a) Twenty', 'b) Twelve', 'c) Two', 'd) Twelfth'],
    correctAnswer: 'b',
    explanation: 'El número 12 en inglés se escribe "twelve".'
  },
  {
    id: 12,
    part: 1,
    partTitle: 'Parte 1: Fundamentos y Saludos Básicos',
    category: 'vocabulary',
    question: 'Choose the correct article: “I eat _____ apple every morning.”',
    options: ['a) a', 'b) an', 'c) the', 'd) some'],
    correctAnswer: 'b',
    explanation: 'Usamos "an" antes de palabras que inician con sonido vocálico como "apple".'
  },
  {
    id: 13,
    part: 1,
    partTitle: 'Parte 1: Fundamentos y Saludos Básicos',
    category: 'vocabulary',
    question: 'Choose the correct possessive: “This is Maria. That is _____ car.”',
    options: ['a) his', 'b) her', 'c) their', 'd) your'],
    correctAnswer: 'b',
    explanation: '"Her" es el adjetivo posesivo femenino singular correspondiente a "Maria / she".'
  },
  {
    id: 14,
    part: 1,
    partTitle: 'Parte 1: Fundamentos y Saludos Básicos',
    category: 'grammar',
    question: 'Choose the correct preposition: “My English class is _____ 5:00 PM.”',
    options: ['a) in', 'b) on', 'c) at', 'd) to'],
    correctAnswer: 'c',
    explanation: 'Para horas específicas del reloj se utiliza siempre la preposición "at" (ej. at 5:00 PM).'
  },
  {
    id: 15,
    part: 1,
    partTitle: 'Parte 1: Fundamentos y Saludos Básicos',
    category: 'grammar',
    question: 'Choose the correct preposition: “We have class _____ Mondays and Wednesdays.”',
    options: ['a) in', 'b) on', 'c) at', 'd) for'],
    correctAnswer: 'b',
    explanation: 'Para días de la semana se utiliza la preposición "on" (ej. on Mondays).'
  },
  {
    id: 16,
    part: 1,
    partTitle: 'Parte 1: Fundamentos y Saludos Básicos',
    category: 'vocabulary',
    question: 'What is the opposite of “Hot”?',
    options: ['a) Warm', 'b) Cold', 'c) Fast', 'd) Dark'],
    correctAnswer: 'b',
    explanation: 'El antónimo de "hot" (caliente/caluroso) es "cold" (frío).'
  },
  {
    id: 17,
    part: 1,
    partTitle: 'Parte 1: Fundamentos y Saludos Básicos',
    category: 'grammar',
    question: 'Choose the correct plural form: “There are three _____ in the classroom.”',
    options: ['a) childs', 'b) children', 'c) childes', 'd) childrens'],
    correctAnswer: 'b',
    explanation: '"Children" es el plural irregular de "child". Nunca lleva "-s".'
  },
  {
    id: 18,
    part: 1,
    partTitle: 'Parte 1: Fundamentos y Saludos Básicos',
    category: 'grammar',
    question: 'Choose the correct sentence:',
    options: ['a) Do you speak English?', 'b) You speak English?', 'c) Are you speak English?', 'd) Does you speak English?'],
    correctAnswer: 'a',
    explanation: 'En presente simple, las preguntas con el pronombre "you" inician con el auxiliar "Do".'
  },

  // ==========================================
  // PARTE 2: COMUNICACIÓN COTIDIANA & A2 (19 - 32)
  // ==========================================
  {
    id: 19,
    part: 2,
    partTitle: 'Parte 2: Rutinas y Comunicación Cotidiana',
    category: 'grammar',
    question: 'Look outside! It _____ right now.',
    options: ['a) is raining', 'b) rains', 'c) rain', 'd) was rain'],
    correctAnswer: 'a',
    explanation: 'Para acciones que están ocurriendo en el momento exacto ("right now") usamos el Present Continuous: "is raining".'
  },
  {
    id: 20,
    part: 2,
    partTitle: 'Parte 2: Rutinas y Comunicación Cotidiana',
    category: 'grammar',
    question: 'Choose the correct word: “What _____ you do yesterday?”',
    options: ['a) do', 'b) did', 'c) was', 'd) were'],
    correctAnswer: 'b',
    explanation: 'El auxiliar de preguntas en pasado simple es "did": "What did you do yesterday?".'
  },
  {
    id: 21,
    part: 2,
    partTitle: 'Parte 2: Rutinas y Comunicación Cotidiana',
    category: 'grammar',
    question: 'Choose the past form: “Yesterday, I _____ to the supermarket.”',
    options: ['a) go', 'b) goed', 'c) went', 'd) gone'],
    correctAnswer: 'c',
    explanation: '"Went" es el pasado irregular del verbo "go".'
  },
  {
    id: 22,
    part: 2,
    partTitle: 'Parte 2: Rutinas y Comunicación Cotidiana',
    category: 'grammar',
    question: 'Choose the past form of To Be: “They _____ very tired last night.”',
    options: ['a) was', 'b) were', 'c) are', 'd) been'],
    correctAnswer: 'b',
    explanation: 'Con el pronombre plural "They", la forma del pasado de To Be es "were".'
  },
  {
    id: 23,
    part: 2,
    partTitle: 'Parte 2: Rutinas y Comunicación Cotidiana',
    category: 'grammar',
    question: 'Choose the correct comparative: “English is _____ than Latin.”',
    options: ['a) more easy', 'b) easier', 'c) easyer', 'd) easily'],
    correctAnswer: 'b',
    explanation: 'Los adjetivos de dos sílabas terminados en "y" cambian a "-ier" para el comparativo: "easier".'
  },
  {
    id: 24,
    part: 2,
    partTitle: 'Parte 2: Rutinas y Comunicación Cotidiana',
    category: 'grammar',
    question: 'Choose the superlative: “This is the _____ book in the library.”',
    options: ['a) interestingest', 'b) more interesting', 'c) most interesting', 'd) much interesting'],
    correctAnswer: 'c',
    explanation: 'Para adjetivos largos se utiliza "the most" en el grado superlativo: "the most interesting".'
  },
  {
    id: 25,
    part: 2,
    partTitle: 'Parte 2: Rutinas y Comunicación Cotidiana',
    category: 'vocabulary',
    question: 'Choose the correct word: “How _____ water do you drink every day?”',
    options: ['a) many', 'b) much', 'c) few', 'd) lot'],
    correctAnswer: 'b',
    explanation: '"Water" es un sustantivo incontable, por lo que se pregunta con "How much".'
  },
  {
    id: 26,
    part: 2,
    partTitle: 'Parte 2: Rutinas y Comunicación Cotidiana',
    category: 'vocabulary',
    question: 'Choose the correct word: “There are _____ students waiting in the hall.”',
    options: ['a) much', 'b) any', 'c) some', 'd) a little'],
    correctAnswer: 'c',
    explanation: 'En oraciones afirmativas con sustantivos contables en plural se usa "some".'
  },
  {
    id: 27,
    part: 2,
    partTitle: 'Parte 2: Rutinas y Comunicación Cotidiana',
    category: 'grammar',
    question: 'Choose the correct modal: “You look sick. You _____ see a doctor.”',
    options: ['a) should', 'b) would', 'c) might to', 'd) could to'],
    correctAnswer: 'a',
    explanation: 'El modal "should" expresa recomendación o consejo.'
  },
  {
    id: 28,
    part: 2,
    partTitle: 'Parte 2: Rutinas y Comunicación Cotidiana',
    category: 'grammar',
    question: 'Choose the correct sentence:',
    options: ['a) She can to swim.', 'b) She can swim.', 'c) She can swimming.', 'd) She cans swim.'],
    correctAnswer: 'b',
    explanation: 'Los verbos modales como "can" no llevan "-s" en tercera persona y van seguidos de infinitivo sin "to".'
  },
  {
    id: 29,
    part: 2,
    partTitle: 'Parte 2: Rutinas y Comunicación Cotidiana',
    category: 'grammar',
    question: 'Choose the correct future expression: “I _____ visit my family next weekend. I already bought the tickets.”',
    options: ['a) am going to', 'b) will to', 'c) visited', 'd) goes to'],
    correctAnswer: 'a',
    explanation: '"Going to" se usa para planes decididos y preparados previamente ("already bought the tickets").'
  },
  {
    id: 30,
    part: 2,
    partTitle: 'Parte 2: Rutinas y Comunicación Cotidiana',
    category: 'vocabulary',
    question: 'Complete the sentence: “I always _____ my teeth before going to sleep.”',
    options: ['a) wash', 'b) clean', 'c) brush', 'd) paint'],
    correctAnswer: 'c',
    explanation: 'La colocación correcta en inglés para lavarse los dientes es "to brush your teeth".'
  },
  {
    id: 31,
    part: 2,
    partTitle: 'Parte 2: Rutinas y Comunicación Cotidiana',
    category: 'grammar',
    question: 'Choose the correct connector: “I was very tired, _____ I finished my homework.”',
    options: ['a) because', 'b) but', 'c) so', 'd) although'],
    correctAnswer: 'b',
    explanation: '"But" (pero) introduce una idea de contraste directo.'
  },
  {
    id: 32,
    part: 2,
    partTitle: 'Parte 2: Rutinas y Comunicación Cotidiana',
    category: 'grammar',
    question: 'Choose the correct response: “Thank you very much for your help!” — “_____”',
    options: ['a) You’re welcome!', 'b) Please!', 'c) Yes, I do.', 'd) Same to you.'],
    correctAnswer: 'a',
    explanation: '"You’re welcome" es la respuesta cortés estándar para "Thank you".'
  },

  // ==========================================
  // PARTE 3: PRE-INTERMEDIO & ESTRUCTURAS (33 - 42)
  // ==========================================
  {
    id: 33,
    part: 3,
    partTitle: 'Parte 3: Estructuras Pre-Intermedias',
    category: 'grammar',
    question: 'Choose the correct sentence: “I _____ in this city for five years.”',
    options: ['a) live', 'b) have lived', 'c) am living', 'd) was live'],
    correctAnswer: 'b',
    explanation: 'El Present Perfect ("have lived") expresa una acción que inició en el pasado y continúa en el presente junto a "for".'
  },
  {
    id: 34,
    part: 3,
    partTitle: 'Parte 3: Estructuras Pre-Intermedias',
    category: 'grammar',
    question: 'Choose the correct word: “She hasn’t called me _____ last Monday.”',
    options: ['a) for', 'b) since', 'c) during', 'd) ago'],
    correctAnswer: 'b',
    explanation: '"Since" se usa para marcar el punto exacto de inicio en el tiempo (since last Monday).'
  },
  {
    id: 35,
    part: 3,
    partTitle: 'Parte 3: Estructuras Pre-Intermedias',
    category: 'grammar',
    question: 'Choose the correct sentence:',
    options: ['a) Have you ever been to New York?', 'b) Did you ever been to New York?', 'c) Were you ever to New York?', 'd) Have you ever go to New York?'],
    correctAnswer: 'a',
    explanation: 'Para preguntar por experiencias en la vida se usa el Present Perfect: "Have you ever been...?".'
  },
  {
    id: 36,
    part: 3,
    partTitle: 'Parte 3: Estructuras Pre-Intermedias',
    category: 'grammar',
    question: 'Choose the correct past: “When the phone rang, I _____ dinner.”',
    options: ['a) cooked', 'b) was cooking', 'c) have cooked', 'd) am cooking'],
    correctAnswer: 'b',
    explanation: 'Past Continuous ("was cooking") describe una acción continua que fue interrumpida por otra en pasado simple.'
  },
  {
    id: 37,
    part: 3,
    partTitle: 'Parte 3: Estructuras Pre-Intermedias',
    category: 'grammar',
    question: 'Choose the correct conditional: “If it rains tomorrow, we _____ at home.”',
    options: ['a) stay', 'b) stayed', 'c) will stay', 'd) would stay'],
    correctAnswer: 'c',
    explanation: 'El Primer Condicional combina "If + presente simple" con "will + verbo base" para eventos probables.'
  },
  {
    id: 38,
    part: 3,
    partTitle: 'Parte 3: Estructuras Pre-Intermedias',
    category: 'grammar',
    question: 'Choose the correct relative pronoun: “The teacher _____ teaches English is very dynamic.”',
    options: ['a) which', 'b) who', 'c) where', 'd) whose'],
    correctAnswer: 'b',
    explanation: 'Usamos el pronombre relativo "who" para referirnos a personas.'
  },
  {
    id: 39,
    part: 3,
    partTitle: 'Parte 3: Estructuras Pre-Intermedias',
    category: 'vocabulary',
    question: 'What does the phrasal verb “give up” mean?',
    options: ['a) To surrender or quit', 'b) To donate money', 'c) To wake up early', 'd) To continue working'],
    correctAnswer: 'a',
    explanation: '"Give up" significa rendirse o abandonar un hábito o meta.'
  },
  {
    id: 40,
    part: 3,
    partTitle: 'Parte 3: Estructuras Pre-Intermedias',
    category: 'grammar',
    question: 'Choose the correct sentence:',
    options: ['a) He is too young to drive.', 'b) He is enough young to drive.', 'c) He is so young to drive.', 'd) He is very young for drive.'],
    correctAnswer: 'a',
    explanation: 'La estructura "too + adjetivo + to infinitive" indica exceso que impide una acción.'
  },
  {
    id: 41,
    part: 3,
    partTitle: 'Parte 3: Estructuras Pre-Intermedias',
    category: 'vocabulary',
    question: 'Complete: “Could you please _____ the lights? It’s too dark in here.”',
    options: ['a) turn off', 'b) turn on', 'c) turn down', 'd) turn away'],
    correctAnswer: 'b',
    explanation: '"Turn on" significa encender las luces o un aparato.'
  },
  {
    id: 42,
    part: 3,
    partTitle: 'Parte 3: Estructuras Pre-Intermedias',
    category: 'grammar',
    question: 'Choose the correct form: “I look forward to _____ you soon.”',
    options: ['a) see', 'b) seeing', 'c) saw', 'd) seen'],
    correctAnswer: 'b',
    explanation: 'La expresión "look forward to" siempre va seguida de un verbo con terminación "-ing" (gerundio).'
  },

  // ==========================================
  // PARTE 4: INTERMEDIO, LECTURA & FLUIDEZ (43 - 50)
  // ==========================================
  {
    id: 43,
    part: 4,
    partTitle: 'Parte 4: Fluidez y Comprensión Práctica',
    category: 'grammar',
    question: 'Choose the correct second conditional: “If I had a lot of money, I _____ travel around the world.”',
    options: ['a) will', 'b) would', 'c) can', 'd) am'],
    correctAnswer: 'b',
    explanation: 'El Segundo Condicional (situaciones hipotéticas) usa "If + pasado simple" con "would + verbo en infinitivo".'
  },
  {
    id: 44,
    part: 4,
    partTitle: 'Parte 4: Fluidez y Comprensión Práctica',
    category: 'grammar',
    question: 'Choose the passive voice: “Spanish and English _____ in many countries.”',
    options: ['a) are spoken', 'b) are speaking', 'c) speak', 'd) spoken'],
    correctAnswer: 'a',
    explanation: 'En voz pasiva presente con sujeto plural usamos "are + participio pasado": "are spoken".'
  },
  {
    id: 45,
    part: 4,
    partTitle: 'Parte 4: Fluidez y Comprensión Práctica',
    category: 'grammar',
    question: 'Complete: “She asked me where _____.”',
    options: ['a) did I live', 'b) I lived', 'c) do I live', 'd) had I lived'],
    correctAnswer: 'b',
    explanation: 'En estilo indirecto (reported speech / indirect questions) el orden de las palabras vuelve a ser sujeto + verbo.'
  },
  {
    id: 46,
    part: 4,
    partTitle: 'Parte 4: Fluidez y Comprensión Práctica',
    category: 'reading',
    contextText: '“Sofia works as a graphic designer. She started learning English six months ago because she wanted to communicate with international clients. Since then, she has joined two weekly conversation clubs and now feels much more confident during virtual video calls.”',
    question: 'Why did Sofia start learning English?',
    options: ['a) To travel to Europe on vacation', 'b) To talk to international clients', 'c) To teach design at university', 'd) To pass a high school exam'],
    correctAnswer: 'b',
    explanation: 'El texto explica directamente: "because she wanted to communicate with international clients".'
  },
  {
    id: 47,
    part: 4,
    partTitle: 'Parte 4: Fluidez y Comprensión Práctica',
    category: 'reading',
    contextText: '“Sofia works as a graphic designer. She started learning English six months ago because she wanted to communicate with international clients. Since then, she has joined two weekly conversation clubs and now feels much more confident during virtual video calls.”',
    question: 'How does Sofia feel now during virtual video calls?',
    options: ['a) Very nervous and anxious', 'b) Much more confident', 'c) Bored and tired', 'd) Confused by the vocabulary'],
    correctAnswer: 'b',
    explanation: 'El texto concluye: "and now feels much more confident during virtual video calls".'
  },
  {
    id: 48,
    part: 4,
    partTitle: 'Parte 4: Fluidez y Comprensión Práctica',
    category: 'vocabulary',
    question: 'Choose the synonym for “Achieve”:',
    options: ['a) Accomplish / Reach', 'b) Avoid / Escape', 'c) Fail / Miss', 'd) Postpone / Delay'],
    correctAnswer: 'a',
    explanation: '"Achieve" significa alcanzar o lograr una meta con éxito (accomplish / reach).'
  },
  {
    id: 49,
    part: 4,
    partTitle: 'Parte 4: Fluidez y Comprensión Práctica',
    category: 'grammar',
    question: 'Choose the correct connector: “_____ studying hard, he failed the driving test.”',
    options: ['a) Despite', 'b) Although', 'c) Because', 'd) Since'],
    correctAnswer: 'a',
    explanation: '"Despite" va seguido de sustantivo o gerundio (-ing) para expresar concesión ("Despite studying hard...").'
  },
  {
    id: 50,
    part: 4,
    partTitle: 'Parte 4: Fluidez y Comprensión Práctica',
    category: 'reading',
    contextText: '“Learning a new language requires consistency rather than perfection. Practicing 20 minutes every day with speaking and listening builds stronger phonetic reflexes than studying four hours only on Sundays.”',
    question: 'According to the text, what is more effective for building phonetic reflexes?',
    options: ['a) Studying 4 hours once a week on Sundays', 'b) Memorizing grammatical rules without speaking', 'c) Daily 20-minute practice of speaking and listening', 'd) Waiting until pronunciation is completely perfect'],
    correctAnswer: 'c',
    explanation: 'El autor resalta que la consistencia diaria de 20 minutos de speaking y listening es más efectiva que estudiar 4 horas solo los domingos.'
  }
];

export function evaluatePlacementScore(answers: Record<number, string>): {
  score: number;
  total: number;
  percentage: number;
  suggestedLevelId: string;
  suggestedLevelName: string;
  diagnosisText: string;
} {
  let score = 0;
  const total = PLACEMENT_TEST_QUESTIONS.length; // 50 questions

  PLACEMENT_TEST_QUESTIONS.forEach(q => {
    const rawAnswer = (answers[q.id] || '').trim().toLowerCase();
    // Support matching "a", "a)", "a) am", etc.
    if (rawAnswer.startsWith(q.correctAnswer) || rawAnswer === q.correctAnswer) {
      score++;
    }
  });

  const percentage = Math.round((score / total) * 100);

  // Exact 4 initial levels as requested by Directora Waky:
  // Level 1: Super Goal 1 (0 - 14)
  // Level 2: Super Goal 2 (15 - 27)
  // Level 3: Super Goal 3 (28 - 39)
  // Level 4: Super Goal 4 (40 - 50)
  // Max level is 4! No student is admitted above Level 4.
  let suggestedLevelId = 'level_1';
  let suggestedLevelName = 'Level I: Super Goal 1 (Principiante I)';
  let diagnosisText = 'Fundamentos iniciales. Ideal para arrancar desde la base con fonética amigable, vocabulario esencial cotidiano y confianza total para soltar la lengua.';

  if (score >= 40) {
    suggestedLevelId = 'level_4';
    suggestedLevelName = 'Level IV: Super Goal 4 (Intermedio I)';
    diagnosisText = 'Excelente nivel de comprensión lectora y estructuras compuestas. Recomendado para Super Goal 4, afianzar debates fluidos y pensamiento directo en inglés.';
  } else if (score >= 28) {
    suggestedLevelId = 'level_3';
    suggestedLevelName = 'Level III: Super Goal 3 (Pre-Intermedio)';
    diagnosisText = 'Buen manejo de tiempos pasados y comunicación habitual. Recomendado para Super Goal 3, ampliando vocabulario de viajes y soltando la lengua con agilidad.';
  } else if (score >= 15) {
    suggestedLevelId = 'level_2';
    suggestedLevelName = 'Level II: Super Goal 2 (Principiante II)';
    diagnosisText = 'Identifica estructuras cotidianas y presente simple. Recomendado para Super Goal 2, consolidando el verbo To Be, descripciones y rutinas diarias.';
  }

  return {
    score,
    total,
    percentage,
    suggestedLevelId,
    suggestedLevelName,
    diagnosisText
  };
}
