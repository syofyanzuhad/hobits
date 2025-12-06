import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Habit, HabitStats } from '@/utils/types'
import { loadData, saveData, type StorageData } from '@/utils/storageUtils'
import { formatDate } from '@/utils/dateUtils'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

function calculateStreak(completions: Record<string, boolean>): number {
  let streak = 0
  const today = new Date()

  for (let i = 0; ; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const dateString = formatDate(date)

    if (completions[dateString]) {
      streak++
    } else {
      // If today is not completed, we can still count yesterday's streak
      if (i === 0) continue
      break
    }
  }

  return streak
}

export const useHabitStore = defineStore('habits', () => {
  const habits = ref<Habit[]>([])
  const settings = ref<StorageData['settings']>({
    theme: 'dark',
    firstDayOfWeek: 1
  })

  // Getters
  const getHabitById = computed(() => {
    return (id: string) => habits.value.find(h => h.id === id)
  })

  const getHabitCompletionsByMonth = computed(() => {
    return (habitId: string, year: number, month: number) => {
      const habit = habits.value.find(h => h.id === habitId)
      if (!habit) return {}

      const completions: Record<string, boolean> = {}
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)

      for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
        const dateString = formatDate(d)
        if (habit.completions[dateString] !== undefined) {
          completions[dateString] = habit.completions[dateString]
        }
      }

      return completions
    }
  })

  const getHabitStats = computed(() => {
    return (habitId: string): HabitStats => {
      const habit = habits.value.find(h => h.id === habitId)
      if (!habit) {
        return { total: 0, completed: 0, streak: 0, percentage: 0 }
      }

      const completionValues = Object.values(habit.completions)
      const total = completionValues.length
      const completed = completionValues.filter(v => v === true).length
      const streak = calculateStreak(habit.completions)
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

      return { total, completed, streak, percentage }
    }
  })

  // Actions
  function loadFromStorage(): void {
    const data = loadData()
    habits.value = data.habits
    settings.value = data.settings
  }

  function saveToStorage(): void {
    saveData({
      habits: habits.value,
      settings: settings.value
    })
  }

  function addHabit(name: string): Habit {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
    const randomColor = colors[Math.floor(Math.random() * colors.length)] ?? '#3b82f6'

    const newHabit: Habit = {
      id: generateId(),
      name,
      color: randomColor,
      completions: {},
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    habits.value.push(newHabit)
    saveToStorage()
    return newHabit
  }

  function deleteHabit(id: string): void {
    const index = habits.value.findIndex(h => h.id === id)
    if (index !== -1) {
      habits.value.splice(index, 1)
      saveToStorage()
    }
  }

  function updateHabit(id: string, updates: Partial<Habit>): void {
    const habit = habits.value.find(h => h.id === id)
    if (habit) {
      Object.assign(habit, updates, { updatedAt: new Date().toISOString() })
      saveToStorage()
    }
  }

  function toggleCompletion(habitId: string, date: string): void {
    const habit = habits.value.find(h => h.id === habitId)
    if (habit) {
      if (habit.completions[date]) {
        habit.completions[date] = false
      } else {
        habit.completions[date] = true
      }
      habit.updatedAt = new Date().toISOString()
      saveToStorage()
    }
  }

  function setNotes(habitId: string, notes: string): void {
    const habit = habits.value.find(h => h.id === habitId)
    if (habit) {
      habit.notes = notes
      habit.updatedAt = new Date().toISOString()
      saveToStorage()
    }
  }

  function setHabits(newHabits: Habit[]): void {
    habits.value = newHabits
    saveToStorage()
  }

  return {
    // State
    habits,
    settings,
    // Getters
    getHabitById,
    getHabitCompletionsByMonth,
    getHabitStats,
    // Actions
    loadFromStorage,
    saveToStorage,
    addHabit,
    deleteHabit,
    updateHabit,
    toggleCompletion,
    setNotes,
    setHabits
  }
})
