<script lang="ts" setup>
import { cloud } from '@tarojs/taro';
import Question from './components/Question/index';
import Header from '../../components/Header';
import Card from '../../components/Card';
import { onMounted, ref } from 'vue'
import { useCapsule } from '../../stores/capsule';

type QuestionType = {
  question: string;
  answer: string;
}

const capsuleStore = useCapsule()
const questions = ref<QuestionType[]>([])

onMounted(async () => {
  const { result } = await cloud.callFunction({
    name: "questions"
  }) as unknown as CloudFnRes<QuestionType[]>;

  questions.value = result.data;
})

</script>

<template>
  <div>
    <Header :can-go-back="true">常见问题</Header>
    <scroll-view scroll-y="true"
      :style="{ height: `calc(100vh - ${capsuleStore.navigationBarHeight + capsuleStore.statusBarHeight}px)` }">
      <Card>
        <Question v-for="question in questions" :key="question.question">
          <template #question>{{ question.question }}</template>
          <template #answer>{{ question.answer }}</template>
        </Question>
      </Card>
    </scroll-view>

  </div>
</template>

<style scoped lang="less">
</style>