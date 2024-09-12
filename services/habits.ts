import {
  collection,
  query,
  where,
  onSnapshot,
  Unsubscribe,
  addDoc,
  Firestore,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { Habits, HabitsByDate } from "../types/habits";
import { UserInfo } from "firebase/auth";

const ERROR_MESSAGE = {
  USER_NOT_AUTHENTICATED: "User not authenticated",
  HABIT_NOT_FOUND: "Habit does not exist",
  USER_NOT_AUTHORIZED: "You are not authorized to delete this habit",
  WHILE_SUPPRESSING_HABIT: "An error occurred while deleting the habit",
  WHILE_FETCHING_HABITS: "An error occurred while fetching habits",
  WHILE_ADDING_HABIT: "An error occurred while adding the habit",
  WHILE_UPDATING_HABIT: "An error occurred while updating the habit",
};

export function getHabits(
  currentUser: Pick<UserInfo, "uid">,
  store: Firestore,
  callback: (habits: Habits[]) => void
): Unsubscribe {
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
      console.error(ERROR_MESSAGE.WHILE_FETCHING_HABITS, error);
      callback([]);
    }
  );

  return unsubscribe;
}

export async function addHabit(
  currentUser: UserInfo,
  store: Firestore,
  habit: Omit<Habits, "id" | "user">
): Promise<void> {
  if (!currentUser) {
    return;
  }

  try {
    await addDoc(collection(store, "habits"), {
      ...habit,
      user: currentUser.uid, // Note: Changed 'user' to 'User' to match your schema
    });
  } catch (error) {
    console.error(ERROR_MESSAGE.WHILE_ADDING_HABIT, error);
    throw error; // Re-throw the error if you want to handle it in the calling component
  }
}

export const getAllHabitsCalendar = (
  currentUser: Pick<UserInfo, "uid">,
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

export async function deleteHabit(
  currentUser: UserInfo,
  store: Firestore,
  habitId: string
): Promise<void> {
  if (!currentUser) {
    throw new Error(ERROR_MESSAGE.USER_NOT_AUTHENTICATED);
  }

  try {
    const habitDoc = doc(collection(store, "habits"), habitId);
    const habitSnapshot = await getDoc(habitDoc);

    if (!habitSnapshot.exists()) {
      throw new Error(ERROR_MESSAGE.HABIT_NOT_FOUND);
    }

    if (habitSnapshot.data().user !== currentUser.uid) {
      throw new Error(ERROR_MESSAGE.USER_NOT_AUTHORIZED);
    }

    await deleteDoc(habitDoc);
  } catch (error) {
    console.error(ERROR_MESSAGE.WHILE_SUPPRESSING_HABIT, error);
    throw error;
  }
}

export async function updateHabit(
  currentUser: UserInfo,
  store: Firestore,
  habit: Omit<Habits, "user">
): Promise<void> {
  if (!currentUser) {
    throw new Error(ERROR_MESSAGE.USER_NOT_AUTHENTICATED);
  }

  try {
    const habitDoc = doc(collection(store, "habits"), habit.id);
    await updateDoc(habitDoc, habit);
  } catch (error) {
    console.error(ERROR_MESSAGE.WHILE_UPDATING_HABIT, error);
    throw error;
  }
}
