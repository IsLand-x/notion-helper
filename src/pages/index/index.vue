<script lang="ts" setup>
import Header from '../../components/Header/index.vue';
import Card from '../../components/Card/index.vue'
import Menu from '../../components/Menu.vue';
import MenuItem from '../../components/MenuItem/index.vue';
import book from '../../assets/book.png';
import feedback from '../../assets/feedback.png';
import user from '../../assets/user.png';
import roadmap from '../../assets/roadmap.png';
import copy from '../../assets/copy.png';
import question from '../../assets/question.png';
import batchSave from '../../assets/batch-save.png';
import logo from '../../assets/notion_logo.png';
import { getStorageSync, navigateTo, getClipboardData, showModal, useDidShow } from '@tarojs/taro';
import styles from './index.module.less';
import { useShareTimeline, setStorageSync, useShareAppMessage } from '@tarojs/taro';
import { ref } from 'vue';
import { useGlobal } from '../../stores/global';
import ScrollableContent from '../../components/ScrollableContent.vue';
import SupportPlatforms from './components/SupportPlatforms/index.vue';
import { OfficialAccount } from '@tarojs/components'

const globalStore = useGlobal()
const showDot = ref(false);

useShareTimeline(() => {
  return {
    title: 'Notion助手-帮你收藏公众号文章到Notion',
    path: '/pages/index/index',
    imageUrl: globalStore.globalConfig.shareTimelineImageUrl
  }
})

useShareAppMessage(() => {
  return {
    title: 'Notion助手-帮你收藏公众号文章到Notion',
    path: '/pages/index/index',
    imageUrl: globalStore.globalConfig.shareAppMessageImageUrl
  }
})

if (globalStore.version !== getStorageSync("version")) {
  showDot.value = true
}

const handleClickDot = () => {
  setStorageSync("version", globalStore.version);
  showDot.value = false;
}

const ignoredUrl = []
const shouldJump = async () => {
  const { data, errMsg } = await getClipboardData()
  console.log(data, errMsg)
  if (data.includes("http")) {
    const url = data.slice(data.indexOf('http'))
    // @ts-ignore 微信新option
    if (ignoredUrl.includes(url)) {
      return
    }
    setTimeout(() => {
      showModal({
        title: '检测到网址，是否保存到Notion？',
        content: url,
        // @ts-ignore
        editable: true,
        success: async (res) => {
          // @ts-ignore
          ignoredUrl.push(url)
          if (res.confirm) {
            // @ts-ignore
            navigateTo({ url: '/pages/saveArticle/index?url=' + res.content })
          }
        }
      })
    })
  }
}

useDidShow(() => {
  if (getStorageSync('fastSave')) {
    setTimeout(shouldJump, 100)
  }
})



</script>

<template>
  <Header>Notion助手</Header>
  <ScrollableContent>
    <OfficialAccount />
    <Card>
      <div :class="styles.wrapper">
        <img :src="logo" :class="styles.img" />
        <div :class="styles.slogan">把喜欢的文章收藏到Notion</div>
      </div>
    </Card>
    <Menu>
      <MenuItem :icon="book" name="使用教程" @click="navigateTo({ url: '/pages/book/index' })" />
      <MenuItem :icon="copy" name="文章保存" @click="navigateTo({ url: '/pages/saveArticle/index' })" />
      <MenuItem :icon="batchSave" name="批量保存" @click="navigateTo({ url: '/pages/batchSave/index' })" />
      <MenuItem :icon="user" name="信息绑定" @click="navigateTo({ url: '/pages/user/index' })" />
      <MenuItem :icon="question" name="常见问题" @click="navigateTo({ url: '/pages/questions/index' })" />
      <MenuItem :icon="feedback" name="主页 & 反馈 & 用户群" @click="navigateTo({ url: '/pages/feedback/index' })" />
      <MenuItem :icon="roadmap" name="更新日志" @click="handleClickDot(), navigateTo({ url: '/pages/roadmap/index' })"
        :dot="showDot" />
    </Menu>
    <SupportPlatforms />
    <div class="text-xs text-gray text-center mt-auto pb-1">Version {{ globalStore.version }} | Copyright 2022 @Island
      All Rights Reserved.</div>
  </ScrollableContent>
</template>
