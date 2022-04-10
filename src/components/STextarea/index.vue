<script lang="ts" setup>
import styles from './index.module.less';
import {ref,watch} from 'vue';

type IEmits = {
  (e:'change',value:string):void
}

type ITextarea = {
  placeholder:string;
  label:string;
}

const emit = defineEmits<IEmits>();

defineProps<ITextarea>();

const innerText =ref('');

watch(innerText,()=>{
  emit('change',innerText.value)
})
</script>

<template>
<div>
  <div :class="styles.label">{{label}}</div>
  <textarea 
    :placeholder="placeholder"
    :class="styles.textarea"
    v-model="innerText"
    maxlength="-1"
    autoHeight
  />
</div>
</template>

<style scoped lang="less">

</style>