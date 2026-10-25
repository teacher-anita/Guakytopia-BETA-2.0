import React, { useState, useMemo, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Sparkles,
  Compass,
  GraduationCap,
  Clock,
  Shield,
  HelpCircle,
  Users,
  CheckCircle2,
  Calendar,
  Layers,
  Award,
  Zap,
  Globe2,
  Volume2,
  Lock,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Sliders,
  DollarSign,
  AlertTriangle,
  Lightbulb,
  Headphones,
  FileText,
  UserCheck,
  Flame,
  X,
  RotateCcw,
  Star
} from 'lucide-react';
import { AudienceTheme, Student } from '../types';
import { StudyThemeId } from './ThemeSelectorModal';
import { getThemeBannerClass } from '../utils/themeStyles';

interface GuakypediaViewProps {
  audienceTheme: AudienceTheme;
  currentStudent: Student | null;
  onNavigateToTab: (tab: string) => void;
  onOpenPricingModal: () => void;
  onOpenCouponModal: () => void;
  onOpenGuakypack?: () => void;
  studyTheme?: StudyThemeId;
}

type PillarId = 'intro' | 'modalities' | 'student_faq' | 'teachers' | 'troubleshooting' | 'glossary';

interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category: 'metodologia' | 'modalidades' | 'hourbag' | 'tecnico' | 'acceso';
  keywords: string[];
}

const FAQ_DATA: FaqItem[] = [
  {
    id: 33,
    question: '¿Necesito tener conocimientos de inglés para comenzar?',
    answer: 'No necesariamente. La ruta contempla niveles iniciales y la posibilidad de orientar tu punto de partida mediante una prueba diagnóstica opcional de 50 preguntas. Lo importante es comenzar desde un nivel que corresponda a tus conocimientos reales.',
    category: 'metodologia',
    keywords: ['principiante', 'cero', 'diagnostica', 'nivel inicial']
  },
  {
    id: 34,
    question: '¿Puedo utilizar Güakytopia si soy adulto?',
    answer: 'Sí. La experiencia contempla modalidades para estudiantes adultos y junior (12+ años), adaptando el currículo a contextos profesionales y de comunicación real.',
    category: 'metodologia',
    keywords: ['adultos', 'edad', 'junior', 'profesional']
  },
  {
    id: 35,
    question: '¿Puedo cambiar entre Adult y Junior?',
    answer: 'La interfaz contempla un selector Adult / Junior para adaptar el tema visual. Sin embargo, cambiar esa presentación no modifica automáticamente tu nivel académico, membresía ni progreso registrado.',
    category: 'metodologia',
    keywords: ['tema', 'visual', 'selector']
  },
  {
    id: 36,
    question: '¿Tengo que comprar clases para acceder a todos los recursos?',
    answer: 'No. El Pase Digital está orientado 100% al aprendizaje autónomo ($4.99/mes). Las clases en vivo son una alternativa adicional para quienes desean acompañamiento directo con un teacher.',
    category: 'modalidades',
    keywords: ['pase digital', 'autonomo', 'clases', 'precios']
  },
  {
    id: 37,
    question: '¿Puedo aprender solamente jugando en The Flock Arena?',
    answer: 'Puedes usar la Arena para practicar vocabulario de forma dinámica, pero los juegos no sustituyen la ruta académica de los libros SuperGoal y MegaGoal. Para avanzar curricularmente debes completar los quizzes y ejercicios del Classroom y Lab.',
    category: 'metodologia',
    keywords: ['arena', 'juegos', 'wheres guaky', 'scrabble', 'hangman']
  },
  {
    id: 38,
    question: '¿Puedo descargar los libros y estudiar por mi cuenta?',
    answer: 'El Pase Digital incluye acceso y recursos consultables o descargables en la Academic Library según tu membresía activa, organizados por nivel y unidad.',
    category: 'acceso',
    keywords: ['libros', 'descargar', 'pdf', 'library', 'supergoal']
  },
  {
    id: 39,
    question: '¿Puedo tomar clases y estudiar por mi cuenta al mismo tiempo?',
    answer: '¡Es la combinación recomendada! Tomar 2 horas de clase con tu teacher y dedicar 2 horas a resolver los 100 ejercicios del Lab y audios representa las 4 horas semanales ideales de inmersión.',
    category: 'modalidades',
    keywords: ['combinar', 'rutina', 'horas', 'teacher']
  },
  {
    id: 40,
    question: '¿Qué pasa si una unidad aparece bloqueada?',
    answer: 'Significa que falta completar un requisito previo (por ejemplo, el quiz de la unidad anterior con al menos 70%). Revisa el mensaje en pantalla, completa la actividad pendiente y el candado se abrirá.',
    category: 'metodologia',
    keywords: ['bloqueada', 'candado', 'quiz', '70%', 'requisito']
  },
  {
    id: 41,
    question: '¿Qué pasa si no apruebo un quiz?',
    answer: 'Revisa las explicaciones de la unidad, repasa los audios del Audio Lab e inténtalo nuevamente. Los quizzes requieren al menos 70% de aciertos para desbloquear la unidad siguiente.',
    category: 'metodologia',
    keywords: ['reprobar', 'intentos', 'quiz', 'repaso']
  },
  {
    id: 42,
    question: '¿Qué pasa si no puedo escuchar un audio?',
    answer: 'Comprueba el volumen de tu dispositivo, verifica que el navegador tenga permisos de audio y que no esté en modo silencio. Si el error persiste, avisa indicando el número de unidad y drill.',
    category: 'tecnico',
    keywords: ['audio', 'sonido', 'escuchar', 'lab']
  },
  {
    id: 43,
    question: '¿Qué pasa si no encuentro mi progreso?',
    answer: 'Comprueba haber iniciado sesión con el mismo correo y perfil. El progreso se almacena y sincroniza con tu cuenta en la nube. Revisa los indicadores de último guardado.',
    category: 'tecnico',
    keywords: ['progreso', 'guardado', 'perfil', 'nube']
  },
  {
    id: 44,
    question: '¿Qué pasa si no entiendo una actividad?',
    answer: 'Lee con calma la consigna y el ejemplo. Puedes usar la pista en inglés o consultar a Talk to Güaky en el chat de soporte para pedir una explicación conceptual adicional.',
    category: 'metodologia',
    keywords: ['dudas', 'ayuda', 'talk to guaky', 'pista']
  },
  {
    id: 45,
    question: '¿Qué pasa si necesito ayuda con una tarea?',
    answer: 'Si tienes clases, anota tu duda para revisarla con tu teacher en la siguiente sesión. Si tienes Pase Digital, apóyate en las explicaciones paso a paso de Classroom y en la retroalimentación inmediata del Lab.',
    category: 'metodologia',
    keywords: ['tarea', 'dudas', 'teacher', 'explicacion']
  },
  {
    id: 46,
    question: '¿Puedo cambiar una clase de la Hour Bag?',
    answer: 'Sí. La regla general es avisar con al menos 24 horas de antelación para que la hora retorne a tu bolsa. Además, cuentas con el beneficio exclusivo del "Escudo de las 12 horas" una vez al mes.',
    category: 'hourbag',
    keywords: ['hour bag', 'cancelar', 'cambiar', '24 horas', 'escudo']
  },
  {
    id: 47,
    question: '¿Puedo cambiar una clase de un plan fijo?',
    answer: 'En los planes fijos mensuales los horarios son estables y reservados. Las ausencias no se recuperan automáticamente, salvo casos contemplados en la política de suspensión temporal de hasta 15 días con aviso previo.',
    category: 'modalidades',
    keywords: ['plan fijo', 'inasistencia', 'suspension', 'recuperacion']
  },
  {
    id: 48,
    question: '¿Qué pasa si tengo una emergencia durante una clase?',
    answer: 'Si una clase de 60 minutos se interrumpe antes de completar los primeros 45 minutos porque debes retirarte por fuerza mayor, se compensa un bloque de 15 minutos (máximo 15 min por sesión afectada). Después del minuto 45 no aplica compensación.',
    category: 'hourbag',
    keywords: ['emergencia', 'interrupcion', '45 minutos', '15 minutos']
  },
  {
    id: 49,
    question: '¿Las horas de mi Hour Bag vencen?',
    answer: 'Sí. Cada compra de Hour Bag tiene una vigencia de 30 días calculada desde la fecha de compra (ejemplo: del 21 de octubre al 20 de noviembre). Debes agendar tus sesiones dentro de ese período.',
    category: 'hourbag',
    keywords: ['vigencia', 'vencimiento', '30 dias', 'mes']
  },
  {
    id: 50,
    question: '¿Qué hago si no encuentro un horario que me convenga?',
    answer: 'La disponibilidad de la Hour Bag depende de los bloques libres en la agenda y no tiene prioridad sobre los planes fijos. Si requieres un horario inamovible, te recomendamos contratar un Plan Fijo Mensual.',
    category: 'hourbag',
    keywords: ['horario', 'disponibilidad', 'agenda']
  },
  {
    id: 51,
    question: '¿Cómo sé cuál es la mejor modalidad para mí?',
    answer: 'Hazte cuatro preguntas clave: ¿Cuánto tiempo tienes? ¿Prefieres aprender solo o con teacher? ¿Estudias mejor individual o en pareja/squad? y ¿Necesitas horario fijo o flexibilidad total (Hour Bag)?',
    category: 'modalidades',
    keywords: ['elegir', 'decision', 'modalidad ideal']
  }
];

