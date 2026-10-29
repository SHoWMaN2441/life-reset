'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserProfile, HexagonStats, AchievementBadge } from '@/types';
import { HexagonRadar } from './HexagonRadar';
import { SixtySixDayTracker } from './SixtySixDayTracker';
import { WeightTracker } from './WeightTracker';
import { FinanceChallenge } from './FinanceChallenge';
import { AchievementsBadges } from './AchievementsBadges';
import {
  User,
  Sparkles,
  Flame,
  Trophy,
  Activity,
  Calendar,
  Award,
  Zap,
  TrendingUp,
  ShieldCheck,
  Edit3,
  Check,
  FileText
} from 'lucide-react';
import { sounds } from '@/utils/soundEffects';

interface ProfileViewProps {
  user: UserProfile;
  stats: HexagonStats;
  badges: AchievementBadge[];
  completedDays: number[];
  onUpdateUser: (updated: UserProfile) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  stats,
  badges,
  completedDays,
  onUpdateUser
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [height, setHeight] = useState(user.height);
  const [weight, setWeight] = useState(user.weight);
  const [primaryGoal, setPrimaryGoal] = useState(user.primaryGoal);

  // O'rtacha intizom ko'rsatkichi
  const avgStats = Math.round(
    Object.values(stats).reduce((a, b) => a + b, 0) / 6
  );

  // Eng kuchli va zaif sohani aniqlash
  const sortedAxes = Object.entries(stats).sort((a, b) => b[1] - a[1]);
  const strongest = sortedAxes[0];
  const weakest = sortedAxes[sortedAxes.length - 1];

  const getAxisName = (key: string) => {
    switch (key) {
      case 'tana': return 'Tana & Jismoniy Kuch';
      case 'aql': return 'Aql & Kitobxonlik';
      case 'intizom': return 'Temir Intizom';
      case 'ruhiyat': return 'Ruhiy Xotirjamlik';
      case 'moliya': return 'Moliyaviy Nazorat';
      default: return 'Barqaror Odatlar';
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playSuccess();
    onUpdateUser({
      ...user,
      firstName,
      lastName,
      height: Number(height),
      weight: Number(weight),
      primaryGoal: primaryGoal as any
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      {/* 1. Profil Sarlavhasi va Asosiy Karta */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-black font-black text-2xl shadow-xl shadow-emerald-500/20 select-none">
              {user.firstName[0]}{user.lastName ? user.lastName[0] : ''}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  {user.firstName} {user.lastName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase">
                  {user.primaryGoal}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                A'zo bo'lingan: {new Date(user.joinedAt).toLocaleDateString()} | Yoshi: {user.age} yosh
              </p>

              <div className="flex items-center gap-3 mt-3 text-xs">
                <span className="flex items-center gap-1 font-bold text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-xl border border-orange-500/20">
                  <Flame className="w-3.5 h-3.5 fill-current" /> {user.streak} kun streak
                </span>
                <span className="flex items-center gap-1 font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
                  <Trophy className="w-3.5 h-3.5" /> Lvl {user.level} ({user.xp} XP)
                </span>
                <span className="text-neutral-400">
                  Bo'y: <strong className="text-white">{user.height} sm</strong> | Vazn: <strong className="text-white">{user.weight} kg</strong>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              setIsEditing(!isEditing);
            }}
            className="px-4 py-2.5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all self-start md:self-center"
          >
            <Edit3 className="w-4 h-4 text-emerald-400" />
            <span>{isEditing ? "Yopish" : "Profilni tahrirlash"}</span>
          </button>
        </div>

        {/* Profil tahrirlash formasi */}
        {isEditing && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            onSubmit={handleSaveProfile}
            className="mt-6 pt-6 border-t border-neutral-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3"
          >
            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">Ism</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">Familiya</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">Bo'y (sm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">Vazn (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-1.5 transition-all"
              >
                <Check className="w-4 h-4" /> Saqlash
              </button>
            </div>
          </motion.form>
        )}
      </div>

      {/* 2. 6 Burchakli Radar Diagrammasi va Dayjest Analitikasi */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Radar */}
        <div className="lg:col-span-6">
          <HexagonRadar stats={stats} />
        </div>

        {/* Dayjest va Chuqur Analitika */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <FileText className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base font-bold text-white">HAFTALIK DAYJEST VA INTIZOM TAHLILI</h3>
                <p className="text-xs text-neutral-400">AI tomonidan shakllantirilgan shaxsiy xulosa</p>
              </div>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-3">
                <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0 font-bold">
                  92%
                </span>
                <div>
                  <h4 className="font-bold text-white">Eng kuchli sohangiz: {getAxisName(strongest[0])}</h4>
                  <p className="text-neutral-300 mt-0.5">
                    Ushbu yo'nalishda eng yuqori doimiylik ko'rsatmoqdasiz ({strongest[1]} ball). Bu sizning asosiy tayanchingiz.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-3">
                <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 font-bold">
                  {weakest[1]}%
                </span>
                <div>
                  <h4 className="font-bold text-white">E'tibor qaratilishi kerak: {getAxisName(weakest[0])}</h4>
                  <p className="text-neutral-300 mt-0.5">
                    Bu sohada o'sish uchun eng katta potentsial mavjud. Kunlik protokollarda ushbu soha vazifalariga ustuvorlik bering.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800">
                <h4 className="font-bold text-white mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>AI Shaxsiy Xulosasi:</span>
                </h4>
                <p className="text-neutral-400">
                  "{user.firstName}, 66 kunlik transformatsiyangiz to'g'ri yo'nalishda bormoqda. Kunlik o'rtacha ballingiz <strong className="text-white">{avgStats}%</strong>. Rejangizga ko'ra Faza 1 (Sindirish) bosqichida eng muhimi — har kuni hatto kichik bo'lsa ham intizom zanjirini uzmaslikdir."
                </p>
              </div>
            </div>
          </div>

          {/* Qisqa statistika ko'rsatkichlari */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-center">
              <span className="text-[10px] text-neutral-500 uppercase font-semibold block">Muvaffaqiyatli Kunlar</span>
              <span className="text-2xl font-black text-emerald-400">{completedDays.length} / 66</span>
            </div>
            <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-center">
              <span className="text-[10px] text-neutral-500 uppercase font-semibold block">Jami XP Ballari</span>
              <span className="text-2xl font-black text-amber-400">{user.xp}</span>
            </div>
            <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-center">
              <span className="text-[10px] text-neutral-500 uppercase font-semibold block">Intizom Darajasi</span>
              <span className="text-2xl font-black text-cyan-400">{avgStats}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 66 Kunlik Transformatsiya Matritsasi */}
      <SixtySixDayTracker
        currentDay={user.dayNumber}
        completedDays={completedDays}
        streak={user.streak}
      />

      {/* 4. Vazn Dinamikasi va Moliyaviy Jamg'arma */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WeightTracker
          initialWeight={user.weight}
          height={user.height}
          onUpdateWeight={(w) => onUpdateUser({ ...user, weight: w })}
        />
        <FinanceChallenge currentDay={user.dayNumber} />
      </div>

      {/* 5. Yutuq Nishonlari (Badges) */}
      <AchievementsBadges
        badges={badges}
        xp={user.xp}
        level={user.level}
      />
    </div>
  );
};
