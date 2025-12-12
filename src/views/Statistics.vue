<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useHabitStore } from '@/stores/habitStore'
import ProductivityHeatmap from '@/components/dashboard/ProductivityHeatmap.vue'
import { getLastNMonths, formatDate } from '@/utils/dateUtils'

const router = useRouter()
const habitStore = useHabitStore()

const habits = computed(() => habitStore.habits)

// Time range options
const timeRangeOptions = [
  { value: 1, label: '1 bulan' },
  { value: 3, label: '3 bulan' },
  { value: 4, label: '4 bulan' },
  { value: 6, label: '6 bulan' },
  { value: 12, label: '1 tahun' }
]
const selectedRange = ref(4)

onMounted(() => {
  habitStore.loadFromStorage()
})

function goBack() {
  router.push('/')
}

// Calculate overall statistics
const stats = computed(() => {
  const months = getLastNMonths(selectedRange.value)
  let totalCompletions = 0
  let daysWithCompletions = 0
  let mostProductiveDay = { date: '', count: 0 }
  const dailyCounts: Record<string, number> = {}

  // Calculate completions per day
  for (const { month, year } of months) {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      const dateString = formatDate(d)
      let count = 0

      for (const habit of habits.value) {
        if (habit.completions[dateString] === true) {
          count++
        }
      }

      if (count > 0) {
        totalCompletions += count
        daysWithCompletions++
        dailyCounts[dateString] = count

        if (count > mostProductiveDay.count) {
          mostProductiveDay = { date: dateString, count }
        }
      }
    }
  }

  const avgPerDay = daysWithCompletions > 0 ? (totalCompletions / daysWithCompletions).toFixed(1) : '0'

  return {
    totalHabits: habits.value.length,
    totalCompletions,
    daysWithCompletions,
    avgPerDay,
    mostProductiveDay
  }
})

function formatDisplayDate(dateString: string): string {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div class="statistics-page">
    <header class="header">
      <button class="back-btn" @click="goBack" aria-label="Back">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <h1>Statistics</h1>
    </header>

    <main class="main">
      <div class="time-range-selector">
        <label for="timeRange">Rentang waktu:</label>
        <select id="timeRange" v-model="selectedRange">
          <option v-for="option in timeRangeOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>

      <ProductivityHeatmap
        :habits="habits"
        :collapsible="false"
        :months-range="selectedRange"
      />

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ stats.totalHabits }}</div>
          <div class="stat-label">Total Habits</div>
        </div>

        <div class="stat-card">
          <div class="stat-value">{{ stats.totalCompletions }}</div>
          <div class="stat-label">Completions</div>
        </div>

        <div class="stat-card">
          <div class="stat-value">{{ stats.daysWithCompletions }}</div>
          <div class="stat-label">Active Days</div>
        </div>

        <div class="stat-card">
          <div class="stat-value">{{ stats.avgPerDay }}</div>
          <div class="stat-label">Avg per Active Day</div>
        </div>
      </div>

      <div v-if="stats.mostProductiveDay.count > 0" class="highlight-card">
        <div class="highlight-label">Most Productive Day</div>
        <div class="highlight-value">
          {{ formatDisplayDate(stats.mostProductiveDay.date) }}
        </div>
        <div class="highlight-detail">
          {{ stats.mostProductiveDay.count }} habits completed
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.statistics-page {
  min-height: 100vh;
  min-height: 100dvh;
  padding: 1rem;
  max-width: 600px;
  margin: 0 auto;
}

.header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.header h1 {
  font-size: 1.5rem;
  font-weight: 600;
}

.back-btn {
  background: transparent;
  border: none;
  padding: 0.5rem;
  min-height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
}

.back-btn:hover {
  background: var(--bg-secondary);
  border-radius: 8px;
}

.main {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.time-range-selector {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.time-range-selector label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.time-range-selector select {
  background: var(--bg-secondary);
  border: 1px solid var(--bg-tertiary);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  color: var(--text-primary);
  cursor: pointer;
}

.time-range-selector select:focus {
  outline: none;
  border-color: var(--accent);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.stat-card {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

.highlight-card {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1.25rem;
  text-align: center;
  border: 1px solid var(--accent);
}

.highlight-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.highlight-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--accent);
}

.highlight-detail {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}
</style>
