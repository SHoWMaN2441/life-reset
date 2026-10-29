'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Droplet, Plus, Minus, Sparkles } from 'lucide-react';
import { sounds } from '@/utils/soundEffects';

interface WaterTrackerProps {
  currentMl: number;
  goalMl: number;
  onUpdate: (newMl: number) => void;
}

export const WaterTracker: React.FC<WaterTrackerProps> = ({
  currentMl = 1250,
  goalMl = 2500,
  onUpdate
}) => {
  const percent = Math.min(100, Math.round((currentMl / goalMl) * 100));

  const addWater = (amount: number) => {
    sounds.playClick();
    const next = Math.max(0, currentMl + amount);
    onUpdate(next);
    if (next >= goalMl && currentMl < goalMl) {
      sounds.playSuccess();
    }
  };

  return (
    <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
            <Droplet className="w-5 h-5 fill-current" />
          </span>
          <div>
            <h3 className="text-base font-bold text-white">SUV BALANSI (HYDRATION)</h3>
            <p className="text-xs text-neutral-400">Metabolizm va energiya uchun</p>
          </div>
        </div>

        <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-xl border border-cyan-500/20">
          {percent}%
        </span>
      </div>

      {/* Interaktiv suv idishi animatsiyasi */}
      <div className="my-3 flex items-center justify-center gap-6">
        <div className="relative w-24 h-36 rounded-2xl border-2 border-cyan-500/40 bg-neutral-950 overflow-hidden flex flex-col justify-end p-1 shadow-inner select-none">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${percent}%` }}
            transition={{ type: 'spring', damping: 15 }}
            className="w-full bg-gradient-to-t from-cyan-600 to-blue-400 rounded-xl relative opacity-85"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/40 blur-[1px]" />
          </motion.div>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-lg font-black text-white drop-shadow-md">
              {currentMl}
            </span>
            <span className="text-[10px] text-white/80 font-bold">
              / {goalMl} ml
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => addWater(250)}
            className="w-full px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" /> +250 ml (1 stakan)
          </button>
          <button
            onClick={() => addWater(500)}
            className="w-full px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" /> +500 ml (Katta shisha)
          </button>
          <button
            onClick={() => addWater(-250)}
            disabled={currentMl <= 0}
            className="w-full px-3 py-1.5 rounded-xl border border-neutral-800 text-[11px] text-neutral-400 hover:text-neutral-200 cursor-pointer disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1"
          >
            <Minus className="w-3 h-3" /> -250 ml
          </button>
        </div>
      </div>

      <div className="text-[11px] text-neutral-400 text-center mt-2">
        💧 Har 1 soatda 1 stakan suv ichish miya faoliyatini 14% ga oshiradi.
      </div>
    </div>
  );
};
