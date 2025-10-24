const form = document.getElementById('bazi-form');
const formattedResultEl = document.getElementById('formatted-result');
const jsonResultEl = document.getElementById('json-result');
const jsonPre = jsonResultEl.querySelector('pre');
const loadExampleBtn = document.getElementById('load-example');
const resetBtn = document.getElementById('reset-form');

const apiBase = '';

const showLoading = () => {
  document.body.classList.add('loading');
};

const hideLoading = () => {
  document.body.classList.remove('loading');
};

const formatDatetime = ({ year, month, day, hour, minute, second }) => {
  const pad = n => String(n).padStart(2, '0');
  return `${year}-${pad(month)}-${pad(day)} ${pad(hour)}:${pad(minute)}:${pad(second || 0)}`;
};

const renderResult = (data, formatted) => {
  formattedResultEl.textContent = formatted.trim();
  jsonPre.textContent = JSON.stringify(data, null, 2);
  jsonResultEl.classList.remove('hidden');
};

const handleError = (error) => {
  formattedResultEl.textContent = `⚠️ 计算失败：${error}`;
  jsonResultEl.classList.add('hidden');
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
  formattedResultEl.textContent = '请填写出生信息，然后点击 "计算八字" 查看结果。';
  jsonResultEl.classList.add('hidden');
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

    renderResult(result.data, result.formatted);
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
      formattedResultEl.textContent = `已加载示例：${formatDatetime(sample)}\n性别：${sample.gender === 'male' ? '男' : '女'}\n点击"计算八字"查看排盘结果。`;
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
