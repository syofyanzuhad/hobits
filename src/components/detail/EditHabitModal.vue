<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Habit } from '@/utils/types'

const props = defineProps<{
  habit: Habit
}>()

const emit = defineEmits<{
  close: []
  save: [name: string]
  delete: []
}>()

const habitName = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  habitName.value = props.habit.name
  inputRef.value?.focus()
})

function handleSave() {
  if (habitName.value.trim()) {
    emit('save', habitName.value.trim())
  }
}

function handleDelete() {
  emit('delete')
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    handleSave()
  } else if (e.key === 'Escape') {
    emit('close')
  }
}
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content" @keydown="handleKeydown">
      <h2>Edit Habit</h2>

      <input
        ref="inputRef"
        v-model="habitName"
        type="text"
        placeholder="Habit name..."
        class="habit-input"
      />

      <div class="modal-actions">
        <button class="btn-cancel" @click="emit('close')">
          Cancel
        </button>
        <button
          class="btn-save"
          :disabled="!habitName.trim()"
          @click="handleSave"
        >
          Save
        </button>
      </div>

      <hr class="divider" />

      <button class="btn-delete" @click="handleDelete">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
        Delete Habit
      </button>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 100;
}

.modal-content {
  background-color: var(--bg-secondary);
  border-radius: 16px;
  padding: 1.5rem;
  width: 100%;
  max-width: 400px;
}

.modal-content h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
}

.habit-input {
  width: 100%;
  margin-bottom: 1.5rem;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-cancel,
.btn-save {
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

.btn-save {
  background-color: var(--accent);
  color: white;
}

.btn-save:hover:not(:disabled) {
  background-color: var(--accent-hover);
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.divider {
  border: none;
  border-top: 1px solid var(--bg-tertiary);
  margin: 1.5rem 0;
}

.btn-delete {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  border: none;
  background-color: var(--danger);
  color: white;
}

.btn-delete:hover {
  background-color: #dc2626;
}
</style>
