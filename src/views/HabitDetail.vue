<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useHabitStore } from '@/stores/habitStore'
import MonthCalendar from '@/components/detail/MonthCalendar.vue'
import HeatmapThreeMonths from '@/components/detail/HeatmapThreeMonths.vue'
import YearChart from '@/components/detail/YearChart.vue'
import NotesSection from '@/components/detail/NotesSection.vue'
import EditHabitModal from '@/components/detail/EditHabitModal.vue'

const router = useRouter()
const route = useRoute()
const habitStore = useHabitStore()

const habitId = computed(() => route.params.id as string)
const habit = computed(() => habitStore.getHabitById(habitId.value))

const showEditModal = ref(false)
const currentYear = ref(new Date().getFullYear())
const currentMonth = ref(new Date().getMonth())

onMounted(() => {
  habitStore.loadFromStorage()
})

function goBack() {
  router.push('/')
}

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

function toggleDay(date: string) {
  habitStore.toggleCompletion(habitId.value, date)
}

function updateNotes(notes: string) {
  habitStore.setNotes(habitId.value, notes)
}

function updateHabitName(name: string) {
  habitStore.updateHabit(habitId.value, { name })
  showEditModal.value = false
}

function deleteHabit() {
  if (confirm('Are you sure you want to delete this habit? This cannot be undone.')) {
    habitStore.deleteHabit(habitId.value)
    router.push('/')
  }
}
</script>

<template>
  <div class="habit-detail">
    <!-- Not Found -->
    <div v-if="!habit" class="not-found">
      <p>Habit not found</p>
      <button @click="goBack">Go Back</button>
    </div>

    <!-- Detail Content -->
    <template v-else>
      <header class="header">
        <button class="back-btn" @click="goBack" aria-label="Go back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <h1 class="habit-title">
          <span class="color-dot" :style="{ backgroundColor: habit.color }"></span>
          {{ habit.name }}
        </h1>

        <button class="edit-btn" @click="showEditModal = true" aria-label="Edit habit">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
      </header>

      <main class="main">
        <MonthCalendar
          :habit="habit"
          :year="currentYear"
          :month="currentMonth"
          @prev-month="prevMonth"
          @next-month="nextMonth"
          @toggle="toggleDay"
        />

        <HeatmapThreeMonths :habit="habit" />

        <YearChart :habit="habit" />

        <NotesSection
          :notes="habit.notes"
          @update="updateNotes"
        />
      </main>

      <EditHabitModal
        v-if="showEditModal"
        :habit="habit"
        @close="showEditModal = false"
        @save="updateHabitName"
        @delete="deleteHabit"
      />
    </template>
  </div>
</template>

<style scoped>
.habit-detail {
  min-height: 100vh;
  min-height: 100dvh;
  padding: 1rem;
  max-width: 600px;
  margin: 0 auto;
}

.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  gap: 1rem;
  color: var(--text-secondary);
}

.header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.back-btn,
.edit-btn {
  background: transparent;
  border: none;
  padding: 0.5rem;
  min-height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.back-btn:hover,
.edit-btn:hover {
  background: var(--bg-secondary);
}

.habit-title {
  flex: 1;
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.color-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.main {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-bottom: 2rem;
}
</style>
