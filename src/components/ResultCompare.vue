<script setup lang="ts">
const props = defineProps<{
  originalUrl: string
  resultUrl: string
}>()

const emit = defineEmits<{
  reset: []
}>()

function downloadResult() {
  // #ifdef H5
  const a = document.createElement('a')
  a.href = props.resultUrl
  a.download = 'stylized.png'
  a.click()
  // #endif

  // #ifndef H5
  uni.showLoading({ title: '保存中…' })
  uni.downloadFile({
    url: props.resultUrl,
    success: (res) => {
      uni.hideLoading()
      if (res.statusCode === 200) {
        uni.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => uni.showToast({ title: '已保存到相册', icon: 'success' }),
          fail: () => uni.showToast({ title: '保存失败，请检查相册权限', icon: 'none' }),
        })
      }
    },
    fail: () => {
      uni.hideLoading()
      uni.showToast({ title: '下载失败', icon: 'none' })
    },
  })
  // #endif
}
</script>

<template>
  <view class="wrap">
    <view class="grid">
      <view class="figure">
        <image class="img" :src="originalUrl" mode="aspectFill" />
        <text class="caption">原图</text>
      </view>
      <view class="figure">
        <image class="img" :src="resultUrl" mode="aspectFill" />
        <text class="caption">风格化</text>
      </view>
    </view>

    <view class="actions">
      <view class="btn btn-primary" @tap="downloadResult">
        <text class="btn-text">保存结果</text>
      </view>
      <view class="btn btn-outline" @tap="emit('reset')">
        <text class="btn-text-outline">再来一张</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.wrap {
  width: 100%;
}

.grid {
  display: flex;
  gap: 16rpx;
  margin-bottom: 32rpx;
}

.figure {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.img {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 12rpx;
  border: 2rpx solid #e5e7eb;
}

.caption {
  font-size: 22rpx;
  color: #9ca3af;
}

.actions {
  display: flex;
  gap: 20rpx;
  justify-content: center;
}

.btn {
  padding: 20rpx 48rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background: #3b82f6;
}

.btn-text {
  font-size: 26rpx;
  font-weight: 500;
  color: #fff;
}

.btn-outline {
  border: 2rpx solid #d1d5db;
  background: #fff;
}

.btn-text-outline {
  font-size: 26rpx;
  font-weight: 500;
  color: #374151;
}
</style>
