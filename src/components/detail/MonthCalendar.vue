<script setup lang="ts">
import { computed } from 'vue'
import type { Habit } from '@/utils/types'
import { getMonthCalendar, getMonthName, isToday } from '@/utils/dateUtils'

const props = defineProps<{
  habit: Habit
  year: number
  month: number
}>()

const emit = defineEmits<{
  prevMonth: []
  nextMonth: []
  toggle: [date: string]
}>()

const calendar = computed(() => getMonthCalendar(props.year, props.month))
const monthLabel = computed(() => `${getMonthName(props.month)} ${props.year}`)
const dayHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function isCompleted(dateString: string | null): boolean {
  if (!dateString) return false
  return props.habit.completions[dateString] === true
}

function isTodayDate(dateString: string | null): boolean {
  if (!dateString) return false
  return isToday(dateString)
}

function getCellClass(day: number | null, dateString: string | null): string {
  const classes = ['calendar-cell']
  if (day === null) classes.push('empty')
  if (isCompleted(dateString)) classes.push('completed')
  if (isTodayDate(dateString)) classes.push('today')
  return classes.join(' ')
}
</script>

<template>
  <div class="month-calendar">
    <div class="calendar-header">
      <button class="nav-btn" @click="emit('prevMonth')" aria-label="Previous month">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <span class="month-label">{{ monthLabel }}</span>
      <button class="nav-btn" @click="emit('nextMonth')" aria-label="Next month">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>

    <div class="day-headers">
      <div v-for="day in dayHeaders" :key="day" class="day-header">
        {{ day }}
      </div>
    </div>

    <div class="calendar-grid">
      <template v-for="(week, weekIndex) in calendar" :key="weekIndex">
        <div
          v-for="(day, dayIndex) in week.days"
          :key="`${weekIndex}-${dayIndex}`"
          :class="getCellClass(day, week.dates[dayIndex] ?? null)"
          @click="day !== null && emit('toggle', week.dates[dayIndex]!)"
        >
          <span v-if="day !== null">{{ day }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.month-calendar {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1rem;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.nav-btn {
  background: transparent;
  border: none;
  padding: 0.5rem;
  min-height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.nav-btn:hover {
  background: var(--bg-tertiary);
}

.month-label {
  font-weight: 600;
  font-size: 1rem;
}

.day-headers {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 0.5rem;
}

.day-header {
  text-align: center;
  font-size: 0.7rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  padding: 0.25rem;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.calendar-cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--bg-tertiary);
}

.calendar-cell:hover:not(.empty) {
  transform: scale(1.05);
}

.calendar-cell.empty {
  background: transparent;
  cursor: default;
}

.calendar-cell.completed {
  background: var(--accent);
  color: white;
  font-weight: 500;
}

.calendar-cell.today {
  outline: 2px solid var(--accent);
  outline-offset: -2px;
}

.calendar-cell.today.completed {
  outline-color: white;
}
</style>
