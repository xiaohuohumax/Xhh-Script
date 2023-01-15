<template>
  <div
    class="hoverdown position-relative mb-2"
    :class="[isShowModule ? 'hoverdown-open' : '']"
    @mouseenter="onMouseenter"
    @mouseleave="onMouseleave"
  >
    <EmojiIcon
      class="hoverdown-toggle position-relative rounded-circle bg-white shadow-lg"
      :icon="props.icon"
      :size="30"
      @click="toggleClick"
    />
    <div class="hoverdown-menu position-absolute card shadow-lg border-0 overflow-hidden bg-white">
      <div v-show="isShowHelp" class="hoverdown-help position-absolute bg-white w-100 h-100">
        <div class="p-3">
          <slot name="help" />
        </div>
      </div>
      <div class="p-3">
        <EmojiIcon
          class="hoverdown-help-button position-absolute rounded-circle bg-white shadow"
          :size="26"
          icon="❔"
          @click="toggleHelp()"
        />
        <slot />
      </div>
    </div>
  </div>
</template>
<script setup>
import EmojiIcon from './EmojiIcon.vue'
import { ref } from 'vue'

const props = defineProps({
  icon: {
    type: String,
    default: '',
  },
  showType: {
    type: String,
    default: 'hover',
  },
})

const isShowHelp = ref(false)
const isShowModule = ref(false)

function toggleHelp() {
  isShowHelp.value = !isShowHelp.value
}

function onMouseenter() {
  if (props.showType == 'hover') {
    isShowModule.value = true
  }
}

function onMouseleave() {
  isShowModule.value = false
}

function toggleClick() {
  if (props.showType == 'click') {
    isShowModule.value = true
  }
}
</script>

<style scoped>
.hoverdown-toggle {
  cursor: pointer;
  z-index: 10;
}
.hoverdown-menu {
  display: none;
  left: 12px;
  top: 12px;
  z-index: 5;
}
.hoverdown-help {
  left: 0;
  bottom: 0;
}
.hoverdown-help-button {
  top: 6px;
  right: 4px;
  cursor: pointer;
  z-index: 40;
}
.hoverdown-open .hoverdown-toggle {
  z-index: 20;
}
.hoverdown-open .hoverdown-menu {
  display: block;
  z-index: 15;
}
</style>
