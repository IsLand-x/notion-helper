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
        <RoadMapItem date="2022-04-10" version="0.0.5">
          <div>新增批量收藏模块。</div>
          <div>优化使用教程。</div>
          <div>优化绑定体验。</div>
          <div>优化反馈体验。</div>
        </RoadMapItem>
        <RoadMapItem date="2022-04-09" version="0.0.4">
          <div>新增常见问题模块。</div>
        </RoadMapItem>
        <RoadMapItem date="2022-04-05" version="0.0.3">
          <div>新增对IOS用户保存文章的功能支持。</div>
        </RoadMapItem>
        <RoadMapItem date="2022-04-04" version="0.0.2">
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