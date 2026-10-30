import {createApp} from 'vue'
import App from './App.vue'

const app = createApp(App)

// 引入全局状态管理器pinia（必须先于路由安装同一实例）
import {pinia} from '@/stores/index.ts'

app.use(pinia)

// 引入路由
import router from './router'

app.use(router)

// 引入Element Plus styles
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

// 引入Tailwind CSS
import './assets/tailwind.css'

app.mount('#app')
