<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useHabitStore } from '@/stores/habitStore'

const router = useRouter()
const route = useRoute()
const habitStore = useHabitStore()

const dateParam = computed(() => route.params.date as string)

const displayDate = computed(() => {
  const date = new Date(dateParam.value)
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const isToday = computed(() => {
  const today = new Date()
  const paramDate = new Date(dateParam.value)
  return today.toDateString() === paramDate.toDateString()
})

const habits = computed(() => habitStore.habits)

const habitsWithStatus = computed(() => {
  return habits.value.map(habit => ({
    ...habit,
    completed: habit.completions[dateParam.value] === true
  }))
})

const completedCount = computed(() => {
  return habitsWithStatus.value.filter(h => h.completed).length
})

const totalCount = computed(() => habits.value.length)

const completionPercentage = computed(() => {
  if (totalCount.value === 0) return 0
  return Math.round((completedCount.value / totalCount.value) * 100)
})

onMounted(() => {
  habitStore.loadFromStorage()
})

function goBack() {
  router.push('/')
}

function goToPrevDay() {
  const current = new Date(dateParam.value)
  current.setDate(current.getDate() - 1)
  const newDate = current.toISOString().split('T')[0]
  router.push(`/day/${newDate}`)
}

function goToNextDay() {
  const current = new Date(dateParam.value)
  current.setDate(current.getDate() + 1)
  const newDate = current.toISOString().split('T')[0]
  router.push(`/day/${newDate}`)
}

function toggleHabit(habitId: string) {
  habitStore.toggleCompletion(habitId, dateParam.value)
}

function goToHabitDetail(habitId: string) {
  router.push(`/habit/${habitId}`)
}
</script>

<template>
  <div class="day-detail">
    <header class="header">
      <button class="back-btn" @click="goBack" aria-label="Go back">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <div class="date-nav">
        <button class="nav-btn" @click="goToPrevDay" aria-label="Previous day">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div class="date-info">
          <h1 class="date-title">{{ displayDate }}</h1>
          <span v-if="isToday" class="today-badge">Hari Ini</span>
        </div>

        <button class="nav-btn" @click="goToNextDay" aria-label="Next day">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </header>

    <main class="main">
      <!-- Summary Card -->
      <div class="summary-card">
        <div class="summary-progress">
          <div class="progress-ring">
            <svg viewBox="0 0 36 36">
              <path
                class="progress-bg"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                class="progress-fill"
                :stroke-dasharray="`${completionPercentage}, 100`"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span class="progress-text">{{ completionPercentage }}%</span>
          </div>
        </div>
        <div class="summary-info">
          <p class="summary-count">{{ completedCount }} / {{ totalCount }}</p>
          <p class="summary-label">habit selesai</p>
        </div>
      </div>

      <!-- Habits List -->
      <div class="habits-section">
        <h2 class="section-title">Daftar Habit</h2>

        <div v-if="habits.length === 0" class="empty-state">
          <p>Belum ada habit</p>
          <button @click="goBack">Tambah Habit</button>
        </div>

        <ul v-else class="habits-list">
          <li
            v-for="habit in habitsWithStatus"
            :key="habit.id"
            class="habit-item"
            :class="{ completed: habit.completed }"
          >
            <button
              class="checkbox"
              :class="{ checked: habit.completed }"
              :style="{ '--habit-color': habit.color }"
              @click="toggleHabit(habit.id)"
              aria-label="Toggle habit"
            >
              <svg v-if="habit.completed" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </button>

            <div class="habit-info" @click="goToHabitDetail(habit.id)">
              <span class="habit-name">{{ habit.name }}</span>
            </div>

            <button class="detail-btn" @click="goToHabitDetail(habit.id)" aria-label="View detail">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </li>
        </ul>
      </div>
    </main>
  </div>
</template>

<style scoped>
.day-detail {
  min-height: 100vh;
  min-height: 100dvh;
  padding: 1rem;
  max-width: 600px;
  margin: 0 auto;
}

.header {
  margin-bottom: 1.5rem;
}

.back-btn {
  background: transparent;
  border: none;
  padding: 0.5rem;
  min-height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.back-btn:hover {
  background: var(--bg-secondary);
}

.date-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
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
  color: var(--text-secondary);
}

.nav-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.date-info {
  text-align: center;
  flex: 1;
}

.date-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
}

.today-badge {
  display: inline-block;
  font-size: 0.75rem;
  color: var(--accent-color, #10b981);
  font-weight: 500;
  margin-top: 0.25rem;
}

.main {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Summary Card */
.summary-card {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.progress-ring {
  position: relative;
  width: 80px;
  height: 80px;
}

.progress-ring svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.progress-bg {
  fill: none;
  stroke: var(--bg-primary, #1a1a2e);
  stroke-width: 3;
}

.progress-fill {
  fill: none;
  stroke: var(--accent-color, #10b981);
  stroke-width: 3;
  stroke-linecap: round;
  transition: stroke-dasharray 0.3s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1rem;
  font-weight: 600;
}

.summary-info {
  flex: 1;
}

.summary-count {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.summary-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin: 0.25rem 0 0;
}

/* Habits Section */
.habits-section {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 1rem;
  padding: 0 0.5rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
}

.empty-state button {
  margin-top: 1rem;
}

.habits-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.habit-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.habit-item:hover {
  background: var(--bg-primary);
}

.habit-item.completed .habit-name {
  text-decoration: line-through;
  color: var(--text-secondary);
}

.checkbox {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 2px solid var(--habit-color, var(--text-secondary));
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
  min-height: auto;
  flex-shrink: 0;
}

.checkbox.checked {
  background: var(--habit-color, var(--accent-color));
  border-color: var(--habit-color, var(--accent-color));
  color: white;
}

.checkbox:hover {
  transform: scale(1.05);
}

.habit-info {
  flex: 1;
  cursor: pointer;
  min-width: 0;
}

.habit-name {
  font-size: 1rem;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-btn {
  background: transparent;
  border: none;
  padding: 0.5rem;
  min-height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.detail-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}
</style>
