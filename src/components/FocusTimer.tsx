'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Brain } from 'lucide-react';
import { sounds } from '@/utils/soundEffects';

interface FocusTimerProps {
  onCompleteSession?: (minutes: number) => void;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({ onCompleteSession }) => {
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      stopSound();
      sounds.playLevelUp();
      if (onCompleteSession) onCompleteSession(selectedMinutes);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, selectedMinutes]);

  const toggleSound = () => {
    sounds.playClick();
    if (!soundEnabled) {
      startSound();
      setSoundEnabled(true);
    } else {
      stopSound();
      setSoundEnabled(false);
    }
  };

  const startSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(196, ctx.currentTime);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
    } catch (e) {
      console.log('Audio init error', e);
    }
  };

  const stopSound = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      } catch (e) {}
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {}
    }
    oscillatorRef.current = null;
    audioCtxRef.current = null;
  };

  const handleModeChange = (mins: number) => {
    sounds.playClick();
    setIsRunning(false);
    setSelectedMinutes(mins);
    setTimeLeft(mins * 60);
    stopSound();
    setSoundEnabled(false);
  };

  const handleReset = () => {
    sounds.playClick();
    setIsRunning(false);
    setTimeLeft(selectedMinutes * 60);
    stopSound();
    setSoundEnabled(false);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progressPercent = Math.round(((selectedMinutes * 60 - timeLeft) / (selectedMinutes * 60)) * 100);

  return (
    <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between">
      {/* Sarlavha */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
            <Brain className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base font-bold text-white">DEEP WORK & FOKUS</h3>
            <p className="text-xs text-neutral-400">Chalg'imasdan chuqur diqqat jamlash</p>
          </div>
        </div>

        <button
          onClick={toggleSound}
          className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 ${
            soundEnabled
              ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400'
              : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
          }`}
          title="Binaural Alpha to'lqinlari"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span className="text-[10px] hidden sm:inline">Alpha To'lqin</span>
        </button>
      </div>

      {/* Rejim tanlash */}
      <div className="grid grid-cols-3 gap-2 mb-4 text-xs font-semibold">
        {[
          { label: '25 daq (Pomodoro)', mins: 25 },
          { label: '50 daq (Deep)', mins: 50 },
          { label: '15 daq (Sprint)', mins: 15 }
        ].map((m) => (
          <button
            key={m.mins}
            onClick={() => handleModeChange(m.mins)}
            className={`py-1.5 rounded-xl border transition-all text-center cursor-pointer select-none ${
              selectedMinutes === m.mins
                ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Katta raqamli taymer */}
      <div className="relative py-4 flex flex-col items-center justify-center select-none">
        <div className="text-5xl sm:text-6xl font-black text-white font-mono tracking-wider drop-shadow-[0_0_20px_rgba(99,102,241,0.3)]">
          {formattedTime}
        </div>
        <div className="w-48 h-1.5 bg-neutral-950 rounded-full mt-3 overflow-hidden border border-neutral-800">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Boshqaruv tugmalari */}
      <div className="flex items-center justify-center gap-3 mt-2">
        <button
          onClick={() => {
            sounds.playClick();
            setIsRunning(!isRunning);
          }}
          className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-lg active:scale-95 ${
            isRunning
              ? 'bg-amber-500 text-black hover:bg-amber-400'
              : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/30'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>To'xtatish</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Fokusni boshlash</span>
            </>
          )}
        </button>

        <button
          onClick={handleReset}
          className="p-2.5 rounded-xl border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer transition-colors active:scale-95"
          title="Qayta boshlash"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
