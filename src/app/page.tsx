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
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { sounds } from '@/utils/soundEffects';

// Firebase
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
  saveUserToFirestore,
  loadUserFromFirestore,
  saveUserDataField,
  loadAllUserData
} from '@/lib/firestore';

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
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

  // Firebase Auth state listener
  useEffect(() => {
    setIsClient(true);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in — load data from Firestore
        try {
          const savedUser = await loadUserFromFirestore(firebaseUser.uid);
          if (savedUser) {
            setUser(savedUser);
            // Load sub-data
            const allData = await loadAllUserData(firebaseUser.uid);
            if (allData) {
              if (allData.stats) setStats(allData.stats);
              if (allData.protocols) setProtocols(allData.protocols);
              if (allData.foods) setFoods(allData.foods);
              if (allData.badges) setBadges(allData.badges);
              if (allData.completedDays) setCompletedDays(allData.completedDays);
              if (typeof allData.waterMl === 'number') setWaterMl(allData.waterMl);
            }
          }
          // If no savedUser => profile hasn't been created yet (new user who didn't finish profile)
        } catch (e) {
          console.error('Firestore load error:', e);
        }
      } else {
        // User is signed out
        setUser(null);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ─── Save helpers ─────────────────────────────────────────────────────────

  const getUid = (): string | null => auth.currentUser?.uid ?? null;

  const saveUserData = async (updatedUser: UserProfile) => {
    setUser(updatedUser);
    const uid = getUid();
    if (uid) await saveUserToFirestore(uid, updatedUser);
  };

  const saveStatsData = async (updatedStats: HexagonStats) => {
    setStats(updatedStats);
    const uid = getUid();
    if (uid) await saveUserDataField(uid, 'stats', updatedStats);
  };

  const saveProtocolsData = async (updatedProtocols: DailyProtocolItem[]) => {
    setProtocols(updatedProtocols);
    const uid = getUid();
    if (uid) await saveUserDataField(uid, 'protocols', updatedProtocols);
  };

  const saveFoodsData = async (updatedFoods: FoodItem[]) => {
    setFoods(updatedFoods);
    const uid = getUid();
    if (uid) await saveUserDataField(uid, 'foods', updatedFoods);
  };

  const saveBadgesData = async (updatedBadges: AchievementBadge[]) => {
    setBadges(updatedBadges);
    const uid = getUid();
    if (uid) await saveUserDataField(uid, 'badges', updatedBadges);
  };

  const saveCompletedDaysData = async (updatedDays: number[]) => {
    setCompletedDays(updatedDays);
    const uid = getUid();
    if (uid) await saveUserDataField(uid, 'completedDays', updatedDays);
  };

  // ─── Auth Complete Handler ─────────────────────────────────────────────────

  const handleAuthComplete = async (profileData: Partial<UserProfile> | null) => {
    if (profileData === null) {
      // Existing user — check if already loaded or reload from Firestore
      const uid = auth.currentUser?.uid;
      if (uid) {
        const saved = await loadUserFromFirestore(uid);
        if (saved) {
          setUser(saved);
          const allData = await loadAllUserData(uid);
          if (allData) {
            if (allData.stats) setStats(allData.stats);
            if (allData.protocols) setProtocols(allData.protocols);
            if (allData.foods) setFoods(allData.foods);
            if (allData.badges) setBadges(allData.badges);
            if (allData.completedDays) setCompletedDays(allData.completedDays);
            if (typeof allData.waterMl === 'number') setWaterMl(allData.waterMl);
          }
          return;
        }
      }
      return;
    }

    // New user — create full profile and save to Firestore
    sounds.playLevelUp();
    const uid = auth.currentUser?.uid || 'usr-' + Date.now();

    const fullUser: UserProfile = {
      id: uid,
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

    await saveUserData(fullUser);
    setIsOnboarding(true);
  };

  // ─── Onboarding finish ────────────────────────────────────────────────────

  const handleOnboardingFinish = async (newStats: HexagonStats, selectedGoal: string, answers: unknown) => {
    if (!user) return;

    sounds.playLevelUp();
    await saveStatsData(newStats);

    const goalKey = selectedGoal in DEFAULT_DAILY_PROTOCOLS ? selectedGoal : 'barchasi';
    const initialProtocols = DEFAULT_DAILY_PROTOCOLS[goalKey] || DEFAULT_DAILY_PROTOCOLS.barchasi;

    await saveProtocolsData(initialProtocols);

    const updatedUser: UserProfile = {
      ...user,
      primaryGoal: selectedGoal as UserProfile['primaryGoal'],
      xp: user.xp + 150
    };
    await saveUserData(updatedUser);
    setIsOnboarding(false);
  };

  // ─── Protocol handlers ────────────────────────────────────────────────────

  const handleToggleProtocol = async (id: string) => {
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

    await saveProtocolsData(updated);
  };

  const handleAddProtocol = async (item: DailyProtocolItem) => {
    const updated = [item, ...protocols];
    await saveProtocolsData(updated);
  };

  const handleDeleteProtocol = async (id: string) => {
    sounds.playClick();
    const updated = protocols.filter(p => p.id !== id);
    await saveProtocolsData(updated);
  };

  // ─── Food handlers ────────────────────────────────────────────────────────

  const handleAddFood = async (item: FoodItem) => {
    const updated = [item, ...foods];
    await saveFoodsData(updated);
    if (user) {
      await saveUserData({ ...user, xp: user.xp + 25 });
    }
  };

  const handleRemoveFood = async (id: string) => {
    sounds.playClick();
    const updated = foods.filter(f => f.id !== id);
    await saveFoodsData(updated);
  };

  // ─── Day advance ──────────────────────────────────────────────────────────

  const handleAdvanceToNextDay = async () => {
    if (!user) return;

    const nextDay = user.dayNumber + 1;
    const updatedDays = Array.from(new Set([...completedDays, user.dayNumber]));
    await saveCompletedDaysData(updatedDays);

    const resetProtocols = protocols.map(p => ({ ...p, completed: false }));
    await saveProtocolsData(resetProtocols);

    await saveFoodsData([]);
    setWaterMl(0);
    const uid = getUid();
    if (uid) await saveUserDataField(uid, 'waterMl', 0);

    const updatedUser: UserProfile = {
      ...user,
      dayNumber: nextDay,
      streak: user.streak + 1,
      xp: user.xp + 250
    };
    await saveUserData(updatedUser);
    setIsDayCompleteModalOpen(false);
  };

  // ─── Sign out ─────────────────────────────────────────────────────────────

  const handleSignOut = async () => {
    sounds.playClick();
    try {
      await signOut(auth);
      // Reset all local state
      setUser(null);
      setStats({ tana: 50, aql: 50, intizom: 45, ruhiyat: 55, moliya: 45, odatlar: 40 });
      setProtocols([]);
      setFoods([]);
      setBadges(INITIAL_BADGES);
      setCompletedDays([1]);
      setWaterMl(1250);
      setIsOnboarding(false);
      setActiveTab('dashboard');
    } catch (e) {
      console.error('Sign out error:', e);
    }
  };

  // ─── Full reset ───────────────────────────────────────────────────────────

  const handleFullReset = async () => {
    sounds.playClick();
    if (confirm("Haqiqatan ham barcha ma'lumotlarni tozalab qaytadan boshlamoqchimisiz?")) {
      await handleSignOut();
    }
  };

  // ─── Loading states ───────────────────────────────────────────────────────

  if (!isClient || isAuthLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 shadow-lg mb-2">
            <Sparkles className="w-7 h-7 text-white animate-pulse" />
          </div>
          <p className="text-neutral-400 text-sm">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  // 1. Not authenticated yet
  if (!user) {
    return <AuthModal isOpen={true} onComplete={handleAuthComplete} />;
  }

  // 2. Onboarding
  if (isOnboarding) {
    return <OnboardingFlow user={user} onFinish={handleOnboardingFinish} />;
  }

  // 3. Main Dashboard
  const randomQuote = MOTIVATIONAL_QUOTES[0];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500 selection:text-black">
      {/* Navbar */}
      <Navbar
        user={user}
        activeTab={activeTab}
        onChangeTab={(tab) => setActiveTab(tab)}
        onOpenCoach={() => setIsCoachOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onResetProgram={handleFullReset}
        onSignOut={handleSignOut}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Motivational banner */}
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

            {/* Daily Protocol + Circadian */}
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
                  onUpdate={(val) => {
                    setWaterMl(val);
                    const uid = getUid();
                    if (uid) saveUserDataField(uid, 'waterMl', val);
                  }}
                />
                <JournalReflection />
              </div>
            </div>

            {/* 24h Circadian */}
            <CircadianTimeline />
          </div>
        )}

        {/* TAB 2: NUTRITION */}
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

        {/* TAB 3: WORKOUT */}
        {activeTab === 'workout' && (
          <div className="space-y-8">
            <WorkoutPlanner
              onCompleteWorkout={(xp) => {
                saveUserData({ ...user, xp: user.xp + xp });
              }}
            />
          </div>
        )}

        {/* TAB 4: MIND & FOCUS */}
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

        {/* TAB 5: PROFILE */}
        {activeTab === 'profile' && (
          <ProfileView
            user={user}
            stats={stats}
            badges={badges}
            completedDays={completedDays}
            onUpdateUser={(updated) => saveUserData(updated)}
          />
        )}

        {/* Sahifalar o'rtasida To'liq Pagination va Navigatsiya */}
        {(() => {
          const tabOrder: { id: ActiveTab; label: string }[] = [
            { id: 'dashboard', label: 'Bugungi Kun' },
            { id: 'nutrition', label: 'AI Oziqlanish' },
            { id: 'workout', label: 'Sport Rejasi' },
            { id: 'mind', label: 'Aql & Fokus' },
            { id: 'profile', label: 'Profil & Analitika' }
          ];
          const currentIndex = tabOrder.findIndex(t => t.id === activeTab);
          const prevTab = currentIndex > 0 ? tabOrder[currentIndex - 1] : null;
          const nextTab = currentIndex < tabOrder.length - 1 ? tabOrder[currentIndex + 1] : null;

          return (
            <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
              <div className="flex items-center gap-2">
                {prevTab ? (
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setActiveTab(prevTab.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <ChevronLeft className="w-4 h-4 text-emerald-400" />
                    <span>Oldingi: <strong className="text-white">{prevTab.label}</strong></span>
                  </button>
                ) : (
                  <div className="hidden sm:block" />
                )}
              </div>

              {/* Sahifa indikatorlari */}
              <div className="flex items-center gap-2">
                {tabOrder.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      sounds.playClick();
                      setActiveTab(tab.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? 'w-8 bg-emerald-500 shadow-sm shadow-emerald-500/50'
                        : 'w-2 bg-neutral-800 hover:bg-neutral-700'
                    }`}
                    title={tab.label}
                  />
                ))}
                <span className="text-[11px] text-neutral-500 font-mono ml-1">
                  {currentIndex + 1} / {tabOrder.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {nextTab ? (
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setActiveTab(nextTab.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-black text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-500/20 cursor-pointer transition-all active:scale-95"
                  >
                    <span>Keyingi: <strong>{nextTab.label}</strong></span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="hidden sm:block" />
                )}
              </div>
            </div>
          );
        })()}
      </main>

      {/* AI Coach Modal */}
      <AICoachModal
        isOpen={isCoachOpen}
        onClose={() => setIsCoachOpen(false)}
        user={user}
      />

      {/* Story Share Modal */}
      <StoryShareCard
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        user={user}
        stats={stats}
      />

      {/* Day Completion Modal */}
      <DayCompletionModal
        isOpen={isDayCompleteModalOpen}
        dayNumber={user.dayNumber}
        streak={user.streak}
        onNextDay={handleAdvanceToNextDay}
        onClose={() => setIsDayCompleteModalOpen(false)}
      />

      {/* Leaderboard Modal */}
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
