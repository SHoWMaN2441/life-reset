'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, CloudRain, Wind, Waves, Disc } from 'lucide-react';

type SoundType = 'rain' | 'wind' | 'waves' | 'binaural';

export const AmbientSoundPlayer: React.FC = () => {
  const [activeSound, setActiveSound] = useState<SoundType | null>(null);
  const [volume, setVolume] = useState<number>(0.3);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceNodesRef = useRef<any[]>([]);

  const stopAll = () => {
    sourceNodesRef.current.forEach(node => {
      try {
        if (node.stop) node.stop();
        node.disconnect();
      } catch (e) {}
    });
    sourceNodesRef.current = [];
    setActiveSound(null);
  };

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const toggleSound = (type: SoundType) => {
    if (activeSound === type) {
      stopAll();
      return;
    }

    stopAll();
    const ctx = getAudioContext();

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume, ctx.currentTime);
    masterGain.connect(ctx.destination);
    gainNodeRef.current = masterGain;

    if (type === 'rain') {
      // Yomg'ir ovozi: White noise + Lowpass filter
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(masterGain);
      whiteNoise.start();

      sourceNodesRef.current.push(whiteNoise);
    } else if (type === 'binaural') {
      // 10Hz Alpha to'lqin: chap quloq 200Hz, o'ng quloq 210Hz
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();

      osc1.frequency.setValueAtTime(200, ctx.currentTime);
      osc2.frequency.setValueAtTime(210, ctx.currentTime);

      osc1.connect(masterGain);
      osc2.connect(masterGain);

      osc1.start();
      osc2.start();

      sourceNodesRef.current.push(osc1, osc2);
    } else if (type === 'wind') {
      // Shamol: Modullangan shovqin
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        data[i] = (b0 + b1 + b2) * 0.1;
      }

      const pinkNoise = ctx.createBufferSource();
      pinkNoise.buffer = buffer;
      pinkNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);

      pinkNoise.connect(filter);
      filter.connect(masterGain);
      pinkNoise.start();

      sourceNodesRef.current.push(pinkNoise);
    } else if (type === 'waves') {
      // Dengiz to'lqinlari: Past chastotali tebranish
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(65, ctx.currentTime);

      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0.3, ctx.currentTime);

      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start();

      sourceNodesRef.current.push(osc);
    }

    setActiveSound(type);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(newVol, audioCtxRef.current.currentTime);
    }
  };

  useEffect(() => {
    return () => {
      stopAll();
    };
  }, []);

  const soundsList = [
    { type: 'rain' as SoundType, label: 'Mayin Yomg\'ir', icon: CloudRain, color: 'text-blue-400' },
    { type: 'binaural' as SoundType, label: 'Alpha To\'lqin (10Hz)', icon: Disc, color: 'text-purple-400' },
    { type: 'wind' as SoundType, label: 'O\'rmon Shamoli', icon: Wind, color: 'text-emerald-400' },
    { type: 'waves' as SoundType, label: 'Tungi Okean', icon: Waves, color: 'text-cyan-400' },
  ];

  return (
    <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-emerald-400" />
            <span>AMBIENT FOVUSH TOVUSHLARI</span>
          </h3>
          <p className="text-xs text-neutral-400">Diqqatni 2x oshiruvchi tabiat chastotalari</p>
        </div>

        {activeSound && (
          <button
            onClick={stopAll}
            className="text-[11px] px-2.5 py-1 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1"
          >
            <VolumeX className="w-3.5 h-3.5" /> To'xtatish
          </button>
        )}
      </div>

      {/* Tovushlar tugmalari */}
      <div className="grid grid-cols-2 gap-2.5 my-2">
        {soundsList.map((s) => {
          const Icon = s.icon;
          const isActive = activeSound === s.type;
          return (
            <button
              key={s.type}
              onClick={() => toggleSound(s.type)}
              className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                isActive
                  ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-md shadow-emerald-500/10'
                  : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400 animate-pulse' : s.color}`} />
              <span className="text-xs font-semibold">{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Ovoz balandligi slayderi */}
      <div className="mt-3 pt-3 border-t border-neutral-800/80 flex items-center gap-3">
        <Volume2 className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
          className="w-full accent-emerald-500 cursor-pointer"
        />
        <span className="text-[10px] text-neutral-400 w-8 text-right font-mono">
          {Math.round(volume * 100)}%
        </span>
      </div>
    </div>
  );
};
