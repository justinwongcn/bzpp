const express = require('express');
const cors = require('cors');
const path = require('path');
const { BaZi } = require('./dist');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API 端点：计算八字
app.post('/api/bazi', (req, res) => {
  try {
    const { year, month, day, hour, minute, second = 0, gender } = req.body;
    
    // 验证输入
    if (!year || !month || !day || hour === undefined || minute === undefined || !gender) {
      return res.status(400).json({ 
        error: '缺少必要参数',
        required: ['year', 'month', 'day', 'hour', 'minute', 'gender']
      });
    }

    if (!['male', 'female'].includes(gender)) {
      return res.status(400).json({ error: '性别必须是 male 或 female' });
    }

    const bazi = new BaZi({
      year: parseInt(year),
      month: parseInt(month),
      day: parseInt(day),
      hour: parseInt(hour),
      minute: parseInt(minute),
      second: parseInt(second),
      gender
    });

    const result = bazi.getResult();
    const formatted = bazi.getFormattedResult();

    res.json({
      success: true,
      data: result,
      formatted
    });
  } catch (error) {
    console.error('计算八字出错:', error);
    res.status(500).json({ 
      error: '计算失败', 
      message: error.message 
    });
  }
});

// 示例数据端点
app.get('/api/examples', (req, res) => {
  const examples = [
    {
      name: '示例1 - 男性',
      data: { year: 1990, month: 5, day: 15, hour: 10, minute: 30, gender: 'male' }
    },
    {
      name: '示例2 - 女性',
      data: { year: 1985, month: 8, day: 20, hour: 14, minute: 15, gender: 'female' }
    },
    {
      name: '示例3 - 子时',
      data: { year: 2000, month: 1, day: 1, hour: 0, minute: 30, gender: 'male' }
    }
  ];
  res.json(examples);
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '八字排盘服务运行中' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🎋 八字排盘服务已启动！\n`);
  console.log(`   本地访问: http://localhost:${PORT}`);
  console.log(`   网络访问: http://0.0.0.0:${PORT}\n`);
  console.log(`API 端点:`);
  console.log(`   POST /api/bazi - 计算八字排盘`);
  console.log(`   GET  /api/examples - 获取示例数据`);
  console.log(`   GET  /api/health - 健康检查\n`);
});
