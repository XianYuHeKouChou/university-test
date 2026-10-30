/**
 * 路由配置
 * 1. 自动导入 views 目录下的 page.ts 和 IndexPage.vue 组件
 * 2. 根据 page.ts 中的元数据组装路由
 * 3. 提供 applyUserRoutes 方法，根据用户角色动态添加路由
 * 4. 全局守卫处理未登录访问控制和未知路径重定向
 *
 * 目录结构说明：
 * - views/
 *  - somePage/
 *  -   page.ts         // 路由元数据
 *  -   IndexPage.vue         // 页面组件
 */
import {createRouter, createWebHistory, type RouteRecordRaw, type RouteMeta} from 'vue-router'
import type {Component} from 'vue'
import {DEFAULT_ROLE, PERMISSION_VALUES, type PermissionValue} from '@/config/permission/index.ts'
import {type pageConfig} from '@/views/pageConfig.ts'
import {pinia} from '@/stores'
import {useAppStore} from "@/stores/counter.ts"
// 没有这个类型声明文件给你装哦
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

declare module 'vue-router' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface RouteMeta extends pageConfig {
  }
}

/**
 * 判断当前用户是否有权限访问路由
 * @param {typeof PERMISSION_VALUES[number][] | undefined} metaRoles 路由元数据中的角色列表
 * @param {PermissionValue} role 当前用户角色
 * @returns {boolean} 如果用户有权限访问路由，则返回 true，否则返回 false
 */
function hasAccess(metaRoles: typeof PERMISSION_VALUES[number][] | undefined, role: PermissionValue): boolean {
  if (!Array.isArray(metaRoles)) return false
  return metaRoles.includes(role)
}

// 自动导入
const pages = import.meta.glob<RouteMeta>('../views/**/page.ts', {eager: true, import: 'default'})
const components = import.meta.glob<Component>('../views/**/IndexPage.vue', {
  eager: true,
  import: 'default'
})

// 组装全部路由
const allRoutes: RouteRecordRaw[] = Object.entries(pages)
  .map(([path, meta]): RouteRecordRaw | null => {
    const componentPath = path.replace(/page\.ts$/, 'IndexPage.vue')
    const routePath = path.replace('../views', '').replace(/\/page\.ts$/, '') || '/'
    const name = routePath.split('/').filter(Boolean).join('-')
    const component = components[componentPath]
    if (!component) return null
    return {path: routePath, name, component, meta: meta} satisfies RouteRecordRaw
  }).filter((route): route is RouteRecordRaw => route !== null)

// 路由实例
const router = createRouter({
  history: createWebHistory(),
  routes: []
})

// 初始化路由
applyUserRoutes()

// 全局守卫
router.beforeEach((to) => {
  NProgress.start();
  const role = useAppStore(pinia).getPermission()
  // 访问根路径时，重定向到当前用户角色可访问的第一个路由，未认证用户重定向到登录
  if (to.path === '/' && role !== DEFAULT_ROLE) {
    const firstRoute = allRoutes.find(route => hasAccess(route.meta?.roles, role))
    if (firstRoute) {
      return {path: firstRoute.path}
    }
  }
  if (to.path === '/' && role === DEFAULT_ROLE) {
    return {path: '/login'}
  }
  // 访问当前用户角色可访问的路由时，直接放行
  if (typeof to.name === 'string' && router.hasRoute(to.name)) {
    return true
  }
  // 访问当前用户不可访问的路由或未知路由时，重定向到 404 页面或首页
  if (!hasAccess(to.meta.roles, role)) {
    return {name: 'errPages-404'}
  }
})
router.afterEach((to) => {
  NProgress.done();
  if (typeof to.meta.title === 'string') {
    document.title = to.meta.title
  }
})

export default router

/**
 * 根据当前用户角色动态添加路由
 * 1. 移除已注册的所有路由
 * 2. 添加当前用户角色可访问的路由
 */
export function applyUserRoutes() {
  const role = useAppStore(pinia).getPermission()
  // 1. 移除已注册的所有路由
  router.getRoutes().forEach(route => {
    if (route.name && router.hasRoute(route.name)) {
      router.removeRoute(route.name)
    }
  })
  // 2. 添加当前用户角色可访问的路由
  const userRoutes = allRoutes.filter(route => hasAccess(route.meta?.roles, role))
  userRoutes.forEach(route => {
    router.addRoute(route)
  })
}
