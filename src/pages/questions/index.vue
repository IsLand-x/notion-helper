<script lang="ts" setup>
import Question from './components/Question/index.vue';
import Header from '../../components/Header/index.vue';
import Card from '../../components/Card/index.vue';
import ScrollableContent from '../../components/ScrollableContent.vue';
import { useGlobal } from '../../stores/global'
import HomepageTooltip from '../../components/HomepageTooltip/index.vue'

const globalConfig = useGlobal().globalConfig
</script>

<template>
  <Header :can-go-back="true">常见问题</Header>
  <ScrollableContent>
    <HomepageTooltip />
    <Card>
      <Question v-for="question in globalConfig.questions" :key="question.question">
        <template #question>{{ question.question }}</template>
        <template #answer>{{ question.answer }}</template>
      </Question>
    </Card>
  </ScrollableContent>
</template>