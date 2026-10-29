'use client';

import React from 'react';
import { HexagonStats } from '@/types';
import { motion } from 'framer-motion';

interface HexagonRadarProps {
  stats: HexagonStats;
  targetStats?: HexagonStats;
  size?: number;
  showComparison?: boolean;
}

const AXES = [
  { key: 'tana', label: 'Tana (Sport)', icon: '💪', color: '#ef4444' },
  { key: 'aql', label: 'Aql (Zukkolik)', icon: '🧠', color: '#3b82f6' },
  { key: 'intizom', label: 'Intizom (Iroda)', icon: '⚡', color: '#f59e0b' },
  { key: 'ruhiyat', label: 'Ruhiyat (Anti-stress)', icon: '🧘', color: '#8b5cf6' },
  { key: 'moliya', label: 'Moliya (Nazorat)', icon: '📈', color: '#10b981' },
  { key: 'odatlar', label: 'Odatlar (Barqarorlik)', icon: '💎', color: '#06b6d4' }
] as const;

export const HexagonRadar: React.FC<HexagonRadarProps> = ({
  stats,
  targetStats = { tana: 95, aql: 90, intizom: 98, ruhiyat: 92, moliya: 88, odatlar: 96 },
  size = 360,
  showComparison = true
}) => {
  const center = size / 2;
  const radius = (size / 2) - 45;
  const numAxes = 6;
  const angleStep = (Math.PI * 2) / numAxes;

  // Hisoblash: har bir burchak koordinatasini topish (boshlang'ich burchak -90 gradus, ya'ni tepadan boshlanadi)
  const getCoordinates = (value: number, index: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (Math.max(10, Math.min(value, 100)) / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // 6 burchakli to'r qavatlari (20%, 40%, 60%, 80%, 100%)
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const getPolygonPoints = (data: HexagonStats) => {
    return AXES.map((axis, index) => {
      const val = data[axis.key as keyof HexagonStats] || 50;
      const { x, y } = getCoordinates(val, index);
      return `${x},${y}`;
    }).join(' ');
  };

  const currentPoints = getPolygonPoints(stats);
  const targetPoints = getPolygonPoints(targetStats);

  // O'rtacha ball
  const avgCurrent = Math.round(
    Object.values(stats).reduce((a, b) => a + b, 0) / 6
  );
  const avgTarget = Math.round(
    Object.values(targetStats).reduce((a, b) => a + b, 0) / 6
  );

  return (
    <div className="relative flex flex-col items-center bg-gradient-to-b from-neutral-900/90 to-neutral-950 p-6 rounded-3xl border border-neutral-800 shadow-2xl backdrop-blur-xl">
      {/* Sarlavha va solishtirish ko'rsatkichi */}
      <div className="w-full flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-lg font-bold text-white tracking-wide">
              6 Burchakli Hayot Balansi
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Hozirgi holatingiz va 66 kundan keyingi maqsadli natija
          </p>
        </div>

        <div className="text-right">
          <div className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            {avgCurrent}%
          </div>
          <span className="text-[10px] text-neutral-400 uppercase tracking-wider">
            Umumiy ball
          </span>
        </div>
      </div>

      {/* SVG Radar */}
      <div className="relative">
        <svg width={size} height={size} className="overflow-visible">
          <defs>
            {/* Gradient to'ldirish: Hozirgi holat */}
            <radialGradient id="currentGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.15" />
            </radialGradient>

            {/* Gradient to'ldirish: 66 kundan keyingi maqsad */}
            <radialGradient id="targetGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.05" />
            </radialGradient>
          </defs>

          {/* Fon to'rlari (6 burchakli konsentrik qavatlar) */}
          {gridLevels.map((level, lvlIdx) => {
            const pts = Array.from({ length: numAxes })
              .map((_, i) => {
                const angle = i * angleStep - Math.PI / 2;
                const r = level * radius;
                return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
              })
              .join(' ');

            return (
              <polygon
                key={lvlIdx}
                points={pts}
                fill={lvlIdx === gridLevels.length - 1 ? 'rgba(255,255,255,0.02)' : 'none'}
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth={lvlIdx === gridLevels.length - 1 ? 1.5 : 1}
                strokeDasharray={lvlIdx < gridLevels.length - 1 ? '3 3' : 'none'}
              />
            );
          })}

          {/* O'q chiziqlari (markazdan har bir burchakka) */}
          {AXES.map((_, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="1"
              />
            );
          })}

          {/* 66 kundan keyingi maqsadli ko'rsatkich konturi (dashed) */}
          {showComparison && (
            <motion.polygon
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              points={targetPoints}
              fill="url(#targetGradient)"
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className="transition-all"
            />
          )}

          {/* Hozirgi holat poligon shakli (Neon glow) */}
          <motion.polygon
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: 'backOut' }}
            points={currentPoints}
            fill="url(#currentGradient)"
            stroke="#10b981"
            strokeWidth="2.5"
            className="filter drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]"
          />

          {/* Burchaklardagi interaktiv nuqtalar */}
          {AXES.map((axis, i) => {
            const val = stats[axis.key as keyof HexagonStats] || 50;
            const { x, y } = getCoordinates(val, i);
            return (
              <g key={axis.key}>
                <circle
                  cx={x}
                  cy={y}
                  r="5"
                  fill={axis.color}
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="filter drop-shadow-[0_0_8px_currentColor]"
                />
              </g>
            );
          })}

          {/* O'qlar belgilari va yozuvlari */}
          {AXES.map((axis, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const labelRadius = radius + 32;
            const lx = center + labelRadius * Math.cos(angle);
            const ly = center + labelRadius * Math.sin(angle);
            const val = stats[axis.key as keyof HexagonStats] || 50;

            return (
              <g key={`label-${axis.key}`} className="cursor-pointer">
                <text
                  x={lx}
                  y={ly - 6}
                  textAnchor="middle"
                  className="fill-neutral-300 text-[11px] font-semibold tracking-wider"
                >
                  {axis.icon} {axis.label.split(' ')[0]}
                </text>
                <text
                  x={lx}
                  y={ly + 8}
                  textAnchor="middle"
                  className="fill-emerald-400 text-[12px] font-black"
                >
                  {val}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend & 66 Kunlik Taqqoslama */}
      <div className="w-full mt-4 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          <span className="text-neutral-300 font-medium">Hozirgi holat ({avgCurrent}%)</span>
        </div>

        {showComparison && (
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full border border-dashed border-amber-400 bg-amber-400/20" />
            <span className="text-amber-400 font-medium">66 kundan keyin ({avgTarget}%)</span>
          </div>
        )}
      </div>

      {/* Qisqa tavsif */}
      <div className="w-full mt-3 p-3 bg-neutral-800/40 rounded-xl border border-neutral-800 text-[11px] text-neutral-400 leading-relaxed">
        💡 <strong className="text-neutral-200">Reset Analizi:</strong> 66 kun ichida doimiy protokollarga amal qilsangiz, past ko'rsatkichli sohalaringiz o'rtacha <span className="text-emerald-400 font-bold">+{avgTarget - avgCurrent}%</span> ga oshadi va to'liq muvozanatga keladi.
      </div>
    </div>
  );
};
