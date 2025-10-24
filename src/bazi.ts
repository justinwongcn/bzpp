import {
  SolarTime,
  EightChar,
  SixtyCycle,
  Gender,
  ChildLimit,
  HeavenStem
} from 'tyme4ts';

export interface BaZiInput {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second?: number;
  gender: 'male' | 'female';
}

export interface PillarInfo {
  name: string;
  heavenStem: string;
  earthBranch: string;
  element: string;
  yinYang: string;
  hideHeavenStems: Array<{
    stem: string;
    type: string;
  }>;
}

export interface TenGodInfo {
  year: string;
  month: string;
  day: string;
  hour: string;
}

export interface DecadeFortuneInfo {
  age: number;
  startAge: number;
  endAge: number;
  heavenStem: string;
  earthBranch: string;
  name: string;
}

export interface BaZiResult {
  birthTime: {
    solar: string;
    lunar: string;
  };
  gender: string;
  eightChar: {
    year: PillarInfo;
    month: PillarInfo;
    day: PillarInfo;
    hour: PillarInfo;
  };
  tenGod: TenGodInfo;
  dayMaster: {
    heavenStem: string;
    element: string;
    description: string;
  };
  childLimit: {
    yearCount: number;
    monthCount: number;
    dayCount: number;
    hourCount: number;
    minuteCount: number;
    startAge: number;
    endAge: number;
    forward: boolean;
  };
  decadeFortunes: DecadeFortuneInfo[];
  specialInfo: {
    fetalOrigin: string;
    fetalBreath: string;
    ownSign: string;
    bodySign: string;
    duty: string;
  };
}

export class BaZi {
  private solarTime: SolarTime;
  private eightChar: EightChar;
  private gender: Gender;
  private childLimit: ChildLimit;

  constructor(input: BaZiInput) {
    const { year, month, day, hour, minute, second = 0, gender } = input;
    
    this.solarTime = SolarTime.fromYmdHms(year, month, day, hour, minute, second);
    
    const lunarHour = this.solarTime.getLunarHour();
    this.eightChar = lunarHour.getEightChar();
    
    this.gender = gender === 'male' ? Gender.MAN : Gender.WOMAN;
    this.childLimit = ChildLimit.fromSolarTime(this.solarTime, this.gender);
  }

  private getPillarInfo(cycle: SixtyCycle): PillarInfo {
    const heavenStem = cycle.getHeavenStem();
    const earthBranch = cycle.getEarthBranch();
    const element = heavenStem.getElement();
    const yinYang = heavenStem.getYinYang();
    
    const hideHeavenStems = earthBranch.getHideHeavenStems().map(hide => ({
      stem: hide.getHeavenStem().getName(),
      type: this.getHideHeavenStemTypeName(hide.getType())
    }));

    return {
      name: cycle.getName(),
      heavenStem: heavenStem.getName(),
      earthBranch: earthBranch.getName(),
      element: element.getName(),
      yinYang: yinYang === 1 ? '阳' : '阴',
      hideHeavenStems
    };
  }

  private getHideHeavenStemTypeName(type: number): string {
    const types = ['余气', '中气', '本气'];
    return types[type] || '未知';
  }

  private getTenGod(dayMaster: HeavenStem, target: HeavenStem): string {
    return dayMaster.getTenStar(target).getName();
  }

  getDecadeFortunes(count: number = 10): DecadeFortuneInfo[] {
    const fortunes: DecadeFortuneInfo[] = [];
    const startFortune = this.childLimit.getStartDecadeFortune();
    
    for (let i = 0; i < count; i++) {
      const fortune = startFortune.next(i);
      fortunes.push({
        age: fortune.getStartAge(),
        startAge: fortune.getStartAge(),
        endAge: fortune.getEndAge(),
        heavenStem: fortune.getSixtyCycle().getHeavenStem().getName(),
        earthBranch: fortune.getSixtyCycle().getEarthBranch().getName(),
        name: fortune.getName()
      });
    }
    
    return fortunes;
  }

