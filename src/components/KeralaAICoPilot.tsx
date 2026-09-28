import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  X,
  Minimize2,
  Maximize2,
  Compass,
  FileText,
  MessageSquare,
  AlertCircle,
  Copy,
  Check,
  RotateCcw,
} from 'lucide-react';
import { useAgency } from '../context/AgencyContext';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  source?: 'ai' | 'fallback';
}

interface KeralaAICoPilotProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLeadModal?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const KeralaAICoPilot: React.FC<KeralaAICoPilotProps> = ({
  isOpen,
  onClose,
  onOpenLeadModal,
  onNavigateTab,
}) => {
  const { leads, bookings, packages, hotels, followUps, currentUser } = useAgency();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'model',
      content: `🙏 **Namaskaram ${currentUser.name}!**\n\nI am your **Kerala Voyage AI Co-pilot**. I have direct visibility into your agency's **${leads.length} active leads**, **${bookings.length} bookings**, **${packages.length} tour packages**, and **${hotels.length} partner hotels** across God's Own Country.\n\nHow can I help you today? You can ask me to:\n• *Draft a personalized WhatsApp quote for any lead*\n• *Generate a customized Kerala day-wise itinerary*\n• *Check driving logistics (e.g., Cochin to Munnar travel time)*\n• *Recommend hotels & houseboat guidelines for guests*\n• *Analyze overdue follow-ups or team conversion rates*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        scrollToBottom();
      }, 100);
    }
  }, [isOpen, messages]);

  const quickPrompts = [
    'How many pending follow-ups do we have today?',
    'Create a 5-day Munnar & Alleppey itinerary with timings',
    'Draft a WhatsApp quote for Vikram Sharma',
    'What is driving time from Munnar to Thekkady?',
    'What are the government rules for Alleppey houseboats?',
    'Which 4-Star hotels do we have in Munnar?',
  ];

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    // Build context summary from live agency state
    const todayStr = new Date().toISOString().split('T')[0];
    const pendingFollowUps = followUps.filter((f) => f.status === 'Pending');
    const overdueFollowUps = pendingFollowUps.filter((f) => f.followUpDate < todayStr);
    const todayFollowUps = pendingFollowUps.filter((f) => f.followUpDate === todayStr);

    const agencyContext = {
      userRole: currentUser.role,
      userName: currentUser.name,
      stats: {
        totalLeads: leads.length,
        newLeads: leads.filter((l) => l.stage === 'New Lead').length,
        quotesSent: leads.filter((l) => l.stage === 'Quote Sent').length,
        confirmedLeads: leads.filter((l) => l.stage === 'Confirmed').length,
        totalBookings: bookings.length,
        pendingFollowUpsCount: pendingFollowUps.length,
        todayFollowUpsCount: todayFollowUps.length,
        overdueFollowUpsCount: overdueFollowUps.length,
      },
      sampleLeads: leads.slice(0, 5).map((l) => ({
        id: l.id,
        name: l.customerName,
        phone: l.whatsappNumber,
        destination: l.destination,
        stage: l.stage,
        budget: l.budget,
        dates: `${l.travelStartDate} to ${l.travelEndDate}`,
        assignedTo: l.assignedSalespersonName,
      })),
      packages: packages.map((p) => ({
        name: p.name,
        destination: p.destination,
        days: p.durationDays,
        price: p.startingPrice,
      })),
      hotels: hotels.map((h) => ({
        name: h.name,
        location: h.location,
        category: h.category,
        rate: h.ratePerNight,
      })),
    };

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
          contextData: agencyContext,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      const botReply: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: data.reply || 'I am on standby to assist with your Kerala travel operations.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const fallbackReply: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: `I'm here to assist with Kerala tours! Currently reviewing your agency's **${leads.length} leads** and **${packages.length} packages**. Please ask me about itineraries, vehicle routes, houseboat check-in times, or customer follow-ups!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'init-reset',
        role: 'model',
        content: `Conversation reset. Ready to assist you with Kerala Voyage operations, itineraries, quotations, or guest communications! 🌴`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed z-50 transition-all duration-300 shadow-2xl flex flex-col bg-white border border-emerald-100 rounded-2xl overflow-hidden ${
        isExpanded
          ? 'inset-4 md:inset-10'
          : 'bottom-4 right-4 md:bottom-6 md:right-6 w-[94vw] sm:w-[480px] h-[640px] max-h-[88vh]'
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white px-4 py-3.5 flex items-center justify-between shadow-md select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center text-emerald-200">
            <Bot className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-sm text-white">
              <span>Kerala AI Co-pilot</span>
              <span className="text-[10px] uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.5 rounded-full font-medium">
                Gemini 3.8
              </span>
            </div>
            <div className="text-[11px] text-emerald-200/80 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Tour Agent & Operations Assistant</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleClearHistory}
            title="Reset Chat"
            className="p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-700/50 rounded-lg transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Restore' : 'Expand'}
            className="p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-700/50 rounded-lg transition hidden sm:block"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            title="Close Assistant"
            className="p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-700/50 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="bg-emerald-50/70 border-b border-emerald-100 px-3 py-2 overflow-x-auto no-scrollbar flex items-center gap-1.5 text-xs text-emerald-800">
        <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-1" />
        <span className="font-semibold shrink-0 text-emerald-900 mr-1">Suggestions:</span>
        {quickPrompts.slice(0, 4).map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="shrink-0 bg-white hover:bg-emerald-100 border border-emerald-200 text-emerald-800 px-2.5 py-1 rounded-full text-[11px] transition shadow-2xs font-medium cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/60">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`group relative max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-emerald-700 text-white rounded-tr-none shadow-sm'
                    : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none shadow-2xs'
                }`}
              >
                <div className="whitespace-pre-line font-normal">{msg.content}</div>

                <div
                  className={`mt-1.5 flex items-center justify-between text-[10px] ${
                    isUser ? 'text-emerald-200' : 'text-slate-400'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="opacity-0 group-hover:opacity-100 ml-2 p-1 hover:text-emerald-700 transition rounded flex items-center gap-1 text-[10px]"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-2.5 justify-start">
            <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-0.5">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-2xs text-xs text-slate-500 flex items-center gap-2">
              <span className="flex space-x-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></span>
              </span>
              <span className="font-medium text-emerald-800">Thinking & consulting Kerala travel data...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Agency Quick Actions Drawer */}
      <div className="bg-slate-100 border-t border-slate-200/80 px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-600">
        <span className="font-medium text-slate-500">Quick Links:</span>
        <div className="flex items-center gap-2">
          {onOpenLeadModal && (
            <button
              onClick={onOpenLeadModal}
              className="text-emerald-700 hover:text-emerald-800 font-semibold hover:underline flex items-center gap-1"
            >
              + Create Lead
            </button>
          )}
          {onNavigateTab && (
            <>
              <span className="text-slate-300">|</span>
              <button
                onClick={() => onNavigateTab('itinerary')}
                className="hover:text-emerald-700 transition"
              >
                Itineraries
              </button>
              <span className="text-slate-300">|</span>
              <button
                onClick={() => onNavigateTab('whatsapp')}
                className="hover:text-emerald-700 transition"
              >
                WhatsApp Hub
              </button>
            </>
          )}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask Kerala AI anything (e.g. quote, itinerary, hotels)..."
          className="flex-1 bg-slate-100/90 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2.5 rounded-xl transition shadow-sm shrink-0 flex items-center justify-center cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
