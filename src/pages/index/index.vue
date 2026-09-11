<script setup lang="ts">
import { ALL_STYLES } from '@/utils/types'
import StyleCard from '@/components/StyleCard.vue'

// Split styles into two columns for mini-program compatibility (no CSS columns/masonry)
const colA = ALL_STYLES.filter((_, i) => i % 2 === 0)
const colB = ALL_STYLES.filter((_, i) => i % 2 === 1)
</script>

<template>
  <scroll-view scroll-y class="page">
    <view class="header">
      <text class="title">Pixel Canvas</text>
      <text class="subtitle">挑一种风格，把你的照片翻译成另一种视觉语言</text>
    </view>

    <view class="gallery">
      <view class="col">
        <view v-for="style in colA" :key="style" class="card-wrap">
          <StyleCard :style-key="style" />
        </view>
      </view>
      <view class="col">
        <view v-for="style in colB" :key="style" class="card-wrap">
          <StyleCard :style-key="style" />
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<style scoped>
.page {
  height: 100vh;
  background: linear-gradient(to bottom, #fafafa, #fff);
}

.header {
  padding: 60rpx 40rpx 40rpx;
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
  padding: 0 24rpx 60rpx;
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
</style>
