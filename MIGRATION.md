# 前端技术栈与迁移说明

本文档记录当前项目的技术栈、迁移内容、启动方式和后续维护注意事项，供后续开发任务使用。

## 当前技术栈

| 用途 | 技术 | 当前锁定版本 |
| --- | --- | --- |
| 前端框架 | Vue | 3.5.41 |
| 构建和开发服务器 | Vite | 7.3.6 |
| Vue 单文件组件插件 | @vitejs/plugin-vue | 6.0.8 |
| 路由 | Vue Router | 4.6.4 |
| 状态管理 | Vuex | 4.1.0 |
| UI 组件库 | Element Plus | 2.14.4 |
| HTTP 客户端 | Axios | 1.19.0 |
| CSS 预处理器 | Less | 4.9.0 |

实际安装版本以 `package-lock.json` 为准。项目仍使用 JavaScript 和 Vue Options API；Vue 3 继续支持该写法，因此无需一次性重写全部业务页面。

## 环境要求

- Node.js `>=20.19.0` 或 `>=22.12.0`
- npm（随受支持的 Node.js LTS 版本安装）
- 若需要完整业务数据，还需要启动对应的本地后端服务

当前前端会访问以下后端端口：

- `8101`：用户服务
- `8110`：用户关注服务
- `8201`：文章服务
- `8301`：圈子服务
- `8401`：评论服务

后端未启动时，前端本身仍能启动，但请求会在浏览器控制台显示网络错误，相关列表没有数据。

## 安装与启动

首次拉取代码或依赖发生变化后执行：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

为兼容旧的使用习惯，也可以执行：

```bash
npm run serve
```

终端会输出访问地址，默认通常为 `http://localhost:5173/`。

## 构建与预览

生产构建：

```bash
npm run build
```

构建文件生成在 `dist/`。本地预览生产构建：

```bash
npm run preview
```

## 本次迁移内容

- Vue `2.7` 升级到 Vue `3.5`。
- Vue CLI 5 / Webpack 构建迁移到 Vite 7。
- Vue Router 3 升级到 Vue Router 4，并继续使用 Hash 路由。
- Vuex 3 升级到兼容 Vue 3 的 Vuex 4，保留现有 `$store` 业务代码。
- Element UI 2 替换为 Element Plus 2。
- 移除 `vue-template-compiler`、`vue-axios`、`core-js`、`less-loader` 和 Vue CLI/Babel 插件。
- 应用入口从 `new Vue()` 改为 Vue 3 的 `createApp()`。
- 构建配置从 `vue.config.js` 和 `babel.config.js` 改为 `vite.config.js`。
- HTML 入口从 `public/index.html` 迁移为项目根目录的 `index.html`。
- 移除 Vue 2 事件总线；该总线只发送事件、没有有效监听者。
- 修复首页在后端没有返回圈子数据时访问空数组而崩溃的问题。

## 后续开发注意事项（执行状态）

- 新页面继续优先使用 Vue 3 Composition API 和 `<script setup>`；现有 Options API 页面保持渐进迁移策略。
- 已将有效的 Element Plus 插槽更新为 `#header`、`#footer`、`#append` 和 `#default` 语法。
- 已将对话框的 `:visible.sync` 更新为 `v-model`。
- 已从 `@element-plus/icons-vue` 导入管理页图标，移除有效代码中的 `el-icon-*` 写法。
- 已将后端地址集中到 `src/services/api.js`，可通过 `.env` 变量覆盖。
- 已启用 Element Plus 组件按需导入并配置 Rollup 分包，消除了超过 500 kB 的构建警告。
- `dist/` 仍是构建产物，不应手工修改。

详细执行记录见 [DEVELOPMENT_UPDATES.md](./DEVELOPMENT_UPDATES.md)。

## 已完成验证

- `npm install`：成功。
- `npm run build`：成功。
- `npm run dev -- --host 127.0.0.1 --port 4173`：成功启动。
- HTTP 访问 `http://127.0.0.1:4173/`：返回 200。
- 浏览器实际渲染：首页可见，后端不可用时显示空状态，不再因空数据崩溃。
