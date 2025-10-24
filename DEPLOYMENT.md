# 部署指南

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 编译 TypeScript

```bash
npm run build
```

### 3. 启动服务器

```bash
npm start
```

或者，如果已经编译过，直接运行：

```bash
npm run dev
```

### 4. 访问应用

打开浏览器访问：
- **本地访问**: http://localhost:3000
- **网络访问**: http://0.0.0.0:3000

## API 接口说明

### 1. 计算八字排盘

**端点**: `POST /api/bazi`

**请求体**:
```json
{
  "year": 1990,
  "month": 5,
  "day": 15,
  "hour": 10,
  "minute": 30,
  "second": 0,
  "gender": "male"
}
```

**参数说明**:
- `year` (必需): 出生年份
- `month` (必需): 出生月份 (1-12)
- `day` (必需): 出生日期 (1-31)
- `hour` (必需): 出生小时 (0-23)
- `minute` (必需): 出生分钟 (0-59)
- `second` (可选): 出生秒数 (0-59)，默认 0
- `gender` (必需): 性别，"male" 或 "female"

**响应示例**:
```json
{
  "success": true,
  "data": {
    "birthTime": {
      "solar": "1990年5月15日 10:30:0",
      "lunar": "1990年4月21日 10时"
    },
    "gender": "男",
    "eightChar": {
      "year": { "name": "庚午", ... },
      "month": { "name": "辛巳", ... },
      "day": { "name": "庚辰", ... },
      "hour": { "name": "辛巳", ... }
    },
    ...
  },
  "formatted": "格式化的中文排盘结果..."
}
```

### 2. 获取示例数据

**端点**: `GET /api/examples`

**响应示例**:
```json
[
  {
    "name": "示例1 - 男性",
    "data": {
      "year": 1990,
      "month": 5,
      "day": 15,
      "hour": 10,
      "minute": 30,
      "gender": "male"
    }
  },
  ...
]
```

### 3. 健康检查

**端点**: `GET /api/health`

**响应示例**:
```json
{
  "status": "ok",
  "message": "八字排盘服务运行中"
}
```

## 使用 curl 测试 API

### 计算八字

```bash
curl -X POST http://localhost:3000/api/bazi \
  -H "Content-Type: application/json" \
  -d '{
    "year": 1990,
    "month": 5,
    "day": 15,
    "hour": 10,
    "minute": 30,
    "gender": "male"
  }'
```

### 获取示例

```bash
curl http://localhost:3000/api/examples
```

### 健康检查

```bash
curl http://localhost:3000/api/health
```

## 项目结构

```
.
├── server.js              # Express 服务器
├── public/               # 静态资源文件夹
│   ├── index.html       # Web 界面
│   ├── styles.css       # 样式文件
│   └── script.js        # 前端脚本
├── src/                 # TypeScript 源代码
│   ├── bazi.ts         # 八字排盘核心逻辑
│   └── index.ts        # 导出接口
├── dist/                # 编译后的 JavaScript
├── examples/            # 示例代码
└── package.json         # 项目配置
```

## 部署到生产环境

### 使用 PM2 进程管理

1. 安装 PM2:
```bash
npm install -g pm2
```

2. 启动服务:
```bash
pm2 start server.js --name bazi-paipan
```

3. 查看状态:
```bash
pm2 status
```

4. 查看日志:
```bash
pm2 logs bazi-paipan
```

5. 重启服务:
```bash
pm2 restart bazi-paipan
```

6. 停止服务:
```bash
pm2 stop bazi-paipan
```

### 使用 Docker

创建 `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "server.js"]
```

构建并运行:

```bash
docker build -t bazi-paipan .
docker run -p 3000:3000 bazi-paipan
```

### 使用 systemd 服务

创建 `/etc/systemd/system/bazi-paipan.service`:

```ini
[Unit]
Description=BaZi Paipan Service
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/bazi-paipan
ExecStart=/usr/bin/node server.js
Restart=on-failure
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

启动服务:

```bash
sudo systemctl enable bazi-paipan
sudo systemctl start bazi-paipan
sudo systemctl status bazi-paipan
```

## 环境变量

可以通过环境变量配置服务器：

- `PORT`: 服务器端口（默认 3000）

示例：
```bash
PORT=8080 npm start
```

## 常见问题

### 1. 端口被占用

如果端口 3000 被占用，可以：
- 修改 `PORT` 环境变量
- 或者在 `server.js` 中修改默认端口

### 2. 跨域问题

服务器已经配置了 CORS，允许跨域访问。如需更严格的控制，请修改 `server.js` 中的 CORS 配置。

### 3. 性能优化

- 使用 Nginx 作为反向代理
- 启用 gzip 压缩
- 配置缓存策略
- 使用 CDN 分发静态资源

## 监控和日志

### 查看运行日志

```bash
tail -f server.log
```

### 使用 PM2 监控

```bash
pm2 monit
```

## 技术栈

- **后端**: Node.js + Express
- **前端**: 原生 HTML/CSS/JavaScript
- **八字计算**: tyme4ts 库
- **语言**: TypeScript

## 许可证

ISC

## 支持

如有问题，请提交 Issue 到项目仓库。
