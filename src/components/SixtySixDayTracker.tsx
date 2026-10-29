'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SIXTY_SIX_PHASES } from '@/data/initialData';
import { Calendar, Flame, CheckCircle2, Lock, Sparkles, ChevronRight, Award } from 'lucide-react';
import { sounds } from '@/utils/soundEffects';

interface SixtySixDayTrackerProps {
  currentDay: number;
  completedDays: number[];
  streak: number;
  onDayClick?: (day: number) => void;
}

export const SixtySixDayTracker: React.FC<SixtySixDayTrackerProps> = ({
  currentDay = 1,
  completedDays = [1],
  streak = 1,
  onDayClick
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(currentDay);

  const getDayPhase = (day: number) => {
    if (day <= 22) return 1;
    if (day <= 44) return 2;
    return 3;
  };

  const getDayStatusColor = (day: number) => {
    const isCompleted = completedDays.includes(day);
    const isCurrent = day === currentDay;
    const isLocked = day > currentDay;

    if (isCompleted) {
      return 'bg-emerald-500 text-black border-emerald-400 font-black shadow-sm shadow-emerald-500/30';
    }
    if (isCurrent) {
      return 'bg-gradient-to-tr from-amber-500 to-orange-500 text-black border-amber-300 font-black animate-pulse';
    }
    if (isLocked) {
      return 'bg-neutral-950/40 text-neutral-600 border-neutral-900 cursor-not-allowed';
    }
    return 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700';
  };

  const currentPhaseInfo = SIXTY_SIX_PHASES[getDayPhase(selectedDay) - 1];

  return (
    <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl">
      {/* Sarlavha & Fazalar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Calendar className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-black text-white tracking-wide">
              66 KUNLIK TRANSFORMASIYA MATRITSASI
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            UCL (London) tadqiqotiga ko'ra yangi neyron yo'llari to'liq mustahkamlanishi uchun 66 kun zarur
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-xs font-semibold text-orange-400 flex items-center gap-1.5 select-none">
            <Flame className="w-4 h-4 fill-current" />
            <span>Streak: <strong className="text-white">{streak} kun</strong></span>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-400 flex items-center gap-1.5 select-none">
            <Award className="w-4 h-4" />
            <span>Progress: <strong className="text-white">{Math.round((completedDays.length / 66) * 100)}%</strong></span>
          </div>
        </div>
      </div>

      {/* Fazalar tabs indikatori */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 select-none">
        {SIXTY_SIX_PHASES.map((p) => {
          const isActive = getDayPhase(selectedDay) === p.phase;
          return (
            <div
              key={p.phase}
              className={`p-3.5 rounded-2xl border transition-all ${
                isActive
                  ? `${p.bgColor} ring-1 ring-white/20`
                  : 'bg-neutral-950/50 border-neutral-800/80 text-neutral-400'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                <span>FAZA {p.phase}</span>
                <span>{p.days}</span>
              </div>
              <div className="text-xs font-black text-white truncate">
                {p.title.split(' (')[0]}
              </div>
            </div>
          );
        })}
      </div>

      {/* 66 ta kun katakchasi (1 dan 66 gacha to'r) */}
      <div className="grid grid-cols-6 sm:grid-cols-11 gap-2 mb-6 select-none">
        {Array.from({ length: 66 }).map((_, idx) => {
          const day = idx + 1;
          const isSelected = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => {
                sounds.playClick();
                setSelectedDay(day);
                if (onDayClick) onDayClick(day);
              }}
              className={`h-10 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center relative cursor-pointer active:scale-95 ${getDayStatusColor(day)} ${
                isSelected ? 'ring-2 ring-white scale-105 z-10' : ''
              }`}
            >
              <span>{day}</span>
              {completedDays.includes(day) && (
                <span className="w-1 h-1 rounded-full bg-white mt-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tanlangan kun tafsiloti */}
      <motion.div
        key={selectedDay}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              {selectedDay}-kun tafsiloti
            </span>
            <span className="text-[10px] text-neutral-500">•</span>
            <span className="text-xs font-semibold text-neutral-300">
              {currentPhaseInfo.title}
            </span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed max-w-xl">
            {currentPhaseInfo.description}
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 select-none">
          {completedDays.includes(selectedDay) ? (
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Muvaffaqiyatli
            </span>
          ) : selectedDay === currentDay ? (
            <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5">
              <Flame className="w-4 h-4" /> Bugungi kun (Jarayonda)
            </span>
          ) : (
            <span className="px-3 py-1.5 rounded-xl bg-neutral-800 text-neutral-500 text-xs font-semibold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Qulflangan
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
};
