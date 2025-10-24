# 八字排盘 (BaZi Paipan)

基于 [tyme4ts](https://github.com/6tail/tyme4ts) 实现的八字排盘功能库。

## 功能特性

- ✅ 四柱八字排盘（年柱、月柱、日柱、时柱）
- ✅ 天干地支计算
- ✅ 五行属性分析
- ✅ 十神关系计算
- ✅ 地支藏干显示（包含藏干对应的十神）
- ✅ 大运推算（10运程）
- ✅ 起运信息计算
- ✅ 胎元、胎息、命宫、身宫等特殊信息
- ✅ 公历与农历转换
- ✅ 完整的中文排盘格式输出
- 🌐 Web 在线演示版
- 🔌 RESTful API 接口

## 安装

```bash
npm install
```

## 使用方法

### 基础示例

```typescript
import { BaZi } from './src';

const bazi = new BaZi({
  year: 1990,
  month: 5,
  day: 15,
  hour: 10,
  minute: 30,
  gender: 'male'
});

// 获取格式化的排盘结果
console.log(bazi.getFormattedResult());

// 或者获取结构化的数据
const result = bazi.getResult();
console.log(result);
```

### 输出示例

```
═══════════════════════════════════════════════════════════
                    八字排盘                    
═══════════════════════════════════════════════════════════

出生时间（公历）: 1990年5月15日 10:30:0
出生时间（农历）: 1990年4月21日 10时
性别: 男

───────────────────────────────────────────────────────────
                    四柱八字                    
───────────────────────────────────────────────────────────
        年柱          月柱          日柱          时柱
        庚午          辛巳          庚辰          辛巳
        (金)          (金)          (金)          (金)

───────────────────────────────────────────────────────────
                    十神                    
───────────────────────────────────────────────────────────
        比肩          劫财          日主          劫财

───────────────────────────────────────────────────────────
                    日主                    
───────────────────────────────────────────────────────────
日主: 庚金

───────────────────────────────────────────────────────────
                    地支藏干                    
───────────────────────────────────────────────────────────
年支 午: 丁[正官](本气) 己[正印](中气)
月支 巳: 丙[七杀](本气) 庚[比肩](中气) 戊[偏印](余气)
日支 辰: 戊[偏印](本气) 乙[正财](中气) 癸[伤官](余气)
时支 巳: 丙[七杀](本气) 庚[比肩](中气) 戊[偏印](余气)

───────────────────────────────────────────────────────────
                    起运信息                    
───────────────────────────────────────────────────────────
起运年龄: X年X月X日
运势方向: 顺行/逆行

───────────────────────────────────────────────────────────
                    大运                    
───────────────────────────────────────────────────────────
X-X岁  XX (天干地支)
...

───────────────────────────────────────────────────────────
                    其他信息                    
───────────────────────────────────────────────────────────
胎元: XX
胎息: XX
命宫: XX
身宫: XX
建除: XX

═══════════════════════════════════════════════════════════
```

## API 文档

### BaZi 类

#### 构造函数

```typescript
constructor(input: BaZiInput)
```

**BaZiInput 参数：**

- `year`: number - 出生年份（公历）
- `month`: number - 出生月份（公历，1-12）
- `day`: number - 出生日期（公历）
- `hour`: number - 出生小时（0-23）
- `minute`: number - 出生分钟（0-59）
- `second?`: number - 出生秒数（可选，默认为0）
- `gender`: 'male' | 'female' - 性别

#### 方法

##### getResult(): BaZiResult

获取完整的八字排盘结果，返回结构化数据。

##### getFormattedResult(): string

获取格式化的中文排盘结果，适合直接打印输出。

##### getDecadeFortunes(count?: number): DecadeFortuneInfo[]

获取大运信息，默认返回10个大运。

## 返回数据结构

### BaZiResult

```typescript
interface BaZiResult {
  birthTime: {
    solar: string;     // 公历出生时间
    lunar: string;     // 农历出生时间
  };
  gender: string;      // 性别
  eightChar: {         // 四柱八字
    year: PillarInfo;  // 年柱
    month: PillarInfo; // 月柱
    day: PillarInfo;   // 日柱
    hour: PillarInfo;  // 时柱
  };
  tenGod: TenGodInfo;  // 十神
  dayMaster: {         // 日主信息
    heavenStem: string;
    element: string;
    description: string;
  };
  childLimit: {        // 起运信息
    yearCount: number;
    monthCount: number;
    dayCount: number;
    hourCount: number;
    minuteCount: number;
    startAge: number;
    endAge: number;
    forward: boolean;
  };
  decadeFortunes: DecadeFortuneInfo[]; // 大运
  specialInfo: {       // 特殊信息
    fetalOrigin: string;
    fetalBreath: string;
    ownSign: string;
    bodySign: string;
    duty: string;
  };
}
```

### PillarInfo

```typescript
interface PillarInfo {
  name: string;          // 柱名（如"甲子"）
  heavenStem: string;    // 天干
  earthBranch: string;   // 地支
  element: string;       // 五行
  yinYang: string;       // 阴阳
  hideHeavenStems: Array<{
    stem: string;        // 藏干
    type: string;        // 类型（本气/中气/余气）
    tenGod: string;      // 对应十神
  }>;
}
```

## 运行示例

```bash
# 基础示例
npm run example

# 高级示例（包含多个八字排盘）
npm run example:advanced

# 地支藏干与十神分析
npm run example:hidden

# 启动 Web 演示服务
npm start
```

## 技术栈

- TypeScript
- tyme4ts - 强大的日历和八字计算库

## 依赖

- [tyme4ts](https://github.com/6tail/tyme4ts) - 核心日历和八字计算引擎

## 开发

```bash
# 安装依赖
npm install

# 编译
npm run build

# 运行示例
npm run example
```

## 更多文档

- ⚡ [快速开始](./QUICKSTART.md)
- 📖 [详细使用指南](./docs/USAGE.md)
- 🚀 [部署指南](./DEPLOYMENT.md)
- 🌐 [Web 演示使用指南](./WEB_DEMO.md)
- 📋 [更新日志](./CHANGELOG.md)

## 许可证

ISC

## 致谢

本项目基于 [tyme4ts](https://github.com/6tail/tyme4ts) 库实现，感谢 [6tail](https://github.com/6tail) 提供如此强大的日历工具库。
