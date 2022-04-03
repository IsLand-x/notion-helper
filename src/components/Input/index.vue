<script lang="ts" setup>
import styles from './index.module.less'

type IInput = {
  modelValue?: string;
  label: string;
  placeholder?: string;
}
type IInputEmits = {
  (e: 'update:modelValue', value: string): void;
}

defineProps<IInput>()
const emit = defineEmits<IInputEmits>()

const handleChange = (e) => {
  emit('update:modelValue', e.detail.value)
}
</script>

<template>
  <div :class="styles.wrapper">
    <div :class="styles.label">{{ label }}</div>
    <input
      :class="styles.input"
      :value="modelValue"
      @change="handleChange"
      :placeholder="placeholder"
    />
  </div>
</template>

<style scoped lang="less">
</style>