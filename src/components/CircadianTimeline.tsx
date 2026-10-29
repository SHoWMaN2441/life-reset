'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Sun, Moon, Zap, Activity, Coffee, ShieldCheck } from 'lucide-react';

interface CircadianEvent {
  time: string;
  hour: number;
  title: string;
  desc: string;
  icon: any;
  category: 'wake' | 'focus' | 'body' | 'fuel' | 'sleep';
  tag: string;
}

const EVENTS: CircadianEvent[] = [
  { time: '06:00', hour: 6, title: "Uyg'onish & Gidratsiya", desc: "Metabolizmni ishga tushirish uchun 500ml iliq suv", icon: Sun, category: 'wake', tag: 'Kortizol boshlanishi' },
  { time: '07:00', hour: 7, title: "Jismoniy Mashq (Sport)", desc: "Mushaklar va yurak-qon tomir tizimini uyg'otish", icon: Zap, category: 'body', tag: 'Testosteron cho\'qqisi' },
  { time: '09:00', hour: 9, title: "Deep Work (Eng muhim ish)", desc: "Miyadagi prefrontal qobiq maksimal diqqat rejimida", icon: Activity, category: 'focus', tag: 'Maksimal kognitiv quvvat' },
  { time: '13:00', hour: 13, title: "Metabolik Tushlik", desc: "Oqsilli to'yimli ovqat va 10 daqiqalik yengil yurish", icon: Coffee, category: 'fuel', tag: 'Energiya tiklash' },
  { time: '16:00', hour: 16, title: "2-Diqqat va Qayta ko'rib chiqish", desc: "Kunlik rejalarni yakunlash va muzokaralar", icon: Zap, category: 'focus', tag: 'Yuqori samaradorlik' },
  { time: '19:00', hour: 19, title: "Yengil Kechki Ovqat", desc: "Uyqudan kamida 3 soat oldin oson hazm bo'ladigan ozuqa", icon: Coffee, category: 'fuel', tag: 'Oshqozon dam olishi' },
  { time: '21:00', hour: 21, title: "Raqamli Detoks (Ekransiz)", desc: "Ko'k nurni cheklash, kitob mutolaasi va shukronalik", icon: Moon, category: 'sleep', tag: 'Melatonin sintezi' },
  { time: '22:30', hour: 22, title: "Chuqur Tiklanish Uyqusi", desc: "Qorong'i va salqin xonada hujayralar yangilanishi", icon: Moon, category: 'sleep', tag: 'Hujayra regeneratsiyasi' }
];

export const CircadianTimeline: React.FC = () => {
  const [currentHour, setCurrentHour] = useState(new Date().getHours());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHour(new Date().getHours());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const getActiveIndex = () => {
    for (let i = EVENTS.length - 1; i >= 0; i--) {
      if (currentHour >= EVENTS[i].hour) return i;
    }
    return EVENTS.length - 1;
  };

  const activeIdx = getActiveIndex();

  return (
    <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Clock className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-black text-white tracking-wide">
              SIRKADIAN BIOLOGIK RITM (24 SOATLIK PROTOKOL)
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Gormonlar va tana bioritmlariga mos kunlik tartib. Hozirgi vaqt: <strong className="text-emerald-400">{String(currentHour).padStart(2, '0')}:00</strong>
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Hozirgi faol faza: <strong className="text-white">{EVENTS[activeIdx].title.split(' ')[0]}</strong></span>
        </div>
      </div>

      {/* Gorizontal scroll qilinadigan xronologik kartochkalar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {EVENTS.map((ev, idx) => {
          const Icon = ev.icon;
          const isCurrent = idx === activeIdx;
          const isPassed = currentHour > ev.hour && !isCurrent;

          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden select-none hover:scale-[1.02] ${
                isCurrent
                  ? 'bg-gradient-to-br from-emerald-500/20 via-neutral-950 to-neutral-900 border-emerald-500 shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/50'
                  : isPassed
                  ? 'bg-neutral-950/40 border-neutral-800/60 opacity-60 hover:opacity-100'
                  : 'bg-neutral-950/70 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              {isCurrent && (
                <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500 text-black text-[9px] font-black uppercase tracking-wider">
                  Faol
                </div>
              )}

              <div className="flex items-center gap-2.5 mb-2">
                <span className={`p-2 rounded-xl text-xs ${
                  isCurrent
                    ? 'bg-emerald-500 text-black font-black'
                    : 'bg-neutral-900 border border-neutral-800 text-neutral-300'
                }`}>
                  <Icon className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-xs font-mono font-bold text-neutral-400 block">
                    {ev.time}
                  </span>
                  <span className="text-[10px] text-amber-400 font-semibold block">
                    {ev.tag}
                  </span>
                </div>
              </div>

              <h4 className="text-sm font-bold text-white mb-1">
                {ev.title}
              </h4>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                {ev.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
