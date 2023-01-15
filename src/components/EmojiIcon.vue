<template>
  <div
    class="d-flex justify-content-center align-items-center fw-bold align-middle"
    :style="iconStyle"
  >
    <div class="mb-1">{{ props.icon }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  icon: {
    type: String,
    default: '',
  },
  size: {
    type: Number,
    default: 20,
  },
})

const iconStyle = ref({
  fontSize: `calc(${props.size}px / 10 * 6)`,
  width: `${props.size}px`,
  height: `${props.size}px`,
})
</script>
