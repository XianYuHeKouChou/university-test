/**
 *  sideConfig.ts说明：
 *  export default {
 *   groupName: '登录',       // 侧边栏分组名称
 *   sideIcon: 'iconPath',    // 侧边栏图标，传入图标路径
 *   roles: typeof PERMISSION_VALUES[number][]    // 可访问角色列表，详细见权限配置/src/config/permission/index.ts
 */
import type {PERMISSION_VALUES} from '@/config/permission/index.ts'

export interface pageConfig {
  groupName: string
  sideIcon: string
  roles: typeof PERMISSION_VALUES[number][]
}
