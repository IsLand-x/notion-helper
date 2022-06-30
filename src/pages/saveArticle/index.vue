<script lang="ts" setup>
import { useDidShow, showToast, getEnterOptionsSync, getCurrentPages, useDidHide, getCurrentInstance, getStorageSync, setStorageSync } from '@tarojs/taro';
import { ref } from 'vue';
import Header from '../../components/Header/index.vue'
import Card from '../../components/Card/index.vue';
import styles from './index.module.less'
import logo from '../../assets/notion_logo.png';
import SButton from '../../components/SButton/index.vue';
import FadeTransition from '../../components/FadeTransition.vue';
import SInput from '../../components/Input/index.vue';
import ScrollableContent from '../../components/ScrollableContent.vue';
import SaveArticle from '../../components/SaveArticle/index.vue';
import SSwitch from '../../components/Switch/index.vue';

const url = ref('')
const tempUrl = ref('');

const isError = ref(false);
const errMsg = ref('');

// For Android only.
const urlSavedArr = ref<string[]>([]);

const resetStatus = () => {
  errMsg.value = ''
  isError.value = false
  url.value = ''
}

const handleSave = (articleUrl: string) => {
  if (articleUrl === '') {
    showToast({ title: '请粘贴URL', icon: 'none' })
    return
  }
  const httpStartIdx = articleUrl.indexOf("http")
  articleUrl = articleUrl.slice(httpStartIdx)
  if (!articleUrl.trim().startsWith("http")) {
    showToast({ icon: 'none', title: '请检查URL是否合法' })
    return;
  }
  resetStatus()
  setTimeout(() => {
    url.value = articleUrl.trim()
  })
}

const handleStatusChange = (e: { isError: boolean; errMsg: string; }) => {
  errMsg.value = e.errMsg;
  isError.value = e.isError;
}

useDidShow(() => {
  const paramUrl = decodeURIComponent(getCurrentInstance().router?.params.url || "")
  if (getCurrentPages().length > 1 && !paramUrl) {
    return;
  }
  const { forwardMaterials = [] } = getEnterOptionsSync();
  const urlToSave = paramUrl || forwardMaterials[0]?.path
  // For android only.
  // To avoid unnecessary saving when binging mp back to front
  if (urlSavedArr.value.includes(urlToSave) || !urlToSave) {
    return
  }
  urlSavedArr.value.push(urlToSave)
  handleSave(urlToSave)
})

useDidHide(resetStatus)

const fastSave = ref(getStorageSync('fastSave'))
const handleFastSaveChange = (e) => {
  fastSave.value = e;
  setStorageSync('fastSave', e)
}
</script>

<template>
  <Header can-go-back>Notion助手</Header>
  <ScrollableContent>
    <Card>
      <div :class="styles.wrapper">
        <img :src="logo" :class="styles.img" />
      </div>
    </Card>
    <FadeTransition>
      <SaveArticle :url="url" v-if="url" style="animationDuration: 0.5s" :show-status="false"
        @statusChange="handleStatusChange" />
    </FadeTransition>
    <FadeTransition>
      <div style="animationDuration: 0.5s" v-if="url === ''">
        <Card>
          <SInput :model-value="tempUrl" @update:model-value="e => tempUrl = e" label="文章链接"
            extra="若所填链接不以http开头，助手会自动截取http及其之后的所有字符作为文章链接" can-delete />
        </Card>
        <Card class="font-bold p-1 text-sm">
          <div>安卓用户也可以直接通过”公众号推送->右上角三个点->更多打开方式“中打开Notion助手，更方便地将文章保存到Notion。</div>
          <div>ios用户可以使用Notion助手提供的捷径，无需打开小程序，更方便！详见主页。</div>
          <div>Notion助手提供浏览器插件，使用教程、下载地址详见主页。</div>
        </Card>
        <SButton @click="handleSave(tempUrl)" class="mx-2">保 存</SButton>
        <Card>
          <SSwitch :model-value="fastSave" @update:model-value="handleFastSaveChange">快捷保存</SSwitch>
          <div class="text-xs">
            允许Notion助手在首页监听剪切板内容，若剪切板中含有网址，则自动弹出收藏提示。收藏完成之后请返回到首页。
          </div>
          <img style="height:600rpx;margin:10rpx;" mode="aspectFit"
            src="cloud://cloud1-0gdb05jw5581957d.636c-cloud1-0gdb05jw5581957d-1310720469/fastSaveGif.gif" />
        </Card>
      </div>
    </FadeTransition>
    <FadeTransition>
      <Card v-if="isError || errMsg === 'ok'" style="animationDuration: 0.5s" class="font-bold">
        <div v-if="isError" class="text-red">{{ errMsg }}</div>
        <div v-else class="text-green">保存成功</div>
      </Card>
    </FadeTransition>
    <FadeTransition>
      <SButton @click="handleSave(url)" class="m-2" style="animationDuration: 0.5s" v-if="errMsg.includes('超时')">重 试
      </SButton>
    </FadeTransition>
  </ScrollableContent>
</template>
