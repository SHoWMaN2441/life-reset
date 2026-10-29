import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { weight, goal, targetCalories } = await request.json();

    const cal = targetCalories || 2400;

    // Turli maqsadlar uchun shaxsiy menyu namunalari
    const mealPlans = {
      tana: {
        nonushta: {
          title: "3 dona qaynatilgan tuxum + 60g suli bo'tqasi + qora kofe",
          calories: 450,
          protein: 28,
          desc: "Ertalabki mushaklarni tiklash va metabolizmni quvvatlantirish uchun ajoyib boshlanish."
        },
        tushlik: {
          title: "200g dimlangan tovuq filesi + 150g grechka + yangi bodring-pomidor salati",
          calories: 620,
          protein: 48,
          desc: "Uzoq davom etuvchi energiya va sof oqsil zaxirasi."
        },
        kechki: {
          title: "180g pishirilgan baliq (yoki mol go'shti) + ko'katlar va brokkoli",
          calories: 480,
          protein: 42,
          desc: "Kechasi mushaklar sintezini oshiradi, og'irlik tug'dirmaydi."
        },
        snack: {
          title: "1 dona banan + 25g bodom yoki yong'oq + 150g kam yog'li tvorog",
          calories: 350,
          protein: 22,
          desc: "Organizm uchun sog'lom yog'lar va sekin parchalanuvchi kazein oqsili."
        }
      },
      intizom: {
        nonushta: {
          title: "Omelet (2 tuxum, ismaloq) + 1 bo'lak to'liq donli javdar noni + ko'k choy",
          calories: 400,
          protein: 22,
          desc: "Qondagi qand miqdorini bir maromda saqlab, ertalabki aqliy faollikni oshiradi."
        },
        tushlik: {
          title: "Mol go'shtli yengil sho'rva + 100g qora guruch + ko'katlar",
          calories: 550,
          protein: 35,
          desc: "Tushdan keyingi lanjlik va uyquchanlikni keltirib chiqarmaydi."
        },
        kechki: {
          title: "Tovuq filesidan tayyorlangan iliq salat + zaytun moyi",
          calories: 420,
          protein: 38,
          desc: "Tez hazm bo'ladi va sifatli uxlashga imkon beradi."
        },
        snack: {
          title: "Yashil olma + 1 stakan qatiq (kefir)",
          calories: 200,
          protein: 10,
          desc: "Ichak mikroflorasi va immunitet tayanchi."
        }
      }
    };

    const selectedPlan = goal === 'tana' ? mealPlans.tana : mealPlans.intizom;

    return NextResponse.json({
      success: true,
      targetCalories: cal,
      meals: selectedPlan
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
