# 拾光社区前端优化实施与测试报告

> 日期：2026-08-21  
> 基线报告：`FRONTEND_PROJECT_EVALUATION.md`  
> 接口依据：`API_DOCUMENTATION.md` 与后端 OpenAPI 3.1 文档  
> 测试环境：前端 `http://localhost:4173`，后端 `http://localhost:8080`

## 1. 结果摘要

后端启动后，本次完成了真实 API 联调、可清理的完整 CRUD 回归、前端认证接入、路由权限保护、统一分页解析、开发代理、基础自动化测试以及图片性能优化。

核心结果：

- OpenAPI 可访问，共发现 20 个接口路径。
- 文档测试管理员 `10001 / 123456` 登录成功。
- 用户、圈子、文章分页结构确认统一为 `data.records/total/current/size/pages`。
- 临时用户串联完成用户修改、登录、建圈、发文、详情、评论、关注及删除清理，所有步骤通过。
- 前端首页和搜索页已确认展示真实后端数据，不再因跨域问题退回演示数据。
- 未登录访问 `/admin` 会跳转到 `/login?redirect=/admin`。
- 5 张主要图片从约 6.60 MB 降至约 0.28 MB，体积下降约 95.8%。
- 单元测试 4/4 通过，API 集成测试 2/2 通过，生产构建通过。

优化后的阶段性评分由 **6.7/10 提升至约 8.0/10**。该评分代表当前代码和验证成熟度，不代表已经满足所有生产环境要求。

## 2. 真实 API 发现

### 2.1 统一响应

真实响应除文档中的 `success/message/data/timestamp` 外，还包含：

```json
{
  "success": true,
  "code": "OK",
  "message": "success",
  "data": {},
  "traceId": "...",
  "timestamp": "2026-08-21T12:09:01Z"
}
```

`traceId` 对排查后端错误非常有价值，后续可以在统一错误组件中展示或上报。

### 2.2 分页结构

用户、圈子和文章的真实分页结构一致：

```json
{
  "records": [],
  "total": 3,
  "current": 1,
  "size": 10,
  "pages": 1
}
```

前端已新增 `normalizePage()` 统一解析，不再由各页面重复尝试 `data/records/content/items`。

### 2.3 认证方式

OpenAPI 声明全局认证方案为 HTTP Basic Authentication。真实验证表明：

- `/api/users/login` 只校验账号密码并返回用户资料；
- 登录接口不返回 Token，也不设置 Session Cookie；
- 创建、修改、删除和关注等受保护请求必须持续发送 Basic Authorization 请求头；
- 不带凭据修改用户时，后端返回 `UNAUTHORIZED` 和“需要有效的用户凭据”。

该行为此前未写入 `API_DOCUMENTATION.md`，本次已经补充认证与开发代理说明。

## 3. API 回归结果

### 3.1 只读与登录验证

| 测试项 | 结果 | 证据 |
|---|---|---|
| OpenAPI JSON | 通过 | OpenAPI 3.1.0，20 个路径 |
| 用户分页 | 通过 | 返回 10001、10002、10003 测试用户 |
| 圈子分页 | 通过 | 返回 1001、1002、1003 测试圈子 |
| 文章分页 | 通过 | 返回 3 篇 UUID 测试文章 |
| 管理员登录 | 通过 | 10001，`usertype=true` |
| 文章关键词搜索 | 通过 | `keyword=Vue` 返回“Vue 与后端 API 联调” |

### 3.2 可清理 CRUD 串联测试

临时测试标识：用户 ID `990821001`，圈子名、文章标题和评论均带 `Codex临时` 标识。

| 顺序 | 操作 | 结果 |
|---:|---|---|
| 1 | 创建临时用户 | 通过 |
| 2 | 使用 Basic Auth 修改用户资料 | 通过 |
| 3 | 临时用户登录 | 通过 |
| 4 | 创建临时圈子 | 通过，生成圈子 ID 1004 |
| 5 | 发布临时文章 | 通过，后端自动生成 UUID |
| 6 | 查询文章详情 | 通过 |
| 7 | 发表评论 | 通过，生成评论 ID 10004 |
| 8 | 查询文章评论列表 | 通过 |
| 9 | 关注用户 10002 | 通过 |
| 10 | 查询关注状态 | 通过，返回 true |
| 11 | 取消关注 | 通过 |
| 12 | 删除文章及评论 | 通过 |
| 13 | 删除临时圈子 | 通过 |
| 14 | 删除临时用户 | 通过 |
| 15 | 再次查询临时用户 | 返回 404，确认清理完成 |

