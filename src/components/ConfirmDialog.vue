<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

defineProps<{
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    emit('cancel')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="dialog-overlay" @click.self="emit('cancel')">
    <div class="dialog-content">
      <h2 class="dialog-title">{{ title }}</h2>
      <p class="dialog-message">{{ message }}</p>

      <div class="dialog-actions">
        <button class="btn-cancel" @click="emit('cancel')">
          {{ cancelText || 'Cancel' }}
        </button>
        <button
          class="btn-confirm"
          :class="{ 'btn-danger': danger }"
          @click="emit('confirm')"
        >
          {{ confirmText || 'Confirm' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dialog-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 200;
}

.dialog-content {
  background-color: var(--bg-secondary);
  border-radius: 16px;
  padding: 1.5rem;
  width: 100%;
  max-width: 350px;
  text-align: center;
}

.dialog-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.dialog-message {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.dialog-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  border: none;
}

.btn-cancel {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
}

.btn-confirm {
  background-color: var(--accent);
  color: white;
}

.btn-confirm:hover {
  background-color: var(--accent-hover);
}

.btn-danger {
  background-color: var(--danger);
}

.btn-danger:hover {
  background-color: #dc2626;
}
</style>
