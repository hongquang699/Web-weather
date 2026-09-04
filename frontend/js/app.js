// ========================================================
// MODULE: app.js - Controller Chính của Toàn bộ Website Thời Tiết
// ========================================================

const appState = {
  currentUnit: 'C',
  currentLat: 21.0285,
  currentLon: 105.8542,
  currentPlaceName: 'Hà Nội, Việt Nam',
  weatherData: null,
  activeCategory: 'vietnam',
  vnSubRegion: 'all',
  hourlyHours: 24,
  dailyDays: 7,
  themeMode: 'auto',
  favorites: getSafeFavorites(),
};

// ========================================================
// AUTHENTIC APPLE WEATHER ATMOSPHERIC CANVAS ENGINE (iOS 18 Simulation)
// ========================================================
class WeatherFXEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.currentEffect = 'sunny';
    this.animationId = null;
    this.time = 0;

    // Các thành phần khí quyển
    this.particles = [];
    this.splashes = [];
    this.clouds = [];
    this.stars = [];
    this.shootingStar = null;
    
    // Trạng thái sấm chớp
    this.lightningBolts = [];
    this.flashOpacity = 0;
    this.nextLightningTime = Date.now() + 3000;

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.initClouds();
    this.initStars();
  }

  initClouds() {
    this.clouds = [];
    const count = 7;
    for (let i = 0; i < count; i++) {
      this.clouds.push({
        x: Math.random() * (this.canvas ? this.canvas.width : 1200),
        y: 40 + Math.random() * 160,
        radius: 90 + Math.random() * 80,
        speedX: 0.18 + Math.random() * 0.25,
        opacity: 0.12 + Math.random() * 0.16,
        puffs: [
          { dx: -45, dy: 10, r: 65 },
          { dx: 0, dy: -20, r: 85 },
          { dx: 50, dy: 5, r: 70 },
          { dx: 25, dy: 15, r: 60 }
        ]
      });
    }
  }

  initStars() {
    this.stars = [];
    const count = 110;
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * (this.canvas ? this.canvas.width : 1200),
        y: Math.random() * (this.canvas ? this.canvas.height * 0.75 : 600),
        radius: 0.7 + Math.random() * 1.5,
        baseAlpha: 0.2 + Math.random() * 0.65,
        twinkleSpeed: 0.02 + Math.random() * 0.04,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  setEffect(type) {
    if (this.currentEffect === type && this.particles.length > 0) return;
    this.currentEffect = type;
    this.initParticles(type);
    if (!this.animationId) this.loop();
  }

  initParticles(type) {
    this.particles = [];
    this.splashes = [];
    this.shootingStar = null;

    if (type.includes('rain')) {
      const count = type === 'rain-heavy' ? 240 : (type === 'rain-light' ? 90 : 160);
      for (let i = 0; i < count; i++) {
        const depth = Math.random(); // 0: xa, 1: gần
        this.particles.push({
          x: Math.random() * (this.canvas.width + 200) - 100,
          y: Math.random() * this.canvas.height,
          length: depth * 22 + 10,
          speedY: depth * 14 + 12,
          speedX: -3.5 - depth * 1.5, // Gió tạt nghiêng chân thực
          width: depth * 1.2 + 0.6,
          alpha: depth * 0.45 + 0.2,
          depth
        });
      }
    } else if (type.includes('snow')) {
      const count = type === 'snow-heavy' ? 120 : 70;
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          radius: Math.random() * 3 + 1.2,
          speedY: Math.random() * 1.5 + 0.8,
          swaySpeed: Math.random() * 0.03 + 0.01,
          swayAmount: Math.random() * 1.5 + 0.5,
          seed: Math.random() * 100,
          alpha: Math.random() * 0.6 + 0.3
        });
      }
    }
  }

  triggerLightning() {
    this.flashOpacity = 0.85;
    this.lightningBolts = [];

    // Tạo tia sét nhánh (fractal lightning)
    const startX = this.canvas.width * (0.2 + Math.random() * 0.6);
    let curX = startX;
    let curY = 0;
    const boltPoints = [{ x: curX, y: curY }];

    while (curY < this.canvas.height * 0.65) {
      curY += Math.random() * 25 + 15;
      curX += (Math.random() - 0.5) * 45;
      boltPoints.push({ x: curX, y: curY });
    }
    this.lightningBolts.push(boltPoints);

    // Lên lịch cho cú sấm tiếp theo (3 - 7 giây)
    this.nextLightningTime = Date.now() + 3500 + Math.random() * 4000;
  }

  loop() {
    if (!this.ctx || !this.canvas) return;
    this.time += 0.016;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, w, h);

    // 1. Vẽ Mặt Trời & Tia Nắng (Sunny Theme)
    if (this.currentEffect === 'sunny') {
      const sunX = w * 0.78;
      const sunY = h * 0.18;

      // Quầng sáng Corona mềm mại
      const coronaGrad = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 320);
      coronaGrad.addColorStop(0, 'rgba(255, 245, 205, 0.45)');
      coronaGrad.addColorStop(0.3, 'rgba(254, 215, 170, 0.22)');
      coronaGrad.addColorStop(0.7, 'rgba(253, 186, 116, 0.08)');
      coronaGrad.addColorStop(1, 'rgba(253, 186, 116, 0)');
      ctx.fillStyle = coronaGrad;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 320, 0, Math.PI * 2);
      ctx.fill();

      // Đĩa mặt trời rực rỡ
      const sunCore = ctx.createRadialGradient(sunX, sunY, 5, sunX, sunY, 55);
      sunCore.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      sunCore.addColorStop(0.4, 'rgba(254, 240, 138, 0.85)');
      sunCore.addColorStop(1, 'rgba(250, 204, 21, 0)');
      ctx.fillStyle = sunCore;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 55, 0, Math.PI * 2);
      ctx.fill();

      // Các tia sáng (Sunbeams) quét chậm nhẹ
      ctx.save();
      ctx.translate(sunX, sunY);
      ctx.rotate(this.time * 0.03);
      for (let i = 0; i < 8; i++) {
        ctx.rotate((Math.PI * 2) / 8);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-40, 450);
        ctx.lineTo(40, 450);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }

    // 2. Vẽ Mặt Trăng & Bầu Trời Sao Đêm (Night Theme)
    if (this.currentEffect === 'stars' || this.currentEffect === 'cloudy-night') {
      // Sao đêm lấp lánh
      this.stars.forEach(s => {
        const twinkle = Math.sin(this.time * s.twinkleSpeed * 30 + s.phase);
        const alpha = Math.max(0.1, s.baseAlpha + twinkle * 0.25);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Sao băng thỉnh thoảng vụt qua
      if (!this.shootingStar && Math.random() < 0.003) {
        this.shootingStar = {
          x: Math.random() * w * 0.8,
          y: Math.random() * h * 0.3,
          vx: 9 + Math.random() * 5,
          vy: 4 + Math.random() * 3,
          length: 60 + Math.random() * 40,
          alpha: 0.9
        };
      }
      if (this.shootingStar) {
        const ss = this.shootingStar;
        ctx.strokeStyle = `rgba(255, 255, 255, ${ss.alpha})`;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - ss.vx * 4, ss.y - ss.vy * 4);
        ctx.stroke();
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.alpha -= 0.02;
        if (ss.alpha <= 0) this.shootingStar = null;
      }

      // Vầng Trăng dịu mát
      const moonX = w * 0.82;
      const moonY = h * 0.16;
      const moonGlow = ctx.createRadialGradient(moonX, moonY, 15, moonX, moonY, 180);
      moonGlow.addColorStop(0, 'rgba(240, 249, 255, 0.4)');
      moonGlow.addColorStop(0.5, 'rgba(219, 234, 254, 0.12)');
      moonGlow.addColorStop(1, 'rgba(219, 234, 254, 0)');
      ctx.fillStyle = moonGlow;
      ctx.beginPath();
      ctx.arc(moonX, moonY, 180, 0, Math.PI * 2);
      ctx.fill();

      // Đĩa trăng tròn
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(moonX, moonY, 32, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Vẽ Mây Trôi Bồng Bềnh Thực Tế (Clouds Layer)
    if (['sunny', 'cloudy', 'rain', 'rain-light', 'rain-heavy', 'thunder', 'cloudy-night'].includes(this.currentEffect)) {
      this.clouds.forEach(c => {
        c.x += c.speedX;
        if (c.x - c.radius > w) c.x = -c.radius * 2;

        const isDark = ['thunder', 'rain', 'rain-heavy'].includes(this.currentEffect);
        const cloudColor = isDark ? `rgba(20, 26, 36, ${c.opacity * 1.6})` : `rgba(255, 255, 255, ${c.opacity})`;

        ctx.fillStyle = cloudColor;
        c.puffs.forEach(p => {
          ctx.beginPath();
          ctx.arc(c.x + p.dx, c.y + p.dy, p.r, 0, Math.PI * 2);
          ctx.fill();
        });
      });
    }

    // 4. Vẽ Giọt Mưa Chân Thực & Giọt Bắn Tung Tóe (Rain Simulation)
    if (this.currentEffect.includes('rain') || this.currentEffect === 'thunder') {
      // Vẽ hạt mưa rơi
      this.particles.forEach(p => {
        ctx.strokeStyle = `rgba(200, 230, 255, ${p.alpha})`;
        ctx.lineWidth = p.width;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.speedX * 2, p.y + p.length);
        ctx.stroke();

        p.x += p.speedX;
        p.y += p.speedY;

        // Khi giọt mưa chạm đáy màn hình -> Tạo giọt bắn tung tóe (Splash)
        if (p.y > h - 20) {
          if (Math.random() < 0.35) {
            this.splashes.push({
              x: p.x,
              y: h - 10 + Math.random() * 8,
              vx: (Math.random() - 0.5) * 4,
              vy: -Math.random() * 3 - 1.5,
              alpha: 0.65,
              radius: 1.2
            });
          }
          p.y = -p.length;
          p.x = Math.random() * (w + 200) - 100;
        }
      });

      // Vẽ các giọt bắn tung tóe (Splashes)
      for (let i = this.splashes.length - 1; i >= 0; i--) {
        const sp = this.splashes[i];
        ctx.fillStyle = `rgba(224, 242, 254, ${sp.alpha})`;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.radius, 0, Math.PI * 2);
        ctx.fill();

        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vy += 0.25; // Trọng lực giọt bắn
        sp.alpha -= 0.045;
        if (sp.alpha <= 0) this.splashes.splice(i, 1);
      }
    }

    // 5. Mô Phỏng Dông Bão & Sét Đánh (Thunder & Lightning)
    if (this.currentEffect === 'thunder') {
      if (Date.now() > this.nextLightningTime) {
        this.triggerLightning();
      }

      // Ánh chớp toàn bầu trời (Sky Ambient Flash)
      if (this.flashOpacity > 0.02) {
        ctx.fillStyle = `rgba(240, 245, 255, ${this.flashOpacity * 0.45})`;
        ctx.fillRect(0, 0, w, h);
        this.flashOpacity *= 0.88; // Tắt dần tự nhiên
      }

      // Vẽ tia sét nhánh
      if (this.lightningBolts.length > 0 && this.flashOpacity > 0.1) {
        this.lightningBolts.forEach(bolt => {
          ctx.strokeStyle = `rgba(255, 255, 255, ${this.flashOpacity})`;
          ctx.lineWidth = 2.8;
          ctx.shadowColor = '#60a5fa';
          ctx.shadowBlur = 20;
          ctx.beginPath();
          ctx.moveTo(bolt[0].x, bolt[0].y);
          for (let i = 1; i < bolt.length; i++) {
            ctx.lineTo(bolt[i].x, bolt[i].y);
          }
          ctx.stroke();
          ctx.shadowBlur = 0;
        });
      }
    }

    // 6. Mô Phỏng Tuyết Rơi Nhẹ Nhàng (Snow Simulation)
    if (this.currentEffect.includes('snow')) {
      this.particles.forEach(p => {
        p.x += Math.sin(this.time * p.swaySpeed + p.seed) * p.swayAmount;
        p.y += p.speedY;
        if (p.y > h) { p.y = -10; p.x = Math.random() * w; }

        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    this.animationId = requestAnimationFrame(() => this.loop());
  }
}

let fxEngine = null;

// Khởi chạy khi DOM tải xong
document.addEventListener('DOMContentLoaded', () => {
  fxEngine = new WeatherFXEngine('weatherCanvas');

  // Khởi tạo Module Tìm kiếm
  initSearchModule((lat, lon, name) => {
    loadWeatherData(lat, lon, name);
  });

  // Gắn sự kiện danh mục Tỉnh thành
  initLocationChips();

  // Gắn sự kiện các nút điều khiển
  initUIControls();

  // Tải dữ liệu mặc định (Hà Nội)
  loadWeatherData(appState.currentLat, appState.currentLon, appState.currentPlaceName);

  // Kiểm tra hỏi quyền GPS lần đầu
  setTimeout(() => {
    const decision = localStorage.getItem('meteo_loc_decision');
    if (decision === null) {
      showLocationPermissionModal();
    } else if (decision === 'allowed') {
      requestGPSLocation((lat, lon, name) => loadWeatherData(lat, lon, name));
    }
  }, 1200);

  // Kích hoạt lá chắn bảo mật chống soi mã nguồn
  initSecurityShield();
});

// Nạp toàn bộ dữ liệu thời tiết
async function loadWeatherData(lat, lon, placeName) {
  const loadingIndicator = document.getElementById('loadingIndicator');
  const weatherContent = document.getElementById('weatherContent');
  const errorMessage = document.getElementById('errorMessage');

  try {
    if (loadingIndicator) loadingIndicator.classList.remove('hidden');
    if (weatherContent) weatherContent.style.opacity = '0.35';
    if (errorMessage) errorMessage.classList.add('hidden');

    const data = await fetchWeatherData(lat, lon, placeName);
    appState.weatherData = data;
    appState.currentLat = lat;
    appState.currentLon = lon;
    if (placeName) appState.currentPlaceName = placeName;

    renderMainWeatherView();
  } catch (err) {
    if (errorMessage) {
      errorMessage.classList.remove('hidden');
      const errText = document.getElementById('errorText');
      if (errText) errText.textContent = err.message || 'Lỗi tải dữ liệu thời tiết.';
    }
  } finally {
    if (loadingIndicator) loadingIndicator.classList.add('hidden');
    if (weatherContent) weatherContent.style.opacity = '1';
  }
}

// Cập nhật giao diện chính
function renderMainWeatherView() {
  const data = appState.weatherData;
  if (!data || !data.current) return;

  const current = data.current;
  const daily = data.daily || {};
  const hourly = data.hourly || {};
  const info = getWeatherInfo(current.weather_code, current.is_day);

  // Cập nhật Background Theme Apple
  if (appState.themeMode === 'auto') {
    document.body.className = `theme-${info.theme}`;
  }
  if (fxEngine) fxEngine.setEffect(info.fx);

  // Thẻ Hero hiện tại
  const shortName = appState.currentPlaceName.split(',')[0];
  const cityEl = document.getElementById('cityName');
  if (cityEl) cityEl.textContent = appState.currentPlaceName;
  document.title = `${formatTemp(current.temperature_2m, appState.currentUnit)}°${appState.currentUnit} - ${shortName} | VietWeather`;

  const mapLinkEl = document.getElementById('openMapLink');
  if (mapLinkEl) {
    mapLinkEl.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(appState.currentLat)},${encodeURIComponent(appState.currentLon)}`;
  }

  const now = new Date();
  const timeEl = document.getElementById('localTime');
  if (timeEl) {
    timeEl.textContent = `Cập nhật: ${now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} • ${now.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit' })}`;
  }

  const iconEl = document.getElementById('mainWeatherIcon');
  if (iconEl) iconEl.innerHTML = `<i class="${info.icon}" style="color: ${info.iconColor}"></i>`;
  const tempEl = document.getElementById('currentTemp');
  if (tempEl) tempEl.textContent = formatTemp(current.temperature_2m, appState.currentUnit);
  const descEl = document.getElementById('weatherDescription');
  if (descEl) descEl.textContent = info.desc;
  const feelsEl = document.getElementById('feelsLikeTemp');
  if (feelsEl) feelsEl.textContent = formatTemp(current.apparent_temperature, appState.currentUnit);

  if (daily.temperature_2m_max && daily.temperature_2m_max[0] !== undefined) {
    const maxEl = document.getElementById('maxTemp');
    if (maxEl) maxEl.textContent = formatTemp(daily.temperature_2m_max[0], appState.currentUnit);
  }
  if (daily.temperature_2m_min && daily.temperature_2m_min[0] !== undefined) {
    const minEl = document.getElementById('minTemp');
    if (minEl) minEl.textContent = formatTemp(daily.temperature_2m_min[0], appState.currentUnit);
  }

  // Lưới chỉ số
  const humEl = document.getElementById('humidityVal');
  if (humEl) humEl.textContent = current.relative_humidity_2m;
  const windEl = document.getElementById('windSpeedVal');
  if (windEl) windEl.textContent = Math.round(current.wind_speed_10m);
  const windDirEl = document.getElementById('windDirVal');
  if (windDirEl) windDirEl.textContent = `Hướng: ${getWindDirection(current.wind_direction_10m)}`;

  const uv = current.uv_index !== undefined ? current.uv_index : (daily.uv_index_max ? daily.uv_index_max[0] : 0);
  const uvEl = document.getElementById('uvVal');
  if (uvEl) uvEl.textContent = uv;
  const uvDescEl = document.getElementById('uvDesc');
  if (uvDescEl) uvDescEl.textContent = getUVDescription(uv);

  const pressEl = document.getElementById('pressureVal');
  if (pressEl) pressEl.textContent = Math.round(current.surface_pressure);
  const rainEl = document.getElementById('rainVal');
  if (rainEl) rainEl.textContent = (current.precipitation || 0).toFixed(1);

  // Tầm nhìn
  const visKm = current.visibility !== undefined ? (current.visibility / 1000).toFixed(1) : 10;
  const visEl = document.getElementById('visibilityVal');
  if (visEl) visEl.textContent = visKm;
  const visDescEl = document.getElementById('visibilityDesc');
  if (visDescEl) visDescEl.textContent = visKm >= 10 ? 'Rất tốt (Quang đãng)' : (visKm >= 5 ? 'Trung bình' : 'Kém (Có sương mù)');

  // Pha mặt trăng
  const moon = getMoonPhase();
  const moonEl = document.getElementById('moonPhaseName');
  if (moonEl) moonEl.textContent = moon.name;
  const moonIllumEl = document.getElementById('moonIllumVal');
  if (moonIllumEl) moonIllumEl.textContent = `Độ sáng: ${moon.illum}% • ${moon.desc}`;

  // Bình minh / hoàng hôn
  if (daily.sunrise && daily.sunset) {
    const riseEl = document.getElementById('sunriseVal');
    const setEl = document.getElementById('sunsetVal');
    if (riseEl) riseEl.textContent = daily.sunrise[0].split('T')[1];
    if (setEl) setEl.textContent = daily.sunset[0].split('T')[1];
  }

  // Cảnh báo thời tiết nguy hiểm & mưa sắp tới
  checkAndShowWeatherAlerts(current, daily, hourly);

  // Render slider theo giờ
  renderHourlySlider(hourly);

  // Render danh sách dự báo ngày
  renderDailyList(daily);

  // Vẽ biểu đồ xu hướng Chart.js
  renderWeatherTrendChart(hourly, appState.hourlyHours, appState.currentUnit);

  // Cập nhật Radar mây mưa Leaflet
  initOrUpdateRadarMap(appState.currentLat, appState.currentLon, appState.currentPlaceName);

  // Cập nhật trạng thái nút lưu
  updateFavUI();
}

function renderHourlySlider(hourly) {
  const slider = document.getElementById('hourlySlider');
  if (!slider || !hourly || !hourly.time) return;
  slider.innerHTML = '';

  const now = new Date();
  const currentHourStr = now.toISOString().slice(0, 13);
  let startIndex = hourly.time.findIndex(t => t.startsWith(currentHourStr));
  if (startIndex === -1) startIndex = 0;

  for (let i = startIndex; i < startIndex + appState.hourlyHours && i < hourly.time.length; i++) {
    const timeStr = hourly.time[i];
    const hour = timeStr.split('T')[1].slice(0, 5);
    const temp = hourly.temperature_2m[i];
    const code = hourly.weather_code[i];
    const pop = hourly.precipitation_probability ? hourly.precipitation_probability[i] : 0;
    const hourNum = parseInt(hour.split(':')[0]);
    const isDay = (hourNum >= 6 && hourNum < 18) ? 1 : 0;
    const info = getWeatherInfo(code, isDay);

    const card = document.createElement('div');
    card.className = `hourly-card ${i === startIndex ? 'active-hour' : ''}`;
    card.innerHTML = `
      <span class="hourly-time">${i === startIndex ? 'Bây giờ' : hour}</span>
      <i class="${info.icon} hourly-icon" style="color: ${info.iconColor}"></i>
      <span class="hourly-temp">${formatTemp(temp, appState.currentUnit)}°</span>
      ${pop > 0 ? `<span class="hourly-pop"><i class="fa-solid fa-droplet"></i> ${pop}%</span>` : ''}
    `;
    slider.appendChild(card);
  }
}

function renderDailyList(daily) {
  const list = document.getElementById('dailyList');
  if (!list || !daily || !daily.time) return;
  list.innerHTML = '';

  for (let i = 0; i < appState.dailyDays && i < daily.time.length; i++) {
    const date = new Date(daily.time[i]);
    const dayName = i === 0 ? 'Hôm nay' : date.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit' });
    const code = daily.weather_code[i];
    const info = getWeatherInfo(code, 1);
    const maxT = daily.temperature_2m_max[i];
    const minT = daily.temperature_2m_min[i];

    const item = document.createElement('div');
    item.className = 'daily-item';
    item.innerHTML = `
      <div class="daily-day">${dayName}</div>
      <div class="daily-weather">
        <i class="${info.icon} daily-icon" style="color: ${info.iconColor}"></i>
        <span class="daily-desc">${info.desc}</span>
      </div>
      <div class="daily-temp-bar">
        <span>${formatTemp(maxT, appState.currentUnit)}°</span>
        <span class="min-t">${formatTemp(minT, appState.currentUnit)}°</span>
      </div>
    `;
    list.appendChild(item);
  }
}

// Khởi tạo thẻ chip Tỉnh thành
function initLocationChips() {
  const container = document.getElementById('quickCitiesContainer');
  const regionFilters = document.getElementById('vnRegionFilters');

  function renderChips(cat) {
    if (!container) return;
    appState.activeCategory = cat;
    container.innerHTML = '';
    if (regionFilters) regionFilters.classList.toggle('hidden', cat !== 'vietnam');

    let list = [];
    if (cat === 'vietnam') {
      if (appState.vnSubRegion === 'bac') list = VN_BAC;
      else if (appState.vnSubRegion === 'trung') list = VN_TRUNG;
      else if (appState.vnSubRegion === 'nam') list = VN_NAM;
      else list = ALL_VN;
    } else if (cat === 'favorites') {
      list = appState.favorites;
      if (list.length === 0) {
        container.innerHTML = `<span style="color: var(--text-sub); font-size: 0.85rem; padding: 6px 12px;">Chưa có địa điểm đã lưu. Bấm ⭐ để lưu địa điểm yêu thích!</span>`;
        return;
      }
    } else {
      list = LOCATIONS_DB[cat] || LOCATIONS_DB.popular;
    }

    list.forEach(item => {
      if (!item || !isValidCoordinate(item.lat, item.lon)) return;
      const chip = document.createElement('button');
      chip.className = 'city-chip';
      if (item.fullName === appState.currentPlaceName || item.name === appState.currentPlaceName) {
        chip.classList.add('active-chip');
      }
      chip.innerHTML = `
        <span class="chip-flag">${escapeHTML(item.flag || '📍')}</span>
        <span>${escapeHTML(item.name || '')}</span>
      `;
      chip.addEventListener('click', () => {
        const input = document.getElementById('cityInput');
        if (input) input.value = item.fullName;
        loadWeatherData(item.lat, item.lon, item.fullName);
      });
      container.appendChild(chip);
    });
  }

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderChips(btn.dataset.category);
    });
  });

  document.querySelectorAll('.sub-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sub-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      appState.vnSubRegion = btn.dataset.sub;
      renderChips('vietnam');
    });
  });

  renderChips('vietnam');
}

