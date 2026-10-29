'use client';

import React, { useState, useEffect } from 'react';
import { UserProfile, HexagonStats, DailyProtocolItem, FoodItem, AchievementBadge } from '@/types';
import {
  DEFAULT_DAILY_PROTOCOLS,
  INITIAL_BADGES,
  MOTIVATIONAL_QUOTES
} from '@/data/initialData';
import { Navbar, ActiveTab } from '@/components/Navbar';
import { AuthModal } from '@/components/AuthModal';
import { OnboardingFlow } from '@/components/OnboardingFlow';
import { DailyProtocol } from '@/components/DailyProtocol';
import { CalorieAICalculator } from '@/components/CalorieAICalculator';
import { WorkoutPlanner } from '@/components/WorkoutPlanner';
import { WaterTracker } from '@/components/WaterTracker';
import { FocusTimer } from '@/components/FocusTimer';
import { SleepTracker } from '@/components/SleepTracker';
import { DopamineDetox } from '@/components/DopamineDetox';
import { JournalReflection } from '@/components/JournalReflection';
import { AICoachModal } from '@/components/AICoachModal';
import { StoryShareCard } from '@/components/StoryShareCard';
import { AmbientSoundPlayer } from '@/components/AmbientSoundPlayer';
import { BookTracker } from '@/components/BookTracker';
import { DayCompletionModal } from '@/components/DayCompletionModal';
import { CircadianTimeline } from '@/components/CircadianTimeline';
import { BreathingExercise } from '@/components/BreathingExercise';
import { LeaderboardModal } from '@/components/LeaderboardModal';
import { ProfileView } from '@/components/ProfileView';
import { Sparkles, Flame, CheckCircle, RefreshCw, Trophy, ArrowRight } from 'lucide-react';
import { sounds } from '@/utils/soundEffects';

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [stats, setStats] = useState<HexagonStats>({
    tana: 50,
    aql: 50,
    intizom: 45,
    ruhiyat: 55,
    moliya: 45,
    odatlar: 40
  });

  const [protocols, setProtocols] = useState<DailyProtocolItem[]>([]);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [badges, setBadges] = useState<AchievementBadge[]>(INITIAL_BADGES);
  const [completedDays, setCompletedDays] = useState<number[]>([1]);
  const [waterMl, setWaterMl] = useState(1250);

  // Modallar
  const [isCoachOpen, setIsCoachOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isDayCompleteModalOpen, setIsDayCompleteModalOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  // LocalStorage dan ma'lumotlarni yuklash
  useEffect(() => {
    setIsClient(true);
    const savedUser = localStorage.getItem('lr_user');
    const savedStats = localStorage.getItem('lr_stats');
    const savedProtocols = localStorage.getItem('lr_protocols');
    const savedFoods = localStorage.getItem('lr_foods');
    const savedBadges = localStorage.getItem('lr_badges');
    const savedDays = localStorage.getItem('lr_completed_days');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
    if (savedProtocols) {
      setProtocols(JSON.parse(savedProtocols));
    }
    if (savedFoods) {
      setFoods(JSON.parse(savedFoods));
    }
    if (savedBadges) {
      setBadges(JSON.parse(savedBadges));
    }
    if (savedDays) {
      setCompletedDays(JSON.parse(savedDays));
    }
  }, []);

  const saveUserData = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    localStorage.setItem('lr_user', JSON.stringify(updatedUser));
  };

  const saveStatsData = (updatedStats: HexagonStats) => {
    setStats(updatedStats);
    localStorage.setItem('lr_stats', JSON.stringify(updatedStats));
  };

  const saveProtocolsData = (updatedProtocols: DailyProtocolItem[]) => {
    setProtocols(updatedProtocols);
    localStorage.setItem('lr_protocols', JSON.stringify(updatedProtocols));
  };

  // Auth ro'yxatdan o'tish tugaganda
  const handleAuthComplete = (profileData: Partial<UserProfile>) => {
    sounds.playLevelUp();
    const fullUser: UserProfile = {
      id: 'usr-' + Date.now(),
      firstName: profileData.firstName || 'Foydalanuvchi',
      lastName: profileData.lastName || '',
      age: profileData.age || 22,
      gender: profileData.gender || 'erkak',
      height: profileData.height || 175,
      weight: profileData.weight || 72,
      primaryGoal: 'barchasi',
      activityLevel: 'ortacha',
      wakeUpTime: '06:00',
      sleepTime: '23:00',
      waterGoal: 2500,
      calorieGoal: profileData.gender === 'erkak' ? 2400 : 1900,
      dayNumber: 1,
      streak: 1,
      xp: 100,
      level: 1,
      joinedAt: new Date().toISOString()
    };

    saveUserData(fullUser);
    setIsOnboarding(true);
  };

  // Onboarding yakunlanganda
  const handleOnboardingFinish = (newStats: HexagonStats, selectedGoal: string, answers: any) => {
    if (!user) return;

    sounds.playLevelUp();
    saveStatsData(newStats);

    const goalKey = selectedGoal in DEFAULT_DAILY_PROTOCOLS ? selectedGoal : 'barchasi';
    const initialProtocols = DEFAULT_DAILY_PROTOCOLS[goalKey] || DEFAULT_DAILY_PROTOCOLS.barchasi;

    saveProtocolsData(initialProtocols);

    const updatedUser: UserProfile = {
      ...user,
      primaryGoal: selectedGoal as any,
      xp: user.xp + 150
    };
    saveUserData(updatedUser);
    setIsOnboarding(false);
  };

  // Protokol checkbox bosilganda
  const handleToggleProtocol = (id: string) => {
    if (!user) return;
    const updated = protocols.map(p => {
      if (p.id === id) {
        const nextState = !p.completed;
        if (nextState) {
          const newXp = user.xp + p.xp;
          const newLevel = Math.floor(newXp / 500) + 1;
          if (newLevel > user.level) {
            sounds.playLevelUp();
          }
          saveUserData({ ...user, xp: newXp, level: newLevel });
        }
        return { ...p, completed: nextState };
      }
      return p;
    });

    saveProtocolsData(updated);
  };

  const handleAddProtocol = (item: DailyProtocolItem) => {
    const updated = [item, ...protocols];
    saveProtocolsData(updated);
  };

  const handleDeleteProtocol = (id: string) => {
    sounds.playClick();
    const updated = protocols.filter(p => p.id !== id);
    saveProtocolsData(updated);
  };

  // Ovqat qo'shish
  const handleAddFood = (item: FoodItem) => {
    const updated = [item, ...foods];
    setFoods(updated);
    localStorage.setItem('lr_foods', JSON.stringify(updated));

    if (user) {
      saveUserData({ ...user, xp: user.xp + 25 });
    }
  };

  const handleRemoveFood = (id: string) => {
    sounds.playClick();
    const updated = foods.filter(f => f.id !== id);
    setFoods(updated);
    localStorage.setItem('lr_foods', JSON.stringify(updated));
  };

  // Kunni yakunlab keyingi kunga o'tish
  const handleAdvanceToNextDay = () => {
    if (!user) return;

    const nextDay = user.dayNumber + 1;
    const updatedDays = Array.from(new Set([...completedDays, user.dayNumber]));
    setCompletedDays(updatedDays);
    localStorage.setItem('lr_completed_days', JSON.stringify(updatedDays));

    const resetProtocols = protocols.map(p => ({ ...p, completed: false }));
    saveProtocolsData(resetProtocols);

    setFoods([]);
    setWaterMl(0);

    const updatedUser: UserProfile = {
      ...user,
      dayNumber: nextDay,
      streak: user.streak + 1,
      xp: user.xp + 250
    };
    saveUserData(updatedUser);
    setIsDayCompleteModalOpen(false);
  };

  // Qayta reset qilish
  const handleFullReset = () => {
    sounds.playClick();
    if (confirm("Haqiqatan ham barcha ma'lumotlarni tozalab qaytadan boshlamoqchimisiz?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  if (!isClient) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Yuklanmoqda...</div>;
  }

  // 1. Agar foydalanuvchi hali ro'yxatdan o'tmagan bo'lsa
  if (!user) {
    return <AuthModal isOpen={true} onComplete={handleAuthComplete} />;
  }

  // 2. Agar foydalanuvchi savollar (Onboarding) bosqichida bo'lsa
  if (isOnboarding) {
    return <OnboardingFlow user={user} onFinish={handleOnboardingFinish} />;
  }

  // 3. Asosiy Dashboard
  const randomQuote = MOTIVATIONAL_QUOTES[0];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500 selection:text-black">
      {/* Yuqori Navbar & Tab Navigatsiya */}
      <Navbar
        user={user}
        activeTab={activeTab}
        onChangeTab={(tab) => setActiveTab(tab)}
        onOpenCoach={() => setIsCoachOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onResetProgram={handleFullReset}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* TAB 1: BUGUNGI KUN (DASHBOARD) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Motivatsion banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 p-6 sm:p-8 shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-3 select-none">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>66 Kunlik Transformatsiya Protokoli</span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                    Xush kelibsiz, <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">{user.firstName}</span>!
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-300 italic mt-2 max-w-xl">
                    "{randomQuote.text}" — <span className="text-neutral-400 font-semibold">{randomQuote.author}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setActiveTab('profile');
                    }}
                    className="px-4 py-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                  >
                    <span>6 Burchakli Analitika</span>
                    <ArrowRight className="w-4 h-4 text-emerald-400" />
                  </button>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setIsCoachOpen(true);
                    }}
                    className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-black font-extrabold text-xs shadow-lg shadow-emerald-500/25 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    <span>AI Murabbiydan Maslahat</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Kunlik Protokol va Sirkadian Ritm */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8">
                <DailyProtocol
                  protocols={protocols}
                  user={user}
                  onToggleProtocol={handleToggleProtocol}
                  onAddProtocol={handleAddProtocol}
                  onDeleteProtocol={handleDeleteProtocol}
                  onOpenCompleteDayModal={() => setIsDayCompleteModalOpen(true)}
                />
              </div>

              <div className="lg:col-span-4 space-y-6">
                <WaterTracker
                  currentMl={waterMl}
                  goalMl={user.waterGoal || 2500}
                  onUpdate={(val) => setWaterMl(val)}
                />

                <JournalReflection />
              </div>
            </div>

            {/* 24 Soatlik Biologik Ritm */}
            <CircadianTimeline />
          </div>
        )}

        {/* TAB 2: AI OZIQLANISH (NUTRITION) */}
        {activeTab === 'nutrition' && (
          <div className="space-y-8">
            <CalorieAICalculator
              user={user}
              foods={foods}
              onAddFood={handleAddFood}
              onRemoveFood={handleRemoveFood}
            />
          </div>
        )}

        {/* TAB 3: SPORT REJASI (WORKOUT) */}
        {activeTab === 'workout' && (
          <div className="space-y-8">
            <WorkoutPlanner
              onCompleteWorkout={(xp) => {
                saveUserData({ ...user, xp: user.xp + xp });
              }}
            />
          </div>
        )}

        {/* TAB 4: AQL VA FOKUS (MIND & RECOVERY) */}
        {activeTab === 'mind' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FocusTimer
                onCompleteSession={(mins) => {
                  saveUserData({ ...user, xp: user.xp + mins * 2 });
                }}
              />
              <BreathingExercise />
              <AmbientSoundPlayer />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <BookTracker />
              <SleepTracker
                onSave={(hours, quality) => {
                  saveUserData({ ...user, xp: user.xp + 30 });
                }}
              />
              <DopamineDetox />
            </div>
          </div>
        )}

        {/* TAB 5: PROFIL VA 6 BURCHAKLI ANALITIKA (PROFILE) */}
        {activeTab === 'profile' && (
          <ProfileView
            user={user}
            stats={stats}
            badges={badges}
            completedDays={completedDays}
            onUpdateUser={(updated) => saveUserData(updated)}
          />
        )}
      </main>

      {/* AI Hayot Murabbiyi (Chat) Modali */}
      <AICoachModal
        isOpen={isCoachOpen}
        onClose={() => setIsCoachOpen(false)}
        user={user}
      />

      {/* Story Share Modali */}
      <StoryShareCard
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        user={user}
        stats={stats}
      />

      {/* Kunni Yakunlash Modali */}
      <DayCompletionModal
        isOpen={isDayCompleteModalOpen}
        dayNumber={user.dayNumber}
        streak={user.streak}
        onNextDay={handleAdvanceToNextDay}
        onClose={() => setIsDayCompleteModalOpen(false)}
      />

      {/* Peshqadamlar Jadvali (Leaderboard) Modali */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        currentUser={user}
      />

      {/* Footer */}
      <footer className="border-t border-neutral-900 mt-16 py-8 text-center text-xs text-neutral-500">
        <p className="font-semibold text-neutral-400">
          LIFE RESET 66 — Ilmiy asoslangan shaxsiy intizom va tana transformatsiyasi tizimi
        </p>
        <p className="mt-1 text-[11px] text-neutral-600">
          28+ maxsus funksiyalar: Sirkadian ritm, Box breathing, AI kaloriya va menyu, BMI tahlili, 4 ta AI Murabbiy persona, 6 burchakli radar va 66 kunlik matritsa.
        </p>
      </footer>
    </div>
  );
}
