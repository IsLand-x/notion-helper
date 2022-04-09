<script lang="ts" setup>
import styles from './index.module.less';
</script>

<template>
<div :class="styles.container">
  <div :class="styles.question">
    <slot name="question"></slot>
  </div>
  <div :class="styles.answer">
    <slot name="answer"></slot>
  </div>
</div>
</template>

<style scoped lang="less">

</style>