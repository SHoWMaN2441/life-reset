'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WorkoutExercise } from '@/types';
import { WORKOUT_ROUTINES } from '@/data/initialData';
import { Dumbbell, Play, Pause, RotateCcw, CheckCircle, Flame, Clock, Trophy, Activity } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '@/utils/soundEffects';

interface WorkoutPlannerProps {
  onCompleteWorkout?: (xpGained: number) => void;
}

export const WorkoutPlanner: React.FC<WorkoutPlannerProps> = ({ onCompleteWorkout }) => {
  const [exercises, setExercises] = useState<WorkoutExercise[]>(WORKOUT_ROUTINES);
  const [activeExerciseIdx, setActiveExerciseIdx] = useState<number | null>(null);
  const [currentSet, setCurrentSet] = useState(1);
  const [restSeconds, setRestSeconds] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [workoutFinished, setWorkoutFinished] = useState(false);

  // Dam olish taymeri
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isResting && restSeconds > 0) {
      timer = setInterval(() => {
        setRestSeconds((prev) => prev - 1);
      }, 1000);
    } else if (isResting && restSeconds === 0) {
      setIsResting(false);
      sounds.playSuccess();
    }
    return () => clearInterval(timer);
  }, [isResting, restSeconds]);

  const handleStartExercise = (idx: number) => {
    sounds.playClick();
    setActiveExerciseIdx(idx);
    setCurrentSet(1);
    setIsResting(false);
  };

  const handleNextSet = (ex: WorkoutExercise) => {
    sounds.playClick();
    if (currentSet < ex.sets) {
      setCurrentSet(prev => prev + 1);
      setRestSeconds(ex.restSeconds);
      setIsResting(true);
    } else {
      sounds.playSuccess();
      const updated = [...completedExercises, ex.id];
      setCompletedExercises(updated);
      setActiveExerciseIdx(null);
      setIsResting(false);

      if (updated.length === exercises.length) {
        setWorkoutFinished(true);
        sounds.playLevelUp();
        if (onCompleteWorkout) onCompleteWorkout(150);
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {
          console.log(e);
        }
      }
    }
  };

  return (
    <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl">
      {/* Sarlavha */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-red-500/20 text-red-400">
              <Dumbbell className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-black text-white tracking-wide">
              MAXSUS SPORT DASTURI
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Tana mushaklarini rivojlantirish, quvvat va chidamlilik uchun shaxsiy reja
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-semibold text-neutral-300 flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <span>Kutilayotgan sarf: <strong className="text-white">~320 kcal</strong></span>
          </div>
        </div>
      </div>

      {/* Mashg'ulot to'liq tugaganda */}
      {workoutFinished ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 text-center rounded-2xl bg-gradient-to-r from-red-500/20 via-orange-500/20 to-amber-500/20 border border-red-500/30"
        >
          <div className="inline-flex p-3 rounded-2xl bg-red-500/30 text-red-400 mb-3">
            <Trophy className="w-8 h-8" />
          </div>
          <h4 className="text-2xl font-black text-white mb-2">
            BUGUNGI MASHG'ULOT YAKUNLANDI!
          </h4>
          <p className="text-sm text-neutral-300 max-w-md mx-auto mb-4">
            Barcha 6 ta mashqni to'liq yakunladingiz. Mushaklaringiz kuchaydi va 320 kaloriya yoqildi.
          </p>
          <span className="inline-flex px-4 py-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold text-sm">
            +150 XP Olingan
          </span>
        </motion.div>
      ) : activeExerciseIdx !== null ? (
        // Faol mashg'ulot rejimi
        (() => {
          const ex = exercises[activeExerciseIdx];
          return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl bg-neutral-950 border border-red-500/40"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[11px] font-bold text-red-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 animate-pulse" />
                    <span>Mashq {activeExerciseIdx + 1} / {exercises.length}</span>
                  </span>
                  <h4 className="text-xl font-black text-white mt-0.5">
                    {ex.name}
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    🎯 Mo'ljal: {ex.targetMuscle} | Takror: <strong className="text-white">{ex.reps}</strong>
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black text-emerald-400">
                    {currentSet} / {ex.sets}
                  </div>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider">
                    To'plam (Podxod)
                  </span>
                </div>
              </div>

              {/* Dam olish taymeri yoki Animatsion tana ko'rinishi */}
              {isResting ? (
                <div className="my-6 p-6 rounded-xl bg-neutral-900/90 border border-neutral-800 text-center">
                  <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">
                    Dam olish vaqti
                  </span>
                  <div className="text-5xl font-black text-amber-400 my-2 font-mono">
                    {restSeconds}s
                  </div>
                  <p className="text-xs text-neutral-400">
                    Chuqur nafas oling va keyingi to'plamga tayyorlaning
                  </p>
                  <button
                    onClick={() => setIsResting(false)}
                    className="mt-3 px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300 cursor-pointer transition-colors"
                  >
                    Taymerni o'tkazib yuborish
                  </button>
                </div>
              ) : (
                <div className="my-6 p-4 rounded-xl bg-neutral-900/50 border border-neutral-800/80 text-xs text-neutral-300 leading-relaxed flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                    <Dumbbell className="w-6 h-6 animate-bounce" />
                  </div>
                  <div>
                    <strong className="text-white block mb-0.5">Texnika va biomexanika:</strong>
                    <span>{ex.instructions}</span>
                  </div>
                </div>
              )}

              {/* Boshqaruv tugmalari */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveExerciseIdx(null)}
                  className="px-4 py-3 rounded-xl border border-neutral-800 text-xs font-semibold text-neutral-400 hover:bg-neutral-900 cursor-pointer transition-colors"
                >
                  Chiqish
                </button>
                <button
                  onClick={() => handleNextSet(ex)}
                  className="flex-1 py-3.5 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-white font-black text-sm rounded-xl shadow-lg shadow-red-500/20 cursor-pointer active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>
                    {currentSet < ex.sets ? `${currentSet}-to'plamni yakunlash` : "Mashqni to'liq yakunlash"}
                  </span>
                </button>
              </div>
            </motion.div>
          );
        })()
      ) : (
        // Mashqlar ro'yxati
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {exercises.map((ex, idx) => {
            const isDone = completedExercises.includes(ex.id);
            return (
              <div
                key={ex.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between hover:scale-[1.01] ${
                  isDone
                    ? 'bg-emerald-950/20 border-emerald-500/30 opacity-70'
                    : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white">
                      #{idx + 1} {ex.name}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                      {ex.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-neutral-400 mb-3">
                    <span className="text-white font-medium">{ex.sets} to'plam × {ex.reps}</span>
                    <span>•</span>
                    <span>{ex.targetMuscle}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-900 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Dam: {ex.restSeconds}s
                  </span>

                  {isDone ? (
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Bajarildi
                    </span>
                  ) : (
                    <button
                      onClick={() => handleStartExercise(idx)}
                      className="px-3.5 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Boshlash</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
