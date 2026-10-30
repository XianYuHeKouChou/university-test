import {createPinia} from 'pinia'

// 单独创建 pinia 实例并导出，供路由等模块在 app.use 之前使用
export const pinia = createPinia()
