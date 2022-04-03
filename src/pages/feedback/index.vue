<script lang="ts" setup>
import Header from '../../components/Header/index.vue'
import Card from '../../components/Card/index.vue';
import styles from './index.module.less';
import SButton from '../../components/SButton/index.vue';
import { ref } from 'vue';
import { cloud, showToast, showLoading, hideLoading } from '@tarojs/taro';
import SInput from '../../components/Input/index.vue';

const feedback = ref('');
const contact = ref<string>();

const handleSubmit = async () => {
  if (feedback.value === '') {
    showToast({ mask: true, title: '请填写内容', icon: 'none' })
    return
  }
  showLoading({ title: '提交中' })
  const { result } = await cloud.callFunction({ name: 'feedback', data: { feedback: feedback.value, contact: contact.value } }) as any as CloudFnRes<boolean>;
  hideLoading()
  if (result.data) {
    showToast({ mask: true, title: '提交成功' })
  }
}
</script>

<template>
  <div>
    <Header :canGoBack="true">反 馈</Header>
    <Card>
      <div :class="styles.inputWrapper">
        <textarea
          :class="styles.textarea"
          maxlength="-1"
          auto-focus
          auto-height
          placeholder="遇到了哪些Bug，写下你的建议，我们一起让Notion助手更加好用~"
          v-model="feedback"
        />
        <SInput
          :model-value="contact"
          @update:model-value="e => contact = e"
          placeholder="可选"
          label="联系方式"
        />
      </div>
    </Card>
    <SButton @click="handleSubmit" class="mx-2">提交</SButton>
  </div>
</template>

<style scoped lang="less">
</style>