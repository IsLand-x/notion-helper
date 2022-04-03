<script lang="ts" setup>
import { useDidShow, useDidHide, getEnterOptionsSync, cloud, navigateTo, redirectTo } from '@tarojs/taro';
import { ref, effect } from 'vue';
import Header from '../../components/Header/index.vue'
import Card from '../../components/Card/index.vue';
import styles from './index.module.less'
import { TransitionPresets, useTransition } from '@vueuse/core'
import logo from '../../assets/notion_logo.png';
import SButton from '../../components/SButton/index.vue';
import FadeTransition from '../../components/FadeTransition.vue';

interface IArticleInfo {
  articleName: string;
  author: string;
}

const url = ref('')
const articleInfo = ref<IArticleInfo>();
const percent = ref(0);


const percentShow = useTransition(percent, {
  duration: 300,
  transition: TransitionPresets.easeInOutCubic,
})

const isError = ref(false);
const errMsg = ref('');

type GetArticleInfoResp = CloudFnRes<IArticleInfo>

let isFirst = ref(true)
useDidShow(() => {
  const { forwardMaterials = [] } = getEnterOptionsSync();
  url.value = forwardMaterials[0]?.path;
  if (!url.value) {
    redirectTo({ url: '/pages/index/index' })
    return;
  }
  if (!isFirst.value) {
    runner();
  }
  isFirst.value = false
})

const runner = effect(async () => {
  isError.value = false;
  errMsg.value = '';
  percent.value = 0;
  articleInfo.value = null as any as IArticleInfo;
  if (!url.value) {
    return;
  }
  const { result: articleResult } = await cloud.callFunction({
    name: "getArticleInfo",
    data: {
      url: url.value
    }
  }).catch(e => {
    console.error(e);
    return { result: { errMsg: '请求超时，请重试' } }
  }) as unknown as GetArticleInfoResp;
  percent.value = 40
  if (articleResult.errMsg !== 'ok') {
    isError.value = true
    errMsg.value = articleResult.errMsg;
    return;
  }
  articleInfo.value = articleResult.data
  const { result: saveResult } = await cloud.callFunction({
    name: "saveArticle",
    data: {
      url: url.value
    }
  }).catch(e => {
    console.error(e);
    return { result: { errMsg: '请求超时，请重试' } }
  }) as unknown as CloudFnRes<boolean>
  if (saveResult.errMsg !== 'ok') {
    isError.value = true;
    errMsg.value = saveResult.errMsg;
    return;
  }
  percent.value = 100
})

</script>

<template>
  <div>
    <Header>Notion助手</Header>
    <Card>
      <div :class="styles.wrapper">
        <img :src="logo" :class="styles.img" />
        <progress
          border-radius="100"
          :percent="percentShow"
          :strokeWidth="6"
          active
          :activeColor="isError ? '#d44d44' : percentShow === 100 ? '#8aad37' : '#3965cc'"
        ></progress>
      </div>
    </Card>
    <FadeTransition>
      <Card v-if="articleInfo" style="animationDuration: 0.5s">
        <div :class="styles.articleInfo">
          <div :class="styles.articleName">{{ articleInfo.articleName }}</div>
          <div :class="styles.author">{{ articleInfo.author }}</div>
        </div>
      </Card>
    </FadeTransition>
    <FadeTransition>
      <Card v-if="percent === 100" style="animationDuration: 0.5s">
        <div :class="styles.success">成功收藏文章到Notion</div>
      </Card>
    </FadeTransition>
    <FadeTransition>
      <Card v-if="isError" style="animationDuration: 0.5s">
        <div :class="styles.error">{{ errMsg }}</div>
      </Card>
    </FadeTransition>
    <FadeTransition>
      <SButton
        @click="navigateTo({ url: '/pages/user/index' })"
        class="m-2"
        style="animationDuration: 0.5s"
        v-if="errMsg.includes('绑定')"
      >去 绑 定</SButton>
    </FadeTransition>
    <FadeTransition>
      <SButton
        @click="runner"
        class="m-2"
        style="animationDuration: 0.5s"
        v-if="errMsg.includes('请求超时')"
      >重 试</SButton>
    </FadeTransition>
  </div>
</template>
