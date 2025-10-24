# 如何查看八字排盘效果

## 🌐 方式一：Web 浏览器查看（推荐）

这是最直观、最易用的方式！

### 步骤：

1. **启动服务**：
```bash
cd /home/engine/project
npm start
```

2. **打开浏览器**：
访问 http://localhost:3000

3. **使用界面**：
   - 填写出生信息（年、月、日、时、分）
   - 选择性别
   - 点击"计算八字"按钮
   - 查看详细的排盘结果

### 界面特色：
- ✨ 玄学风格设计（金色、墨黑、古铜色）
- 📱 支持手机/平板/电脑访问
- 🎴 卡片式排盘布局
- ⚡ 即时计算，无需刷新
- ☯ 太极图案背景
- 🎲 一键加载随机示例

---

## 💻 方式二：命令行查看

快速在终端中查看排盘结果。

### 基础示例：
```bash
npm run example
```

### 高级示例（多个八字）：
```bash
npm run example:advanced
```

### 地支藏干分析：
```bash
npm run example:hidden
```

---

## 🔌 方式三：API 接口调用

适合集成到其他应用中。

### 启动 API 服务：
```bash
npm start
```

### 使用 curl 测试：
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

### API 端点：
- `POST /api/bazi` - 计算八字排盘
- `GET /api/examples` - 获取示例数据
- `GET /api/health` - 健康检查

---

## 📊 排盘结果包含的信息

### 1. 基本信息
- 出生时间（公历和农历）
- 性别

### 2. 四柱八字
```
年柱    月柱    日柱    时柱
庚午    辛巳    庚辰    辛巳
(金)    (金)    (金)    (金)
```

### 3. 十神关系
```
比肩    劫财    日主    劫财
```

### 4. 地支藏干（包含十神）
```
年支 午: 丁[正官](本气) 己[正印](中气)
月支 巳: 丙[七杀](本气) 庚[比肩](中气) 戊[偏印](余气)
日支 辰: 戊[偏印](本气) 乙[正财](中气) 癸[伤官](余气)
时支 巳: 丙[七杀](本气) 庚[比肩](中气) 戊[偏印](余气)
```

### 5. 日主信息
- 日主天干和五行
- 例如：庚金

### 6. 大运信息
```
8-17岁   壬午
18-27岁  癸未
28-37岁  甲申
...
```

### 7. 特殊信息
- 胎元、胎息
- 命宫、身宫
- 建除十二神

---

## 🎯 快速体验示例数据

### 示例 1 - 男性
```javascript
{
  year: 1990,
  month: 5,
  day: 15,
  hour: 10,
  minute: 30,
  gender: 'male'
}
```

### 示例 2 - 女性
```javascript
{
  year: 1985,
  month: 8,
  day: 20,
  hour: 14,
  minute: 15,
  gender: 'female'
}
```

### 示例 3 - 子时
```javascript
{
  year: 2000,
  month: 1,
  day: 1,
  hour: 0,
  minute: 30,
  gender: 'male'
}
```

---

## 💡 提示

### Web 界面
- 点击"随机示例"按钮快速加载示例数据
- 卡片式布局，信息分类清晰
- 五行颜色标识，一目了然
- 悬停卡片查看详情
### 命令行
- 使用 `npm run example` 最快看到效果
- 输出会自动格式化为易读的中文排盘

### API 接口
- 可以通过 Postman、Insomnia 等工具测试
- 返回 JSON 格式，方便程序处理
- 支持跨域访问（CORS）

---

## 🔧 故障排除

### 端口被占用
```bash
# 查看占用端口的进程
lsof -i :3000

# 使用其他端口
PORT=8080 npm start
```

### 无法访问 Web 界面
```bash
# 检查服务状态
curl http://localhost:3000/api/health

# 应返回
{"status":"ok","message":"八字排盘服务运行中"}
```

### 计算结果不正确
- 确认输入的日期格式正确
- 使用公历（阳历）日期
- 时间采用 24 小时制

---

## 📚 更多文档

- [快速开始指南](./QUICKSTART.md)
- [Web 演示详细说明](./WEB_DEMO.md)
- [API 使用指南](./DEPLOYMENT.md)
- [完整使用文档](./docs/USAGE.md)

---

## 🎉 开始体验

最简单的方式：

```bash
# 1. 启动服务
npm start

# 2. 打开浏览器
# 访问 http://localhost:3000

# 3. 填写信息并查看结果！
```

**就这么简单！** 🚀
