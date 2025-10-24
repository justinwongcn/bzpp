import { BaZi, BaZiResult } from '../src';

console.log('八字排盘系统演示\n');

const examples = [
  {
    name: '示例1 - 男性',
    input: {
      year: 1990,
      month: 5,
      day: 15,
      hour: 10,
      minute: 30,
      gender: 'male' as const
    }
  },
  {
    name: '示例2 - 女性',
    input: {
      year: 1985,
      month: 8,
      day: 20,
      hour: 14,
      minute: 15,
      gender: 'female' as const
    }
  },
  {
    name: '示例3 - 子时',
    input: {
      year: 2000,
      month: 1,
      day: 1,
      hour: 0,
      minute: 30,
      gender: 'male' as const
    }
  }
];

examples.forEach(example => {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`  ${example.name}`);
  console.log('='.repeat(70));
  
  const bazi = new BaZi(example.input);
  console.log(bazi.getFormattedResult());
});

console.log('\n演示：获取结构化数据\n');
const bazi = new BaZi(examples[0].input);
const result: BaZiResult = bazi.getResult();

console.log('四柱信息:');
console.log('  年柱:', result.eightChar.year.name, 
  `- 天干:${result.eightChar.year.heavenStem}`, 
  `地支:${result.eightChar.year.earthBranch}`,
  `五行:${result.eightChar.year.element}`);
console.log('  月柱:', result.eightChar.month.name,
  `- 天干:${result.eightChar.month.heavenStem}`,
  `地支:${result.eightChar.month.earthBranch}`,
  `五行:${result.eightChar.month.element}`);
console.log('  日柱:', result.eightChar.day.name,
  `- 天干:${result.eightChar.day.heavenStem}`,
  `地支:${result.eightChar.day.earthBranch}`,
  `五行:${result.eightChar.day.element}`);
console.log('  时柱:', result.eightChar.hour.name,
  `- 天干:${result.eightChar.hour.heavenStem}`,
  `地支:${result.eightChar.hour.earthBranch}`,
  `五行:${result.eightChar.hour.element}`);

console.log('\n日主信息:');
console.log('  ', result.dayMaster.description);

console.log('\n大运前5步:');
result.decadeFortunes.slice(0, 5).forEach(fortune => {
  console.log(`  ${fortune.startAge}-${fortune.endAge}岁: ${fortune.name}`);
});
