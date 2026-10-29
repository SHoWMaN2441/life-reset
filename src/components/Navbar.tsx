'use client';

import React from 'react';
import {
  Sparkles,
  Flame,
  Trophy,
  Bot,
  Share2,
  User,
  LayoutDashboard,
  Utensils,
  Dumbbell,
  Brain,
  UserCircle
} from 'lucide-react';
import { UserProfile } from '@/types';
import { sounds } from '@/utils/soundEffects';

export type ActiveTab = 'dashboard' | 'nutrition' | 'workout' | 'mind' | 'profile';

interface NavbarProps {
  user: UserProfile;
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  onOpenCoach: () => void;
  onOpenShare: () => void;
  onOpenLeaderboard?: () => void;
  onResetProgram?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  onChangeTab,
  onOpenCoach,
  onOpenShare,
  onOpenLeaderboard,
  onResetProgram
}) => {
  const tabs = [
    { id: 'dashboard' as ActiveTab, label: 'Bugungi Kun', icon: LayoutDashboard },
    { id: 'nutrition' as ActiveTab, label: 'AI Oziqlanish', icon: Utensils },
    { id: 'workout' as ActiveTab, label: 'Sport Rejasi', icon: Dumbbell },
    { id: 'mind' as ActiveTab, label: 'Aql & Fokus', icon: Brain },
    { id: 'profile' as ActiveTab, label: 'Profil & Analitika', icon: UserCircle },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-950/85 border-b border-neutral-800/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Yuqori qator */}
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => {
              sounds.playClick();
              onChangeTab('dashboard');
            }}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-black font-black text-base shadow-md shadow-emerald-500/20">
              LR
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-tight text-white">LIFE RESET</span>
                <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                  66
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 hidden sm:block">Shaxsiy Transformatsiya Tizimi</p>
            </div>
          </div>

          {/* O'rta: Tab Navigatsiyasi (Katta ekranlar) */}
          <nav className="hidden md:flex items-center gap-1 bg-neutral-900/80 border border-neutral-800/80 p-1 rounded-2xl">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    sounds.playClick();
                    onChangeTab(tab.id);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer select-none transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* O'ng taraf: Kun, Streak, AI Coach, Profil */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs text-orange-400 font-bold select-none">
              <Flame className="w-3.5 h-3.5 fill-current animate-pulse" />
              <span>{user.streak} kun</span>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                if (onOpenLeaderboard) onOpenLeaderboard();
              }}
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-amber-400 cursor-pointer transition-colors"
              title="Reyting"
            >
              <Trophy className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                onOpenCoach();
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer transition-all active:scale-95"
            >
              <Bot className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">AI Murabbiy</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                onOpenShare();
              }}
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 cursor-pointer transition-colors"
              title="Natijani ulashish"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Profil avatar tugmasi */}
            <button
              onClick={() => {
                sounds.playClick();
                onChangeTab('profile');
              }}
              className={`flex items-center gap-2 pl-2 border-l border-neutral-800 cursor-pointer transition-all ${
                activeTab === 'profile' ? 'opacity-100' : 'opacity-80 hover:opacity-100'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                activeTab === 'profile'
                  ? 'bg-emerald-500 text-black ring-2 ring-emerald-400'
                  : 'bg-neutral-800 border border-neutral-700 text-emerald-400'
              }`}>
                {user.firstName[0]}{user.lastName ? user.lastName[0] : ''}
              </div>
            </button>
          </div>
        </div>

        {/* Mobil ekranlar uchun Tab Navigatsiyasi (Pastki panel) */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-neutral-900 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sounds.playClick();
                  onChangeTab(tab.id);
                }}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl text-[10px] font-bold cursor-pointer transition-all ${
                  isActive
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
