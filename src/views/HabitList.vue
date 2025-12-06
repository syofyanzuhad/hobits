<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHabitStore } from '@/stores/habitStore'
import { useToastStore } from '@/stores/toastStore'
import { getLastNDays } from '@/utils/dateUtils'
import { exportData, importData } from '@/utils/storageUtils'
import HabitTable from '@/components/dashboard/HabitTable.vue'
import AddHabitModal from '@/components/dashboard/AddHabitModal.vue'
import DropdownMenu from '@/components/dashboard/DropdownMenu.vue'

const router = useRouter()
const habitStore = useHabitStore()
const toast = useToastStore()

const showMenu = ref(false)
const showAddModal = ref(false)

const habits = computed(() => habitStore.habits)
const dates = computed(() => getLastNDays(5))

onMounted(() => {
  habitStore.loadFromStorage()
})

function toggleCompletion(habitId: string, date: string) {
  habitStore.toggleCompletion(habitId, date)
}

function addNewHabit(name: string) {
  if (!name.trim()) {
    toast.error('Habit name cannot be empty')
    return
  }
  habitStore.addHabit(name)
  showAddModal.value = false
  toast.success('Habit created successfully')
}

function goToDetail(habitId: string) {
  router.push(`/habit/${habitId}`)
}

function handleExport() {
  try {
    exportData()
    showMenu.value = false
    toast.success('Data exported successfully')
  } catch (error) {
    toast.error('Failed to export data')
  }
}

async function handleImport(file: File) {
  try {
    const data = await importData(file)
    habitStore.setHabits(data.habits)
    showMenu.value = false
    toast.success(`Imported ${data.habits.length} habits`)
  } catch (error) {
    toast.error('Error importing file: ' + (error as Error).message)
  }
}
</script>

<template>
  <div class="habit-list">
    <header class="header">
      <h1>Habits</h1>
      <button class="menu-btn" @click="showMenu = !showMenu" aria-label="Menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
    </header>

    <main class="main">
      <HabitTable
        :habits="habits"
        :dates="dates"
        @toggle="toggleCompletion"
        @click-habit="goToDetail"
      />
    </main>

    <DropdownMenu
      v-if="showMenu"
      @close="showMenu = false"
      @add="showAddModal = true; showMenu = false"
      @export="handleExport"
      @import="handleImport"
    />

    <AddHabitModal
      v-if="showAddModal"
      @close="showAddModal = false"
      @save="addNewHabit"
    />
  </div>
</template>

<style scoped>
.habit-list {
  min-height: 100vh;
  min-height: 100dvh;
  padding: 1rem;
  max-width: 600px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.header h1 {
  font-size: 1.5rem;
  font-weight: 600;
}

.menu-btn {
  background: transparent;
  border: none;
  padding: 0.5rem;
  min-height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-btn:hover {
  background: var(--bg-secondary);
  border-radius: 8px;
}

.main {
  padding-bottom: 2rem;
}
</style>
