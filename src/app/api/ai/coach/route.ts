import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message, userProfile, persona = 'spartan' } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Xabar kiritilmadi' }, { status: 400 });
    }

    const lower = message.toLowerCase();
    const name = userProfile?.firstName || 'Qahramon';
    const day = userProfile?.dayNumber || 1;
    const goal = userProfile?.primaryGoal || 'barchasi';
    const weight = userProfile?.weight || 72;

    let reply = "";

    // Persona bo'yicha javoblar
    if (persona === 'spartan') {
      // Qat'iy intizom (David Goggins / Temir Iroda)
      if (lower.includes('charchadim') || lower.includes('dangasalik') || lower.includes('qiyin') || lower.includes('ertaga qilsam')) {
        reply = `${name}, to'xtang! Miyangiz sizni aldashga urinyapti. Qulaylik — bu o'sishning dushmani. Siz hozir ${day}-kundasiz, agar bugun taslim bo'lsangiz, ertaga yana 1-kunga qaytasiz. Chuqur nafas oling, to'shakdan turing va protokoldagi bitta vazifani so'zsiz bajaring. Bahonalar nolga teng!`;
      } else if (lower.includes('sport') || lower.includes('mashq') || lower.includes('kuch')) {
        reply = `${name}, kuchli tana — intizomli aqldan boshlanadi. Bugungi mashqni yarim kuch bilan emas, 100% konsentratsiya bilan bajaring. Oxirgi 2 ta og'riqli takror (rep) sizning xarakteringizni shakllantiradi!`;
      } else {
        reply = `${name}, men sizning Spartan Intizom Murabbiyingizman. Maqsadingiz aniq, rejangiz bor. Savolingiz bormi yoki hozirning o'zida harakatni boshlaymizmi?`;
      }
    } else if (persona === 'arnold') {
      // Sport va tana rivojlantirish (Arnold uslubi)
      if (lower.includes('mushak') || lower.includes('kachka') || lower.includes('sport') || lower.includes('otjimanie')) {
        reply = `Salom ${name}! Mushak o'sishining siri 3 ta narsada: 1) Progressiv yuklama (har hafta takrorlarni oshirish), 2) Kunlik ${Math.round(weight * 2)}g oqsil, 3) 8 soatlik chuqur uyqu. Mashq davomida mushakning qisqarishini miyangiz bilan his qiling (Mind-Muscle connection)!`;
      } else if (lower.includes('ovqat') || lower.includes('oqsil') || lower.includes('kaloriya')) {
        reply = `Sizning vazningiz ${weight} kg bo'lsa, tanangizga kuniga kamida ${Math.round(weight * 2)}g sof oqsil kerak. Har bir ovqatlanishingizda 30-40g oqsil bo'lishini ta'minlang: tovuq filesi, tuxum oqi, tvorog yoki mol go'shti. Fastfud va shirinliklarni chetga suring!`;
      } else {
        reply = `Salom ${name}! Men sizning Tana va Sport Murabbiyingizman. Mashg'ulotlar texnikasi yoki jismoniy rivojlanish bo'yicha qanday savolingiz bor?`;
      }
    } else if (persona === 'zen') {
      // Stoik va Ruhiy xotirjamlik (Zen Master)
      if (lower.includes('xavotir') || lower.includes('stress') || lower.includes('asab') || lower.includes('uyqu')) {
        reply = `Tinchlaning, ${name}. Dunyodagi barcha narsalarni nazorat qila olmaysiz, lekin o'z fikrlaringiz va reaksiyangizni 100% nazorat qila olasiz. Hozir 4 soniya chuqur nafas oling (Box Breathing) va e'tiboringizni faqat ayni daqiqaga qarating. Bugungi kuningiz — sizning butun hayotingizning kichik modeli.`;
      } else {
        reply = `Salom ${name}. Ichki xotirjamlik va ruhiy muvozanat — eng buyuk kuchdir. Qanday ruhiy yoki aqliy qiyinchilik sizni o'ylantirmoqda?`;
      }
    } else {
      // AI Nutrisiolog / Shifokor
      if (lower.includes('kaloriya') || lower.includes('suv') || lower.includes('ratsion') || lower.includes('ozish')) {
        reply = `Salomatlik tahlili, ${name}: Sizning kunlik optimal kaloriya ehtiyojingiz taxminan ${Math.round(weight * 32)} kcal. Suv balansi esa kuniga kamida ${(weight * 0.035).toFixed(1)} litr bo'lishi shart. Ovqatlanishda ko'proq yashil sabzavotlar, murakkab uglevodlar (suli, grechka) va toza oqsillarga tayaning.`;
      } else {
        reply = `Salom ${name}! Men sizning AI Nutrisiolog va Bioritm Maslahatchisiman. Kaloriya balansi, ovqatlar tarkibi yoki uyqu faza tahlili bo'yicha yordam berishim mumkin.`;
      }
    }

    return NextResponse.json({
      success: true,
      persona,
      reply
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
