<script lang="ts" setup>
import Header from '../../components/Header/index.vue';
import Card from '../../components/Card/index.vue';
import STextarea from '../../components/STextarea/index.vue';
import FadeTransition from '../../components/FadeTransition.vue';
import ScrollableContent from '../../components/ScrollableContent.vue';
import SButton from '../../components/SButton/index.vue';
import SaveArticle from '../../components/SaveArticle/index.vue';
import { showToast } from '@tarojs/taro';
import { ref } from 'vue';

const rawUrls = ref('');
const urls = ref<string[]>([])

const handleChange = (e: string) => {
  rawUrls.value = e
}

const handleSave = () => {
  if (rawUrls.value === '') {
    showToast({ icon: 'none', title: '请填写内容' })
    return;
  }
  const result: string[] = []
  const tempRes = rawUrls.value.split("\n")
  for (const mayBeUrl of tempRes) {
    if (mayBeUrl.includes("http")) {
      result.push(mayBeUrl.trim())
    }
  }
  urls.value = result
}
</script>

<template>
  <Header can-go-back>批量保存</Header>
  <ScrollableContent>
    <FadeTransition>
      <div v-if="urls.length === 0" style="animationDuration: 0.5s">
        <Card>
          <STextarea @change="handleChange" placeholder="请粘贴文章链接，一行一个" label="文章链接" />
        </Card>
        <SButton class="mx-2" @click="handleSave">批量保存</SButton>
      </div>
      <div style="animationDuration: 0.5s" v-else>
        <SaveArticle v-for="(url, idx) of urls" :url="url" :key="url + idx" />
      </div>
    </FadeTransition>
  </ScrollableContent>
</template>