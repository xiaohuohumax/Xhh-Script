<template>
  <div>
    <VipModule />
    <PanModule />
  </div>
</template>
<script setup>
import VipModule from './module/VipModule.vue'
import PanModule from './module/PanModule.vue'
import { onErrorCaptured } from 'vue'
import logger from './utils/logger'

onErrorCaptured((err, _instance, info) => {
  logger.error('module error', err, info)
})
</script>
<style>
@import './style.css';
</style>
