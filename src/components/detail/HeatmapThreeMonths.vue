<script setup lang="ts">
import { computed } from 'vue'
import type { Habit } from '@/utils/types'
import { getLastNMonths, formatDate } from '@/utils/dateUtils'

const props = defineProps<{
  habit: Habit
}>()

interface HeatmapDay {
  date: string
  completed: boolean
  dayOfWeek: number
}

interface HeatmapMonth {
  label: string
  days: HeatmapDay[]
}

const heatmapData = computed(() => {
  const months = getLastNMonths(4)
  const result: HeatmapMonth[] = []

  for (const { month, year, label } of months) {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days: HeatmapDay[] = []

    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      const dateString = formatDate(d)
      days.push({
        date: dateString,
        completed: props.habit.completions[dateString] === true,
        dayOfWeek: d.getDay() === 0 ? 6 : d.getDay() - 1 // Monday = 0, Sunday = 6
      })
    }

    result.push({ label, days })
  }

  return result
})

const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

function getCellClass(completed: boolean): string {
  return completed ? 'heatmap-cell completed' : 'heatmap-cell'
}
</script>

<template>
  <div class="heatmap-container">
    <h3 class="section-title">Last 4 Months</h3>

    <div class="heatmap-wrapper">
      <div class="day-labels">
        <div v-for="(label, index) in dayLabels" :key="index" class="day-label">
          {{ label }}
        </div>
      </div>

      <div class="heatmap-grid">
        <div v-for="monthData in heatmapData" :key="monthData.label" class="month-column">
          <div class="month-label">{{ monthData.label }}</div>
          <div class="month-cells">
            <div
              v-for="(day, index) in monthData.days"
              :key="index"
              :class="getCellClass(day.completed)"
              :title="`${day.date}: ${day.completed ? 'Completed' : 'Not completed'}`"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.heatmap-container {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1rem;
}

.section-title {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-secondary);
}

.heatmap-wrapper {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
}

.day-labels {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-top: 1.5rem;
}

.day-label {
  width: 12px;
  height: 12px;
  font-size: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}

.heatmap-grid {
  display: flex;
  gap: 0.75rem;
  flex: 1;
}

.month-column {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.month-label {
  font-size: 0.7rem;
  color: var(--text-secondary);
  text-align: center;
  height: 1.25rem;
}

.month-cells {
  display: grid;
  grid-template-rows: repeat(7, 12px);
  grid-auto-flow: column;
  gap: 2px;
}

.heatmap-cell {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background: var(--bg-tertiary);
  transition: all 0.2s ease;
}

.heatmap-cell.completed {
  background: var(--accent);
}

.heatmap-cell:hover {
  transform: scale(1.2);
}
</style>
