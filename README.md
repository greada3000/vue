# 社区系统前端

这是社区系统的 Vue 3 前端项目，配套后端为同级目录中的 `springcloud` Spring Boot 项目。

## 1. 项目结构

推荐保持以下目录结构：

```text
backend1/
├─ springcloud/   # Spring Boot 后端
└─ vue/           # 当前前端项目
```

前端默认请求 `http://localhost:8080`，后端默认连接本机 MySQL 的 `finally` 数据库。

## 2. 环境要求

启动完整系统前，请安装：

- Node.js `20.19.0+`，或者 `22.12.0+`
- npm（随 Node.js 安装）
- JDK 17
- Maven 3.6.3+
- MySQL 8

可以先在终端检查版本：

```powershell
node --version
npm.cmd --version
java -version
mvn -version
mysql --version
```

如果 `mysql` 命令不可用，需要将 MySQL 的 `bin` 目录加入系统 `PATH`，或者在命令中使用 `mysql.exe` 的完整路径。

## 3. 首次运行

完整系统需要依次准备数据库、启动后端、启动前端。后端和前端应分别使用一个终端窗口。

### 3.1 初始化数据库

进入后端目录：

```powershell
cd ..\springcloud
```

使用默认 MySQL 账号导入初始化脚本：

```powershell
mysql -uroot -p123456 -e "source database/init.sql"
```

如果你的 MySQL 密码不是 `123456`，将命令中的密码替换为实际密码。也可以交互式输入密码：

```powershell
mysql -uroot -p -e "source database/init.sql"
```

该脚本会创建 `finally` 数据库、业务表和测试数据。测试账号为：

| 账号    | 密码     |
| ------- | -------- |
| `10001` | `123456` |
| `10002` | `123456` |
| `10003` | `123456` |

初始化脚本通常只需执行一次。需要重置测试数据时，可以重新执行脚本；执行前请确认其中的数据重建操作不会覆盖需要保留的数据。

### 3.2 启动后端

仍在 `springcloud` 目录中执行：

```powershell
mvn spring-boot:run
```

看到 Spring Boot 启动完成后，后端默认地址为：

- API 服务：`http://localhost:8080`
- Swagger UI：`http://localhost:8080/swagger-ui.html`
- OpenAPI JSON：`http://localhost:8080/api-docs`

在浏览器打开 Swagger UI，或者访问 `http://localhost:8080/api/users/10001`，可以确认后端和数据库是否正常。

这些环境变量只对当前 PowerShell 窗口生效。

### 3.3 安装前端依赖

打开新的终端并进入前端目录。如果当前位于 `springcloud`，执行：

```powershell
cd ..\vue
```

根据锁文件安装依赖：

```powershell
npm.cmd ci
```

如果项目依赖正在开发中、`package-lock.json` 与 `package.json` 不一致，可以改用：

```powershell
npm.cmd install
```

### 3.4 配置前端 API 地址

复制环境变量示例：

```powershell
Copy-Item .env.example .env.local
```

默认内容为：

```dotenv
VITE_API_BASE_URL=http://localhost:8080
```

后端端口或主机发生变化时，只需修改 `.env.local`。修改环境变量后，需要重新启动 Vite 开发服务器。

### 3.5 启动前端

建议固定使用 5173 端口启动，避免与后端默认 CORS 配置不一致：

```powershell
npm.cmd run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

然后访问：

```text
http://127.0.0.1:5173
```

也可以直接执行：

```powershell
npm.cmd run dev
```

Vite 通常会使用 `http://localhost:5173`。如果 5173 已被占用，Vite 可能选择其他端口；此时需要把新地址加入后端的 `CORS_ALLOWED_ORIGINS`，然后重启后端。

## 4. 日常启动顺序

首次初始化完成后，日常开发只需：

1. 启动 MySQL。
2. 在 `springcloud` 目录执行 `mvn spring-boot:run`。
3. 在 `vue` 目录执行 `npm.cmd run dev -- --port 5173 --strictPort`。
4. 打开 `http://localhost:5173`。

## 5. 可用命令

在 `vue` 目录运行：

| 命令                  | 用途                      |
| --------------------- | ------------------------- |
| `npm.cmd run dev`     | 启动 Vite 开发服务器      |
| `npm.cmd run serve`   | `dev` 的兼容别名          |
| `npm.cmd run build`   | 生成生产构建到 `dist/`    |
| `npm.cmd run preview` | 本地预览 `dist/` 生产构建 |

## 6. 生产构建与预览

生成生产文件：

```powershell
npm.cmd run build
```

构建结果位于 `dist` 目录。构建完成后可本地预览：

```powershell
npm.cmd run preview -- --host 127.0.0.1 --port 4173
```

访问 `http://127.0.0.1:4173`。

项目使用 Vue Router History 模式。部署到 Nginx、Apache 或其他静态服务器时，需要把无法匹配的前端路由回退到 `index.html`，否则直接刷新 `/users/10001`、`/articles/...` 等页面会返回 404。

Nginx 的核心配置示例：

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

## 7. 常见问题

### PowerShell 提示“禁止运行脚本”

Windows 可能禁止执行 `npm.ps1`。无需修改系统执行策略，直接使用 `npm.cmd`：

```powershell
npm.cmd ci
npm.cmd run dev
```

### 页面能打开，但没有数据

依次检查：

1. MySQL 服务是否启动。
2. `finally` 数据库是否已经执行 `database/init.sql`。
3. 后端是否运行在 `http://localhost:8080`。
4. `http://localhost:8080/swagger-ui.html` 是否可以打开。
5. `.env.local` 中的 `VITE_API_BASE_URL` 是否正确。
6. 修改 `.env.local` 后是否重启了前端。

### 浏览器提示 CORS 错误

前端地址必须包含在后端的 `CORS_ALLOWED_ORIGINS` 中。例如：

```powershell
$env:CORS_ALLOWED_ORIGINS="http://localhost:5173,http://127.0.0.1:5173"
mvn spring-boot:run
```

设置后需要重启后端。

### 8080 或 5173 端口被占用

可以查找占用端口的进程：

```powershell
Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
```

也可以更换端口。更换后端端口时，必须同时修改前端的 `VITE_API_BASE_URL`；更换前端端口时，必须同步更新后端的 `CORS_ALLOWED_ORIGINS`。

### 数据库连接失败

确认数据库名、端口、用户名和密码正确。后端默认使用：

```text
jdbc:mysql://localhost:3306/finally
root / 123456
```

本机密码不同时，请通过 `DB_USERNAME` 和 `DB_PASSWORD` 覆盖默认配置。

## 8. 相关文档

- [接口文档](./API_DOCUMENTATION.md)
- [技术栈与迁移说明](./MIGRATION.md)
- [目录重构说明](./DIRECTORY_REFACTOR.md)
- [开发更新记录](./DEVELOPMENT_UPDATES.md)
