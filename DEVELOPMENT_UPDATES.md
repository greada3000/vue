# 后续开发注意事项执行记录

记录日期：2026-08-18

本轮修改依据 `MIGRATION.md` 中的“后续开发注意事项”执行。

## 修改内容

### Vue 3 与 Element Plus 模板兼容

- 将表格作用域插槽 `slot-scope="scope"` 替换为 `#default="scope"`。
- 将卡片和输入框插槽替换为 `#header`、`#footer`、`#append`。
- 将对话框的 `:visible.sync` 替换为 Vue 3 的 `v-model`。
- 将 `el-submenu` 更新为 Element Plus 的 `el-sub-menu`。
- 删除残留的 Vue 2 插槽示例代码。

### 图标升级

- 增加直接依赖 `@element-plus/icons-vue`。
- 在应用入口注册 `SearchIcon`、`EditIcon` 和 `DeleteIcon`。
- 管理页操作按钮改用 Element Plus SVG 图标组件。
- 面包屑不再使用 Element UI 的 `el-icon-arrow-right` 类名。

### API 地址集中配置

- 新增 `src/services/api.js`，统一生成用户、关注、文章、圈子和评论服务地址。
- 页面请求通过 `$api.user()`、`$api.relation()`、`$api.article()`、`$api.circle()` 和 `$api.review()` 获取地址。
- 新增 `.env.example`，包含以下变量：
  - `VITE_API_BASE_URL`
  - `VITE_USER_API_URL`
  - `VITE_RELATION_API_URL`
  - `VITE_ARTICLE_API_URL`
  - `VITE_CIRCLE_API_URL`
  - `VITE_REVIEW_API_URL`
- 未设置环境变量时，继续使用原有 localhost 端口，保持本地开发兼容性。

如需自定义后端地址：

```bash
Copy-Item .env.example .env.local
```

然后修改 `.env.local` 并重新启动开发服务器。

### 构建体积优化

- 增加 `unplugin-vue-components`。
- 通过 `ElementPlusResolver` 自动按需导入 Element Plus 组件和样式。
- 移除全量 `app.use(ElementPlus)` 和全量 Element Plus CSS 导入。
- Vue、Axios 等公共依赖使用 Rollup `manualChunks` 分包。
- 最大 JavaScript 分包从约 905 kB 降至约 310 kB，构建不再出现超过 500 kB 的警告。

### 渐进式 Composition API 策略

- 本轮没有批量重写现有 Options API 页面，以避免改变已存在的表单、路由和状态管理行为。
- 新增的配置模块采用独立 ES Module 写法。
- 后续新增页面应优先采用 `<script setup>`；旧页面在发生业务修改时再逐个迁移。

## 验证结果

执行命令：

```bash
npm install
npm run build
```

验证结果：

- 依赖安装成功。
- Vite 生产构建成功，共转换 1777 个模块。
- 最大 JavaScript 分包约 310 kB。
- 有效源代码中不再包含 `slot-scope`、`:visible.sync`、`el-icon-*` 或硬编码的微服务地址。
- `dist/` 仅由构建命令生成，没有手工修改。
