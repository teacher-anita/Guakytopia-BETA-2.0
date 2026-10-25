import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  ExternalLink, 
  RotateCcw, 
  Minimize2, 
  Maximize2,
  Bookmark,
  Brain,
  ChevronRight
} from 'lucide-react';
import { OFFICIAL_PAGO_MOVIL } from '../services/currencyService';
import { Student, AudienceTheme } from '../types';
import { User } from 'firebase/auth';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  showWhatsAppButton?: boolean;
}

export interface GuakyChatbotProps {
  teacherWhatsAppUsername?: string;
  studentName?: string;
  currentStudent?: Student | null;
  user?: User | null;
  audienceTheme?: AudienceTheme;
  activeTab?: string;
  onNavigateToTab?: (tab: string) => void;
  onOpenGuakypack?: () => void;
}

// Adaptive Greeting Generator based on user profile and platform status
export function getAdaptiveGreeting(props: {
  currentStudent?: Student | null;
  user?: User | null;
  audienceTheme?: AudienceTheme;
  studentName?: string;
}): { text: string; chips: string[]; greetingType: 'guest' | 'kids' | 'level1' | 'level2plus' } {
  const { currentStudent, user, audienceTheme, studentName } = props;
  const isKids = audienceTheme === 'kids';
  const isLoggedIn = Boolean(user || currentStudent);
  const name = currentStudent?.name || studentName || user?.displayName || 'Explorador';

  // 1. Visitor / Not signed in
  if (!isLoggedIn) {
    return {
      greetingType: 'guest',
      text: `¡Hola! Welcome to Güakytopia 🦜 Soy **Güaky The Macaw**, tu guía oficial del campus.

Aquí transformamos tu inglés con la metodología oficial de McGraw Hill, a tu ritmo y sin estrés. ¿En qué te oriento hoy?

1. ¿Cómo registrarme o empezar mi prueba gratis?
2. Conocer el Pase Digital ($4.99/mes)
3. Explorar la Güakypedia oficial y metodologías
4. Hablar con La Teacher por WhatsApp`,
      chips: [
        '1. Registro y prueba gratis',
        '2. Pase Digital $4.99/mes',
        '3. Explorar Güakypedia',
        '4. Hablar por WhatsApp'
      ]
    };
  }

  // 2. Kids / Junior Mode
  if (isKids) {
    return {
      greetingType: 'kids',
      text: `¡Yaaay! ¡Hola, ${name}! 🦜 Soy **Güaky The Macaw**!

¡Estoy súper feliz de tenerte en tu aventura de inglés en Güakytopia! ¿Qué te gustaría jugar y practicar hoy?

1. Jugar Where's Güaky? en la Arena
2. Ganar XP con las misiones diarias
3. Ver mi Güakypack, escudos y vidas
4. Aprender palabras mágicas en inglés`,
      chips: [
        '1. Jugar Where\'s Güaky?',
        '2. Misiones diarias y XP',
        '3. Mi Güakypack y vidas',
        '4. Palabras mágicas'
      ]
    };
  }

  // Determine Level for enrolled student
  const levelId = currentStudent?.levelId || 'level_1';
  const levelNum = parseInt(levelId.replace('level_', ''), 10) || 1;
  const streak = currentStudent?.streak || 0;

  // 3. Level 1 Student (A1 Beginner)
  if (levelNum <= 1) {
    return {
      greetingType: 'level1',
      text: `¡Hola, ${name}! 🦜 ¡Qué alegría verte de vuelta!

Veo que estás en el **Nivel 1 (SuperGoal 1 / A1)** con **${streak} días de racha activa 🔥**. Vamos a tu propio ritmo, sin miedo a equivocarte y con pasos firmes.

¿Qué revisamos hoy?
1. Continuar mi sesión en Classroom
2. Practicar drills en el Lab Güakytalkie
3. Revisar mis horas y escudos en el Güakypack
4. Practicar mis primeras frases básicas en inglés`,
      chips: [
        '1. Continuar en Classroom',
        '2. Drills en Lab',
        '3. Abrir Güakypack',
        '4. Frases básicas en inglés'
      ]
    };
  }

  // 4. Level 2+ Student (A2, B1, B2, C1, C2) - Greets in English!
  return {
    greetingType: 'level2plus',
    text: `Hello, ${name}! Great to have you back! 🦜

You're rocking **Level ${levelNum}** with an awesome **${streak}-day streak 🔥**! Every session you complete makes your English more fluent.

How would you like to level up today?
1. Let's practice conversational English!
2. Jump into my current unit in the Hub
3. Check my Güakypack & shields
4. Ask a question about grammar or vocabulary`,
    chips: [
      '1. Practice conversational English',
      '2. Jump into Hub',
      '3. Check Güakypack',
      '4. Ask a grammar question'
    ]
  };
}

