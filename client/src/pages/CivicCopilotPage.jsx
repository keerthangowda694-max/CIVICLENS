import React, { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';
import {
  Bot,
  Sparkles,
  Send,
  User,
  ArrowRight,
  HelpCircle,
  Flame,
  Layers,
  MapPin,
  Clock
} from 'lucide-react';

export default function CivicCopilotPage({ setRoute }) {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Welcome to the **Civic Lens AI Copilot**!\n\nI am connected directly to the city\'s live civic database and spatial clustering engine. You can query active road hazards, neighborhood metrics, explain AI priority scores, or inspect resolution progress.',
      suggestedActions: [
        'What is happening near me?',
        'Show unresolved road issues',
        'Why is this issue high priority?',
        'How does intelligent clustering work?'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (query) => {
    const text = query || inputValue;
    if (!text.trim() || loading) return;

    setMessages((prev) => [...prev, { sender: 'user', text }]);
    setInputValue('');
    setLoading(true);

    try {
      const res = await api.askCopilot(text);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: res.reply,
          suggestedActions: res.suggestedActions || []
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Error connecting to Civic Copilot core. Please try again.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (action) => {
    if (action.includes('Map')) {
      setRoute('/map');
    } else if (action.includes('Report')) {
      setRoute('/report');
    } else if (action.includes('Queue')) {
      setRoute('/admin');
    } else {
      handleSend(action);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 h-[calc(100vh-100px)] flex flex-col space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black text-white">Civic Lens AI Copilot</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400">Contextual Conversational Civic Intelligence</p>
          </div>
        </div>

        <button
          onClick={() => setRoute('/map')}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white border border-slate-700 transition-colors"
        >
          View Map
        </button>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto glass-panel p-4 sm:p-6 rounded-3xl border border-slate-800 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-start space-x-3 max-w-[85%]">
              {msg.sender === 'bot' && (
                <div className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0 mt-1 border border-cyan-500/30">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}
              
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-tr-none shadow-lg'
                    : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>

            {/* Prompt Suggestion Chips */}
            {msg.suggestedActions && msg.suggestedActions.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2 pl-10">
                {msg.suggestedActions.map((action, aIdx) => (
                  <button
                    key={aIdx}
                    onClick={() => handleAction(action)}
                    className="text-xs px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-cyan-500/20 text-cyan-300 border border-slate-700 hover:border-cyan-500/40 transition-colors flex items-center space-x-1.5"
                  >
                    <span>{action}</span>
                    <ArrowRight className="w-3 h-3 text-cyan-400" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-cyan-400 text-xs pl-10">
            <Bot className="w-4 h-4 animate-bounce" />
            <span>Civic Lens is consulting live urban telemetry...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="glass-panel p-2.5 rounded-2xl border border-slate-800 flex items-center space-x-2"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask a question (e.g. 'What is happening near me?', 'Show unresolved road issues')..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || loading}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 disabled:opacity-40 text-navy-900 font-bold text-sm shadow-md transition-all flex items-center space-x-1"
        >
          <span>Ask</span>
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
