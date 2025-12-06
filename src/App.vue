<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterView } from 'vue-router'
import ToastContainer from '@/components/ToastContainer.vue'

const isOffline = ref(!navigator.onLine)

function handleOnline() {
  isOffline.value = false
}

function handleOffline() {
  isOffline.value = true
}

onMounted(() => {
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
})

onUnmounted(() => {
  window.removeEventListener('online', handleOnline)
  window.removeEventListener('offline', handleOffline)
})
</script>

<template>
  <div class="offline-banner" v-if="isOffline">
    <span class="offline-icon">&#9888;</span>
    You're offline. Changes will be saved locally.
  </div>
  <RouterView v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </RouterView>
  <ToastContainer />
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.offline-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: var(--warning);
  color: #1a1a1a;
  padding: 0.5rem 1rem;
  text-align: center;
  font-size: 0.85rem;
  font-weight: 500;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.offline-icon {
  font-size: 1rem;
}
</style>
