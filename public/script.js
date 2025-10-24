const form = document.getElementById('bazi-form');
const resultContainer = document.getElementById('result-container');
const loadExampleBtn = document.getElementById('load-example');
const resetBtn = document.getElementById('reset-form');

const apiBase = '';

const elementColors = {
  '金': '#D4AF37',
  '木': '#2E7D32',
  '水': '#1976D2',
  '火': '#D32F2F',
  '土': '#8D6E63'
};

const showLoading = () => {
  document.body.classList.add('loading');
};

const hideLoading = () => {
  document.body.classList.remove('loading');
};

const formatDatetime = ({ year, month, day, hour, minute, second }) => {
  const pad = n => String(n).padStart(2, '0');
  return `${year}年${pad(month)}月${pad(day)}日 ${pad(hour)}:${pad(minute)}:${pad(second || 0)}`;
};

const getElementColor = (element) => {
  return elementColors[element] || '#666';
};

const renderBasicInfo = (data) => {
  document.getElementById('solar-time').textContent = data.birthTime.solar;
  document.getElementById('lunar-time').textContent = data.birthTime.lunar;
  document.getElementById('gender-info').textContent = data.gender;
};

const renderPillars = (data) => {
  const pillars = ['year', 'month', 'day', 'hour'];
  
  pillars.forEach(pillar => {
    const pillarData = data.eightChar[pillar];
    const tenGod = data.tenGod[pillar];
    
    document.getElementById(`${pillar}-pillar`).textContent = pillarData.name;
    document.getElementById(`${pillar}-element`).textContent = pillarData.element;
    document.getElementById(`${pillar}-element`).style.color = getElementColor(pillarData.element);
    document.getElementById(`${pillar}-tengod`).textContent = tenGod;
  });
};

const renderDayMaster = (data) => {
  document.getElementById('daymaster-name').textContent = data.dayMaster.description;
  const elementEl = document.getElementById('daymaster-element');
  elementEl.textContent = data.dayMaster.element;
  elementEl.style.color = getElementColor(data.dayMaster.element);
};

const renderHiddenStems = (data) => {
  const container = document.getElementById('hidden-stems-content');
  container.innerHTML = '';
  
  const pillars = [
    { name: '年支', key: 'year', branch: data.eightChar.year.earthBranch },
    { name: '月支', key: 'month', branch: data.eightChar.month.earthBranch },
    { name: '日支', key: 'day', branch: data.eightChar.day.earthBranch },
    { name: '时支', key: 'hour', branch: data.eightChar.hour.earthBranch }
  ];
  
  pillars.forEach(pillar => {
    const pillarData = data.eightChar[pillar.key];
    const div = document.createElement('div');
    div.className = 'hidden-stem-item';
    
    let stemsHtml = '';
    pillarData.hideHeavenStems.forEach(hide => {
      stemsHtml += `
        <div class="stem-detail">
          <span class="stem-name">${hide.stem}</span>
          <span class="stem-tengod">${hide.tenGod}</span>
          <span class="stem-type">(${hide.type})</span>
        </div>
      `;
    });
    
    div.innerHTML = `
      <div class="hidden-stem-header">
        <span class="stem-label">${pillar.name}</span>
        <span class="stem-branch">${pillar.branch}</span>
      </div>
      <div class="stem-list">${stemsHtml}</div>
    `;
    
    container.appendChild(div);
  });
};

const renderFortunes = (data) => {
  const childLimit = data.childLimit;
  const text = `起运: ${childLimit.yearCount}年${childLimit.monthCount}月${childLimit.dayCount}日 · ${childLimit.forward ? '顺行' : '逆行'}`;
  document.getElementById('childlimit-text').textContent = text;
  
  const container = document.getElementById('fortunes-content');
  container.innerHTML = '';
  
  data.decadeFortunes.forEach((fortune, index) => {
    const div = document.createElement('div');
    div.className = 'fortune-item';
    
    div.innerHTML = `
      <div class="fortune-age">${fortune.startAge}-${fortune.endAge}岁</div>
      <div class="fortune-name">${fortune.name}</div>
      <div class="fortune-stems">
        <span class="fortune-heaven">${fortune.heavenStem}</span>
        <span class="fortune-earth">${fortune.earthBranch}</span>
      </div>
    `;
    
    container.appendChild(div);
  });
};

const renderSpecialInfo = (data) => {
  const container = document.getElementById('special-info-content');
  const special = data.specialInfo;
  
  const items = [
    { label: '胎元', value: special.fetalOrigin },
    { label: '胎息', value: special.fetalBreath },
    { label: '命宫', value: special.ownSign },
    { label: '身宫', value: special.bodySign },
    { label: '建除', value: special.duty }
  ];
  
  container.innerHTML = items.map(item => `
    <div class="special-item">
      <span class="special-label">${item.label}</span>
      <span class="special-value">${item.value}</span>
    </div>
  `).join('');
};

const renderResult = (data) => {
  renderBasicInfo(data);
  renderPillars(data);
  renderDayMaster(data);
  renderHiddenStems(data);
  renderFortunes(data);
  renderSpecialInfo(data);
  
  resultContainer.classList.remove('hidden');
  
  setTimeout(() => {
    resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
};

const handleError = (error) => {
  alert(`❌ 计算失败：${error}`);
  resultContainer.classList.add('hidden');
};

const getSampleData = async () => {
  try {
    const response = await fetch(`${apiBase}/api/examples`);
    if (!response.ok) throw new Error('无法获取示例数据');
    const examples = await response.json();
    return examples[Math.floor(Math.random() * examples.length)]?.data;
  } catch (error) {
    console.error('获取示例数据失败:', error);
    return null;
  }
};

const fillForm = (data) => {
  if (!data) return;
  form.year.value = data.year;
  form.month.value = data.month;
  form.day.value = data.day;
  form.hour.value = data.hour;
  form.minute.value = data.minute;
  form.second.value = data.second || '';
  const genderInput = form.querySelector(`input[name="gender"][value="${data.gender}"]`);
  if (genderInput) genderInput.checked = true;
};

const clearForm = () => {
  form.reset();
  resultContainer.classList.add('hidden');
};

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  showLoading();

  try {
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    payload.year = Number(payload.year);
    payload.month = Number(payload.month);
    payload.day = Number(payload.day);
    payload.hour = Number(payload.hour);
    payload.minute = Number(payload.minute);
    payload.second = payload.second ? Number(payload.second) : 0;

    const response = await fetch(`${apiBase}/api/bazi`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || '计算失败');
    }

    renderResult(result.data);
  } catch (error) {
    console.error('计算八字失败:', error);
    handleError(error.message);
  } finally {
    hideLoading();
  }
});

loadExampleBtn.addEventListener('click', async () => {
  showLoading();
  try {
    const sample = await getSampleData();
    if (sample) {
      fillForm(sample);
    } else {
      throw new Error('无可用示例');
    }
  } catch (error) {
    handleError(error.message);
  } finally {
    hideLoading();
  }
});

resetBtn.addEventListener('click', () => {
  clearForm();
});

clearForm();