// Quản lý trạng thái yêu thích
function isCurrentFavorite() {
  return appState.favorites.some(f => f.fullName === appState.currentPlaceName || (Math.abs(f.lat - appState.currentLat) < 0.01 && Math.abs(f.lon - appState.currentLon) < 0.01));
}

function updateFavUI() {
  const isFav = isCurrentFavorite();
  const favToggleBtn = document.getElementById('favToggleBtn');
  const favStarIcon = document.getElementById('favStarIcon');
  const cardFavBtn = document.getElementById('cardFavBtn');
  const cardFavIcon = document.getElementById('cardFavIcon');
  const favCountEl = document.getElementById('favCount');

  if (favToggleBtn) favToggleBtn.classList.toggle('is-fav', isFav);
  if (favStarIcon) favStarIcon.className = isFav ? 'fa-solid fa-star' : 'fa-regular fa-star';
  if (cardFavBtn) cardFavBtn.classList.toggle('is-fav', isFav);
  if (cardFavIcon) cardFavIcon.className = isFav ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark';
  if (favCountEl) favCountEl.textContent = appState.favorites.length;
}

function toggleFavorite() {
  const idx = appState.favorites.findIndex(f => f.fullName === appState.currentPlaceName || (Math.abs(f.lat - appState.currentLat) < 0.01 && Math.abs(f.lon - appState.currentLon) < 0.01));
  if (idx >= 0) {
    appState.favorites.splice(idx, 1);
  } else {
    appState.favorites.unshift({
      name: appState.currentPlaceName.split(',')[0],
      fullName: appState.currentPlaceName,
      lat: appState.currentLat,
      lon: appState.currentLon,
      flag: '📍'
    });
  }
  localStorage.setItem('meteo_favorites', JSON.stringify(appState.favorites));
  updateFavUI();
}

