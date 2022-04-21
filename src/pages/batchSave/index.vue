<script lang="ts" setup>
import Header from '../../components/Header/index.vue';
import Card from '../../components/Card/index.vue';
import STextarea from '../../components/STextarea/index.vue';
import FadeTransition from '../../components/FadeTransition.vue';
import SButton from '../../components/SButton/index.vue';
import SaveSingle from './components/SaveSingle/index.vue';

import { showToast } from '@tarojs/taro';

import { ref } from 'vue';
import { useCapsule } from '../../stores/capsule';

const rawUrls = ref('');
const urls = ref<string[]>([])
const capsuleStore = useCapsule();

const handleRawValueChange = (e) => {
  rawUrls.value = e
}

const handleClickSave = () => {
  if (rawUrls.value === '') {
    showToast({ icon: 'none', title: '请填写内容' })
    return;
  }
  const isWechatUrl = url => typeof url === 'string' && url.trim().includes("mp.weixin.qq.com");
  const result: string[] = []
  const tempRes = rawUrls.value.split("\n")
  for (const mayBeUrl of tempRes) {
    if (isWechatUrl(mayBeUrl)) {
      result.push(mayBeUrl.trim())
    }
  }
  urls.value = result
}


</script>

<template>
  <div>
    <Header can-go-back>批量保存</Header>
    <scroll-view
      scroll-y="true"
      :style="{ height: `calc(100vh - ${capsuleStore.navigationBarHeight + capsuleStore.statusBarHeight}px)` }"
    >
      <FadeTransition>
        <div v-if="urls.length === 0" style="animationDuration: 0.5s">
          <Card>
            <div class="p-2">
              <STextarea @change="handleRawValueChange" placeholder="请粘贴文章链接，一行一个" label="文章链接" />
            </div>
          </Card>
          <SButton class="mx-2" @click="handleClickSave">批量保存</SButton>
        </div>
        <div style="animationDuration: 0.5s" v-else>
          <SaveSingle v-for="url of urls" :url="url" :key="url"/>
        </div>
      </FadeTransition>
      <Card>
        <official-account/>
      </Card>
    </scroll-view>
  </div>
</template>

<style scoped lang="less">
</style>