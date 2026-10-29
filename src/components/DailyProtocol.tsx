'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DailyProtocolItem, UserProfile } from '@/types';
import { CheckCircle2, Circle, Plus, Flame, Sparkles, Clock, Trash2, Award, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '@/utils/soundEffects';

interface DailyProtocolProps {
  protocols: DailyProtocolItem[];
  user: UserProfile;
  onToggleProtocol: (id: string) => void;
  onAddProtocol: (item: DailyProtocolItem) => void;
  onDeleteProtocol: (id: string) => void;
  onOpenCompleteDayModal?: () => void;
}

export const DailyProtocol: React.FC<DailyProtocolProps> = ({
  protocols,
  user,
  onToggleProtocol,
  onAddProtocol,
  onDeleteProtocol,
  onOpenCompleteDayModal
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTime, setNewTime] = useState('08:00');
  const [newCategory, setNewCategory] = useState<'tana' | 'aql' | 'intizom' | 'ruhiyat' | 'moliya' | 'odat'>('tana');

  const completedCount = protocols.filter(p => p.completed).length;
  const totalCount = protocols.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleToggle = (id: string, wasCompleted: boolean) => {
    onToggleProtocol(id);
    if (!wasCompleted) {
      sounds.playSuccess();
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 }
        });
      } catch (e) {
        console.log(e);
      }
    } else {
      sounds.playClick();
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: DailyProtocolItem = {
      id: 'custom-' + Date.now(),
      title: newTitle.trim(),
      description: newDesc.trim() || 'Shaxsiy kunlik shart',
      category: newCategory,
      completed: false,
      timeSlot: newTime,
      xp: 40,
      isCustom: true
    };

    onAddProtocol(newItem);
    sounds.playSuccess();
    setNewTitle('');
    setNewDesc('');
    setShowAddModal(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'tana': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'aql': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'intizom': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'ruhiyat': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'moliya': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
    }
  };

  return (
    <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl">
      {/* Sarlavha & Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400">
              <Flame className="w-5 h-5 fill-current" />
            </span>
            <h3 className="text-xl font-black text-white tracking-wide">
              KUNLIK SHARTLAR (PROTOKOL)
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            {user.dayNumber}-kun | Barcha shartlarni bajarib bugungi intizom g'alabasiga erishing
          </p>
        </div>

        {/* Qo'shish tugmasi va Bajarilish foizi */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 border border-neutral-700 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Yangi shart</span>
          </button>

          <div className="text-right">
            <div className="text-lg font-black text-emerald-400">
              {completedCount} / {totalCount}
            </div>
            <div className="text-[10px] text-neutral-400 uppercase tracking-wider">
              {progressPercent}% Bajarildi
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2.5 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800/80 mb-6">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Protokollar ro'yxati */}
      <div className="space-y-3">
        <AnimatePresence>
          {protocols.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                item.completed
                  ? 'bg-emerald-950/20 border-emerald-500/40 opacity-75'
                  : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div
                onClick={() => handleToggle(item.id, item.completed)}
                className="flex items-start gap-3.5 flex-1 cursor-pointer"
              >
                <button
                  type="button"
                  className="mt-0.5 text-neutral-400 hover:text-emerald-400 transition-colors"
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                  ) : (
                    <Circle className="w-5 h-5 text-neutral-500" />
                  )}
                </button>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className={`text-sm font-bold text-white transition-all ${
                      item.completed ? 'line-through text-neutral-400' : ''
                    }`}>
                      {item.title}
                    </h4>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${getCategoryColor(item.category)}`}>
                      {item.category.toUpperCase()}
                    </span>
                    {item.timeSlot && (
                      <span className="text-[11px] text-neutral-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.timeSlot}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
                  +{item.xp} XP
                </span>
                {item.isCustom && (
                  <button
                    onClick={() => onDeleteProtocol(item.id)}
                    className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Kun g'alabasi va Keyingi kunga o'tish tugmasi */}
      {progressPercent === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 border border-emerald-500/40 text-center"
        >
          <div className="inline-flex p-2.5 rounded-2xl bg-emerald-500/30 text-emerald-300 mb-2">
            <Award className="w-7 h-7" />
          </div>
          <h4 className="text-lg font-black text-white">
            BUGUNGI {user.dayNumber}-KUN 100% G'ALABA BILAN YAKUNLANDI!
          </h4>
          <p className="text-xs text-neutral-300 mt-1 mb-4">
            Barcha shartlarni to'liq bajardingiz. Neyron yo'llaringiz mustahkamlanmoqda.
          </p>

          <button
            onClick={onOpenCompleteDayModal}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-extrabold text-xs sm:text-sm shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 mx-auto transition-all active:scale-95"
          >
            <span>KUNNI YAKUNLASH VA {user.dayNumber + 1}-KUNNI BOSHLASH</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Yangi shart qo'shish modali */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl"
          >
            <h3 className="text-lg font-bold text-white mb-4">
              Yangi Kunlik Shart Qo'shish
            </h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">
                  Shart nomi
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: 50 ta turnik"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">
                  Tavsif (ixtiyoriy)
                </label>
                <input
                  type="text"
                  placeholder="Batafsil ma'lumot yoki qoida"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">
                    Vaqti
                  </label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">
                    Kategoriya
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="tana">Tana (Sport)</option>
                    <option value="intizom">Intizom</option>
                    <option value="aql">Aql</option>
                    <option value="ruhiyat">Ruhiyat</option>
                    <option value="moliya">Moliya</option>
                    <option value="odat">Odat</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-800 text-xs font-semibold text-neutral-400 hover:bg-neutral-800"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-lg shadow-emerald-500/20"
                >
                  Qo'shish
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