// Khởi tạo các nút điều khiển UI
function setLanguage(lang) {
  window.currentLang = lang;
  localStorage.setItem('meteo_lang', lang);
  const langVi = document.getElementById('langVi');
  const langEn = document.getElementById('langEn');
  if (langVi && langEn) {
    langVi.classList.toggle('active', lang === 'vi');
    langEn.classList.toggle('active', lang === 'en');
  }

  const isEn = lang === 'en';
  const subtitle = document.querySelector('.header-left p');
  if (subtitle) subtitle.textContent = isEn ? 'Real-Time Weather Platform • 63 Provinces' : 'Dự Báo Thời Tiết 63 Tỉnh Thành Thời Gian Thực';
  
  const navTabs = document.querySelectorAll('nav .tab-btn');
  if (navTabs.length >= 4) {
    navTabs[0].innerHTML = `<i class="fa-solid fa-house"></i> ${isEn ? 'Home' : 'Trang Chủ'}`;
    navTabs[1].innerHTML = `<i class="fa-solid fa-map"></i> ${isEn ? 'Radar Map' : 'Bản Đồ Radar Mưa'}`;
    navTabs[2].innerHTML = `<i class="fa-solid fa-chart-line"></i> ${isEn ? 'Forecast Center' : 'Dự Báo Chi Tiết'}`;
    navTabs[3].innerHTML = `<i class="fa-solid fa-gear"></i> ${isEn ? 'Settings' : 'Cài Đặt'}`;
  }

  const hubTitles = document.querySelectorAll('.hub-title');
  const hubSubs = document.querySelectorAll('.hub-subtitle');
  if (hubTitles.length >= 2) {
    hubTitles[0].textContent = isEn ? 'In-Depth Forecast 48h & 14 Days' : 'Dự Báo Chi Tiết 48h & 14 Ngày';
    hubSubs[0].textContent = isEn ? 'Temperature trends, rain charts & extended days' : 'Biểu đồ nhiệt độ, lượng mưa và chi tiết từng ngày';
    hubTitles[1].textContent = isEn ? 'Live Satellite Rain Radar Map' : 'Bản Đồ Radar Mây Mưa Trực Tiếp';
    hubSubs[1].textContent = isEn ? 'High-definition satellite clouds & storm tracking' : 'Xem vệt mây mưa thời gian thực và chuyển động bão';
  }

  const searchInput = document.getElementById('citySearchInput');
  if (searchInput) searchInput.placeholder = isEn ? 'Search city, province, country...' : 'Tìm kiếm tỉnh thành, quận huyện, quốc gia...';

  const mapLink = document.getElementById('openMapLink');
  if (mapLink) mapLink.innerHTML = `<i class="fa-solid fa-map-location-dot"></i> ${isEn ? 'View on Map' : 'Xem Vị Trí Bản Đồ'}`;

  const metricTitles = document.querySelectorAll('.metric-title');
  if (metricTitles.length >= 8) {
    metricTitles[0].textContent = isEn ? 'Humidity' : 'Độ ẩm';
    metricTitles[1].textContent = isEn ? 'Wind Speed' : 'Tốc độ gió';
    metricTitles[2].textContent = isEn ? 'UV Index' : 'Chỉ số UV';
    metricTitles[3].textContent = isEn ? 'Pressure' : 'Áp suất';
    metricTitles[4].textContent = isEn ? 'Precipitation' : 'Lượng mưa';
    metricTitles[5].textContent = isEn ? 'Visibility' : 'Tầm nhìn';
    metricTitles[6].textContent = isEn ? 'Moon Phase' : 'Pha Mặt Trăng';
    metricTitles[7].textContent = isEn ? 'Sunrise & Sunset' : 'Mặt trời';
  }

  renderMainWeatherView();
}

