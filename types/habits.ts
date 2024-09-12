import { Timestamp } from "firebase/firestore";

export type Habits = {
  id: string;
  name: string;
  user: string;
  checked?: boolean;
};

export type HabitElement = {
  id: string;
  name: string;
  isChecked: boolean;
};

export type HabitsByDate = {
  id: string;
  date: Timestamp;
  user: string;
  habits: HabitElement[];
};
