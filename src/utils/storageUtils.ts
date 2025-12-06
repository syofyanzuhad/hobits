import type { Habit } from './types'

const STORAGE_KEY = 'habit-tracker-data'

export interface StorageData {
  habits: Habit[]
  settings: {
    theme: 'dark' | 'light'
    firstDayOfWeek: 0 | 1 // 0 = Sunday, 1 = Monday
  }
}

const defaultData: StorageData = {
  habits: [],
  settings: {
    theme: 'dark',
    firstDayOfWeek: 1
  }
}

export function loadData(): StorageData {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return defaultData
    const parsed = JSON.parse(data)
    return {
      ...defaultData,
      ...parsed,
      settings: { ...defaultData.settings, ...parsed.settings }
    }
  } catch (error) {
    console.error('Error loading data from localStorage:', error)
    return defaultData
  }
}

export function saveData(data: StorageData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving data to localStorage:', error)
  }
}

export function exportData(): void {
  const data = loadData()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `habits-export-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function importData(file: File): Promise<StorageData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const data = JSON.parse(content)

        // Validate data structure
        if (!data.habits || !Array.isArray(data.habits)) {
          throw new Error('Invalid data format: habits array is required')
        }

        // Validate each habit
        for (const habit of data.habits) {
          if (!habit.id || !habit.name) {
            throw new Error('Invalid habit format: id and name are required')
          }
        }

        const validData: StorageData = {
          habits: data.habits,
          settings: { ...defaultData.settings, ...data.settings }
        }

        saveData(validData)
        resolve(validData)
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = () => reject(new Error('Error reading file'))
    reader.readAsText(file)
  })
}
