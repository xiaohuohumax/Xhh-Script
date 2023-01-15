<template>
  <ModuleCard v-if="isLoadModule()" :icon="vipConfig.icon" :show-type="baseConfig.showType">
    <template #help>
      <div class="fw-bold">
        <div>{{ vipConfig.name }}</div>
        <hr class="my-2" />
        <div class="small">
          <label class="form-label">功能:</label>
          <p class="small fw-normal">免费观看VIP视频资源</p>
          <label class="form-label">使用方法:</label>
          <ul class="small fw-normal">
            <li>进入视频网站的VIP播放页面</li>
            <li>选择解析接口点击跳转至解析网站,免费观看VIP资源</li>
            <li>自行选择满意的资源</li>
          </ul>
          <label class="form-label">添加其他接口:</label>
          <p class="small fw-normal">请编辑油猴脚本的API配置,接口格式注释都有说明,编辑完保存即可</p>
          <label class="form-label">其他:</label>
          <div class="small fw-normal">
            <p>可通过顶部筛选搜索框速搜索接口</p>
          </div>
        </div>
      </div>
    </template>
    <div style="width: 200px; height: 400px" class="d-flex flex-column">
      <input
        v-model="vipInput"
        type="text"
        class="form-control form-control-sm interval-col flex-shrink-0"
        placeholder="筛选接口"
      />
      <div class="interval-col flex-grow-1 overflow-y-auto">
        <div class="border-4 border-top rounded-0 mb-2 border-warning"></div>
        <button
          v-for="(item, index) in vipApi"
          :key="index"
          type="button"
          class="btn btn-outline-primary btn-sm w-100 text-start interval-col"
          :title="item.title"
          @click="vipGo(item.api)"
        >
          {{ item.name }}
        </button>
        <div v-if="vipApiBackup.length == 0">
          <button
            v-if="vipApi.length == 0"
            class="btn btn-outline-danger btn-sm w-100 interval-col"
          >
            没有接口~
          </button>
        </div>
        <div v-else>
          <button
            v-if="vipApi.length == 0"
            class="btn btn-outline-warning btn-sm w-100 interval-col"
          >
            没有找到~
          </button>
          <div v-else class="text-center fw-light small">到底啦~</div>
        </div>
      </div>
    </div>
  </ModuleCard>
</template>
<script setup>
import ModuleCard from '@/components/ModuleCard.vue'
import { getLocationUrl, openNewUrl } from '../utils/url'
import { baseConfigLoader } from '@/config/base.config'
import { vipConfigLoader, formatVipApi } from '@/config/vip.config'
import { onErrorCaptured, ref, watch } from 'vue'
import { isDev } from '@/utils/meta.env'
import { matchUrl } from '@/utils/url'
import logger from '@/utils/logger'

const vipConfig = vipConfigLoader.getConfig()
const baseConfig = baseConfigLoader.getConfig()

const vipApi = ref(formatVipApi(vipConfig.apis))
const vipApiBackup = ref(formatVipApi(vipConfig.apis))

const vipInput = ref('')
watch(
  () => vipInput.value,
  () => {
    let vipInputTrim = vipInput.value.trim()
    vipApi.value =
      vipInputTrim == ''
        ? vipApiBackup.value
        : vipApiBackup.value.filter(api => api.name.includes(vipInputTrim))
  },
)

function vipGo(api) {
  openNewUrl(api.replace(vipConfig.apiReplaceFlag, getLocationUrl()))
}

function isLoadModule() {
  if ((vipConfig.isUseVip && matchUrl(vipConfig.vipMatchRe)) || isDev) {
    logger.info('load module', vipConfig.name)
    return true
  } else {
    logger.warning('discard load module', vipConfig.name)
    return false
  }
}
</script>
