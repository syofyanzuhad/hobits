<script setup lang="ts">
import { useToastStore } from '@/stores/toastStore'

const toastStore = useToastStore()

function getIconClass(type: string): string {
  switch (type) {
    case 'success': return 'toast-icon-success'
    case 'error': return 'toast-icon-error'
    case 'warning': return 'toast-icon-warning'
    default: return 'toast-icon-info'
  }
}

function getIcon(type: string): string {
  switch (type) {
    case 'success': return '✓'
    case 'error': return '✕'
    case 'warning': return '!'
    default: return 'i'
  }
}
</script>

<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        class="toast"
        :class="[`toast-${toast.type}`]"
        @click="toastStore.remove(toast.id)"
      >
        <span class="toast-icon" :class="getIconClass(toast.type)">
          {{ getIcon(toast.type) }}
        </span>
        <span class="toast-message">{{ toast.message }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: calc(100% - 2rem);
  max-width: 400px;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: 12px;
  background: var(--bg-secondary);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  cursor: pointer;
  pointer-events: auto;
}

.toast-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
  flex-shrink: 0;
}

.toast-icon-success {
  background: var(--success);
  color: white;
}

.toast-icon-error {
  background: var(--danger);
  color: white;
}

.toast-icon-warning {
  background: var(--warning);
  color: #1a1a1a;
}

.toast-icon-info {
  background: var(--accent);
  color: white;
}

.toast-message {
  font-size: 0.9rem;
  line-height: 1.4;
}

.toast-success {
  border-left: 3px solid var(--success);
}

.toast-error {
  border-left: 3px solid var(--danger);
}

.toast-warning {
  border-left: 3px solid var(--warning);
}

.toast-info {
  border-left: 3px solid var(--accent);
}

/* Transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>
