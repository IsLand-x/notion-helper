<script lang="ts" setup>
import Header from '../../components/Header/index.vue';
import SInput from '../../components/Input/index.vue';
import Card from '../../components/Card/index.vue';
import SButton from '../../components/SButton/index.vue';
import { showToast, cloud, showLoading, hideLoading } from '@tarojs/taro';

import { onMounted, ref } from 'vue';

const key = ref('');
const db = ref('');

onMounted(async () => {
  const { result } = await cloud.callFunction({ name: 'checkIfRegister' }) as unknown as CloudFnRes<null | { key: string, db: string }>;
  if (result.data) {
    key.value = result.data.key;
    db.value = result.data.db;
  }
})

const validate = () => {
  if (!key.value || !db.value) {
    showToast({ icon: 'none', title: '请完整填写Token和ID' })
    return false
  }
  return true
}

const handleSave = async () => {
  if (!validate()) {
    return;
  }
  showLoading({ title: '正在尝试绑定', mask: true })
  const { result } = await cloud.callFunction({
    name: "testBinding",
    data: {
      key: key.value,
      db: db.value
    }
  }) as unknown as CloudFnRes<boolean>

  if (result.errMsg === 'ok') {
    await cloud.callFunction({
      name: 'updateOrRegister',
      data: {
        key: key.value,
        db: db.value
      }
    })
    hideLoading()
    showToast({ icon: 'success', title: '绑定成功' })
  } else {
    hideLoading()
    showToast({ icon: 'error', title: result.errMsg })
  }
}
</script>

<template>
  <div>
    <Header :canGoBack="true">用户绑定</Header>
    <Card>
      <SInput
        :modelValue="key"
        @update:model-value="e => key = e"
        label="Internal Integration Token"
      />
      <SInput :modelValue="db" @update:model-value="e => db = e" label="Database ID" />
    </Card>
    <div style="margin-top:auto">
      <SButton class="m-2" @click="handleSave">绑 定</SButton>
    </div>
  </div>
</template>
