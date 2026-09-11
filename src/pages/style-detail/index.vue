<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { STYLE_META } from '@/utils/styles'
import { isStyle } from '@/utils/types'
import type { Style } from '@/utils/types'

const style = ref<Style | null>(null)

onLoad((options) => {
  const key = options?.style
  if (key && isStyle(key)) {
    style.value = key
    uni.setNavigationBarTitle({ title: `${STYLE_META[key].label} · Pixel Canvas` })
  }
})

function goTry() {
  if (!style.value) return
  uni.navigateTo({ url: `/pages/try/index?style=${style.value}` })
}

function goBack() {
  uni.navigateBack()
}
</script>

<template>
  <scroll-view v-if="style" scroll-y class="page">
    <!-- Gradient banner -->
    <view
      class="banner"
      :style="`background-image: linear-gradient(135deg, ${STYLE_META[style].gradient[0]} 0%, ${STYLE_META[style].gradient[1]} 55%, ${STYLE_META[style].gradient[2]} 100%);`"
    >
      <view class="banner-overlay" />
      <view class="banner-content">
        <text class="banner-key">{{ style }}</text>
        <text class="banner-label">{{ STYLE_META[style].label }}</text>
        <text class="banner-tagline">{{ STYLE_META[style].tagline }}</text>
      </view>
    </view>

    <!-- Body -->
    <view class="body">
      <text class="description">{{ STYLE_META[style].description }}</text>

      <view class="keywords">
        <view
          v-for="kw in STYLE_META[style].keywords"
          :key="kw"
          class="keyword-tag"
        >
          <text class="keyword-text">{{ kw }}</text>
        </view>
      </view>

      <view class="cta" @tap="goTry">
        <text class="cta-text">尝试这种风格 →</text>
      </view>
    </view>
  </scroll-view>

  <view v-else class="page center">
    <text class="error-text">风格不存在</text>
    <view class="back-btn" @tap="goBack">
      <text class="back-text">← 返回</text>
    </view>
  </view>
</template>

<style scoped>
.page {
  height: 100vh;
  background: linear-gradient(to bottom, #fafafa, #fff);
}

.center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Banner */
.banner {
  position: relative;
  width: 100%;
  padding-bottom: 37.5%; /* 16/6 aspect */
  overflow: hidden;
}

.banner-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.15);
}

.banner-content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 40rpx 48rpx;
}

.banner-key {
  font-size: 20rpx;
  font-weight: 500;
  letter-spacing: 5rpx;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 8rpx;
}

.banner-label {
  font-size: 72rpx;
  font-weight: 700;
  color: #fff;
  line-height: 1.1;
  text-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.25);
}

.banner-tagline {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.95);
  margin-top: 12rpx;
}

/* Body */
.body {
  padding: 48rpx 40rpx 80rpx;
}

.description {
  font-size: 28rpx;
  line-height: 1.8;
  color: #374151;
  display: block;
  margin-bottom: 40rpx;
}

.keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-bottom: 64rpx;
}

.keyword-tag {
  background: #f3f4f6;
  border-radius: 100rpx;
  padding: 10rpx 28rpx;
}

.keyword-text {
  font-size: 22rpx;
  color: #374151;
}

/* CTA */
.cta {
  background: #111827;
  border-radius: 20rpx;
  padding: 36rpx;
  text-align: center;
}

.cta-text {
  font-size: 28rpx;
  font-weight: 500;
  color: #fff;
}

/* Error */
.error-text {
  font-size: 28rpx;
  color: #9ca3af;
  margin-bottom: 32rpx;
}

.back-btn {
  padding: 20rpx 48rpx;
  border-radius: 12rpx;
  border: 2rpx solid #d1d5db;
}

.back-text {
  font-size: 26rpx;
  color: #374151;
}
</style>
