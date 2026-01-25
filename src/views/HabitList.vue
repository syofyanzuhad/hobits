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
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import ProductivityHeatmap from '@/components/dashboard/ProductivityHeatmap.vue'
import StatsSummary from '@/components/dashboard/StatsSummary.vue'

const router = useRouter()
const habitStore = useHabitStore()
const toast = useToastStore()

const showMenu = ref(false)
const showAddModal = ref(false)
const showDeleteConfirm = ref(false)
const habitToDelete = ref<string | null>(null)

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

function goToDayDetail(date: string) {
  router.push(`/day/${date}`)
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

function handleDeleteRequest(habitId: string) {
  habitToDelete.value = habitId
  showDeleteConfirm.value = true
}

function confirmDelete() {
  if (habitToDelete.value) {
    const habit = habitStore.habits.find(h => h.id === habitToDelete.value)
    habitStore.deleteHabit(habitToDelete.value)
    toast.success(`"${habit?.name}" deleted`)
  }
  showDeleteConfirm.value = false
  habitToDelete.value = null
}

function cancelDelete() {
  showDeleteConfirm.value = false
  habitToDelete.value = null
}
</script>

<template>
  <div class="habit-list">
    <header class="header">
      <h1>Hobits</h1>
      <div class="menu-wrapper">
        <button class="menu-btn" @click="showMenu = !showMenu" aria-label="Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <DropdownMenu
          v-if="showMenu"
          @close="showMenu = false"
          @add="showAddModal = true; showMenu = false"
          @export="handleExport"
          @import="handleImport"
        />
      </div>
    </header>

    <main class="main">
      <ProductivityHeatmap
        v-if="habits.length > 0"
        :habits="habits"
        :collapsible="true"
        class="productivity-section"
        @click-date="goToDayDetail"
      />

      <StatsSummary
        v-if="habits.length > 0"
        :habits="habits"
        class="stats-section"
      />

      <HabitTable
        :habits="habits"
        :dates="dates"
        @toggle="toggleCompletion"
        @click-habit="goToDetail"
        @click-date="goToDayDetail"
        @delete="handleDeleteRequest"
      />
    </main>

    <AddHabitModal
      v-if="showAddModal"
      @close="showAddModal = false"
      @save="addNewHabit"
    />

    <ConfirmDialog
      v-if="showDeleteConfirm"
      title="Delete Habit"
      message="Are you sure you want to delete this habit? All completion data will be lost."
      confirm-text="Delete"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />

    <!-- Floating Action Button -->
    <button
      class="fab"
      @click="showAddModal = true"
      aria-label="Add new habit"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </button>

    <footer class="footer">
      <p>Made with 💚 by <a href="https://syofyanzuhad.dev" target="_blank" rel="noopener noreferrer">Syofyan Zuhad</a></p>
      <p class="footer-links">
        <a href="https://github.com/syofyanzuhad/hobits" target="_blank" rel="noopener noreferrer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub
        </a>
        <span class="separator">|</span>
        <a href="https://syofyanzuhad.dev/sponsors-list" target="_blank" rel="noopener noreferrer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          Sponsor
        </a>
      </p>
    </footer>
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

.menu-wrapper {
  position: relative;
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

.productivity-section {
  margin-bottom: 1rem;
}

.stats-section {
  margin-bottom: 1.5rem;
}

.footer {
  text-align: center;
  padding: 1rem 0 2rem;
}

.footer-links {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-top: 0.75rem;
}

.footer-links a {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: var(--text-primary);
}

.footer-links .separator {
  margin: 0 0.5rem;
  opacity: 0.5;
}

.fab {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--accent-color, #10b981);
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  z-index: 100;
}

.fab:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.fab:active {
  transform: scale(0.95);
}

@media (max-width: 600px) {
  .fab {
    bottom: 1.5rem;
    right: 1.5rem;
  }
}
</style>
