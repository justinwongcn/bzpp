# 快速开始指南 ⚡

## 5 分钟上手八字排盘

### 方式 1：命令行版本 🖥️

```bash
# 1. 安装依赖
npm install

# 2. 运行示例
npm run example
```

**输出效果**：
```
════════════════════════════════════════════════════════════
                    八字排盘                    
════════════════════════════════════════════════════════════

出生时间（公历）: 1990年5月15日 10:30:0
出生时间（农历）: 1990年4月21日 10时
性别: 男

────────────────────────────────────────────────────────────
                    四柱八字                    
────────────────────────────────────────────────────────────
        年柱          月柱          日柱          时柱
        庚午          辛巳          庚辰          辛巳
        (金)          (金)          (金)          (金)

... (更多详细信息)
```

### 方式 2：Web 版本 🌐

```bash
# 1. 安装依赖并启动服务
npm install
npm start

# 2. 打开浏览器
# 访问 http://localhost:3000
```

**Web 界面特性**：
- 🎨 漂亮的渐变紫色主题
- 📝 友好的表单输入
- ⚡ 实时计算八字
- 📊 清晰的结果展示
- 💾 JSON 数据导出

### 方式 3：API 接口 🔌

启动服务后，使用任何 HTTP 客户端调用：

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

**返回数据**：
```json
{
  "success": true,
  "data": {
    "birthTime": {
      "solar": "1990年5月15日 10:30:0",
      "lunar": "1990年4月21日 10时"
    },
    "eightChar": { ... },
    "dayMaster": { ... },
    ...
  },
  "formatted": "格式化的中文排盘结果..."
}
```

## 在代码中使用 💻

### TypeScript / JavaScript

```typescript
import { BaZi } from './src';

// 创建八字实例
const bazi = new BaZi({
  year: 1990,
  month: 5,
  day: 15,
  hour: 10,
  minute: 30,
  gender: 'male'
});

// 获取格式化结果
console.log(bazi.getFormattedResult());

// 或获取结构化数据
const result = bazi.getResult();
console.log('日主:', result.dayMaster.description);
console.log('四柱:', 
  result.eightChar.year.name,
  result.eightChar.month.name,
  result.eightChar.day.name,
  result.eightChar.hour.name
);
```

### Node.js (编译后)

```javascript
const { BaZi } = require('./dist');

const bazi = new BaZi({
  year: 1990,
  month: 5,
  day: 15,
  hour: 10,
  minute: 30,
  gender: 'male'
});

console.log(bazi.getFormattedResult());
```

## 更多示例 📚

### 查看地支藏干分析

```bash
npm run example:hidden
```

### 查看高级功能演示

```bash
npm run example:advanced
```

## 常见使用场景 🎯

### 1. 单次计算

```typescript
const bazi = new BaZi({
  year: 1990, month: 5, day: 15,
  hour: 10, minute: 30, gender: 'male'
});
console.log(bazi.getFormattedResult());
```

### 2. 批量计算

```typescript
const birthDates = [
  { year: 1990, month: 5, day: 15, hour: 10, minute: 30, gender: 'male' },
  { year: 1985, month: 8, day: 20, hour: 14, minute: 15, gender: 'female' },
];

birthDates.forEach(data => {
  const bazi = new BaZi(data);
  const result = bazi.getResult();
  console.log(`${result.eightChar.year.name} ${result.eightChar.month.name} ${result.eightChar.day.name} ${result.eightChar.hour.name}`);
});
```

### 3. 提取特定信息

```typescript
const bazi = new BaZi({
  year: 1990, month: 5, day: 15,
  hour: 10, minute: 30, gender: 'male'
});

const result = bazi.getResult();

// 只获取四柱
console.log('四柱:', 
  result.eightChar.year.name,
  result.eightChar.month.name,
  result.eightChar.day.name,
  result.eightChar.hour.name
);

// 只获取十神
console.log('十神:', result.tenGod);

// 只获取大运
const fortunes = bazi.getDecadeFortunes(5); // 前5步大运
fortunes.forEach(f => {
  console.log(`${f.startAge}-${f.endAge}岁: ${f.name}`);
});
```

## 快速参考 📋

### 输入参数

| 参数 | 类型 | 必需 | 说明 | 范围 |
|------|------|------|------|------|
| year | number | ✅ | 出生年份 | 1900-2100 |
| month | number | ✅ | 出生月份 | 1-12 |
| day | number | ✅ | 出生日期 | 1-31 |
| hour | number | ✅ | 出生小时 | 0-23 |
| minute | number | ✅ | 出生分钟 | 0-59 |
| second | number | ❌ | 出生秒数 | 0-59 |
| gender | string | ✅ | 性别 | 'male' 或 'female' |

### 主要方法

| 方法 | 说明 | 返回值 |
|------|------|--------|
| `getResult()` | 获取完整排盘结果 | BaZiResult 对象 |
| `getFormattedResult()` | 获取格式化文本 | 字符串 |
| `getDecadeFortunes(count?)` | 获取大运信息 | 大运数组 |

### 结果字段

```typescript
interface BaZiResult {
  birthTime: {
    solar: string;    // 公历时间
    lunar: string;    // 农历时间
  };
  gender: string;     // 性别
  eightChar: {        // 四柱八字
    year: PillarInfo;
    month: PillarInfo;
    day: PillarInfo;
    hour: PillarInfo;
  };
  tenGod: TenGodInfo;        // 十神
  dayMaster: {...};          // 日主信息
  childLimit: {...};         // 起运信息
  decadeFortunes: [...];     // 大运
  specialInfo: {...};        // 特殊信息
}
```

## 下一步 🚀

- 📖 阅读 [详细使用指南](./docs/USAGE.md)
- 🌐 查看 [Web 演示指南](./WEB_DEMO.md)
- 🚀 查看 [部署指南](./DEPLOYMENT.md)
- 💡 查看更多 [示例代码](./examples/)

## 获取帮助 💬

- 📝 查看 [README](./README.md)
- 🐛 提交 [Issue](https://github.com/justinwongcn/bzpp/issues)
- 📚 查看 [tyme4ts 文档](https://github.com/6tail/tyme4ts)

---

**提示**：所有时间使用公历（阳历），程序会自动转换为农历进行计算。
