<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import type { Habit } from '@/utils/types'
import { getLast12Months } from '@/utils/dateUtils'

const props = defineProps<{
  habit: Habit
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)

const monthlyData = computed(() => {
  const months = getLast12Months()
  return months.map(({ month, year, label }) => {
    let count = 0
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      const dateString = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      if (props.habit.completions[dateString]) {
        count++
      }
    }

    return { label, count, daysInMonth: lastDay.getDate() }
  })
})

function drawChart() {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()

  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr

  ctx.scale(dpr, dpr)

  const width = rect.width
  const height = rect.height
  const padding = { top: 20, right: 20, bottom: 30, left: 35 }
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  // Clear canvas
  ctx.clearRect(0, 0, width, height)

  const data = monthlyData.value
  const maxValue = Math.max(...data.map(d => d.count), 1)
  const yMax = Math.ceil(maxValue / 5) * 5 || 5

  // Draw grid lines
  ctx.strokeStyle = '#3a3a3a'
  ctx.lineWidth = 1
  const gridLines = 5
  for (let i = 0; i <= gridLines; i++) {
    const y = padding.top + (chartHeight / gridLines) * i
    ctx.beginPath()
    ctx.moveTo(padding.left, y)
    ctx.lineTo(width - padding.right, y)
    ctx.stroke()

    // Y-axis labels
    ctx.fillStyle = '#888888'
    ctx.font = '10px system-ui'
    ctx.textAlign = 'right'
    ctx.textBaseline = 'middle'
    const value = Math.round(yMax - (yMax / gridLines) * i)
    ctx.fillText(value.toString(), padding.left - 8, y)
  }

  // Draw line chart
  const stepX = chartWidth / (data.length - 1)

  ctx.strokeStyle = '#3b82f6'
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  ctx.beginPath()
  data.forEach((d, i) => {
    const x = padding.left + stepX * i
    const y = padding.top + chartHeight - (d.count / yMax) * chartHeight

    if (i === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })
  ctx.stroke()

  // Draw dots
  ctx.fillStyle = '#3b82f6'
  data.forEach((d, i) => {
    const x = padding.left + stepX * i
    const y = padding.top + chartHeight - (d.count / yMax) * chartHeight

    ctx.beginPath()
    ctx.arc(x, y, 4, 0, Math.PI * 2)
    ctx.fill()
  })

  // Draw X-axis labels
  ctx.fillStyle = '#888888'
  ctx.font = '10px system-ui'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  data.forEach((d, i) => {
    const x = padding.left + stepX * i
    ctx.fillText(d.label, x, height - padding.bottom + 10)
  })
}

onMounted(() => {
  drawChart()
  window.addEventListener('resize', drawChart)
})

watch(() => props.habit.completions, () => {
  drawChart()
}, { deep: true })
</script>

<template>
  <div class="year-chart">
    <h3 class="section-title">Last Year</h3>
    <div class="chart-container">
      <canvas ref="canvasRef" class="chart-canvas" />
    </div>
  </div>
</template>

<style scoped>
.year-chart {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1rem;
}

.section-title {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-secondary);
}

.chart-container {
  width: 100%;
  height: 200px;
}

.chart-canvas {
  width: 100%;
  height: 100%;
}
</style>
