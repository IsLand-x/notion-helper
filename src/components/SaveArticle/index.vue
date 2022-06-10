<script lang="ts" setup>
import Card from '../Card/index.vue';
import { ref } from 'vue';
import { TransitionPresets, useTransition } from '@vueuse/core';
import styles from './index.module.less';
import { callCloudFunction } from '../../utils/index'
import useStore from './store'

type ISaveSingle = {
  url: string;
  showStatus?: boolean;
}

interface IArticleInfo {
  articleName: string;
  author: string;
}

interface IStatusChangePayload {
  errMsg: string;
  isError: boolean
}

type IEmits = {
  (e: "statusChange", payload: IStatusChangePayload): void;
}

const emit = defineEmits<IEmits>()

const props = withDefaults(defineProps<ISaveSingle>(), { showStatus: true });

const isError = ref(false);
const status = ref('');
const percent = ref(0);

const percentShow = useTransition(percent, {
  duration: 300,
  transition: TransitionPresets.easeInOutCubic,
})

const articleInfo = ref<IArticleInfo>({
  articleName: '待获取',
  author: '待获取'
})

const saveArticle = async () => {
  if (!props.url) {
    return;
  }
  status.value = "正在准备"
  status.value = "正在获取文章信息"
  percent.value = 10;
  const articleResult = await callCloudFunction<IArticleInfo>("crawlPage", { url: props.url, type: "getBasicInfo" })
    .catch(() => { return { errMsg: '获取文章信息失败：可能是文章解析失败、文章链接不正确或超时。' } });
  if (articleResult.errMsg !== 'ok' || !("data" in articleResult) /* avoid type checking only */) {
    isError.value = true;
    status.value = articleResult.errMsg;
    emit("statusChange", { isError: isError.value, errMsg: status.value })
    return;
  }
  articleInfo.value = articleResult.data;
  status.value = "获取文章信息成功"
  percent.value = 40
  status.value = "正在保存文章"

  const saveResult = await callCloudFunction("crawlPage", { url: props.url, type: "save" })
    .catch(() => { return { errMsg: '获取文章信息失败：可能是文章解析失败、文章链接不正确或超时。' } })

  if (saveResult.errMsg !== 'ok') {
    isError.value = true;
    status.value = saveResult.errMsg;
    emit("statusChange", { isError: isError.value, errMsg: status.value })
    return;
  }

  percent.value = 100
  status.value = '保存成功'
  emit("statusChange", { isError: false, errMsg: "ok" })
}

const store = useStore()
store.push(saveArticle)
</script>

<template>
  <Card>
    <div :class="styles.articleInfo">
      <div :class="styles.articleName">{{ articleInfo.articleName }}</div>
      <div :class="styles.author">{{ articleInfo.author }}</div>
    </div>
    <div v-if="showStatus" :class="[styles.status, isError && 'text-red', percentShow === 100 && 'text-green']">{{
        status
    }}</div>
    <progress border-radius="100" :percent="percentShow" :strokeWidth="6" active
      :activeColor="isError ? '#d44d44' : percentShow === 100 ? '#8aad37' : '#3965cc'" />
  </Card>
</template>