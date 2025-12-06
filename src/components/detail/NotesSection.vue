<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const props = defineProps<{
  notes: string
}>()

const emit = defineEmits<{
  update: [notes: string]
}>()

const localNotes = ref('')
const isExpanded = ref(false)
const textareaRef = ref<HTMLTextAreaElement | null>(null)

let debounceTimeout: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  localNotes.value = props.notes
})

watch(() => props.notes, (newNotes) => {
  localNotes.value = newNotes
})

function handleInput() {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout)
  }

  debounceTimeout = setTimeout(() => {
    emit('update', localNotes.value)
  }, 500)
}

function autoResize() {
  const textarea = textareaRef.value
  if (textarea) {
    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }
}
</script>

<template>
  <div class="notes-section">
    <div class="notes-header" @click="isExpanded = !isExpanded">
      <h3 class="section-title">Notes</h3>
      <button class="toggle-btn" :class="{ expanded: isExpanded }">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </div>

    <div v-if="isExpanded" class="notes-content">
      <textarea
        ref="textareaRef"
        v-model="localNotes"
        placeholder="Add notes about this habit..."
        class="notes-textarea"
        @input="handleInput(); autoResize()"
      />
    </div>

    <div v-else-if="localNotes" class="notes-preview">
      {{ localNotes.slice(0, 100) }}{{ localNotes.length > 100 ? '...' : '' }}
    </div>
  </div>
</template>

<style scoped>
.notes-section {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1rem;
}

.notes-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.section-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin: 0;
}

.toggle-btn {
  background: transparent;
  border: none;
  padding: 0.25rem;
  min-height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: var(--text-secondary);
  transition: transform 0.2s ease;
}

.toggle-btn.expanded {
  transform: rotate(180deg);
}

.toggle-btn:hover {
  background: var(--bg-tertiary);
}

.notes-content {
  margin-top: 0.75rem;
}

.notes-textarea {
  width: 100%;
  min-height: 100px;
  resize: none;
  border: 1px solid var(--bg-tertiary);
  border-radius: 8px;
  padding: 0.75rem;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 0.9rem;
  line-height: 1.5;
}

.notes-textarea:focus {
  outline: none;
  border-color: var(--accent);
}

.notes-preview {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.4;
}
</style>
