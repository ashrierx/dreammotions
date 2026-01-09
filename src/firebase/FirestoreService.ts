import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { firestore } from "./BaseConfig";
import { DreamEntry } from "../App";

export const saveDream = async (
  userId: string,
  dream: Omit<DreamEntry, "id">
) => {
  const dreamsRef = collection(firestore, `users/${userId}/dreams`);
  const docRef = await addDoc(dreamsRef, {
    ...dream,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const getUserDreams = async (userId: string): Promise<DreamEntry[]> => {
  const dreamsRef = collection(firestore, `users/${userId}/dreams`);
  const q = query(dreamsRef, orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as DreamEntry[];
};

export const updateDream = async (
  userId: string,
  dreamId: string,
  updates: Partial<DreamEntry>
) => {
  const dreamRef = doc(firestore, `users/${userId}/dreams/${dreamId}`);
  await updateDoc(dreamRef, updates);
};

export const deleteDream = async (userId: string, dreamId: string) => {
  const dreamRef = doc(firestore, `users/${userId}/dreams/${dreamId}`);
  await deleteDoc(dreamRef);
};
