<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  deleteThreshold?: number
}>()

const emit = defineEmits<{
  delete: []
}>()

const threshold = props.deleteThreshold ?? 80
const startX = ref(0)
const currentX = ref(0)
const isDragging = ref(false)
const isDeleting = ref(false)

const translateX = computed(() => {
  if (isDeleting.value) return -threshold
  if (!isDragging.value) return 0
  const diff = currentX.value - startX.value
  // Only allow swiping left (negative)
  if (diff > 0) return 0
  // Cap at threshold
  return Math.max(diff, -threshold - 20)
})

const showDelete = computed(() => translateX.value < -20)

function onTouchStart(e: TouchEvent) {
  if (isDeleting.value) {
    // Reset if tapping elsewhere
    isDeleting.value = false
    return
  }
  startX.value = e.touches[0].clientX
  currentX.value = e.touches[0].clientX
  isDragging.value = true
}

function onTouchMove(e: TouchEvent) {
  if (!isDragging.value) return
  currentX.value = e.touches[0].clientX
}

function onTouchEnd() {
  if (!isDragging.value) return

  const diff = currentX.value - startX.value

  if (diff < -threshold / 2) {
    // Show delete button
    isDeleting.value = true
  } else {
    isDeleting.value = false
  }

  isDragging.value = false
}

function onMouseDown(e: MouseEvent) {
  if (isDeleting.value) {
    isDeleting.value = false
    return
  }
  startX.value = e.clientX
  currentX.value = e.clientX
  isDragging.value = true

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

function onMouseMove(e: MouseEvent) {
  if (!isDragging.value) return
  currentX.value = e.clientX
}

function onMouseUp() {
  const diff = currentX.value - startX.value

  if (diff < -threshold / 2) {
    isDeleting.value = true
  } else {
    isDeleting.value = false
  }

  isDragging.value = false
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
}

function handleDelete() {
  emit('delete')
  isDeleting.value = false
}

function resetSwipe() {
  isDeleting.value = false
}

defineExpose({ resetSwipe })
</script>

<template>
  <div class="swipeable-container">
    <div
      class="delete-action"
      :class="{ visible: showDelete || isDeleting }"
      @click="handleDelete"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
      <span>Delete</span>
    </div>
    <div
      class="swipeable-content"
      :style="{ transform: `translateX(${translateX}px)` }"
      :class="{ dragging: isDragging }"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
      @mousedown="onMouseDown"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
.swipeable-container {
  position: relative;
  overflow: hidden;
}

.delete-action {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 80px;
  background-color: var(--danger);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
  opacity: 0;
  transition: opacity 0.2s ease;
  cursor: pointer;
}

.delete-action.visible {
  opacity: 1;
}

.delete-action:hover {
  background-color: #ff4444;
}

.swipeable-content {
  position: relative;
  background-color: var(--bg-secondary);
  transition: transform 0.2s ease;
  z-index: 1;
}

.swipeable-content.dragging {
  transition: none;
}
</style>
