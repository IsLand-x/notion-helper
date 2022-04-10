<script lang="ts" setup>
import { useDidShow, showToast, getEnterOptionsSync, cloud, navigateTo, getCurrentPages,useDidHide,redirectTo } from '@tarojs/taro';
import { ref } from 'vue';
import Header from '../../components/Header/index.vue'
import Card from '../../components/Card/index.vue';
import styles from './index.module.less'
import { TransitionPresets, useTransition } from '@vueuse/core'
import logo from '../../assets/notion_logo.png';
import SButton from '../../components/SButton/index.vue';
import FadeTransition from '../../components/FadeTransition.vue';
import { useGlobal } from '../../stores/global'
import SInput from '../../components/Input/index.vue';
import SButton1 from '../../components/SButton/index.vue';

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
const tempUrl = ref('');

type GetArticleInfoResp = CloudFnRes<IArticleInfo>

const globalStore = useGlobal()

useDidShow(() => {
  if (!['android', 'devtools'].includes(globalStore.platform)) {
    return;
  }
  if(getCurrentPages().length>1){
    return;
  }
  const { forwardMaterials = [] } = getEnterOptionsSync();
  url.value = forwardMaterials[0]?.path || '';
  console.log(url.value)
  if (url.value) {
    saveArticle()
  }
})

const saveArticle = async () => {
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
    name: "storeArticle",
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
}

const handleSave = () => {
  if (tempUrl.value === '') {
    showToast({ title: '请粘贴URL', icon: 'none' })
    return
  }
  url.value = tempUrl.value;
  saveArticle()
}
</script>

<template>
  <div>
    <Header can-go-back>Notion助手</Header>
    <Card>
      <div :class="styles.wrapper">
        <img :src="logo" :class="styles.img" />
        <progress
          border-radius="100"
          :percent="percentShow"
          :strokeWidth="6"
          active
          :activeColor="isError ? '#d44d44' : percentShow === 100 ? '#8aad37' : '#3965cc'"
          v-if="percentShow !== 0"
        />
      </div>
    </Card>
    <FadeTransition>
      <div style="animationDuration: 0.5s" v-if="url === ''">
        <Card>
          <SInput :model-value="tempUrl" @update:model-value="e => tempUrl = e" label="公众号链接" />
        </Card>
        <Card>
          <div class="p-2">安卓用户也可以直接通过”公众号推送->右上角三个点->更多打开方式“中打开Notion助手，更方便地将文章保存到Notion。</div>
          <div class="p-2">ios用户也可以暂时将文章链接复制到备忘录中，使用批量导入功能提高使用体验。</div>
        </Card>
        <SButton1 @click="handleSave" class="mx-2">保 存</SButton1>
      </div>
    </FadeTransition>
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
        @click="saveArticle"
        class="m-2"
        style="animationDuration: 0.5s"
        v-if="errMsg.includes('请求超时')"
      >重 试</SButton>
    </FadeTransition>
    <Card>
      <official-account/>
    </Card>
  </div>
</template>
