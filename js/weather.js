// ========================================================
// MODULE: weather.js - Gọi API, Chuẩn hóa Dữ liệu & Xử lý Nghiệp vụ Thời tiết
// ========================================================

const WEATHER_CODES = {
  0: { descVi: 'Trời quang đãng, nắng ấm', descEn: 'Clear Sky, Sunny', icon: 'fa-solid fa-sun', iconColor: '#facc15', theme: 'sunny', fx: 'sunny' },
  1: { descVi: 'Hầu như không mây, trời trong', descEn: 'Mainly Clear, Bright', icon: 'fa-solid fa-cloud-sun', iconColor: '#fde047', theme: 'sunny', fx: 'sunny' },
  2: { descVi: 'Trời có mây rải rác', descEn: 'Partly Cloudy', icon: 'fa-solid fa-cloud-sun', iconColor: '#cbd5e1', theme: 'cloudy', fx: 'cloudy' },
  3: { descVi: 'Trời nhiều mây, âm u', descEn: 'Overcast & Cloudy', icon: 'fa-solid fa-cloud', iconColor: '#94a3b8', theme: 'cloudy', fx: 'cloudy' },
  45: { descVi: 'Có sương mù dày', descEn: 'Dense Fog', icon: 'fa-solid fa-smog', iconColor: '#cbd5e1', theme: 'fog', fx: 'fog' },
  48: { descVi: 'Sương mù đọng băng', descEn: 'Depositing Rime Fog', icon: 'fa-solid fa-smog', iconColor: '#e2e8f0', theme: 'fog', fx: 'fog' },
  51: { descVi: 'Mưa phùn nhẹ', descEn: 'Light Drizzle', icon: 'fa-solid fa-cloud-rain', iconColor: '#38bdf8', theme: 'rain', fx: 'rain-light' },
  53: { descVi: 'Mưa phùn hạt vừa', descEn: 'Moderate Drizzle', icon: 'fa-solid fa-cloud-rain', iconColor: '#38bdf8', theme: 'rain', fx: 'rain-light' },
  55: { descVi: 'Mưa phùn dày hạt', descEn: 'Dense Drizzle', icon: 'fa-solid fa-cloud-showers-heavy', iconColor: '#0284c7', theme: 'rain', fx: 'rain' },
  61: { descVi: 'Mưa nhỏ rải rác', descEn: 'Slight Rain Showers', icon: 'fa-solid fa-cloud-rain', iconColor: '#38bdf8', theme: 'rain', fx: 'rain-light' },
  63: { descVi: 'Mưa vừa', descEn: 'Moderate Rain', icon: 'fa-solid fa-cloud-showers-heavy', iconColor: '#0284c7', theme: 'rain', fx: 'rain' },
  65: { descVi: 'Mưa to xối xả', descEn: 'Heavy Rain Showers', icon: 'fa-solid fa-cloud-showers-heavy', iconColor: '#0369a1', theme: 'rain', fx: 'rain-heavy' },
  71: { descVi: 'Tuyết rơi nhẹ', descEn: 'Light Snow Fall', icon: 'fa-regular fa-snowflake', iconColor: '#e0f2fe', theme: 'snow', fx: 'snow' },
  73: { descVi: 'Tuyết rơi vừa', descEn: 'Moderate Snow', icon: 'fa-solid fa-snowflake', iconColor: '#bae6fd', theme: 'snow', fx: 'snow' },
  75: { descVi: 'Bão tuyết lớn', descEn: 'Heavy Snowstorm', icon: 'fa-solid fa-snowflake', iconColor: '#7dd3fc', theme: 'snow', fx: 'snow-heavy' },
  80: { descVi: 'Mưa rào nhẹ', descEn: 'Light Rain Showers', icon: 'fa-solid fa-cloud-sun-rain', iconColor: '#38bdf8', theme: 'rain', fx: 'rain' },
  81: { descVi: 'Mưa rào từng cơn', descEn: 'Periodic Showers', icon: 'fa-solid fa-cloud-showers-heavy', iconColor: '#0284c7', theme: 'rain', fx: 'rain-heavy' },
  82: { descVi: 'Mưa rào như trút nước', descEn: 'Violent Torrential Rain', icon: 'fa-solid fa-cloud-showers-water', iconColor: '#075985', theme: 'rain', fx: 'rain-heavy' },
  95: { descVi: 'Có giông bão sấm chớp', descEn: 'Thunderstorm & Lightning', icon: 'fa-solid fa-bolt-lightning', iconColor: '#f59e0b', theme: 'thunder', fx: 'thunder' },
  96: { descVi: 'Giông lốc kèm mưa đá', descEn: 'Thunderstorm with Hail', icon: 'fa-solid fa-cloud-bolt', iconColor: '#f59e0b', theme: 'thunder', fx: 'thunder' },
  99: { descVi: 'Giông bão dữ dội, nguy hiểm', descEn: 'Severe Dangerous Storm', icon: 'fa-solid fa-cloud-bolt', iconColor: '#ef4444', theme: 'thunder', fx: 'thunder' },
};

