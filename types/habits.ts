export type Habits = {
  id: string;
  name: string;
  user: string;
};

export type HabitsByDate = {
  date: Date;
  totalHabits: number;
  habits: number;
};
