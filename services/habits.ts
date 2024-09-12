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
  orderBy,
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

export const getCurrentStreak = (
  currentUser: Pick<UserInfo, "uid">,
  store: any,
  callback: (currentStreak: number) => void
): Unsubscribe => {
  if (!currentUser) {
    callback(0);
    return () => {};
  }

  let totalHabits = 0;
  let habitsByDates: {
    [key: string]: { totalHabits: number; habits: number };
  } = {};

  const habitsUnsubscribe = getHabits(currentUser, store, (habits) => {
    totalHabits = habits.length;
    // updateStreak();
  });

  const userHabitsUnsubscribe = onSnapshot(
    query(
      collection(store, "user_habits"),
      where("user", "==", currentUser.uid),
      orderBy("date", "desc")
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

      updateStreak();
    },
    (error) => {
      console.error("Error fetching user habits:", error);
      callback(0); // Reset streak on error
    }
  );

  function updateStreak() {
    const today = new Date();
    let streak = 0;

    // Sort dates in descending order to check from the latest
    const sortedDates = Object.keys(habitsByDates).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    // Helper function to check if two dates are consecutive
    function areDatesConsecutive(date1: Date, date2: Date) {
      const timeDiff = date1.getTime() - date2.getTime();
      const dayDiff = timeDiff / (1000 * 60 * 60 * 24);
      return dayDiff === 1;
    }

    let prevDate = today;
    for (const dateKey of sortedDates) {
      const { totalHabits, habits } = habitsByDates[dateKey];

      console.log(sortedDates);

      // Check if the user completed all habits for that day
      if (totalHabits === habits) {
        streak++; // Increment the streak

        // Check if the day is consecutive to the previous one
        const dateParts = dateKey.split("/");
        const currentDate = new Date(
          parseInt(dateParts[0], 10), // year
          parseInt(dateParts[1], 10) - 1, // month (0-indexed)
          parseInt(dateParts[2], 10) // day
        );

        // If the days are not consecutive, stop the streak
        if (!areDatesConsecutive(prevDate, currentDate)) {
          break;
        }

        prevDate = currentDate; // Move to the next day
      } else {
        break; // If the user missed any habit, break the loop and reset the streak
      }
    }

    // Check today's habits as well
    const todayKey = `${today.getFullYear()}/${
      today.getMonth() + 1
    }/${today.getDate()}`;

    if (habitsByDates[todayKey]) {
      const todayHabits = habitsByDates[todayKey];
      if (todayHabits.totalHabits === todayHabits.habits) {
        streak++; // Count today as part of the streak
      }
    }

    console.log(streak);

    callback(streak); // Pass the streak back to the callback
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