// Component to render chat text nicely without raw markdown asterisks, ADHD-friendly, with interactive numbered options
const FormattedChatMessage: React.FC<{ 
  text: string; 
  isUser: boolean;
  onSelectOption?: (optionText: string, optionNumber: string) => void;
}> = ({ text, isUser, onSelectOption }) => {
  const lines = text.split('\n');

  return (
    <div className={`space-y-1.5 ${isUser ? 'text-slate-950 font-semibold' : 'text-slate-800'}`}>
      {lines.map((line, lIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lIdx} className="h-1" />;
        }

        // Bullet list detection (•, -, *)
        const isBullet = trimmed.startsWith('• ') || trimmed.startsWith('- ') || (trimmed.startsWith('* ') && !trimmed.startsWith('** '));
        const cleanBulletText = isBullet ? trimmed.replace(/^[•\-\*]\s+/, '') : trimmed;

        // Numbered list detection (1., 2., etc.)
        const numberedMatch = trimmed.match(/^(\d+)[\.\)]\s+(.*)$/);
        const isNumbered = Boolean(numberedMatch);
        const num = numberedMatch ? numberedMatch[1] : '';
        const cleanNumberedText = numberedMatch ? numberedMatch[2] : trimmed;

        // Inline parser for **bold** and *italic*
        const parseInline = (str: string) => {
          const parts = str.split(/(\*\*.*?\*\*)/g);
          return parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
              const boldContent = part.slice(2, -2);
              return (
                <strong key={pIdx} className={isUser ? 'font-black' : 'font-bold text-slate-900'}>
                  {boldContent}
                </strong>
              );
            }
            // Strip any rogue remaining double asterisks
            const sanitized = part.replace(/\*\*/g, '');
            return sanitized;
          });
        };

        if (isBullet) {
          return (
            <div key={lIdx} className="flex items-start gap-1.5 pl-0.5 my-1">
              <span className="text-[#2EC4B6] font-black shrink-0 mt-0.5">•</span>
              <span className="flex-1 leading-snug">{parseInline(cleanBulletText)}</span>
            </div>
          );
        }

        if (isNumbered && !isUser && onSelectOption) {
          return (
            <button
              key={lIdx}
              type="button"
              onClick={() => onSelectOption(cleanNumberedText, num)}
              className="w-full text-left flex items-start gap-2 p-2 rounded-xl bg-teal-50/70 hover:bg-teal-100/80 border border-teal-200/70 text-teal-950 transition-all hover:scale-101 group cursor-pointer my-1 shadow-2xs"
              title={`Elegir opción ${num}: ${cleanNumberedText}`}
            >
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-lg bg-[#2EC4B6] text-slate-950 text-[11px] font-black shrink-0 mt-0.5 group-hover:scale-110 transition-transform shadow-2xs">
                {num}
              </span>
              <span className="flex-1 text-[11px] font-semibold leading-snug pt-0.5">
                {parseInline(cleanNumberedText)}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-teal-500 opacity-0 group-hover:opacity-100 transition-opacity mt-1 shrink-0" />
            </button>
          );
        }

        if (isNumbered) {
          return (
            <div key={lIdx} className="flex items-start gap-1.5 pl-0.5 my-1">
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black shrink-0 mt-0.5">
                {num}
              </span>
              <span className="flex-1 leading-snug">{parseInline(cleanNumberedText)}</span>
            </div>
          );
        }

        return (
          <p key={lIdx} className="leading-relaxed">
            {parseInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

function getLocalSmartFallback(query: string): { reply: string; suggestWhatsApp: boolean } {
  const q = query.toLowerCase();
  
  if (q.includes('backpack') || q.includes('pack') || q.includes('mochila') || q.includes('escudo') || q.includes('hour bag') || q.includes('bolsa de horas')) {
    return {
      reply: `¡Squawk! 🎒 En tu **Güakypack** llevas todo tu equipamiento:

• **Horas de clase**: Prepaga horas a **$10 USD/h** (paquete de 6h).
• **Escudo de 12 Horas**: Reprograma 1 clase al mes avisando con solo 12h de anticipación.
• **Escudo de Racha**: Protege tu streak si algún día no puedes entrar.

¿Quieres saber cómo ganar más escudos jugando en la Arena?`,
      suggestWhatsApp: false
    };
  }

  if (q.includes('4.99') || q.includes('pase digital') || q.includes('digital pass') || q.includes('membres')) {
    return {
      reply: `¡Squawk! 🌴 El **Pase Digital** cuesta solo **$4.99 USD/mes**.

Es 100% autónomo: incluye los 12 niveles de libros SuperGoal/MegaGoal de McGraw Hill, audios nativos, 100 drills por unidad en el Lab y acceso completo a The Flock Arena. ¡Sin horarios fijos!`,
      suggestWhatsApp: false
    };
  }

  if (q.includes('liga') || q.includes('league') || q.includes('podio') || q.includes('premio') || q.includes('honor') || q.includes('cokit')) {
    return {
      reply: `¡Squawk! 🏆 En **Cokitö's League** el top 3 semanal gana recompensas reales:

• **Plan Mensual / Pase Digital**: ¡Acumula 3 podios y te ganas 1 mes gratis de suscripción!
• **Clases privadas**: Puedes canjear podio por 1 hora de tutoría gratis o pases para The Flock Conversation Club.

¡Juega en la Arena para sumar XP y subir al podio!`,
      suggestWhatsApp: false
    };
  }
  
  if (q.includes('arena') || q.includes('juego') || q.includes('quest') || q.includes('where') || q.includes('game') || q.includes('racha') || q.includes('streak')) {
    return {
      reply: `¡Squawk! 🎮 En **The Flock Arena** juegas y ganas XP:

1. **Daily Quests & League**: 3 micro-misiones diarias y el cuadro de honor.
2. **WW (Where's Güaky?)**: Encuentra a Güaky y palabras en la escena retro.
3. **Arcade Games**: Word Scramble, Vocab Match y Hangman.

¿Cuál juego te gustaría probar primero?`,
      suggestWhatsApp: false
    };
  }
  
  if (q.includes('hub') || q.includes('nivel') || q.includes('level') || q.includes('curricul') || q.includes('mcgraw')) {
    return {
      reply: `¡Squawk! 📚 El **Hub** tiene los 12 niveles oficiales de **McGraw Hill Education** (SuperGoal y MegaGoal).

Cada unidad tiene 3 sesiones guiadas (A, B, C), audios con acento nativo y su Unit Quiz. ¿En qué nivel te encuentras actualmente?`,
      suggestWhatsApp: false
    };
  }
  
  if (q.includes('practice') || q.includes('english') || q.includes('hello') || q.includes('hi') || q.includes('talk')) {
    return {
      reply: `Hello there! 🦜 I'm **Güaky The Macaw**, your English buddy!

Let's keep it easy and fun. Tell me: how was your day today, or what is your favorite hobby? (Feel free to answer in English or ask me any question!)`,
      suggestWhatsApp: false
    };
  }

  return {
    reply: `¡Squawk! 🦜 Soy **Güaky The Macaw**, tu compañero en Güakytopia.

Puedo ayudarte con tu **Güakypack** (horas y escudos), el **Pase Digital** ($4.99/mes), la **Arena** o practicar inglés conversacional. Si necesitas soporte con La Teacher, ¡puedes ir directo al Welcome Lounge en WhatsApp!`,
    suggestWhatsApp: true
  };
}

export const GuakyChatbot: React.FC<GuakyChatbotProps> = ({
  teacherWhatsAppUsername = 'CokitoVZLA',
  studentName,
  currentStudent,
  user,
  audienceTheme = 'adults',
  activeTab = 'landing',
  onNavigateToTab,
  onOpenGuakypack
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasResumedMemory, setHasResumedMemory] = useState(false);

  // Clean WhatsApp URL linking to Welcome Lounge community
  const welcomeLoungeUrl = OFFICIAL_PAGO_MOVIL.whatsappWelcomeLoungeUrl;

  // Key for persistent memory per student or user
  const memoryKey = `guaky_memory_${currentStudent?.id || user?.uid || 'guest'}`;

  // Adaptive initial message
  const initialAdaptive = getAdaptiveGreeting({
    currentStudent,
    user,
    audienceTheme,
    studentName
  });

  const [quickChips, setQuickChips] = useState<string[]>(initialAdaptive.chips);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(memoryKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read Guaky memory:', e);
    }

    return [
      {
        id: 'welcome',
        role: 'assistant',
        text: initialAdaptive.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  // Track if we loaded past memory
  useEffect(() => {
    try {
      const saved = localStorage.getItem(memoryKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 1) {
          setHasResumedMemory(true);
        }
      }
    } catch {}
  }, [memoryKey]);

  // Persist messages to memory
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(memoryKey, JSON.stringify(messages));
      } catch (e) {
        console.warn('Could not persist Guaky memory:', e);
      }
    }
  }, [messages, memoryKey]);

  // Update quick chips if user profile changes and no active custom session
  useEffect(() => {
    const updated = getAdaptiveGreeting({
      currentStudent,
      user,
      audienceTheme,
      studentName
    });
    setQuickChips(updated.chips);
  }, [currentStudent?.id, currentStudent?.levelId, audienceTheme]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const handleSendMessage = async (textToSend?: string) => {
    let query = (textToSend || input).trim();
    if (!query || isLoading) return;

    // Check if the user typed a single number (1, 2, 3, 4)
    // If so, map it to the corresponding numbered option in the last assistant message
    const isSingleDigit = /^[1-9]$/.test(query);
    if (isSingleDigit) {
      const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant');
      if (lastAssistant) {
        const lines = lastAssistant.text.split('\n');
        const match = lines.find(l => {
          const t = l.trim();
          return t.startsWith(`${query}.`) || t.startsWith(`${query})`);
        });
        if (match) {
          const cleanOption = match.replace(/^\d+[\.\)]\s*/, '').trim();
          query = cleanOption;
        }
      }
    }

    // Direct platform actions triggered by option text
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('güakypack') || lowerQuery.includes('guakypack') || lowerQuery.includes('abrir pack') || lowerQuery.includes('ver mi pack')) {
      if (onOpenGuakypack) {
        onOpenGuakypack();
      }
    } else if (lowerQuery.includes('classroom') && onNavigateToTab) {
      onNavigateToTab('classroom');
    } else if (lowerQuery.includes('hub') && onNavigateToTab) {
      onNavigateToTab('pathway');
    } else if (lowerQuery.includes('lab') && onNavigateToTab) {
      onNavigateToTab('lab');
    } else if (lowerQuery.includes('arena') && onNavigateToTab) {
      onNavigateToTab('duolingo');
    } else if (lowerQuery.includes('güakypedia') && onNavigateToTab) {
      onNavigateToTab('guakypedia');
    }

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    // Build real-time platform & student context to feed the AI
    const levelId = currentStudent?.levelId || 'level_1';
    const levelNum = parseInt(levelId.replace('level_', ''), 10) || 1;
    const studentContext = {
      studentName: currentStudent?.name || studentName || user?.displayName || 'Explorador',
      isLoggedIn: Boolean(user || currentStudent),
      levelId: levelId,
      levelNumber: levelNum,
      streak: currentStudent?.streak || 0,
      xp: currentStudent?.xp || 0,
      currentUnit: currentStudent?.currentUnit || 1,
      audienceTheme,
      activeTab,
      isDigitalPass: currentStudent?.isDigitalPass || false
    };

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map(m => ({
            role: m.role,
            text: m.text
          })),
          context: studentContext
        })
      });

      if (!response.ok) {
        throw new Error('Error al conectar con Güaky The Macaw');
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        text: data.reply || '🦜 ¡Squawk! Disculpa, estoy procesando tu consulta. ¿Podrías repetirme tu pregunta?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        showWhatsAppButton: Boolean(data.suggestWhatsApp)
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.warn('Network or API fallback engaged:', err);
      const fallback = getLocalSmartFallback(query);
      const fallbackMessage: ChatMessage = {
        id: `fallback_${Date.now()}`,
        role: 'assistant',
        text: fallback.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        showWhatsAppButton: fallback.suggestWhatsApp
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    try {
      localStorage.removeItem(memoryKey);
    } catch {}
    setHasResumedMemory(false);

    const freshAdaptive = getAdaptiveGreeting({
      currentStudent,
      user,
      audienceTheme,
      studentName
    });

    setQuickChips(freshAdaptive.chips);
    setMessages([
      {
        id: `welcome_${Date.now()}`,
        role: 'assistant',
        text: freshAdaptive.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <>
      {/* Floating Launcher Button - Minimized to only Güaky's Imagotype */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white p-1 shadow-2xl hover:shadow-[#2EC4B6]/40 transition-all hover:scale-110 active:scale-95 group border-2 border-[#2EC4B6] flex items-center justify-center cursor-pointer"
          title="Güaky The Macaw 🦜 • Guía Oficial y Coach"
          aria-label="Abrir chat con Güaky The Macaw"
        >
          <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-teal-50 to-amber-50">
            <img 
              src="/guaky-chat.png" 
              alt="Güaky The Macaw" 
              className="w-full h-full object-contain transform group-hover:rotate-6 transition-transform" 
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent && !parent.querySelector('.fallback-emoji')) {
                  const span = document.createElement('span');
                  span.className = 'fallback-emoji text-2xl';
                  span.textContent = '🦜';
                  parent.appendChild(span);
                }
              }}
            />
          </div>
          {/* Subtle online pulse dot */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs animate-pulse" />
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div className={`fixed z-50 transition-all duration-300 ${
          isMinimized 
            ? 'bottom-20 md:bottom-6 right-4 sm:right-6 w-72 bg-white rounded-2xl shadow-xl border border-slate-200' 
            : 'bottom-20 md:bottom-6 right-3 sm:right-6 w-[calc(100vw-24px)] sm:w-[410px] h-[550px] max-h-[82vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fadeIn'
        }`}>
          
          {/* Header */}
          <div className="p-3 bg-gradient-to-r from-[#243447] via-[#1F4959] to-[#2EC4B6] text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-2xl bg-white p-1 border border-white/40 shadow-xs shrink-0 overflow-hidden flex items-center justify-center">
                <img 
                  src="/guaky-chat.png" 
                  alt="Güaky The Macaw" 
                  className="w-full h-full object-contain" 
                  onError={(e) => {
                    e.currentTarget.style.visibility = 'hidden';
                  }}
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-black text-white truncate">
                    Güaky The Macaw 🦜
                  </h3>
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.2 rounded-full">
                    Online
                  </span>
                </div>
                <p className="text-[10px] text-teal-100 truncate">
                  Tu compañero de inglés • Güakytopia
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title="Nueva conversación / Reiniciar"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title={isMinimized ? 'Maximizar' : 'Minimizar'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title="Cerrar chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Memory Resume Banner */}
              {hasResumedMemory && (
                <div className="px-3 py-1.5 bg-gradient-to-r from-teal-50 to-emerald-50 border-b border-teal-100 flex items-center justify-between text-[11px] text-teal-900">
                  <div className="flex items-center gap-1 font-semibold truncate">
                    <Brain className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span className="truncate">Memoria activa • Continuando charla</span>
                  </div>
                  <button
                    onClick={handleResetChat}
                    className="text-[10px] font-bold text-teal-700 hover:text-teal-900 hover:underline shrink-0 ml-2"
                  >
                    Empezar nuevo tema
                  </button>
                </div>
              )}

              {/* Messages Thread (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/60 text-xs">
                {messages.map((m) => {
                  const isUser = m.role === 'user';
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                    >
                      <div className="flex items-end gap-1.5 max-w-[90%]">
                        {!isUser && (
                          <div className="w-6 h-6 rounded-full bg-white border border-teal-200 p-0.5 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
                            <img 
                              src="/guaky-chat.png" 
                              alt="Güaky The Macaw" 
                              className="w-full h-full object-contain" 
                              onError={(e) => {
                                e.currentTarget.style.visibility = 'hidden';
                              }}
                            />
                          </div>
                        )}
                        <div
                          className={`p-3 rounded-2xl leading-relaxed ${
                            isUser
                              ? 'bg-[#2EC4B6] text-slate-950 rounded-br-xs shadow-xs'
                              : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs shadow-xs'
                          }`}
                        >
                          <FormattedChatMessage 
                            text={m.text} 
                            isUser={isUser}
                            onSelectOption={(optionText) => handleSendMessage(optionText)}
                          />

                          {/* Interactive WhatsApp Direct Action Card */}
                          {!isUser && m.showWhatsAppButton && (
                            <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-2">
                              <a
                                href={welcomeLoungeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-transform hover:scale-101"
                              >
                                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                </svg>
                                <span>Entrar al Welcome Lounge de WhatsApp</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                              <p className="text-[10px] text-slate-500 text-center">
                                Canal de bienvenida oficial • Soporte y consultas
                              </p>
                            </div>
                          )}

                        </div>
                      </div>
                      <span className="text-[9px] text-slate-400 px-2">
                        {m.timestamp}
                      </span>
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex items-center gap-2 text-slate-500 text-xs p-2">
                    <div className="w-5 h-5 rounded-full bg-white border border-teal-200 p-0.5 flex items-center justify-center overflow-hidden">
                      <img 
                        src="/guaky-chat.png" 
                        alt="Güaky The Macaw" 
                        className="w-full h-full object-contain" 
                        onError={(e) => {
                          e.currentTarget.style.visibility = 'hidden';
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2EC4B6] animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B4A] animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FFD166] animate-bounce [animation-delay:0.4s]" />
                      <span className="text-[11px] text-slate-500 ml-1">Güaky The Macaw está pensando...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Suggestion Chips */}
              <div className="px-3 py-1.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {quickChips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(chip)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 rounded-lg text-[10px] font-semibold whitespace-nowrap transition-colors cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-1.5"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe tu mensaje o presiona 1, 2, 3..."
                  className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-[#2EC4B6] focus:outline-hidden"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-2.5 bg-[#2EC4B6] hover:bg-[#259C90] text-slate-950 font-bold rounded-xl shadow-xs transition-colors disabled:opacity-40 cursor-pointer"
                  title="Enviar"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}

        </div>
      )}
    </>
  );
};
