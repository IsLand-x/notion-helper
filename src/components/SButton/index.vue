<script lang="ts" setup>
import styles from './index.module.less';

defineProps<{ plain?: boolean }>();

</script>

<template>
  <div
    :class="plain ? styles.inputPlain : styles.inputPrimary"
    :hover-class="plain ? styles.hoverInputPlain : styles.hoverInputPrimary"
  >
    <slot name="default"></slot>
  </div>
</template>