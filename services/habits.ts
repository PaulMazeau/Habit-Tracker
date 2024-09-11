import {
  collection,
  query,
  where,
  onSnapshot,
  Unsubscribe,
  addDoc,
} from "firebase/firestore";
import { HabitsType } from "../types/habits";

export const getHabits = (
  currentUser,
  store,
  callback: (habits: HabitsType[]) => void
): Unsubscribe => {
  if (!currentUser) {
    callback([]);
    return () => {};
  }

  const q = query(
    collection(store, "habits"),
    where("user", "==", currentUser.uid)
  );

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const habits = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as HabitsType)
      );
      callback(habits);
    },
    (error) => {
      console.error("Error fetching habits:", error);
      callback([]);
    }
  );

  return unsubscribe;
};

export const addHabit = async (
  currentUser,
  store,
  habit: Omit<HabitsType, "id" | "User">
): Promise<void> => {
  if (!currentUser) {
    return;
  }

  try {
    await addDoc(collection(store, "habits"), {
      ...habit,
      User: currentUser.uid, // Note: Changed 'user' to 'User' to match your schema
    });
  } catch (error) {
    console.error("Error adding habit:", error);
    throw error; // Re-throw the error if you want to handle it in the calling component
  }
};
