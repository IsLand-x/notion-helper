<script lang="ts" setup>
import { useCapsule } from '../../stores/capsule';
import logo from '../../assets/notion_logo.png';
import styles from './index.module.less';
import { getCurrentPages, navigateBack } from '@tarojs/taro';
import left from '../../assets/left.png'
import {redirectTo} from '@tarojs/taro'
defineProps<{ canGoBack?: boolean }>()
const capsuleStore = useCapsule();
const back = ()=>{
  if(getCurrentPages().length>1){
    navigateBack()
  }else{
    redirectTo({url:'/pages/index/index'})
  }
}
</script>

<template>
  <div :class="['shadow', styles.header]">
    <div :style="{ height: capsuleStore.statusBarHeight + 'px' }"></div>
    <div
      class="track-wide flex items-center text-primary"
      :style="{ height: capsuleStore.navigationBarHeight + 'px' }"
    >
      <img :src="logo" :class="[styles.logo, 'mx-1']" v-if="!canGoBack" />
      <div v-else :class="styles.btn" @click="back">
        <img :src="left" :class="styles.icon" />
        返回
      </div>
      <div class="font-bold text-xl">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
</style>