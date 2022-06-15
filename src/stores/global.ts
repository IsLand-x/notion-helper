import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import { getStorageSync, getSystemInfoSync, setStorage, getUpdateManager, showModal } from '@tarojs/taro';
import { callCloudFunction } from '../utils';

type Question = {
  question: string;
  answer: string;
}

type Roadmap = {
  version: string;
  date: string;
  desc: string[];
}

type SupportPlatform = {
  image: string;
  platform: string;
  url: string;
}

interface IGlobalConfig {
  openid: string;
  appid: string;
  unionid: string;
  addGroupImageUrl: string;
  wxGzhImageUrl: string;
  questions: Question[];
  roadmaps: Roadmap[];
  shareTimelineImageUrl: string;
  shareAppMessageImageUrl: string;
  supportPlatforms: SupportPlatform[];
  homepageUrl: string;
  payImgUrl: string;
}

const checkUpdate = () => {
  const updateManager = getUpdateManager()
  updateManager.onUpdateReady(() => {
    showModal({
      title: '更新提示',
      content: '新版本已经准备好，是否重启应用？',
      success: function (res) {
        if (res.confirm) {
          updateManager.applyUpdate()
        }
      }
    })
  })
}

export const useGlobal = defineStore('global', () => {
  const platform = ref(getSystemInfoSync().platform)
  const globalConfig = reactive(JSON.parse(getStorageSync("globalConfig") || "{}") as IGlobalConfig)
  const getGlobalConfig = async () => {
    const data = await callCloudFunction<IGlobalConfig>("getGlobalConfig")
    setStorage({
      key: "globalConfig",
      data: JSON.stringify(data.data)
    })
    Object.assign(globalConfig, data.data)
  }

  getGlobalConfig()
  checkUpdate()

  return {
    platform,
    version: '0.0.9',
    globalConfig
  }
})
