# 使用指南

## 快速开始

### 安装

```bash
npm install
```

### 基础用法

```typescript
import { BaZi } from './src';

// 创建八字排盘实例
const bazi = new BaZi({
  year: 1990,      // 出生年份（公历）
  month: 5,        // 出生月份（公历）
  day: 15,         // 出生日期（公历）
  hour: 10,        // 出生小时（0-23）
  minute: 30,      // 出生分钟（0-59）
  second: 0,       // 出生秒数（可选，默认为0）
  gender: 'male'   // 性别: 'male' 或 'female'
});

// 获取格式化的排盘结果
console.log(bazi.getFormattedResult());

// 获取结构化数据
const result = bazi.getResult();
```

## 详细功能

### 1. 四柱八字

四柱包括年柱、月柱、日柱、时柱，每柱由天干和地支组成。

```typescript
const result = bazi.getResult();

// 年柱
console.log(result.eightChar.year.name);         // 例: "庚午"
console.log(result.eightChar.year.heavenStem);   // 天干: "庚"
console.log(result.eightChar.year.earthBranch);  // 地支: "午"
console.log(result.eightChar.year.element);      // 五行: "金"

// 其他柱类似访问：month, day, hour
```

### 2. 十神关系

十神是根据日主与其他天干的关系推算出来的。

```typescript
const result = bazi.getResult();

console.log(result.tenGod.year);   // 年柱十神
console.log(result.tenGod.month);  // 月柱十神
console.log(result.tenGod.day);    // 日柱十神（日主）
console.log(result.tenGod.hour);   // 时柱十神
```

十神包括：
- 比肩、劫财
- 食神、伤官
- 偏财、正财
- 七杀、正官
- 偏印、正印

### 3. 地支藏干

每个地支中藏有若干天干，分为本气、中气、余气。每个藏干都有对应的十神关系。

```typescript
const result = bazi.getResult();

// 年支藏干
result.eightChar.year.hideHeavenStems.forEach(hide => {
  console.log(`${hide.stem}[${hide.tenGod}](${hide.type})`);
  // 例如: "丁[劫财](本气)" "己[伤官](余气)"
});
```

### 4. 日主分析

日主是日柱的天干，代表命主本人。

```typescript
const result = bazi.getResult();

console.log(result.dayMaster.heavenStem);    // 日主天干
console.log(result.dayMaster.element);       // 日主五行
console.log(result.dayMaster.description);   // 日主描述
```

### 5. 大运推算

大运是人生运势的重要参考，通常按十年一运计算。

```typescript
const result = bazi.getResult();

// 获取所有大运（默认10步）
result.decadeFortunes.forEach(fortune => {
  console.log(`${fortune.startAge}-${fortune.endAge}岁: ${fortune.name}`);
});

// 或者自定义大运步数
const fortunes = bazi.getDecadeFortunes(20);  // 获取20步大运
```

### 6. 起运信息

起运是指从何时开始进入第一步大运。

```typescript
const result = bazi.getResult();

console.log(`起运年龄: ${result.childLimit.yearCount}年${result.childLimit.monthCount}月${result.childLimit.dayCount}日`);
console.log(`运势方向: ${result.childLimit.forward ? '顺行' : '逆行'}`);
console.log(`起运开始年龄: ${result.childLimit.startAge}岁`);
```

### 7. 特殊信息

```typescript
const result = bazi.getResult();

console.log('胎元:', result.specialInfo.fetalOrigin);  // 胎元
console.log('胎息:', result.specialInfo.fetalBreath);  // 胎息
console.log('命宫:', result.specialInfo.ownSign);      // 命宫
console.log('身宫:', result.specialInfo.bodySign);     // 身宫
console.log('建除:', result.specialInfo.duty);         // 建除十二神
```

### 8. 公历农历转换

```typescript
const result = bazi.getResult();

console.log('公历:', result.birthTime.solar);  // 公历出生时间
console.log('农历:', result.birthTime.lunar);  // 农历出生时间
```

## 完整示例

### 示例1：基础排盘

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

console.log(bazi.getFormattedResult());
```

### 示例2：获取结构化数据

```typescript
import { BaZi, BaZiResult } from './src';

const bazi = new BaZi({
  year: 1985,
  month: 8,
  day: 20,
  hour: 14,
  minute: 15,
  gender: 'female'
});

const result: BaZiResult = bazi.getResult();

