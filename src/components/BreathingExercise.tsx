'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Play, Pause, RotateCcw, Heart, Sparkles } from 'lucide-react';
import { sounds } from '@/utils/soundEffects';

type BreathPhase = 'inhale' | 'hold1' | 'exhale' | 'hold2';

export const BreathingExercise: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const [timer, setTimer] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);

  // Box Breathing: 4s inhale -> 4s hold -> 4s exhale -> 4s hold
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev > 1) return prev - 1;

          // Keyingi fazaga o'tish
          setPhase((currentPhase) => {
            if (currentPhase === 'inhale') return 'hold1';
            if (currentPhase === 'hold1') return 'exhale';
            if (currentPhase === 'exhale') return 'hold2';
            // hold2 dan keyin yangi sikl
            setCompletedCycles((c) => c + 1);
            sounds.playSuccess();
            return 'inhale';
          });
          return 4;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const toggleActive = () => {
    sounds.playClick();
    if (!isActive) {
      setIsActive(true);
      setPhase('inhale');
      setTimer(4);
    } else {
      setIsActive(false);
    }
  };

  const handleReset = () => {
    sounds.playClick();
    setIsActive(false);
    setPhase('inhale');
    setTimer(4);
    setCompletedCycles(0);
  };

  const getPhaseInfo = () => {
    switch (phase) {
      case 'inhale':
        return { text: "Chuqur nafas oling (Burnidan)", color: "text-cyan-400", scale: 1.4 };
      case 'hold1':
        return { text: "Nafasni to'liq ushlab turing", color: "text-amber-400", scale: 1.4 };
      case 'exhale':
        return { text: "Sekin nafas chiqaring (Og'izdan)", color: "text-emerald-400", scale: 0.85 };
      case 'hold2':
        return { text: "Bo'sh o'pkada ushlab turing", color: "text-purple-400", scale: 0.85 };
    }
  };

  const currentInfo = getPhaseInfo();

  return (
    <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between">
      {/* Sarlavha */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-teal-500/20 text-teal-400">
            <Wind className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base font-bold text-white">BOX BREATHING (ANTISTRESS)</h3>
            <p className="text-xs text-neutral-400">Navy SEALs texnikasi: 2 daqiqada asabni tinchlantirish</p>
          </div>
        </div>

        <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-xl border border-teal-500/20">
          {completedCycles} sikl
        </span>
      </div>

      {/* Pulsatsiyalanuvchi Golografik Sfera */}
      <div className="relative py-6 flex flex-col items-center justify-center my-1 overflow-hidden">
        <motion.div
          animate={{
            scale: isActive ? currentInfo.scale : 1,
            rotate: isActive ? 180 : 0
          }}
          transition={{ duration: 4, ease: "easeInOut" }}
          className="relative w-36 h-36 rounded-full flex items-center justify-center border-2 border-teal-400/50 bg-gradient-to-tr from-teal-500/20 via-cyan-500/15 to-emerald-500/20 backdrop-blur-md shadow-[0_0_35px_rgba(20,184,166,0.25)]"
        >
          {/* Ichki yorug'lik yadrosi */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-400/40 to-teal-300/40 blur-md animate-pulse" />

          {/* Markaziy raqam */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-4xl font-black text-white font-mono drop-shadow">
              {isActive ? timer : "4s"}
            </span>
          </div>
        </motion.div>

        {/* Faza yozuvi */}
        <div className="mt-4 text-center">
          <span className={`text-xs font-bold uppercase tracking-wider block ${isActive ? currentInfo.color : 'text-neutral-400'}`}>
            {isActive ? currentInfo.text : "Mashqni boshlash uchun tugmani bosing"}
          </span>
          <span className="text-[10px] text-neutral-500 mt-0.5 block">
            4-4-4-4 formulasi: Stress gormoni (kortizol)ni 40% ga kamaytiradi
          </span>
        </div>
      </div>

      {/* Boshqaruv tugmalari */}
      <div className="flex items-center justify-center gap-3 mt-2">
        <button
          onClick={toggleActive}
          className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-lg active:scale-95 ${
            isActive
              ? 'bg-amber-500 text-black hover:bg-amber-400'
              : 'bg-teal-500 text-black hover:bg-teal-400 shadow-teal-500/25'
          }`}
        >
          {isActive ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>To'xtatish</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Nafas mashqini boshlash</span>
            </>
          )}
        </button>

        <button
          onClick={handleReset}
          className="p-2.5 rounded-xl border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer transition-colors"
          title="Qayta o'rnatish"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
