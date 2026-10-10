// Coquito Pedagogical Brain & Cognitive Intelligence Engine for Güakytopia
import { Student } from '../types';

export type LearningStyle = 'Visual' | 'Auditivo' | 'Kinestésico' | 'Lógico';

export interface CoquitoCognitiveAnalysis {
  learningStyle: LearningStyle;
  styleColor: {
    bg: string;
    border: string;
    text: string;
    badgeBg: string;
    accent: string;
  };
  cognitivePace: 'Ágil y Dinámico' | 'Reflexivo y Profundo' | 'Constante y Metódico';
  superpower: string;
  growthEdge: string;
  coquitoDiagnosis: string;
  pedagogicalTips: string[];
  engagementScore: number; // 0 - 100
  recommendedModality: string;
  weeklyEffortStatus: 'Excelente' | 'En ritmo óptimo' | 'Requiere impulso' | 'Comenzando';
}

export function analyzeStudentWithCoquito(student: Student): CoquitoCognitiveAnalysis {
  const ratings = student.rating || { fluency: 3, grammar: 3, vocabulary: 3, pronunciation: 3 };
  const avgRating = (ratings.fluency + ratings.grammar + ratings.vocabulary + ratings.pronunciation) / 4;
  
  // Determine primary learning style based on profile characteristics
  let style: LearningStyle = 'Visual';
  if (student.isKid || student.age < 15) {
    style = 'Kinestésico';
  } else if (ratings.pronunciation >= ratings.grammar && ratings.fluency >= ratings.grammar) {
    style = 'Auditivo';
  } else if (ratings.grammar > ratings.fluency) {
    style = 'Lógico';
  } else {
    style = 'Visual';
  }

  // Adjust style if notes or profession suggest specific patterns
  const prof = (student.schoolOrProfession || '').toLowerCase();
  const goal = (student.learningGoal || '').toLowerCase();
  if (prof.includes('ing') || prof.includes('sistemas') || prof.includes('contad') || prof.includes('med')) {
    style = 'Lógico';
  } else if (prof.includes('mus') || prof.includes('arte') || prof.includes('comunic') || prof.includes('idioma')) {
    style = 'Auditivo';
  } else if (prof.includes('deport') || prof.includes('danza') || prof.includes('chef') || prof.includes('atlet')) {
    style = 'Kinestésico';
  }

  const styleColors: Record<LearningStyle, CoquitoCognitiveAnalysis['styleColor']> = {
    Visual: {
      bg: 'bg-blue-50/70',
      border: 'border-blue-200',
      text: 'text-blue-900',
      badgeBg: 'bg-blue-100 text-blue-900 border-blue-300',
      accent: '#2563EB'
    },
    Auditivo: {
      bg: 'bg-purple-50/70',
      border: 'border-purple-200',
      text: 'text-purple-900',
      badgeBg: 'bg-purple-100 text-purple-900 border-purple-300',
      accent: '#7C3AED'
    },
    Kinestésico: {
      bg: 'bg-amber-50/70',
      border: 'border-amber-200',
      text: 'text-amber-900',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
      accent: '#D97706'
    },
    Lógico: {
      bg: 'bg-emerald-50/70',
      border: 'border-emerald-200',
      text: 'text-emerald-900',
      badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      accent: '#059669'
    }
  };

  // Superpower & Growth Edge
  let superpower = 'Fluidez intuitiva y soltura para comunicarse';
  let growthEdge = 'Consolidar estructuras gramaticales en pasado y futuro';

  if (style === 'Auditivo') {
    superpower = 'Alta memoria fonética y retención de entonación natural';
    growthEdge = 'Lectura analítica y ortografía de vocabulario avanzado';
  } else if (style === 'Lógico') {
    superpower = 'Precisión gramatical y comprensión profunda de sintaxis';
    growthEdge = 'Vencer la timidez y espontaneidad en conversación rápida';
  } else if (style === 'Kinestésico') {
    superpower = 'Aprendizaje activo con roleplay y energía participativa';
    growthEdge = 'Mantener concentración sostenida en explicaciones teóricas';
  } else {
    superpower = 'Retención fotográfica de infografías y vocabulario contextual';
    growthEdge = 'Producción oral sin depender de apoyo escrito en pantalla';
  }

  // Cognitive Pace
  let cognitivePace: CoquitoCognitiveAnalysis['cognitivePace'] = 'Constante y Metódico';
  if ((student.xp || 0) > 300 || (student.streak || 0) >= 4) {
    cognitivePace = 'Ágil y Dinámico';
  } else if (ratings.grammar >= 4 && ratings.fluency < 3.5) {
    cognitivePace = 'Reflexivo y Profundo';
  }

  // Engagement Score
  const streakBonus = Math.min(30, (student.streak || 0) * 6);
  const hoursBonus = Math.min(40, (student.completedHours || 0) * 3);
  const ratingBonus = Math.min(30, avgRating * 6);
  const engagementScore = Math.min(100, Math.max(35, Math.round(streakBonus + hoursBonus + ratingBonus)));

  const weeklyEffortStatus = 
    engagementScore >= 80 ? 'Excelente' :
    engagementScore >= 60 ? 'En ritmo óptimo' :
    engagementScore >= 45 ? 'Requiere impulso' : 'Comenzando';

  // Pedagogical Diagnosis Text
  const coquitoDiagnosis = `${student.name} demuestra un perfil predominantemente ${style.toLowerCase()}. ` +
    `Procesa conceptos en inglés con un ritmo ${cognitivePace.toLowerCase()}, ` +
    `destacando por su ${superpower.toLowerCase()}. ` +
    `Para acelerar su paso hacia la fluidez nativa en Güakytopia, la clave es ${growthEdge.toLowerCase()}.`;

  const pedagogicalTips = [
    style === 'Visual' 
      ? 'Usar mapas conceptuales y resaltar vocabulario clave con colores durante la sesión.'
      : style === 'Auditivo'
      ? 'Hacer énfasis en shadowing oral (repetir frases rítmicas) y audios nativos sin subtítulos.'
      : style === 'Kinestésico'
      ? 'Incorporar dinámicas de acción, situaciones de vida real y micro-debates interactivos.'
      : 'Presentar fórmulas gramaticales claras seguidas de práctica guiada de causa-efecto.',
    student.isDigitalPass
      ? 'Sugerirle metas semanales de unidades para que aproveche al máximo el Pase Digital autónomo.'
      : 'Verificar que practique con la Cyber Owl entre clases en vivo para afianzar el speaking.',
    `Meta del alumno: "${student.learningGoal || 'Fluidez comunicativa'}". Vincular los ejemplos de clase a su ámbito.`
  ];

  return {
    learningStyle: style,
    styleColor: styleColors[style],
    cognitivePace,
    superpower,
    growthEdge,
    coquitoDiagnosis,
    pedagogicalTips,
    engagementScore,
    recommendedModality: student.modality === 'online' ? 'Online Dinámico' : 'Presencial Inmersivo',
    weeklyEffortStatus
  };
}