function getWeatherInfo(code, isDay = 1) {
  const isEn = window.currentLang === 'en';
  const defaultInfo = { desc: isEn ? 'Normal Weather' : 'Thời tiết bình thường', icon: 'fa-solid fa-cloud', iconColor: '#ffffff', theme: 'sunny', fx: 'none' };
  const raw = WEATHER_CODES[code];
  if (!raw) return defaultInfo;

  const desc = isEn ? raw.descEn : raw.descVi;
  const info = { ...raw, desc };

  if (isDay === 0) {
    if (code === 0) return { desc: isEn ? 'Clear Starlit Night' : 'Đêm quang đãng, đầy sao', icon: 'fa-solid fa-moon', iconColor: '#fef08a', theme: 'night', fx: 'stars' };
    if (code <= 3) return { desc: isEn ? 'Cloudy Night' : 'Đêm nhiều mây', icon: 'fa-solid fa-cloud-moon', iconColor: '#cbd5e1', theme: 'night', fx: 'cloudy-night' };
    return { ...info, theme: info.theme === 'sunny' ? 'night' : info.theme };
  }
  return info;
}

function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/[&<>'"]/g, tag => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[tag] || tag));
}

function sanitizeInput(val) {
  if (typeof val !== 'string') return '';
  return val.trim().slice(0, 80).replace(/[\u0000-\u001F\u007F-\u009F<>]/g, '');
}

async function safeFetch(url, timeoutMs = 8000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error(`Phản hồi lỗi (${response.status})`);
    return await response.json();
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') throw new Error('Kết nối quá thời gian chờ (Timeout).');
    throw err;
  }
}

