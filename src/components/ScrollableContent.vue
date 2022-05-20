<script lang="ts" setup>
import { useCapsule } from '../../src/stores/capsule';
const capsule = useCapsule()
</script>

<template>
  <scroll-view scroll-y="true" :style="{
    height: `calc(100vh - ${capsule.navigationBarHeight + capsule.statusBarHeight}px)`,
  }">
    <div style="overflow:auto">
      <slot />
    </div>
  </scroll-view>
</template>