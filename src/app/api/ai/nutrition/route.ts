import { NextResponse } from 'next/server';

// Ma'lumotlar bazasi - milliy va xalqaro taomlar kaloriyalari
const NUTRITION_DATABASE: Record<string, { cal: number; p: number; f: number; c: number }> = {
  'osh': { cal: 680, p: 24, f: 32, c: 75 },
  'palov': { cal: 680, p: 24, f: 32, c: 75 },
  'shashlik': { cal: 380, p: 35, f: 26, c: 2 },
  'somsa': { cal: 310, p: 12, f: 18, c: 25 },
  'manti': { cal: 320, p: 16, f: 14, c: 32 },
  'lagmon': { cal: 550, p: 22, f: 20, c: 70 },
  'sho\'rva': { cal: 260, p: 18, f: 14, c: 15 },
  'tuxum': { cal: 78, p: 6.5, f: 5.2, c: 0.6 },
  'tovuq': { cal: 165, p: 31, f: 3.6, c: 0 },
  'grechka': { cal: 130, p: 4.5, f: 1.1, c: 25 },
  'guruch': { cal: 130, p: 2.7, f: 0.3, c: 28 },
  'suli': { cal: 150, p: 5, f: 2.5, c: 27 },
  'non': { cal: 80, p: 3, f: 0.8, c: 15 },
  'banan': { cal: 105, p: 1.3, f: 0.3, c: 27 },
  'olma': { cal: 80, p: 0.4, f: 0.2, c: 20 },
  'tvorog': { cal: 120, p: 18, f: 4, c: 3 },
  'baliq': { cal: 140, p: 22, f: 5, c: 0 },
  'gosht': { cal: 250, p: 26, f: 16, c: 0 }
};

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Matn kiritilmadi' }, { status: 400 });
    }

    const lowerQuery = query.toLowerCase();

    // AI simulyatsiya qilingan semantik tahlil va miqdor hisoblash
    let totalCal = 0;
    let totalP = 0;
    let totalF = 0;
    let totalC = 0;
    let matchedItems: string[] = [];

    // Tekshirish
    Object.keys(NUTRITION_DATABASE).forEach((key) => {
      if (lowerQuery.includes(key)) {
        matchedItems.push(key);
        // Miqdor koeffitsiyenti (agar 2 ta, 200g, 300g kabi bo'lsa)
        let multiplier = 1;
        if (lowerQuery.includes('2 dona') || lowerQuery.includes('2 ta') || lowerQuery.includes('200')) multiplier = 2;
        if (lowerQuery.includes('3 dona') || lowerQuery.includes('3 ta') || lowerQuery.includes('300')) multiplier = 3;
        if (lowerQuery.includes('4 dona') || lowerQuery.includes('4 ta') || lowerQuery.includes('400')) multiplier = 4;
        if (lowerQuery.includes('yarim') || lowerQuery.includes('0.5')) multiplier = 0.5;

        const item = NUTRITION_DATABASE[key];
        totalCal += item.cal * multiplier;
        totalP += item.p * multiplier;
        totalF += item.f * multiplier;
        totalC += item.c * multiplier;
      }
    });

    // Agar aniq moslik topilmasa, o'rtacha sog'lom taom modeli asosida hisoblanadi
    if (totalCal === 0) {
      // Standart tahlil
      totalCal = 380;
      totalP = 22;
      totalF = 12;
      totalC = 45;
    }

    // AI tavsiyasi
    let advice = "Ushbu taom balanslashtirilgan. Kunlik oqsil me'yorini to'ldirish uchun ajoyib tanlov.";
    if (totalCal > 600) {
      advice = "Yuqori kaloriyali taom. Bugun jismoniy mashg'ulotlarga ko'proq e'tibor qaratish tavsiya etiladi.";
    } else if (totalP > 25) {
      advice = "Ajoyib yuqori oqsilli tarkib! Mushaklarni tiklash va metabolizmni tezlashtirish uchun ideal.";
    }

    return NextResponse.json({
      success: true,
      query,
      calories: Math.round(totalCal),
      protein: Math.round(totalP),
      fats: Math.round(totalF),
      carbs: Math.round(totalC),
      advice,
      healthScore: totalCal > 700 ? 'B' : totalP >= 20 ? 'A+' : 'A'
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
