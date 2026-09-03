// ========================================================
// MODULE: i18n.js - Hệ Thống Đa Ngôn Ngữ (VI / EN) Toàn Diện Toàn Website
// ========================================================

const I18N_DICT = {
  vi: {
    // Header & Brand
    brand_sub: 'Dự Báo Thời Tiết 63 Tỉnh Thành Thời Gian Thực',
    search_placeholder: 'Tìm kiếm tỉnh thành, quận huyện, quốc gia...',
    gps_btn_title: 'Lấy vị trí GPS của bạn',
    fav_btn_title: 'Xem danh sách yêu thích',

    // Navigation
    nav_home: 'Trang Chủ',
    nav_radar: 'Bản Đồ Radar Mưa',
    nav_forecast: 'Dự Báo Chi Tiết',
    nav_settings: 'Cài Đặt',

    // Alerts
    alert_severe_title: '⚠️ CẢNH BÁO THỜI TIẾT NGUY HIỂM',
    alert_severe_desc: 'Khu vực có khả năng xuất hiện thời tiết cực đoan. Vui lòng chú ý an toàn.',
    alert_rain_title: '🌧️ THÔNG BÁO SẮP CÓ MƯA',
    alert_rain_desc: 'Xác suất mưa cao trong 1-2 giờ tới. Hãy mang theo ô hoặc áo mưa!',

    // Location categories
    cat_vietnam: '🇻🇳 63 Tỉnh Thành VN',
    cat_popular: '🔥 Phổ Biến',
    cat_asia: '🌏 Châu Á',
    cat_world: '🌐 Thế Giới',
    cat_favorites: '⭐ Đã Lưu',
    filter_all: 'Tất Cả (63)',
    filter_bac: 'Miền Bắc',
    filter_trung: 'Miền Trung',
    filter_nam: 'Miền Nam',
    no_fav_msg: 'Chưa có địa điểm đã lưu. Bấm ⭐ để lưu địa điểm yêu thích!',

    // Current Weather Card
    feels_like: 'Cảm giác như',
    today: 'Hôm nay',
    high: 'C',
    low: 'T',
    view_map: 'Xem Vị Trí Bản Đồ',

    // 8 Metrics
    metric_humidity: 'Độ ẩm',
    metric_humidity_sub: 'Điểm sương',
    metric_wind: 'Tốc độ gió',
    metric_uv: 'Chỉ số UV',
    metric_uv_sub: 'Tia cực tím',
    metric_pressure: 'Áp suất',
    metric_pressure_sub: 'Khí quyển',
    metric_rain: 'Lượng mưa',
    metric_rain_sub: '24h qua',
    metric_visibility: 'Tầm nhìn',
    metric_visibility_sub: 'Độ quang đãng',
    metric_moon: 'Pha Mặt Trăng',
    metric_moon_sub: 'Thủy triều',
    metric_sun: 'Mặt trời',
    sunset_prefix: 'Hoàng hôn',

    // Hub Cards (Home)
    hub_forecast_title: 'Dự Báo Chi Tiết 48h & 14 Ngày',
    hub_forecast_sub: 'Biểu đồ nhiệt độ, lượng mưa và chi tiết từng ngày',
    hub_radar_title: 'Bản Đồ Radar Mây Mưa Trực Tiếp',
    hub_radar_sub: 'Xem vệt mây mưa thời gian thực và chuyển động bão',

    // Forecast Page
    forecast_title: 'Trung Tâm Dự Báo Thời Tiết Chuyên Sâu',
    forecast_city_prefix: 'Dự báo chi tiết 48 giờ & 14 ngày tới tại',
    select_province_label: 'Chọn Tỉnh Thành:',
    loading_weather: 'Đang tải dữ liệu khí tượng chuyên sâu...',
    chart_title: 'Biểu Đồ Biến Thiên Nhiệt Độ & Xác Suất Mưa',
    btn_24h: '24 Giờ',
    btn_48h: '48 Giờ',
    hourly_title: 'Chi Tiết Dự Báo Theo Giờ',
    daily_title: 'Dự Báo Dài Hạn 14 Ngày',
    btn_7d: '7 Ngày',
    btn_14d: 'Đầy đủ 14 Ngày',
    rain_chance: 'Xác suất mưa',
    wind_label: 'Gió',
    uv_max_label: 'UV Max',
    hour_current: 'Hiện tại',
    day_today: 'Hôm nay',
    day_tomorrow: 'Ngày mai',

    // Map Page
    map_title: 'Bản Đồ Thời Tiết Vệ Tinh',
    mode_satellite: 'Vệ Tinh',
    mode_terrain: 'Địa hình',
    mode_map: 'Bản đồ',
    toggle_radar: 'Radar Mưa',
    toggle_temp: 'Nhiệt độ',
    btn_scan_rain: 'Quét vệt mưa',
    btn_pause_scan: 'Tạm dừng',
    drizzle_label: 'Mưa phùn',
    storm_label: 'Mưa rào to / Dông bão',
    loading_radar: 'Đang tải dữ liệu mây mưa vệ tinh...',

    // Settings Page
    settings_title: 'Cài Đặt Ứng Dụng',
    setting_unit: 'Đơn vị nhiệt độ (°C / °F)',
    setting_unit_sub: 'Hỗ trợ chuyển đổi nhanh',
    setting_theme: 'Chế độ giao diện',
    setting_theme_sub: 'Apple Dynamic / Dark / Light',
    setting_gps: 'Quyền riêng tư vị trí GPS',
    setting_gps_sub: 'Luôn hỏi trước khi truy cập',
    back_to_home: 'Quay lại Trang Chủ',

    // Footer & Security
    footer_faq: 'Câu hỏi thường gặp',
    footer_privacy: 'Chính sách quyền riêng tư',
    footer_fullmap: 'Bản đồ toàn màn hình',
    copyright_toast: 'Mã nguồn đã được bảo vệ bản quyền!',
    devtools_toast: 'Tính năng kiểm tra mã nguồn (DevTools) đã bị khóa!',
    context_toast: 'Chuột phải đã bị vô hiệu hóa để bảo vệ bản quyền!'
  },

  en: {
    // Header & Brand
    brand_sub: 'Real-Time Weather Platform • 63 Provinces',
    search_placeholder: 'Search city, province, country...',
    gps_btn_title: 'Get your GPS location',
    fav_btn_title: 'View saved favorites',

    // Navigation
    nav_home: 'Home',
    nav_radar: 'Radar Map',
    nav_forecast: 'Forecast Center',
    nav_settings: 'Settings',

    // Alerts
    alert_severe_title: '⚠️ SEVERE WEATHER ALERT',
    alert_severe_desc: 'Severe weather conditions possible in this area. Please stay safe.',
    alert_rain_title: '🌧️ IMMINENT RAIN NOTICE',
    alert_rain_desc: 'High rain probability in the next 1–2 hours. Please carry an umbrella!',

    // Location categories
    cat_vietnam: '🇻🇳 63 VN Provinces',
    cat_popular: '🔥 Popular',
    cat_asia: '🌏 Asia',
    cat_world: '🌐 Global',
    cat_favorites: '⭐ Saved',
    filter_all: 'All (63)',
    filter_bac: 'North',
    filter_trung: 'Central',
    filter_nam: 'South',
    no_fav_msg: 'No saved locations yet. Tap ⭐ to bookmark favorite places!',

    // Current Weather Card
    feels_like: 'Feels like',
    today: 'Today',
    high: 'H',
    low: 'L',
    view_map: 'View on Map',

    // 8 Metrics
    metric_humidity: 'Humidity',
    metric_humidity_sub: 'Dew point',
    metric_wind: 'Wind Speed',
    metric_uv: 'UV Index',
    metric_uv_sub: 'Ultraviolet',
    metric_pressure: 'Pressure',
    metric_pressure_sub: 'Atmospheric',
    metric_rain: 'Precipitation',
    metric_rain_sub: 'Past 24h',
    metric_visibility: 'Visibility',
    metric_visibility_sub: 'Clarity',
    metric_moon: 'Moon Phase',
    metric_moon_sub: 'Tidal cycle',
    metric_sun: 'Sun Times',
    sunset_prefix: 'Sunset',

    // Hub Cards (Home)
    hub_forecast_title: 'In-Depth Forecast 48h & 14 Days',
    hub_forecast_sub: 'Temperature curves, precipitation charts & daily details',
    hub_radar_title: 'Live Satellite Rain Radar Map',
    hub_radar_sub: 'Real-time cloud radar animation and storm tracking',

    // Forecast Page
    forecast_title: 'Comprehensive Weather Forecast Center',
    forecast_city_prefix: 'Detailed 48-hour & 14-day weather forecast for',
    select_province_label: 'Select Location:',
    loading_weather: 'Loading meteorological telemetry...',
    chart_title: 'Temperature Trend & Rain Probability (Chart.js)',
    btn_24h: '24 Hours',
    btn_48h: '48 Hours',
    hourly_title: 'Hourly Forecast Breakdown',
    daily_title: '14-Day Extended Daily Forecast',
    btn_7d: '7 Days',
    btn_14d: 'Full 14 Days',
    rain_chance: 'Rain chance',
    wind_label: 'Wind',
    uv_max_label: 'UV Max',
    hour_current: 'Now',
    day_today: 'Today',
    day_tomorrow: 'Tomorrow',

    // Map Page
    map_title: 'Satellite Weather Radar Map',
    mode_satellite: 'Satellite',
    mode_terrain: 'Terrain',
    mode_map: 'Road Map',
    toggle_radar: 'Rain Radar',
    toggle_temp: 'Temperature',
    btn_scan_rain: 'Play Radar',
    btn_pause_scan: 'Pause',
    drizzle_label: 'Drizzle',
    storm_label: 'Heavy Rain / Thunderstorm',
    loading_radar: 'Loading satellite weather radar...',

    // Settings Page
    settings_title: 'Application Settings',
    setting_unit: 'Temperature Unit (°C / °F)',
    setting_unit_sub: 'Quick one-tap conversion',
    setting_theme: 'Display Theme',
    setting_theme_sub: 'Apple Dynamic / Dark / Light',
    setting_gps: 'GPS Location Privacy',
    setting_gps_sub: 'Always prompt before accessing',
    back_to_home: 'Back to Home',

    // Footer & Security
    footer_faq: 'Frequently Asked Questions',
    footer_privacy: 'Privacy Policy',
    footer_fullmap: 'Full Screen Map',
    copyright_toast: 'Source code is copyright protected!',
    devtools_toast: 'Source inspection tools (DevTools) are disabled!',
    context_toast: 'Right click is disabled to protect copyright!'
  }
};

