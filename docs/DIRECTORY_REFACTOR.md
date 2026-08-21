# 项目目录结构重构记录

记录日期：2026-08-18

## 重构目标

- 路由页面按业务域组织，不再全部堆放在 `views`。
- 布局页面、完整路由页面和可复用组件职责分离。
- 合并重复小页面，拆分职责过多的大页面。
- 使用含义明确且大小写统一的文件名。
- 保持现有 URL 和主要业务行为不变。

## 当前目录结构

```text
src/
├─ assets/styles/global.css
├─ components/
│  ├─ admin/
│  │  ├─ AdminSidebar.vue
│  │  ├─ AdminUserCreateDialog.vue
│  │  └─ AdminUserEditDialog.vue
│  └─ common/EntityHomePanel.vue
├─ pages/
│  ├─ admin/       # 管理布局、首页、用户、圈子和文章管理
│  ├─ articles/    # 文章详情
│  ├─ auth/        # 登录和注册
│  ├─ circles/     # 圈子布局和圈子文章
│  ├─ home/        # 站点首页
│  ├─ profile/     # 用户主页布局及其子页面
│  └─ search/      # 搜索布局及各类搜索结果
├─ router/index.js
├─ services/api.js
├─ store/index.js
├─ App.vue
└─ main.js
```

## 页面合并

原 `views/circle/home.vue` 和 `views/userspage/home.vue` 内容完全相同，已合并为 `components/common/EntityHomePanel.vue`。圈子主页、我的主页和他人主页的默认子路由共同复用该组件。

## 页面拆分

原 `userList.vue` 同时承担列表、创建表单、编辑表单、校验和接口请求，超过 330 行。现在拆分为：

- `AdminUsersPage.vue`：列表、分页和业务请求协调。
- `AdminUserCreateDialog.vue`：创建表单、字段校验和提交事件。
- `AdminUserEditDialog.vue`：编辑表单和保存事件。

两个对话框使用 Vue 3 `<script setup>`、`defineProps` 和 `defineEmits`。

## 命名规则

- 可直接匹配路由的文件使用 `*Page.vue`。
- 包含 `<router-view>` 的父级页面使用 `*Layout.vue`。
- 可复用 UI 放在 `components`，按业务域继续分层。
- 修复 `articledetial.vue` 为 `ArticleDetailPage.vue`。
- 修复 `gobal.css` 并移动为 `assets/styles/global.css`。

## 删除内容

- `HelloWorld.vue`：未使用的 Vue CLI 示例。
- `AboutView.vue` 与 `/about`：无业务功能的占位页和路由。
- 两个重复的 `home.vue`：由公共组件取代。
- `style/mixin.less`：没有任何引用。

未使用的旧空目录不会被 Git 保存。遗留图片 `assets/logo.png` 暂时保留为二进制资源，后续确认不需要时可以直接删除。

## 路由兼容性

组件引用已更新为 `@/pages/...` 和 `@/components/...`。以下已有路径保持不变：

- `/`
- `/Login`、`/Register`
- `/circle/:id`
- `/myhome/:id`
- `/userhome/:id`
- `/articledetail/:aid`
- `/search/*`
- `/Manage`、`/userList`、`/adminList`、`/articleList`

## 验证

```bash
npm run build
npm run dev -- --host 127.0.0.1 --port 4175 --strictPort
```

- Vite 生产构建成功，转换 1779 个模块。
- 所有同步和异步路由组件均成功解析。
- 开发服务器在 `http://127.0.0.1:4175/` 成功启动。
- 首页 HTTP 请求返回 200。
