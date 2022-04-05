<script lang="ts" setup>
import styles from './index.module.less';
import right from '../../assets/right.png';

const props = defineProps<{ icon: string; name: string; dot?: boolean }>();

</script>

<template>
  <div :class="[styles.item, 'border-bottom']" :hover-class="`${styles.itemHover}`">
    <div :class="[styles.icon, 'border-right']">
      <div v-if="props.dot" :class="styles.dot"></div>
      <img :src="props.icon" :class="styles.img" v-else />
    </div>
    <div class="ml-2 font-bold">{{ props.name }}</div>
    <div :class="styles.right">
      <img :src="right" :class="styles.img" />
    </div>
  </div>
</template>

<style scoped lang="less">
</style>