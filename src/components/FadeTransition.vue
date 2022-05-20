<template>
  <transition mode="out-in" appear enter-from-class="from" leave-to-class="from" enter-active-class="active">
    <slot></slot>
  </transition>
</template>