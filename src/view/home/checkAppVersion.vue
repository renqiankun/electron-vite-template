<template>
  <el-dialog v-model="dialogVisible" title="提示" width="30%" center>
    <div>打两个不同版本测试，并检查版本地址的指向新版本目录</div>
    <div>当前版本{{ pkg.version }}</div>
    <el-button @click="checkHand">检查</el-button>
    <el-button :disabled="!hasNewVersion" @click="download">下载</el-button>
    <el-button :disabled="!hasDownload" @click="setup">安装</el-button>
    <div>下载进度{{ downloadPercent }}</div>
    <template #footer>
      <el-button @click="closeHand">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import pkg from '../../../package.json'
  /**
   * app升级状态  auto-update
   */
  enum UPDATE_CODE {
    error = -1,
    checking = 0,
    updateAvaible = 1,
    updateNotAvaible = 2,
    downloadProgress = 3,
    updateDownloaded = 4
  }

  let dialogVisible = ref(false)
  const update = window.electronAPI.update
  let hasNewVersion = ref(false)
  let downloadPercent = ref(0)
  // 下载完成
  let hasDownload = ref(false)
  // 监听更新状态
  update.onUpdateMsg(({code, data}) => {
    console.log(code, data)
    if (code === UPDATE_CODE.updateAvaible) {
      hasNewVersion.value = true
    }
    if (code === UPDATE_CODE.downloadProgress) {
      downloadPercent.value = data.transferred  / data.total * 100
    }
    if (code === UPDATE_CODE.updateDownloaded) {
      hasDownload.value = true
    }
  })

  const init = async () => {
    dialogVisible.value = true
  }

  /**
   * 检查新版本
   */
  const checkHand = async () => {
    await update.setUrl('http://127.0.0.1:5500/')
    update.checkUpdate()
  }

  const download = () => {
    update.startDownload()
  }

  //install
  const setup = () => {
    update.quitAndInstall()
  }
  const closeHand = () => {
    dialogVisible.value = false
  }
  defineExpose({
    init
  })
</script>

<style lang="scss" scoped></style>
