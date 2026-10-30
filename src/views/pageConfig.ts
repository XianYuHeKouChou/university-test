/**
 *  pages.ts说明：
 *  export default {
 *   title: '登录',         // 页面标题和侧边栏显示的名称
 *   fullScreen: true,          // 是否全屏显示（无边栏等）
 *   showInSide: false,         // 是否在侧边栏显示
 *   sideIcon: 'iconPath',          // 侧边栏图标，传入图标路径
 *   roles: typeof PERMISSION_VALUES[number][]          // 可访问角色列表，详细见权限配置/src/config/permission/index.ts
 */
import type {PERMISSION_VALUES} from '@/config/permission/index.ts'

export interface pageConfig {
  title: string
  fullScreen: boolean
  showInSide: boolean
  sideIcon: string
  roles: typeof PERMISSION_VALUES[number][]
}
