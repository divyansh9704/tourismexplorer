import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';

export default function AIAssistantModal({ isOpen, onClose, locationName }) {
  const [messages, setMessages] = useState([
    { role: 'model', text: `Hi! I'm your AI travel guide. What would you like to know about ${locationName}?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setMessages([
        { role: 'model', text: `Hi! I'm your AI travel guide. What would you like to know about ${locationName}?` }
      ]);
    }
  }, [isOpen, locationName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      // Build history for OpenRouter (OpenAI format)
      const formattedMessages = messages.map(msg => ({
        role: msg.role === 'model' ? 'assistant' : 'user',
        content: msg.text
      }));
      
      // Inject system context to guide the assistant implicitly
      const systemContext = {
        role: 'system',
        content: `You are an expert, helpful AI travel guide. The user is currently exploring or planning a trip to ${locationName}. Provide concise, strictly accurate, and factual travel recommendations. DO NOT make up or hallucinate any information. If you do not know a specific detail, state that clearly.`
      };

      // Append user's actual message
      formattedMessages.push({
        role: 'user',
        content: userMessage
      });

      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      if (!apiKey) {
         throw new Error("OpenRouter API Key missing");
      }

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'http://localhost:5173', 
          'X-Title': 'Tourism Explorer'
        },
        body: JSON.stringify({ 
          model: 'meta-llama/llama-3.3-70b-instruct:free',
          messages: [systemContext, ...formattedMessages],
          temperature: 0.3
        })
      });

      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error.message || "API Error");
      }

      const aiResponse = data?.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that right now.";
      
      setMessages(prev => [...prev, { role: 'model', text: aiResponse }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: `Error: ${err.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Function to safely format markdown bold tags **text** into simple HTML <b>text</b>
  const formatText = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col h-[650px] max-h-[85vh] animate-in zoom-in-95 duration-300 relative">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-sky-600 p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
              <Sparkles className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">AI Travel Assistant</h3>
              <p className="text-indigo-100 text-xs font-medium">Planning for {locationName}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-indigo-600" />
                </div>
              )}
              
              <div className={`max-w-[80%] rounded-2xl p-3.5 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user' 
                  ? 'bg-sky-600 text-white rounded-tr-sm' 
                  : 'bg-white border border-slate-200 text-slate-700 shadow-sm rounded-tl-sm'
              }`}>
                {formatText(msg.text)}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4 text-sky-600" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-1">
                <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
              </div>
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl rounded-tl-sm p-3.5 flex gap-1 items-center">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100 shrink-0">
          <div className="flex items-center gap-2 relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about itineraries, hidden gems, food..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-indigo-400 focus:bg-white transition-colors"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
