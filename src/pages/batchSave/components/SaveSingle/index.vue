<script lang="ts" setup>
import { effect } from 'vue';
import Card from '../../../../components/Card/index.vue';
import { ref } from 'vue';
import { TransitionPresets, useTransition } from '@vueuse/core';
import styles from './index.module.less';
import { cloud } from '@tarojs/taro';

type ISaveSingle = {
  url: string;
}

interface IArticleInfo {
  articleName: string;
  author: string;
}

type GetArticleInfoResp = CloudFnRes<IArticleInfo>


const props = defineProps<ISaveSingle>();

const isError = ref(false);
const status = ref('');
const percent = ref(0)
const percentShow = useTransition(percent, {
  duration: 300,
  transition: TransitionPresets.easeInOutCubic,
})
const articleInfo = ref<IArticleInfo>({
  articleName:'待获取',
  author:'待获取'
})

const saveArticle = async () => {
  if (!props.url) {
    return;
  }
  status.value = "正在准备"
  status.value = "正在获取文章信息"
  percent.value=10;
  const { result: articleResult } = await cloud.callFunction({
    name: "getArticleInfo",
    data: {
      url: props.url
    }
  }).catch(e => {
    console.error(e);
    return { result: { errMsg: '请求超时，请重试' } }
  }) as unknown as GetArticleInfoResp;
  if(articleResult.errMsg!=='ok'){
    status.value=articleResult.errMsg;
    isError.value=true;
    return;
  }
  articleInfo.value=articleResult.data
  status.value="获取文章信息成功"
  percent.value=40
  status.value = "正在保存文章"

  const { result: saveResult } = await cloud.callFunction({
    name: "storeArticle",
    data: {
      url: props.url
    }
  }).catch(e => {
    console.error(e);
    return { result: { errMsg: '请求超时，请重试' } }
  }) as unknown as CloudFnRes<boolean>
  if (saveResult.errMsg !== 'ok') {
    isError.value=true;
    status.value = saveResult.errMsg;
    return;
  }
  percent.value = 100
  status.value='保存成功'
}
saveArticle()
</script>

<template>
  <div>
    <Card>
      <div class="p-2">
        <div :class="styles.articleInfo">
          <div :class="styles.articleName">{{ articleInfo.articleName }}</div>
          <div :class="styles.author">{{ articleInfo.author }}</div>
        </div>
        <div :class="styles.status">{{ status }}</div>
        <progress
          border-radius="100"
          :percent="percentShow"
          :strokeWidth="6"
          active
          :activeColor="isError ? '#d44d44' : percentShow === 100 ? '#8aad37' : '#3965cc'"
        />
      </div>
    </Card>
  </div>
</template>

<style scoped lang="less">
</style>