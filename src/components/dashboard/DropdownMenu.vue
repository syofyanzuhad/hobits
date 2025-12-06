<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  close: []
  add: []
  export: []
  import: [file: File]
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)

function handleImportClick() {
  fileInputRef.value?.click()
}

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    emit('import', file)
    target.value = ''
  }
}
</script>

<template>
  <div class="dropdown-overlay" @click="emit('close')"></div>
  <div class="dropdown-menu">
    <button class="menu-item" @click="emit('add')">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      Add Habit
    </button>

    <button class="menu-item" @click="emit('export')">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Export Data
    </button>

    <button class="menu-item" @click="handleImportClick">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
      Import Data
    </button>

    <input
      ref="fileInputRef"
      type="file"
      accept=".json"
      class="hidden-input"
      @change="onFileChange"
    />
  </div>
</template>

<style scoped>
.dropdown-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background-color: var(--bg-secondary);
  border-radius: 12px;
  padding: 0.5rem;
  min-width: 180px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  z-index: 51;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-size: 0.95rem;
  text-align: left;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  min-height: 44px;
}

.menu-item:hover {
  background-color: var(--bg-tertiary);
}

.hidden-input {
  display: none;
}
</style>
