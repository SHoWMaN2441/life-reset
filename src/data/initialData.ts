import { DailyProtocolItem, WorkoutExercise, AchievementBadge } from '@/types';

export interface OnboardingQuestion {
  id: number;
  question: string;
  subtitle: string;
  category: string;
  options: {
    label: string;
    description: string;
    icon: string;
    statsImpact: {
      tana: number;
      aql: number;
      intizom: number;
      ruhiyat: number;
      moliya: number;
      odatlar: number;
    };
  }[];
}

export const ONBOARDING_QUESTIONS: OnboardingQuestion[] = [
  {
    id: 1,
    question: "Dasturdan asosan nimani kuchaytirish uchun foydalanmoqchisiz?",
    subtitle: "Sizning tanlovingizga qarab 66 kunlik shaxsiy dastur shakllantiriladi",
    category: "primaryGoal",
    options: [
      {
        label: "Tana & Jismoniy Kuch",
        description: "Mushak massasi, ozish, quvvatni 2x oshirish va chidamlilik",
        icon: "💪",
        statsImpact: { tana: 35, aql: 5, intizom: 15, ruhiyat: 10, moliya: 0, odatlar: 15 }
      },
      {
        label: "Temir Intizom & Iroda",
        description: "Erta turish, chalg'imaslik, dangasalik va kechiktirishni yengish",
        icon: "⚡",
        statsImpact: { tana: 10, aql: 15, intizom: 35, ruhiyat: 10, moliya: 5, odatlar: 25 }
      },
      {
        label: "Aql, Fokus & Kitobxonlik",
        description: "Deep work (chuqur ishlash), xotira, haftasiga 1 ta kitob va diqqat",
        icon: "🧠",
        statsImpact: { tana: 5, aql: 35, intizom: 20, ruhiyat: 15, moliya: 5, odatlar: 10 }
      },
      {
        label: "Ruhiy Tinchlik & Anti-Stress",
        description: "Xavotirni yengish, meditatsiya, toza fikr va mustahkam asab",
        icon: "🧘",
        statsImpact: { tana: 10, aql: 15, intizom: 10, ruhiyat: 40, moliya: 0, odatlar: 15 }
      },
      {
        label: "Moliyaviy Erkinlik & Odatlar",
        description: "Daromadni oshirish, pulni to'g'ri tejash va investitsiya odati",
        icon: "📈",
        statsImpact: { tana: 0, aql: 15, intizom: 25, ruhiyat: 5, moliya: 40, odatlar: 15 }
      },
      {
        label: "To'liq Life Reset (Barchasi)",
        description: "Hayotning barcha 6 ta sohasini muvozanatli tarzda tubdan o'zgartirish",
        icon: "🔥",
        statsImpact: { tana: 20, aql: 20, intizom: 20, ruhiyat: 20, moliya: 10, odatlar: 20 }
      }
    ]
  },
  {
    id: 2,
    question: "Hozirgi jismoniy faolligingiz va mashg'ulot darajangiz qanday?",
    subtitle: "Kaloriya va mashg'ulotlar yuklamasini aniqlash uchun zarur",
    category: "activityLevel",
    options: [
      {
        label: "Boshlang'ich (Kam harakat)",
        description: "Asosan o'tirib ishlayman, haftasiga 0-1 marta yengil mashq",
        icon: "🌱",
        statsImpact: { tana: 10, aql: 5, intizom: 5, ruhiyat: 5, moliya: 0, odatlar: 5 }
      },
      {
        label: "O'rtacha faol",
        description: "Haftada 2-3 marta mashg'ulot yoki 6,000+ qadam",
        icon: "🏃",
        statsImpact: { tana: 20, aql: 10, intizom: 15, ruhiyat: 10, moliya: 0, odatlar: 15 }
      },
      {
        label: "Yuqori faol (Sportchi)",
        description: "Haftada 4-5 marta jiddiy sport zali yoki jismoniy mehnat",
        icon: "🏋️",
        statsImpact: { tana: 35, aql: 10, intizom: 25, ruhiyat: 15, moliya: 0, odatlar: 20 }
      }
    ]
  },
  {
    id: 3,
    question: "Tongda odatda soat nechida uyg'onasiz?",
    subtitle: "Muvaffaqiyatli insonlarning 90%i o'z kunini erta boshlaydi",
    category: "wakeUpTime",
    options: [
      {
        label: "05:00 - 06:00 (5 AM Club)",
        description: "Kun boshlanishidan avval shaxsiy rivojlanish vaqti",
        icon: "🌅",
        statsImpact: { tana: 15, aql: 15, intizom: 30, ruhiyat: 15, moliya: 5, odatlar: 20 }
      },
      {
        label: "06:30 - 08:00 (Normal rejim)",
        description: "Ish va o'qish vaqtiga mos standart tartib",
        icon: "☀️",
        statsImpact: { tana: 10, aql: 10, intizom: 15, ruhiyat: 10, moliya: 0, odatlar: 10 }
      },
      {
        label: "09:00 dan keyin (Kech uyg'onish)",
        description: "Kech yotib kech turish, tartibni to'liq yangilash kerak",
        icon: "🌙",
        statsImpact: { tana: 0, aql: 5, intizom: -10, ruhiyat: 0, moliya: 0, odatlar: -5 }
      }
    ]
  },
  {
    id: 4,
    question: "Ovqatlanish va dietadagi asosiy maqsadingiz nima?",
    subtitle: "AI kaloriya va BJU (oqsil, yog', uglevod) me'yorini tuzadi",
    category: "dietGoal",
    options: [
      {
        label: "Ortiqcha yog'larni yo'qotish (Ozish)",
        description: "Kaloriya defitsiti, yuqori oqsil va toza oziqlanish",
        icon: "🥗",
        statsImpact: { tana: 25, aql: 5, intizom: 20, ruhiyat: 10, moliya: 0, odatlar: 15 }
      },
      {
        label: "Mushak massasini oshirish (Kachka)",
        description: "Kaloriya profisiti, kuch mashqlari va ko'p oqsilli ratsion",
        icon: "🥩",
        statsImpact: { tana: 30, aql: 5, intizom: 20, ruhiyat: 5, moliya: 0, odatlar: 15 }
      },
      {
        label: "Maksimal energiya va sog'lom ovqatlanish",
        description: "Shakar va nosog'lom fastfudlardan voz kechish, to'laqonli ozuqa",
        icon: "🥑",
        statsImpact: { tana: 20, aql: 15, intizom: 15, ruhiyat: 20, moliya: 10, odatlar: 20 }
      }
    ]
  },
  {
    id: 5,
    question: "Kuniga o'rtacha qancha toza suv ichasiz?",
    subtitle: "Suv metabolizm, mushaklar tiklanishi va miya ravshanligining 70%ini tashkil qiladi",
    category: "waterIntake",
    options: [
      {
        label: "1 litrdan kam (Yetarli emas)",
        description: "Surunkali suvsizlanish, charchoq va sekin metabolizm xavfi",
        icon: "🏜️",
        statsImpact: { tana: -5, aql: 0, intizom: -5, ruhiyat: -5, moliya: 0, odatlar: -5 }
      },
      {
        label: "1.5L - 2L (O'rtacha me'yor)",
        description: "Kundalik ehtiyoj uchun normal daraja, ko'paytirish mumkin",
        icon: "💧",
        statsImpact: { tana: 15, aql: 10, intizom: 10, ruhiyat: 10, moliya: 0, odatlar: 10 }
      },
      {
        label: "2.5L - 3.5L (Optimal sport darajasi)",
        description: "Mukammal gidratsiya, yuqori energiya va toza teri",
        icon: "🌊",
        statsImpact: { tana: 25, aql: 15, intizom: 20, ruhiyat: 15, moliya: 0, odatlar: 20 }
      }
    ]
  },
  {
    id: 6,
    question: "Kunlik telefon va ekrandan foydalanish vaqtingiz qancha?",
    subtitle: "Dopamin balansi, diqqatni jamlash va uyqu sifati to'g'ridan-to'g'ri bog'liq",
    category: "screenTime",
    options: [
      {
        label: "1 - 2 soat (Minimal nazorat)",
        description: "Miyadagi dopamin retseptorlari toza, yuqori diqqat va o'zini idora qilish",
        icon: "💎",
        statsImpact: { tana: 5, aql: 25, intizom: 30, ruhiyat: 25, moliya: 5, odatlar: 25 }
      },
      {
        label: "3 - 4 soat (O'rtacha daraja)",
        description: "Ijtimoiy tarmoqlar va xabarlar bor, lekin nazorat qila oladi",
        icon: "📱",
        statsImpact: { tana: 0, aql: 10, intizom: 10, ruhiyat: 5, moliya: 0, odatlar: 10 }
      },
      {
        label: "5 - 7+ soat (Yuqori ekran tobe'ligi)",
        description: "Tez-tez reels/tiktok ko'rish, diqqat tarqoqligi va doimiy chalg'ish",
        icon: "🚨",
        statsImpact: { tana: -5, aql: -10, intizom: -20, ruhiyat: -15, moliya: 0, odatlar: -15 }
      }
    ]
  },
  {
    id: 7,
    question: "66 kunda o'zingizni qanday holatda ko'rishni xohlaysiz?",
    subtitle: "Natijani aniq tasavvur qilish muvaffaqiyatning 50%idir",
    category: "vision",
    options: [
      {
        label: "Reliyefli tana, charchoqsiz baquvvat quvvat",
        description: "Oynaga qaraganda g'ururlanadigan shakl va yangi kuch",
        icon: "🏆",
        statsImpact: { tana: 30, aql: 10, intizom: 20, ruhiyat: 15, moliya: 0, odatlar: 15 }
      },
      {
        label: "Buzilmas iroda va o'z sohamda yetakchilik",
        description: "Rejalashtirgan har bir maqsadni so'zsiz amalga oshirish qobiliyati",
        icon: "👑",
        statsImpact: { tana: 15, aql: 25, intizom: 35, ruhiyat: 20, moliya: 20, odatlar: 25 }
      },
      {
        label: "Moliyaviy intizom va stresssiz xotirjamlik",
        description: "Xarajatlar nazorati, jamg'arish va ichki garmoniya",
        icon: "🧘‍♂️",
        statsImpact: { tana: 10, aql: 20, intizom: 25, ruhiyat: 30, moliya: 35, odatlar: 20 }
      }
    ]
  }
];

