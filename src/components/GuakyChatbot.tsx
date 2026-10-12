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
      text: `¡Hola! 🦜 Soy **Güaky**, el guacamayo asistente oficial de **Güakytopia**. ¡Bienvenido a nuestra bandada de exploradores del inglés!

¿En qué te puedo orientar hoy? Puedes preguntarme sobre:
• La **Membresía Campus de $4.99/mes** (promo de entrada).
• Los **paquetes de clases en vivo** (Básico, Regular, Intensivo o Express).
• Nuestras **PrePaid Classes** (horas individuales a $10/h).
• O únete a nuestro **Welcome Lounge de WhatsApp** para recibir soporte o coordinar con la academia.`,
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
      console.error(err);
      const fallbackMessage: ChatMessage = {
        id: `fallback_${Date.now()}`,
        role: 'assistant',
        text: `🦜 ¡Squawk! Puedes entrar directamente al **Welcome Lounge en WhatsApp** para consultar cualquier detalle con la academia.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        showWhatsAppButton: true
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
        text: `¡Conversación reiniciada! 🦜 ¿En qué otra consulta sobre Güakytopia te puedo colaborar?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const quickChips = [
    '¿Cómo funciona la membresía de $4.99?',
    '¿Qué son las PrePaid Classes?',
    '¿Cuáles son los planes de clases?',
    '👉 Entrar al Welcome Lounge'
  ];

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-[#2EC4B6] via-[#259C90] to-[#243447] text-white rounded-full shadow-2xl hover:shadow-[#2EC4B6]/30 transition-all hover:scale-105 group border-2 border-white/40"
          title="Pregúntale a Güaky 🦜"
        >
          <div className="w-8 h-8 rounded-full bg-white p-0.5 flex items-center justify-center shadow-inner overflow-hidden">
            <img src="/guaky-face.svg" alt="Güaky" className="w-full h-full object-contain" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-black leading-none text-white">Güaky Asistente</p>
            <p className="text-[10px] text-teal-100 leading-tight">Pregúntame lo que sea</p>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
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
                <img src="/guaky-face.svg" alt="Güaky" className="w-full h-full object-contain" />
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
                            <img src="/guaky-face.svg" alt="Güaky" className="w-full h-full object-contain" />
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
                      <img src="/guaky-face.svg" alt="Güaky" className="w-full h-full object-contain" />
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
                  placeholder="Escribe tu pregunta a Güaky..."
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
