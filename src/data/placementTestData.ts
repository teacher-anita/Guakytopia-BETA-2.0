import { PlacementQuestion } from '../types';

export const OFFICIAL_GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/1tTWnvpLsnLkcIivBui2RLxgkXxXJ97tOFMkic-d88so/edit';

export const PLACEMENT_TEST_QUESTIONS: PlacementQuestion[] = [
  // PARTE 1: Nivel Principiante (Elementary)
  {
    id: 1,
    part: 1,
    partTitle: 'Parte 1: Vocabulario y Gramática Básica',
    category: 'grammar',
    question: 'Choose the correct word: “I _____ from Venezuela.”',
    options: ['a) am', 'b) is', 'c) are'],
    correctAnswer: 'a',
    explanation: 'Con el pronombre "I" (primera persona singular), el verbo To Be correcto en presente es "am".'
  },
  {
    id: 2,
    part: 1,
    partTitle: 'Parte 1: Vocabulario y Gramática Básica',
    category: 'grammar',
    question: 'Choose the correct word: “She _____ to work every day.”',
    options: ['a) go', 'b) goes', 'c) going'],
    correctAnswer: 'b',
    explanation: 'En presente simple con tercera persona singular (He / She / It), agregamos "-es" al verbo go: "goes".'
  },
  {
    id: 3,
    part: 1,
    partTitle: 'Parte 1: Vocabulario y Gramática Básica',
    category: 'grammar',
    question: 'Choose the correct sentence:',
    options: ['a) I am a student.', 'b) I am a stude.', 'c) I am a studing.'],
    correctAnswer: 'a',
    explanation: '"I am a student" es la forma gramatical correcta.'
  },
  {
    id: 4,
    part: 1,
    partTitle: 'Parte 1: Vocabulario y Gramática Básica',
    category: 'grammar',
    question: 'Choose the correct word: “My name _____ Luis.”',
    options: ['a) am', 'b) is', 'c) are', "d) I don't know"],
    correctAnswer: 'b',
    explanation: '"My name" es un sujeto singular equivalente a "it", por lo que utiliza el verbo "is".'
  },
  {
    id: 5,
    part: 1,
    partTitle: 'Parte 1: Vocabulario y Gramática Básica',
    category: 'grammar',
    question: 'Choose the correct word: “We _____ in the office now.”',
    options: ['a) are', 'b) is', 'c) am', "d) I don't know"],
    correctAnswer: 'a',
    explanation: 'Con el pronombre plural "We", el verbo To Be correspondiente es "are".'
  },
  {
    id: 6,
    part: 1,
    partTitle: 'Parte 1: Vocabulario y Gramática Básica',
    category: 'grammar',
    question: 'Choose the correct word: “He _____ a red car.”',
    options: ['a) have', 'b) has', 'c) is', "d) I don't know"],
    correctAnswer: 'b',
    explanation: 'La forma de tercera persona singular del verbo "to have" es "has".'
  },
  {
    id: 7,
    part: 1,
    partTitle: 'Parte 1: Vocabulario y Gramática Básica',
    category: 'grammar',
    question: 'Choose the correct sentence:',
    options: ['a) She like coffee.', 'b) She likes coffee.', 'c) She liking coffee.', "d) I don't know"],
    correctAnswer: 'b',
    explanation: 'En presente simple con "She", el verbo lleva "-s": "She likes coffee".'
  },
  {
    id: 8,
    part: 1,
    partTitle: 'Parte 1: Vocabulario y Gramática Básica',
    category: 'grammar',
    question: 'Choose the correct sentence:',
    options: ['a) I am happy today.', 'b) I am happyed today.', 'c) I am happiness today.', "d) I don't know"],
    correctAnswer: 'a',
    explanation: '"Happy" es el adjetivo correcto tras el verbo To Be.'
  },
  {
    id: 9,
    part: 1,
    partTitle: 'Parte 1: Vocabulario y Gramática Básica',
    category: 'grammar',
    question: 'Choose the correct word: “They _____ in the office.”',
    options: ['a) are', 'b) is', 'c) am', "d) I don't know"],
    correctAnswer: 'a',
    explanation: 'Con el pronombre plural "They", la conjugación correcta es "are".'
  },
  {
    id: 10,
    part: 1,
    partTitle: 'Parte 1: Vocabulario y Gramática Básica',
    category: 'grammar',
    question: 'Choose the correct word: “I _____ very tired.”',
    options: ['a) am', 'b) is', 'c) are', "d) I don't know"],
    correctAnswer: 'a',
    explanation: 'Primera persona singular "I" requiere "am".'
  },
  {
    id: 11,
    part: 1,
    partTitle: 'Parte 1: Lectura Corta (Principiante)',
    category: 'reading',
    contextText: '“Hello! My name is Luis. I am 28 years old. I live in Caracas. I work at a company. I work from Monday to Friday. I like coffee and music.”',
    question: 'What does Luis do?',
    options: ['a) He is a doctor.', 'b) He works at a company.', 'c) He is a student.', "d) I don't know"],
    correctAnswer: 'b',
    explanation: 'El texto indica claramente: "I work at a company".'
  },
  {
    id: 12,
    part: 1,
    partTitle: 'Parte 1: Lectura Corta (Principiante)',
    category: 'reading',
    contextText: '“Hello! My name is Luis. I am 28 years old. I live in Caracas. I work at a company. I work from Monday to Friday. I like coffee and music.”',
    question: 'Where does Luis live?',
    options: ['a) Madrid', 'b) Caracas', 'c) Bogotá', "d) I don't know"],
    correctAnswer: 'b',
    explanation: 'El texto indica directamente: "I live in Caracas".'
  },

  // PARTE 2: Nivel Intermedio (Pre-Intermediate / Intermediate)
  {
    id: 13,
    part: 2,
    partTitle: 'Parte 2: Gramática y Vocabulario Intermedio',
    category: 'grammar',
    question: 'Choose the correct sentence: “I _____ to the supermarket yesterday.”',
    options: ['a) go', 'b) went', 'c) going', "d) I don't know"],
    correctAnswer: 'b',
    explanation: '"Yesterday" señala una acción finalizada en pasado simple, por lo que usamos el pasado irregular "went".'
  },
  {
    id: 14,
    part: 2,
    partTitle: 'Parte 2: Gramática y Vocabulario Intermedio',
    category: 'grammar',
    question: 'Choose the correct sentence: “She _____ TV when I called her.”',
    options: ['a) watched', 'b) was watching', 'c) watches', "d) I don't know"],
    correctAnswer: 'b',
    explanation: 'Para una acción en progreso en el pasado interrumpida por otra, se usa Past Continuous: "was watching".'
  },
  {
    id: 15,
    part: 2,
    partTitle: 'Parte 2: Gramática y Vocabulario Intermedio',
    category: 'grammar',
    question: 'Choose the correct sentence: “If I _____ more time, I would travel.”',
    options: ['a) have', 'b) had', 'c) has', "d) I don't know"],
    correctAnswer: 'b',
    explanation: 'Segundo condicional para situaciones hipotéticas: "If + Past Simple, would + infinitive".'
  },
  {
    id: 16,
    part: 2,
    partTitle: 'Parte 2: Gramática y Vocabulario Intermedio',
    category: 'grammar',
    question: 'Choose the correct sentence: “She _____ English for three years.”',
    options: ['a) has studied', 'b) studied', 'c) is studying', "d) I don't know"],
    correctAnswer: 'a',
    explanation: 'Acción iniciada en el pasado que continúa en el presente ("for three years") requiere Present Perfect: "has studied".'
  },
  {
    id: 17,
    part: 2,
    partTitle: 'Parte 2: Gramática y Vocabulario Intermedio',
    category: 'grammar',
    question: 'Choose the correct word: “I am very _____ today.”',
    options: ['a) tired', 'b) tiring', 'c) tire', "d) I don't know"],
    correctAnswer: 'a',
    explanation: 'Adjetivo con terminación "-ed" ("tired") describe cómo se siente una persona.'
  },
  {
    id: 18,
    part: 2,
    partTitle: 'Parte 2: Gramática y Vocabulario Intermedio',
    category: 'grammar',
    question: 'Choose the correct sentence: “They _____ to the beach every summer.”',
    options: ['a) go', 'b) are going', 'c) went', "d) I don't know"],
    correctAnswer: 'a',
    explanation: 'Hábito repetido periódicamente ("every summer") en presente simple: "go".'
  },
  {
    id: 19,
    part: 2,
    partTitle: 'Parte 2: Gramática y Vocabulario Intermedio',
    category: 'grammar',
    question: 'Choose the correct sentence: “She _____ to the store by car.”',
    options: ['a) go', 'b) goes', 'c) going', "d) I don't know"],
    correctAnswer: 'b',
    explanation: 'Sujeto "She" en presente simple toma la desinencia "-es": "goes".'
  },
  {
    id: 20,
    part: 2,
    partTitle: 'Parte 2: Gramática y Vocabulario Intermedio',
    category: 'grammar',
    question: 'Choose the correct sentence: “I _____ my homework last night.”',
    options: ['a) did', 'b) do', 'c) done', "d) I don't know"],
    correctAnswer: 'a',
    explanation: '"Last night" requiere pasado simple del verbo do: "did".'
  },
  {
    id: 21,
    part: 2,
    partTitle: 'Parte 2: Completación (Fill in the blanks)',
    category: 'fill_in',
    question: 'Please, don’t _____ your phone during the meeting. (Escribe UNA sola palabra en inglés)',
    correctAnswer: 'bring',
    explanation: 'Palabra esperada: "bring" (o "use" / "answer").'
  },
  {
    id: 22,
    part: 2,
    partTitle: 'Parte 2: Completación (Fill in the blanks)',
    category: 'fill_in',
    question: 'I want to _____ my English, so I’m going to practice every day. (Escribe UNA sola palabra en inglés)',
    correctAnswer: 'improve',
    explanation: 'Palabra esperada: "improve" (o "practice" / "boost").'
  },
  {
    id: 23,
    part: 2,
    partTitle: 'Parte 2: Lectura Corta (Intermedio)',
    category: 'reading',
    contextText: '“My name is Roberto. I work at a company in Caracas. I am an engineer. I started working there 8 years ago. I enjoy my job very much. I also like to travel, and I hope to visit Europe next year.”',
    question: 'What does Roberto do?',
    options: ['a) He is a doctor.', 'b) He is an engineer.', 'c) He is a lawyer.', "d) I don't know"],
    correctAnswer: 'b',
    explanation: 'El texto afirma: "I am an engineer".'
  },
  {
    id: 24,
    part: 2,
    partTitle: 'Parte 2: Lectura Corta (Intermedio)',
    category: 'reading',
    contextText: '“My name is Roberto. I work at a company in Caracas. I am an engineer. I started working there 8 years ago. I enjoy my job very much. I also like to travel, and I hope to visit Europe next year.”',
    question: 'How long has Roberto been working at the company?',
    options: ['a) 5 years', 'b) 8 years', 'c) 10 years', "d) I don't know"],
    correctAnswer: 'b',
    explanation: 'El texto dice: "I started working there 8 years ago".'
  },
  {
    id: 25,
    part: 2,
    partTitle: 'Parte 2: Lectura Corta (Intermedio)',
    category: 'reading',
    contextText: '“My name is Roberto. I work at a company in Caracas. I am an engineer. I started working there 8 years ago. I enjoy my job very much. I also like to travel, and I hope to visit Europe next year.”',
    question: 'What does Roberto hope to do next year?',
    options: ['a) Change jobs', 'b) Travel to Europe', 'c) Study medicine', "d) I don't know"],
    correctAnswer: 'b',
    explanation: 'El texto concluye: "I hope to visit Europe next year".'
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
  const total = PLACEMENT_TEST_QUESTIONS.length;

  PLACEMENT_TEST_QUESTIONS.forEach(q => {
    const rawAnswer = (answers[q.id] || '').trim().toLowerCase();
    const cleanAnswer = rawAnswer.replace(/^[a-d]\)\s*/, ''); // strip "a) " if needed

    if (q.category === 'fill_in') {
      if (cleanAnswer === q.correctAnswer || (q.id === 21 && ['use', 'answer', 'check'].includes(cleanAnswer)) || (q.id === 22 && ['practice', 'study', 'boost', 'upgrade'].includes(cleanAnswer))) {
        score++;
      }
    } else {
      // Multiple choice matches either "a" or the full option "a) am"
      if (rawAnswer.startsWith(q.correctAnswer) || rawAnswer === q.correctAnswer) {
        score++;
      }
    }
  });

  const percentage = Math.round((score / total) * 100);

  let suggestedLevelId = 'level_1';
  let suggestedLevelName = 'Level I: Super Goal 1 (Begginer I)';
  let diagnosisText = 'Fundamentos iniciales. Ideal para arrancar desde la base con fonética, vocabulario esencial y confianza para hablar.';

  if (score >= 22) {
    suggestedLevelId = 'level_7';
    suggestedLevelName = 'Level VII: Mega Goal 1 (Inter - Adv I)';
    diagnosisText = 'Excelente dominio de tiempos verbales y lectura analítica. Recomendado para debatir y perfeccionar fluidez profesional.';
  } else if (score >= 17) {
    suggestedLevelId = 'level_5';
    suggestedLevelName = 'Level V: Super Goal 5 (Intermediate I)';
    diagnosisText = 'Buen manejo de pasado y estructuras compuestas. Listo para consolidar el pensamiento directo en inglés sin traducir.';
  } else if (score >= 11) {
    suggestedLevelId = 'level_3';
    suggestedLevelName = 'Level III: Super Goal 3 (Beg - Inter I)';
    diagnosisText = 'Conocimiento sólido de gramática básica. Recomendado para afianzar tiempos pasados y soltar la lengua en conversación.';
  } else if (score >= 6) {
    suggestedLevelId = 'level_2';
    suggestedLevelName = 'Level II: Super Goal 2 (Begginer II)';
    diagnosisText = 'Identifica estructuras elementales. Recomendado para ampliar vocabulario cotidiano y consolidar el verbo To Be y rutinas.';
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
