import { BaZi } from '../src';

const bazi = new BaZi({
  year: 1990,
  month: 5,
  day: 15,
  hour: 10,
  minute: 30,
  gender: 'male'
});

console.log(bazi.getFormattedResult());
