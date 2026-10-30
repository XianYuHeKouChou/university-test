<template>
  <div class="h-[60px] flex justify-center items-center px-8">
    <img src="/element-plus-logo.svg" alt="Element logo" class="w-auto">
  </div>
  <el-menu :router="true" :collapse="appStore.asideIsCollapse"  class="w-[200px]">
    <template v-for="group in menuTree" :key="group.key">
      <!-- 单页顶级菜单 -->
      <el-menu-item v-if="group.single" :index="group.single.path">
        <el-icon>
          <img v-if="group.single.icon" :src="group.single.icon" alt="">
        </el-icon>
        <span>{{ group.name }}</span>
      </el-menu-item>
      <!-- 有子项的分组 -->
      <el-sub-menu v-else :index="`group-${group.key}`">
        <template #title>
          <el-icon>
            <img v-if="group.icon" :src="group.icon" alt="">
          </el-icon>
          <span>{{ group.name }}</span>
        </template>
        <template v-for="child in group.children"
                  :key="child.type === 'child-group' ? child._key : child.path">
          <el-sub-menu v-if="child.type === 'child-group'"
                       :index="`child-${group.key}-${child.key}`">
            <template #title>
              <el-icon>
                <img v-if="child.icon" :src="child.icon" alt="">
              </el-icon>
              <span>{{ child.name }}</span>
            </template>
            <el-menu-item v-for="item in child.items" :key="item.path" :index="item.path">
              <el-icon>
                <img v-if="item.icon" :src="item.icon" alt="">
              </el-icon>
              <span>{{ item.title }}</span>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :index="child.path">
            <el-icon>
              <img v-if="child.icon" :src="child.icon" alt="">
            </el-icon>
            <span>{{ child.title }}</span>
          </el-menu-item>
        </template>
      </el-sub-menu>
    </template>
  </el-menu>
</template>

<script setup lang="ts">
/**
 *  AsideMenu.vue
 *  1. 自动搜索 views 目录和中间目录下的 page.ts 文件，组装侧边栏菜单架构
 *  2. 根据page.ts 文件内的配置设置菜单项
 *
 *  目录结构说明：支持如下两种目录模式：
 * - views/
 *  - page1/
 *   - page.ts         // 侧边栏菜单配置
 *   - IndexPage.vue         // 页面组件
 *
 *  或者：
 *  - views/
 *   - pageGroup/
 *    - sideConfig.ts         // 侧边栏菜单配置
 *    - page1/
 *     - page.ts         // 侧边栏菜单配置
 *     - IndexPage.vue         // 页面组件
 *
 */
import {ElMenu, ElMenuItem, ElSubMenu, ElIcon} from 'element-plus'
import {computed} from 'vue'
import type {pageConfig} from '@/views/pageConfig.ts'
import type {pageConfig as asideConfig} from '@/views/asideConfig.ts'
import type {PermissionValue} from '@/config/permission/index.ts'
import {useAppStore} from '@/stores/counter.ts'

const appStore = useAppStore()

interface MenuItem {
  type: 'item'
  title: string
  path: string
  icon?: string
}

interface ChildGroup {
  type: 'child-group'
  key: string
  name: string
  icon?: string
  items: MenuItem[]
  _key: string
}

interface MenuGroup {
  key: string
  name: string
  icon?: string
  single?: MenuItem
  children?: (MenuItem | ChildGroup)[]
}

const pages = import.meta.glob<pageConfig>('../views/**/page.ts', {
  eager: true,
  import: 'default'
})
const sideConfigs = import.meta.glob<asideConfig>('../views/**/sideConfig.ts', {
  eager: true,
  import: 'default'
})

const hasAccess = (roles: readonly PermissionValue[] | undefined): boolean => {
  return Array.isArray(roles) && roles.includes(appStore.currentUserRole)
}

const getRoutePath = (pagePath: string): string => {
  return pagePath.replace('../views', '').replace(/\/page\.ts$/, '') || '/'
}

const getDirectory = (filePath: string): string => filePath.replace(/\/[^/]+$/, '')

const getGroupConfig = (directory: string): { config: asideConfig, key: string } | undefined => {
  let current = directory
  while (current.startsWith('../views')) {
    const config = sideConfigs[`${current}/sideConfig.ts`]
    if (config) return {config, key: current.replace('../views/', '')}
    const parent = getDirectory(current)
    if (parent === current) break
    current = parent
  }
  return undefined
}

const buildMenuTree = (): MenuGroup[] => {
  const groups = new Map<string, MenuGroup>()

  Object.entries(pages).forEach(([pagePath, module]) => {
    const page = module
    if (!page || !page.showInSide || !hasAccess(page.roles)) return

    const path = getRoutePath(pagePath)
    const directory = getDirectory(pagePath)
    const groupEntry = getGroupConfig(directory)
    const item: MenuItem = {type: 'item', title: page.title, path, icon: page.sideIcon}

    if (!groupEntry) {
      groups.set(path, {key: path, name: page.title, single: item})
      return
    }

    const {config: groupConfig, key: groupKey} = groupEntry
    if (!hasAccess(groupConfig.roles)) return
    const group = groups.get(groupKey) ?? {
      key: groupKey,
      name: groupConfig.groupName,
      icon: groupConfig.sideIcon,
      children: []
    }
    if (!group.children) group.children = []

    const directoryParts = directory.replace('../views/', '').split('/')
    const groupParts = groupKey.split('/').filter(Boolean)
    const isNested = directoryParts.length > groupParts.length + 1
    if (isNested) {
      const childKey = directory.replace('../views/', '')
      let child = group.children.find((entry): entry is ChildGroup =>
        'type' in entry && entry.type === 'child-group' && entry.key === childKey
      )
      if (!child) {
        child = {
          type: 'child-group',
          key: childKey,
          name: directory.split('/').pop() ?? childKey,
          items: [],
          _key: `${groupKey}-${childKey}`
        }
        group.children.push(child)
      }
      child.items.push(item)
    } else {
      group.children.push(item)
    }
    groups.set(groupKey, group)
  })

  return [...groups.values()].filter(group => group.single || group.children?.length)
}

const menuTree = computed(() => buildMenuTree())
</script>

<style scoped>
</style>
