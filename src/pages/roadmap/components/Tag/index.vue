<script lang="ts" setup>
import styles from './index.module.less';

withDefaults(defineProps<{ type?: "green" | "blue" | "gray" }>(), {
  type: "blue"
})
</script>

<template>
  <div :class="[styles.tag, styles[type]]">
    <slot></slot>
  </div>
</template>