import { BaZi } from '../src';

console.log('地支藏干与十神分析示例\n');

const bazi = new BaZi({
  year: 1990,
  month: 5,
  day: 15,
  hour: 10,
  minute: 30,
  gender: 'male'
});

const result = bazi.getResult();

console.log('═'.repeat(70));
console.log('                      地支藏干详细分析');
console.log('═'.repeat(70));
console.log(`\n日主: ${result.dayMaster.description} (${result.dayMaster.element}行)\n`);

// 分析每个柱的地支藏干
const pillars = [
  { name: '年支', pillar: result.eightChar.year },
  { name: '月支', pillar: result.eightChar.month },
  { name: '日支', pillar: result.eightChar.day },
  { name: '时支', pillar: result.eightChar.hour }
];

pillars.forEach(({ name, pillar }) => {
  console.log('─'.repeat(70));
  console.log(`${name} ${pillar.earthBranch} (${pillar.name})`);
  console.log('─'.repeat(70));
  
  pillar.hideHeavenStems.forEach((hide, index) => {
    console.log(`  ${index + 1}. ${hide.stem} - ${hide.tenGod} (${hide.type})`);
  });
  console.log();
});

// 统计十神分布
console.log('═'.repeat(70));
console.log('                      十神统计（包含藏干）');
console.log('═'.repeat(70));

const tenGodCount: Record<string, number> = {};

// 统计天干十神
[result.tenGod.year, result.tenGod.month, result.tenGod.hour].forEach(tg => {
  if (tg !== '日主') {
    tenGodCount[tg] = (tenGodCount[tg] || 0) + 1;
  }
});

// 统计藏干十神
pillars.forEach(({ pillar }) => {
  pillar.hideHeavenStems.forEach(hide => {
    tenGodCount[hide.tenGod] = (tenGodCount[hide.tenGod] || 0) + 1;
  });
});

Object.entries(tenGodCount)
  .sort((a, b) => b[1] - a[1])
  .forEach(([tenGod, count]) => {
    console.log(`  ${tenGod}: ${count}`);
  });

console.log('\n' + '═'.repeat(70));
console.log('                      十神类型分析');
console.log('═'.repeat(70));

// 分类统计
const categories = {
  '比劫': ['比肩', '劫财'],
  '食伤': ['食神', '伤官'],
  '财星': ['偏财', '正财'],
  '官杀': ['正官', '七杀'],
  '印星': ['正印', '偏印']
};

Object.entries(categories).forEach(([category, gods]) => {
  const total = gods.reduce((sum, god) => sum + (tenGodCount[god] || 0), 0);
  if (total > 0) {
    console.log(`\n${category}类:`);
    gods.forEach(god => {
      const count = tenGodCount[god] || 0;
      if (count > 0) {
        console.log(`  ${god}: ${count}`);
      }
    });
  }
});

console.log('\n' + '═'.repeat(70));
