<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Habit } from '@/utils/types'
import { getLastNMonths, formatDate } from '@/utils/dateUtils'

const props = withDefaults(defineProps<{
  habits: Habit[]
  collapsible?: boolean
  monthsRange?: number
}>(), {
  collapsible: false,
  monthsRange: 4
})

const emit = defineEmits<{
  clickDate: [date: string]
}>()

const isExpanded = ref(!props.collapsible)

interface HeatmapDay {
  date: string
  count: number
  level: number
  dayOfWeek: number
}

interface HeatmapMonth {
  label: string
  days: HeatmapDay[]
}

function getLevel(count: number, max: number): number {
  if (count === 0 || max === 0) return 0
  const ratio = count / max
  if (ratio <= 0.25) return 1
  if (ratio <= 0.5) return 2
  if (ratio <= 0.75) return 3
  return 4
}

const heatmapData = computed(() => {
  const months = getLastNMonths(props.monthsRange)

  // First pass: collect all days with counts
  const allDays: { month: string; day: Omit<HeatmapDay, 'level'> }[] = []
  let maxCount = 0

  for (const { month, year, label } of months) {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      const dateString = formatDate(d)

      // Count completions across all habits for this date
      let count = 0
      for (const habit of props.habits) {
        if (habit.completions[dateString] === true) {
          count++
        }
      }

      if (count > maxCount) maxCount = count

      allDays.push({
        month: label,
        day: {
          date: dateString,
          count,
          dayOfWeek: d.getDay() === 0 ? 6 : d.getDay() - 1
        }
      })
    }
  }

  // Second pass: build result with relative levels
  const result: HeatmapMonth[] = []
  const monthMap = new Map<string, HeatmapDay[]>()

  for (const { month, day } of allDays) {
    if (!monthMap.has(month)) {
      monthMap.set(month, [])
    }
    monthMap.get(month)!.push({
      ...day,
      level: getLevel(day.count, maxCount)
    })
  }

  for (const { label } of months) {
    result.push({
      label,
      days: monthMap.get(label) || []
    })
  }

  return result
})

const maxCompletions = computed(() => {
  let max = 0
  for (const month of heatmapData.value) {
    for (const day of month.days) {
      if (day.count > max) max = day.count
    }
  }
  return max
})

const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

function getCellClass(level: number): string {
  return `heatmap-cell level-${level}`
}

function getTooltip(day: HeatmapDay): string {
  const habitText = day.count === 1 ? 'habit' : 'habits'
  return `${day.date}: ${day.count} ${habitText} completed`
}

function toggle() {
  if (props.collapsible) {
    isExpanded.value = !isExpanded.value
  }
}
</script>

<template>
  <div class="productivity-heatmap">
    <div class="header" :class="{ clickable: collapsible }" @click="toggle">
      <h3 class="section-title">
        <svg v-if="collapsible" class="chevron" :class="{ expanded: isExpanded }" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
        Productivity
      </h3>
      <span v-if="!isExpanded && collapsible" class="collapsed-hint">Tap to expand</span>
    </div>

    <div v-if="isExpanded" class="heatmap-content">
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
              <button
                v-for="(day, index) in monthData.days"
                :key="index"
                :class="getCellClass(day.level)"
                :title="getTooltip(day)"
                @click="emit('clickDate', day.date)"
                :aria-label="getTooltip(day)"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="legend">
        <span class="legend-label">Less</span>
        <div class="legend-cells">
          <div class="heatmap-cell level-0" title="No habits"></div>
          <div class="heatmap-cell level-1" title="1-25% of best day"></div>
          <div class="heatmap-cell level-2" title="26-50% of best day"></div>
          <div class="heatmap-cell level-3" title="51-75% of best day"></div>
          <div class="heatmap-cell level-4" title="76-100% of best day"></div>
        </div>
        <span class="legend-label">More</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.productivity-heatmap {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header.clickable {
  cursor: pointer;
}

.section-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin: 0;
}

.chevron {
  transition: transform 0.2s ease;
}

.chevron.expanded {
  transform: rotate(90deg);
}

.collapsed-hint {
  font-size: 0.75rem;
  color: var(--text-secondary);
  opacity: 0.7;
}

.heatmap-content {
  margin-top: 1rem;
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
  transition: all 0.2s ease;
  border: none;
  padding: 0;
  cursor: pointer;
  min-height: auto;
}

.heatmap-cell:hover {
  transform: scale(1.3);
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
}

.heatmap-cell.level-0 {
  background: var(--bg-tertiary);
}

.heatmap-cell.level-1 {
  background: #9be9a8;
}

.heatmap-cell.level-2 {
  background: #40c463;
}

.heatmap-cell.level-3 {
  background: #30a14e;
}

.heatmap-cell.level-4 {
  background: #216e39;
}

.legend {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.legend-label {
  font-size: 0.65rem;
  color: var(--text-secondary);
}

.legend-cells {
  display: flex;
  gap: 2px;
}
</style>
