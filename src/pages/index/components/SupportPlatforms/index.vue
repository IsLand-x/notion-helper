<script lang="ts" setup>
import { useGlobal } from '../../../../stores/global'
import styles from './index.module.less'
import Card from '../../../../components/Card/index.vue';
const globalConfig = useGlobal().globalConfig

</script>

<template>
  <div class="m-2 rounded bg-white shadow relative overflow-hidden">
    <div class="font-bold border-bottom p-1 text-sm">
      小程序和ios捷径可智能识别并剪藏如下平台的内容：
    </div>
    <div :class="styles.body">
      <div v-for="platform of globalConfig.supportPlatforms" :key="platform.platform"
        :class="['border-right', 'border-bottom', styles.item]">
        <div>
          <img :src="platform.image" :class="styles.img">
        </div>
        <div :class="styles.desc">{{ platform.platform }}</div>
      </div>
    </div>
  </div>
  <Card class="font-bold p-1 text-sm">
    其他平台仅支持剪藏文章标题和链接。<br />
    在电脑端推荐使用Notion助手浏览器插件，使用教程、下载地址详见主页。
  </Card>
</template>