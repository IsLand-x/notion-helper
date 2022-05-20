<script lang="ts" setup>
import { useGlobal } from '../../../../stores/global'
import styles from './index.module.less'

const globalConfig = useGlobal().globalConfig

</script>

<template>
  <div class="m-2 rounded bg-white shadow relative overflow-hidden">
    <div class="font-bold border-bottom p-1 text-sm">
      现已支持以下平台
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
</template>