const GLOSSARY_TERMS = [
  { term: 'Academic Library', def: 'Biblioteca digital con los libros SuperGoal y MegaGoal, audios oficiales y guías descargables.' },
  { term: 'Agenda', def: 'Espacio interactivo para consultar horarios disponibles, agendar clases privadas y gestionar sesiones de Google Meet.' },
  { term: 'Assessment', def: 'Evaluación formal acumulativa de fin de nivel que mide las 8 habilidades lingüísticas (exige >80%).' },
  { term: 'Boss Fight', def: 'Evaluación especial gamificada al final de cada hito curricular con altas recompensas en puntos XP.' },
  { term: 'Classroom', def: 'Aula digital con la lección interactiva de la unidad dividida en 8 fases pedagógicas guiadas.' },
  { term: 'Cokitö', def: 'El cerebro pedagógico y motor cognitivo de Güakytopia que personaliza el aprendizaje del estudiante.' },
  { term: 'Daily Missions', def: 'Retos diarios de vocabulario y gramática para mantener la constancia y sumar XP a la racha.' },
  { term: 'Daily Streak', def: 'Contador de días continuos de práctica activa en la plataforma.' },
  { term: 'Drill', def: 'Ejercicio práctico puntual de fijación fonética, léxica o estructural.' },
  { term: 'Escudo de 12 Horas', def: 'Beneficio exclusivo de la Hour Bag que te permite reprogramar una sesión avisando con solo 12h de anticipación (1 vez por mes).' },
  { term: 'Flock', def: 'Comunidad de estudiantes y mentores de Güakytopia; también grupos abiertos de práctica y conversación.' },
  { term: 'Güaky', def: 'La guacamaya roja oficial y embajadora cultural de Güakytopia que acompaña todas tus misiones.' },
  { term: 'Güakytalkie (Lab)', def: 'Laboratorio de práctica interactiva con 100 drills graduados por unidad para speaking, listening y gramática.' },
  { term: 'Hour Bag', def: 'Bolsa prepagada de horas a $10/h (mínimo 6 hrs = $60) con validez mensual y reserva flexible.' },
  { term: 'Hub', def: 'Centro neurálgico que muestra tu Learning Pathway con los 12 niveles de Güakytopia.' },
  { term: 'Mastery', def: 'Porcentaje de dominio alcanzado en una habilidad tras completar los ejercicios del Lab.' },
  { term: 'Pase Digital', def: 'Membresía autónoma de $4.99/mes con acceso completo a los 12 niveles, audios, Lab y Arena sin clases en vivo obligatorias.' },
  { term: 'Seven Day Pass', def: 'Acceso de cortesía durante 7 días que incluye inducción los lunes (4pm o 7pm) y solicitud de clase modelo.' },
  { term: 'Unit Quiz', def: 'Prueba de control al final de cada unidad que exige un mínimo de 70% para desbloquear la siguiente.' },
  { term: 'XP (Experience Points)', def: 'Puntos de experiencia ganados en juegos, drills y misiones que determinan tu posición en la Weekly Leaderboard.' }
];

