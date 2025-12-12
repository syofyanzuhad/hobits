<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Habit } from '@/utils/types'
import { getLastNMonths, formatDate } from '@/utils/dateUtils'

const props = defineProps<{
  habits: Habit[]
}>()

const isExpanded = ref(false)

const stats = computed(() => {
  const months = getLastNMonths(4)
  let totalCompletions = 0
  let daysWithCompletions = 0
  let mostProductiveDay = { date: '', count: 0 }

  for (const { month, year } of months) {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      const dateString = formatDate(d)
      let count = 0

      for (const habit of props.habits) {
        if (habit.completions[dateString] === true) {
          count++
        }
      }

      if (count > 0) {
        totalCompletions += count
        daysWithCompletions++

        if (count > mostProductiveDay.count) {
          mostProductiveDay = { date: dateString, count }
        }
      }
    }
  }

  const avgPerDay = daysWithCompletions > 0 ? (totalCompletions / daysWithCompletions).toFixed(1) : '0'

  return {
    totalHabits: props.habits.length,
    totalCompletions,
    daysWithCompletions,
    avgPerDay,
    mostProductiveDay
  }
})

function formatDisplayDate(dateString: string): string {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

function toggle() {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <div class="stats-summary">
    <div class="header" @click="toggle">
      <h3 class="section-title">
        <svg class="chevron" :class="{ expanded: isExpanded }" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
        Quick Stats
      </h3>
      <span v-if="!isExpanded" class="collapsed-preview">
        {{ stats.totalCompletions }} completions
      </span>
    </div>

    <div v-if="isExpanded" class="stats-content">
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-value">{{ stats.totalHabits }}</div>
          <div class="stat-label">Habits</div>
        </div>

        <div class="stat-item">
          <div class="stat-value">{{ stats.totalCompletions }}</div>
          <div class="stat-label">Completions</div>
        </div>

        <div class="stat-item">
          <div class="stat-value">{{ stats.daysWithCompletions }}</div>
          <div class="stat-label">Active Days</div>
        </div>

        <div class="stat-item">
          <div class="stat-value">{{ stats.avgPerDay }}</div>
          <div class="stat-label">Avg/Day</div>
        </div>
      </div>

      <div v-if="stats.mostProductiveDay.count > 0" class="highlight">
        <span class="highlight-icon">🏆</span>
        <span class="highlight-text">
          Most productive: <strong>{{ formatDisplayDate(stats.mostProductiveDay.date) }}</strong>
          ({{ stats.mostProductiveDay.count }} habits)
        </span>
      </div>

      <div class="period-note">Last 4 months</div>
    </div>
  </div>
</template>

<style scoped>
.stats-summary {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.collapsed-preview {
  font-size: 0.8rem;
  color: var(--text-secondary);
  opacity: 0.8;
}

.stats-content {
  margin-top: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.stat-item {
  text-align: center;
  padding: 0.5rem 0.25rem;
  background: var(--bg-tertiary);
  border-radius: 8px;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.65rem;
  color: var(--text-secondary);
  margin-top: 0.125rem;
}

.highlight {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding: 0.5rem 0.75rem;
  background: var(--bg-tertiary);
  border-radius: 8px;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.highlight-icon {
  font-size: 1rem;
}

.highlight-text strong {
  color: var(--accent);
}

.period-note {
  margin-top: 0.5rem;
  font-size: 0.7rem;
  color: var(--text-secondary);
  opacity: 0.6;
  text-align: right;
}
</style>
