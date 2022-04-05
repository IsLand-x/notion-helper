<script lang="ts" setup>
import Tag from '../Tag/index.vue';

defineProps<{
  date: string;
  version: string;
}>()
</script>

<template>
  <div style="margin-bottom:20rpx">
    <div>
      <Tag style="margin-right:10rpx;">version {{ version }} {{ date }}</Tag>
    </div>
    <div style="font-size: 24rpx;">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="less">
</style>