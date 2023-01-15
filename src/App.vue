<template>
  <VipModule />
  <PanModule />
</template>
<script setup>
import VipModule from './module/VipModule.vue'
import PanModule from './module/PanModule.vue'
import { onErrorCaptured } from 'vue'
import logger from './utils/logger'

onErrorCaptured((err, instance, info) => {
  logger.error('module error', err, info)
})
</script>
<style>
/* load bootstrap */
@import 'bootstrap';

:host {
  all: initial;
  z-index: 999999;
  position: fixed;
  top: 10px;
  left: 10px;
  top: var(--fixed-top);
  left: var(--fixed-left);
}

::-webkit-scrollbar {
  display: none;
}

.interval-col {
  margin-bottom: 8px;
}

.interval-col:last-child {
  margin-bottom: 0;
}
</style>