测试没有保留临时数据库数据。

## 4. 已实施的优化

### 4.1 Basic Auth 接入

修改：`src/services/api.js`、`src/pages/auth/LoginPage.vue`、`src/store/index.js`。

- 登录成功后根据 `userId:password` 生成 Basic 凭据。
- Axios 请求拦截器为后续受保护请求添加 `Authorization`。
- 用户资料和 Basic 凭据只保存到 `sessionStorage`，关闭浏览器会话后失效。
- 登出会同时清除用户状态和 Basic 凭据。
- 避免继续使用原来的长期 `localStorage` 身份状态，减少“页面显示已登录但请求全部 401”的伪登录问题。

限制：Basic 凭据本质上包含可还原密码，生产环境必须使用 HTTPS。更理想的长期方案是后端改为短期访问 Token + HttpOnly Refresh Cookie，或完整服务端 Session。

### 4.2 路由权限守卫

修改：`src/router/index.js`、`src/main.js`、`src/App.vue`。

- `/profile/:id` 要求登录，并限制为当前用户自己的管理主页。
- `/admin` 要求登录且必须为管理员。
- 未登录访问受保护页面会跳到登录页，并携带 `redirect`。
- 登录完成后返回原目标地址。
- Store 在路由首次解析前恢复会话状态，避免刷新时被错误重定向。

客户端守卫只改善体验，真正的授权仍由后端负责。

### 4.3 统一 API 错误信息

修改：`src/services/api.js`。

- Axios 响应拦截器统一提取后端 `message`。
- 401 显示“登录状态已失效，请重新登录”。
- 403 显示“没有权限执行此操作”。
- 网络错误具有统一回退提示。
- 登录页开始使用标准化后的 `error.userMessage`。

仍有部分旧页面保留空 `catch` 或没有 loading/error UI，见“剩余工作”。

### 4.4 统一分页解析

新增：`src/services/response.js`。

已接入：

- 首页文章和圈子；
- 三类搜索结果；
- 后台用户、圈子和文章；
- 用户文章和圈子文章。

统一输出：

```js
{ items, total, page, size, pages }
```

兼容真实 `records` 结构，也保留对数组和旧 `content/items/data` 响应的过渡兼容。

### 4.5 开发环境同源 API 代理

修改：`vite.config.js`、`src/services/api.js`。

问题表现：命令行访问后端正常，但浏览器首页仍使用 fallback 数据，原因是浏览器跨域请求失败且页面静默吞错。

处理方式：

- 浏览器默认请求同源 `/api`；
- Vite 将 `/api` 转发到 `http://localhost:8080`；
- 生产环境可设置 `VITE_API_BASE_URL`，或使用部署网关反向代理；
- 浏览器回归确认首页已展示真实文章与圈子数据。

### 4.6 图片性能优化

新增 5 个 WebP 文件，并更新首页、文章详情和认证页引用。

| 图片 | PNG | WebP | 降幅 |
|---|---:|---:|---:|
| bookstore-feature | 2,299 KB | 105 KB | 95.4% |
| coastal-train | 1,845 KB | 98 KB | 94.7% |
| journal-notes | 1,919 KB | 55 KB | 97.1% |
| summer-drink | 358 KB | 11 KB | 96.9% |
| community-note | 335 KB | 17 KB | 94.9% |
| 合计 | 6,756 KB | 286 KB | 95.8% |

生产构建已经只输出 WebP 版本。原 PNG 暂时保留在源码中，便于回退和重新编码；如果仓库体积也需要优化，可在确认视觉质量后删除原 PNG。

### 4.7 安全与代码质量修正

- 搜索和后台文章列表不再使用 `v-html` 渲染接口内容，降低存储型 XSS 风险。
- 管理员创建用户成功后会刷新列表。
- 圈子列表只在 `success=true` 时更新。
- 清理运行时调试输出。
- 用户搜索错误提示已修正。
- `API_DOCUMENTATION.md` 补充真实 Basic Auth 与代理说明。

## 5. 新增测试基础设施

### 5.1 单元测试

命令：

```bash
npm test
```

采用 Node 内置测试运行器，无需新增第三方依赖。

| 用例 | 结果 |
|---|---|
| 旧分页字段转换为 `keyword/page/size` | 通过 |
| 字符串关键词转换 | 通过 |
| `records` 分页标准化 | 通过 |
| 普通数组列表兼容 | 通过 |

结果：**4 passed，0 failed**。

### 5.2 API 集成测试

命令：

```bash
npm run test:api
```

