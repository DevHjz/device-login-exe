# Casdoor Trusted Quick Login Companion Application

这是一个基于 Casdoor Node.js SDK 实现的 **Trusted Quick Login Companion** 示例应用。

## 功能简介

该应用允许当前设备作为“受信任设备”运行。当用户在其他设备（如另一台电脑的浏览器）上尝试登录您的应用时，Casdoor 可以发现此受信任设备，并请求此设备进行快速登录确认。

## 核心流程

1. **初始化**：使用 `createNodeCompanion` 初始化 SDK，配置 Casdoor 服务器地址、Client ID 及本地存储路径。
2. **设置会话**：通过 `companion.setSession(session)` 传入当前登录用户的 Access Token 和身份信息。
3. **设备注册**：SDK 会自动生成 Ed25519 密钥对，并将公钥注册到 Casdoor 服务器，建立“受信任绑定”。
4. **本地发现**：SDK 在本地启动一个轻量级 HTTP 服务（默认端口 47321），用于响应来自浏览器的发现请求。
5. **确认登录**：当收到登录请求时，触发 `approveQuickLogin` 回调，用户确认后，SDK 使用私钥对挑战（Challenge）进行签名并返回。

## 快速开始

### 1. 配置参数

在 `index.ts` 中修改以下预留变量：

```typescript
const CASDOOR_SERVER_URL = 'https://your-casdoor-server.com';
const CASDOOR_CLIENT_ID = 'your-client-id';
const APP_BASE_DIR = path.join(__dirname, 'data'); 
const COMPANION_PORT = 47321;
const ALLOWED_ORIGINS = [
  'https://your-app-domain.com',
  'http://localhost:3000'
];
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 运行应用

```bash
npx ts-node index.ts
```

## 注意事项

- **安全性**：私钥以加密形式存储在 `APP_BASE_DIR` 下。
- **跨域配置**：确保 `ALLOWED_ORIGINS` 包含了发起登录请求的前端域名。
- **身份同步**：当用户在 Companion 应用中切换账号时，调用 `setSession` 会自动处理绑定关系的更新。
