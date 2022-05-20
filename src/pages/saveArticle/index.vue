<script lang="ts" setup>
import { useDidShow, showToast, getEnterOptionsSync, getCurrentPages, useDidHide } from '@tarojs/taro';
import { ref } from 'vue';
import Header from '../../components/Header/index.vue'
import Card from '../../components/Card/index.vue';
import styles from './index.module.less'
import logo from '../../assets/notion_logo.png';
import SButton from '../../components/SButton/index.vue';
import FadeTransition from '../../components/FadeTransition.vue';
import { useGlobal } from '../../stores/global'
import SInput from '../../components/Input/index.vue';
import ScrollableContent from '../../components/ScrollableContent.vue';
import SaveArticle from '../../components/SaveArticle/index.vue';

const url = ref('')
const tempUrl = ref('');

const isError = ref(false);
const errMsg = ref('');

// For Android only.
const urlSavedArr = ref<string[]>([]);

const globalStore = useGlobal()

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
    showToast({ title: '请检查URL是否合法' })
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
  if (!['android', 'devtools'].includes(globalStore.platform)) {
    return;
  }
  if (getCurrentPages().length > 1) {
    return;
  }
  const { forwardMaterials = [] } = getEnterOptionsSync();
  const urlToSave = forwardMaterials[0]?.path || ''
  // For android only.
  // To avoid unnecessary saving when binging mp back to front
  if (urlSavedArr.value.includes(urlToSave) || !urlToSave) {
    return
  }
  urlSavedArr.value.push(urlToSave)
  handleSave(urlToSave)
})

useDidHide(resetStatus)

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
            extra="若所填链接不以http开头，助手会自动截取http及其之后的所有字符作为文章链接" />
        </Card>
        <Card>
          <div>安卓用户也可以直接通过”公众号推送->右上角三个点->更多打开方式“中打开Notion助手，更方便地将文章保存到Notion。</div>
          <div>ios用户也可以暂时将文章链接复制到备忘录中，使用批量导入功能提高使用体验。</div>
        </Card>
        <SButton @click="handleSave(tempUrl)" class="mx-2">保 存</SButton>
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
