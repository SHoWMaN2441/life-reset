'use client';

import React, { useState } from 'react';
import { Moon, Star, Sun, ShieldCheck } from 'lucide-react';
import { sounds } from '@/utils/soundEffects';

interface SleepTrackerProps {
  onSave?: (hours: number, quality: number) => void;
}

export const SleepTracker: React.FC<SleepTrackerProps> = ({ onSave }) => {
  const [bedTime, setBedTime] = useState('23:00');
  const [wakeTime, setWakeTime] = useState('06:00');
  const [quality, setQuality] = useState(4);
  const [saved, setSaved] = useState(false);

  const calculateHours = () => {
    const [bH, bM] = bedTime.split(':').map(Number);
    const [wH, wM] = wakeTime.split(':').map(Number);

    let start = bH * 60 + bM;
    let end = wH * 60 + wM;

    if (end < start) {
      end += 24 * 60;
    }

    const diffMins = end - start;
    const hours = (diffMins / 60).toFixed(1);
    return hours;
  };

  const hours = calculateHours();

  const handleSave = () => {
    sounds.playSuccess();
    setSaved(true);
    if (onSave) onSave(parseFloat(hours), quality);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
            <Moon className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base font-bold text-white">UYQU VA REGENERATSIYA</h3>
            <p className="text-xs text-neutral-400">Miya va tana tiklanishi</p>
          </div>
        </div>

        <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-xl border border-purple-500/20">
          {hours} soat
        </span>
      </div>

      {/* Uyqu va uyg'onish soatlari */}
      <div className="grid grid-cols-2 gap-3 my-2">
        <div className="p-3 bg-neutral-950/70 border border-neutral-800 rounded-2xl">
          <span className="text-[11px] text-neutral-400 flex items-center gap-1 mb-1">
            <Moon className="w-3 h-3 text-purple-400" /> Yotish vaqti
          </span>
          <input
            type="time"
            value={bedTime}
            onChange={(e) => setBedTime(e.target.value)}
            className="w-full bg-transparent text-white font-bold text-base focus:outline-none cursor-pointer"
          />
        </div>

        <div className="p-3 bg-neutral-950/70 border border-neutral-800 rounded-2xl">
          <span className="text-[11px] text-neutral-400 flex items-center gap-1 mb-1">
            <Sun className="w-3 h-3 text-amber-400" /> Uyg'onish vaqti
          </span>
          <input
            type="time"
            value={wakeTime}
            onChange={(e) => setWakeTime(e.target.value)}
            className="w-full bg-transparent text-white font-bold text-base focus:outline-none cursor-pointer"
          />
        </div>
      </div>

      {/* Sifatni baholash */}
      <div className="my-2">
        <div className="flex items-center justify-between text-xs text-neutral-400 mb-1.5">
          <span>Uyqu sifati va quvvat:</span>
          <span className="text-white font-semibold">{quality} / 5</span>
        </div>
        <div className="flex items-center gap-1.5 justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => {
                sounds.playClick();
                setQuality(star);
              }}
              className="p-1 text-neutral-600 hover:text-amber-400 cursor-pointer transition-colors active:scale-110"
            >
              <Star
                className={`w-5 h-5 ${
                  star <= quality
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-neutral-700'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full mt-2 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-white cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2"
      >
        <span>{saved ? "Saqlandi ✓" : "Uyquni qayd etish"}</span>
      </button>
    </div>
  );
};
