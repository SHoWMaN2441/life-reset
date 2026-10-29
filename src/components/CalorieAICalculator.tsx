'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FoodItem, UserProfile } from '@/types';
import { Utensils, Sparkles, Flame, Plus, Trash2, CheckCircle, Apple, AlertCircle, ChefHat } from 'lucide-react';
import { sounds } from '@/utils/soundEffects';

interface CalorieAICalculatorProps {
  user: UserProfile;
  foods: FoodItem[];
  onAddFood: (item: FoodItem) => void;
  onRemoveFood: (id: string) => void;
}

export const CalorieAICalculator: React.FC<CalorieAICalculatorProps> = ({
  user,
  foods,
  onAddFood,
  onRemoveFood
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [selectedMealType, setSelectedMealType] = useState<'nonushta' | 'tushlik' | 'kechki' | 'snack'>('nonushta');
  const [isLoading, setIsLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);

  // AI Menyu taklifi
  const [generatedMenu, setGeneratedMenu] = useState<any | null>(null);
  const [isGeneratingMenu, setIsGeneratingMenu] = useState(false);

  // TDEE va BMR formulasi (Mifflin-St Jeor):
  const bmr = user.gender === 'erkak'
    ? Math.round(10 * user.weight + 6.25 * user.height - 5 * user.age + 5)
    : Math.round(10 * user.weight + 6.25 * user.height - 5 * user.age - 161);

  const activityMultiplier = user.activityLevel === 'juda_faol' ? 1.7 : user.activityLevel === 'faol' ? 1.55 : 1.35;
  const targetCalories = Math.round(bmr * activityMultiplier);

  const targetProtein = Math.round(user.weight * 2.0);
  const targetFats = Math.round(user.weight * 0.9);
  const targetCarbs = Math.round((targetCalories - (targetProtein * 4 + targetFats * 9)) / 4);

  const totalCalories = foods.reduce((acc, f) => acc + f.calories, 0);
  const totalProtein = foods.reduce((acc, f) => acc + f.protein, 0);
  const totalFats = foods.reduce((acc, f) => acc + f.fats, 0);
  const totalCarbs = foods.reduce((acc, f) => acc + f.carbs, 0);

  const caloriePercent = Math.min(100, Math.round((totalCalories / targetCalories) * 100));

  const handleAISubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    setIsLoading(true);
    setAiAdvice(null);
    sounds.playClick();

    try {
      const res = await fetch('/api/ai/nutrition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: inputQuery })
      });
      const data = await res.json();

      if (data.success) {
        const newFood: FoodItem = {
          id: 'food-' + Date.now(),
          name: inputQuery,
          calories: data.calories,
          protein: data.protein,
          fats: data.fats,
          carbs: data.carbs,
          portion: '1 porsiya',
          mealType: selectedMealType,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        onAddFood(newFood);
        setAiAdvice(data.advice);
        setInputQuery('');
        sounds.playSuccess();
      }
    } catch (err) {
      console.error(err);
      const fallback: FoodItem = {
        id: 'food-' + Date.now(),
        name: inputQuery,
        calories: 350,
        protein: 20,
        fats: 10,
        carbs: 45,
        portion: '1 porsiya',
        mealType: selectedMealType,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      onAddFood(fallback);
      setInputQuery('');
      sounds.playSuccess();
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateMenu = async () => {
    setIsGeneratingMenu(true);
    sounds.playClick();
    try {
      const res = await fetch('/api/ai/nutrition/diet-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weight: user.weight,
          goal: user.primaryGoal,
          targetCalories
        })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedMenu(data.meals);
        sounds.playSuccess();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingMenu(false);
    }
  };

  const quickExamples = [
    "2 dona qaynatilgan tuxum va qora non",
    "200g tovuq filesi va 150g grechka",
    "Osh 250gr",
    "1 dona banan va 100g tvorog"
  ];

  return (
    <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl">
      {/* Sarlavha */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Utensils className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-black text-white tracking-wide">
              AI KALORIYA & KUNLIK RATSION
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Ovqat nomini yozing — sun'iy intellekt kaloriya va BJU (oqsil, yog', uglevod)ni darhol hisoblaydi
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerateMenu}
            disabled={isGeneratingMenu}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-xs font-bold text-emerald-400 flex items-center gap-1.5 hover:brightness-125 transition-all"
          >
            <ChefHat className="w-4 h-4" />
            <span>{isGeneratingMenu ? "AI tuzmoqda..." : "AI Menyu Tavsiyasi"}</span>
          </button>

          <div className="px-3.5 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-semibold text-neutral-300 flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <span>Norma: <strong className="text-white">{targetCalories} kcal</strong></span>
          </div>
        </div>
      </div>

      {/* AI Generatsiya qilgan kunlik menyu modali / bloki */}
      {generatedMenu && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-5 rounded-2xl bg-neutral-950 border border-emerald-500/40 mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Siz uchun Shaxsiy AI Kunlik Menyu:</span>
            </h4>
            <button
              onClick={() => setGeneratedMenu(null)}
              className="text-xs text-neutral-500 hover:text-white"
            >
              Yopish
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
              <span className="font-bold text-amber-400 block mb-1">Nonushta:</span>
              <p className="text-white font-medium">{generatedMenu.nonushta.title}</p>
              <div className="text-[11px] text-neutral-400 mt-1">
                {generatedMenu.nonushta.calories} kcal | {generatedMenu.nonushta.protein}g oqsil
              </div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
              <span className="font-bold text-orange-400 block mb-1">Tushlik:</span>
              <p className="text-white font-medium">{generatedMenu.tushlik.title}</p>
              <div className="text-[11px] text-neutral-400 mt-1">
                {generatedMenu.tushlik.calories} kcal | {generatedMenu.tushlik.protein}g oqsil
              </div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
              <span className="font-bold text-blue-400 block mb-1">Kechki ovqat:</span>
              <p className="text-white font-medium">{generatedMenu.kechki.title}</p>
              <div className="text-[11px] text-neutral-400 mt-1">
                {generatedMenu.kechki.calories} kcal | {generatedMenu.kechki.protein}g oqsil
              </div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
              <span className="font-bold text-emerald-400 block mb-1">Foydali Snack:</span>
              <p className="text-white font-medium">{generatedMenu.snack.title}</p>
              <div className="text-[11px] text-neutral-400 mt-1">
                {generatedMenu.snack.calories} kcal | {generatedMenu.snack.protein}g oqsil
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Kaloriya va BJU progress paneli */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-neutral-950/70 rounded-2xl border border-neutral-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
            <span>Kaloriya</span>
            <span className="font-bold text-emerald-400">{caloriePercent}%</span>
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-white">{totalCalories}</span>
            <span className="text-xs text-neutral-500"> / {targetCalories} kcal</span>
          </div>
          <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
              initial={{ width: 0 }}
              animate={{ width: `${caloriePercent}%` }}
            />
          </div>
        </div>

        <div className="p-4 bg-neutral-950/70 rounded-2xl border border-neutral-800">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
            <span>Oqsil (Mushak)</span>
            <span className="text-blue-400 font-semibold">{totalProtein} / {targetProtein}g</span>
          </div>
          <div className="text-lg font-bold text-white mb-2">{totalProtein}g</div>
          <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${Math.min(100, (totalProtein / targetProtein) * 100)}%` }}
            />
          </div>
        </div>

        <div className="p-4 bg-neutral-950/70 rounded-2xl border border-neutral-800">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
            <span>Yog'lar (Fats)</span>
            <span className="text-amber-400 font-semibold">{totalFats} / {targetFats}g</span>
          </div>
          <div className="text-lg font-bold text-white mb-2">{totalFats}g</div>
          <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all"
              style={{ width: `${Math.min(100, (totalFats / targetFats) * 100)}%` }}
            />
          </div>
        </div>

        <div className="p-4 bg-neutral-950/70 rounded-2xl border border-neutral-800">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
            <span>Uglevod (Energiya)</span>
            <span className="text-cyan-400 font-semibold">{totalCarbs} / {targetCarbs}g</span>
          </div>
          <div className="text-lg font-bold text-white mb-2">{totalCarbs}g</div>
          <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-500 rounded-full transition-all"
              style={{ width: `${Math.min(100, (totalCarbs / targetCarbs) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* AI Ovqat kiritish formasi */}
      <form onSubmit={handleAISubmit} className="space-y-3 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {(['nonushta', 'tushlik', 'kechki', 'snack'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedMealType(type)}
              className={`px-3 py-1.5 rounded-xl border capitalize font-semibold transition-all shrink-0 ${
                selectedMealType === type
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                  : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700'
              }`}
            >
              {type === 'kechki' ? 'Kechki ovqat' : type}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Masalan: 2 dona tuxum va 50g grechka..."
              className="w-full pl-4 pr-10 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-emerald-500"
            />
            <Sparkles className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
          </div>

          <button
            type="submit"
            disabled={isLoading || !inputQuery.trim()}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-neutral-800 text-black disabled:text-neutral-500 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            {isLoading ? (
              <span>AI Tahlil qilmoqda...</span>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>AI bilan qo'shish</span>
              </>
            )}
          </button>
        </div>

        {/* Tezkor namunalar */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-neutral-500">Namunalar:</span>
          {quickExamples.map((ex, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setInputQuery(ex)}
              className="text-[11px] text-neutral-400 hover:text-emerald-400 bg-neutral-950/60 border border-neutral-800/80 px-2 py-0.5 rounded-lg transition-colors"
            >
              + {ex}
            </button>
          ))}
        </div>
      </form>

      {/* AI Maslahati bildirishnomasi */}
      {aiAdvice && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-neutral-300"
        >
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white">AI Xulosasi:</strong> {aiAdvice}
          </div>
        </motion.div>
      )}

      {/* Bugungi iste'mol qilingan taomlar ro'yxati */}
      <div>
        <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
          Bugungi kiritilgan taomlar ({foods.length}):
        </h4>

        {foods.length === 0 ? (
          <div className="text-center py-8 text-neutral-500 text-xs border border-dashed border-neutral-800/80 rounded-2xl">
            Hozircha hech qanday ovqat kiritilmadi. Yuqorida AI orqali taomlarni qo'shing.
          </div>
        ) : (
          <div className="space-y-2">
            {foods.map((food) => (
              <div
                key={food.id}
                className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{food.name}</span>
                    <span className="text-[10px] text-neutral-500 uppercase bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800">
                      {food.mealType}
                    </span>
                  </div>
                  <div className="text-neutral-400 text-[11px] mt-0.5 flex items-center gap-3">
                    <span className="text-orange-400 font-medium">{food.calories} kcal</span>
                    <span>Oqsil: {food.protein}g</span>
                    <span>Yog': {food.fats}g</span>
                    <span>Uglevod: {food.carbs}g</span>
                  </div>
                </div>

                <button
                  onClick={() => onRemoveFood(food.id)}
                  className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
