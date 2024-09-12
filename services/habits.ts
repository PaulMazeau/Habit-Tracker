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
  Timestamp,
  getDocs,
  arrayUnion,
  setDoc,
} from "firebase/firestore";
import { HabitElement, Habits, HabitsByDate } from "../types/habits";
import { UserInfo } from "firebase/auth";
// import uid
import { makeid } from "../utils/utils";

const ERROR_MESSAGE = {
  USER_NOT_AUTHENTICATED: "User not authenticated",
  HABIT_NOT_FOUND: "Habit does not exist",
  USER_NOT_AUTHORIZED: "You are not authorized to delete this habit",
  WHILE_SUPPRESSING_HABIT: "An error occurred while deleting the habit",
  WHILE_FETCHING_HABITS: "An error occurred while fetching habits",
  WHILE_FETCHING_HABITS_BY_DATE:
    "An error occurred while fetching habits by date",
  WHILE_ADDING_HABIT: "An error occurred while adding the habit",
  WHILE_UPDATING_HABIT: "An error occurred while updating the habit",
};

const FB_COLLECTION = {
  HABITS: "habits",
  USER_HABITS: "user_habits",
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
    collection(store, FB_COLLECTION.HABITS),
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

export function getHabitsByDate(
  currentUser: Pick<UserInfo, "uid">,
  store: Firestore,
  callback: (habitsByDate: HabitsByDate | null) => void
): Unsubscribe {
  if (!currentUser) {
    callback(null);
    return () => {};
  }

  const startOfDay = Timestamp.fromDate(
    new Date(new Date().setHours(0, 0, 0, 0))
  );
  const endOfDay = Timestamp.fromDate(
    new Date(new Date().setHours(23, 59, 59, 999))
  );

  const q = query(
    collection(store, FB_COLLECTION.USER_HABITS),
    where("user", "==", currentUser.uid),
    where("date", ">=", startOfDay),
    where("date", "<=", endOfDay)
  );

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      if (querySnapshot.empty) {
        callback(null);
      } else {
        const doc = querySnapshot.docs[0];
        const habitsCheckedToday: HabitsByDate = {
          id: doc.id,
          date: doc.data().date,
          user: doc.data().user,
          habits: doc.data().habits,
        };
        callback(habitsCheckedToday);
      }
    },
    (error) => {
      console.error(ERROR_MESSAGE.WHILE_FETCHING_HABITS, error);
      callback(null);
    }
  );

  return unsubscribe;
}

export async function addHabit(
  currentUser: UserInfo,
  store: Firestore,
  habit: Omit<Habits, "id" | "user">,
  userHabitId: string
): Promise<void> {
  if (!currentUser) {
    return;
  }

  const userHabitDocRef = doc(store, "user_habits", userHabitId);

  try {
    // Get the current user_habits document
    const userHabitDoc = await getDoc(userHabitDocRef);

    if (userHabitDoc.exists()) {
      // If the document exists, add the new habit to the "habits" array
      await updateDoc(userHabitDocRef, {
        habits: arrayUnion({
          id: makeid(16),
          name: habit.name,
          isChecked: false, // default value for new habits
        }),
        date: new Date(),
      });
    } else {
      // If the document doesn't exist, create a new one with the new habit
      await setDoc(userHabitDocRef, {
        habits: [
          {
            id: makeid(16),
            name: habit.name,
            isChecked: false, // default value for new habits
          },
        ],
        user: currentUser.uid,
        date: new Date(),
      });
    }
  } catch (error) {
    console.error("Error while adding habit:", error);
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

  const userHabitsUnsubscribe = onSnapshot(
    query(
      collection(store, FB_COLLECTION.USER_HABITS),
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

        habitsByDates[dateKey] = {
          totalHabits: habit.habits.length,
          habits: habit.habits.filter((h) => h.isChecked).length,
        };
      });

      callback({ ...habitsByDates });
    },
    (error) => {
      console.error("Error fetching user habits:", error);
      callback({});
    }
  );

  return () => {
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
  habitId: string,
  userHabitId: string
): Promise<void> {
  if (!currentUser) {
    throw new Error(ERROR_MESSAGE.USER_NOT_AUTHENTICATED);
  }

  try {
    const habitDoc = doc(
      collection(store, FB_COLLECTION.USER_HABITS),
      userHabitId
    );
    const habitSnapshot = await getDoc(habitDoc);

    if (!habitSnapshot.exists()) {
      throw new Error(ERROR_MESSAGE.HABIT_NOT_FOUND);
    }

    if (habitSnapshot.data().user !== currentUser.uid) {
      throw new Error(ERROR_MESSAGE.USER_NOT_AUTHORIZED);
    }

    const userHabitData = habitSnapshot.data() as HabitsByDate;
    console.log(habitId);
    const habitIndex = userHabitData.habits.findIndex((h) => h.id === habitId);
    console.log("index", habitIndex);
    if (habitIndex === -1) {
      throw new Error(ERROR_MESSAGE.HABIT_NOT_FOUND);
    }

    userHabitData.habits.splice(habitIndex, 1);

    await updateDoc(habitDoc, userHabitData);
  } catch (error) {
    console.error(ERROR_MESSAGE.WHILE_SUPPRESSING_HABIT, error);
    throw error;
  }
}

