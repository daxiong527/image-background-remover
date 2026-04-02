# 图片背景移除工具

基于 Cloudflare Workers + Remove.bg API 的在线图片背景移除工具。

## 🚀 快速开始

### 1. 获取 Remove.bg API Key
访问 https://www.remove.bg/api 注册并获取免费 API Key（每月 50 张免费）

### 2. 配置项目
```bash
cd image-bg-remover

# 安装依赖
npm install

# 编辑 wrangler.toml，填入你的 API Key
# REMOVE_BG_API_KEY = "your_actual_api_key"
```

### 3. 本地开发
```bash
npm run dev
```
访问 http://localhost:8787

### 4. 部署到 Cloudflare
```bash
npm run deploy
```

## 📁 项目结构

```
image-bg-remover/
├── wrangler.toml          # Cloudflare 配置
├── package.json
├── worker/                # Workers 后端 (API)
│   └── index.ts
└── pages/                 # Pages 前端
    ├── index.html
    └── app.js
```

## 💰 成本估算

- **Cloudflare Workers**: 免费额度 10 万次请求/天
- **Remove.bg**: 免费 50 张/月，付费 $0.2/张起
- **Cloudflare Pages**: 完全免费

## 🔧 自定义

### 更换 AI 服务商
修改 `worker/index.ts` 中的 API 调用逻辑，可替换为：
- ClipDrop API
- PhotoRoom API
- 自部署的 MODNet/U^2-Net

### 添加功能
- 批量处理
- 图片压缩
- 用户认证
- 使用统计

## 📝 License

MIT
