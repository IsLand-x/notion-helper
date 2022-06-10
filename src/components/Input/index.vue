<script lang="ts" setup>
import { computed } from 'vue';
import styles from './index.module.less'
import deletePng from '../../assets/delete.png';

type IInput = {
  modelValue: string;
  label: string;
  placeholder?: string;
  extra?: string;
  onChangeCb?: (x: string) => string;
  canDelete?: boolean
}

type IInputEmits = {
  (e: 'update:modelValue', value: string): void;
}

const props = defineProps<IInput>()
const emit = defineEmits<IInputEmits>()

const internalValue = computed<string>({
  get() {
    return props.modelValue
  },
  set(rawValue: string) {
    emit("update:modelValue", rawValue)
    const processedValue = props.onChangeCb?.(rawValue) || rawValue
    if (processedValue !== rawValue) {
      setTimeout(() => {
        emit("update:modelValue", processedValue)
      })
    }
  }
})
</script>

<template>
  <div :class="styles.wrapper">
    <div :class="styles.label">{{ label }}</div>
    <div :class="styles.inputWrapper">
      <input :class="styles.input" v-model="internalValue" :placeholder="placeholder" />
      <div :class="styles.deleteWrapper" v-if="canDelete && internalValue" @click="internalValue = ''">
        <img :src="deletePng" :class="styles.delete" />
      </div>
    </div>
    <div :class="styles.extra">{{ extra }}</div>
  </div>
</template>