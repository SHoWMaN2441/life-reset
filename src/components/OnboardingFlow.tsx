'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ONBOARDING_QUESTIONS, SIXTY_SIX_PHASES } from '@/data/initialData';
import { HexagonStats, UserProfile } from '@/types';
import { HexagonRadar } from './HexagonRadar';
import { ArrowLeft, ArrowRight, CheckCircle2, Flame, Award, Zap, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OnboardingFlowProps {
  user: UserProfile;
  onFinish: (stats: HexagonStats, selectedGoal: string, answers: any) => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ user, onFinish }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [stats, setStats] = useState<HexagonStats>({
    tana: 45,
    aql: 50,
    intizom: 40,
    ruhiyat: 55,
    moliya: 45,
    odatlar: 40
  });
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ = ONBOARDING_QUESTIONS[currentIdx];
  const progressPercent = Math.round(((currentIdx + 1) / ONBOARDING_QUESTIONS.length) * 100);

  const handleSelectOption = (optionIdx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [currentQ.id]: optionIdx }));
    const opt = currentQ.options[optionIdx];

    // Statsni yangilash
    setStats(prev => ({
      tana: Math.min(100, Math.max(20, prev.tana + (opt.statsImpact.tana || 0))),
      aql: Math.min(100, Math.max(20, prev.aql + (opt.statsImpact.aql || 0))),
      intizom: Math.min(100, Math.max(20, prev.intizom + (opt.statsImpact.intizom || 0))),
      ruhiyat: Math.min(100, Math.max(20, prev.ruhiyat + (opt.statsImpact.ruhiyat || 0))),
      moliya: Math.min(100, Math.max(20, prev.moliya + (opt.statsImpact.moliya || 0))),
      odatlar: Math.min(100, Math.max(20, prev.odatlar + (opt.statsImpact.odatlar || 0))),
    }));
  };

  const handleNext = () => {
    if (selectedAnswers[currentQ.id] === undefined) return;

    if (currentIdx < ONBOARDING_QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      // Barcha savollar tugadi!
      setIsCompleted(true);
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  const handleStartProgram = () => {
    // 1-savoldan tanlangan asosiy maqsad
    const firstQAns = selectedAnswers[1] !== undefined ? selectedAnswers[1] : 0;
    let goal: any = 'barchasi';
    if (firstQAns === 0) goal = 'tana';
    else if (firstQAns === 1) goal = 'intizom';
    else if (firstQAns === 2) goal = 'aql';
    else if (firstQAns === 3) goal = 'ruhiyat';
    else if (firstQAns === 4) goal = 'moliya';

    onFinish(stats, goal, selectedAnswers);
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-black text-white p-4 sm:p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-4xl bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-2xl"
        >
          {/* Sarlavha */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Diagnostika to'liq yakunlandi</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Tabriklaymiz, <span className="text-emerald-400">{user.firstName}</span>!
            </h1>
            <p className="text-sm text-neutral-400 max-w-lg mx-auto mt-2">
              Sizning javoblaringiz asosida <strong className="text-white">66 kunlik shaxsiy Life Reset rejasi</strong> tuzildi. Quyida 6 burchakli potentsial o'sish diagrammangiz:
            </p>
          </div>

          {/* Diagramma va Faza kartasi */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8">
            <div className="lg:col-span-6 flex justify-center">
              <HexagonRadar
                stats={stats}
                targetStats={{
                  tana: Math.min(100, stats.tana + 35),
                  aql: Math.min(100, stats.aql + 30),
                  intizom: Math.min(100, stats.intizom + 40),
                  ruhiyat: Math.min(100, stats.ruhiyat + 25),
                  moliya: Math.min(100, stats.moliya + 30),
                  odatlar: Math.min(100, stats.odatlar + 35)
                }}
                size={340}
              />
            </div>

            <div className="lg:col-span-6 space-y-4">
              <h3 className="text-sm font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                66 Kunlik Ilmiy Rivojlanish Fazalari:
              </h3>

              {SIXTY_SIX_PHASES.map((phase) => (
                <div
                  key={phase.phase}
                  className={`p-4 rounded-2xl border ${phase.bgColor} transition-all hover:scale-[1.01]`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black uppercase tracking-wider">
                      Faza {phase.phase} ({phase.days})
                    </span>
                    <span className="text-[11px] font-semibold opacity-80">
                      {phase.tagline}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">
                    {phase.title}
                  </h4>
                  <p className="text-xs opacity-90 leading-relaxed text-neutral-300">
                    {phase.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Dasturni boshlash tugmasi */}
          <div className="text-center pt-4 border-t border-neutral-800">
            <button
              onClick={handleStartProgram}
              className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-black font-extrabold text-base rounded-2xl shadow-xl shadow-emerald-500/30 hover:brightness-110 active:scale-[0.98] transition-all inline-flex items-center justify-center gap-3"
            >
              <span>1-KUNNI BOSHLASH VA KUNLIK PROTOKOLNI OCHISH</span>
              <Zap className="w-5 h-5 fill-current" />
            </button>
            <p className="text-[11px] text-neutral-500 mt-2">
              66 kun davomida har kuni shaxsiy vazifalar, AI kaloriya va sport rejasi beriladi.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8 flex flex-col justify-between">
      {/* Yuqori qism: Progress Bar */}
      <div className="w-full max-w-4xl mx-auto pt-4 mb-6">
        <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-semibold text-neutral-300">
              Savol {currentIdx + 1} / {ONBOARDING_QUESTIONS.length}
            </span>
          </div>
          <span className="text-emerald-400 font-bold">{progressPercent}% tayyor</span>
        </div>
        <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Asosiy savol kartochkasi */}
      <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col justify-center my-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                Life Reset Diagnostikasi
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1 leading-snug">
                {currentQ.question}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                {currentQ.subtitle}
              </p>
            </div>

            {/* Variantlar ro'yxati */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {currentQ.options.map((option, optIdx) => {
                const isSelected = selectedAnswers[currentQ.id] === optIdx;
                return (
                  <motion.button
                    key={optIdx}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`text-left p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                      isSelected
                        ? 'bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border-emerald-500 shadow-lg shadow-emerald-500/10'
                        : 'bg-neutral-900/70 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl shrink-0 p-2 rounded-xl bg-neutral-800/60">
                      {option.icon}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm sm:text-base font-bold text-white">
                          {option.label}
                        </h4>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                        {option.description}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pastki navigatsiya tugmalari */}
      <div className="w-full max-w-4xl mx-auto pb-6 pt-4 border-t border-neutral-900 flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentIdx === 0}
          className={`px-4 py-2.5 rounded-xl border border-neutral-800 text-xs font-semibold flex items-center gap-2 transition-all ${
            currentIdx === 0
              ? 'opacity-30 cursor-not-allowed text-neutral-600'
              : 'text-neutral-300 hover:bg-neutral-900 hover:border-neutral-700'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Orqaga</span>
        </button>

        <button
          onClick={handleNext}
          disabled={selectedAnswers[currentQ.id] === undefined}
          className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
            selectedAnswers[currentQ.id] !== undefined
              ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20 active:scale-95'
              : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
          }`}
        >
          <span>
            {currentIdx === ONBOARDING_QUESTIONS.length - 1
              ? 'Natijani ko\'rish'
              : 'Keyingi savol'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
