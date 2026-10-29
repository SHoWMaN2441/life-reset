'use client';

import React, { useState } from 'react';
import { BookOpen, Smile, Sparkles, Check } from 'lucide-react';
import { sounds } from '@/utils/soundEffects';

export const JournalReflection: React.FC = () => {
  const [gratitude1, setGratitude1] = useState('');
  const [gratitude2, setGratitude2] = useState('');
  const [winOfDay, setWinOfDay] = useState('');
  const [mood, setMood] = useState<'olov' | 'baxtli' | 'xotirjam' | 'charchagan'>('olov');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playSuccess();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-pink-500/20 text-pink-400">
            <BookOpen className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base font-bold text-white">MINNATDORCHILIK & KUNDALIK</h3>
            <p className="text-xs text-neutral-400">Ruhiy xotirjamlik va kun yakuni</p>
          </div>
        </div>

        {/* Kayfiyat belgilash */}
        <div className="flex items-center gap-1">
          {[
            { id: 'olov', icon: '🔥', label: 'Olov' },
            { id: 'baxtli', icon: '⚡', label: 'Faol' },
            { id: 'xotirjam', icon: '🧘', label: 'Xotirjam' },
            { id: 'charchagan', icon: '😴', label: 'Toliqqan' },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                sounds.playClick();
                setMood(m.id as any);
              }}
              className={`p-1.5 rounded-lg text-sm cursor-pointer transition-transform ${
                mood === m.id ? 'bg-neutral-800 scale-110' : 'opacity-50 hover:opacity-100'
              }`}
              title={m.label}
            >
              {m.icon}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-2.5">
        <div>
          <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
            Bugun minnatdor bo'lgan 2 ta narsangiz:
          </label>
          <input
            type="text"
            placeholder="1. Erta tongda rejalashtirgan ishimni boshlay oldim..."
            value={gratitude1}
            onChange={(e) => setGratitude1(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-pink-500 mb-1.5"
          />
          <input
            type="text"
            placeholder="2. Salomatligim va yangi bilimlarim uchun..."
            value={gratitude2}
            onChange={(e) => setGratitude2(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-pink-500"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
            Bugungi eng katta shaxsiy g'alabangiz:
          </label>
          <input
            type="text"
            placeholder="Masalan: Dangasalikni yengib sport mashqini qildim"
            value={winOfDay}
            onChange={(e) => setWinOfDay(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-pink-500"
          />
        </div>

        <button
          type="submit"
          className="w-full mt-2 py-2 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/30 text-xs font-bold cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          {isSaved ? (
            <>
              <Check className="w-4 h-4" /> <span>Kundalikka saqlandi!</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" /> <span>Kechki xulosani saqlash</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