export const SIXTY_SIX_PHASES = [
  {
    phase: 1,
    days: "1 - 22 kunlar",
    title: "SINDIRISh FAZASI (Destruction)",
    tagline: "Eski salbiy odatlarni yo'q qilish",
    description: "Miyadagi eski neyron aloqalar kuchli qarshilik ko'rsatadi. Bu eng qiyin bosqich: dangasalik, ichki bahonalar ko'payadi. Asosiy maqsad — har qanday holatda ham taslim bo'lmaslik!",
    color: "from-rose-500 to-red-600",
    bgColor: "bg-red-500/10 border-red-500/30 text-red-400"
  },
  {
    phase: 2,
    days: "23 - 44 kunlar",
    title: "O'RNATISh FAZASI (Installation)",
    tagline: "Yangi neyron yo'llarini shakllantirish",
    description: "Miyangiz yangi rejimga ko'nika boshlaydi. Iroda kuchiga bo'lgan ehtiyoj kamayib, yangi harakatlar tabiiydek tuyuladi. Tana va aql o'zgarishlarni his qila boshlaydi.",
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-500/10 border-amber-500/30 text-amber-400"
  },
  {
    phase: 3,
    days: "45 - 66 kunlar",
    title: "MUSTAHKAMLASH FAZASI (Integration)",
    tagline: "Odatni shaxsiy xarakterga singdirish",
    description: "Yangi odatlar sizning ikkinchi tabiyatingizga aylanadi (avtomatizm). Endi ertalab turish, sport, sog'lom ovqatlanish uchun zo'riqish shart emas — bu sizning yangi hayot tarzingiz!",
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
  }
];

