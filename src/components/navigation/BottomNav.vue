<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHabitStore } from '@/stores/habitStore'
import { useToastStore } from '@/stores/toastStore'
import AddHabitModal from '@/components/dashboard/AddHabitModal.vue'

const route = useRoute()
const router = useRouter()
const habitStore = useHabitStore()
const toast = useToastStore()

const showAddModal = ref(false)

function handleAddHabit(name: string) {
  if (!name.trim()) {
    toast.error('Habit name cannot be empty')
    return
  }
  habitStore.addHabit(name)
  showAddModal.value = false
  toast.success('Habit created successfully')
  if (route.path !== '/') {
    router.push('/')
  }
}
</script>

<template>
  <div>
    <nav class="bottom-nav" aria-label="Main Navigation">
      <div class="bottom-nav-inner">
        <!-- Habits Tab -->
        <router-link
          to="/"
          class="nav-tab"
          :class="{ active: route.path === '/' }"
          aria-label="Habits List"
        >
          <div class="icon-wrapper">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <span class="tab-label">Habits</span>
        </router-link>

        <!-- Center Quick Add Button -->
        <button
          class="add-action-btn"
          @click="showAddModal = true"
          aria-label="Add new habit"
        >
          <div class="add-icon-circle">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          <span class="tab-label add-label">Add</span>
        </button>

        <!-- Statistics Tab -->
        <router-link
          to="/stats"
          class="nav-tab"
          :class="{ active: route.path === '/stats' }"
          aria-label="Statistics"
        >
          <div class="icon-wrapper">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          </div>
          <span class="tab-label">Stats</span>
        </router-link>
      </div>
    </nav>

    <!-- Add Habit Modal -->
    <AddHabitModal
      v-if="showAddModal"
      @close="showAddModal = false"
      @save="handleAddHabit"
    />
  </div>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(26, 26, 26, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  z-index: 80;
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

.bottom-nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-around;
  max-width: 600px;
  margin: 0 auto;
  height: 60px;
  padding: 0 1rem;
  position: relative;
}

.nav-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  color: var(--text-secondary);
  text-decoration: none;
  padding: 0.35rem 1.25rem;
  border-radius: 12px;
  transition: all 0.2s ease;
  min-height: auto;
  background: transparent;
  border: none;
  flex: 1;
  max-width: 100px;
}

.nav-tab:hover {
  color: var(--text-primary);
}

.nav-tab.active {
  color: var(--accent);
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.nav-tab.active .icon-wrapper {
  transform: translateY(-1px);
}

.tab-label {
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.01em;
}

.add-action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  min-height: auto;
  flex: 1;
  max-width: 100px;
}

.add-icon-circle {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: var(--accent);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
  transition: all 0.2s ease;
  transform: translateY(-8px);
}

.add-action-btn:hover .add-icon-circle {
  background: var(--accent-hover);
  transform: translateY(-10px) scale(1.05);
  box-shadow: 0 6px 18px rgba(59, 130, 246, 0.55);
}

.add-action-btn:active .add-icon-circle {
  transform: translateY(-6px) scale(0.96);
}

.add-label {
  margin-top: -6px;
  color: var(--text-secondary);
}

.add-action-btn:hover .add-label {
  color: var(--text-primary);
}
</style>
