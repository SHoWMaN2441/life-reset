'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '@/utils/soundEffects';

interface DayCompletionModalProps {
  isOpen: boolean;
  dayNumber: number;
  streak: number;
  onNextDay: () => void;
  onClose: () => void;
}

export const DayCompletionModal: React.FC<DayCompletionModalProps> = ({
  isOpen,
  dayNumber,
  streak,
  onNextDay,
  onClose
}) => {
  if (!isOpen) return null;

  const handleAdvance = () => {
    sounds.playLevelUp();
    try {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 }
      });
    } catch (e) {}
    onNextDay();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center overflow-hidden"
      >
        <div className="absolute -top-20 -left-20 w-44 h-44 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-44 h-44 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-black flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/25">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>KUN MUZORASI</span>
          </div>

          <h3 className="text-2xl font-black text-white">
            {dayNumber}-KUN 100% G'ALABA!
          </h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
            Siz bugungi barcha protokollarni muvaffaqiyatli yakunladingiz. Neyron aloqalaringiz yana bir qadam mustahkamlandi.
          </p>

          <div className="my-6 p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800 grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">Olingan XP</span>
              <span className="text-xl font-black text-amber-400">+250 XP</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">Yangi Streak</span>
              <span className="text-xl font-black text-orange-400 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 fill-current" /> {streak + 1} kun
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleAdvance}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <span>{dayNumber + 1}-KUNNI OCHISH VA DAVOM ETISH</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl border border-neutral-800 text-neutral-400 hover:text-white text-xs font-semibold"
            >
              Bugungi kunda qolish
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
