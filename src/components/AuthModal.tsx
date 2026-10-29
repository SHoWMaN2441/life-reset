'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile } from '@/types';
import { User, Sparkles, Scale, ArrowRight, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onComplete: (profile: Partial<UserProfile>) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onComplete }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('22');
  const [gender, setGender] = useState<'erkak' | 'ayol'>('erkak');
  const [height, setHeight] = useState('175');
  const [weight, setWeight] = useState('72');

  if (!isOpen) return null;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!firstName.trim() || !lastName.trim()) return;
      setStep(2);
    } else {
      onComplete({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        age: parseInt(age) || 22,
        gender,
        height: parseInt(height) || 175,
        weight: parseInt(weight) || 72,
        dayNumber: 1,
        streak: 1,
        xp: 100,
        level: 1,
        waterGoal: 2500,
        calorieGoal: gender === 'erkak' ? 2400 : 1900,
        joinedAt: new Date().toISOString()
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
      >
        {/* Yuqori dekorativ gradient nuri */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Logo va sarlavha */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/20 mb-3 text-white">
              <Sparkles className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              LIFE RESET <span className="text-emerald-400">66</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              {step === 1
                ? "Shaxsiy profilingizni yarating va yangi hayotga ilk qadamni qo'ying"
                : "Tana parametrlarini kiriting (AI hisoblagich va sport rejasi uchun)"}
            </p>
          </div>

          {/* Bosqich indikatori */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 1 ? 'bg-emerald-500' : 'bg-neutral-800'}`} />
            <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 2 ? 'bg-emerald-500' : 'bg-neutral-800'}`} />
          </div>

          <form onSubmit={handleNext} className="space-y-4">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Ismingiz
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Masalan: Sardor"
                        className="w-full pl-10 pr-4 py-3 bg-neutral-950/70 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Familiyangiz
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Masalan: Karimov"
                        className="w-full pl-10 pr-4 py-3 bg-neutral-950/70 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Yoshingiz
                    </label>
                    <input
                      type="number"
                      min="12"
                      max="90"
                      required
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full px-4 py-3 bg-neutral-950/70 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Jinsingiz
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setGender('erkak')}
                        className={`py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                          gender === 'erkak'
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                            : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                        }`}
                      >
                        Erkak ‍♂️
                      </button>
                      <button
                        type="button"
                        onClick={() => setGender('ayol')}
                        className={`py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                          gender === 'ayol'
                            ? 'bg-pink-500/20 border-pink-500 text-pink-400'
                            : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                        }`}
                      >
                        Ayol ‍♀️
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        Bo'y (sm)
                      </label>
                      <input
                        type="number"
                        min="120"
                        max="230"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="w-full px-3.5 py-3 bg-neutral-950/70 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        Vazn (kg)
                      </label>
                      <input
                        type="number"
                        min="35"
                        max="200"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full px-3.5 py-3 bg-neutral-950/70 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-950/50 rounded-xl border border-neutral-800 flex items-center gap-2 text-neutral-400 text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Ma'lumotlar faqat shaxsiy ratsion va yuklamani hisoblash uchun ishlatiladi.</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              className="w-full mt-6 py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]"
            >
              <span>{step === 1 ? 'Davom etish' : "Ro'yxatdan o'tish va Savollarga o'tish"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
