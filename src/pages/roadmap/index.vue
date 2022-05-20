<script lang="ts" setup>
import Header from '../../components/Header/index.vue';
import Card from '../../components/Card/index.vue';
import RoadMapItem from './components/RoadMapItem/index.vue';
import ScrollableContent from '../../components/ScrollableContent.vue';
import { useGlobal } from '../../stores/global'

const globalConfig = useGlobal().globalConfig
</script>

<template>
  <Header :canGoBack="true">更新日志</Header>
  <ScrollableContent>
    <Card>
      <RoadMapItem v-for="roadmap of globalConfig.roadmaps" :date="roadmap.date" :version="roadmap.version"
        :key="roadmap.version">
        <div v-for="(desc, idx) of roadmap.desc" :key="idx">{{ desc }}</div>
      </RoadMapItem>
    </Card>
  </ScrollableContent>
</template>