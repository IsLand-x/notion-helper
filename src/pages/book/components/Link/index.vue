<script lang="ts" setup>
import { setClipboardData } from '@tarojs/taro'
import styles from './index.module.less';

const props = defineProps<{ href: string }>()
const handleCopy = () => {
  setClipboardData({ data: props.href })
}
</script>

<template>
  <span @click="handleCopy" :class="styles.link">
    <slot></slot>
  </span>
</template>

<style scoped lang="less">
</style>