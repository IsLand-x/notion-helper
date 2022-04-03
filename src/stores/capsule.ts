import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useDidShow,getWindowInfo ,getMenuButtonBoundingClientRect} from '@tarojs/taro';

export const useCapsule = defineStore('capsule', () => {
  const navigationBarHeight = ref(0);
  const statusBarHeight = ref(0)
  useDidShow(() => {
    const capsuleInfo = getMenuButtonBoundingClientRect()
    const {statusBarHeight:statusHeight = capsuleInfo.height} = getWindowInfo();
    statusBarHeight.value=statusHeight
    navigationBarHeight.value = (capsuleInfo.top - statusHeight) * 2 + capsuleInfo.height
  })
  return {
    navigationBarHeight,
    statusBarHeight
  }
})
