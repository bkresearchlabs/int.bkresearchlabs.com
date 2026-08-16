import React, { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, X, Send, RefreshCw, ChevronDown, Minimize2, MessageSquare, Shield, ExternalLink } from 'lucide-react';
import { SiteSettings } from '../../types';
import { aiApi } from '../../lib/aiApi';

interface AiLaboratoryAssistantWidgetProps {
  settings: SiteSettings | null;
}

export const AiLaboratoryAssistantWidget: React.FC<AiLaboratoryAssistantWidgetProps> = ({ settings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: 'Hello! I am the BK Research Labs AI Assistant. How can I assist with your analytical chemistry inquiries or product specifications today?'
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const aiControl = settings?.ai_master_control;
  const isGloballyEnabled = Boolean(aiControl?.global_enabled);
  const isChatEnabled = Boolean(aiControl?.features?.chat?.enabled);
  const isCustomerFacingEnabled = Boolean(aiControl?.enable_customer_facing_chat);

  // Strictly off by default and hidden unless explicitly enabled in AI Master Control
  if (!isGloballyEnabled || !isChatEnabled || !isCustomerFacingEnabled) {
    return null;
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user' as const, content: input.trim() };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const res = await aiApi.chat({
        messages: newHistory,
        systemInstruction: aiControl?.features?.chat?.systemInstruction || 'You are the BK Research Labs AI Chemistry Assistant. Provide authoritative, scientific information strictly for in vitro laboratory research purposes.',
        temperature: aiControl?.features?.chat?.temperature ?? 0.7
      });

      if (res.success && res.reply) {
        setMessages([...newHistory, { role: 'assistant', content: res.reply }]);
      } else if (res.disabled) {
        setMessages([...newHistory, { role: 'assistant', content: 'AI services are currently offline or paused in laboratory settings.' }]);
      } else {
        setMessages([...newHistory, { role: 'assistant', content: res.error || 'Connection error with AI Gateway.' }]);
      }
    } catch (err: any) {
      setMessages([...newHistory, { role: 'assistant', content: 'Unable to reach AI service: ' + err.message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 font-sans">
      {!isOpen ? (
        <button
          id="open-ai-assistant-widget-btn"
          onClick={() => setIsOpen(true)}
          className="p-4 bg-[#002b29] hover:bg-[#003835] text-emerald-300 rounded-full shadow-2xl border border-emerald-500/40 flex items-center gap-2.5 transition-all hover:scale-105 cursor-pointer group"
          title="AI Laboratory Assistant"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-emerald-400" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
          </div>
          <span className="text-xs font-bold font-serif pr-1 hidden sm:inline text-white">AI Assistant</span>
        </button>
      ) : (
        <div className={`w-[360px] sm:w-[400px] bg-slate-900 border border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all duration-200 ${
          isMinimized ? 'h-[64px]' : 'h-[520px]'
        }`}>
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-[#002b29] via-[#003835] to-[#014d48] border-b border-emerald-500/20 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-emerald-500/20 border border-emerald-400/30 rounded-xl text-emerald-300">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold font-serif">BKRL AI Specialist</div>
                <div className="text-[10px] text-emerald-300/80 font-mono">Gemini 3.5 Flash Online</div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-300">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Body */}
          {!isMinimized && (
            <>
              <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl ${
                        msg.role === 'user'
                          ? 'bg-emerald-600 text-white rounded-br-none'
                          : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none'
                      }`}
                    >
                      <div className="text-[11px] leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-2xl max-w-[80%] text-slate-400 text-xs flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                    <span>Analyzing laboratory queries...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Research Disclaimer & Input Bar */}
              <div className="p-3 bg-slate-950 border-t border-slate-800 space-y-2">
                <div className="text-[10px] text-slate-500 text-center font-mono">
                  Strictly for in vitro research & analytical laboratory inquiries.
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask about purity, CoA specs, CAS..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={loading || !input.trim()}
                    className="p-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-[#002b29] rounded-xl cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
