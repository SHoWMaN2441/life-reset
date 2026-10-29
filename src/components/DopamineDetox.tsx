'use client';

import React, { useState } from 'react';
import { Smartphone, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';
import { sounds } from '@/utils/soundEffects';

export const DopamineDetox: React.FC = () => {
  const [screenHours, setScreenHours] = useState(2.5);
  const [detoxItems, setDetoxItems] = useState([
    { id: 'd1', label: 'Instagram va TikTok reels ko\'rmaslik', done: true },
    { id: 'd2', label: 'Ertalab uyg\'ongach 1 soat telefonsiz yurish', done: true },
    { id: 'd3', label: 'Hech qanday oq shakar va energetik ichmaslik', done: false },
    { id: 'd4', label: 'Video o\'yinlar va keraksiz seriallarsiz kun', done: true }
  ]);

  const toggleItem = (id: string) => {
    sounds.playClick();
    setDetoxItems(prev =>
      prev.map(i => {
        if (i.id === id) {
          const next = !i.done;
          if (next) sounds.playSuccess();
          return { ...i, done: next };
        }
        return i;
      })
    );
  };

  const completedCount = detoxItems.filter(i => i.done).length;

  return (
    <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Smartphone className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base font-bold text-white">DOPAMIN DETOKS</h3>
            <p className="text-xs text-neutral-400">Diqqat va irodani tiklash</p>
          </div>
        </div>

        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
          {completedCount} / {detoxItems.length}
        </span>
      </div>

      {/* Ekran vaqti slaydri */}
      <div className="p-3 bg-neutral-950/70 border border-neutral-800 rounded-2xl mb-4">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-neutral-400">Bugungi ekran vaqti:</span>
          <span className="font-bold text-white">{screenHours} soat</span>
        </div>
        <input
          type="range"
          min="0.5"
          max="8"
          step="0.5"
          value={screenHours}
          onChange={(e) => setScreenHours(parseFloat(e.target.value))}
          className="w-full accent-emerald-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
          <span>0.5 soat (Ideal)</span>
          <span>4+ soat (Xavfli)</span>
        </div>
      </div>

      {/* Detoks qoidalari */}
      <div className="space-y-2">
        {detoxItems.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`p-2.5 rounded-xl border text-xs cursor-pointer select-none flex items-center justify-between transition-all hover:scale-[1.01] active:scale-[0.98] ${
              item.done
                ? 'bg-emerald-950/20 border-emerald-500/30 text-neutral-300'
                : 'bg-neutral-950/40 border-neutral-800 text-neutral-500 hover:border-neutral-700'
            }`}
          >
            <span className={item.done ? 'line-through opacity-80' : ''}>
              {item.label}
            </span>
            <CheckCircle2 className={`w-4 h-4 shrink-0 ${
              item.done ? 'text-emerald-400' : 'text-neutral-700'
            }`} />
          </div>
        ))}
      </div>
    </div>
  );
};