function initUIControls() {
  // Nút ngôn ngữ VI / EN
  const langVi = document.getElementById('langVi');
  const langEn = document.getElementById('langEn');
  if (langVi && langEn) {
    langVi.addEventListener('click', () => setLanguage('vi'));
    langEn.addEventListener('click', () => setLanguage('en'));
  }

  // Khôi phục ngôn ngữ đã lưu
  const savedLang = localStorage.getItem('meteo_lang') || 'vi';
  if (savedLang === 'en') setLanguage('en');

  // Nút đơn vị C/F
  const unitC = document.getElementById('unitC');
  const unitF = document.getElementById('unitF');
  if (unitC && unitF) {
    unitC.addEventListener('click', () => {
      if (appState.currentUnit === 'C') return;
      appState.currentUnit = 'C';
      unitC.classList.add('active');
      unitF.classList.remove('active');
      renderMainWeatherView();
    });
    unitF.addEventListener('click', () => {
      if (appState.currentUnit === 'F') return;
      appState.currentUnit = 'F';
      unitF.classList.add('active');
      unitC.classList.remove('active');
      renderMainWeatherView();
    });
  }

  // Tùy chọn 24h / 48h
  const h24 = document.getElementById('hourly24Btn');
  const h48 = document.getElementById('hourly48Btn');
  if (h24 && h48) {
    h24.addEventListener('click', () => {
      appState.hourlyHours = 24;
      h24.classList.add('active');
      h48.classList.remove('active');
      if (appState.weatherData) {
        renderHourlySlider(appState.weatherData.hourly);
        renderWeatherTrendChart(appState.weatherData.hourly, 24, appState.currentUnit);
      }
    });
    h48.addEventListener('click', () => {
      appState.hourlyHours = 48;
      h48.classList.add('active');
      h24.classList.remove('active');
      if (appState.weatherData) {
        renderHourlySlider(appState.weatherData.hourly);
        renderWeatherTrendChart(appState.weatherData.hourly, 48, appState.currentUnit);
      }
    });
  }

  // Tùy chọn 7d / 14d
  const d7 = document.getElementById('daily7Btn');
  const d14 = document.getElementById('daily14Btn');
  if (d7 && d14) {
    d7.addEventListener('click', () => {
      appState.dailyDays = 7;
      d7.classList.add('active');
      d14.classList.remove('active');
      if (appState.weatherData) renderDailyList(appState.weatherData.daily);
    });
    d14.addEventListener('click', () => {
      appState.dailyDays = 14;
      d14.classList.add('active');
      d7.classList.remove('active');
      if (appState.weatherData) renderDailyList(appState.weatherData.daily);
    });
  }

  // Dark/Light Theme Mode
  const themeBtn = document.getElementById('themeModeBtn');
  const themeIcon = document.getElementById('themeModeIcon');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      if (appState.themeMode === 'auto') {
        appState.themeMode = 'dark';
        document.body.classList.remove('theme-forced-light');
        document.body.classList.add('theme-forced-dark');
        if (themeIcon) themeIcon.className = 'fa-solid fa-moon';
      } else if (appState.themeMode === 'dark') {
        appState.themeMode = 'light';
        document.body.classList.remove('theme-forced-dark');
        document.body.classList.add('theme-forced-light');
        if (themeIcon) themeIcon.className = 'fa-solid fa-sun';
      } else {
        appState.themeMode = 'auto';
        document.body.classList.remove('theme-forced-dark', 'theme-forced-light');
        if (themeIcon) themeIcon.className = 'fa-solid fa-circle-half-stroke';
        if (appState.weatherData && appState.weatherData.current) {
          const info = getWeatherInfo(appState.weatherData.current.weather_code, appState.weatherData.current.is_day);
          document.body.className = `theme-${info.theme}`;
        }
      }
    });
  }

  // Radar Play
  const playBtn = document.getElementById('radarPlayBtn');
  if (playBtn) playBtn.addEventListener('click', toggleRadarAnimation);

  // Yêu thích
  const favToggleBtn = document.getElementById('favToggleBtn');
  const cardFavBtn = document.getElementById('cardFavBtn');
  if (favToggleBtn) favToggleBtn.addEventListener('click', toggleFavorite);
  if (cardFavBtn) cardFavBtn.addEventListener('click', toggleFavorite);

  // Định vị GPS
  const geoBtn = document.getElementById('geoBtn');
  if (geoBtn) {
    geoBtn.addEventListener('click', () => {
      const decision = localStorage.getItem('meteo_loc_decision');
      if (decision === 'allowed') {
        requestGPSLocation((lat, lon, name) => loadWeatherData(lat, lon, name));
      } else {
        showLocationPermissionModal();
      }
    });
  }

  const allowBtn = document.getElementById('allowLocationBtn');
  const denyBtn = document.getElementById('denyLocationBtn');
  if (allowBtn) {
    allowBtn.addEventListener('click', () => {
      localStorage.setItem('meteo_loc_decision', 'allowed');
      hideLocationPermissionModal();
      requestGPSLocation((lat, lon, name) => loadWeatherData(lat, lon, name));
    });
  }
  if (denyBtn) {
    denyBtn.addEventListener('click', () => {
      localStorage.setItem('meteo_loc_decision', 'denied');
      hideLocationPermissionModal();
    });
  }

  // Modals FAQ & Privacy
  const faqModal = document.getElementById('faqModal');
  const openFaq = document.getElementById('openFaqBtn');
  const closeFaq = document.getElementById('closeFaqBtn');
  if (openFaq && faqModal) openFaq.addEventListener('click', () => faqModal.classList.remove('hidden'));
  if (closeFaq && faqModal) closeFaq.addEventListener('click', () => faqModal.classList.add('hidden'));

  const privModal = document.getElementById('privacyModal');
  const openPriv = document.getElementById('openPrivacyBtn');
  const closePriv = document.getElementById('closePrivacyBtn');
  if (openPriv && privModal) openPriv.addEventListener('click', () => privModal.classList.remove('hidden'));
  if (closePriv && privModal) closePriv.addEventListener('click', () => privModal.classList.add('hidden'));

  const dismissAlert = document.getElementById('dismissAlertBtn');
  if (dismissAlert) {
    dismissAlert.addEventListener('click', () => {
      const b = document.getElementById('severeAlertBanner');
      if (b) b.classList.add('hidden');
    });
  }
}

// Hệ thống bảo vệ bản quyền chống soi code
function initSecurityShield() {
  const toast = document.getElementById('tamperWarning');
  const msgEl = document.getElementById('tamperMsg');
  let t = null;

  function warn(msg) {
    if (!toast) return;
    if (msgEl) msgEl.textContent = msg;
    toast.classList.remove('hidden');
    clearTimeout(t);
    t = setTimeout(() => toast.classList.add('hidden'), 2400);
  }

  document.addEventListener('contextmenu', e => {
    e.preventDefault();
    warn('Chuột phải đã bị vô hiệu hóa để bảo vệ bản quyền!');
    return false;
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) || (e.ctrlKey && ['U', 'u', 'S', 's'].includes(e.key))) {
      e.preventDefault();
      e.stopPropagation();
      warn('Tính năng kiểm tra mã nguồn đã bị khóa!');
      return false;
    }
  });

  document.addEventListener('dragstart', e => { e.preventDefault(); return false; });
}
