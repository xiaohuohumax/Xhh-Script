<template>
  <ModuleCard v-if="isLoadModule()" :icon="panConfig.icon" :show-type="baseConfig.showType">
    <template #help>
      <div class="fw-bold">
        <div>{{ panConfig.name }}</div>
        <hr class="my-2" />
        <div class="small">
          <label class="form-label">功能:</label>
          <p class="small fw-normal">搜索网盘资源</p>
          <label class="form-label">使用方法:</label>
          <ul class="small fw-normal">
            <li>选择网盘资源接口</li>
            <li>输入需要搜索资源名称</li>
            <li>回车搜索即可</li>
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
      <div class="interval-col flex-shrink-0">
        <div class="interval-col">
          <input
            v-model="panSearchInput"
            type="text"
            class="form-control form-control-sm interval-col"
            :placeholder="panInputPlaceholder"
            @keydown.enter="panGo()"
          />
          <div class="text-danger small px-1">{{ tipErrorMsg }}</div>
        </div>
        <input
          v-model="panInput"
          type="text"
          class="form-control form-control-sm interval-col"
          placeholder="筛选接口"
        />
      </div>
      <div class="interval-col flex-grow-1 overflow-y-auto">
        <div class="border-4 border-top rounded-0 mb-2 border-success"></div>
        <button
          v-for="(item, index) in panApi"
          :key="index"
          type="button"
          class="btn btn-sm w-100 text-start interval-col"
          :class="item == chooseApi ? 'btn-warning' : 'btn-outline-primary'"
          :title="item.title"
          @click="panChoose(item)"
        >
          {{ item.name }}
        </button>
        <div v-if="panApiBackup.length == 0">
          <button
            v-if="panApi.length == 0"
            class="btn btn-outline-danger btn-sm w-100 interval-col"
          >
            没有接口~
          </button>
        </div>
        <div v-else>
          <button
            v-if="panApi.length == 0"
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
import { baseConfigLoader } from '@/config/base.config'
import { panConfigLoader, formatPanApi } from '@/config/pan.config'
import { openNewUrl } from '@/utils/url'
import { isDev } from '@/utils/meta.env'
import { matchUrl } from '@/utils/url'
import { ref, watch } from 'vue'
import logger from '@/utils/logger'

const panConfig = panConfigLoader.getConfig()
const baseConfig = baseConfigLoader.getConfig()

const panApi = ref(formatPanApi(panConfig.apis))
const panApiBackup = ref(formatPanApi(panConfig.apis))

const panInput = ref('')
const panSearchInput = ref('')
const panInputPlaceholder = ref('请选择接口')
const tipErrorMsg = ref('')

watch(
  () => panInput.value,
  () => {
    let panInputTrim = panInput.value.trim()
    panApi.value =
      panInputTrim == ''
        ? panApiBackup.value
        : panApiBackup.value.filter(api => api.name.includes(panInputTrim))
  },
)

watch(
  () => panSearchInput.value,
  () => checkSearchInput(),
)

const chooseApi = ref()
function panChoose(api) {
  chooseApi.value = api
  panInputPlaceholder.value = `回车搜索-${api.name}`
  tipErrorMsg.value = ''
}

function checkSearchInput() {
  let panSearchInputTrim = panSearchInput.value.trim()

  if (chooseApi.value == undefined) {
    tipErrorMsg.value = '请先选择接口'
    return false
  }

  if (panSearchInputTrim == '') {
    tipErrorMsg.value = '请输入搜索内容'
    return false
  }
  tipErrorMsg.value = ''
  return true
}

function panGo() {
  if (!checkSearchInput()) {
    return
  }
  openNewUrl(chooseApi.value.api.replace(panConfig.apiReplaceFlag, panSearchInput.value.trim()))
}

function isLoadModule() {
  if ((panConfig.isUsePan && matchUrl(panConfig.panMatchRe)) || isDev) {
    logger.info('load module', panConfig.name)
    return true
  } else {
    logger.warning('discard load module', panConfig.name)
    return false
  }
}
</script>
