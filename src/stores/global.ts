import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getSystemInfoSync } from '@tarojs/taro';

export const useGlobal = defineStore('global', () => {
  const platform = ref(getSystemInfoSync().platform)
  return {
    platform,
    version:'0.0.3'
  }
})
