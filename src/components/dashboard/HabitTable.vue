<script setup lang="ts">
import type { Habit } from '@/utils/types'
import { getDayName, getDayNumber } from '@/utils/dateUtils'

defineProps<{
  habits: Habit[]
  dates: string[]
}>()

const emit = defineEmits<{
  toggle: [habitId: string, date: string]
  clickHabit: [habitId: string]
}>()

function isCompleted(habit: Habit, date: string): boolean {
  return habit.completions[date] === true
}

function getCellClass(habit: Habit, date: string): string {
  return isCompleted(habit, date) ? 'completion-cell completed' : 'completion-cell'
}
</script>

<template>
  <div class="habit-table">
    <!-- Header -->
    <div class="table-header">
      <div class="habit-name-header"></div>
      <div
        v-for="date in dates"
        :key="date"
        class="date-header"
      >
        <span class="day-name">{{ getDayName(date) }}</span>
        <span class="day-number">{{ getDayNumber(date) }}</span>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="habits.length === 0" class="empty-state">
      <p>No habits yet</p>
      <p class="empty-hint">Tap the menu to add your first habit</p>
    </div>

    <!-- Habit Rows -->
    <div
      v-for="habit in habits"
      :key="habit.id"
      class="habit-row"
      @click="emit('clickHabit', habit.id)"
    >
      <div class="habit-name">
        <span class="color-dot" :style="{ backgroundColor: habit.color }"></span>
        {{ habit.name }}
      </div>
      <div
        v-for="date in dates"
        :key="date"
        :class="getCellClass(habit, date)"
        @click.stop="emit('toggle', habit.id, date)"
      >
        <span v-if="isCompleted(habit, date)" class="check-icon">&#10003;</span>
        <span v-else class="x-icon">&#10005;</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.habit-table {
  background: var(--bg-secondary);
  border-radius: 12px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 1fr repeat(5, 50px);
  gap: 4px;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--bg-tertiary);
}

.habit-name-header {
  /* Empty space for alignment */
}

.date-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.day-name {
  font-size: 0.7rem;
  color: var(--text-secondary);
  text-transform: uppercase;
}

.day-number {
  font-size: 0.85rem;
  font-weight: 500;
}

.empty-state {
  padding: 3rem 1rem;
  text-align: center;
  color: var(--text-secondary);
}

.empty-hint {
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

.habit-row {
  display: grid;
  grid-template-columns: 1fr repeat(5, 50px);
  gap: 4px;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--bg-tertiary);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.habit-row:last-child {
  border-bottom: none;
}

.habit-row:hover {
  background-color: var(--bg-tertiary);
}

.habit-name {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.color-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.completion-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  margin: auto;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.completion-cell:hover {
  transform: scale(1.1);
}

.completion-cell.completed {
  background-color: var(--success);
  color: white;
}

.completion-cell:not(.completed) {
  background-color: var(--bg-tertiary);
  color: var(--text-secondary);
}

.check-icon {
  font-weight: bold;
}

.x-icon {
  font-size: 0.85rem;
}
</style>
