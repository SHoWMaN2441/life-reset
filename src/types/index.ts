export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: 'erkak' | 'ayol';
  height: number; // sm
  weight: number; // kg
  primaryGoal: 'tana' | 'aql' | 'intizom' | 'ruhiyat' | 'moliya' | 'barchasi';
  activityLevel: 'kam' | 'ortacha' | 'faol' | 'juda_faol';
  wakeUpTime: string;
  sleepTime: string;
  waterGoal: number; // ml
  calorieGoal: number; // kcal
  dayNumber: number; // 1 to 66
  streak: number;
  xp: number;
  level: number;
  joinedAt: string;
}

export interface OnboardingAnswer {
  category: string;
  question: string;
  selectedOption: string;
}

export interface HexagonStats {
  tana: number;     // 0-100 (Physical)
  aql: number;      // 0-100 (Mental / Knowledge)
  intizom: number;  // 0-100 (Discipline)
  ruhiyat: number;  // 0-100 (Mindfulness / Spirit)
  moliya: number;   // 0-100 (Finance)
  odatlar: number;  // 0-100 (Habits / Consistency)
}

export interface DailyProtocolItem {
  id: string;
  title: string;
  description: string;
  category: 'tana' | 'aql' | 'intizom' | 'ruhiyat' | 'moliya' | 'odat';
  completed: boolean;
  timeSlot?: string;
  xp: number;
  isCustom?: boolean;
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number; // g
  fats: number;    // g
  carbs: number;   // g
  portion: string;
  mealType: 'nonushta' | 'tushlik' | 'kechki' | 'snack';
  timestamp: string;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  restSeconds: number;
  targetMuscle: string;
  instructions: string;
  difficulty: 'boshlangich' | 'ortacha' | 'yuqori';
}

export interface JournalEntry {
  id: string;
  date: string;
  mood: 'ajoyib' | 'yaxshi' | 'ortacha' | 'charchagan' | 'yomon';
  gratefulFor: string[];
  winOfDay: string;
  reflection: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: string;
  xpBonus: number;
}
