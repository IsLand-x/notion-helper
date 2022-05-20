<script lang="ts" setup>
import Header from '../../components/Header/index.vue'
import Card from '../../components/Card/index.vue';
import ScrollableContent from '../../components/ScrollableContent.vue';
import { useGlobal } from '../../stores/global'
import HomepageTooltip from '../../components/HomepageTooltip/index.vue'

const globalConfig = useGlobal().globalConfig

</script>

<template>
  <Header :canGoBack="true">主页 & 反馈 & 用户群</Header>
  <ScrollableContent>
    <Card>
      Hi，我是Notion的开发者IsLand，如果你在使用过程中遇到问题或有宝贵建议，可以加群反馈。如果这个工具对你有所帮助，欢迎推荐给周围需要的人，也欢迎关注我的公众号，获得更及时的更新推送和技术浅谈~
    </Card>
    <HomepageTooltip />
    <Card>
      微信公众号（长按图片可跳转）
      <div class="flex justify-center items-center">
        <image mode="aspectFit" show-menu-by-longpress="true" :src="globalConfig.wxGzhImageUrl" style="height:300rpx" />
      </div>
    </Card>
    <Card>
      Notion助手用户群（长按图片可跳转）
      <div class="flex justify-center items-center">
        <image :src="globalConfig.addGroupImageUrl" mode="aspectFit" show-menu-by-longpress="true" />
      </div>
    </Card>
  </ScrollableContent>
</template>