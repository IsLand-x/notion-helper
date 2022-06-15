<script lang="ts" setup>
import Card from '../Card/index.vue'
import { setClipboardData } from '@tarojs/taro'
import { useGlobal } from '../../stores/global';

const globalConfig = useGlobal().globalConfig

const copyHomepageLink = () => {
  setClipboardData({ data: globalConfig.homepageUrl })
}
</script>

<template>
  <Card @click="copyHomepageLink">
    <div class="text-lg font-bold text-red">点击复制小程序主页链接</div>
    <div class="text-sm">因小程序限制，无法直接跳转。请手动复制粘贴主页链接到浏览器。（主页内包含最新的ios捷径、浏览器插件、常见问题、加群二维码、绑定教程与模板等）</div>
  </Card>
</template>