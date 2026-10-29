import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { UserProfile, HexagonStats, DailyProtocolItem, FoodItem, AchievementBadge } from '@/types';

export interface UserFullData {
  user: UserProfile;
  stats: HexagonStats;
  protocols: DailyProtocolItem[];
  foods: FoodItem[];
  badges: AchievementBadge[];
  completedDays: number[];
  waterMl: number;
  updatedAt?: string;
}

/**
 * Foydalanuvchining to'liq profilini Firestore'ga saqlash
 */
export async function saveUserToFirestore(uid: string, profile: UserProfile): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, { profile, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (error) {
    console.error("Firestore'ga profilni saqlashda xatolik:", error);
  }
}

/**
 * Foydalanuvchi profilini Firestore'dan olish
 */
export async function loadUserFromFirestore(uid: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      return (data.profile as UserProfile) || null;
    }
    return null;
  } catch (error) {
    console.error("Firestore'dan profilni yuklashda xatolik:", error);
    return null;
  }
}

/**
 * Foydalanuvchining ma'lum bir bo'lim ma'lumotini saqlash (stats, protocols, foods, badges, va h.k.)
 */
export async function saveUserDataField<K extends keyof Omit<UserFullData, 'user'>>(
  uid: string,
  field: K,
  value: UserFullData[K]
): Promise<void> {
  try {
    const dataRef = doc(db, 'users', uid, 'data', 'main');
    await setDoc(
      dataRef,
      {
        [field]: value,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
  } catch (error) {
    console.error(`Firestore'ga ${field} saqlashda xatolik:`, error);
  }
}

/**
 * Foydalanuvchining barcha qo'shimcha ma'lumotlarini (stats, protocols, foods...) Firestore'dan yuklash
 */
export async function loadAllUserData(uid: string): Promise<Partial<UserFullData> | null> {
  try {
    const dataRef = doc(db, 'users', uid, 'data', 'main');
    const snap = await getDoc(dataRef);
    if (snap.exists()) {
      return snap.data() as Partial<UserFullData>;
    }
    return null;
  } catch (error) {
    console.error("Firestore'dan ilova ma'lumotlarini yuklashda xatolik:", error);
    return null;
  }
}

export const loadUserAppData = loadAllUserData;