export const DEFAULT_DAILY_PROTOCOLS: Record<string, DailyProtocolItem[]> = {
  tana: [
    { id: "t1", title: "Erta tonggi jismoniy mashq (20 daqiqa)", description: "30 ta push-up, 40 ta squat, 1 daqiqa plank", category: "tana", completed: false, timeSlot: "06:30", xp: 50 },
    { id: "t2", title: "Kamida 2.5 litr toza suv ichish", description: "Kun davomida metabolizmni va mushaklarni to'ydirish", category: "tana", completed: false, timeSlot: "Kun davomida", xp: 30 },
    { id: "t3", title: "Shakarsiz va gazli ichimliklarsiz kun", description: "Hech qanday oq shakar, shirinlik va energetiklarsiz", category: "odat", completed: false, timeSlot: "Kechgacha", xp: 40 },
    { id: "t4", title: "120g+ oqsil normasini to'ldirish", description: "Tuxum, tovuq go'shti, tvorog yoki baliq iste'mol qilish", category: "tana", completed: false, timeSlot: "Ovqatlanish", xp: 45 },
    { id: "t5", title: "10,000 qadam yoki 3 km yugurish", description: "Yurak-qon tomir tizimini chiniqtirish", category: "tana", completed: false, timeSlot: "18:00", xp: 50 },
    { id: "t6", title: "Kechki sovuq dush (Contrast shower)", description: "Mushaklar tiklanishi va testosteron sintezi uchun", category: "tana", completed: false, timeSlot: "21:30", xp: 35 }
  ],
  intizom: [
    { id: "i1", title: "06:00 dan kech qolmasdan uyg'onish", description: "Budilnikni birinchi jarangidayoq o'rnidan turish", category: "intizom", completed: false, timeSlot: "06:00", xp: 50 },
    { id: "i2", title: "To'shakni yig'ish va xonani tartibga keltirish", description: "Kunning birinchi intizomli g'alabasi", category: "odat", completed: false, timeSlot: "06:10", xp: 20 },
    { id: "i3", title: "45 daqiqalik Dopamin Detoks (Telefonsiz tong)", description: "Uyg'ongach ilk 45 daqiqada ijtimoiy tarmoqlarga kirmaslik", category: "intizom", completed: false, timeSlot: "06:00 - 06:45", xp: 40 },
    { id: "i4", title: "90 daqiqa Chuqur Diqqat (Deep Work)", description: "Bildirishnomalarsiz eng muhim asosiy vazifani bajarish", category: "aql", completed: false, timeSlot: "09:00 - 10:30", xp: 60 },
    { id: "i5", title: "Kunlik xarajatlarni qayd etish", description: "Har bir sarflangan tiyinni moliyaviy jadvalga kiritish", category: "moliya", completed: false, timeSlot: "20:00", xp: 25 },
    { id: "i6", title: "Kechki 23:00 da barcha ekranlarni o'chirish", description: "Melatonin ishlab chiqarilishi uchun uxlash gigiyenasi", category: "intizom", completed: false, timeSlot: "23:00", xp: 40 }
  ],
  barchasi: [
    { id: "all1", title: "Tonggi 06:00 da uyg'onish va 500ml suv", description: "Tanani uyg'otish va metabolizmni ishga tushirish", category: "intizom", completed: false, timeSlot: "06:00", xp: 40 },
    { id: "all2", title: "25 daqiqalik tana mashg'uloti", description: "Kuch, egiluvchanlik va qon aylanishi", category: "tana", completed: false, timeSlot: "06:30", xp: 50 },
    { id: "all3", title: "20 sahifa foydali kitob mutolaasi", description: "Shaxsiy rivojlanish, biznes yoki psixologiya kitobi", category: "aql", completed: false, timeSlot: "07:30", xp: 45 },
    { id: "all4", title: "Kunlik kaloriya va oqsil normasiga rioya qilish", description: "Nosog'lom fastfudlarsiz, toza mahsulotlar", category: "tana", completed: false, timeSlot: "Kun davomida", xp: 40 },
    { id: "all5", title: "Kunlik minnatdorchilik kundaligi", description: "Bugun sodir bo'lgan 3 ta yaxshi voqeani yozib qo'yish", category: "ruhiyat", completed: false, timeSlot: "21:00", xp: 30 },
    { id: "all6", title: "Moliyaviy nazorat va ertangi kun rejasi", description: "Ertangi 3 ta bosh ustuvor vazifani belgilab olish", category: "moliya", completed: false, timeSlot: "22:00", xp: 35 }
  ]
};

