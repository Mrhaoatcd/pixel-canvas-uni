<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { STYLE_META } from '@/utils/styles'
import { isStyle } from '@/utils/types'
import type { Style, JobPhase } from '@/utils/types'
import { startStylize, pollPrediction } from '@/utils/api'
import { uploadImage } from '@/utils/upload'
import { pixelate } from '@/utils/pixelate'
import ProgressBar from '@/components/ProgressBar.vue'
import ResultCompare from '@/components/ResultCompare.vue'

const POLL_INTERVAL_MS = 1500

const style = ref<Style | null>(null)
const phase = ref<JobPhase>('idle')
const originalUrl = ref<string | null>(null)
const resultUrl = ref<string | null>(null)
const logs = ref<string | null>(null)
const errorMsg = ref<string | null>(null)
const uploadPct = ref(0)

let pollTimer: ReturnType<typeof setInterval> | null = null

function clearPoll() {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
}

onUnmounted(clearPoll)

onLoad((options) => {
  const key = options?.style
  if (key && isStyle(key)) {
    style.value = key
    uni.setNavigationBarTitle({ title: `${STYLE_META[key].label} · 风格化` })
  }
})

const meta = computed(() => style.value ? STYLE_META[style.value] : null)
const isBusy = computed(() => phase.value === 'uploading' || phase.value === 'stylizing')

function reset() {
  clearPoll()
  phase.value = 'idle'
  originalUrl.value = null
  resultUrl.value = null
  logs.value = null
  errorMsg.value = null
  uploadPct.value = 0
}

function pickImage() {
  if (isBusy.value) return
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: async (res) => {
      const tempPath = res.tempFilePaths[0]
      if (!tempPath) return
      await doUpload(tempPath)
    },
    fail: (err) => {
      if (!err.errMsg?.includes('cancel')) {
        errorMsg.value = '选择图片失败'
      }
    },
  })
}

async function doUpload(tempPath: string) {
  phase.value = 'uploading'
  errorMsg.value = null
  uploadPct.value = 0

  try {
    const pubUrl = await uploadImage(tempPath, (pct) => {
      uploadPct.value = pct
    })
    originalUrl.value = pubUrl
    phase.value = 'idle'
  } catch (e) {
    errorMsg.value = e instanceof Error ? e.message : '上传失败'
    phase.value = 'error'
  }
}

async function doStylize() {
  if (!originalUrl.value || !style.value) return
  clearPoll()
  phase.value = 'stylizing'
  logs.value = null
  resultUrl.value = null
  errorMsg.value = null

  try {
    const res = await startStylize(originalUrl.value, style.value)

    // SiliconFlow: synchronous, result already available
    if (res.status === 'succeeded' && res.output) {
      const output = Array.isArray(res.output) ? res.output[0] : res.output
      if (!output) throw new Error('No output returned')
      const finalUrl = style.value === 'pixel' ? await pixelate(output) : output
      resultUrl.value = finalUrl
      phase.value = 'done'
      return
    }

    // Replicate async: poll until done
    if (!res.predictionId) throw new Error('No prediction ID returned')
    const predId = res.predictionId

    pollTimer = setInterval(async () => {
      try {
        const pd = await pollPrediction(predId)
        logs.value = pd.logs || null

        if (pd.status === 'succeeded') {
          clearPoll()
          const output = Array.isArray(pd.output) ? pd.output[0] : pd.output
          if (!output) throw new Error('No output returned')
          const finalUrl = style.value === 'pixel' ? await pixelate(output as string) : output as string
          resultUrl.value = finalUrl
          phase.value = 'done'
        } else if (pd.status === 'failed' || pd.status === 'canceled') {
          clearPoll()
          throw new Error(pd.error || `Prediction ${pd.status}`)
        }
      } catch (e) {
        clearPoll()
        errorMsg.value = e instanceof Error ? e.message : '处理失败'
        phase.value = 'error'
      }
    }, POLL_INTERVAL_MS)
  } catch (e) {
    errorMsg.value = e instanceof Error ? e.message : '启动失败'
    phase.value = 'error'
  }
}

function goBack() {
  uni.navigateBack()
}
</script>

