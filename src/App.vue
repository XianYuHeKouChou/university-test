<template>
  <el-container class="h-screen">
    <el-aside v-show="!isFullscreen" style="width: auto">
      <aside-menu/>
    </el-aside>
    <el-container>
      <el-header v-show="!isFullscreen" style="padding: 0">
        <my-header/>
      </el-header>
      <el-main style="padding: 0">
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import {ElContainer, ElAside, ElHeader, ElMain} from 'element-plus'
import {useRoute} from 'vue-router'
import AsideMenu from "@/components/AsideMenu.vue";
import MyHeader from "@/components/MyHeader.vue";

const route = useRoute()
const isFullscreen = computed(() => route.meta?.fullScreen === true)
</script>

<style scoped>
</style>
