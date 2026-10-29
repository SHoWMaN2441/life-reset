'use client';

import React, { useState } from 'react';
import { DollarSign, TrendingUp, PiggyBank, Plus, Check } from 'lucide-react';

interface FinanceChallengeProps {
  currentDay: number;
}

export const FinanceChallenge: React.FC<FinanceChallengeProps> = ({ currentDay }) => {
  const [savedAmount, setSavedAmount] = useState(150000); // so'm
  const [todayExpense, setTodayExpense] = useState('');
  const [expenseList, setExpenseList] = useState([
    { id: '1', title: 'Kitob sotib olish', amount: 45000 },
    { id: '2', title: 'Sog\'lom tushlik', amount: 35000 }
  ]);
  const [todayDepositSaved, setTodayDepositSaved] = useState(false);

  // 66 kunlik jamg'arish maqsadi (kunlik o'rtacha 20,000 so'm = 1,320,000 so'm)
  const targetTotal = 1320000;
  const progressPercent = Math.min(100, Math.round((savedAmount / targetTotal) * 100));

  const handleDepositToday = () => {
    setSavedAmount(prev => prev + 20000);
    setTodayDepositSaved(true);
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!todayExpense.trim()) return;
    const amount = parseInt(todayExpense.replace(/\D/g, '')) || 10000;
    setExpenseList(prev => [{ id: Date.now().toString(), title: 'Kundalik xarajat', amount }, ...prev]);
    setTodayExpense('');
  };

  return (
    <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
            <PiggyBank className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base font-bold text-white">66 KUNLIK MOLIYAVIY JAMG'ARMA</h3>
            <p className="text-xs text-neutral-400">Har kunlik kichik jamg'arma — kelajak erkinligi</p>
          </div>
        </div>

        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
          {progressPercent}%
        </span>
      </div>

      {/* Jamg'arma hisobi */}
      <div className="p-4 bg-neutral-950/70 border border-neutral-800 rounded-2xl mb-4">
        <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
          <span>To'plangan jamg'arma:</span>
          <span className="text-emerald-400 font-semibold">{savedAmount.toLocaleString()} so'm</span>
        </div>
        <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden my-2">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-neutral-500">
          <span>0 so'm</span>
          <span>Maqsad: {targetTotal.toLocaleString()} so'm</span>
        </div>

        {/* Bugungi jamg'arma tugmasi */}
        <button
          onClick={handleDepositToday}
          disabled={todayDepositSaved}
          className={`w-full mt-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            todayDepositSaved
              ? 'bg-neutral-800 text-neutral-400'
              : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20'
          }`}
        >
          {todayDepositSaved ? (
            <>
              <Check className="w-4 h-4" /> <span>Bugungi 20,000 so'm jamg'arildi</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" /> <span>Bugungi 20,000 so'mni jamg'armaga qo'shish</span>
            </>
          )}
        </button>
      </div>

      {/* Xarajat kiritish */}
      <form onSubmit={handleAddExpense} className="flex gap-2">
        <input
          type="text"
          placeholder="Bugungi xarajat (masalan 15,000)"
          value={todayExpense}
          onChange={(e) => setTodayExpense(e.target.value)}
          className="flex-1 px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
        />
        <button
          type="submit"
          className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold"
        >
          Qayd etish
        </button>
      </form>
    </div>
  );
};
