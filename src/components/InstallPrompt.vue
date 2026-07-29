<script setup lang="ts">
import { ref } from 'vue'
import { usePWAInstall } from '@/composables/usePWAInstall'

const { isInstallable, isInstalled, installApp } = usePWAInstall()
const dismissed = ref(false)

async function handleInstall() {
  await installApp()
}

function dismiss() {
  dismissed.value = true
}
</script>

<template>
  <div v-if="isInstallable && !isInstalled && !dismissed" class="install-prompt">
    <div class="install-content">
      <div class="install-text">
        <h3>Install App</h3>
        <p>Install this app to your home screen for quick and easy access.</p>
      </div>
      <div class="install-actions">
        <button class="btn-dismiss" @click="dismiss">Not now</button>
        <button class="btn-install" @click="handleInstall">Install</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.install-prompt {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--bg-secondary);
  border: 1px solid var(--border-color, #333);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  z-index: 9999;
  width: calc(100% - 48px);
  max-width: 400px;
  animation: slideUp 0.3s ease-out;
}

.install-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.install-text h3 {
  margin: 0 0 4px 0;
  font-size: 1.1rem;
  color: var(--text-primary);
}

.install-text p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

.install-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

button {
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}

.btn-dismiss {
  background: transparent;
  color: var(--text-secondary);
}

.btn-dismiss:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.btn-install {
  background: var(--accent);
  color: #1a1a1a;
}

.btn-install:hover {
  filter: brightness(1.1);
}

@keyframes slideUp {
  from {
    transform: translate(-50%, 100%);
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0);
    opacity: 1;
  }
}
</style>