function getLanguage() {
  return localStorage.getItem('meteo_lang') || 'vi';
}

function t(key) {
  const lang = getLanguage();
  return (I18N_DICT[lang] && I18N_DICT[lang][key]) || (I18N_DICT.vi && I18N_DICT.vi[key]) || key;
}

function setGlobalLanguage(lang) {
  localStorage.setItem('meteo_lang', lang);
  window.currentLang = lang;

  // Cập nhật trạng thái các nút langVi / langEn nếu có trên trang
  document.querySelectorAll('#langVi, .btn-lang-vi').forEach(btn => btn.classList.toggle('active', lang === 'vi'));
  document.querySelectorAll('#langEn, .btn-lang-en').forEach(btn => btn.classList.toggle('active', lang === 'en'));

  // 1. Dịch các phần tử có data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translated = t(key);
    if (translated) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = translated;
      } else {
        el.textContent = translated;
      }
    }
  });

  // 2. Tự động dịch theo các ID quen thuộc nếu trang có
  translateCommonElements(lang);

  // 3. Phát event cho các module khác re-render (Chart, Hourly, Daily...)
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

function translateCommonElements(lang) {
  const isEn = lang === 'en';

  // Subtitle
  const sub = document.querySelector('.header-left p');
  if (sub) sub.textContent = t('brand_sub');

  // Input placeholder
  const searchInp = document.getElementById('citySearchInput');
  if (searchInp) searchInp.placeholder = t('search_placeholder');

  // Navigation tabs
  const navTabs = document.querySelectorAll('nav .tab-btn, .nav-tabs .tab-btn');
  if (navTabs.length >= 4) {
    navTabs[0].innerHTML = `<i class="fa-solid fa-house"></i> ${t('nav_home')}`;
    navTabs[1].innerHTML = `<i class="fa-solid fa-map"></i> ${t('nav_radar')}`;
    navTabs[2].innerHTML = `<i class="fa-solid fa-chart-line"></i> ${t('nav_forecast')}`;
    navTabs[3].innerHTML = `<i class="fa-solid fa-gear"></i> ${t('nav_settings')}`;
  }

  // Location categories
  const catBtns = document.querySelectorAll('.location-tabs .tab-btn');
  if (catBtns.length >= 5) {
    catBtns[0].textContent = t('cat_vietnam');
    catBtns[1].textContent = t('cat_popular');
    catBtns[2].textContent = t('cat_asia');
    catBtns[3].textContent = t('cat_world');
    catBtns[4].innerHTML = `${t('cat_favorites')} <span class="fav-count-badge" id="favCount">0</span>`;
  }

  // Sub-region filters
  const regBtns = document.querySelectorAll('.sub-filters .sub-filter-btn');
  if (regBtns.length >= 4) {
    regBtns[0].textContent = t('filter_all');
    regBtns[1].textContent = t('filter_bac');
    regBtns[2].textContent = t('filter_trung');
    regBtns[3].textContent = t('filter_nam');
  }

  // Alerts
  const alertT = document.getElementById('alertTitle');
  if (alertT) alertT.textContent = t('alert_severe_title');
  const alertD = document.getElementById('alertDesc');
  if (alertD) alertD.textContent = t('alert_severe_desc');
  const rainNotice = document.getElementById('rainNoticeText');
  if (rainNotice) rainNotice.textContent = t('alert_rain_desc');

  // Map badge
  const mapLink = document.getElementById('openMapLink');
  if (mapLink) mapLink.innerHTML = `<i class="fa-solid fa-map-location-dot"></i> ${t('view_map')}`;

  // 8 Metric titles
  const metricTitles = document.querySelectorAll('.metric-title');
  if (metricTitles.length >= 8) {
    metricTitles[0].textContent = t('metric_humidity');
    metricTitles[1].textContent = t('metric_wind');
    metricTitles[2].textContent = t('metric_uv');
    metricTitles[3].textContent = t('metric_pressure');
    metricTitles[4].textContent = t('metric_rain');
    metricTitles[5].textContent = t('metric_visibility');
    metricTitles[6].textContent = t('metric_moon');
    metricTitles[7].textContent = t('metric_sun');
  }

  // Hub cards
  const hubTitles = document.querySelectorAll('.hub-title');
  const hubSubs = document.querySelectorAll('.hub-subtitle');
  if (hubTitles.length >= 2) {
    hubTitles[0].textContent = t('hub_forecast_title');
    hubSubs[0].textContent = t('hub_forecast_sub');
    hubTitles[1].textContent = t('hub_radar_title');
    hubSubs[1].textContent = t('hub_radar_sub');
  }

  // Footer links
  const footerLinks = document.querySelectorAll('.footer-links .footer-link-btn');
  if (footerLinks.length >= 3) {
    footerLinks[0].textContent = t('footer_faq');
    footerLinks[1].textContent = t('footer_privacy');
    footerLinks[2].textContent = t('footer_fullmap');
  }

  // Map Page Controls (if on pages/map.html)
  const mapBrandTitle = document.querySelector('.google-brand-title span');
  if (mapBrandTitle) mapBrandTitle.textContent = t('map_title');

  const btnEarth = document.getElementById('btnGoogleEarth');
  if (btnEarth) btnEarth.innerHTML = `<i class="fa-solid fa-satellite"></i> ${t('mode_satellite')}`;
  const btnTerrain = document.getElementById('btnGoogleTerrain');
  if (btnTerrain) btnTerrain.innerHTML = `<i class="fa-solid fa-mountain"></i> ${t('mode_terrain')}`;
  const btnRoadMap = document.getElementById('btnGoogleMaps');
  if (btnRoadMap) btnRoadMap.innerHTML = `<i class="fa-solid fa-map"></i> ${t('mode_map')}`;

  const toggleRadar = document.getElementById('toggleRadarLayer');
  if (toggleRadar) toggleRadar.innerHTML = `<i class="fa-solid fa-cloud-showers-heavy"></i> ${t('toggle_radar')}`;
  const toggleTemp = document.getElementById('toggleTempMarkers');
  if (toggleTemp) toggleTemp.innerHTML = `<i class="fa-solid fa-temperature-three-quarters"></i> ${t('toggle_temp')}`;

  const playRadarBtn = document.getElementById('playRadarBtn');
  if (playRadarBtn && !window.isPlaying) playRadarBtn.innerHTML = `<i class="fa-solid fa-play"></i> ${t('btn_scan_rain')}`;

  const intensityLabels = document.querySelectorAll('.radar-intensity-row .intensity-label');
  if (intensityLabels.length >= 2) {
    intensityLabels[0].textContent = t('drizzle_label');
    intensityLabels[1].textContent = t('storm_label');
  }

  // Forecast Page Controls (if on pages/forecast.html)
  const fcTitle = document.querySelector('.forecast-header-card h1');
  if (fcTitle) fcTitle.textContent = t('forecast_title');
  const fcSelectLabel = document.querySelector('label[for="citySelectDropdown"]');
  if (fcSelectLabel) fcSelectLabel.textContent = t('select_province_label');
  const fcChart24 = document.getElementById('chart24Btn');
  if (fcChart24) fcChart24.textContent = t('btn_24h');
  const fcChart48 = document.getElementById('chart48Btn');
  if (fcChart48) fcChart48.textContent = t('btn_48h');
  const fcHourly24 = document.getElementById('hourly24Btn');
  if (fcHourly24) fcHourly24.textContent = isEn ? 'Next 24 Hours' : '24 Giờ tới';
  const fcHourly48 = document.getElementById('hourly48Btn');
  if (fcHourly48) fcHourly48.textContent = isEn ? 'Next 48 Hours' : '48 Giờ tới';
  const fcDaily7 = document.getElementById('daily7Btn');
  if (fcDaily7) fcDaily7.textContent = t('btn_7d');
  const fcDaily14 = document.getElementById('daily14Btn');
  if (fcDaily14) fcDaily14.textContent = t('btn_14d');
}

// Khởi tạo tự động khi trang tải
document.addEventListener('DOMContentLoaded', () => {
  const current = getLanguage();
  window.currentLang = current;

  // Gắn sự kiện vào các nút chọn ngôn ngữ
  document.querySelectorAll('#langVi, .btn-lang-vi').forEach(btn => {
    btn.addEventListener('click', () => setGlobalLanguage('vi'));
  });
  document.querySelectorAll('#langEn, .btn-lang-en').forEach(btn => {
    btn.addEventListener('click', () => setGlobalLanguage('en'));
  });

  setGlobalLanguage(current);
});
