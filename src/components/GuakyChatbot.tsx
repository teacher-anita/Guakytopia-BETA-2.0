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
  Copy,
  Check
} from 'lucide-react';
import { OFFICIAL_PAGO_MOVIL } from '../services/currencyService';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  showWhatsAppButton?: boolean;
}

interface GuakyChatbotProps {
  teacherWhatsAppUsername?: string;
  studentName?: string;
}

function getLocalSmartFallback(query: string): { reply: string; suggestWhatsApp: boolean } {
  const q = query.toLowerCase();
  
  if (q.includes('4.99') || q.includes('pase digital') || q.includes('digital pass') || q.includes('membres')) {
    return {
      reply: `¡Squawk! 🦜 El **Pase Digital** cuesta solo **$4.99 USD/mes** (promo de entrada). Es 100% para aprendizaje autónomo e incluye acceso a los 12 niveles oficiales de libros SuperGoal/MegaGoal, audios nativos, 100 drills por unidad en el Lab Güakytalkie, quizzes y The Flock Arena. ¡Sin clases fijas obligatorias!`,
      suggestWhatsApp: false
    };
  }
  
  if (q.includes('hour bag') || q.includes('bolsa de horas') || q.includes('prepaid') || q.includes('escudo') || q.includes('10')) {
    return {
      reply: `¡Squawk! 🦜 La **Hour Bag** (Bolsa de Horas Prepagadas) cuesta **$10 USD / hora** con un paquete mínimo de 6 horas ($60 USD). Tiene 30 días de vigencia para tutorías 1 a 1 flexibles. ¡Además incluye el beneficio exclusivo del **Escudo de las 12 horas**, para reprogramar 1 sesión al mes avisando con solo 12h de anticipación!`,
      suggestWhatsApp: false
    };
  }
  
  if (q.includes('arena') || q.includes('juego') || q.includes('quest') || q.includes('where') || q.includes('game') || q.includes('racha') || q.includes('streak')) {
    return {
      reply: `¡Squawk! 🎮 En **The Flock Arena** entrenas tu racha diaria y ganas XP con:
1. **Daily Quests & League**: 3 micro-misiones diarias y el cuadro de honor de alumnos inscritos en la Cokitö League.
2. **WW (Where's Güaky?)**: Busca a Güaky y objetos del vocabulario en una detallada escena retro ochentera wimmelbild.
3. **Arcade Games**: Word Scramble, Vocab Match y Hangman (Ahorcado).
4. **Gamer Account**: Para guardar tus vidas, racha y puntos de experiencia.`,
      suggestWhatsApp: false
    };
  }
  
  if (q.includes('hub') || q.includes('nivel') || q.includes('level') || q.includes('curricul') || q.includes('mcgraw')) {
    return {
      reply: `¡Squawk! 📚 El **Hub** contiene tu **Learning Pathway** con 12 niveles oficiales (A1 a C2) de **McGraw Hill Education**:
• **SuperGoal (1 a 4)**: Para juniors/teens y bases comunicativas.
• **MegaGoal (1 a 8)**: Para adultos y comunicación profesional.
Cada unidad tiene 3 sesiones (A, B, C), audios nativos, Cokitö Tips y Owl Culture Corner. Para desbloquear la siguiente unidad necesitas 70% en el Unit Quiz.`,
      suggestWhatsApp: false
    };
  }
  
  if (q.includes('practice') || q.includes('english') || q.includes('hello') || q.includes('hi') || q.includes('talk')) {
    return {
      reply: `Hello there! 🦜 I'm Güaky the Macaw! I'm thrilled to chat with you in English. We can talk about your day, practice conversational English, or explore any grammar topic you want to master. What would you like to practice today?`,
      suggestWhatsApp: false
    };
  }

  return {
    reply: `¡Squawk! 🦜 Como embajador y coach de **Güakytopia**, puedo orientarte sobre la **Güakypedia** (6 pilares y políticas), el **Hub** (12 niveles McGraw Hill), la **Arena** (Daily Quests y juegos) o podemos practicar inglés conversacional. Si deseas atención administrativa o inscribirte, ¡únete a nuestro **Welcome Lounge en WhatsApp**!`,
    suggestWhatsApp: true
  };
}

