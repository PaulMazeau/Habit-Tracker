import { Timestamp } from "firebase/firestore";

export type HabitsType = {
  id?: string;
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
