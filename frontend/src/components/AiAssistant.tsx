import { useState } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import api from '../api/auth';

interface Msg { role: 'user' | 'ai'; text: string; }

export default function AiAssistant() {
  const [open, setOpen]       = useState(false);
  const [msgs, setMsgs]       = useState<Msg[]>([
    { role: 'ai', text: 'Сәлем! Мен FreadZone AI көмекшісімін. Роман іздеуге, тарауларды қорытындылауға немесе кеңес беруге дайынмын!' }
  ]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setMsgs(m => [...m, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);
    try {
      const { data } = await api.post('/ai/chat', { message: userMsg });
      setMsgs(m => [...m, { role: 'ai', text: data.reply }]);
    } catch {
      setMsgs(m => [...m, { role: 'ai', text: 'Кешіріңіз, қате орын алды. Қайта байқап көріңіз.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#1a9e75] rounded-full flex items-center justify-center shadow-lg hover:bg-[#0f6e56] transition-all hover:scale-110">
        {open ? <X size={22} className="text-white" /> : <MessageCircle size={22} className="text-white" />}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 h-[420px] bg-[#1a1d27] border border-[#2a2d3e] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 bg-[#0f1117] border-b border-[#2a2d3e] flex items-center gap-2">
            <Bot size={18} className="text-[#1a9e75]" />
            <span className="text-sm font-medium text-white">AI Көмекші</span>
            <span className="ml-auto text-[10px] text-green-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" /> онлайн
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] text-sm px-3 py-2 rounded-xl leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-[#1a9e75] text-white rounded-br-sm'
                    : 'bg-[#2a2d3e] text-slate-200 rounded-bl-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#2a2d3e] text-slate-400 text-sm px-3 py-2 rounded-xl rounded-bl-sm">
                  <span className="animate-pulse">Жазып жатыр...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-[#2a2d3e] flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Хабарлама жазыңыз..."
              className="flex-1 bg-[#0f1117] border border-[#2a2d3e] rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-[#1a9e75]"
            />
            <button onClick={send} disabled={loading}
              className="w-9 h-9 bg-[#1a9e75] rounded-lg flex items-center justify-center hover:bg-[#0f6e56] transition disabled:opacity-50">
              <Send size={14} className="text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