export const WORKOUT_ROUTINES: WorkoutExercise[] = [
  {
    id: "w1",
    name: "Klassik Otjimanie (Push-ups)",
    sets: 4,
    reps: "15-20 marta",
    restSeconds: 60,
    targetMuscle: "Ko'krak, tritseps, yelka",
    instructions: "Gavdani to'g'ri chiziqda ushlang, ko'krakni deyarli polga tegizing va nafas chiqarib ko'taring.",
    difficulty: "boshlangich"
  },
  {
    id: "w2",
    name: "Chuqur Prisedaniya (Squats)",
    sets: 4,
    reps: "25 marta",
    restSeconds: 45,
    targetMuscle: "Son, dumba, boldir",
    instructions: "Tizzalar oyoq uchi bilan parallel yo'nalishda, orqani to'g'ri tutib chuqur o'tiring.",
    difficulty: "boshlangich"
  },
  {
    id: "w3",
    name: "Statik Plank (Core Plank)",
    sets: 3,
    reps: "60 soniya",
    restSeconds: 60,
    targetMuscle: "Press, qorin mushaklari, bel",
    instructions: "Tirsaklarda turing, qorinni ichkariga torting, belni bukmasdan qattiq ushlang.",
    difficulty: "ortacha"
  },
  {
    id: "w4",
    name: "Turnikda tortilish (Pull-ups)",
    sets: 4,
    reps: "8-12 marta",
    restSeconds: 90,
    targetMuscle: "Keng orqa mushaklari, bitseps",
    instructions: "Yelka kengligida ushlang, iyak turnikdan yuqoriga chiqquncha tortiling va sekin tushing.",
    difficulty: "yuqori"
  },
  {
    id: "w5",
    name: "Byorpi (Burpees)",
    sets: 3,
    reps: "15 marta",
    restSeconds: 60,
    targetMuscle: "Butun tana, kardiomushak",
    instructions: "Prisedaniyadan plank holatiga sakrang, otjimanie qiling va yuqoriga qarsak bilan sakrang.",
    difficulty: "yuqori"
  },
  {
    id: "w6",
    name: "Velosiped press (Bicycle Crunches)",
    sets: 3,
    reps: "20 marta (har bir tomonga)",
    restSeconds: 45,
    targetMuscle: "Qiyshiq va to'g'ri qorin mushaklari",
    instructions: "Chalqancha yotib, qarama-qarshi tirsakni tizzaga tekkizing, matbuotni qisib turing.",
    difficulty: "ortacha"
  }
];

