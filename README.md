# university-test

一个基于 **Vue 3 + TypeScript + Vite** 的前后台分离后台管理前端模板，采用**约定式路由**与**约定式侧边栏**设计：在 `views` 目录下新建页面文件夹并放置配置文件，即可自动完成路由注册与菜单生成，无需手动修改路由表。

## ✨ 特性

- 📁 **约定式路由**：自动扫描 `views/**/page.ts` 路由元数据 + 同目录 `IndexPage.vue` 页面组件，自动组装路由
- 🔐 **动态权限路由**：基于角色的访问控制（RBAC），登录后按当前用户角色动态注册/移除路由（`applyUserRoutes`）
- 🧭 **约定式侧边栏**：自动扫描 `page.ts` / `sideConfig.ts` 生成多级菜单，支持分组与嵌套子分组
- 🌗 **主题切换**：亮色 / 暗色 / 跟随系统三种模式，偏好持久化到 localStorage
- 📊 **页面加载进度条**：基于 NProgress，随路由切换自动启停
- 🖥️ **全屏页面支持**：通过路由元数据 `fullScreen` 控制是否隐藏侧边栏与顶栏（如登录页、错误页）
- 🛡️ **内置错误页**：404 / 500 页面，未授权或未知路径自动重定向

## 🛠️ 技术栈

| 类别 | 技术 |
| --- | --- |
| 框架 | Vue 3（`<script setup>` + Composition API） |
| 构建 | Vite |
| 语言 | TypeScript |
| UI | Element Plus + Tailwind CSS v4 |
| 状态管理 | Pinia |
| 路由 | Vue Router |
| 进度条 | NProgress |
| 代码规范 | ESLint + Oxlint |

## 📂 目录结构

```
src/
├── assets/             # 静态资源（tailwind.css 等）
├── components/         # 全局组件（AsideMenu 侧边栏、MyHeader 顶栏、主题图标等）
├── config/
│   └── permission/     # 权限配置：角色列表、默认角色、localStorage key
├── router/             # 路由实例、自动注册逻辑、全局守卫
├── stores/             # Pinia 实例与应用级 store（角色、主题、折叠状态）
├── utils/tools/        # 工具函数（ElMessage/ElNotification 封装、localStorage 读写）
├── views/              # 页面目录（约定式）
│   ├── pageConfig.ts   # 页面元数据类型定义
│   ├── asideConfig.ts  # 侧边栏分组配置类型定义
│   ├── login/          # 登录页（全屏）
│   ├── errPages/       # 404 / 500 错误页
│   ├── OCS/            # OCS 文档（iframe 内嵌）
│   └── ScriptCat/      # ScriptCat 文档（iframe 内嵌）
├── App.vue             # 根布局（侧边栏 + 顶栏 + router-view）
└── main.ts             # 应用入口
```

## 📄 新增页面约定

### 1. 普通页面

在 `src/views/` 下新建目录，包含两个文件：

```
views/
└── myPage/
    ├── page.ts         # 路由 & 菜单元数据
    └── IndexPage.vue   # 页面组件
```

`page.ts` 示例：

```ts
import {type pageConfig} from "@/views/pageConfig.ts";

export default {
  title: '我的页面',        // 页面标题 & 侧边栏名称
  fullScreen: false,        // 是否全屏（隐藏侧边栏/顶栏）
  showInSide: true,         // 是否在侧边栏显示
  sideIcon: '/image/icon.png', // 侧边栏图标路径
  roles: ['admin']          // 可访问角色，见 src/config/permission
} satisfies pageConfig
```

保存后路由 `/myPage` 与侧边栏菜单项自动生成，无需改动任何其他文件。

### 2. 菜单分组

在中间目录放置 `sideConfig.ts`，其下所有页面会归入该分组：

```
views/
└── myGroup/
    ├── sideConfig.ts   # 分组配置
    ├── pageA/
    └── pageB/
```

`sideConfig.ts` 示例：

```ts
export default {
  groupName: '分组名称',
  sideIcon: '/image/icon.png',
  roles: ['admin']
}
```

支持再嵌套一层目录形成三级菜单。

## 🔐 权限模型

- 角色定义于 `src/config/permission/index.ts`：当前有 `admin`（管理员）与 `unauthorized`（未授权），默认角色为 `unauthorized`
- 每个页面通过 `page.ts` 的 `roles` 声明可访问角色
- 路由守卫行为：
  - 访问 `/`：已授权用户重定向到其可访问的第一个页面，未授权用户重定向到登录页
  - 访问无权/未知路径：重定向到 404 页
  - 登录成功后调用 `applyUserRoutes()` 重新注册路由

> ⚠️ 当前登录与权限均为纯前端实现（存于 localStorage），仅适用于模板/演示。接入真实后端时，登录校验与接口鉴权必须由服务端完成。

## 🚀 快速开始

环境要求：Node.js `^22.18.0 || >=24.12.0`，包管理器 pnpm。

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 类型检查 + 生产构建
pnpm build

# 代码检查与自动修复
pnpm lint
```

演示登录：任意输入（页面预填 `admin` / `123456`），点击登录即切换为 `admin` 角色并进入主界面。

## 📌 已知待办

- [ ] 登录接口对接（当前为前端模拟登录）与退出登录
- [ ] 侧边栏折叠时菜单宽度适配
- [ ] 全局错误处理跳转 500 页
