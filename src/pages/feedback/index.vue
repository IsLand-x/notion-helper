<script lang="ts" setup>
import Header from '../../components/Header/index.vue'
import Card from '../../components/Card/index.vue';
import styles from './index.module.less';
import SButton from '../../components/SButton/index.vue';
import { onMounted, ref } from 'vue';
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

const feedbackGroupUrl = ref('')
onMounted(async () => {
  const { result } = await cloud.callFunction({ name: "getAddGroupImage" }) as any;
  feedbackGroupUrl.value = result.data
})

</script>

<template>
  <div>
    <Header :canGoBack="true">反馈 & 用户群</Header>
    <!-- <Card>
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
    <SButton @click="handleSubmit" class="mx-2">提交</SButton> -->

    <Card>
      <div class="p-2">
        Hi，我是Notion的开发者IsLand，如果你在使用过程中遇到问题或有宝贵建议，可以加群反馈。如果这个工具对你有所帮助，欢迎推荐给周围需要的人，也欢迎关注我的公众号，获得更及时的更新推送和技术浅谈~</div>
    </Card>
    <Card>
      <div class="p-2">
        微信公众号（长按图片可跳转）
        <image style="height:200rpx" mode="aspectFit" show-menu-by-longpress="true"
          src="cloud://cloud1-0gdb05jw5581957d.636c-cloud1-0gdb05jw5581957d-1310720469/output-onlinepngtools-min.png" />
      </div>
    </Card>
    <Card>
      <div class="p-2">
        Notion助手用户群（长按图片可跳转）
        <image style="margin-top: 10rpx;" :src="feedbackGroupUrl" mode="aspectFit" show-menu-by-longpress="true" />
      </div>
    </Card>
  </div>
</template>

<style scoped lang="less">
</style>