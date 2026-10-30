<template>
  <el-menu mode="horizontal" :ellipsis="false">
    <div
      class="w-full h-full flex justify-between items-center px-12 transition-all duration-500">
      <div class="h-full flex items-center"
           @click="appStore.asideIsCollapse = !appStore.asideIsCollapse">
        <img src="/image/logo.jpg" alt="logo" class="h-3/4 rounded-full"/>
      </div>
      <div class="flex">
        <el-dropdown placement="top-start">
          <el-icon :size="24" :color="appStore.headerIconColor">
            <LightIcon v-if="appStore.systemTheme === 'light'"/>
            <DarkIcon v-if="appStore.systemTheme === 'dark'"/>
            <SystemIcon v-if="appStore.systemTheme === 'system'"/>
          </el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="appStore.changeDarkMode('light')">
                <div class="flex items-center">
                  <el-icon :size="20" :color="appStore.headerIconColor">
                    <LightIcon/>
                  </el-icon>
                  <el-text class="ml-2">亮色模式</el-text>
                </div>
              </el-dropdown-item>
              <el-dropdown-item @click="appStore.changeDarkMode('dark')">
                <div class="flex items-center">
                  <el-icon :size="20" :color="appStore.headerIconColor">
                    <DarkIcon/>
                  </el-icon>
                  <el-text class="ml-2">暗色模式</el-text>
                </div>
              </el-dropdown-item>
              <el-dropdown-item @click="appStore.changeDarkMode('system')">
                <div class="flex items-center">
                  <el-icon :size="20" :color="appStore.headerIconColor">
                    <SystemIcon/>
                  </el-icon>
                  <el-text class="ml-2">跟随系统</el-text>
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </el-menu>
</template>

<script setup lang="ts">
import {ElMenu, ElIcon, ElDropdown, ElDropdownMenu, ElDropdownItem, ElText} from 'element-plus';
import LightIcon from '@/components/LightIcon.vue';
import DarkIcon from '@/components/DarkIcon.vue';
import SystemIcon from '@/components/SystemIcon.vue';
import {onMounted} from 'vue'
import {useAppStore} from '@/stores/counter.ts'

const appStore = useAppStore()
onMounted(() => {
  appStore.getSystemTheme()
})
</script>

<style scoped>
</style>
