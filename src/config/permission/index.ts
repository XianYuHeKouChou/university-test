// 全局用户权限配置key
export const USER_PERMISSIONS_KEY = 'currentUserRole'
// 权限值列表
export const PERMISSION_VALUES = ['admin', 'unauthorized'] as const
// 所有权限列表
export const ALL_PERMISSIONS: readonly Permission[] = [
  {label: '管理员', value: 'admin'},
  {label: '未授权', value: 'unauthorized'}
]
// 默认权限
export const DEFAULT_ROLE: PermissionValue = 'unauthorized'

// 权限值类型
export type PermissionValue = (typeof PERMISSION_VALUES)[number]

// 权限类型
export interface Permission {
  label: string
  value: PermissionValue
}
