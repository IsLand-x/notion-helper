<script lang="ts" setup>
import { computed } from 'vue';
import styles from './index.module.less';
import { TransitionPresets, useTransition } from '@vueuse/core';

type IProps = {
  modelValue: boolean;
}

type IEmits = {
  (e: "update:modelValue", rawValue: boolean): void;
}

const props = defineProps<IProps>()
const emit = defineEmits<IEmits>()

const internalValue = computed<boolean>({
  get() {
    return props.modelValue
  },
  set(rawValue: boolean) {
    emit("update:modelValue", rawValue)
  }
})
const percent = computed(() => {
  return internalValue.value ? 60 : 0;
})
const percentShow = useTransition(percent, {
  duration: 300,
  transition: TransitionPresets.easeInOutCubic,
})



const toggle = () => {
  internalValue.value = !internalValue.value
}
</script>

<template>
  <div :class="styles.switchWrapper">
    <div>
      <slot></slot>
    </div>
    <div :class="styles.btnWrapper" @click="toggle">
      <div :class="styles.btn" :style="`transform: translateX(${percentShow}rpx)`"></div>
    </div>
  </div>
</template>