export const GuakypediaView: React.FC<GuakypediaViewProps> = ({
  audienceTheme,
  currentStudent,
  onNavigateToTab,
  onOpenPricingModal,
  onOpenCouponModal,
  onOpenGuakypack,
  studyTheme = 'official'
}) => {
  const isKids = audienceTheme === 'kids';

  // State
  const [activePillar, setActivePillar] = useState<PillarId>('intro');
  const [searchQuery, setSearchQuery] = useState('');
  const [faqCategory, setFaqCategory] = useState<'todas' | 'metodologia' | 'modalidades' | 'hourbag' | 'tecnico' | 'acceso'>('todas');
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(33);
  
  // Interactive Hour Bag Simulator state
  const [simulatedHours, setSimulatedHours] = useState<number>(6);
  const [shieldUsed, setShieldUsed] = useState<boolean>(false);

  // Modality Finder Quiz state
  const [quizHours, setQuizHours] = useState<'low' | 'mid' | 'high'>('mid');
  const [quizStyle, setQuizStyle] = useState<'solo' | 'teacher' | 'group'>('solo');
  const [quizSchedule, setQuizSchedule] = useState<'fixed' | 'flexible'>('flexible');

  // Day 1 Checklist (saved to localStorage)
  const [checklist, setChecklist] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('guakypedia_day1_checklist');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleChecklistItem = (id: string) => {
    const next = { ...checklist, [id]: !checklist[id] };
    setChecklist(next);
    localStorage.setItem('guakypedia_day1_checklist', JSON.stringify(next));
  };

  const checklistItems = [
    { id: 'step_home', title: 'Explora Home y conoce la filosofía', desc: 'Comprende el lema: Open the World. Start where you are. Keep going.' },
    { id: 'step_theme', title: 'Ajusta tu Ambiente de Estudio', desc: 'Configura el modo visual (Bajo estímulo, TDAH, o Pasteles) según tus sentidos.' },
    { id: 'step_pathway', title: 'Abre tu Hub y localiza tu Learning Pathway', desc: 'Identifica tu nivel activo y comprueba las unidades disponibles.' },
    { id: 'step_classroom', title: 'Entra a Classroom y revisa la lección de 8 partes', desc: 'Familiarízate con las fases guiadas y los audios nativos.' },
    { id: 'step_lab', title: 'Resuelve tus primeros 5 drills en el Lab Güakytalkie', desc: 'Experimenta la retroalimentación inmediata sin miedo a equivocarte.' },
    { id: 'step_arena', title: 'Juega una partida de Where\'s Güaky? en la Arena', desc: 'Descubre cómo afianzar vocabulario curricular en un wimmelbild ochentero.' },
    { id: 'step_induction', title: 'Asiste a la Inducción de los Lunes', desc: 'A las 4:00 p.m. o 7:00 p.m. vía Google Meet para resolver cualquier duda.' }
  ];

  const completedStepsCount = checklistItems.filter(item => checklist[item.id]).length;

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter(faq => {
      const matchesCat = faqCategory === 'todas' || faq.category === faqCategory;
      if (!matchesCat) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q) ||
        faq.keywords.some(k => k.toLowerCase().includes(q))
      );
    });
  }, [faqCategory, searchQuery]);

  // Modality Quiz Recommendation
  const recommendedModality = useMemo(() => {
    if (quizStyle === 'solo') {
      return {
        title: 'Pase Digital ($4.99/mes)',
        badge: '100% Recomendado para tu perfil',
        desc: 'Ideal para tu deseo de aprender de forma autónoma. Dispones de los 12 niveles, audios oficiales, Lab de 100 drills y juegos de la Arena a tu propio ritmo.',
        cta: 'Suscribirme al Pase Digital',
        action: () => onNavigateToTab('register')
      };
    }
    if (quizStyle === 'group') {
      return {
        title: 'Clases en Dúo o Squad Privado',
        badge: 'Máximo Ahorro & Aprendizaje Social',
        desc: 'Perfecto para compartir el costo entre amigos o pareja mientras reciben acompañamiento de un mentor en vivo.',
        cta: 'Organizar mi Squad / Dúo',
        action: onOpenPricingModal
      };
    }
    // Teacher
    if (quizSchedule === 'flexible') {
      return {
        title: 'Hour Bag ($10/hr · Mínimo 6 hrs = $60)',
        badge: 'Flexibilidad Total con Mentor',
        desc: 'Comprende horas prepagadas y agenda según tus semanas cambiantes. Incluye el Escudo de las 12 horas para imprevistos.',
        cta: 'Comprar Bolsa de Horas',
        action: onOpenPricingModal
      };
    }
    return {
      title: 'Plan Fijo Mensual (2, 3 o 4 hrs/semana)',
      badge: 'Estructura & Rutina Garantizada',
      desc: 'Horarios reservados fijos con tu mentor y la tarifa mensual más competitiva con descuento de compromiso.',
      cta: 'Ver Horarios y Planes Fijos',
      action: onOpenPricingModal
    };
  }, [quizHours, quizStyle, quizSchedule]);

  const pillars = [
    { id: 'intro', label: '1. Metodología & 12 Niveles', icon: GraduationCap },
    { id: 'modalities', label: '2. Modalidades, Precios & Hour Bag', icon: DollarSign },
    { id: 'student_faq', label: '3. FAQ & Rutinas de Alumnos', icon: HelpCircle },
    { id: 'teachers', label: '4. Manual para Teachers', icon: UserCheck },
    { id: 'troubleshooting', label: '5. Soporte & Solución de Problemas', icon: Shield },
    { id: 'glossary', label: '6. Glosario A-Z & Primer Día', icon: BookOpen }
  ] as const;

  return (
    <div className="w-full space-y-8 animate-fadeIn">
      
      {/* =========================================================================
          HERO BANNER: Güakypedia Guide to Güakytopia
          ========================================================================= */}
      <div className={`rounded-3xl p-6 sm:p-10 border shadow-2xl relative overflow-hidden transition-all ${getThemeBannerClass(studyTheme, isKids)}`}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <Compass className="w-3.5 h-3.5" />
                Guía Oficial • Güakypedia
              </span>
              <span className="text-[11px] font-bold text-teal-300 bg-teal-500/20 px-2.5 py-0.5 rounded-full border border-teal-400/30">
                11 Secciones Curriculares
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Bienvenido a la <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-teal-300 bg-clip-text text-transparent">Güakypedia</span> 🦜✨
            </h1>

            <p className="text-amber-200 font-mono text-xs sm:text-sm tracking-wide">
              «Open the World. Start where you are. Keep going.»
            </p>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
              La enciclopedia interactiva para descubrir qué es Güakytopia, cómo funciona nuestra metodología académica McGraw Hill, qué herramientas tienes a tu disposición y cómo diseñar una ruta de inglés viable y humana para tu vida.
            </p>

            {/* Quick action buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setActivePillar('modalities');
                  const el = document.getElementById('modality-calculator');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black rounded-xl text-xs transition-transform hover:scale-105 shadow-md flex items-center gap-2"
              >
                <Sliders className="w-4 h-4" />
                <span>Calcula tu Modalidad Ideal</span>
              </button>

              <button
                onClick={onOpenPricingModal}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-2"
              >
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Ver Tarifas & Pase Digital ($4.99)</span>
              </button>

              <button
                onClick={onOpenCouponModal}
                className="px-4 py-2.5 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 font-bold rounded-xl text-xs transition-colors flex items-center gap-2"
              >
                <Award className="w-4 h-4 text-amber-300" />
                <span>Seven Day Pass & Becas</span>
              </button>
            </div>
          </div>

          {/* Right: Güaky Ambassador Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/20 flex flex-col items-center text-center gap-3 shrink-0 w-full md:w-64">
            <div className="w-20 h-20 rounded-3xl bg-white p-2 border-2 border-amber-400 shadow-xl flex items-center justify-center animate-bounce">
              <img
                src="/guaky-mascota.png"
                alt="Güaky la Guacamaya Oficial"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-[10px] text-amber-300 font-black uppercase tracking-wider block">
                Tu Guía Oficial
              </span>
              <h3 className="text-sm font-black text-white">Güaky & Teacher Cokitö</h3>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                Sin memorizaciones al azar ni frustración: práctica con intención y avanza con empatía.
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar Across Entire Guakypedia */}
        <div className="mt-8 pt-6 border-t border-white/15">
          <div className="relative max-w-2xl">
            <Search className="w-5 h-5 text-amber-300 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar en la Güakypedia (ej: Hour Bag, SuperGoal, Escudo 12h, Pase Digital, Quizzes 70%)..."
              className="w-full pl-12 pr-10 py-3.5 bg-black/40 border border-white/25 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-400 backdrop-blur-xs transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick tags */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3 text-xs">
            <span className="text-[11px] text-slate-400 font-semibold mr-1">Atajos directos:</span>
            {[
              { label: 'Hour Bag & Escudo', pillar: 'modalities', query: 'Hour Bag' },
              { label: 'Pase Digital ($4.99)', pillar: 'modalities', query: 'Pase Digital' },
              { label: '12 Niveles & Módulos', pillar: 'intro', query: 'SuperGoal' },
              { label: 'Lab 100 Drills', pillar: 'intro', query: 'Lab' },
              { label: 'Seven Day Pass', pillar: 'student_faq', query: 'Seven Day Pass' },
              { label: 'Manual Teachers', pillar: 'teachers', query: 'Teachers' }
            ].map(chip => (
              <button
                key={chip.label}
                onClick={() => {
                  setActivePillar(chip.pillar as PillarId);
                  setSearchQuery(chip.query);
                }}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-slate-200 rounded-lg text-[11px] font-medium transition-colors border border-white/10"
              >
                #{chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          PILLAR SELECTOR TABS (STICKY HIERARCHICAL NAVIGATION)
          ========================================================================= */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md py-2 border-b border-slate-200">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {pillars.map(p => {
            const Icon = p.icon;
            const isActive = activePillar === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setActivePillar(p.id);
                  setSearchQuery('');
                }}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border ${
                  isActive
                    ? isKids
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-500 shadow-md scale-102 font-black'
                      : 'bg-teal-700 text-white border-teal-800 shadow-md scale-102 font-black'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-500'}`} />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          PILAR 1: METODOLOGÍA & LOS 12 NIVELES
          ========================================================================= */}
      {activePillar === 'intro' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Banner: ¿Qué es y qué NO es Güakytopia? */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Claridad Total y Transparencia Pedagógica</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black">
              ¿Qué es y qué no es Güakytopia?
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              Güakytopia es un entorno interactivo de aprendizaje de inglés que combina contenido académico editorial de McGraw Hill, práctica autónoma, gamificación, laboratorio de 100 drills y clases en vivo para las modalidades que las incluyen.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="bg-slate-800/90 border border-slate-700 p-5 rounded-2xl space-y-2">
                <span className="text-2xl">🎮</span>
                <h4 className="text-sm font-black text-white">¿Es solo una app de juegos?</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>No.</strong> La gamificación en The Flock Arena (Word Search, Scrabble, Hangman, Where's Güaky?) motiva y refuerza la racha, pero no sustituye el estudio estructurado de gramática, audios y lecciones académicas.
                </p>
              </div>

              <div className="bg-slate-800/90 border border-slate-700 p-5 rounded-2xl space-y-2">
                <span className="text-2xl">💻</span>
                <h4 className="text-sm font-black text-white">¿Es solo videoclases por Zoom?</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Tampoco.</strong> Las clases en vivo complementan la experiencia, pero cuentas con el Hub, Classroom, Audio Lab y 100 ejercicios por unidad para estudiar de forma asincrónica a tu ritmo.
                </p>
              </div>

              <div className="bg-slate-800/90 border border-slate-700 p-5 rounded-2xl space-y-2">
                <span className="text-2xl">⏰</span>
                <h4 className="text-sm font-black text-white">¿Debo usar todo a la vez?</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Para nada.</strong> Si tienes un teacher, priorizas lo que él te indique. Si estudias con Pase Digital, sigues la ruta de la plataforma. La meta es practicar con intención, no pasar horas al azar.
                </p>
              </div>
            </div>
          </div>

          {/* Las 8 Habilidades Lingüísticas */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block">
                  Marco Pedagógico Integral
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  Las 8 Habilidades Lingüísticas
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Conectadas entre sí para lograr fluidez real
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {[
                { title: 'Reading', tag: 'Comprensión Lectora', icon: '📖', desc: 'Identificar ideas principales y deducir significado por contexto.' },
                { title: 'Writing', tag: 'Expresión Escrita', icon: '✍️', desc: 'Construir oraciones, párrafos y textos con precisión formal.' },
                { title: 'Listening', tag: 'Comprensión Auditiva', icon: '🎧', desc: 'Reconocer sonidos nativos, acentos y vocabulario en audios reales.' },
                { title: 'Speaking', tag: 'Expresión Oral', icon: '🗣️', desc: 'Comunicar ideas con soltura, responder preguntas y debatir.' },
                { title: 'Vocabulary', tag: 'Léxico en Contexto', icon: '🔤', desc: 'Aprender palabras dentro de situaciones funcionales, no en listas aisladas.' },
                { title: 'Grammar', tag: 'Estructuras Claras', icon: '🧩', desc: 'Mecanismos que dan coherencia al mensaje sin memorizaciones vacías.' },
                { title: 'Pronunciation', tag: 'Fonética & Acento', icon: '🎯', desc: 'Ejercicios de producción oral para ser entendido con claridad global.' },
                { title: 'Communication', tag: 'Uso Funcional', icon: '🤝', desc: 'Transmitir mensajes y resolver situaciones reales del mundo actual.' }
              ].map(skill => (
                <div key={skill.title} className="p-3.5 bg-slate-50 hover:bg-teal-50/50 rounded-2xl border border-slate-200 transition-colors space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{skill.icon}</span>
                    <strong className="text-xs font-black text-slate-900">{skill.title}</strong>
                  </div>
                  <span className="text-[10px] text-teal-700 font-bold block">{skill.tag}</span>
                  <p className="text-[11px] text-slate-600 leading-snug">{skill.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* La Ruta Curricular de 12 Niveles en 4 Módulos */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">
                Metodología McGraw Hill (SuperGoal & MegaGoal)
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                La Ruta de los 12 Niveles de Güakytopia
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Distribuida en 4 módulos progresivos de 3 niveles cada uno. Para desbloquear cada unidad se requiere mínimo <strong>70% en los Unit Quizzes</strong>, y más de <strong>80% en la evaluación general de nivel</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  mod: 'Módulo 1',
                  name: 'Fundamentos Esenciales',
                  levels: 'Niveles I – III',
                  book: 'SuperGoal 1 – 3',
                  cefr: 'Meta: A1+',
                  badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                  desc: 'Bases para entender y expresarse, vocabulario inicial, to be, posesivos, útiles escolares y rutinas diarias.'
                },
                {
                  mod: 'Módulo 2',
                  name: 'Consolidación & Independencia',
                  levels: 'Niveles IV – VI',
                  book: 'SuperGoal 4 – 6',
                  cefr: 'Meta: B1 / B1+',
                  badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
                  desc: 'Uso del inglés con autonomía, tiempos pasados y futuros, descripciones complejas y resolución de problemas.'
                },
                {
                  mod: 'Módulo 3',
                  name: 'Fluidez Avanzada & Debate',
                  levels: 'Niveles VII – IX',
                  book: 'MegaGoal 1 – 3',
                  cefr: 'Meta: B2',
                  badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
                  desc: 'Argumentación, debate, matices socioculturales y comprensión de textos periodísticos y académicos.'
                },
                {
                  mod: 'Módulo 4',
                  name: 'Maestría Cognitiva & Profesional',
                  levels: 'Niveles X – XII',
                  book: 'MegaGoal 4 – 6',
                  cefr: 'Meta: B2+ / C1',
                  badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
                  desc: 'Inglés para liderazgo, comunicación ejecutiva internacional, redacción estratégica y debate crítico.'
                }
              ].map(m => (
                <div key={m.mod} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black uppercase text-slate-500">{m.mod}</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${m.badgeColor}`}>
                        {m.cefr}
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-slate-900">{m.name}</h4>
                    <span className="text-xs font-bold text-teal-700 block mt-0.5">{m.levels} · {m.book}</span>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{m.desc}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Quizzes: &ge;70%</span>
                    <span>Nivel: &gt;80%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Diagnostics note */}
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3 text-xs text-amber-950">
              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>¿Ya estudiaste inglés anteriormente?</strong> No tienes que empezar de cero obligatoriamente. Puedes tomar la <strong>Prueba Diagnóstica de 50 preguntas</strong> para identificar tu punto de partida real y comenzar en el nivel que necesitas consolidar.
              </div>
            </div>
          </div>

          {/* Tour por los 8 Espacios de la Plataforma */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">
                Navegación Intuitiva
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Los 8 Espacios de la Experiencia Güakytopia
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { tab: 'landing', name: 'Home', icon: '🏠', desc: 'Punto de partida, visión general y acceso a las modalidades de estudio.' },
                { tab: 'calendar', name: 'Agenda', icon: '📅', desc: 'Consulta de horarios disponibles, reserva de clases en vivo y saldo de horas.' },
                { tab: 'duolingo', name: 'The Flock Arena', icon: '🎮', desc: 'Juegos interactivos (Word Search, Scrabble, Hangman, Where\'s Güaky?), XP y ranking.' },
                { tab: 'pathway', name: 'Hub (Learning Pathway)', icon: '🧭', desc: 'Mapa curricular de 12 niveles, unidades desbloqueadas y evaluaciones.' },
                { tab: 'classroom', name: 'Classroom', icon: '📖', desc: 'Aula interactiva con lecciones guiadas de 8 fases, Google Meet y audios.' },
                { tab: 'library', name: 'Academic Library', icon: '📚', desc: 'Libros oficiales SuperGoal y MegaGoal, audios completos y guías.' },
                { tab: 'lab', name: 'Lab (Güakytalkie)', icon: '🧪', desc: 'Laboratorio de práctica con 100 drills interactivos graduados por unidad.' },
                { tab: 'chatbot', name: 'Cokitö & Talk to Güaky', icon: '🦜', desc: 'Inteligencia pedagógica y chat conversacional de apoyo 24/7.' }
              ].map(s => (
                <button
                  key={s.name}
                  onClick={() => onNavigateToTab(s.tab)}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/30 transition-all text-left space-y-1.5 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{s.icon}</span>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 transition-colors" />
                  </div>
                  <h4 className="text-xs font-black text-slate-900 group-hover:text-teal-900">{s.name}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{s.desc}</p>
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          PILAR 2: MODALIDADES, PRECIOS & SIMULADOR DE HOUR BAG
          ========================================================================= */}
      {activePillar === 'modalities' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Matriz de Modalidades */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div>
              <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block">
                Flexibilidad Real
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Las 5 Modalidades de Aprendizaje
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Elige la forma de estudiar que mejor se adapte a tu presupuesto, disponibilidad y estilo personal.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* 1. Pase Digital */}
              <div className="p-5 rounded-3xl border-2 border-amber-400 bg-gradient-to-b from-amber-50/60 to-white flex flex-col justify-between space-y-4 shadow-sm relative overflow-hidden">
                <span className="absolute top-3 right-3 text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full">
                  Lanzamiento
                </span>
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-700 flex items-center justify-center text-xl font-bold">
                    🌴
                  </div>
                  <h4 className="text-base font-black text-slate-900">Pase Digital (Autónomo)</h4>
                  <div className="text-xl font-black text-slate-900">
                    US$4.99 <span className="text-xs text-slate-500 font-normal">/ mes</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Para personas disciplinadas que desean aprender por su cuenta sin contratar clases en vivo obligatorias.
                  </p>
                  <ul className="text-xs text-slate-700 space-y-1.5 pt-1">
                    <li className="flex items-center gap-1.5">✓ 12 niveles curriculares desbloqueables</li>
                    <li className="flex items-center gap-1.5">✓ Classroom con 8 secciones guiadas</li>
                    <li className="flex items-center gap-1.5">✓ Lab Güakytalkie con 100 drills/unidad</li>
                    <li className="flex items-center gap-1.5">✓ The Flock Arena & retiras XP</li>
                  </ul>
                </div>
                <button
                  onClick={() => onNavigateToTab('register')}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors text-center"
                >
                  Comenzar con Pase Digital
                </button>
              </div>

              {/* 2. Clases Individuales */}
              <div className="p-5 rounded-3xl border border-slate-200 bg-white flex flex-col justify-between space-y-4 shadow-sm">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center text-xl font-bold">
                    🧑‍🏫
                  </div>
                  <h4 className="text-base font-black text-slate-900">Clases Individuales (1-on-1)</h4>
                  <div className="text-sm font-bold text-teal-800">
                    Intensidades: 2, 3, 4 o 6 hrs / semana
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Acompañamiento directo y exclusivo con tu mentor certificado para corregir fonética, speaking y gramática.
                  </p>
                  <ul className="text-xs text-slate-700 space-y-1.5 pt-1">
                    <li className="flex items-center gap-1.5">✓ Plan Fijo Mensual (horario reservado)</li>
                    <li className="flex items-center gap-1.5">✓ Pago Semanal disponible</li>
                    <li className="flex items-center gap-1.5">✓ Recomendación: 4 hrs totales / semana</li>
                  </ul>
                </div>
                <button
                  onClick={onOpenPricingModal}
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs transition-colors text-center"
                >
                  Ver Tarifas Individuales
                </button>
              </div>

              {/* 3. Clases en Dúo */}
              <div className="p-5 rounded-3xl border border-slate-200 bg-white flex flex-col justify-between space-y-4 shadow-sm">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center text-xl font-bold">
                    👥
                  </div>
                  <h4 className="text-base font-black text-slate-900">Clases en Dúo (2 Alumnos)</h4>
                  <div className="text-sm font-bold text-blue-800">
                    Costo compartido entre dos personas
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Para amigos, parejas o familiares que inician en un nivel compatible y se comprometen a asistir juntos.
                  </p>
                  <ul className="text-xs text-slate-700 space-y-1.5 pt-1">
                    <li className="flex items-center gap-1.5">✓ Fracción del precio individual</li>
                    <li className="flex items-center gap-1.5">✓ Dinámica colaborativa de Pair Work</li>
                    <li className="flex items-center gap-1.5">✓ Requiere compromiso mutuo</li>
                  </ul>
                </div>
                <button
                  onClick={onOpenPricingModal}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors text-center"
                >
                  Tarifas en Dúo
                </button>
              </div>

              {/* 4. Squads Privados */}
              <div className="p-5 rounded-3xl border border-slate-200 bg-white flex flex-col justify-between space-y-4 shadow-sm">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center text-xl font-bold">
                    🛡️
                  </div>
                  <h4 className="text-base font-black text-slate-900">Squads Privados (3 a 4 pax)</h4>
                  <div className="text-sm font-bold text-indigo-800">
                    Grupo cerrado creado por ti
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Organiza un grupo con tus compañeros de trabajo o amigos con metas comunes dividiendo la inversión total.
                  </p>
                  <ul className="text-xs text-slate-700 space-y-1.5 pt-1">
                    <li className="flex items-center gap-1.5">✓ Tarifa súper económica por persona</li>
                    <li className="flex items-center gap-1.5">✓ Ambiente familiar y seguro</li>
                    <li className="flex items-center gap-1.5">✓ Mismas metas y nivel inicial</li>
                  </ul>
                </div>
                <button
                  onClick={onOpenPricingModal}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors text-center"
                >
                  Cotizar Squad Privado
                </button>
              </div>

              {/* 5. Flocks de Conversación */}
              <div className="p-5 rounded-3xl border border-slate-200 bg-white flex flex-col justify-between space-y-4 shadow-sm">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center text-xl font-bold">
                    🪶
                  </div>
                  <h4 className="text-base font-black text-slate-900">Flocks de Conversación</h4>
                  <div className="text-sm font-bold text-purple-800">
                    Grupos abiertos temáticos
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    No necesitas armar un grupo propio. Incorpórate a sesiones de debate sobre cultura, viajes y negocios.
                  </p>
                  <ul className="text-xs text-slate-700 space-y-1.5 pt-1">
                    <li className="flex items-center gap-1.5">✓ Práctica fluida de speaking</li>
                    <li className="flex items-center gap-1.5">✓ Modera un Teacher certificado</li>
                    <li className="flex items-center gap-1.5">✓ Acceso con horas prepagadas</li>
                  </ul>
                </div>
                <button
                  onClick={() => onNavigateToTab('calendar')}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors text-center"
                >
                  Explorar Sesiones de Flock
                </button>
              </div>

            </div>
          </div>

          {/* SIMULADOR INTERACTIVO DE HOUR BAG & REGLAS DE ORO */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl border border-indigo-500/30">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-[11px] font-black uppercase text-amber-400 tracking-wider block">
                  Modalidad de Horas Prepagadas Flexibles
                </span>
                <h3 className="text-2xl font-black text-white flex items-center gap-2">
                  <span>Hour Bag — Tu Bolsa Personal</span>
                  <span className="text-xl">💼⏱️</span>
                </h3>
              </div>
              <span className="text-xs bg-amber-400 text-slate-950 font-black px-3 py-1 rounded-full">
                Tarifa Plana: US$10 / hora
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              Diseñada para quienes viajan frecuentemente, tienen turnos rotativos o prefieren reservar sus clases semana a semana sin comprometerse con un horario fijo mensual.
            </p>

            {/* Interactive Calculator Slider */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  ¿Cuántas horas deseas simular en tu bolsa? (Mínimo: 6 horas)
                </label>
                <div className="text-right">
                  <span className="text-2xl font-black text-white">{simulatedHours} Horas</span>
                  <span className="text-xs text-emerald-400 font-bold block">= US${simulatedHours * 10}</span>
                </div>
              </div>

              <input
                type="range"
                min="6"
                max="24"
                step="1"
                value={simulatedHours}
                onChange={(e) => setSimulatedHours(parseInt(e.target.value, 10))}
                className="w-full accent-amber-400 cursor-pointer h-2 bg-white/20 rounded-lg"
              />

              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>6 hrs ($60)</span>
                <span>8 hrs ($80)</span>
                <span>12 hrs ($120)</span>
                <span>16 hrs ($160)</span>
                <span>24 hrs ($240)</span>
              </div>
            </div>

            {/* LAS 4 REGLAS DE ORO DE LA HOUR BAG */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                <span className="text-xl">🗓️</span>
                <h4 className="text-xs font-black text-amber-300">Vigencia Mensual (30 días)</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Calculada desde la fecha de compra (ejemplo: comprada el 21 de octubre, vence al finalizar el 20 de noviembre). No se acumula automáticamente.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                <span className="text-xl">⏱️</span>
                <h4 className="text-xs font-black text-amber-300">Regla de las 24 Horas</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Para cancelar o reprogramar una clase sin perder la hora, debes avisar con al menos 24 horas de antelación en el sistema.
                </p>
              </div>

              {/* El Escudo de las 12 Horas con botón interactivo */}
              <div className="bg-amber-400/10 border-2 border-amber-400/60 rounded-2xl p-4 space-y-2 relative">
                <span className="text-xl">🛡️</span>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-amber-300">Escudo de las 12h</h4>
                  <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-1.5 rounded-full">1x al mes</span>
                </div>
                <p className="text-[11px] text-slate-200 leading-relaxed">
                  Excepción mensual para imprevistos: te permite reprogramar avisando con solo 12 horas.
                </p>
                <button
                  onClick={() => setShieldUsed(!shieldUsed)}
                  className={`mt-1 text-[10px] font-bold px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
                    shieldUsed 
                      ? 'bg-rose-500 text-white' 
                      : 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                  }`}
                >
                  <Shield className="w-3 h-3" />
                  <span>{shieldUsed ? 'Escudo activado este mes (Usado)' : 'Simular activar Escudo'}</span>
                </button>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                <span className="text-xl">⚡</span>
                <h4 className="text-xs font-black text-amber-300">Regla de los 45/15 min</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Si debes retirarte antes de los primeros 45 minutos por fuerza mayor, se compensa un bloque de 15 minutos en tu bolsa.
                </p>
              </div>

            </div>
          </div>

          {/* QUIZ INTERACTIVO: ENCUENTRA TU MODALIDAD IDEAL */}
          <div id="modality-calculator" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">
                Herramienta de Decisión Rápida
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Calcula tu Modalidad Ideal en 3 Clics
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Question 1 */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 block">
                  1. ¿Cuánto tiempo tienes para dedicar a la semana?
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'low', label: '1 a 2 horas (muy ajustado)' },
                    { id: 'mid', label: '3 a 4 horas (rutina ideal)' },
                    { id: 'high', label: '6+ horas (intensivo)' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setQuizHours(opt.id as any)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        quizHours === opt.id
                          ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold ring-1 ring-teal-500'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2 */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 block">
                  2. ¿Prefieres aprender solo o con acompañamiento?
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'solo', label: 'Solo a mi propio ritmo (autónomo)' },
                    { id: 'teacher', label: 'Con un mentor 1-on-1 dedicado' },
                    { id: 'group', label: 'En pareja (Dúo) o grupo de amigos' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setQuizStyle(opt.id as any)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        quizStyle === opt.id
                          ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold ring-1 ring-teal-500'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3 */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 block">
                  3. ¿Cómo es tu disponibilidad de horarios?
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'fixed', label: 'Fija y estable todas las semanas' },
                    { id: 'flexible', label: 'Variable, viajo o tengo turnos rotativos' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setQuizSchedule(opt.id as any)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        quizSchedule === opt.id
                          ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold ring-1 ring-teal-500'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Recommendation Result Card */}
            <div className="p-6 bg-gradient-to-r from-teal-900 to-slate-900 text-white rounded-2xl border border-teal-500/40 flex flex-col sm:flex-row items-center justify-between gap-5 animate-slideUp">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                  {recommendedModality.badge}
                </span>
                <h4 className="text-lg sm:text-xl font-black text-white">
                  {recommendedModality.title}
                </h4>
                <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                  {recommendedModality.desc}
                </p>
              </div>

              <button
                onClick={recommendedModality.action}
                className="px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black rounded-xl text-xs transition-transform hover:scale-105 shadow-md shrink-0"
              >
                {recommendedModality.cta} &rarr;
              </button>
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          PILAR 3: FAQ DE ALUMNOS & RUTINAS DE ESTUDIO
          ========================================================================= */}
      {activePillar === 'student_faq' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Rutinas recomendadas */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div>
              <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block">
                Método de Estudio Efectivo
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Rutinas Recomendadas Paso a Paso
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Rutina con Teacher */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🧑‍🏫</span>
                  <h4 className="text-sm font-black text-slate-900">Si tomas clases con un Teacher</h4>
                </div>
                
                <div className="space-y-2.5 text-xs text-slate-700">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <strong className="text-teal-700 block mb-0.5">1. Antes de la clase:</strong>
                    Revisa en la Agenda fecha y enlace de Google Meet. Identifica las páginas del Student Book en la Library y anota dudas de la sesión previa.
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <strong className="text-teal-700 block mb-0.5">2. Durante la clase:</strong>
                    Participa activamente, formula preguntas y realiza los ejercicios de Pair Work y Speaking sin temor a equivocarte.
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <strong className="text-teal-700 block mb-0.5">3. Después de la clase:</strong>
                    Ingresa al Lab Güakytalkie para resolver los drills correspondientes y afianzar la pronunciación en el Audio Lab.
                  </div>
                </div>
              </div>

              {/* Rutina Pase Digital Autónomo */}
              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🌴</span>
                  <h4 className="text-sm font-black text-amber-950">Si estudias con el Pase Digital ($4.99)</h4>
                </div>

                <div className="space-y-2.5 text-xs text-slate-700">
                  <div className="p-2.5 bg-white rounded-xl border border-amber-200">
                    <strong className="text-amber-800 block mb-0.5">Paso 1: Hub & Learning Pathway</strong>
                    Ubica tu nivel activo y abre la unidad correspondiente en Classroom.
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-amber-200">
                    <strong className="text-amber-800 block mb-0.5">Paso 2: Lección en 8 Secciones</strong>
                    Lee las explicaciones guiadas, escucha los audios y responde las actividades interactivas del Student Book.
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-amber-200">
                    <strong className="text-amber-800 block mb-0.5">Paso 3: Lab & Unit Quiz (70%)</strong>
                    Completa los drills del Lab Güakytalkie y presenta el quiz para desbloquear tu siguiente unidad.
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Inducción Seven Day Pass */}
          <div className="p-6 bg-gradient-to-r from-indigo-900 to-purple-950 text-white rounded-3xl border border-indigo-400/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Award className="w-4 h-4" /> Seven Day Pass • Acceso de Inducción
              </span>
              <h4 className="text-xl font-black">
                Inducción Oficial los Lunes (Google Meet)
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                Todos los lunes a las <strong>4:00 p.m.</strong> y <strong>7:00 p.m.</strong> realizamos sesiones guiadas en vivo para nuevos exploradores. Tras la inducción puedes solicitar tu <strong>clase modelo de cortesía</strong>.
              </p>
            </div>
            <button
              onClick={onOpenCouponModal}
              className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs transition-transform hover:scale-105 shadow-md shrink-0"
            >
              Canjear Seven Day Pass
            </button>
          </div>

          {/* Acordeón de FAQs Filtrables */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block">
                  Banco de Respuestas Oficiales
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  Preguntas Frecuentes de Alumnos
                </h3>
              </div>

              {/* Categorías */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {[
                  { id: 'todas', label: 'Todas' },
                  { id: 'metodologia', label: 'Metodología & Quizzes' },
                  { id: 'modalidades', label: 'Modalidades & Clases' },
                  { id: 'hourbag', label: 'Hour Bag' },
                  { id: 'tecnico', label: 'Soporte Técnico' }
                ].map(c => (
                  <button
                    key={c.id}
                    onClick={() => setFaqCategory(c.id as any)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                      faqCategory === c.id
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="divide-y divide-slate-100">
              {filteredFaqs.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No se encontraron preguntas con ese criterio de búsqueda.
                </div>
              ) : (
                filteredFaqs.map(faq => {
                  const isOpen = expandedFaqId === faq.id;
                  return (
                    <div key={faq.id} className="py-3.5 transition-colors">
                      <button
                        onClick={() => setExpandedFaqId(isOpen ? null : faq.id)}
                        className="w-full flex items-center justify-between text-left gap-4 group"
                      >
                        <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                          {faq.question}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-teal-600' : ''}`} />
                      </button>

                      {isOpen && (
                        <div className="mt-2.5 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 leading-relaxed animate-fadeIn">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          PILAR 4: MANUAL DE OPERACIONES PARA TEACHERS (THE FLOCK MENTORS)
          ========================================================================= */}
      {activePillar === 'teachers' && (
        <div className="space-y-8 animate-fadeIn">
          
          <div className="bg-gradient-to-r from-teal-950 via-slate-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl border border-teal-500/30">
            <span className="text-[11px] font-black uppercase text-amber-300 tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-4 h-4" /> The Flock Mentors • Campus Güakytopia
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">
              Manual Operativo & Pedagógico para Teachers
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              Nuestra misión docente combina el rigor académico con la empatía humana. El teacher en Güakytopia no es un simple locutor: es un facilitador de confianza comunicativa y agilidad fonética.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Las 8 Fases de la Clase en Classroom */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-teal-600" />
                <span>Estructura de la Lección en Classroom</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cada unidad académica se organiza en 8 momentos secuenciales para garantizar el desarrollo equilibrado de las 8 habilidades:
              </p>
              
              <ol className="space-y-2 text-xs text-slate-700 list-decimal list-inside font-medium">
                <li className="p-2 bg-slate-50 rounded-xl"><strong>Listen and Discuss:</strong> Inmersión auditiva inicial y contexto temático.</li>
                <li className="p-2 bg-slate-50 rounded-xl"><strong>Pair Work:</strong> Práctica interactiva en parejas o estudiante-mentor.</li>
                <li className="p-2 bg-slate-50 rounded-xl"><strong>Grammar:</strong> Deducción estructural guiada y formulación de reglas.</li>
                <li className="p-2 bg-slate-50 rounded-xl"><strong>Possessives & Syntax:</strong> Ejercicios de precisión morfosintáctica.</li>
                <li className="p-2 bg-slate-50 rounded-xl"><strong>Pronunciation:</strong> Modelado fonético del acento y ritmo del inglés.</li>
                <li className="p-2 bg-slate-50 rounded-xl"><strong>Listening Quiz:</strong> Control de comprensión oral en tiempo real.</li>
                <li className="p-2 bg-slate-50 rounded-xl"><strong>Conversation:</strong> Juego de roles funcional y speaking libre.</li>
                <li className="p-2 bg-slate-50 rounded-xl"><strong>Reading & Vocab:</strong> Texto formativo y reflexión metacognitiva.</li>
              </ol>
            </div>

            {/* Protocolo de Sesiones & Cokitö Brain */}
            <div className="space-y-6">
              
              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-sm">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Acompañamiento con Cokitö Brain</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Antes de cada sesión, consulta el perfil del estudiante en la plataforma para verificar:
                </p>
                <ul className="text-xs text-slate-700 space-y-1.5">
                  <li className="flex items-center gap-1.5">✓ <strong>Drills completados en el Lab:</strong> Qué ejercicios le costaron más.</li>
                  <li className="flex items-center gap-1.5">✓ <strong>Racha y XP:</strong> Nivel de constancia semanal del estudiante.</li>
                  <li className="flex items-center gap-1.5">✓ <strong>Notas pedagógicas previas:</strong> Puntos de pronunciación a reforzar.</li>
                </ul>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-sm">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>Políticas de Asistencia y Puntualidad</span>
                </h3>
                <ul className="text-xs text-slate-700 space-y-2">
                  <li className="p-2.5 bg-slate-50 rounded-xl">
                    <strong>Puntualidad Meet:</strong> El mentor debe conectarse al enlace de Google Meet 3 minutos antes de la hora fijada.
                  </li>
                  <li className="p-2.5 bg-slate-50 rounded-xl">
                    <strong>Tolerancia de espera:</strong> Se aguarda hasta 15 minutos en sala. Si el alumno no asiste, se registra inasistencia según el tipo de plan.
                  </li>
                  <li className="p-2.5 bg-slate-50 rounded-xl">
                    <strong>Reporte de Interrupción:</strong> Si ocurre una falla antes de los 45 min, se deja constancia para abonar el bloque de 15 min en la Hour Bag.
                  </li>
                </ul>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          PILAR 5: SOPORTE & RESOLUCIÓN DE PROBLEMAS TÉCNICOS
          ========================================================================= */}
      {activePillar === 'troubleshooting' && (
        <div className="space-y-8 animate-fadeIn">
          
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
            <div>
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block">
                Soluciones Inmediatas
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Guía Rápida de Resolución de Problemas Técnicos
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {[
                {
                  problem: 'No puedo escuchar el audio en el Lab o Classroom',
                  solution: 'Verifica el volumen de tu equipo, confirma que la pestaña no esté silenciada en el navegador y comprueba si tu navegador permite la reproducción automática de sonido.'
                },
                {
                  problem: 'Una unidad aparece bloqueada con candado',
                  solution: 'Debes haber completado la unidad anterior y alcanzado al menos el 70% en su Unit Quiz. Si ya aprobaste el quiz y sigue bloqueada, recarga la página o cierra y vuelve a abrir sesión.'
                },
                {
                  problem: 'No veo mi progreso guardado del Lab de 100 drills',
                  solution: 'Confirma que estás usando tu cuenta oficial y no el perfil de invitado (guest). El progreso se sincroniza con tu correo en la nube automáticamente.'
                },
                {
                  problem: 'Problemas para conectar a Google Meet con el Teacher',
                  solution: 'Asegúrate de tener sesión iniciada en Google con la misma cuenta. Si la cámara o micrófono no funcionan, revisa los permisos de privacidad en el candado de la barra de direcciones.'
                }
              ].map(item => (
                <div key={item.problem} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <h4 className="text-xs font-black text-rose-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{item.problem}</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>Solución:</strong> {item.solution}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Cómo pedir ayuda correctamente */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl border border-white/10">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              <span>Protocolo de Soporte Efectivo</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white">
              ¿Cómo solicitar ayuda al equipo de soporte?
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Para resolver cualquier incidencia en tiempo récord, cuando nos contactes intenta incluir los siguientes detalles:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 bg-white/10 rounded-2xl border border-white/10 text-xs space-y-1">
                <span className="font-bold text-amber-300 block">1. Sección exacta</span>
                <span className="text-slate-300">Ej: "Lab Güakytalkie, Drill 45" o "Classroom Unidad 1".</span>
              </div>
              <div className="p-3.5 bg-white/10 rounded-2xl border border-white/10 text-xs space-y-1">
                <span className="font-bold text-amber-300 block">2. Acción que realizabas</span>
                <span className="text-slate-300">Qué botón presionaste o qué intentabas enviar.</span>
              </div>
              <div className="p-3.5 bg-white/10 rounded-2xl border border-white/10 text-xs space-y-1">
                <span className="font-bold text-amber-300 block">3. Mensaje de error</span>
                <span className="text-slate-300">El texto exacto de alerta que apareció en pantalla.</span>
              </div>
              <div className="p-3.5 bg-white/10 rounded-2xl border border-white/10 text-xs space-y-1">
                <span className="font-bold text-amber-300 block">4. Captura limpia</span>
                <span className="text-slate-300">Sin datos de contraseñas ni números de pago sensibles.</span>
              </div>
            </div>

            <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-2xl text-xs text-rose-200 font-bold">
              🔒 <strong>Regla de oro de seguridad:</strong> El equipo de Güakytopia NUNCA te solicitará tu contraseña por ningún canal. Jamás la compartas.
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          PILAR 6: GLOSARIO A-Z & CHECKLIST DE TU PRIMER DÍA
          ========================================================================= */}
      {activePillar === 'glossary' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* CHECKLIST DE TU PRIMER DÍA */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-slate-950 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider bg-slate-950 text-amber-400 px-3 py-1 rounded-full inline-block mb-1">
                  Onboarding Guiado
                </span>
                <h3 className="text-2xl sm:text-3xl font-black">
                  Tu Primer Día en Güakytopia 🌴🎒
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold block">Progreso de Inducción</span>
                <span className="text-xl font-black">{completedStepsCount} de {checklistItems.length} completados</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-900 font-medium max-w-2xl">
              No tienes que aprenderte toda la plataforma en un día. Sigue esta lista sencilla para familiarizarte con tus herramientas:
            </p>

            {/* Checklist items */}
            <div className="space-y-2 pt-1">
              {checklistItems.map(item => {
                const isChecked = Boolean(checklist[item.id]);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleChecklistItem(item.id)}
                    className={`w-full p-3.5 rounded-2xl text-left transition-all flex items-start gap-3 border ${
                      isChecked
                        ? 'bg-white text-slate-900 border-white shadow-xs font-semibold'
                        : 'bg-white/80 hover:bg-white text-slate-800 border-white/40'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${
                      isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-400 bg-white'
                    }`}>
                      {isChecked && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className={`text-xs font-black ${isChecked ? 'line-through text-slate-500' : 'text-slate-950'}`}>
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DICCIONARIO RÁPIDO A-Z */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block">
                  Vocabulario de la Plataforma
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  Diccionario Rápido Güakytopia A-Z
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {GLOSSARY_TERMS.length} Términos Clave
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {GLOSSARY_TERMS.map(t => (
                <div key={t.term} className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 transition-colors space-y-1">
                  <strong className="text-xs font-black text-teal-900 block">{t.term}</strong>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{t.def}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          FOOTER / CIERRE: YOUR JOURNEY, YOUR PROGRESS
          ========================================================================= */}
      <div className="rounded-3xl p-6 sm:p-8 bg-slate-900 text-white border border-slate-800 text-center space-y-3">
        <h4 className="text-lg font-black bg-gradient-to-r from-amber-300 via-orange-300 to-teal-300 bg-clip-text text-transparent">
          Open the World. Start where you are. Keep going.
        </h4>
        <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
          Tu punto de partida no define hasta dónde puedes llegar. Lo importante es identificarlo, comenzar hoy y seguir avanzando junto a nuestro Flock.
        </p>
        <span className="text-[11px] text-slate-500 font-mono block">
          © 2026 Güakytopia • Güakypedia Oficial · Campus Digital
        </span>
      </div>

    </div>
  );
};
