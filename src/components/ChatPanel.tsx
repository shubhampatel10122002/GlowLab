'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/lib/types';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSend: (message: string) => void;
  isLoading: boolean;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

export default function ChatPanel({
  messages,
  onSend,
  isLoading,
  apiKey,
  onApiKeyChange,
}: ChatPanelProps) {
  const [input, setInput] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px';
    }
  }, [input]);

  const handleSubmit = () => {
    if (!input.trim() || isLoading || !apiKey.trim()) return;
    onSend(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0d0d]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-white">GlowLab</h1>
          <p className="text-xs text-white/30 mt-0.5">AI-powered skincare shopping</p>
        </div>
        <button
          onClick={() => setShowApiKey(!showApiKey)}
          className="text-xs text-white/30 hover:text-white/60 transition-colors px-3 py-1.5 rounded-md border border-white/[0.06] hover:border-white/[0.12]"
        >
          {apiKey ? 'API Key Set' : 'Set API Key'}
        </button>
      </div>

      {/* API Key Input */}
      {showApiKey && (
        <div className="px-6 py-3 border-b border-white/[0.06] bg-white/[0.02]">
          <label className="text-[10px] text-white/30 uppercase tracking-wider block mb-1.5">
            Mistral API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            placeholder="Enter your Mistral API key..."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-md px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors"
          />
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full px-6">
            <div className="text-center max-w-md">
              <h2 className="text-xl font-semibold text-white/90 mb-2">
                What can I help you find?
              </h2>
              <p className="text-sm text-white/30 mb-8">
                Tell me about your skin concerns, budget, or what you&apos;re looking for. I&apos;ll negotiate the best deal for you.
              </p>
              <div className="grid grid-cols-1 gap-2">
                {[
                  'I want anti-aging serum but my budget is $45',
                  'I bought your retinol cream and I\'m breaking out, I want a refund',
                  'Why should I buy this when The Ordinary is $12?',
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      if (!apiKey.trim()) {
                        setShowApiKey(true);
                        return;
                      }
                      onSend(suggestion);
                    }}
                    className="text-left text-sm text-white/40 hover:text-white/70 px-4 py-3 rounded-lg border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.02] transition-all"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="px-6 py-4 space-y-6">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] ${
                    msg.role === 'user'
                      ? 'bg-white/[0.08] rounded-2xl rounded-br-sm px-4 py-3'
                      : 'pr-4'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center text-[10px] font-bold text-white">
                        G
                      </div>
                      <span className="text-[10px] text-white/30 font-medium">GlowLab</span>
                    </div>
                  )}
                  <p className={`text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user' ? 'text-white/90' : 'text-white/70'
                  }`}>
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="pr-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center text-[10px] font-bold text-white">
                      G
                    </div>
                    <span className="text-[10px] text-white/30 font-medium">GlowLab</span>
                  </div>
                  <div className="flex items-center gap-1.5 py-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-bounce [animation-delay:0ms]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-bounce [animation-delay:150ms]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-white/[0.06]">
        {!apiKey.trim() && (
          <div className="text-xs text-amber-400/60 mb-2 text-center">
            Set your Mistral API key to start chatting
          </div>
        )}
        <div className="relative flex items-end gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 focus-within:border-white/20 transition-colors">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you're looking for..."
            rows={1}
            disabled={!apiKey.trim()}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/20 focus:outline-none resize-none disabled:opacity-50 leading-relaxed"
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading || !apiKey.trim()}
            className="shrink-0 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-20 disabled:hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white/70"
            >
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
