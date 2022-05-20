<script lang="ts" setup>
import Header from '../../components/Header/index.vue';
import SInput from '../../components/Input/index.vue';
import Card from '../../components/Card/index.vue';
import SButton from '../../components/SButton/index.vue';
import { showToast, showLoading, hideLoading } from '@tarojs/taro';
import { onMounted, ref } from 'vue';
import ScrollableContent from '../../components/ScrollableContent.vue';
import { callCloudFunction } from '../../utils';
import FadeTransition from '../../components/FadeTransition.vue';
import HomepageTooltip from '../../components/HomepageTooltip/index.vue'

type CheckIfRegisterResp = { db: string, key: string }

const key = ref('');
const db = ref('');
const errMsg = ref('')

onMounted(async () => {
  const result = await callCloudFunction<CheckIfRegisterResp>('checkIfRegister');
  if (result.data) {
    key.value = result.data.key;
    db.value = result.data.db;
  }
})

const handleBindUserInfo = async () => {
  if (!key.value || !db.value) {
    showToast({ icon: 'none', title: '请完整填写Token和ID' })
    return
  }
  if (db.value.length !== 32) {
    showToast({ icon: 'none', title: 'DatabaseID应当为32位，请检查' })
    return
  }
  showLoading({ title: '正在尝试绑定', mask: true })
  const result = await callCloudFunction<boolean>("testBinding", { key: key.value, db: db.value })
  if (result.errMsg === 'ok') {
    await callCloudFunction('updateOrRegister', { key: key.value, db: db.value })
    hideLoading()
    showToast({ icon: 'success', title: '绑定成功' })
    errMsg.value = ''
  } else {
    hideLoading()
    showToast({ icon: 'none', title: result.errMsg })
    errMsg.value = result.errMsg
  }
}

const onDbIdChange = (str: string) => {
  if (str.startsWith("https://www.notion.so/")) {
    const raw = str.split('/')
    return raw[raw.length - 1].slice(0, 32)
  } else {
    return str
  }
}
</script>

<template>
  <Header :canGoBack="true">信息绑定</Header>
  <ScrollableContent>
    <Card class="p-2">
      绑定前请先查看使用教程，若绑定遇到表头错误、token或者id不正确等问题，请查看首页->常见问题，或首页->加入用户群反馈，或到小程序主页查看最新常见问题并自助解决。
    </Card>
    <HomepageTooltip />
    <Card class="p-2">
      <SInput :modelValue="key" @update:model-value="e => key = e" label="Internal Integration Token" />
      <SInput :modelValue="db" @update:model-value="e => db = e" label="Database ID" :onChangeCb="onDbIdChange"
        extra="可粘贴Database的Id或Url，若为Url助手会尝试自动解析并提取。请确保Url正确性" />
    </Card>
    <SButton class="m-2" @click="handleBindUserInfo">绑 定</SButton>
    <FadeTransition>
      <div v-if="errMsg !== ''" style="animation-duration:0.5s">
        <Card class="p-2 text-red font-bold">
          {{ errMsg }}
        </Card>
      </div>
    </FadeTransition>
  </ScrollableContent>
</template>
