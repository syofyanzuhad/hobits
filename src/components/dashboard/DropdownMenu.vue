<script setup lang="ts">
import { ref } from 'vue'
import { usePWAInstall } from '@/composables/usePWAInstall'
import { useToastStore } from '@/stores/toastStore'

const emit = defineEmits<{
  close: []
  add: []
  export: []
  import: [file: File]
}>()

const { isInstallable, isInstalled, installApp } = usePWAInstall()
const toast = useToastStore()
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

async function handleInstall() {
  const success = await installApp()
  if (success) {
    toast.success('App installed successfully!')
    emit('close')
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

    <div v-if="isInstallable && !isInstalled" class="menu-divider"></div>

    <button
      v-if="isInstallable && !isInstalled"
      class="menu-item menu-item-install"
      @click="handleInstall"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Install App
    </button>

    <div class="menu-divider"></div>

    <a
      href="https://github.com/syofyanzuhad/hobits"
      target="_blank"
      rel="noopener noreferrer"
      class="menu-item"
      @click="emit('close')"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
      GitHub
    </a>

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
  text-decoration: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  min-height: 44px;
}

.menu-item:hover {
  background-color: var(--bg-tertiary);
}

.menu-item-install {
  color: var(--accent);
}

.menu-divider {
  height: 1px;
  background-color: var(--bg-tertiary);
  margin: 0.5rem 0;
}

.hidden-input {
  display: none;
}
</style>
