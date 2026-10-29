'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, Sparkles, User, Dumbbell, Shield, Compass, HeartPulse } from 'lucide-react';
import { UserProfile } from '@/types';
import { sounds } from '@/utils/soundEffects';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

interface AICoachModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}

const PERSONAS = [
  { id: 'spartan', name: 'Spartan Iroda', icon: Shield, subtitle: 'Qat\'iy intizom va motivatsiya', color: 'text-amber-400 border-amber-500/40 bg-amber-500/10' },
  { id: 'arnold', name: 'Tana & Sport', icon: Dumbbell, subtitle: 'Mushak va jismoniy kuch', color: 'text-red-400 border-red-500/40 bg-red-500/10' },
  { id: 'zen', name: 'Zen & Stoik', icon: Compass, subtitle: 'Ruhiy xotirjamlik va stresssizlik', color: 'text-purple-400 border-purple-500/40 bg-purple-500/10' },
  { id: 'doctor', name: 'AI Nutrisiolog', icon: HeartPulse, subtitle: 'Kaloriya, BJU va salomatlik', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' }
];

export const AICoachModal: React.FC<AICoachModalProps> = ({
  isOpen,
  onClose,
  user
}) => {
  const [selectedPersona, setSelectedPersona] = useState('spartan');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: `Salom ${user.firstName}! Men sizning shaxsiy AI Murabbiyingizman. Bugungi kunlik protokollar, ratsion, sport yoki intizom bo'yicha qanday savolingiz bor?`,
      time: 'Hozir'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    sounds.playClick();
    const userMsg: Message = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.text,
          userProfile: user,
          persona: selectedPersona
        })
      });
      const data = await res.json();

      sounds.playSuccess();
      const aiMsg: Message = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: data.reply || "Albatta, 66 kunlik intizom rejangizga amal qiling!",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const fallbackMsg: Message = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: "Kechirasiz, kichik xatolik yuz berdi. Biroq esingizda bo'lsin: intizom va doimiylik har qanday to'siqni yengadi!",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "Menga kuchli motivatsiya ber!",
    "Bugungi ratsion uchun nima yey?",
    "Mushak o'stirish siri nima?",
    "Dangasalikni qanday yengay?"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-xl h-[680px] bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Chat sarlavhasi */}
        <div className="p-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-black shadow-md shadow-emerald-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">AI Life Coach 2.0</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-neutral-400">Shaxsiy intizom, sport va oziqlanish murabbiyi</p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Persona tanlagich (Spartan, Arnold, Zen, Nutrisiolog) */}
        <div className="p-2.5 bg-neutral-950/70 border-b border-neutral-800/80 flex items-center gap-2 overflow-x-auto select-none">
          {PERSONAS.map((p) => {
            const Icon = p.icon;
            const isSelected = selectedPersona === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  sounds.playClick();
                  setSelectedPersona(p.id);
                }}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer transition-all ${
                  isSelected
                    ? p.color
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{p.name}</span>
              </button>
            );
          })}
        </div>

        {/* Xabarlar maydoni */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs ${
                m.sender === 'user'
                  ? 'bg-neutral-800 text-neutral-200'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-emerald-500 text-black font-semibold rounded-tr-none'
                  : 'bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-tl-none'
              }`}>
                {m.text}
                <div className={`text-[9px] mt-1 text-right ${
                  m.sender === 'user' ? 'text-black/60' : 'text-neutral-500'
                }`}>
                  {m.time}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-neutral-400 italic pl-10">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
              <span>Murabbiy o'ylamoqda...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Tezkor savollar */}
        <div className="px-4 py-2 border-t border-neutral-800/80 bg-neutral-950 flex items-center gap-1.5 overflow-x-auto text-[11px] select-none">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                sounds.playClick();
                setInputText(p);
              }}
              className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-emerald-500 text-neutral-400 hover:text-white cursor-pointer transition-colors shrink-0"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Yozish maydoni */}
        <form onSubmit={handleSend} className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Savolingizni yozing..."
            className="flex-1 px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 disabled:bg-neutral-800 disabled:text-neutral-600 cursor-pointer transition-colors active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </motion.div>
    </div>
  );
};
