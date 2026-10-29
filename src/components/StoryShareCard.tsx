'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Sparkles, X, Check, Flame, Trophy } from 'lucide-react';
import { UserProfile, HexagonStats } from '@/types';

interface StoryShareCardProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  stats: HexagonStats;
}

export const StoryShareCard: React.FC<StoryShareCardProps> = ({
  isOpen,
  onClose,
  user,
  stats
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const avgScore = Math.round(
    Object.values(stats).reduce((a, b) => a + b, 0) / 6
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-sm bg-gradient-to-b from-neutral-900 via-neutral-950 to-black border border-neutral-800 rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col justify-between"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-neutral-800/80 text-neutral-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 9:16 Instagram Story Formatidagi Poster */}
        <div className="text-center pt-2 pb-6 border-b border-neutral-800">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold mb-3">
            <Sparkles className="w-3 h-3" />
            <span>LIFE RESET 66 PROTOCOL</span>
          </div>

          <h3 className="text-2xl font-black text-white tracking-tight">
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Kun {user.dayNumber} / 66 | Intizom darajasi
          </p>

          {/* Katta ko'rsatkich */}
          <div className="my-6 p-4 rounded-2xl bg-gradient-to-tr from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/20">
            <div className="text-5xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              {avgScore}%
            </div>
            <div className="text-xs font-bold text-neutral-300 mt-1 uppercase tracking-wider">
              Hayot Balansi Balli
            </div>
          </div>

          {/* 6 soha miniatyura kartochkasi */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800">
              <span className="block text-[10px] text-neutral-500">Tana</span>
              <span className="font-bold text-red-400">{stats.tana}%</span>
            </div>
            <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800">
              <span className="block text-[10px] text-neutral-500">Intizom</span>
              <span className="font-bold text-amber-400">{stats.intizom}%</span>
            </div>
            <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800">
              <span className="block text-[10px] text-neutral-500">Aql</span>
              <span className="font-bold text-blue-400">{stats.aql}%</span>
            </div>
            <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800">
              <span className="block text-[10px] text-neutral-500">Ruhiyat</span>
              <span className="font-bold text-purple-400">{stats.ruhiyat}%</span>
            </div>
            <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800">
              <span className="block text-[10px] text-neutral-500">Moliya</span>
              <span className="font-bold text-emerald-400">{stats.moliya}%</span>
            </div>
            <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800">
              <span className="block text-[10px] text-neutral-500">Odatlar</span>
              <span className="font-bold text-cyan-400">{stats.odatlar}%</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-3 text-xs text-neutral-400">
            <span className="flex items-center gap-1 font-semibold text-orange-400">
              <Flame className="w-3.5 h-3.5 fill-current" /> {user.streak} kun streak
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-semibold text-amber-400">
              <Trophy className="w-3.5 h-3.5" /> Level {user.level}
            </span>
          </div>
        </div>

        {/* Ulashish tugmalari */}
        <div className="pt-4 space-y-2">
          <button
            onClick={handleCopyLink}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" /> <span>Havola nusxalandi!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" /> <span>Story uchun ulashish</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
