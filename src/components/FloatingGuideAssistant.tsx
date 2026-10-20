import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  X, 
  Minus, 
  Send, 
  ExternalLink, 
  HelpCircle
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

export interface FloatingGuideAssistantProps {
  onNavigate: (view: string) => void;
  onOpenContact?: () => void;
  onOpenHelp?: () => void;
  currentView?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  suggestedActions?: Array<{ label: string; view: string }>;
  isAiGenerated?: boolean;
}

export const FloatingGuideAssistant: React.FC<FloatingGuideAssistantProps> = ({
  onNavigate,
  onOpenContact,
  onOpenHelp,
  currentView = 'home'
}) => {
  const { language, toggleLanguage, t } = useTranslation();
  const isKn = language === 'kn';

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [assistantStatus, setAssistantStatus] = useState<{ mode?: string; assistantEnabled?: boolean } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Suggested queries requested by user
  const suggestedQueries = isKn ? [
    { text: 'ಪ್ರವಾಸ ಯೋಜಿಸುವುದು ಹೇಗೆ?', query: 'ನಮ್ಮ ಪ್ರಯಾಣದಲ್ಲಿ ಪ್ರವಾಸ ಯೋಜಿಸುವುದು ಹೇಗೆ?' },
    { text: 'ಹೋಟೆಲ್ ಹುಡುಕುವುದು ಹೇಗೆ?', query: 'ಕರ್ನಾಟಕದಲ್ಲಿ ಹೋಟೆಲ್‌ಗಳು ಮತ್ತು ಹೋಮ್‌ಸ್ಟೇ ಹುಡುಕುವುದು ಹೇಗೆ?' },
    { text: 'ರೈಲು ಟಿಕೆಟ್ ಬುಕ್ ಮಾಡುವುದು ಹೇಗೆ?', query: 'IRCTC ಮೂಲಕ ರೈಲು ಟಿಕೆಟ್ ಬುಕ್ ಮಾಡುವುದು ಹೇಗೆ?' },
    { text: 'ಕರ್ನಾಟಕದ ಪ್ರೇಕ್ಷಣೀಯ ಸ್ಥಳಗಳು', query: 'ಕರ್ನಾಟಕದಲ್ಲಿ ಭೇಟಿ ನೀಡಲು ಪ್ರಮುಖ ಸ್ಥಳಗಳನ್ನು ಸೂಚಿಸಿ.' },
    { text: 'ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸುವುದು ಹೇಗೆ?', query: 'ವೆಬ್‌ಸೈಟ್ ಭಾಷೆಯನ್ನು ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸುವುದು ಹೇಗೆ?' },
  ] : [
    { text: 'How do I plan my trip?', query: 'How do I plan my trip?' },
    { text: 'How can I find hotels?', query: 'How can I find hotels and homestays?' },
    { text: 'How do I book train tickets?', query: 'How do I book train tickets on IRCTC?' },
    { text: 'Suggest places to visit', query: 'Suggest places to visit in Karnataka.' },
    { text: 'How do I change language?', query: 'How do I change the language to Kannada?' },
  ];

  // Fetch status on mount
  useEffect(() => {
    fetch('/api/assistant/status')
      .then(res => res.json())
      .then(data => setAssistantStatus(data))
      .catch(() => setAssistantStatus({ assistantEnabled: true, mode: 'gemini-assistant' }));
  }, []);

  // Initialize initial welcome message or sync language
  useEffect(() => {
    const welcomeText = isKn
      ? `ನಮಸ್ಕಾರ! 🙏 ನಾನು ನಿಮ್ಮ 'ನಮ್ಮ ಪ್ರಯಾಣ ಮಾರ್ಗದರ್ಶಿ' (Namma Prayana Guide). ಕರ್ನಾಟಕ ಪ್ರವಾಸ ಯೋಜನೆ, ಪ್ರವಾಸಿ ತಾಣಗಳು, IRCTC ರೈಲು ಬುಕಿಂಗ್, ಹೋಟೆಲ್‌ಗಳು ಅಥವಾ ನಮ್ಮ ವೆಬ್‌ಸೈಟ್ ಸೌಲಭ್ಯಗಳ ಬಗ್ಗೆ ಏನು ಬೇಕಾದರೂ ಕೇಳಿ!`
      : `Namaskara! 🙏 I'm your Namma Prayana Guide. Ask me anything about planning your Karnataka itinerary, discovering destinations, booking IRCTC trains or stays, and exploring our features!`;

    setMessages(prev => {
      // If user hasn't chatted yet (only 0 or 1 welcome message), update welcome message & actions to current language
      if (prev.length <= 1) {
        return [
          {
            id: 'msg-welcome',
            sender: 'assistant',
            text: welcomeText,
            timestamp: new Date(),
            suggestedActions: [
              { label: isKn ? 'ಪ್ರವಾಸ ಯೋಜನೆ' : 'Plan My Trip', view: 'planner' },
              { label: isKn ? 'ತಾಣಗಳ ಅನ್ವೇಷಣೆ' : 'Explore Karnataka', view: 'explore' },
              { label: isKn ? 'ರೈಲು ಬುಕಿಂಗ್ (IRCTC)' : 'Book Trains (IRCTC)', view: 'trains' }
            ]
          }
        ];
      }
      return prev;
    });
  }, [isKn]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, isLoading]);

  // Focus input when opening
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async (userText: string) => {
    const trimmed = (userText || '').trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    const abortController = new AbortController();
    const abortTimeout = setTimeout(() => abortController.abort(), 26000);

    try {
      // Build conversation history (prior 4 messages)
      const history = messages.slice(-4).map(m => ({
        role: m.sender,
        content: m.text
      }));

      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: trimmed,
          language: language === 'kn' ? 'kn' : 'en',
          history,
        }),
        signal: abortController.signal,
      });

      clearTimeout(abortTimeout);

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || (isKn ? 'ಕ್ಷಮಿಸಿ, ಪ್ರತಿಕ್ರಿಯೆ ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.' : 'I could not process that request.'),
        timestamp: new Date(),
        suggestedActions: data.suggestedActions,
        isAiGenerated: data.isAiGenerated,
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      clearTimeout(abortTimeout);
      console.warn('[FloatingGuideAssistant] Error fetching reply:', err);
      // Friendly fallback message as required by guidelines
      const fallbackReply = isKn
        ? `ಕ್ಷಮಿಸಿ, ಸದ್ಯಕ್ಕೆ ನೆಟ್‌ವರ್ಕ್ ಸಂಪರ್ಕ ನಿಧಾನವಾಗಿದೆ. ನೀವು ಮೇಲಿನ ಮೆನುವಿನಲ್ಲಿರುವ 'Plan My Trip', 'Hotels' ಅಥವಾ 'Transport' ಆಯ್ಕೆಗಳನ್ನು ಬಳಸಿ ಮುಂದುವರಿಯಬಹುದು.`
        : `I'm having a brief connection issue, but you can explore Namma Prayana anytime using the top menu: 'Plan My Trip' for custom itineraries, 'Hotels' for curated stays with estimated tariffs, and 'Transport' for official IRCTC train bookings.`;

      const fallbackMsg: ChatMessage = {
        id: `ast-err-${Date.now()}`,
        sender: 'assistant',
        text: fallbackReply,
        timestamp: new Date(),
        suggestedActions: [
          { label: isKn ? 'ಪ್ರವಾಸ ಯೋಜನೆ' : 'Plan My Trip', view: 'planner' },
          { label: isKn ? 'ರೈಲು ಬುಕಿಂಗ್ (IRCTC)' : 'Book Trains (IRCTC)', view: 'trains' },
          { label: isKn ? 'ಸಾರಿಗೆ ಕೇಂದ್ರ' : 'Transport Hub', view: 'transport' }
        ]
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (view: string) => {
    if ((view === 'contact' || view === 'support') && onOpenContact) {
      onOpenContact();
    } else if ((view === 'help' || view === 'emergency') && onOpenHelp) {
      onOpenHelp();
    } else {
      onNavigate(view);
    }
    // On small screens, close panel after navigating so user can immediately see and use the target page and its buttons
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const hasActiveChat = messages.length > 1;

  return (
    <>
      {/* 1. ANIMATED TEAL-TO-PURPLE PILL FLOATING LAUNCHER (When closed or minimized) */}
      {(!isOpen || isMinimized) && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="group fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 h-11 sm:h-12 px-3 sm:px-3.5 group-hover:px-4 sm:group-hover:px-4.5 rounded-full flex items-center justify-center bg-gradient-to-r from-teal-600 via-teal-700 to-purple-700 hover:from-teal-500 hover:to-purple-600 text-white shadow-lg shadow-teal-950/20 hover:shadow-xl hover:shadow-purple-950/30 active:scale-95 border border-white/20 cursor-pointer transition-all duration-300 ease-in-out motion-reduce:transition-none focus:outline-hidden focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 select-none touch-manipulation"
          aria-label={
            isMinimized
              ? (isKn ? 'AI ಸಹಾಯಕ ಮುಂದುವರಿಸಿ' : 'Resume AI Assistant')
              : (isKn ? 'AI ಸಹಾಯಕ ತೆರೆಯಿರಿ' : 'Open AI Assistant')
          }
          title="Open AI Assistant"
        >
          {/* Single Sparkle AI Icon - Centered in compact state */}
          <div className="relative flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-white shrink-0 drop-shadow-xs transition-transform duration-300 group-hover:scale-110" />
            {hasActiveChat && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-300 ring-2 ring-purple-700 animate-pulse" />
            )}
          </div>

          {/* Smoothly expanding Namma Prayana AI text on hover */}
          <div className="max-w-0 opacity-0 overflow-hidden whitespace-nowrap group-hover:max-w-[200px] group-hover:opacity-100 group-hover:ml-2 group-focus-visible:max-w-[200px] group-focus-visible:opacity-100 group-focus-visible:ml-2 transition-all duration-300 ease-in-out motion-reduce:transition-none flex items-center">
            <span className="font-bold text-xs sm:text-[13px] text-white select-none whitespace-nowrap drop-shadow-xs tracking-tight">
              {isKn ? 'ನಮ್ಮ ಪ್ರಯಾಣ AI' : 'Namma Prayana AI'}
            </span>
          </div>

          {/* Accessible Tooltip on hover */}
          <span 
            role="tooltip"
            className="pointer-events-none absolute bottom-full mb-2.5 right-0 sm:right-1/2 sm:translate-x-1/2 px-2.5 py-1 rounded-md bg-stone-900/95 text-white text-[11px] font-medium tracking-tight whitespace-nowrap shadow-lg border border-stone-800 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200 delay-75 z-50 hidden sm:flex items-center gap-1"
          >
            <span>{isKn ? 'AI ಸಹಾಯಕ (Open AI Assistant)' : 'Open AI Assistant'}</span>
            <span className="absolute top-full right-4 sm:left-1/2 sm:-translate-x-1/2 border-4 border-transparent border-t-stone-900/95"></span>
          </span>
        </button>
      )}

      {/* 2. COMPACT CHAT PANEL (Desktop 340-350px wide x 440-460px tall, responsive on mobile) */}
      {isOpen && !isMinimized && (
        <div 
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[340px] sm:w-[350px] max-w-[calc(100vw-2rem)] h-[440px] sm:h-[460px] max-h-[calc(100dvh-5.5rem)] bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200"
          role="dialog"
          aria-labelledby="assistant-title"
        >
          {/* Header - Compact & Elegant */}
          <div className="bg-gradient-to-r from-[#093540] via-[#0f4c5c] to-[#047857] text-white px-3.5 py-2.5 flex items-center justify-between shrink-0 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-white/10 backdrop-blur-xs flex items-center justify-center text-amber-300 border border-white/20 shadow-inner">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 id="assistant-title" className="text-xs font-bold tracking-tight text-white flex items-center gap-1.5 leading-tight">
                  <span>{isKn ? 'ನಮ್ಮ ಪ್ರಯಾಣ ಮಾರ್ಗದರ್ಶಿ' : 'Namma Prayana Guide'}</span>
                </h3>
                <div className="flex items-center gap-1 text-[10px] text-teal-100/90 leading-tight">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{isKn ? 'ಕರ್ನಾಟಕ ಪ್ರವಾಸ ಸಹಾಯಕ' : 'AI Website & Travel Guide'}</span>
                </div>
              </div>
            </div>

            {/* Minimize and Close Controls */}
            <div className="flex items-center gap-1 text-teal-100">
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1 rounded-lg hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
                title={isKn ? 'ಕುಗ್ಗಿಸಿ' : 'Minimize'}
                aria-label="Minimize Guide"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
                title={isKn ? 'ಮುಚ್ಚಿ' : 'Close'}
                aria-label="Close Guide"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Body - Independently Scrollable */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-stone-50/60 text-xs">
            {/* Messages */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="flex items-center gap-1 mb-1 px-1 text-[9px] font-bold tracking-wider uppercase">
                    {msg.isAiGenerated ? (
                      <span className="text-purple-700 flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                        <span>{isKn ? 'ಜೆಮಿನಿ AI' : 'Gemini AI'}</span>
                      </span>
                    ) : (
                      <span className="text-emerald-700 flex items-center gap-0.5">
                        <span>{isKn ? 'ಮಾರ್ಗದರ್ಶಿ' : 'Curated Guide'}</span>
                      </span>
                    )}
                  </div>
                )}

                <div
                  className={`max-w-[88%] rounded-2xl px-3 py-2 shadow-2xs leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-[#0f4c5c] text-white rounded-tr-xs font-medium'
                      : 'bg-white text-stone-800 rounded-tl-xs border border-stone-200/80'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Suggested Navigation Actions attached to assistant message */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5 max-w-[88%]">
                    {msg.suggestedActions.map((act, i) => (
                      <button
                        key={i}
                        onClick={() => handleActionClick(act.view)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-50 hover:bg-teal-100 border border-teal-200/70 text-[#0f4c5c] font-semibold text-[10px] transition-colors cursor-pointer"
                      >
                        <span>{act.label}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[9px] text-stone-400 mt-0.5 px-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}

            {/* Quick Suggestions (Shown when starting conversation) */}
            {messages.length <= 3 && !isLoading && (
              <div className="pt-1.5 border-t border-stone-200/60 space-y-1.5">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                  <HelpCircle className="w-3 h-3 text-[#0f4c5c]" />
                  <span>{isKn ? 'ಸೂಚಿಸಿದ ಪ್ರಶ್ನೆಗಳು:' : 'SUGGESTED QUESTIONS:'}</span>
                </span>
                <div className="flex flex-col gap-1">
                  {suggestedQueries.map((sq, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(sq.query)}
                      className="text-left px-2.5 py-1.5 rounded-lg bg-white hover:bg-teal-50 border border-stone-200/80 hover:border-teal-300 text-stone-700 hover:text-[#0f4c5c] text-[11px] font-medium transition-all shadow-2xs hover:shadow-xs cursor-pointer flex items-center justify-between group"
                    >
                      <span className="truncate">{sq.text}</span>
                      <span className="text-stone-300 group-hover:text-teal-600 text-[10px]">→</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-1.5 text-stone-500 bg-white px-2.5 py-1.5 rounded-xl border border-stone-200/80 max-w-[75%] shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-[10px] font-semibold text-stone-600 ml-1">
                  {isKn ? 'ಉತ್ತರಿಸುತ್ತಿದೆ...' : 'Thinking...'}
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input - Compact */}
          <div className="p-2.5 bg-white border-t border-stone-100 flex flex-col gap-1 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (inputMessage.trim() && !isLoading) {
                  handleSendMessage(inputMessage);
                }
              }}
              className="flex items-center gap-1.5"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (inputMessage.trim() && !isLoading) {
                      handleSendMessage(inputMessage);
                    }
                  }
                }}
                maxLength={500}
                placeholder={isKn ? 'ಕರ್ನಾಟಕ ಪ್ರವಾಸ ಅಥವಾ ಸಹಾಯ ಕೇಳಿ...' : 'Ask about Karnataka travel or website help...'}
                className="flex-1 px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-200/80 focus:border-teal-600 focus:bg-white focus:outline-hidden text-xs text-stone-900 transition-colors placeholder:text-stone-400"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="p-2 rounded-xl bg-[#0f4c5c] hover:bg-[#082f38] disabled:bg-stone-200 disabled:cursor-not-allowed text-white transition-colors cursor-pointer shrink-0 shadow-2xs flex items-center justify-center"
                aria-label="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
            <div className="text-[9px] text-center text-stone-400 leading-tight">
              {isKn 
                ? 'ಅಂದಾಜು ಮಾರ್ಗದರ್ಶನ. ಲೈವ್ ದರಗಳು, ಸಮಯ ಮತ್ತು ನಿಯಮಗಳಿಗಾಗಿ ಅಧಿಕೃತ ಮೂಲಗಳನ್ನು ನೋಡಿ.' 
                : 'Estimates & guidance. Verify live rates, hours & guidelines with official sources.'}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
