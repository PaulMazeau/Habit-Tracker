import {
  collection,
  query,
  where,
  onSnapshot,
  Unsubscribe,
  addDoc,
} from "firebase/firestore";
import { HabitsByDate, HabitsType } from "../types/habits";

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

export const getAllHabitsCalendar = (
  currentUser: { uid: string } | null,
  store: any,
  callback: (habitsByDates: {
    [key: string]: { totalHabits: number; habits: number };
  }) => void
): Unsubscribe => {
  if (!currentUser) {
    callback({});
    return () => {};
  }

  let totalHabits = 0;
  let habitsByDates: {
    [key: string]: { totalHabits: number; habits: number };
  } = {};

  const habitsUnsubscribe = getHabits(currentUser, store, (habits) => {
    totalHabits = habits.length;
    updateHabitsByDates();
  });

  const userHabitsUnsubscribe = onSnapshot(
    query(
      collection(store, "user_habits"),
      where("user", "==", currentUser.uid)
    ),
    (querySnapshot) => {
      habitsByDates = {}; // Reset habitsByDates
      querySnapshot.docs.forEach((doc) => {
        const habit = { id: doc.id, ...doc.data() } as HabitsByDate;
        const date = habit.date.toDate();
        const dateKey = `${date.getFullYear()}/${
          date.getMonth() + 1
        }/${date.getDate()}`;

        if (!habitsByDates[dateKey]) {
          habitsByDates[dateKey] = { totalHabits, habits: 0 };
        }
        habitsByDates[dateKey].habits = habit.habits.length;
      });

      updateHabitsByDates();
    },
    (error) => {
      console.error("Error fetching user habits:", error);
      callback({});
    }
  );

  function updateHabitsByDates() {
    Object.keys(habitsByDates).forEach((key) => {
      habitsByDates[key].totalHabits = totalHabits;
    });
    callback({ ...habitsByDates }); // Create a new object to trigger updates
  }

  return () => {
    habitsUnsubscribe();
    userHabitsUnsubscribe();
  };
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
