<script setup lang="ts">
import { ref } from 'vue'
import { ALL_STYLES } from '@/utils/types'
import StyleCard from '@/components/StyleCard.vue'
import { uploadImage } from '@/utils/upload'

const colA = ALL_STYLES.filter((_, i) => i % 2 === 0)
const colB = ALL_STYLES.filter((_, i) => i % 2 === 1)

const pendingImageUrl = ref<string | null>(null)
const uploadPct = ref(0)
const isUploading = ref(false)
const uploadError = ref<string | null>(null)

function pickImage(sourceType: 'album' | 'camera') {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: [sourceType],
    success: async (res) => {
      const tempPath = res.tempFilePaths[0]
      if (!tempPath) return
      isUploading.value = true
      uploadError.value = null
      uploadPct.value = 0
      try {
        const pubUrl = await uploadImage(tempPath, (pct) => { uploadPct.value = pct })
        pendingImageUrl.value = pubUrl
      } catch (e) {
        uploadError.value = e instanceof Error ? e.message : '上传失败'
      } finally {
        isUploading.value = false
        setTimeout(() => { uploadPct.value = 0 }, 500)
      }
    },
    fail: (err) => {
      if (!err.errMsg?.includes('cancel')) uploadError.value = '选择图片失败'
    },
  })
}

function clearImage() {
  pendingImageUrl.value = null
  uploadError.value = null
}
</script>

<template>
  <view class="root">
    <scroll-view scroll-y class="page">
      <view class="header">
        <text class="title">Pixel Canvas</text>
        <text class="subtitle">挑一种风格，把你的照片翻译成另一种视觉语言</text>
      </view>

      <view class="gallery">
        <view class="col">
          <view v-for="style in colA" :key="style" class="card-wrap">
            <StyleCard :style-key="style" :image-url="pendingImageUrl ?? undefined" />
          </view>
        </view>
        <view class="col">
          <view v-for="style in colB" :key="style" class="card-wrap">
            <StyleCard :style-key="style" :image-url="pendingImageUrl ?? undefined" />
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- Floating bottom bar -->
    <view class="float-bar">
      <!-- Uploading -->
      <view v-if="isUploading" class="bar-uploading">
        <text class="upload-hint">上传中… {{ uploadPct }}%</text>
        <view class="upload-track">
          <view class="upload-fill" :style="`width: ${uploadPct}%;`" />
        </view>
      </view>

      <!-- Image ready -->
      <view v-else-if="pendingImageUrl" class="bar-ready">
        <image class="thumbnail" :src="pendingImageUrl" mode="aspectFill" />
        <view class="bar-info">
          <text class="bar-label">点击上方风格即可生成</text>
          <view class="bar-actions">
            <view class="action-btn" @tap="pickImage('album')">
              <text class="action-text">换一张</text>
            </view>
            <view class="action-btn" @tap="pickImage('camera')">
              <text class="action-text">重新拍</text>
            </view>
            <view class="action-btn action-btn--ghost" @tap="clearImage">
              <text class="action-text action-text--ghost">清除</text>
            </view>
          </view>
        </view>
      </view>

      <!-- Default: pick buttons -->
      <view v-else class="bar-pick">
        <view class="pick-btn" @tap="pickImage('album')">
          <text class="pick-icon">🖼</text>
          <text class="pick-label">从相册选</text>
        </view>
        <view class="pick-divider" />
        <view class="pick-btn" @tap="pickImage('camera')">
          <text class="pick-icon">📷</text>
          <text class="pick-label">立即拍照</text>
        </view>
      </view>

      <!-- Error -->
      <view v-if="uploadError" class="bar-error">
        <text class="error-text">{{ uploadError }}</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.root {
  position: relative;
  height: 100vh;
}

.page {
  height: 100vh;
  background: linear-gradient(to bottom, #fafafa, #fff);
  /* leave room for the floating bar (~180rpx) */
  padding-bottom: 180rpx;
  box-sizing: border-box;
}

.header {
  padding: 60rpx 40rpx 32rpx;
  text-align: center;
}

.title {
  display: block;
  font-size: 56rpx;
  font-weight: 700;
  color: #111827;
  letter-spacing: -1rpx;
}

.subtitle {
  display: block;
  margin-top: 12rpx;
  font-size: 24rpx;
  color: #9ca3af;
}

.gallery {
  display: flex;
  gap: 16rpx;
  padding: 0 24rpx 24rpx;
}

.col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.card-wrap {
  width: 100%;
}

/* Floating bar */
.float-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.96);
  border-top: 2rpx solid #e5e7eb;
  box-shadow: 0 -4rpx 24rpx rgba(0, 0, 0, 0.08);
  padding-bottom: env(safe-area-inset-bottom);
}

/* Default: two pick buttons */
.bar-pick {
  display: flex;
  align-items: center;
}

.pick-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  padding: 28rpx 20rpx;
}

.pick-icon {
  font-size: 48rpx;
  line-height: 1;
}

.pick-label {
  font-size: 24rpx;
  color: #374151;
  font-weight: 500;
}

.pick-divider {
  width: 2rpx;
  height: 64rpx;
  background: #e5e7eb;
}

/* Image ready */
.bar-ready {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 20rpx 24rpx;
}

.thumbnail {
  width: 96rpx;
  height: 96rpx;
  border-radius: 12rpx;
  flex-shrink: 0;
}

.bar-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.bar-label {
  font-size: 26rpx;
  font-weight: 600;
  color: #111827;
}

.bar-actions {
  display: flex;
  gap: 12rpx;
}

.action-btn {
  padding: 6rpx 20rpx;
  border: 2rpx solid #d1d5db;
  border-radius: 100rpx;
  background: #f9fafb;
}

.action-btn--ghost {
  border-color: transparent;
  background: transparent;
}

.action-text {
  font-size: 22rpx;
  color: #374151;
}

.action-text--ghost {
  color: #9ca3af;
}

/* Uploading */
.bar-uploading {
  padding: 28rpx 32rpx;
  display: flex;
  flex-direction: column;
  gap: 14rpx;
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

/* Error */
.bar-error {
  padding: 12rpx 24rpx;
  background: #fef2f2;
  border-top: 2rpx solid #fecaca;
}

.error-text {
  font-size: 22rpx;
  color: #b91c1c;
}
</style>