<template>
  <scroll-view scroll-y class="page">
    <!-- Top bar -->
    <view v-if="meta" class="topbar">
      <view class="back" @tap="goBack">
        <text class="back-text">← {{ meta.label }}</text>
      </view>
      <text class="current-style">正在尝试：{{ meta.label }}</text>
    </view>

    <!-- Image picker / preview (hide when done) -->
    <view v-if="phase !== 'done'" class="section">
      <!-- Preview: image selected -->
      <view v-if="originalUrl && phase !== 'uploading'" class="preview-box">
        <image class="preview-img" :src="originalUrl" mode="aspectFit" />
        <view class="replace-row">
          <text class="replace-btn" :class="{ disabled: isBusy }" @tap="pickImage">换一张图</text>
        </view>
      </view>

      <!-- Upload progress -->
      <view v-else-if="phase === 'uploading'" class="upload-progress">
        <text class="upload-hint">上传中… {{ uploadPct }}%</text>
        <view class="upload-track">
          <view class="upload-fill" :style="`width: ${uploadPct}%;`" />
        </view>
      </view>

      <!-- Picker area -->
      <view v-else class="picker" @tap="pickImage">
        <text class="picker-icon">＋</text>
        <text class="picker-hint">点击选择照片</text>
        <text class="picker-sub">支持 JPG / PNG / WebP，最大 10MB</text>
      </view>
    </view>

    <!-- Stylizing progress -->
    <view v-if="phase === 'stylizing'" class="section card">
      <ProgressBar :logs="logs" />
      <text class="cold-start-hint">首次生成模型冷启动可能需要 30 秒左右，之后会快很多。</text>
    </view>

    <!-- Error -->
    <view v-if="errorMsg" class="section error-box">
      <text class="error-text">{{ errorMsg }}</text>
      <view class="retry-btn" @tap="reset">
        <text class="retry-text">重试</text>
      </view>
    </view>

    <!-- Result comparison -->
    <view v-if="phase === 'done' && originalUrl && resultUrl" class="section">
      <ResultCompare
        :original-url="originalUrl"
        :result-url="resultUrl"
        @reset="reset"
      />
      <view class="other-style-row">
        <view class="other-style-btn" @tap="() => uni.navigateBack()">
          <text class="other-style-text">← 换一种风格</text>
        </view>
      </view>
    </view>

    <!-- Start button -->
    <view v-if="originalUrl && phase === 'idle'" class="section center">
      <view class="start-btn" @tap="doStylize">
        <text class="start-text">开始生成</text>
      </view>
    </view>
  </scroll-view>
</template>

<style scoped>
.page {
  height: 100vh;
  background: linear-gradient(to bottom, #fafafa, #fff);
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 32rpx;
  border-bottom: 2rpx solid #f3f4f6;
}

.back-text {
  font-size: 26rpx;
  color: #9ca3af;
}

.current-style {
  font-size: 24rpx;
  color: #6b7280;
}

.section {
  padding: 32rpx;
  margin-bottom: 8rpx;
}

.card {
  background: #fff;
  border: 2rpx solid #f3f4f6;
  border-radius: 20rpx;
  margin: 0 32rpx;
}

/* Image picker */
.picker {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 4rpx dashed #d1d5db;
  border-radius: 20rpx;
  padding: 80rpx 40rpx;
  gap: 16rpx;
}

.picker-icon {
  font-size: 80rpx;
  color: #d1d5db;
  line-height: 1;
}

.picker-hint {
  font-size: 30rpx;
  color: #6b7280;
}

.picker-sub {
  font-size: 22rpx;
  color: #9ca3af;
}

/* Preview */
.preview-box {
  border: 2rpx solid #e5e7eb;
  border-radius: 20rpx;
  overflow: hidden;
  padding: 24rpx;
}

.preview-img {
  width: 100%;
  max-height: 560rpx;
  border-radius: 12rpx;
}

.replace-row {
  display: flex;
  justify-content: center;
  margin-top: 20rpx;
}

.replace-btn {
  font-size: 24rpx;
  color: #3b82f6;
}

.replace-btn.disabled {
  opacity: 0.5;
}

/* Upload progress */
.upload-progress {
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  border: 2rpx solid #e5e7eb;
  border-radius: 20rpx;
}

.upload-hint {
  font-size: 26rpx;
  color: #6b7280;
}

.upload-track {
  width: 100%;
  height: 8rpx;
  background: #e5e7eb;
  border-radius: 100rpx;
  overflow: hidden;
}

.upload-fill {
  height: 100%;
  background: #3b82f6;
  border-radius: 100rpx;
  transition: width 0.3s ease;
}

/* Progress hints */
.cold-start-hint {
  display: block;
  margin-top: 20rpx;
  font-size: 22rpx;
  color: #9ca3af;
}

/* Error */
.error-box {
  background: #fef2f2;
  border: 2rpx solid #fecaca;
  border-radius: 20rpx;
  margin: 0 32rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.error-text {
  font-size: 26rpx;
  color: #b91c1c;
}

.retry-btn {
  align-self: flex-start;
  padding: 12rpx 32rpx;
  border: 2rpx solid #fca5a5;
  border-radius: 12rpx;
}

.retry-text {
  font-size: 24rpx;
  color: #b91c1c;
}

/* Start button */
.center {
  display: flex;
  justify-content: center;
}

.start-btn {
  background: #111827;
  padding: 28rpx 80rpx;
  border-radius: 20rpx;
}

.start-text {
  font-size: 28rpx;
  font-weight: 500;
  color: #fff;
}

/* Other style */
.other-style-row {
  display: flex;
  justify-content: center;
  margin-top: 40rpx;
}

.other-style-btn {
  padding: 16rpx 40rpx;
}

.other-style-text {
  font-size: 26rpx;
  color: #3b82f6;
}
</style>