// 分析四柱
console.log('四柱信息:');
console.log('年:', result.eightChar.year.name);
console.log('月:', result.eightChar.month.name);
console.log('日:', result.eightChar.day.name);
console.log('时:', result.eightChar.hour.name);

// 分析五行
const elements = {
  wood: 0, fire: 0, earth: 0, metal: 0, water: 0
};

[result.eightChar.year, result.eightChar.month, 
 result.eightChar.day, result.eightChar.hour].forEach(pillar => {
  const element = pillar.element;
  if (element === '木') elements.wood++;
  if (element === '火') elements.fire++;
  if (element === '土') elements.earth++;
  if (element === '金') elements.metal++;
  if (element === '水') elements.water++;
});

console.log('\n五行统计:');
console.log('木:', elements.wood);
console.log('火:', elements.fire);
console.log('土:', elements.earth);
console.log('金:', elements.metal);
console.log('水:', elements.water);
```

### 示例3：批量排盘

```typescript
import { BaZi } from './src';

const birthDates = [
  { year: 1990, month: 5, day: 15, hour: 10, minute: 30, gender: 'male' },
  { year: 1985, month: 8, day: 20, hour: 14, minute: 15, gender: 'female' },
  { year: 2000, month: 1, day: 1, hour: 0, minute: 30, gender: 'male' }
];

birthDates.forEach((date, index) => {
  console.log(`\n========== 第${index + 1}个八字 ==========`);
  const bazi = new BaZi(date);
  const result = bazi.getResult();
  console.log(`四柱: ${result.eightChar.year.name} ${result.eightChar.month.name} ${result.eightChar.day.name} ${result.eightChar.hour.name}`);
  console.log(`日主: ${result.dayMaster.description}`);
});
```

### 示例4：使用编译后的版本

```javascript
const { BaZi } = require('./dist');

const bazi = new BaZi({
  year: 1995,
  month: 6,
  day: 20,
  hour: 8,
  minute: 0,
  gender: 'female'
});

const result = bazi.getResult();
console.log(JSON.stringify(result, null, 2));
```

## 注意事项

### 1. 时间格式

- 年、月、日使用**公历**（阳历）
- 时间采用24小时制（0-23）
- 程序会自动转换为农历进行八字计算

### 2. 时辰问题

中国传统时辰划分：
- 子时：23:00-01:00
- 丑时：01:00-03:00
- 寅时：03:00-05:00
- 卯时：05:00-07:00
- 辰时：07:00-09:00
- 巳时：09:00-11:00
- 午时：11:00-13:00
- 未时：13:00-15:00
- 申时：15:00-17:00
- 酉时：17:00-19:00
- 戌时：19:00-21:00
- 亥时：21:00-23:00

注意：夜晚23点到24点属于次日子时。

### 3. 性别影响

性别会影响大运的顺逆：
- 男命阳年生人，顺行大运
- 男命阴年生人，逆行大运
- 女命阳年生人，逆行大运
- 女命阴年生人，顺行大运

### 4. 数据类型

```typescript
// TypeScript类型定义
interface BaZiInput {
  year: number;         // 必需
  month: number;        // 必需
  day: number;          // 必需
  hour: number;         // 必需
  minute: number;       // 必需
  second?: number;      // 可选，默认0
  gender: 'male' | 'female';  // 必需
}
```

## 常见问题

### Q: 如何判断八字强弱？

A: 需要综合分析日主在月令的状态、四柱中各五行的力量对比等因素。本库提供基础的八字信息，具体强弱判断需要使用者根据传统命理学规则自行分析。

### Q: 大运起运年龄如何计算？

A: 起运年龄根据出生时间距离最近节气的时间计算，男女顺逆不同。本库使用tyme4ts自动计算起运时间。

### Q: 能否获取流年信息？

A: 当前版本主要提供八字排盘和大运信息。流年可以通过遍历年份，为每年创建新的八字实例来分析。

### Q: 如何处理闰月出生？

A: tyme4ts库会自动处理闰月的转换，使用公历输入即可正确计算。

## 运行示例

```bash
# 编译项目
npm run build

# 运行基础示例
npm run example

# 运行高级示例
npm run example:advanced

# 地支藏干与十神分析示例
npm run example:hidden

# 直接运行编译后的版本
node examples/using-compiled.js
```

## 技术支持

如遇到问题，请查看：
1. 项目README.md
2. tyme4ts文档: https://github.com/6tail/tyme4ts
3. 提交Issue到项目仓库
