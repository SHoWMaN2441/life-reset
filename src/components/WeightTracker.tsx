'use client';

import React, { useState } from 'react';
import { Scale, TrendingDown, Plus, Sparkles, Check } from 'lucide-react';
import { sounds } from '@/utils/soundEffects';

interface WeightTrackerProps {
  initialWeight: number;
  height: number; // sm
  onUpdateWeight?: (newWeight: number) => void;
}

export const WeightTracker: React.FC<WeightTrackerProps> = ({
  initialWeight = 72,
  height = 175,
  onUpdateWeight
}) => {
  const [currentWeight, setCurrentWeight] = useState(initialWeight);
  const [targetWeight, setTargetWeight] = useState(68);
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState([
    { day: '1-kun', weight: 72 },
    { day: '2-kun', weight: 71.8 },
    { day: '3-kun', weight: 71.5 },
    { day: '4-kun', weight: 71.2 },
    { day: '5-kun', weight: 70.9 }
  ]);
  const [isSaved, setIsSaved] = useState(false);

  // BMI (Body Mass Index): vazn (kg) / (bo'y(m))^2
  const heightM = height / 100;
  const bmi = (currentWeight / (heightM * heightM)).toFixed(1);

  const getBmiStatus = (val: number) => {
    if (val < 18.5) return { label: 'Vazn kam', color: 'text-cyan-400' };
    if (val <= 24.9) return { label: 'Ideal (Norma)', color: 'text-emerald-400' };
    if (val <= 29.9) return { label: 'Ortiqcha vazn', color: 'text-amber-400' };
    return { label: 'Semizlik', color: 'text-red-400' };
  };

  const bmiStatus = getBmiStatus(parseFloat(bmi));

  const handleAddWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(inputVal);
    if (!val || isNaN(val) || val < 30 || val > 200) return;

    sounds.playSuccess();
    setCurrentWeight(val);
    setHistory(prev => [...prev, { day: `${prev.length + 1}-kun`, weight: val }]);
    if (onUpdateWeight) onUpdateWeight(val);
    setInputVal('');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Scale className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base font-bold text-white">TANA VAZNI & BMI TAHLILI</h3>
            <p className="text-xs text-neutral-400">O'zgarishlar va tana massasi indeksi</p>
          </div>
        </div>

        <span className={`text-xs font-bold ${bmiStatus.color} bg-neutral-950 px-2.5 py-1 rounded-xl border border-neutral-800`}>
          BMI: {bmi} ({bmiStatus.label})
        </span>
      </div>

      {/* Vazn ko'rsatkichlari */}
      <div className="grid grid-cols-3 gap-2.5 my-2 text-center">
        <div className="p-3 bg-neutral-950/70 border border-neutral-800 rounded-2xl">
          <span className="text-[10px] text-neutral-500 uppercase block mb-0.5">Boshlang'ich</span>
          <span className="text-sm font-bold text-neutral-300">{initialWeight} kg</span>
        </div>
        <div className="p-3 bg-neutral-950/70 border border-emerald-500/40 rounded-2xl shadow-sm shadow-emerald-500/10">
          <span className="text-[10px] text-emerald-400 font-bold uppercase block mb-0.5">Hozirgi</span>
          <span className="text-base font-black text-white">{currentWeight} kg</span>
        </div>
        <div className="p-3 bg-neutral-950/70 border border-neutral-800 rounded-2xl">
          <span className="text-[10px] text-neutral-500 uppercase block mb-0.5">Maqsad</span>
          <span className="text-sm font-bold text-neutral-300">{targetWeight} kg</span>
        </div>
      </div>

      {/* Mini SVG Vazn Dinamikasi Chizmasi */}
      <div className="my-3 p-3 bg-neutral-950/40 border border-neutral-800/80 rounded-2xl">
        <div className="text-[10px] text-neutral-400 mb-1 flex items-center justify-between">
          <span>Oxirgi 5 ta o'lchov grafigi</span>
          <span className="text-emerald-400 font-bold flex items-center gap-0.5">
            <TrendingDown className="w-3 h-3" /> -1.1 kg
          </span>
        </div>
        <div className="flex items-end justify-between h-14 gap-2 pt-2 px-1">
          {history.slice(-5).map((h, i) => {
            const hPercent = Math.max(30, Math.min(100, (h.weight / initialWeight) * 80));
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-md transition-all duration-500"
                  style={{ height: `${hPercent}%` }}
                />
                <span className="text-[9px] text-neutral-500 truncate">{h.weight}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Yangi o'lchov kiritish */}
      <form onSubmit={handleAddWeight} className="flex gap-2">
        <input
          type="number"
          step="0.1"
          placeholder="Yangi vazn (masalan 71.3)"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className="flex-1 px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs cursor-pointer shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1 active:scale-95"
        >
          {isSaved ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{isSaved ? "Saqlandi" : "Kiritish"}</span>
        </button>
      </form>
    </div>
  );
};