async function fetchWeatherData(lat, lon, placeName) {
  if (!isValidCoordinate(lat, lon)) throw new Error('Tọa độ không hợp lệ.');
  const safeLat = encodeURIComponent(lat);
  const safeLon = encodeURIComponent(lon);
  let data = null;

  // 1. Thử kết nối Django Backend REST API (thích ứng tự động với 0.0.0.0, localhost, hoặc LAN IP)
  try {
    const apiEndpoint = `${window.location.origin}/api/weather/forecast/?lat=${safeLat}&lon=${safeLon}&place=${encodeURIComponent(placeName || '')}`;
    const backendRes = await safeFetch(apiEndpoint, 2000);
    if (backendRes && backendRes.status === 'success' && backendRes.data) {
      data = backendRes.data;
    }
  } catch (e) {}

  // 2. Fallback trực tiếp Open-Meteo
  if (!data) {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${safeLat}&longitude=${safeLon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,uv_index,visibility&hourly=temperature_2m,weather_code,precipitation_probability,precipitation,visibility,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&forecast_days=14&timezone=auto`;
    data = await safeFetch(weatherUrl, 8000);
  }
  return data;
}

function getMoonPhase(date = new Date()) {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  if (month < 3) { year--; month += 12; }
  const c = 365.25 * year;
  const e = 30.6 * month;
  let jd = c + e + day - 694039.09;
  jd /= 29.5305882;
  const b = parseInt(jd);
  jd -= b;
  const phase = Math.round(jd * 8) % 8;
  const illum = Math.round((1 - Math.cos(jd * 2 * Math.PI)) / 2 * 100);

  const phases = [
    { name: '🌑 Trăng mới (Sóc)', desc: 'Thủy triều thấp' },
    { name: '🌒 Trăng lưỡi liềm đầu tháng', desc: 'Thủy triều vừa' },
    { name: '🌓 Trăng bán nguyệt đầu tháng', desc: 'Triều kém' },
    { name: '🌔 Trăng trương đầu tháng', desc: 'Triều vừa' },
    { name: '🌕 Trăng tròn (Rằm)', desc: 'Triều cường cực đại' },
    { name: '🌖 Trăng trương cuối tháng', desc: 'Triều vừa' },
    { name: '🌗 Trăng bán nguyệt cuối tháng', desc: 'Triều kém' },
    { name: '🌘 Trăng lưỡi liềm cuối tháng', desc: 'Thủy triều thấp' },
  ];
  return { ...phases[phase], illum };
}

function checkAndShowWeatherAlerts(current, daily, hourly) {
  const severeBanner = document.getElementById('severeAlertBanner');
  const alertTitle = document.getElementById('alertTitle');
  const alertDesc = document.getElementById('alertDesc');
  const rainBanner = document.getElementById('rainNoticeBanner');
  const rainText = document.getElementById('rainNoticeText');

  let hasSevere = false;
  let sTitle = '';
  let sDesc = '';

  const windMax = daily && daily.wind_speed_10m_max ? daily.wind_speed_10m_max[0] : current.wind_speed_10m;
  const uvMax = daily && daily.uv_index_max ? daily.uv_index_max[0] : (current.uv_index || 0);

  if ([95, 96, 99].includes(current.weather_code)) {
    hasSevere = true;
    sTitle = '⚠️ CẢNH BÁO GIÔNG BÃO & SẤM CHỚP NGUY HIỂM';
    sDesc = 'Khu vực đang xảy ra dông lốc mạnh kèm sấm sét. Đề nghị hạn chế ra đường và trú ẩn an toàn.';
  } else if (windMax >= 45) {
    hasSevere = true;
    sTitle = `🚩 CẢNH BÁO GIÓ MẠNH CẤP ${windMax >= 60 ? '7-8' : '6'} (${Math.round(windMax)} km/h)`;
    sDesc = 'Gió giật mạnh nguy hiểm khi di chuyển trên đường.';
  } else if (uvMax >= 9) {
    hasSevere = true;
    sTitle = `☀️ CẢNH BÁO CHỈ SỐ TIA UV NGUY HẠI CỰC CAO (UV: ${uvMax})`;
    sDesc = 'Bức xạ tia cực tím đạt mức nguy hại. Tránh tiếp xúc trực tiếp dưới ánh nắng từ 10h - 15h.';
  }

  if (severeBanner) {
    if (hasSevere) {
      if (alertTitle) alertTitle.textContent = sTitle;
      if (alertDesc) alertDesc.textContent = sDesc;
      severeBanner.classList.remove('hidden');
    } else {
      severeBanner.classList.add('hidden');
    }
  }

  if (rainBanner && hourly && hourly.precipitation_probability) {
    const next2hPops = hourly.precipitation_probability.slice(0, 3);
    const maxPop = Math.max(...next2hPops);
    if (maxPop >= 50 && (current.precipitation || 0) < 0.2) {
      if (rainText) rainText.textContent = `Khả năng cao có mưa trong 1-2 giờ tới (Xác suất: ${maxPop}%). Hãy mang theo ô/áo mưa!`;
      rainBanner.classList.remove('hidden');
    } else {
      rainBanner.classList.add('hidden');
    }
  }
}

function formatTemp(val, unit = 'C') {
  if (val === undefined || val === null) return '--';
  if (unit === 'F') return Math.round((val * 9) / 5 + 32);
  return Math.round(val);
}

function getWindDirection(deg) {
  const directions = ['Bắc', 'Đông Bắc', 'Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc'];
  return directions[Math.round(deg / 45) % 8];
}

function getUVDescription(uv) {
  if (uv <= 2) return 'Thấp (An toàn)';
  if (uv <= 5) return 'Trung bình';
  if (uv <= 7) return 'Cao (Nên che chắn)';
  if (uv <= 10) return 'Rất cao (Nguy hại)';
  return 'Cực độ nguy hiểm!';
}
