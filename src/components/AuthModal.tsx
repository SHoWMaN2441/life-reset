'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { UserProfile } from '@/types';
import { User, Sparkles, Scale, ArrowRight, ShieldCheck, Mail, Lock, LogIn } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onComplete: (profile: Partial<UserProfile> | null) => void; // null = existing user
}

type AuthTab = 'login' | 'register';
type ProfileStep = 1 | 2;

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onComplete }) => {
  const [authTab, setAuthTab] = useState<AuthTab>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Profile form state (only for new registrations)
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileStep, setProfileStep] = useState<ProfileStep>(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('22');
  const [gender, setGender] = useState<'erkak' | 'ayol'>('erkak');
  const [height, setHeight] = useState('175');
  const [weight, setWeight] = useState('72');

  if (!isOpen) return null;

  const getErrorMessage = (code: string): string => {
    const map: Record<string, string> = {
      'auth/invalid-email': 'Email manzil noto\'g\'ri formatda',
      'auth/user-not-found': 'Bu email bilan foydalanuvchi topilmadi',
      'auth/wrong-password': 'Parol noto\'g\'ri',
      'auth/email-already-in-use': 'Bu email allaqachon ro\'yxatdan o\'tgan',
      'auth/weak-password': 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak',
      'auth/popup-closed-by-user': 'Google kirish oynasi yopildi',
      'auth/invalid-credential': 'Email yoki parol noto\'g\'ri',
      'auth/too-many-requests': 'Ko\'p urinish. Bir ozdan keyin qayta urinib ko\'ring',
    };
    return map[code] || 'Xatolik yuz berdi. Qayta urinib ko\'ring.';
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onComplete(null); // existing user — load from Firestore
    } catch (err: unknown) {
      const code = (err as { code?: string }).code || '';
      setAuthError(getErrorMessage(code));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // New user — show profile form
      setShowProfileForm(true);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code || '';
      setAuthError(getErrorMessage(code));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError('');
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Check if this is a new user by checking metadata
      const creationTime = result.user.metadata.creationTime;
      const lastSignInTime = result.user.metadata.lastSignInTime;
      const isNewUser = creationTime === lastSignInTime;

      if (isNewUser) {
        // Pre-fill name from Google
        const displayName = result.user.displayName || '';
        const parts = displayName.split(' ');
        setFirstName(parts[0] || '');
        setLastName(parts.slice(1).join(' ') || '');
        setShowProfileForm(true);
      } else {
        onComplete(null); // existing user
      }
    } catch (err: unknown) {
      const code = (err as { code?: string }).code || '';
      setAuthError(getErrorMessage(code));
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (profileStep === 1) {
      if (!firstName.trim() || !lastName.trim()) return;
      setProfileStep(2);
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
        {/* Decorative gradient lights */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Logo & title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/20 mb-3 text-white">
              <Sparkles className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              LIFE RESET <span className="text-emerald-400">66</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              {showProfileForm
                ? (profileStep === 1
                  ? "Shaxsiy profilingizni yarating"
                  : "Tana parametrlarini kiriting (AI hisoblagich uchun)")
                : "66 Kunlik transformatsiyani boshlang"}
            </p>
          </div>

          {/* Profile form (shown after new registration) */}
          {showProfileForm ? (
            <>
              {/* Progress indicator */}
              <div className="flex items-center gap-2 mb-6">
                <div className={`h-1.5 flex-1 rounded-full transition-all ${profileStep >= 1 ? 'bg-emerald-500' : 'bg-neutral-800'}`} />
                <div className={`h-1.5 flex-1 rounded-full transition-all ${profileStep >= 2 ? 'bg-emerald-500' : 'bg-neutral-800'}`} />
              </div>

              <form onSubmit={handleProfileNext} className="space-y-4">
                <AnimatePresence mode="wait">
                  {profileStep === 1 ? (
                    <motion.div
                      key="pstep1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Ismingiz</label>
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
                        <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Familiyangiz</label>
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
                        <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Yoshingiz</label>
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
                      key="pstep2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Jinsingiz</label>
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
                          <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Bo'y (sm)</label>
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
                          <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Vazn (kg)</label>
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
                  <span>{profileStep === 1 ? 'Davom etish' : "Ro'yxatdan o'tish va Savollarga o'tish"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Auth Tabs */}
              <div className="flex gap-1 bg-neutral-950/50 border border-neutral-800 p-1 rounded-xl mb-6">
                <button
                  onClick={() => { setAuthTab('login'); setAuthError(''); }}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    authTab === 'login'
                      ? 'bg-emerald-500 text-black shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Kirish
                </button>
                <button
                  onClick={() => { setAuthTab('register'); setAuthError(''); }}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    authTab === 'register'
                      ? 'bg-emerald-500 text-black shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Ro'yxatdan o'tish
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={authTab}
                  initial={{ opacity: 0, x: authTab === 'login' ? -15 : 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: authTab === 'login' ? 15 : -15 }}
                  className="space-y-4"
                >
                  <form
                    onSubmit={authTab === 'login' ? handleEmailLogin : handleEmailRegister}
                    className="space-y-3"
                  >
                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="example@mail.com"
                          className="w-full pl-10 pr-4 py-3 bg-neutral-950/70 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Parol</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Kamida 6 ta belgi"
                          className="w-full pl-10 pr-4 py-3 bg-neutral-950/70 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Error message */}
                    {authError && (
                      <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs">
                        {authError}
                      </div>
                    )}

                    {/* Submit button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <span>Yuklanmoqda...</span>
                      ) : (
                        <>
                          <LogIn className="w-4 h-4" />
                          <span>{authTab === 'login' ? 'Kirish' : "Ro'yxatdan o'tish"}</span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-neutral-800" />
                    <span className="text-xs text-neutral-500">yoki</span>
                    <div className="flex-1 h-px bg-neutral-800" />
                  </div>

                  {/* Google Sign In */}
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-neutral-950/70 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900 text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                  >
                    {/* Google "G" icon */}
                    <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z" fill="#4285F4"/>
                      <path d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z" fill="#34A853"/>
                      <path d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z" fill="#FBBC04"/>
                      <path d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z" fill="#EA4335"/>
                    </svg>
                    <span>Google orqali kirish</span>
                  </button>
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
