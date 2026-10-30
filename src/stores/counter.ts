import {defineStore} from 'pinia'
import {ref} from 'vue'
import tools from "@/utils/tools/index.ts";
import {
  type PermissionValue,
  USER_PERMISSIONS_KEY,
  PERMISSION_VALUES,
  DEFAULT_ROLE
} from '@/config/permission/index.ts'

export const useAppStore = defineStore('counter', () => {
  const currentUserRole = ref<PermissionValue>(getPermission())
  const systemTheme = ref<string | null>(null)
  const headerIconColor = ref('#ffffff')
  const mediaChange = ref<(() => void) | null>(null)
  const asideIsCollapse = ref(false)

  /**
   * 设置当前用户角色
   * @param {PermissionValue} role 权限值
   */
  function setPermission(role: PermissionValue) {
    currentUserRole.value = role
    tools.setLocalStorage(USER_PERMISSIONS_KEY, role)
  }

  /**
   * 获取当前用户角色
   * @returns {PermissionValue} 权限值
   */
  function getPermission(): PermissionValue {
    const role = tools.getLocalStorage(USER_PERMISSIONS_KEY) as PermissionValue
    return PERMISSION_VALUES.includes(role) ? role : DEFAULT_ROLE
  }

  /**
   * 获取当前颜色模式
   */
  function getSystemTheme() {
    const value = tools.getLocalStorage('systemTheme')
    if (typeof value === 'string') {
      systemTheme.value = value
    }
    if (value === null || value === undefined) {
      systemTheme.value = 'system'
      tools.setLocalStorage('systemTheme', systemTheme.value)
    }
    changeSystemTheme()
    systemThemeListener()
  }

  /**
   * 系统主题监听
   */
  function systemThemeListener() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    if (systemTheme.value === 'system') {
      mediaChange.value = () => changeSystemTheme()
      mediaQuery.addEventListener('change', mediaChange.value)
    } else if (mediaChange.value) {
      mediaQuery.removeEventListener('change', mediaChange.value)
    }
  }

  /**
   * 修改颜色模式
   */
  function changeSystemTheme() {
    if (systemTheme.value === 'dark') {
      document.documentElement.classList.add('dark')
      headerIconColor.value = '#ffffff'
    }
    if (systemTheme.value === 'light') {
      document.documentElement.classList.remove('dark')
      headerIconColor.value = '#505050'
    }
    if (systemTheme.value === 'system') {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark')
        headerIconColor.value = '#ffffff'
      } else {
        document.documentElement.classList.remove('dark')
        headerIconColor.value = '#505050'
      }
    }
  }

  /**
   * 给外部的切换颜色模式
   * @param value {string} 要切换的颜色模式
   */
  function changeDarkMode(value: 'system' | 'dark' | 'light') {
    systemTheme.value = value
    tools.setLocalStorage('systemTheme', value)
    changeSystemTheme()
    systemThemeListener()
  }

  return {
    setPermission,
    getPermission,
    currentUserRole,
    systemTheme,
    headerIconColor,
    mediaChange,
    asideIsCollapse,
    getSystemTheme,
    changeDarkMode,
  }
})
