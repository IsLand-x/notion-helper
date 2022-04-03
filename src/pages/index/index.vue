<script lang="ts" setup>
import Header from '../../components/Header/index.vue';
import Card from '../../components/Card/index.vue'
import Menu from '../../components/Menu.vue';
import MenuItem from '../../components/MenuItem/index.vue';
import book from '../../assets/book.png';
import feedback from '../../assets/feedback.png';
import user from '../../assets/user.png';
import { navigateTo } from '@tarojs/taro';
import styles from './index.module.less';
import logo from '../../assets/notion_logo.png';
import { useShareTimeline } from '@tarojs/taro';
useShareTimeline(() => {
  return {
    title: 'Notion助手-帮你收藏公众号文章到Notion',
    path: '/pages/index/index',
    imageUrl: 'https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/basicprofile.png?sign=fe61a2c6304e5e48acc4766e15144f46&t=1648961942'
  }
})
</script>
<script lang="ts">
export default {
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: 'Notion助手-帮你收藏公众号文章到Notion',
      path: '/pages/index/index',
      imageUrl: 'https://636c-cloud1-0gdb05jw5581957d-1310720469.tcb.qcloud.la/default.png?sign=4a721519b94eb7f923fdb7d3dcb92789&t=1648963127'
    }
  }
}
</script>
<template>
  <div class="flex flex-col" style="min-height: 100vh;">
    <Header>Notion助手</Header>
    <Card>
      <div :class="styles.wrapper">
        <img :src="logo" :class="styles.img" />
      </div>
      <div :class="styles.slogan">把喜欢的文章收藏到Notion</div>
    </Card>
    <Menu>
      <MenuItem :icon="book" name="使用教程" @click="navigateTo({ url: '/pages/book/index' })" />
      <MenuItem :icon="user" name="信息绑定" @click="navigateTo({ url: '/pages/user/index' })" />
      <MenuItem :icon="feedback" name="问题反馈" @click="navigateTo({ url: '/pages/feedback/index' })" />
    </Menu>
    <div
      class="text-xs text-gray text-center mt-auto pb-4"
    >Copyright 2022 @Island All Rights Reserved.</div>
  </div>
</template>
