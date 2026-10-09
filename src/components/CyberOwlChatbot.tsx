import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  ExternalLink, 
  RotateCcw, 
  Minimize2, 
  Maximize2,
  ChevronDown,
  Copy,
  Check
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  showWhatsAppButton?: boolean;
}

interface CyberOwlChatbotProps {
  teacherWhatsAppUsername?: string;
  studentName?: string;
}

export const CyberOwlChatbot: React.FC<CyberOwlChatbotProps> = ({
  teacherWhatsAppUsername = 'CokitoVZLA',
  studentName
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedHandle, setCopiedHandle] = useState(false);

  const cleanUsername = teacherWhatsAppUsername.replace('@', '');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: `¡Hoo-hoo! 👋 Soy **Cyber Owl 🦉**, el asistente virtual de **La Teacher Cokitö**.

¿En qué te puedo orientar hoy? Puedes preguntarme sobre:
• El **Pase Digital de $5/mes** y cómo funciona.
• Los **paquetes de clases en vivo** (Express, Intensivo, Regular, Básico).
• Nuestra metodología comunicativa sin miedo a equivocarse.
• O si necesitas hablar directamente con **La Teacher Cokitö en WhatsApp (@${cleanUsername})**, ¡te conecto de inmediato sin necesidad de números de teléfono!`,
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

  // Build WhatsApp URL with username (wa.me/username - 100% phone-number-free!)
  const getWhatsAppLink = (customText?: string) => {
    const baseMessage = customText 
      ? `¡Hola Teacher Cokitö (@${cleanUsername})! Estaba conversando con el Cyber Owl en la plataforma y tengo esta consulta: "${customText}"`
      : `¡Hola Teacher Cokitö (@${cleanUsername})! Vengo desde el Cyber Owl en la plataforma y quisiera más información sobre las clases de inglés.`;
    return `https://wa.me/${cleanUsername}?text=${encodeURIComponent(baseMessage)}`;
  };

  const handleCopyHandle = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`@${cleanUsername}`);
    setCopiedHandle(true);
    setTimeout(() => setCopiedHandle(false), 2500);
  };

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
        throw new Error('Error al conectar con Cyber Owl');
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        text: data.reply || '¡Hoo-hoo! 🦉 No pude generar una respuesta en este momento.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        showWhatsAppButton: Boolean(data.suggestWhatsApp)
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error(err);
      const fallbackMessage: ChatMessage = {
        id: `fallback_${Date.now()}`,
        role: 'assistant',
        text: `¡Hoo-hoo! 🦉 Puedes escribirle directamente a La Teacher Cokitö a su usuario de WhatsApp **@${cleanUsername}** con un solo clic aquí abajo.`,
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
        text: `¡Conversación reiniciada! 🦉 ¿En qué otra duda sobre La Teacher Cokitö te puedo colaborar? También puedes contactarla directo a su WhatsApp @${cleanUsername}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const quickChips = [
    '¿Cómo funciona el Pase de $5?',
    '¿Cuáles son los planes de clases?',
    '¿Cómo es la metodología comunicativa?',
    `💬 Escribir a @${cleanUsername}`
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
          className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white rounded-full shadow-2xl hover:shadow-blue-500/30 transition-all hover:scale-105 group border-2 border-white/30"
          title="Pregúntale a Cyber Owl 🦉"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg shadow-inner">
            🦉
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-black leading-none">Cyber Owl AI</p>
            <p className="text-[10px] text-blue-200 leading-tight">Asistente Cokitö</p>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
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
          <div className="p-3.5 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-lg flex items-center justify-center shadow-xs shrink-0">
                🦉
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-black text-white truncate">
                    Cyber Owl AI
                  </h3>
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.2 rounded-full">
                    Online
                  </span>
                </div>
                <p className="text-[10px] text-blue-200 truncate">
                  Asistente Virtual de La Teacher Cokitö
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
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-slate-800 flex items-center justify-center text-xs shrink-0 shadow-2xs">
                            🦉
                          </div>
                        )}
                        <div
                          className={`p-3 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                            isUser
                              ? 'bg-blue-600 text-white rounded-br-xs shadow-xs font-medium'
                              : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs shadow-xs'
                          }`}
                        >
                          {m.text}

                          {/* Interactive WhatsApp Direct Action Card */}
                          {!isUser && m.showWhatsAppButton && (
                            <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-2">
                              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                                <span>Atención humana personalizada:</span>
                                <button
                                  type="button"
                                  onClick={handleCopyHandle}
                                  className="inline-flex items-center gap-1 text-[10px] text-blue-700 hover:text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 transition-colors"
                                  title="Copiar usuario de WhatsApp"
                                >
                                  {copiedHandle ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                  <span>{copiedHandle ? '¡Copiado!' : `@${cleanUsername}`}</span>
                                </button>
                              </div>
                              <a
                                href={getWhatsAppLink(m.text.slice(0, 100))}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-transform hover:scale-101"
                              >
                                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                </svg>
                                <span>Chatear con @{cleanUsername} en WhatsApp</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                              <p className="text-[10px] text-slate-500 text-center">
                                Directo por usuario de WhatsApp • Sin revelar números telefónicos
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
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs">
                      🦉
                    </div>
                    <div className="flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
                      <span className="text-[11px] text-slate-500 ml-1">Cyber Owl está pensando...</span>
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
                    className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 rounded-lg text-[10px] font-semibold whitespace-nowrap transition-colors"
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
                  placeholder="Escribe tu pregunta aquí..."
                  className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors disabled:opacity-40"
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