可通过 `API_BASE_URL` 覆盖后端地址。

| 用例 | 结果 |
|---|---|
| OpenAPI 与三类分页资源 | 通过 |
| 测试管理员登录 | 通过 |

结果：**2 passed，0 failed**。

集成测试默认只读取测试数据和执行登录，不创建或删除数据库数据，适合重复运行。完整 CRUD 清理测试本次通过脚本人工执行，后续可独立固化为受控测试套件。

## 6. 浏览器回归结果

| 场景 | 结果 |
|---|---|
| 首页加载真实文章 | 通过，显示校园技术社团、Vue 联调、Spring Boot 文章 |
| 首页加载真实圈子 | 通过，显示 Java、前端、校园圈子 |
| 关键词 `Vue` 搜索 | 通过，显示真实后端文章 |
| WebP 图片加载 | 通过，首页检测到 11 个 WebP 图片实例 |
| 首页横向溢出 | 无 |
| 未登录访问 `/admin` | 正确跳转登录页并保留 redirect |
| 控制台错误/警告 | 无 |

浏览器未自动填写测试账号密码，因此没有执行登录后的后台视觉流程；受保护接口已通过命令行 Basic Auth 完整 CRUD 回归验证。

## 7. 构建结果

```text
npm run build
1777 modules transformed
build passed
```

最大业务页面 JavaScript chunk 仍为文章详情页，约 16.76 KB（gzip 7.77 KB）；图片不再是数 MB 级首屏负担。

构建仍出现两条 `@vueuse/core` PURE 注释位置警告，Vite 会安全移除注释，不影响当前构建。可在后续升级 Element Plus/相关传递依赖时复查。

## 8. 分项改善

| 维度 | 优化前 | 优化后 | 变化 |
|---|---:|---:|---|
| API 契合度 | 8.0 | 9.0 | 完成真实联调并确定分页与认证 |
| 安全 | 5.5 | 7.0 | Basic 接入、会话存储、路由守卫、移除 v-html |
| 错误处理 | 4.5 | 6.5 | 增加 Axios 标准错误信息 |
| 性能 | 5.5 | 8.5 | 主要图片体积下降 95.8% |
| 测试 | 2.0 | 6.0 | 新增 4 个单测、2 个 API 集成测试和 CRUD 回归证据 |
| 可维护性 | 6.0 | 7.2 | 分页解析集中化，减少重复兼容代码 |

## 9. 仍未完成的优化

按优先级排序：

### P1

1. **后端认证升级**：Basic Auth 必须依赖 HTTPS，建议改为短期 Token + HttpOnly Cookie 或服务端 Session。
2. **后端授权复核**：继续验证普通用户不能修改他人资料、删除他人文章、伪造文章作者或圈子 owner。
3. **全局 401 退出策略**：收到 401 时自动清理会话并跳转登录，需要在避免循环依赖的前提下集中实现。

### P2

1. 为所有旧页面补齐 loading、empty、error 状态，移除静默 `.catch(() => {})`。
2. 增加 ESLint、Prettier、Vitest/Vue Test Utils 与 Playwright E2E。
3. 把完整 CRUD 清理回归固化为显式 `test:api:crud`，并使用隔离测试数据库。
4. 抽取文章、用户、圈子列表组件，逐步替换重复的嵌套 `el-card` 页面。
5. 为图片增加 `srcset` 和尺寸响应式；当前 WebP 已解决主要体积问题。

### P3

1. 统一 Options API 与 Composition API 编码规范。
2. 引入 TypeScript/OpenAPI 类型生成。
3. 评估从 Vuex 迁移到 Pinia。
4. 清理确认无用的 PNG 原图、注释代码和非 scoped 全局样式。

## 10. 建议的持续验证命令

```bash
npm test
npm run test:api
npm run build
```

开发环境需要同时运行：

```bash
npm run dev
```

后端默认监听 `http://localhost:8080`。如果地址不同，开发代理和 `API_BASE_URL`/`VITE_API_BASE_URL` 应同步调整。

## 11. 结论

本轮优化解决了原评估中最具体且可在前端落地的高价值问题：真实 API 无法被浏览器使用、受保护请求缺少认证、后台路由无守卫、分页解析重复、图片体积过大、缺少测试以及文章内容存在 XSS 风险。项目现在已从“可演示但联调证据不足”提升为“真实后端可用、关键链路有验证、具备基础质量门禁”的版本。

下一阶段的首要工作不应继续堆叠页面，而应推动后端认证方案升级、补齐全局错误状态与端到端测试，并完成服务端越权测试。