export async function updateHabit(
  currentUser: UserInfo,
  store: Firestore,
  habit: Omit<HabitElement, "isChecked">,
  userHabitId: string
): Promise<void> {
  if (!currentUser) {
    throw new Error(ERROR_MESSAGE.USER_NOT_AUTHENTICATED);
  }
  console.log(habit);

  try {
    const userHabitDocRef = doc(store, "user_habits", userHabitId);
    const userHabitDoc = await getDoc(userHabitDocRef);
    if (!userHabitDoc.exists()) {
      throw new Error(ERROR_MESSAGE.HABIT_NOT_FOUND);
    }

    const userHabitData = userHabitDoc.data() as HabitsByDate;
    const habitIndex = userHabitData.habits.findIndex((h) => h.id === habit.id);
    if (habitIndex === -1) {
      throw new Error(ERROR_MESSAGE.HABIT_NOT_FOUND);
    }

    userHabitData.habits[habitIndex] = { ...habit, isChecked: false };
    await updateDoc(userHabitDocRef, userHabitData);

    // const habitDoc = doc(collection(store, FB_COLLECTION.HABITS), habit.id);
    // await updateDoc(habitDoc, habit);
  } catch (error) {
    // const habitDoc = doc(collection(store, FB_COLLECTION.HABITS), habit.id);
    // await updateDoc(habitDoc, habit);
    console.error(ERROR_MESSAGE.WHILE_UPDATING_HABIT, error);
    throw error;
  }
}

type UserHabit = {
  date: Timestamp;
  habits: Habits["id"][];
  user: UserInfo["uid"];
};

export async function updateUserHabit(
  currentUser: UserInfo,
  store: Firestore,
  userHabit: UserHabit
): Promise<void> {
  if (!currentUser) {
    throw new Error(ERROR_MESSAGE.USER_NOT_AUTHENTICATED);
  }

  console.log(userHabit);

  getHabitsByDate(currentUser, store, async (habitsByDate) => {
    if (habitsByDate) {
      // update the existing document with the new habits
      try {
        await updateDoc(
          doc(collection(store, FB_COLLECTION.USER_HABITS), habitsByDate.id),
          userHabit
        );
      } catch (error) {
        console.error(ERROR_MESSAGE.WHILE_UPDATING_HABIT, error);
        throw error;
      }
    } else {
      try {
        await addDoc(collection(store, FB_COLLECTION.USER_HABITS), userHabit);
      } catch (error) {
        console.error(ERROR_MESSAGE.WHILE_ADDING_HABIT, error);
        throw error;
      }
    }
  });
}

export function getHabitsToday(
  currentUser: Pick<UserInfo, "uid">,
  store: Firestore,
  callback: (habits: Habits[] | null) => void
): Unsubscribe {
  if (!currentUser) {
    callback(null);
    return () => {};
  }

  const startOfDay = Timestamp.fromDate(
    new Date(new Date().setHours(0, 0, 0, 0))
  );
  const endOfDay = Timestamp.fromDate(
    new Date(new Date().setHours(23, 59, 59, 999))
  );

  // Query for all user habits
  const allHabitsQuery = query(
    collection(store, FB_COLLECTION.HABITS),
    where("user", "==", currentUser.uid)
  );

  // Query for user habits for today
  const userHabitsQuery = query(
    collection(store, FB_COLLECTION.USER_HABITS),
    where("user", "==", currentUser.uid),
    where("date", ">=", startOfDay),
    where("date", "<=", endOfDay)
  );

  let unsubscribeAllHabits = () => {};
  let unsubscribeUserHabits = () => {};

  unsubscribeAllHabits = onSnapshot(allHabitsQuery, (allHabitsSnapshot) => {
    const habits = allHabitsSnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Habits)
    );

    unsubscribeUserHabits = onSnapshot(
      userHabitsQuery,
      (userHabitsSnapshot) => {
        let userHabits = [];
        if (!userHabitsSnapshot.empty) {
          userHabits = userHabitsSnapshot.docs[0].data().habits || [];
        }

        const habitsCheckedToday = habits.map((habit) => ({
          ...habit,
          checked: userHabits.includes(habit.id),
        }));

        callback(habitsCheckedToday);
      },
      (error) => {
        console.error(ERROR_MESSAGE.WHILE_FETCHING_HABITS, error);
        callback(null);
      }
    );
  });

  return () => {
    unsubscribeAllHabits();
    unsubscribeUserHabits();
  };
}
