import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserProfile, HexagonStats, DailyProtocolItem, FoodItem, AchievementBadge } from '@/types';

type DataField = 'stats' | 'protocols' | 'foods' | 'badges' | 'completedDays' | 'waterMl';

type FieldValueMap = {
  stats: HexagonStats;
  protocols: DailyProtocolItem[];
  foods: FoodItem[];
  badges: AchievementBadge[];
  completedDays: number[];
  waterMl: number;
};

const getUserDocRef = (uid: string) => doc(db, 'users', uid, 'data', 'main');
const getUserProfileRef = (uid: string) => doc(db, 'users', uid);

/**
 * Saves the full UserProfile to Firestore at users/{uid}
 */
export async function saveUserToFirestore(uid: string, data: UserProfile): Promise<void> {
  await setDoc(getUserProfileRef(uid), data, { merge: true });
}

/**
 * Loads the UserProfile from Firestore at users/{uid}
 */
export async function loadUserFromFirestore(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(getUserProfileRef(uid));
  if (snap.exists()) {
    return snap.data() as UserProfile;
  }
  return null;
}

/**
 * Saves a specific data field to users/{uid}/data/main
 */
export async function saveUserDataField<K extends DataField>(
  uid: string,
  field: K,
  value: FieldValueMap[K]
): Promise<void> {
  await setDoc(getUserDocRef(uid), { [field]: value }, { merge: true });
}

/**
 * Loads a specific data field from users/{uid}/data/main
 */
export async function loadUserDataField<K extends DataField>(
  uid: string,
  field: K
): Promise<FieldValueMap[K] | null> {
  const snap = await getDoc(getUserDocRef(uid));
  if (snap.exists()) {
    const data = snap.data();
    if (field in data) {
      return data[field] as FieldValueMap[K];
    }
  }
  return null;
}

/**
 * Loads all user data fields from users/{uid}/data/main
 */
export async function loadAllUserData(uid: string): Promise<Partial<FieldValueMap> | null> {
  const snap = await getDoc(getUserDocRef(uid));
  if (snap.exists()) {
    return snap.data() as Partial<FieldValueMap>;
  }
  return null;
}
