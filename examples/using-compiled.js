const { BaZi } = require('../dist');

console.log('使用编译后的版本测试\n');

const bazi = new BaZi({
  year: 1995,
  month: 6,
  day: 20,
  hour: 8,
  minute: 0,
  gender: 'female'
});

console.log(bazi.getFormattedResult());

const result = bazi.getResult();
console.log('\n获取JSON数据:');
console.log(JSON.stringify(result, null, 2));