export const INITIAL_BADGES: AchievementBadge[] = [
  { id: "b1", title: "Birinchi Qadam", description: "Life Reset dasturida ro'yxatdan o'tib dastur tuzdingiz", icon: "🚀", unlocked: true, unlockedAt: "Bugun", category: "Onboarding", xpBonus: 100 },
  { id: "b2", title: "Temir Intizom", description: "Ketma-ket 3 kun barcha kunlik shartlarni bajardingiz", icon: "⚡", unlocked: false, category: "Streak", xpBonus: 150 },
  { id: "b3", title: "5 AM Club", description: "Ertalab soat 06:00 dan oldin uyg'onish protokoli", icon: "🌅", unlocked: false, category: "Uyg'onish", xpBonus: 200 },
  { id: "b4", title: "Gidratsiya Qiroli", description: "Kunlik 2.5L suv normasini to'liq yakunladingiz", icon: "💧", unlocked: false, category: "Suv", xpBonus: 100 },
  { id: "b5", title: "AI Kaloriya Nazorati", description: "AI kaloriya hisoblagich orqali 5 marta ovqat kiritdingiz", icon: "🥗", unlocked: false, category: "Oziqlanish", xpBonus: 120 },
  { id: "b6", title: "Faza 1 Qahramoni", description: "22 kunlik Sindirish bosqichini muvaffaqiyatli yakunladingiz", icon: "🛡️", unlocked: false, category: "66 Kunlik", xpBonus: 500 },
  { id: "b7", title: "Dopamin Ustasi", description: "Ketma-ket 3 kun telefon ekran vaqtini 2 soatdan kamaytirdingiz", icon: "📵", unlocked: false, category: "Detoks", xpBonus: 250 },
  { id: "b8", title: "Deep Work Geniyi", description: "Pomodoro timer orqali 120 daqiqa to'xtovsiz diqqat jamladingiz", icon: "⏱️", unlocked: false, category: "Fokus", xpBonus: 200 },
  { id: "b9", title: "Sportchi Qoni", description: "Barcha kuchli mashg'ulotlarni 100% bajardingiz", icon: "🏋️", unlocked: false, category: "Sport", xpBonus: 300 },
  { id: "b10", title: "66 KUNLIK AFSONA", description: "To'liq 66 kunlik transformatsiyani yakunlab yangi shaxsga aylandingiz!", icon: "👑", unlocked: false, category: "Master", xpBonus: 2000 }
];

export const MOTIVATIONAL_QUOTES = [
  { text: "Biz har kuni takrorlaydigan narsamizning o'zimizmiz. Mukammallik — bu harakat emas, bu odatdir.", author: "Aristotel" },
  { text: "Odatlaringizni o'zgartirsangiz, hayotingizni o'zgartirasiz.", author: "Jeyms Klir (Atom Odatlar)" },
  { text: "Qiyin tanlovlar — oson hayot. Oson tanlovlar — qiyin hayot.", author: "Yerji Gregorek" },
  { text: "Iroda bu mushak kabi: qancha ko'p ishlatsang, shuncha baquvvat bo'ladi.", author: "Life Reset Protocol" },
  { text: "Ertalabki g'alaba butun kun g'alabasining garovidir.", author: "Robin Sharma" }
];