export const GuakyChatbot: React.FC<GuakyChatbotProps> = ({
  teacherWhatsAppUsername = 'CokitoVZLA',
  studentName
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Clean WhatsApp URL linking to Welcome Lounge community
  const welcomeLoungeUrl = OFFICIAL_PAGO_MOVIL.whatsappWelcomeLoungeUrl;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: `¡Hola! Hello! 🦜 Soy **Güaky the Macaw**, tu coach de inglés y guía oficial de **Güakytopia**.

Hablo con total fluidez en **español** y en **inglés**. I can help you with anything across our entire campus!

Pregúntame o conversemos sobre:
• **Güakypedia**: Metodología McGraw Hill, 12 niveles, Hour Bag, Pase Digital ($4.99/mes), políticas y pagos en Bs (BCV) o $.
• **The Hub**: Tu Learning Pathway, libros SuperGoal/MegaGoal, audios nativos y tips de Cokitö.
• **The Arena**: Misiones diarias (Daily Quests), rachas, juegos arcade y Where's Güaky.
• **English Practice**: ¡Charlemos en inglés para soltar la lengua y perfeccionar tu vocabulario!
• **Welcome Lounge de WhatsApp**: Soporte directo con la academia.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

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
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

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

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map(m => ({
            role: m.role,
            text: m.text
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Error al conectar con Güaky');
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
    setMessages([
      {
        id: `welcome_${Date.now()}`,
        role: 'assistant',
        text: `¡Conversación reiniciada! 🦜 ¿En qué otra consulta sobre Güakytopia te puedo colaborar? / How else can I help you today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const quickChips = [
    '¿Cómo funciona el Pase Digital de $4.99?',
    'What are the 12 levels & McGraw Hill?',
    '¿Qué es la Hour Bag y el Escudo de 12h?',
    'Let’s practice conversational English!',
    '¿Cómo funcionan las Daily Quests y la Arena?',
    '👉 Entrar al Welcome Lounge'
  ];

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
          title="Güaky 🦜 • Asistente y Guía Oficial"
          aria-label="Abrir chat con Güaky"
        >
          <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-teal-50 to-amber-50">
            <img 
              src="/guaky-chat.png" 
              alt="Güaky" 
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
            : 'bottom-20 md:bottom-6 right-3 sm:right-6 w-[calc(100vw-24px)] sm:w-[400px] h-[540px] max-h-[82vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fadeIn'
        }`}>
          
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-[#243447] via-[#1F4959] to-[#2EC4B6] text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-2xl bg-white p-1 border border-white/40 shadow-xs shrink-0 overflow-hidden flex items-center justify-center">
                <img 
                  src="/guaky-chat.png" 
                  alt="Güaky" 
                  className="w-full h-full object-contain" 
                  onError={(e) => {
                    e.currentTarget.style.visibility = 'hidden';
                  }}
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-black text-white truncate">
                    Güaky el Macaw 🦜
                  </h3>
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.2 rounded-full">
                    Activo
                  </span>
                </div>
                <p className="text-[10px] text-teal-100 truncate">
                  Guía Oficial de Güakytopia
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Reiniciar chat"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title={isMinimized ? 'Maximizar' : 'Minimizar'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Cerrar chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Thread (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/60 text-xs">
                {messages.map((m) => {
                  const isUser = m.role === 'user';
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                    >
                      <div className="flex items-end gap-1.5 max-w-[88%]">
                        {!isUser && (
                          <div className="w-6 h-6 rounded-full bg-white border border-teal-200 p-0.5 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
                            <img 
                              src="/guaky-chat.png" 
                              alt="Güaky" 
                              className="w-full h-full object-contain" 
                              onError={(e) => {
                                e.currentTarget.style.visibility = 'hidden';
                              }}
                            />
                          </div>
                        )}
                        <div
                          className={`p-3 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                            isUser
                              ? 'bg-[#2EC4B6] text-slate-950 rounded-br-xs shadow-xs font-semibold'
                              : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs shadow-xs'
                          }`}
                        >
                          {m.text}

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
                        alt="Güaky" 
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
                      <span className="text-[11px] text-slate-500 ml-1">Güaky está pensando...</span>
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
                    className="px-2.5 py-1 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 rounded-lg text-[10px] font-semibold whitespace-nowrap transition-colors"
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
                  placeholder="Pregúntame en español o ask me in English..."
                  className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-[#2EC4B6] focus:outline-hidden"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-2.5 bg-[#2EC4B6] hover:bg-[#259C90] text-slate-950 font-bold rounded-xl shadow-xs transition-colors disabled:opacity-40"
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
