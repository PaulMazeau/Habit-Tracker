<<<<<<< HEAD
export type Habits = {
  id: string;
=======
import { Timestamp } from "firebase/firestore";

export type HabitsType = {
  id?: string;
>>>>>>> dev
  name: string;
  user: string;
  checked?: boolean;
};

export type HabitsByDate = {
  id: string;
  date: Timestamp;
  user: string;
  habits: string[];
};
