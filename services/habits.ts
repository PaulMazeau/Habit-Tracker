import {
  collection,
  query,
  where,
  onSnapshot,
  Unsubscribe,
  addDoc,
  Firestore,
} from "firebase/firestore";
import { Habits } from "../types/habits";
import { UserInfo } from "firebase/auth";

export const getHabits = (
  currentUser: UserInfo,
  store: Firestore,
  callback: (habits: Habits[]) => void
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
          } as Habits)
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
  currentUser: UserInfo,
  store: Firestore,
  habit: Omit<Habits, "id" | "user">
): Promise<void> => {
  if (!currentUser) {
    return;
  }

  try {
    await addDoc(collection(store, "habits"), {
      ...habit,
      user: currentUser.uid, // Note: Changed 'user' to 'User' to match your schema
    });
  } catch (error) {
    console.error("Error adding habit:", error);
    throw error; // Re-throw the error if you want to handle it in the calling component
  }
};
