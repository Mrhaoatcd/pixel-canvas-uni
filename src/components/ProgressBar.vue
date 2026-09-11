<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  logs?: string | null
  totalSteps?: number
}>()

const totalSteps = computed(() => props.totalSteps ?? 30)

const step = computed(() => {
  if (!props.logs) return 0
  const matches = [...props.logs.matchAll(/(\d+)\s*\/\s*(\d+)/g)]
  const last = matches[matches.length - 1]
  return last ? Number(last[1]) : 0
})

const pct = computed(() => Math.min(100, Math.round((step.value / totalSteps.value) * 100)))

const label = computed(() =>
  step.value > 0 ? `处理中 ${step.value}/${totalSteps.value}` : '正在启动模型…'
)
</script>

<template>
  <view class="wrap">
    <view class="row">
      <text class="hint">{{ label }}</text>
      <text class="hint">{{ pct }}%</text>
    </view>
    <view class="track">
      <view class="fill" :style="`width: ${pct || 3}%;`" />
    </view>
  </view>
</template>

<style scoped>
.wrap {
  width: 100%;
}

.row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8rpx;
}

.hint {
  font-size: 22rpx;
  color: #6b7280;
}

.track {
  width: 100%;
  height: 8rpx;
  background: #e5e7eb;
  border-radius: 100rpx;
  overflow: hidden;
}

.fill {
  height: 100%;
  background: #3b82f6;
  border-radius: 100rpx;
  transition: width 0.5s ease;
}
</style>
