'use client';

import React, { useState } from 'react';
import { BookOpen, Check, Plus, BookMarked } from 'lucide-react';

export const BookTracker: React.FC = () => {
  const [bookTitle, setBookTitle] = useState('Atom Odatlar (Atomic Habits)');
  const [author, setAuthor] = useState('Jeyms Klir');
  const [totalPages, setTotalPages] = useState(320);
  const [currentPage, setCurrentPage] = useState(140);
  const [todayRead, setTodayRead] = useState(20);
  const [readTodayDone, setReadTodayDone] = useState(false);

  const percent = Math.min(100, Math.round((currentPage / totalPages) * 100));

  const handleMarkToday = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + todayRead));
    setReadTodayDone(true);
  };

  return (
    <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
            <BookMarked className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base font-bold text-white">KITOBXONLIK & ZUKKOLIK</h3>
            <p className="text-xs text-neutral-400">Kuniga 20 sahifa = Yiliga 24 ta kitob</p>
          </div>
        </div>

        <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-xl border border-blue-500/20">
          {percent}%
        </span>
      </div>

      {/* Kitob ma'lumotlari */}
      <div className="p-4 bg-neutral-950/70 border border-neutral-800 rounded-2xl mb-4">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-sm font-bold text-white">{bookTitle}</h4>
            <p className="text-xs text-neutral-400">{author}</p>
          </div>
          <span className="text-xs font-bold text-white font-mono">
            {currentPage} / {totalPages} bet
          </span>
        </div>

        <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden my-3">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>

        <button
          onClick={handleMarkToday}
          disabled={readTodayDone || currentPage >= totalPages}
          className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            readTodayDone
              ? 'bg-neutral-800 text-neutral-400'
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
          }`}
        >
          {readTodayDone ? (
            <>
              <Check className="w-4 h-4" /> <span>Bugungi 20 bet mutolaa qilindi!</span>
            </>
          ) : (
            <>
              <BookOpen className="w-4 h-4" /> <span>Bugungi 20 betni belgilash (+45 XP)</span>
            </>
          )}
        </button>
      </div>

      <div className="text-[11px] text-neutral-400 text-center">
        🧠 Mutolaa miyadagi neyroplastiklikni kuchaytiradi va diqqatni jamlash qobiliyatini tiklaydi.
      </div>
    </div>
  );
};
