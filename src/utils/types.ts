export interface Habit {
  id: string
  name: string
  color: string
  completions: Record<string, boolean> // { "2025-12-01": true, "2025-12-02": false }
  notes: string
  createdAt: string
  updatedAt: string
}

export interface HabitStats {
  total: number
  completed: number
  streak: number
  percentage: number
}
