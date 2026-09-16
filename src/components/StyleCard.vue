<script setup lang="ts">
import type { Style } from '@/utils/types'
import { STYLE_META } from '@/utils/styles'

const props = defineProps<{ styleKey: Style; imageUrl?: string }>()

const meta = STYLE_META[props.styleKey]

const gradientStyle = `background-image: linear-gradient(135deg, ${meta.gradient[0]} 0%, ${meta.gradient[1]} 55%, ${meta.gradient[2]} 100%);`

// aspect ratio → padding-bottom trick (mini-program doesn't support aspect-ratio CSS in all versions)
const ASPECT_PB: Record<string, string> = {
  '3/4': '133.33%',
  '4/5': '125%',
  '1/1': '100%',
  '5/6': '120%',
}
const paddingBottom = ASPECT_PB[meta.aspect] || '125%'

function goDetail() {
  if (props.imageUrl) {
    uni.navigateTo({ url: `/pages/try/index?style=${props.styleKey}&imageUrl=${encodeURIComponent(props.imageUrl)}` })
  } else {
    uni.navigateTo({ url: `/pages/style-detail/index?style=${props.styleKey}` })
  }
}
</script>

<template>
  <view class="card" :style="gradientStyle" :class="{ 'card--active': imageUrl }" @tap="goDetail">
    <view class="spacer" :style="`padding-bottom: ${paddingBottom};`" />
    <view class="overlay" />
    <view class="content">
      <text class="style-key">{{ styleKey }}</text>
      <view class="bottom">
        <text class="label">{{ meta.label }}</text>
        <text class="tagline">{{ meta.tagline }}</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.card {
  position: relative;
  width: 100%;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.card--active {
  box-shadow: 0 0 0 4rpx #111827, 0 4rpx 16rpx rgba(0, 0, 0, 0.2);
}

.spacer {
  display: block;
  width: 100%;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.12);
}

.content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 28rpx;
}

.style-key {
  font-size: 18rpx;
  font-weight: 500;
  letter-spacing: 4rpx;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.85);
}

.bottom {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.label {
  font-size: 44rpx;
  font-weight: 700;
  color: #fff;
  line-height: 1.2;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
}

.tagline {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.92);
}
</style>