  getResult(): BaZiResult {
    const yearCycle = this.eightChar.getYear();
    const monthCycle = this.eightChar.getMonth();
    const dayCycle = this.eightChar.getDay();
    const hourCycle = this.eightChar.getHour();
    
    const dayMaster = dayCycle.getHeavenStem();
    
    const lunarHour = this.solarTime.getLunarHour();
    const lunarDay = lunarHour.getLunarDay();
    const lunarMonth = lunarDay.getLunarMonth();
    
    const tenGod: TenGodInfo = {
      year: this.getTenGod(dayMaster, yearCycle.getHeavenStem()),
      month: this.getTenGod(dayMaster, monthCycle.getHeavenStem()),
      day: '日主',
      hour: this.getTenGod(dayMaster, hourCycle.getHeavenStem())
    };

    return {
      birthTime: {
        solar: `${this.solarTime.getYear()}年${this.solarTime.getMonth()}月${this.solarTime.getDay()}日 ${this.solarTime.getHour()}:${this.solarTime.getMinute()}:${this.solarTime.getSecond()}`,
        lunar: `${lunarDay.getYear()}年${lunarDay.getMonth()}月${lunarDay.getDay()}日 ${lunarHour.getHour()}时`
      },
      gender: this.gender === Gender.MAN ? '男' : '女',
      eightChar: {
        year: this.getPillarInfo(yearCycle),
        month: this.getPillarInfo(monthCycle),
        day: this.getPillarInfo(dayCycle),
        hour: this.getPillarInfo(hourCycle)
      },
      tenGod,
      dayMaster: {
        heavenStem: dayMaster.getName(),
        element: dayMaster.getElement().getName(),
        description: `${dayMaster.getName()}${dayMaster.getElement().getName()}`
      },
      childLimit: {
        yearCount: this.childLimit.getYearCount(),
        monthCount: this.childLimit.getMonthCount(),
        dayCount: this.childLimit.getDayCount(),
        hourCount: this.childLimit.getHourCount(),
        minuteCount: this.childLimit.getMinuteCount(),
        startAge: this.childLimit.getStartDecadeFortune().getStartAge(),
        endAge: this.childLimit.getStartDecadeFortune().getEndAge(),
        forward: this.childLimit.isForward()
      },
      decadeFortunes: this.getDecadeFortunes(),
      specialInfo: {
        fetalOrigin: this.eightChar.getFetalOrigin().getName(),
        fetalBreath: this.eightChar.getFetalBreath().getName(),
        ownSign: this.eightChar.getOwnSign().getName(),
        bodySign: this.eightChar.getBodySign().getName(),
        duty: this.eightChar.getDuty().getName()
      }
    };
  }

  getFormattedResult(): string {
    const result = this.getResult();
    
    let output = '\n';
    output += '═'.repeat(60) + '\n';
    output += '                    八字排盘                    \n';
    output += '═'.repeat(60) + '\n\n';
    
    output += `出生时间（公历）: ${result.birthTime.solar}\n`;
    output += `出生时间（农历）: ${result.birthTime.lunar}\n`;
    output += `性别: ${result.gender}\n\n`;
    
    output += '─'.repeat(60) + '\n';
    output += '                    四柱八字                    \n';
    output += '─'.repeat(60) + '\n';
    output += `        年柱          月柱          日柱          时柱\n`;
    output += `        ${result.eightChar.year.name}          ${result.eightChar.month.name}          ${result.eightChar.day.name}          ${result.eightChar.hour.name}\n`;
    output += `        (${result.eightChar.year.element})          (${result.eightChar.month.element})          (${result.eightChar.day.element})          (${result.eightChar.hour.element})\n\n`;
    
    output += '─'.repeat(60) + '\n';
    output += '                    十神                    \n';
    output += '─'.repeat(60) + '\n';
    output += `        ${result.tenGod.year}          ${result.tenGod.month}          ${result.tenGod.day}          ${result.tenGod.hour}\n\n`;
    
    output += '─'.repeat(60) + '\n';
    output += '                    日主                    \n';
    output += '─'.repeat(60) + '\n';
    output += `日主: ${result.dayMaster.description}\n\n`;
    
    output += '─'.repeat(60) + '\n';
    output += '                    地支藏干                    \n';
    output += '─'.repeat(60) + '\n';
    output += `年支 ${result.eightChar.year.earthBranch}: ${result.eightChar.year.hideHeavenStems.map(h => `${h.stem}(${h.type})`).join(' ')}\n`;
    output += `月支 ${result.eightChar.month.earthBranch}: ${result.eightChar.month.hideHeavenStems.map(h => `${h.stem}(${h.type})`).join(' ')}\n`;
    output += `日支 ${result.eightChar.day.earthBranch}: ${result.eightChar.day.hideHeavenStems.map(h => `${h.stem}(${h.type})`).join(' ')}\n`;
    output += `时支 ${result.eightChar.hour.earthBranch}: ${result.eightChar.hour.hideHeavenStems.map(h => `${h.stem}(${h.type})`).join(' ')}\n\n`;
    
    output += '─'.repeat(60) + '\n';
    output += '                    起运信息                    \n';
    output += '─'.repeat(60) + '\n';
    output += `起运年龄: ${result.childLimit.yearCount}年${result.childLimit.monthCount}月${result.childLimit.dayCount}日\n`;
    output += `运势方向: ${result.childLimit.forward ? '顺行' : '逆行'}\n\n`;
    
    output += '─'.repeat(60) + '\n';
    output += '                    大运                    \n';
    output += '─'.repeat(60) + '\n';
    result.decadeFortunes.forEach(fortune => {
      output += `${fortune.startAge}-${fortune.endAge}岁  ${fortune.name} (${fortune.heavenStem}${fortune.earthBranch})\n`;
    });
    output += '\n';
    
    output += '─'.repeat(60) + '\n';
    output += '                    其他信息                    \n';
    output += '─'.repeat(60) + '\n';
    output += `胎元: ${result.specialInfo.fetalOrigin}\n`;
    output += `胎息: ${result.specialInfo.fetalBreath}\n`;
    output += `命宫: ${result.specialInfo.ownSign}\n`;
    output += `身宫: ${result.specialInfo.bodySign}\n`;
    output += `建除: ${result.specialInfo.duty}\n\n`;
    
    output += '═'.repeat(60) + '\n';
    
    return output;
  }
}
