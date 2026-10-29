'use client';

import React from 'react';
import { AchievementBadge } from '@/types';
import { Award, Lock, Sparkles, Trophy } from 'lucide-react';
import { sounds } from '@/utils/soundEffects';

interface AchievementsBadgesProps {
  badges: AchievementBadge[];
  xp: number;
  level: number;
}

export const AchievementsBadges: React.FC<AchievementsBadgesProps> = ({
  badges,
  xp,
  level
}) => {
  const getLevelTitle = (lvl: number) => {
    if (lvl >= 5) return 'Life Reset Master 👑';
    if (lvl >= 4) return 'Spartan Jangchi ⚔️';
    if (lvl >= 3) return 'Temir Iroda ⚡';
    if (lvl >= 2) return 'Intizomli Izlovchi 🛡️';
    return 'Boshlang\'ich Qahramon 🌱';
  };

  const currentLevelProgress = Math.min(100, Math.round(((xp % 500) / 500) * 100));

  return (
    <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl">
      {/* Level va XP paneli */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Trophy className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-black text-white tracking-wide">
              YUTUQLAR VA NISHONLAR
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Har bir bajarilgan vazifa sizga XP olib keladi va yangi darajalarni ochadi
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-2xl flex items-center gap-3 select-none">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-black font-black flex items-center justify-center text-lg shadow-md shadow-amber-500/20">
              {level}
            </div>
            <div>
              <div className="text-xs font-bold text-white">{getLevelTitle(level)}</div>
              <div className="text-[11px] text-amber-400 font-semibold">{xp} Jami XP</div>
            </div>
          </div>
        </div>
      </div>

      {/* Level progress bar */}
      <div className="w-full bg-neutral-950 border border-neutral-800/80 rounded-2xl p-3 mb-6">
        <div className="flex items-center justify-between text-xs text-neutral-400 mb-1.5">
          <span>Keyingi {level + 1}-darajagacha:</span>
          <span className="text-amber-400 font-bold">{currentLevelProgress}%</span>
        </div>
        <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
            style={{ width: `${currentLevelProgress}%` }}
          />
        </div>
      </div>

      {/* Nishonlar to'plami */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {badges.map((badge) => (
          <div
            key={badge.id}
            onClick={() => {
              if (badge.unlocked) sounds.playSuccess();
              else sounds.playClick();
            }}
            className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-between cursor-pointer select-none hover:scale-105 active:scale-95 ${
              badge.unlocked
                ? 'bg-neutral-950/80 border-amber-500/40 shadow-sm shadow-amber-500/10 hover:border-amber-400'
                : 'bg-neutral-950/30 border-neutral-900 opacity-40 hover:opacity-60'
            }`}
          >
            <div className="text-3xl mb-2 filter drop-shadow">
              {badge.unlocked ? badge.icon : '🔒'}
            </div>

            <div>
              <h4 className="text-xs font-bold text-white truncate max-w-[120px]">
                {badge.title}
              </h4>
              <p className="text-[10px] text-neutral-400 mt-0.5 line-clamp-2 leading-tight">
                {badge.description}
              </p>
            </div>

            <div className="mt-2 text-[10px] font-bold text-amber-400">
              +{badge.xpBonus} XP
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
