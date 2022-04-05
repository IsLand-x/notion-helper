<script lang="ts" setup>
import Header from '../../components/Header/index.vue';
import Card from '../../components/Card/index.vue';
import styles from './index.module.less';
import RoadMapItem from './components/RoadMapItem/index.vue';

</script>

<template>
  <div>
    <Header :canGoBack="true">更新日志</Header>
    <Card>
      <div :class="styles.wrapper">
        <RoadMapItem date="2022-04-05" version="0.0.2">
          <div>新增更新日志模块。</div>
          <div>新增爬取文章内容到Notion的功能。（IOS暂不支持）</div>
        </RoadMapItem>
        <RoadMapItem date="2022-04-03" version="0.0.1">新增文章链接收藏到Notion功能。（IOS暂不支持）</RoadMapItem>
      </div>
    </Card>
  </div>
</template>

<style scoped lang="less">
</style>