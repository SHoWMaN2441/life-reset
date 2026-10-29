'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { UserProfile } from '@/types';
import { sounds } from '@/utils/soundEffects';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
}

const ALL_LEADERBOARD_DATA = [
  { rank: 1, name: "Shohruh Mirzayev", day: 42, streak: 42, xp: 5850, level: 6, avatar: "👑" },
  { rank: 2, name: "Malika Karimova", day: 36, streak: 36, xp: 4920, level: 5, avatar: "⚡" },
  { rank: 3, name: "Bekzod Umarov", day: 31, streak: 31, xp: 4250, level: 4, avatar: "🔥" },
  { rank: 4, name: "Jasur Rahimov", day: 25, streak: 25, xp: 3480, level: 3, avatar: "🎯" },
  { rank: 5, name: "Nilufar Aliyeva", day: 19, streak: 19, xp: 2620, level: 3, avatar: "🌱" },
  { rank: 6, name: "Azizbek Qodirov", day: 16, streak: 16, xp: 2150, level: 2, avatar: "🚀" },
  { rank: 7, name: "Madina Yusupova", day: 14, streak: 14, xp: 1890, level: 2, avatar: "💎" },
  { rank: 8, name: "Bobur Ismoilov", day: 12, streak: 12, xp: 1620, level: 2, avatar: "🦁" },
  { rank: 9, name: "Zuhra Norova", day: 10, streak: 10, xp: 1350, level: 1, avatar: "⭐" },
  { rank: 10, name: "Doston Xoliqov", day: 8, streak: 8, xp: 1100, level: 1, avatar: "🛡️" },
  { rank: 11, name: "Kamola Ergasheva", day: 6, streak: 6, xp: 820, level: 1, avatar: "🌿" },
  { rank: 12, name: "Sardor Ahmedov", day: 4, streak: 4, xp: 550, level: 1, avatar: "🏆" }
];

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  currentUser
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  if (!isOpen) return null;

  const totalPages = Math.ceil(ALL_LEADERBOARD_DATA.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = ALL_LEADERBOARD_DATA.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    sounds.playClick();
    setCurrentPage(page);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Sarlavha */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-black flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">
              PESHQADAMLAR JADVALI
            </h3>
            <p className="text-xs text-neutral-400">
              66 kunlik transformatsiya ishtirokchilari reytingi
            </p>
          </div>
        </div>

        {/* Foydalanuvchining shaxsiy o'rni banneri */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 border border-emerald-500/40 flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-black font-black flex items-center justify-center text-sm">
              #6
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>{currentUser.firstName} {currentUser.lastName}</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-1.5 py-0.2 rounded font-semibold">Siz</span>
              </div>
              <span className="text-[11px] text-neutral-300">
                {currentUser.dayNumber}-kun | {currentUser.streak} kun streak
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-sm font-black text-amber-400">{currentUser.xp} XP</span>
            <span className="text-[10px] text-neutral-400 block">Level {currentUser.level}</span>
          </div>
        </div>

        {/* Ro'yxat */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 min-h-[280px]">
          {currentItems.map((item) => (
            <div
              key={item.rank}
              className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all select-none hover:border-neutral-700 ${
                item.rank === 1
                  ? 'bg-amber-500/10 border-amber-500/30'
                  : item.rank === 2
                  ? 'bg-neutral-800/40 border-neutral-700/60'
                  : item.rank === 3
                  ? 'bg-orange-500/10 border-orange-500/30'
                  : 'bg-neutral-950/60 border-neutral-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${
                  item.rank === 1
                    ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                    : item.rank === 2
                    ? 'bg-slate-300 text-black'
                    : item.rank === 3
                    ? 'bg-amber-700 text-white'
                    : 'bg-neutral-800 text-neutral-400'
                }`}>
                  {item.rank}
                </span>

                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{item.name}</span>
                    <span>{item.avatar}</span>
                  </h4>
                  <div className="text-[10px] text-neutral-400 flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-0.5 text-orange-400">
                      <Flame className="w-3 h-3 fill-current" /> {item.streak} kun
                    </span>
                    <span>•</span>
                    <span>{item.day}/66 kun</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-amber-400">{item.xp} XP</span>
                <span className="text-[10px] text-neutral-500 block">Lvl {item.level}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination boshqaruvi */}
        <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between text-xs">
          <span className="text-[11px] text-neutral-400">
            Jami: <strong className="text-white">{ALL_LEADERBOARD_DATA.length}</strong> ishtirokchi
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 disabled:hover:bg-neutral-800 text-white cursor-pointer transition-colors"
              title="Oldingi"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              const isActive = currentPage === page;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-black shadow-sm shadow-amber-500/20'
                      : 'bg-neutral-800/80 text-neutral-400 hover:text-white hover:bg-neutral-700'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 disabled:hover:bg-neutral-800 text-white cursor-pointer transition-colors"
              title="Keyingi"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
