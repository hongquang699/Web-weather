// ========================================================
// SECURITY & DATA PROTECTION MODULE (XSS / DoS / Injection Defense)
// ========================================================
function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}

function sanitizeInput(val) {
  if (typeof val !== 'string') return '';
  // Truncate length to 80, remove control chars, HTML/script brackets
  return val.trim().slice(0, 80).replace(/[\u0000-\u001F\u007F-\u009F<>]/g, '');
}

function isValidCoordinate(lat, lon) {
  const nLat = Number(lat);
  const nLon = Number(lon);
  return !isNaN(nLat) && !isNaN(nLon) &&
    nLat >= -90 && nLat <= 90 &&
    nLon >= -180 && nLon <= 180;
}

// Timeout-protected Fetch to prevent connection hanging & resource exhaustion
async function safeFetch(url, timeoutMs = 8000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response.ok) {
      throw new Error(`Máy chủ thời tiết phản hồi lỗi (Mã: ${response.status})`);
    }
    return await response.json();
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Yêu cầu kết nối quá thời gian chờ (Timeout). Vui lòng thử lại!');
    }
    throw err;
  }
}

// Safe LocalStorage Parser with Schema Integrity Verification
function getSafeFavorites() {
  try {
    const raw = localStorage.getItem('meteo_favorites');
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.filter(item => (
      item &&
      typeof item.name === 'string' &&
      typeof item.fullName === 'string' &&
      isValidCoordinate(item.lat, item.lon)
    )).slice(0, 50);
  } catch (e) {
    console.warn('Storage security notice: reset corrupted favorites.');
    return [];
  }
}

// ========================================================
// TOÀN BỘ 63 TỈNH THÀNH VIỆT NAM & ĐỊA DANH QUỐC TẾ
// ========================================================
const VN_BAC = [
  { name: 'Hà Nội', fullName: 'Hà Nội, Việt Nam', lat: 21.0285, lon: 105.8542, flag: '🇻🇳' },
  { name: 'Hải Phòng', fullName: 'Hải Phòng, Việt Nam', lat: 20.8449, lon: 106.6881, flag: '🇻🇳' },
  { name: 'Quảng Ninh (Hạ Long)', fullName: 'Hạ Long, Quảng Ninh, Việt Nam', lat: 20.9505, lon: 107.0734, flag: '🇻🇳' },
  { name: 'Bắc Ninh', fullName: 'Bắc Ninh, Việt Nam', lat: 21.1861, lon: 106.0763, flag: '🇻🇳' },
  { name: 'Hà Nam', fullName: 'Phủ Lý, Hà Nam, Việt Nam', lat: 20.5452, lon: 105.9122, flag: '🇻🇳' },
  { name: 'Hải Dương', fullName: 'Hải Dương, Việt Nam', lat: 20.9373, lon: 106.3150, flag: '🇻🇳' },
  { name: 'Hưng Yên', fullName: 'Hưng Yên, Việt Nam', lat: 20.6464, lon: 106.0511, flag: '🇻🇳' },
  { name: 'Nam Định', fullName: 'Nam Định, Việt Nam', lat: 20.4389, lon: 106.1683, flag: '🇻🇳' },
  { name: 'Ninh Bình', fullName: 'Ninh Bình, Việt Nam', lat: 20.2506, lon: 105.9745, flag: '🇻🇳' },
  { name: 'Thái Bình', fullName: 'Thái Bình, Việt Nam', lat: 20.4463, lon: 106.3366, flag: '🇻🇳' },
  { name: 'Vĩnh Phúc', fullName: 'Vĩnh Yên, Vĩnh Phúc, Việt Nam', lat: 21.3090, lon: 105.6049, flag: '🇻🇳' },
  { name: 'Hà Giang', fullName: 'Hà Giang, Việt Nam', lat: 22.8233, lon: 104.9839, flag: '🇻🇳' },
  { name: 'Cao Bằng', fullName: 'Cao Bằng, Việt Nam', lat: 22.6666, lon: 106.2639, flag: '🇻🇳' },
  { name: 'Bắc Kạn', fullName: 'Bắc Kạn, Việt Nam', lat: 22.1470, lon: 105.8348, flag: '🇻🇳' },
  { name: 'Lạng Sơn', fullName: 'Lạng Sơn, Việt Nam', lat: 21.8537, lon: 106.7615, flag: '🇻🇳' },
  { name: 'Tuyên Quang', fullName: 'Tuyên Quang, Việt Nam', lat: 21.8234, lon: 105.2140, flag: '🇻🇳' },
  { name: 'Thái Nguyên', fullName: 'Thái Nguyên, Việt Nam', lat: 21.5942, lon: 105.8482, flag: '🇻🇳' },
  { name: 'Phú Thọ', fullName: 'Việt Trì, Phú Thọ, Việt Nam', lat: 21.3228, lon: 105.4019, flag: '🇻🇳' },
  { name: 'Bắc Giang', fullName: 'Bắc Giang, Việt Nam', lat: 21.2731, lon: 106.1946, flag: '🇻🇳' },
  { name: 'Lào Cai (Sa Pa)', fullName: 'Sa Pa, Lào Cai, Việt Nam', lat: 22.3364, lon: 103.8438, flag: '🇻🇳' },
  { name: 'Yên Bái', fullName: 'Yên Bái, Việt Nam', lat: 21.7168, lon: 104.8986, flag: '🇻🇳' },
  { name: 'Điện Biên', fullName: 'Điện Biên Phủ, Điện Biên, Việt Nam', lat: 21.3860, lon: 103.0205, flag: '🇻🇳' },
  { name: 'Lai Châu', fullName: 'Lai Châu, Việt Nam', lat: 22.3964, lon: 103.4582, flag: '🇻🇳' },
  { name: 'Sơn La', fullName: 'Sơn La, Việt Nam', lat: 21.3283, lon: 103.9148, flag: '🇻🇳' },
  { name: 'Hòa Bình', fullName: 'Hòa Bình, Việt Nam', lat: 20.8172, lon: 105.3376, flag: '🇻🇳' },
];

const VN_TRUNG = [
  { name: 'Thanh Hóa', fullName: 'Thanh Hóa, Việt Nam', lat: 19.8067, lon: 105.7852, flag: '🇻🇳' },
  { name: 'Nghệ An (Vinh)', fullName: 'Vinh, Nghệ An, Việt Nam', lat: 18.6734, lon: 105.6813, flag: '🇻🇳' },
  { name: 'Hà Tĩnh', fullName: 'Hà Tĩnh, Việt Nam', lat: 18.3430, lon: 105.9058, flag: '🇻🇳' },
  { name: 'Quảng Bình', fullName: 'Đồng Hới, Quảng Bình, Việt Nam', lat: 17.4690, lon: 106.6225, flag: '🇻🇳' },
  { name: 'Quảng Trị', fullName: 'Đông Hà, Quảng Trị, Việt Nam', lat: 16.8163, lon: 107.1004, flag: '🇻🇳' },
  { name: 'Thừa Thiên Huế', fullName: 'Huế, Thừa Thiên Huế, Việt Nam', lat: 16.4637, lon: 107.5909, flag: '🇻🇳' },
  { name: 'Đà Nẵng', fullName: 'Đà Nẵng, Việt Nam', lat: 16.0544, lon: 108.2022, flag: '🇻🇳' },
  { name: 'Quảng Nam (Hội An)', fullName: 'Hội An, Quảng Nam, Việt Nam', lat: 15.8801, lon: 108.3380, flag: '🇻🇳' },
  { name: 'Quảng Ngãi', fullName: 'Quảng Ngãi, Việt Nam', lat: 15.1214, lon: 108.7923, flag: '🇻🇳' },
  { name: 'Bình Định (Quy Nhơn)', fullName: 'Quy Nhơn, Bình Định, Việt Nam', lat: 13.7820, lon: 109.2197, flag: '🇻🇳' },
  { name: 'Phú Yên (Tuy Hòa)', fullName: 'Tuy Hòa, Phú Yên, Việt Nam', lat: 13.0882, lon: 109.3175, flag: '🇻🇳' },
  { name: 'Khánh Hòa (Nha Trang)', fullName: 'Nha Trang, Khánh Hòa, Việt Nam', lat: 12.2388, lon: 109.1967, flag: '🇻🇳' },
  { name: 'Ninh Thuận (Phan Rang)', fullName: 'Phan Rang, Ninh Thuận, Việt Nam', lat: 11.5643, lon: 108.9890, flag: '🇻🇳' },
  { name: 'Bình Thuận (Phan Thiết)', fullName: 'Phan Thiết, Bình Thuận, Việt Nam', lat: 10.9805, lon: 108.2615, flag: '🇻🇳' },
  { name: 'Kon Tum', fullName: 'Kon Tum, Việt Nam', lat: 14.3497, lon: 108.0005, flag: '🇻🇳' },
  { name: 'Gia Lai (Pleiku)', fullName: 'Pleiku, Gia Lai, Việt Nam', lat: 13.9833, lon: 108.0000, flag: '🇻🇳' },
  { name: 'Đắk Lắk (Buôn Ma Thuột)', fullName: 'Buôn Ma Thuột, Đắk Lắk, Việt Nam', lat: 12.6675, lon: 108.0383, flag: '🇻🇳' },
  { name: 'Đắk Nông', fullName: 'Gia Nghĩa, Đắk Nông, Việt Nam', lat: 12.0033, lon: 107.6876, flag: '🇻🇳' },
  { name: 'Lâm Đồng (Đà Lạt)', fullName: 'Đà Lạt, Lâm Đồng, Việt Nam', lat: 11.9404, lon: 108.4583, flag: '🇻🇳' },
];

const VN_NAM = [
  { name: 'TP. Hồ Chí Minh', fullName: 'TP. Hồ Chí Minh, Việt Nam', lat: 10.8231, lon: 106.6297, flag: '🇻🇳' },
  { name: 'Bà Rịa - Vũng Tàu', fullName: 'Vũng Tàu, Bà Rịa - Vũng Tàu, Việt Nam', lat: 10.3460, lon: 107.0843, flag: '🇻🇳' },
  { name: 'Bình Dương', fullName: 'Thủ Dầu Một, Bình Dương, Việt Nam', lat: 10.9805, lon: 106.6519, flag: '🇻🇳' },
  { name: 'Bình Phước', fullName: 'Đồng Xoài, Bình Phước, Việt Nam', lat: 11.5333, lon: 106.8833, flag: '🇻🇳' },
  { name: 'Đồng Nai (Biên Hòa)', fullName: 'Biên Hòa, Đồng Nai, Việt Nam', lat: 10.9574, lon: 106.8427, flag: '🇻🇳' },
  { name: 'Tây Ninh', fullName: 'Tây Ninh, Việt Nam', lat: 11.3100, lon: 106.0983, flag: '🇻🇳' },
  { name: 'An Giang', fullName: 'Long Xuyên, An Giang, Việt Nam', lat: 10.3833, lon: 105.4167, flag: '🇻🇳' },
  { name: 'Bạc Liêu', fullName: 'Bạc Liêu, Việt Nam', lat: 9.2941, lon: 105.7278, flag: '🇻🇳' },
  { name: 'Bến Tre', fullName: 'Bến Tre, Việt Nam', lat: 10.2333, lon: 106.3833, flag: '🇻🇳' },
  { name: 'Cà Mau', fullName: 'Cà Mau, Việt Nam', lat: 9.1769, lon: 105.1524, flag: '🇻🇳' },
  { name: 'Cần Thơ', fullName: 'Cần Thơ, Việt Nam', lat: 10.0452, lon: 105.7469, flag: '🇻🇳' },
  { name: 'Đồng Tháp', fullName: 'Cao Lãnh, Đồng Tháp, Việt Nam', lat: 10.4602, lon: 105.6328, flag: '🇻🇳' },
  { name: 'Hậu Giang', fullName: 'Vị Thanh, Hậu Giang, Việt Nam', lat: 9.7844, lon: 105.4701, flag: '🇻🇳' },
  { name: 'Kiên Giang (Phú Quốc)', fullName: 'Phú Quốc, Kiên Giang, Việt Nam', lat: 10.2289, lon: 103.9572, flag: '🇻🇳' },
  { name: 'Long An', fullName: 'Tân An, Long An, Việt Nam', lat: 10.5333, lon: 106.4167, flag: '🇻🇳' },
  { name: 'Sóc Trăng', fullName: 'Sóc Trăng, Việt Nam', lat: 9.6033, lon: 105.9722, flag: '🇻🇳' },
  { name: 'Tiền Giang (Mỹ Tho)', fullName: 'Mỹ Tho, Tiền Giang, Việt Nam', lat: 10.3600, lon: 106.3600, flag: '🇻🇳' },
  { name: 'Trà Vinh', fullName: 'Trà Vinh, Việt Nam', lat: 9.9347, lon: 106.3453, flag: '🇻🇳' },
  { name: 'Vĩnh Long', fullName: 'Vĩnh Long, Việt Nam', lat: 10.2537, lon: 105.9722, flag: '🇻🇳' },
];

const ALL_VN = [...VN_BAC, ...VN_TRUNG, ...VN_NAM];

const LOCATIONS_DB = {
  vietnam: ALL_VN,
  popular: [
    { name: 'Hà Nội', fullName: 'Hà Nội, Việt Nam', lat: 21.0285, lon: 105.8542, flag: '🇻🇳' },
    { name: 'TP. Hồ Chí Minh', fullName: 'TP. Hồ Chí Minh, Việt Nam', lat: 10.8231, lon: 106.6297, flag: '🇻🇳' },
    { name: 'Đà Lạt', fullName: 'Đà Lạt, Lâm Đồng, Việt Nam', lat: 11.9404, lon: 108.4583, flag: '🇻🇳' },
    { name: 'Sa Pa', fullName: 'Sa Pa, Lào Cai, Việt Nam', lat: 22.3364, lon: 103.8438, flag: '🇻🇳' },
    { name: 'Đà Nẵng', fullName: 'Đà Nẵng, Việt Nam', lat: 16.0544, lon: 108.2022, flag: '🇻🇳' },
    { name: 'Phú Quốc', fullName: 'Phú Quốc, Kiên Giang, Việt Nam', lat: 10.2289, lon: 103.9572, flag: '🇻🇳' },
    { name: 'Nha Trang', fullName: 'Nha Trang, Khánh Hòa, Việt Nam', lat: 12.2388, lon: 109.1967, flag: '🇻🇳' },
    { name: 'Vũng Tàu', fullName: 'Vũng Tàu, Bà Rịa - Vũng Tàu, Việt Nam', lat: 10.3460, lon: 107.0843, flag: '🇻🇳' },
    { name: 'Hạ Long', fullName: 'Hạ Long, Quảng Ninh, Việt Nam', lat: 20.9505, lon: 107.0734, flag: '🇻🇳' },
    { name: 'Hội An', fullName: 'Hội An, Quảng Nam, Việt Nam', lat: 15.8801, lon: 108.3380, flag: '🇻🇳' },
    { name: 'Tokyo', fullName: 'Tokyo, Nhật Bản', lat: 35.6762, lon: 139.6503, flag: '🇯🇵' },
    { name: 'Seoul', fullName: 'Seoul, Hàn Quốc', lat: 37.5665, lon: 126.9780, flag: '🇰🇷' },
    { name: 'Bangkok', fullName: 'Bangkok, Thái Lan', lat: 13.7563, lon: 100.5018, flag: '🇹🇭' },
    { name: 'Paris', fullName: 'Paris, Pháp', lat: 48.8566, lon: 2.3522, flag: '🇫🇷' },
    { name: 'London', fullName: 'London, Vương quốc Anh', lat: 51.5074, lon: -0.1278, flag: '🇬🇧' },
    { name: 'New York', fullName: 'New York, Hoa Kỳ', lat: 40.7128, lon: -74.0060, flag: '🇺🇸' },
  ],
  asia: [
    { name: 'Tokyo', fullName: 'Tokyo, Nhật Bản', lat: 35.6762, lon: 139.6503, flag: '🇯🇵' },
    { name: 'Osaka', fullName: 'Osaka, Nhật Bản', lat: 34.6937, lon: 135.5023, flag: '🇯🇵' },
    { name: 'Seoul', fullName: 'Seoul, Hàn Quốc', lat: 37.5665, lon: 126.9780, flag: '🇰🇷' },
    { name: 'Busan', fullName: 'Busan, Hàn Quốc', lat: 35.1796, lon: 129.0756, flag: '🇰🇷' },
    { name: 'Bangkok', fullName: 'Bangkok, Thái Lan', lat: 13.7563, lon: 100.5018, flag: '🇹🇭' },
    { name: 'Singapore', fullName: 'Singapore, Singapore', lat: 1.3521, lon: 103.8198, flag: '🇸🇬' },
    { name: 'Kuala Lumpur', fullName: 'Kuala Lumpur, Malaysia', lat: 3.1390, lon: 101.6869, flag: '🇲🇾' },
    { name: 'Đài Bắc', fullName: 'Đài Bắc, Đài Loan', lat: 25.0330, lon: 121.5654, flag: '🇹🇼' },
    { name: 'Hong Kong', fullName: 'Hong Kong, Trung Quốc', lat: 22.3193, lon: 114.1694, flag: '🇭🇰' },
    { name: 'Bắc Kinh', fullName: 'Bắc Kinh, Trung Quốc', lat: 39.9042, lon: 116.4074, flag: '🇨🇳' },
    { name: 'Thượng Hải', fullName: 'Thượng Hải, Trung Quốc', lat: 31.2304, lon: 121.4737, flag: '🇨🇳' },
    { name: 'Dubai', fullName: 'Dubai, UAE', lat: 25.2048, lon: 55.2708, flag: '🇦🇪' },
  ],
  world: [
    { name: 'London', fullName: 'London, Vương quốc Anh', lat: 51.5074, lon: -0.1278, flag: '🇬🇧' },
    { name: 'Paris', fullName: 'Paris, Pháp', lat: 48.8566, lon: 2.3522, flag: '🇫🇷' },
    { name: 'Rome', fullName: 'Rome, Ý', lat: 41.9028, lon: 12.4964, flag: '🇮🇹' },
    { name: 'Berlin', fullName: 'Berlin, Đức', lat: 52.5200, lon: 13.4050, flag: '🇩🇪' },
    { name: 'New York', fullName: 'New York, Hoa Kỳ', lat: 40.7128, lon: -74.0060, flag: '🇺🇸' },
    { name: 'Los Angeles', fullName: 'Los Angeles, Hoa Kỳ', lat: 34.0522, lon: -118.2437, flag: '🇺🇸' },
    { name: 'Toronto', fullName: 'Toronto, Canada', lat: 43.6532, lon: -79.3832, flag: '🇨🇦' },
    { name: 'Sydney', fullName: 'Sydney, Úc', lat: -33.8688, lon: 151.2093, flag: '🇦🇺' },
    { name: 'Melbourne', fullName: 'Melbourne, Úc', lat: -37.8136, lon: 144.9631, flag: '🇦🇺' },
  ],
};

// --- State Management ---
const state = {
  currentUnit: 'C',
  currentLat: 21.0285,
  currentLon: 105.8542,
  currentPlaceName: 'Hà Nội, Việt Nam',
  weatherData: null,
  refreshTimer: null,
  activeCategory: 'vietnam',
  vnSubRegion: 'all',
  favorites: getSafeFavorites(),
  hourlyHours: 24, // 24 or 48 hours
  dailyDays: 7,    // 7 or 14 days
  themeMode: 'auto', // 'auto', 'dark', 'light'
  radarMap: null,
  radarLayerGroup: null,
  radarFrames: [],
  radarFrameIdx: 0,
  radarPlaying: false,
  radarInterval: null,
  trendChart: null,
};

// --- WMO Weather Code Translator, Icons & Apple Themes ---
const WEATHER_CODES = {
  0: { desc: 'Trời quang đãng, nắng ấm', icon: 'fa-solid fa-sun', iconColor: '#facc15', theme: 'sunny', fx: 'sunny' },
  1: { desc: 'Hầu như không mây, trời trong', icon: 'fa-solid fa-cloud-sun', iconColor: '#fde047', theme: 'sunny', fx: 'sunny' },
  2: { desc: 'Trời có mây rải rác', icon: 'fa-solid fa-cloud-sun', iconColor: '#cbd5e1', theme: 'cloudy', fx: 'cloudy' },
  3: { desc: 'Trời nhiều mây, âm u', icon: 'fa-solid fa-cloud', iconColor: '#94a3b8', theme: 'cloudy', fx: 'cloudy' },
  45: { desc: 'Có sương mù dày', icon: 'fa-solid fa-smog', iconColor: '#cbd5e1', theme: 'fog', fx: 'fog' },
  48: { desc: 'Sương mù đọng băng', icon: 'fa-solid fa-smog', iconColor: '#e2e8f0', theme: 'fog', fx: 'fog' },
  51: { desc: 'Mưa phùn nhẹ', icon: 'fa-solid fa-cloud-rain', iconColor: '#38bdf8', theme: 'rain', fx: 'rain-light' },
  53: { desc: 'Mưa phùn hạt vừa', icon: 'fa-solid fa-cloud-rain', iconColor: '#38bdf8', theme: 'rain', fx: 'rain-light' },
  55: { desc: 'Mưa phùn dày hạt', icon: 'fa-solid fa-cloud-showers-heavy', iconColor: '#0284c7', theme: 'rain', fx: 'rain' },
  61: { desc: 'Mưa nhỏ rải rác', icon: 'fa-solid fa-cloud-rain', iconColor: '#38bdf8', theme: 'rain', fx: 'rain-light' },
  63: { desc: 'Mưa vừa', icon: 'fa-solid fa-cloud-showers-heavy', iconColor: '#0284c7', theme: 'rain', fx: 'rain' },
  65: { desc: 'Mưa to xối xả', icon: 'fa-solid fa-cloud-showers-heavy', iconColor: '#0369a1', theme: 'rain', fx: 'rain-heavy' },
  71: { desc: 'Tuyết rơi nhẹ', icon: 'fa-regular fa-snowflake', iconColor: '#e0f2fe', theme: 'snow', fx: 'snow' },
  73: { desc: 'Tuyết rơi vừa', icon: 'fa-solid fa-snowflake', iconColor: '#bae6fd', theme: 'snow', fx: 'snow' },
  75: { desc: 'Bão tuyết lớn', icon: 'fa-solid fa-snowflake', iconColor: '#7dd3fc', theme: 'snow', fx: 'snow-heavy' },
  80: { desc: 'Mưa rào nhẹ', icon: 'fa-solid fa-cloud-sun-rain', iconColor: '#38bdf8', theme: 'rain', fx: 'rain' },
  81: { desc: 'Mưa rào từng cơn', icon: 'fa-solid fa-cloud-showers-heavy', iconColor: '#0284c7', theme: 'rain', fx: 'rain-heavy' },
  82: { desc: 'Mưa rào như trút nước', icon: 'fa-solid fa-cloud-showers-water', iconColor: '#075985', theme: 'rain', fx: 'rain-heavy' },
  95: { desc: 'Có giông bão sấm chớp', icon: 'fa-solid fa-bolt-lightning', iconColor: '#f59e0b', theme: 'thunder', fx: 'thunder' },
  96: { desc: 'Giông lốc kèm mưa đá', icon: 'fa-solid fa-cloud-bolt', iconColor: '#f59e0b', theme: 'thunder', fx: 'thunder' },
  99: { desc: 'Giông bão dữ dội, nguy hiểm', icon: 'fa-solid fa-cloud-bolt', iconColor: '#ef4444', theme: 'thunder', fx: 'thunder' },
};

function getWeatherInfo(code, isDay = 1) {
  const defaultInfo = { desc: 'Thời tiết bình thường', icon: 'fa-solid fa-cloud', iconColor: '#ffffff', theme: 'sunny', fx: 'none' };
  const info = WEATHER_CODES[code] || defaultInfo;
  
  if (isDay === 0) {
    if (code === 0) return { desc: 'Đêm quang đãng, đầy sao', icon: 'fa-solid fa-moon', iconColor: '#fef08a', theme: 'night', fx: 'stars' };
    if (code <= 3) return { desc: 'Đêm nhiều mây', icon: 'fa-solid fa-cloud-moon', iconColor: '#cbd5e1', theme: 'night', fx: 'cloudy-night' };
    return { ...info, theme: info.theme === 'sunny' ? 'night' : info.theme };
  }
  return info;
}

// --- Astronomical Moon Phase & Tide Estimator ---
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

// --- Severe Weather & Imminent Rain Detection Engine ---
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

  // 1. Kiểm tra Bão / Giông sét nguy hiểm
  if ([95, 96, 99].includes(current.weather_code)) {
    hasSevere = true;
    sTitle = '⚠️ CẢNH BÁO GIÔNG BÃO & SẤM CHỚP NGUY HIỂM';
    sDesc = 'Khu vực đang xảy ra dông lốc mạnh kèm sấm sét. Đề nghị người dân hạn chế ra đường và trú ẩn an toàn.';
  }
  // 2. Kiểm tra Gió mạnh / Lốc xoáy
  else if (windMax >= 45) {
    hasSevere = true;
    sTitle = `🚩 CẢNH BÁO GIÓ MẠNH CẤP ${windMax >= 60 ? '7-8' : '6'} (${Math.round(windMax)} km/h)`;
    sDesc = 'Gió giật mạnh có thể làm gãy đổ cây cối, biển hiệu và nguy hiểm khi di chuyển trên đường.';
  }
  // 3. Cảnh báo Nắng nóng cực đoan / UV cực đại
  else if (uvMax >= 9) {
    hasSevere = true;
    sTitle = `☀️ CẢNH BÁO CHỈ SỐ TIA UV NGUY HẠI CỰC CAO (UV: ${uvMax})`;
    sDesc = 'Bức xạ tia cực tím đạt mức nguy hại cho da và mắt. Tránh tiếp xúc trực tiếp dưới ánh nắng từ 10h - 15h.';
  }

  if (severeBanner) {
    if (hasSevere) {
      alertTitle.textContent = sTitle;
      alertDesc.textContent = sDesc;
      severeBanner.classList.remove('hidden');
    } else {
      severeBanner.classList.add('hidden');
    }
  }

  // 4. Kiểm tra sắp có mưa trong 1-2 giờ tới
  if (rainBanner && hourly && hourly.precipitation_probability) {
    const next2hPops = hourly.precipitation_probability.slice(0, 3);
    const maxPop = Math.max(...next2hPops);
    if (maxPop >= 50 && (current.precipitation || 0) < 0.2) {
      rainText.textContent = `Khả năng cao có mưa trong 1-2 giờ tới (Xác suất mưa: ${maxPop}%). Hãy mang theo ô/áo mưa!`;
      rainBanner.classList.remove('hidden');
    } else {
      rainBanner.classList.add('hidden');
    }
  }
}

// --- Apple Weather Canvas Animation Engine ---
class WeatherFXEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;
    this.currentEffect = 'sunny';
    this.lightningTimer = null;
    this.lightningEl = document.getElementById('lightningOverlay');

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.initParticles(this.currentEffect);
  }

  setEffect(effect) {
    if (this.currentEffect === effect) return;
    this.currentEffect = effect;
    this.clearLightning();
    this.initParticles(effect);

    if (effect === 'thunder') {
      this.startLightning();
    }
  }

  initParticles(effect) {
    this.particles = [];

    if (effect === 'rain' || effect === 'rain-light' || effect === 'rain-heavy' || effect === 'thunder') {
      const count = effect === 'rain-heavy' || effect === 'thunder' ? 180 : (effect === 'rain' ? 110 : 55);
      for (let i = 0; i < count; i++) {
        this.particles.push({
          type: 'raindrop',
          x: Math.random() * (this.width + 200) - 100,
          y: Math.random() * this.height,
          length: Math.random() * 22 + 16,
          speed: Math.random() * 12 + 18,
          opacity: Math.random() * 0.45 + 0.35,
          slant: -3.5,
        });
      }
    } else if (effect === 'stars' || effect === 'cloudy-night') {
      const count = effect === 'stars' ? 90 : 35;
      for (let i = 0; i < count; i++) {
        this.particles.push({
          type: 'star',
          x: Math.random() * this.width,
          y: Math.random() * (this.height * 0.75),
          radius: Math.random() * 1.6 + 0.6,
          alpha: Math.random(),
          speed: Math.random() * 0.02 + 0.005,
          twinkleSpeed: Math.random() * 0.03 + 0.01,
        });
      }
    } else if (effect === 'snow' || effect === 'snow-heavy') {
      const count = effect === 'snow-heavy' ? 120 : 65;
      for (let i = 0; i < count; i++) {
        this.particles.push({
          type: 'snowflake',
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          radius: Math.random() * 3 + 1.2,
          speedY: Math.random() * 1.6 + 0.8,
          speedX: Math.random() * 1 - 0.5,
          opacity: Math.random() * 0.6 + 0.4,
          wobble: Math.random() * Math.PI * 2,
        });
      }
    } else if (effect === 'fog') {
      for (let i = 0; i < 15; i++) {
        this.particles.push({
          type: 'fog',
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          radius: Math.random() * 180 + 120,
          speedX: Math.random() * 0.3 + 0.1,
          opacity: Math.random() * 0.15 + 0.08,
        });
      }
    }
  }

  startLightning() {
    const triggerFlash = () => {
      if (this.currentEffect !== 'thunder') return;
      if (this.lightningEl) {
        this.lightningEl.classList.add('flash');
        setTimeout(() => {
          this.lightningEl.classList.remove('flash');
          if (Math.random() > 0.4) {
            setTimeout(() => {
              this.lightningEl.classList.add('flash');
              setTimeout(() => this.lightningEl.classList.remove('flash'), 60);
            }, 90);
          }
        }, 120);
      }
      const nextDelay = Math.random() * 5000 + 3500;
      this.lightningTimer = setTimeout(triggerFlash, nextDelay);
    };
    this.lightningTimer = setTimeout(triggerFlash, 2500);
  }

  clearLightning() {
    if (this.lightningTimer) {
      clearTimeout(this.lightningTimer);
      this.lightningTimer = null;
    }
    if (this.lightningEl) {
      this.lightningEl.classList.remove('flash');
    }
  }

  start() {
    if (this.animationId) return;
    const loop = () => {
      this.render();
      this.animationId = requestAnimationFrame(loop);
    };
    loop();
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let p of this.particles) {
      if (p.type === 'raindrop') {
        this.ctx.beginPath();
        this.ctx.moveTo(p.x, p.y);
        this.ctx.lineTo(p.x + p.slant, p.y + p.length);
        this.ctx.strokeStyle = `rgba(215, 235, 255, ${p.opacity})`;
        this.ctx.lineWidth = 1.3;
        this.ctx.lineCap = 'round';
        this.ctx.stroke();

        p.x += p.slant * (p.speed / 15);
        p.y += p.speed;

        if (p.y > this.height) {
          p.y = -p.length;
          p.x = Math.random() * (this.width + 100) - 50;
        }
      } else if (p.type === 'star') {
        p.alpha += p.twinkleSpeed;
        const currentAlpha = Math.abs(Math.sin(p.alpha)) * 0.8 + 0.2;

        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
        this.ctx.shadowBlur = 4;
        this.ctx.shadowColor = '#ffffff';
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
      } else if (p.type === 'snowflake') {
        p.wobble += 0.02;
        p.x += Math.sin(p.wobble) * 0.8 + p.speedX;
        p.y += p.speedY;

        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        this.ctx.shadowBlur = 5;
        this.ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
        this.ctx.fill();
        this.ctx.shadowBlur = 0;

        if (p.y > this.height) {
          p.y = -5;
          p.x = Math.random() * this.width;
        }
      } else if (p.type === 'fog') {
        p.x += p.speedX;
        if (p.x - p.radius > this.width) p.x = -p.radius;

        const grad = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        grad.addColorStop(0, `rgba(255, 255, 255, ${p.opacity})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
  }
}

// Instantiate FX Engine
const fxEngine = new WeatherFXEngine('weatherCanvas');
fxEngine.start();

// --- DOM Elements ---
const cityInput = document.getElementById('cityInput');
const suggestionsList = document.getElementById('suggestionsList');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const geoBtn = document.getElementById('geoBtn');
const unitCBtn = document.getElementById('unitC');
const unitFBtn = document.getElementById('unitF');
const loadingIndicator = document.getElementById('loadingIndicator');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const weatherContent = document.getElementById('weatherContent');
const quickCitiesContainer = document.getElementById('quickCitiesContainer');
const vnRegionFilters = document.getElementById('vnRegionFilters');
const favToggleBtn = document.getElementById('favToggleBtn');
const favStarIcon = document.getElementById('favStarIcon');
const cardFavBtn = document.getElementById('cardFavBtn');
const cardFavIcon = document.getElementById('cardFavIcon');
const favCountEl = document.getElementById('favCount');

// --- Helper Functions ---
function cToF(c) {
  return Math.round((c * 9) / 5 + 32);
}

function formatTemp(val) {
  if (val === undefined || val === null) return '--';
  return state.currentUnit === 'C' ? Math.round(val) : cToF(val);
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

// --- Favorites Management ---
function isCurrentFavorite() {
  return state.favorites.some(f => f.name === state.currentPlaceName || (Math.abs(f.lat - state.currentLat) < 0.01 && Math.abs(f.lon - state.currentLon) < 0.01));
}

function updateFavUI() {
  const isFav = isCurrentFavorite();
  favToggleBtn.classList.toggle('is-fav', isFav);
  favStarIcon.className = isFav ? 'fa-solid fa-star' : 'fa-regular fa-star';
  cardFavBtn.classList.toggle('is-fav', isFav);
  cardFavIcon.className = isFav ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark';
  favCountEl.textContent = state.favorites.length;
}

function toggleFavorite() {
  const idx = state.favorites.findIndex(f => f.name === state.currentPlaceName || (Math.abs(f.lat - state.currentLat) < 0.01 && Math.abs(f.lon - state.currentLon) < 0.01));
  if (idx >= 0) {
    state.favorites.splice(idx, 1);
  } else {
    state.favorites.unshift({
      name: state.currentPlaceName.split(',')[0],
      fullName: state.currentPlaceName,
      lat: state.currentLat,
      lon: state.currentLon,
      flag: '📍'
    });
  }
  localStorage.setItem('meteo_favorites', JSON.stringify(state.favorites));
  updateFavUI();
  if (state.activeCategory === 'favorites') {
    renderQuickLocationChips('favorites');
  }
}

favToggleBtn.addEventListener('click', toggleFavorite);
cardFavBtn.addEventListener('click', toggleFavorite);

// --- Location Explorer Category Tabs & VN Region Sub-filters ---
function renderQuickLocationChips(category) {
  state.activeCategory = category;
  quickCitiesContainer.innerHTML = '';

  // Show or hide VN sub-filters
  vnRegionFilters.classList.toggle('hidden', category !== 'vietnam');

  let list = [];
  if (category === 'vietnam') {
    if (state.vnSubRegion === 'bac') list = VN_BAC;
    else if (state.vnSubRegion === 'trung') list = VN_TRUNG;
    else if (state.vnSubRegion === 'nam') list = VN_NAM;
    else list = ALL_VN;
  } else if (category === 'favorites') {
    list = state.favorites;
    if (list.length === 0) {
      quickCitiesContainer.innerHTML = `<span style="color: var(--text-sub); font-size: 0.85rem; padding: 6px 12px;">Chưa có địa điểm đã lưu. Hãy bấm biểu tượng ⭐ hoặc 🔖 để lưu địa điểm yêu thích của bạn!</span>`;
      return;
    }
  } else {
    list = LOCATIONS_DB[category] || LOCATIONS_DB.popular;
  }

  list.forEach(item => {
    if (!item || !isValidCoordinate(item.lat, item.lon)) return;
    const chip = document.createElement('button');
    chip.className = 'city-chip';
    if (item.fullName === state.currentPlaceName || item.name === state.currentPlaceName) {
      chip.classList.add('active-chip');
    }
    chip.innerHTML = `
      <span class="chip-flag">${escapeHTML(item.flag || '📍')}</span>
      <span>${escapeHTML(item.name || '')}</span>
    `;
    chip.addEventListener('click', () => {
      cityInput.value = item.fullName;
      fetchWeather(item.lat, item.lon, item.fullName);
    });
    quickCitiesContainer.appendChild(chip);
  });
}

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderQuickLocationChips(btn.dataset.category);
  });
});

document.querySelectorAll('.sub-filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.sub-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.vnSubRegion = btn.dataset.sub;
    renderQuickLocationChips('vietnam');
  });
});

// --- Fetch Weather Data (Open-Meteo Realtime API) ---
async function fetchWeather(lat, lon, placeName) {
  try {
    showLoading(true);
    showError(false);

    if (!isValidCoordinate(lat, lon)) {
      throw new Error('Tọa độ địa lý không hợp lệ hoặc bị lỗi.');
    }

    const safeLat = encodeURIComponent(lat);
    const safeLon = encodeURIComponent(lon);
    
    let data = null;
    // 1. Thử kết nối Django REST API Backend (hỗ trợ Cache & Rate Limiting)
    try {
      const backendRes = await safeFetch(`http://127.0.0.1:8000/api/weather/forecast/?lat=${safeLat}&lon=${safeLon}&place=${encodeURIComponent(placeName || '')}`, 2000);
      if (backendRes && backendRes.status === 'success' && backendRes.data) {
        data = backendRes.data;
      }
    } catch (e) {
      // Backend đang tắt hoặc không khả dụng -> fallback trực tiếp Open-Meteo
    }

    // 2. Fallback trực tiếp sang Open-Meteo API
    if (!data) {
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${safeLat}&longitude=${safeLon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,uv_index,visibility&hourly=temperature_2m,weather_code,precipitation_probability,precipitation,visibility,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&forecast_days=14&timezone=auto`;
      data = await safeFetch(weatherUrl, 8000);
    }
    state.weatherData = data;
    state.currentLat = lat;
    state.currentLon = lon;
    if (placeName) state.currentPlaceName = placeName;

    renderWeatherData();
    updateFavUI();
    renderQuickLocationChips(state.activeCategory);
  } catch (err) {
    showError(true, err.message || 'Đã có lỗi xảy ra khi tải dữ liệu thời tiết.');
  } finally {
    showLoading(false);
  }
}

// --- Render UI & Update Dynamic Apple Visuals ---
function renderWeatherData() {
  const data = state.weatherData;
  if (!data || !data.current) return;

  const current = data.current;
  const daily = data.daily;
  const hourly = data.hourly;
  const info = getWeatherInfo(current.weather_code, current.is_day);

  // Apply Apple Weather Theme & Visual FX (nếu không ở chế độ cưỡng bức Dark/Light)
  if (state.themeMode === 'auto') {
    document.body.className = `theme-${info.theme}`;
  }
  fxEngine.setEffect(info.fx);

  // Current Weather Card
  const shortName = state.currentPlaceName.split(',')[0];
  document.getElementById('cityName').textContent = state.currentPlaceName;
  document.title = `${formatTemp(current.temperature_2m)}°${state.currentUnit} - ${shortName} | VietWeather`;

  const mapLinkEl = document.getElementById('openMapLink');
  if (mapLinkEl) {
    mapLinkEl.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(state.currentLat)},${encodeURIComponent(state.currentLon)}`;
  }

  const now = new Date();
  document.getElementById('localTime').textContent = `Cập nhật: ${now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} • ${now.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit' })}`;

  const mainIconEl = document.getElementById('mainWeatherIcon');
  mainIconEl.innerHTML = `<i class="${info.icon}" style="color: ${info.iconColor}"></i>`;
  document.getElementById('currentTemp').textContent = formatTemp(current.temperature_2m);
  document.getElementById('weatherDescription').textContent = info.desc;
  document.getElementById('feelsLikeTemp').textContent = formatTemp(current.apparent_temperature);

  document.getElementById('maxTemp').textContent = formatTemp(daily.temperature_2m_max[0]);
  document.getElementById('minTemp').textContent = formatTemp(daily.temperature_2m_min[0]);

  // Metrics Grid
  document.getElementById('humidityVal').textContent = current.relative_humidity_2m;
  document.getElementById('windSpeedVal').textContent = Math.round(current.wind_speed_10m);
  document.getElementById('windDirVal').textContent = `Hướng: ${getWindDirection(current.wind_direction_10m)}`;
  
  const uv = current.uv_index !== undefined ? current.uv_index : (daily.uv_index_max[0] || 0);
  document.getElementById('uvVal').textContent = uv;
  document.getElementById('uvDesc').textContent = getUVDescription(uv);

  document.getElementById('pressureVal').textContent = Math.round(current.surface_pressure);
  document.getElementById('rainVal').textContent = (current.precipitation || 0).toFixed(1);

  // Tầm nhìn (Visibility km)
  const visKm = current.visibility !== undefined ? (current.visibility / 1000).toFixed(1) : 10;
  const visEl = document.getElementById('visibilityVal');
  if (visEl) visEl.textContent = visKm;
  const visDescEl = document.getElementById('visibilityDesc');
  if (visDescEl) visDescEl.textContent = visKm >= 10 ? 'Rất tốt (Quang đãng)' : (visKm >= 5 ? 'Trung bình' : 'Kém (Có sương mù)');

  // Pha Mặt trăng & Thủy triều
  const moon = getMoonPhase();
  const moonNameEl = document.getElementById('moonPhaseName');
  if (moonNameEl) moonNameEl.textContent = moon.name;
  const moonIllumEl = document.getElementById('moonIllumVal');
  if (moonIllumEl) moonIllumEl.textContent = `Độ sáng: ${moon.illum}% • ${moon.desc}`;

  if (daily.sunrise && daily.sunset) {
    const sunriseTime = daily.sunrise[0].split('T')[1];
    const sunsetTime = daily.sunset[0].split('T')[1];
    document.getElementById('sunriseVal').textContent = sunriseTime;
    document.getElementById('sunsetVal').textContent = sunsetTime;
  }

  // Severe Weather Alerts & Imminent Rain Check
  checkAndShowWeatherAlerts(current, daily, hourly);

  // Render Forecasts
  renderHourlyForecast(hourly);
  renderDailyForecast(daily);

  // Render Chart.js Trend
  renderWeatherTrendChart(hourly);

  // Render Interactive Radar Map
  initOrUpdateRadarMap(state.currentLat, state.currentLon);
}

function renderHourlyForecast(hourly) {
  const slider = document.getElementById('hourlySlider');
  slider.innerHTML = '';

  const now = new Date();
  const currentHourStr = now.toISOString().slice(0, 13);

  let startIndex = hourly.time.findIndex(t => t.startsWith(currentHourStr));
  if (startIndex === -1) startIndex = 0;

  const count = state.hourlyHours || 24;

  for (let i = startIndex; i < startIndex + count && i < hourly.time.length; i++) {
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
      <span class="hourly-temp">${formatTemp(temp)}°</span>
      ${pop > 0 ? `<span class="hourly-pop"><i class="fa-solid fa-droplet"></i> ${pop}%</span>` : ''}
    `;
    slider.appendChild(card);
  }
}

function renderDailyForecast(daily) {
  const list = document.getElementById('dailyList');
  list.innerHTML = '';

  const count = state.dailyDays || 7;

  for (let i = 0; i < count && i < daily.time.length; i++) {
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
        <span>${formatTemp(maxT)}°</span>
        <span class="min-t">${formatTemp(minT)}°</span>
      </div>
    `;
    list.appendChild(item);
  }
}

// --- Chart.js Trend Visualizer ---
function renderWeatherTrendChart(hourly) {
  const canvas = document.getElementById('weatherTrendChart');
  if (!canvas || typeof Chart === 'undefined') return;

  const now = new Date();
  const currentHourStr = now.toISOString().slice(0, 13);
  let startIndex = hourly.time.findIndex(t => t.startsWith(currentHourStr));
  if (startIndex === -1) startIndex = 0;

  const count = state.hourlyHours || 24;
  const labels = [];
  const temps = [];
  const pops = [];

  for (let i = startIndex; i < startIndex + count && i < hourly.time.length; i++) {
    const timeStr = hourly.time[i];
    const hour = timeStr.split('T')[1].slice(0, 5);
    labels.push(i === startIndex ? 'Hiện tại' : hour);
    temps.push(Math.round(formatTemp(hourly.temperature_2m[i])));
    pops.push(hourly.precipitation_probability ? hourly.precipitation_probability[i] : 0);
  }

  if (state.trendChart) {
    state.trendChart.destroy();
  }

  const ctx = canvas.getContext('2d');
  const tempGradient = ctx.createLinearGradient(0, 0, 0, 220);
  tempGradient.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
  tempGradient.addColorStop(1, 'rgba(56, 189, 248, 0.0)');

  state.trendChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: `Nhiệt độ (°${state.currentUnit})`,
          data: temps,
          borderColor: '#38bdf8',
          backgroundColor: tempGradient,
          fill: true,
          tension: 0.35,
          pointRadius: 3,
          pointHoverRadius: 6,
          pointBackgroundColor: '#ffffff',
          yAxisID: 'yTemp',
        },
        {
          label: 'Xác suất mưa (%)',
          data: pops,
          type: 'bar',
          backgroundColor: 'rgba(96, 165, 250, 0.4)',
          borderRadius: 4,
          yAxisID: 'yPop',
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          titleFont: { family: 'Plus Jakarta Sans', size: 12 },
          bodyFont: { family: 'Plus Jakarta Sans', size: 12 },
          padding: 10,
          cornerRadius: 8,
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.06)' },
          ticks: { color: 'rgba(255, 255, 255, 0.65)', font: { size: 11 }, maxRotation: 0 }
        },
        yTemp: {
          type: 'linear',
          position: 'left',
          grid: { color: 'rgba(255, 255, 255, 0.08)' },
          ticks: { color: '#38bdf8', callback: v => `${v}°` }
        },
        yPop: {
          type: 'linear',
          position: 'right',
          min: 0,
          max: 100,
          grid: { display: false },
          ticks: { color: '#60a5fa', callback: v => `${v}%` }
        }
      }
    }
  });
}

// --- Live Radar Map (Leaflet + RainViewer) ---
let rainviewerData = null;
async function initOrUpdateRadarMap(lat, lon) {
  const mapEl = document.getElementById('radarMap');
  if (!mapEl || typeof L === 'undefined') return;

  if (!state.radarMap) {
    state.radarMap = L.map('radarMap', {
      center: [lat, lon],
      zoom: 7,
      zoomControl: false,
      attributionControl: false
    });

    L.control.zoom({ position: 'topright' }).addTo(state.radarMap);

    // Free OpenStreetMap Basemap (100% Miễn phí, Không cần API Key, Không có Watermark)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap'
    }).addTo(state.radarMap);

    state.radarLayerGroup = L.layerGroup().addTo(state.radarMap);
  } else {
    state.radarMap.setView([lat, lon], 7);
  }

  // Location Marker
  if (state.radarMarker) state.radarMap.removeLayer(state.radarMarker);
  state.radarMarker = L.circleMarker([lat, lon], {
    radius: 7,
    fillColor: '#38bdf8',
    color: '#ffffff',
    weight: 2,
    opacity: 1,
    fillOpacity: 0.9
  }).addTo(state.radarMap).bindPopup(state.currentPlaceName);

  // Fetch Radar frames
  try {
    if (!rainviewerData) {
      const res = await safeFetch('https://api.rainviewer.com/public/weather-maps.json', 5000);
      rainviewerData = res;
    }

    if (rainviewerData && rainviewerData.radar && rainviewerData.radar.past) {
      state.radarFrames = rainviewerData.radar.past;
      showRadarFrame(state.radarFrames.length - 1);
    }
  } catch (err) {
    console.log('Radar tile load notice:', err);
  }
}

function showRadarFrame(idx) {
  if (!state.radarFrames || !state.radarFrames[idx] || !state.radarMap) return;
  state.radarFrameIdx = idx;
  const frame = state.radarFrames[idx];

  state.radarLayerGroup.clearLayers();
  const radarTileUrl = `https://tilecache.rainviewer.com/v2/radar/${frame.path}/256/{z}/{x}/{y}/2/1_1.png`;
  L.tileLayer(radarTileUrl, { opacity: 0.75, zIndex: 100 }).addTo(state.radarLayerGroup);

  const radarTimeLabel = document.getElementById('radarTimeLabel');
  if (radarTimeLabel) {
    const d = new Date(frame.time * 1000);
    radarTimeLabel.textContent = `Radar: ${d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
  }
}

// --- Autocomplete Search using Open-Meteo Geocoding API (Up to 10 results) ---
let debounceTimer = null;

cityInput.addEventListener('input', (e) => {
  const query = sanitizeInput(e.target.value);
  clearSearchBtn.classList.toggle('active', query.length > 0);

  clearTimeout(debounceTimer);
  if (query.length < 2) {
    suggestionsList.classList.remove('show');
    return;
  }

  debounceTimer = setTimeout(() => {
    fetchCitySuggestions(query);
  }, 220);
});

async function fetchCitySuggestions(query) {
  try {
    const cleanQuery = sanitizeInput(query);
    if (cleanQuery.length < 2) return;

    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanQuery)}&count=10&language=vi&format=json`;
    const data = await safeFetch(geoUrl, 6000);

    if (data && data.results && data.results.length > 0) {
      renderSuggestions(data.results);
    } else {
      suggestionsList.innerHTML = `<div class="suggestion-item"><span class="suggestion-sub">Không tìm thấy địa điểm khớp với "${escapeHTML(cleanQuery)}"</span></div>`;
      suggestionsList.classList.add('show');
    }
  } catch (err) {
    console.error('Lỗi khi tra cứu địa điểm:', err);
  }
}

function renderSuggestions(places) {
  suggestionsList.innerHTML = '';
  places.forEach(place => {
    if (!place || !isValidCoordinate(place.latitude, place.longitude)) return;

    const item = document.createElement('div');
    item.className = 'suggestion-item';

    const safeName = escapeHTML(place.name || '');
    const stateCountry = [place.admin1, place.country].filter(Boolean).map(escapeHTML).join(', ');
    const fullDisplayName = `${place.name || ''}${stateCountry ? `, ${stateCountry}` : ''}`;
    const countryCode = place.country_code ? escapeHTML(place.country_code.toUpperCase()) : '';

    item.innerHTML = `
      <div class="suggestion-item-left">
        <i class="fa-solid fa-location-dot"></i>
        <div class="suggestion-info">
          <span class="suggestion-main">${safeName}</span>
          <span class="suggestion-sub">${stateCountry} &bull; (${place.latitude.toFixed(2)}°, ${place.longitude.toFixed(2)}°)</span>
        </div>
      </div>
      ${countryCode ? `<span class="country-flag-badge">${countryCode}</span>` : ''}
    `;

    item.addEventListener('click', () => {
      cityInput.value = fullDisplayName;
      suggestionsList.classList.remove('show');
      fetchWeather(place.latitude, place.longitude, fullDisplayName);
    });

    suggestionsList.appendChild(item);
  });
  suggestionsList.classList.add('show');
}

// Close suggestions when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-wrapper')) {
    suggestionsList.classList.remove('show');
  }
});

// Clear input button
clearSearchBtn.addEventListener('click', () => {
  cityInput.value = '';
  clearSearchBtn.classList.remove('active');
  suggestionsList.classList.remove('show');
  cityInput.focus();
});

// Press Enter to search first match
cityInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const firstItem = suggestionsList.querySelector('.suggestion-item');
    if (firstItem) {
      firstItem.click();
    }
  }
});

// --- Location Permission Modal & Safe Tracking Logic ---
const locationPermissionModal = document.getElementById('locationPermissionModal');
const allowLocationBtn = document.getElementById('allowLocationBtn');
const denyLocationBtn = document.getElementById('denyLocationBtn');

function showLocationPermissionModal() {
  if (locationPermissionModal) {
    locationPermissionModal.classList.remove('hidden');
  }
}

function hideLocationPermissionModal() {
  if (locationPermissionModal) {
    locationPermissionModal.classList.add('hidden');
  }
}

// User explicitly approves location tracking
allowLocationBtn.addEventListener('click', () => {
  localStorage.setItem('meteo_loc_decision', 'allowed');
  hideLocationPermissionModal();
  requestGPSLocation();
});

// User declines location tracking
denyLocationBtn.addEventListener('click', () => {
  localStorage.setItem('meteo_loc_decision', 'denied');
  hideLocationPermissionModal();
});

// Current GPS Location Button on Search Bar
geoBtn.addEventListener('click', () => {
  // Always show permission confirmation dialog if requested or not yet approved
  const decision = localStorage.getItem('meteo_loc_decision');
  if (decision === 'allowed') {
    requestGPSLocation();
  } else {
    showLocationPermissionModal();
  }
});

// Request GPS position safely with reverse-geocoding
function requestGPSLocation() {
  if (!navigator.geolocation) {
    alert('Trình duyệt của bạn không hỗ trợ định vị GPS.');
    return;
  }

  showLoading(true);
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = Number(pos.coords.latitude);
      const lon = Number(pos.coords.longitude);
      if (!isValidCoordinate(lat, lon)) {
        showLoading(false);
        alert('Tọa độ vị trí nhận được không hợp lệ.');
        return;
      }
      let placeDisplayName = `Vị trí của bạn (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`;

      // Try reverse geocoding via BigDataCloud client API safely
      try {
        const revData = await safeFetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&localityLanguage=vi`, 5000);
        if (revData) {
          const parts = [revData.locality || revData.city, revData.principalSubdivision, revData.countryName].filter(Boolean);
          if (parts.length > 0) {
            placeDisplayName = `${parts.join(', ')} 📍`;
          }
        }
      } catch (e) {
        console.log('Reverse geocoding fallback:', e);
      }

      cityInput.value = placeDisplayName;
      fetchWeather(lat, lon, placeDisplayName);
    },
    (err) => {
      showLoading(false);
      let errMsg = 'Không thể lấy vị trí hiện tại.';
      if (err.code === err.PERMISSION_DENIED) {
        errMsg = 'Bạn đã từ chối quyền truy cập vị trí trên trình duyệt. Hãy mở cài đặt trình duyệt để cấp quyền nếu muốn xem thời tiết nơi bạn đang ở.';
      }
      alert(errMsg);
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
  );
}

// Unit toggles (°C / °F)
unitCBtn.addEventListener('click', () => {
  if (state.currentUnit === 'C') return;
  state.currentUnit = 'C';
  unitCBtn.classList.add('active');
  unitFBtn.classList.remove('active');
  renderWeatherData();
});

unitFBtn.addEventListener('click', () => {
  if (state.currentUnit === 'F') return;
  state.currentUnit = 'F';
  unitFBtn.classList.add('active');
  unitCBtn.classList.remove('active');
  renderWeatherData();
});

// UI states helper
function showLoading(isLoading) {
  loadingIndicator.classList.toggle('hidden', !isLoading);
  weatherContent.style.opacity = isLoading ? '0.4' : '1';
}

function showError(isErr, msg = '') {
  errorMessage.classList.toggle('hidden', !isErr);
  if (msg) errorText.textContent = msg;
}

// Auto refresh every 5 minutes (Real-time update)
state.refreshTimer = setInterval(() => {
  if (state.currentLat && state.currentLon) {
    fetchWeather(state.currentLat, state.currentLon, state.currentPlaceName);
  }
}, 5 * 60 * 1000);

// Initialize Location Explorer Chips & Fav Count
renderQuickLocationChips('vietnam');
updateFavUI();

// Initial Load (Default: Hà Nội)
fetchWeather(state.currentLat, state.currentLon, state.currentPlaceName);

// FAQ Modal & Privacy Policy Modal Event Handlers
const faqModal = document.getElementById('faqModal');
const openFaqBtn = document.getElementById('openFaqBtn');
const closeFaqBtn = document.getElementById('closeFaqBtn');

const privacyModal = document.getElementById('privacyModal');
const openPrivacyBtn = document.getElementById('openPrivacyBtn');
const closePrivacyBtn = document.getElementById('closePrivacyBtn');

if (openFaqBtn && faqModal) {
  openFaqBtn.addEventListener('click', () => faqModal.classList.remove('hidden'));
}
if (closeFaqBtn && faqModal) {
  closeFaqBtn.addEventListener('click', () => faqModal.classList.add('hidden'));
}

if (openPrivacyBtn && privacyModal) {
  openPrivacyBtn.addEventListener('click', () => privacyModal.classList.remove('hidden'));
}
if (closePrivacyBtn && privacyModal) {
  closePrivacyBtn.addEventListener('click', () => privacyModal.classList.add('hidden'));
}

// Close modals when clicking overlay background
[faqModal, privacyModal, locationPermissionModal].forEach(modal => {
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.add('hidden');
    });
  }
});

// --- View Toggle Controls (24h/48h & 7d/14d) ---
const hourly24Btn = document.getElementById('hourly24Btn');
const hourly48Btn = document.getElementById('hourly48Btn');
if (hourly24Btn && hourly48Btn) {
  hourly24Btn.addEventListener('click', () => {
    state.hourlyHours = 24;
    hourly24Btn.classList.add('active');
    hourly48Btn.classList.remove('active');
    if (state.weatherData && state.weatherData.hourly) {
      renderHourlyForecast(state.weatherData.hourly);
      renderWeatherTrendChart(state.weatherData.hourly);
    }
  });
  hourly48Btn.addEventListener('click', () => {
    state.hourlyHours = 48;
    hourly48Btn.classList.add('active');
    hourly24Btn.classList.remove('active');
    if (state.weatherData && state.weatherData.hourly) {
      renderHourlyForecast(state.weatherData.hourly);
      renderWeatherTrendChart(state.weatherData.hourly);
    }
  });
}

const daily7Btn = document.getElementById('daily7Btn');
const daily14Btn = document.getElementById('daily14Btn');
if (daily7Btn && daily14Btn) {
  daily7Btn.addEventListener('click', () => {
    state.dailyDays = 7;
    daily7Btn.classList.add('active');
    daily14Btn.classList.remove('active');
    if (state.weatherData && state.weatherData.daily) {
      renderDailyForecast(state.weatherData.daily);
    }
  });
  daily14Btn.addEventListener('click', () => {
    state.dailyDays = 14;
    daily14Btn.classList.add('active');
    daily7Btn.classList.remove('active');
    if (state.weatherData && state.weatherData.daily) {
      renderDailyForecast(state.weatherData.daily);
    }
  });
}

// --- Theme Mode Switcher (Apple Dynamic / Dark / Light) ---
const themeModeBtn = document.getElementById('themeModeBtn');
const themeModeIcon = document.getElementById('themeModeIcon');
if (themeModeBtn) {
  themeModeBtn.addEventListener('click', () => {
    if (state.themeMode === 'auto') {
      state.themeMode = 'dark';
      document.body.classList.remove('theme-forced-light');
      document.body.classList.add('theme-forced-dark');
      if (themeModeIcon) themeModeIcon.className = 'fa-solid fa-moon';
    } else if (state.themeMode === 'dark') {
      state.themeMode = 'light';
      document.body.classList.remove('theme-forced-dark');
      document.body.classList.add('theme-forced-light');
      if (themeModeIcon) themeModeIcon.className = 'fa-solid fa-sun';
    } else {
      state.themeMode = 'auto';
      document.body.classList.remove('theme-forced-dark', 'theme-forced-light');
      if (themeModeIcon) themeModeIcon.className = 'fa-solid fa-circle-half-stroke';
      if (state.weatherData && state.weatherData.current) {
        const info = getWeatherInfo(state.weatherData.current.weather_code, state.weatherData.current.is_day);
        document.body.className = `theme-${info.theme}`;
      }
    }
  });
}

// --- Radar Play Controls ---
const radarPlayBtn = document.getElementById('radarPlayBtn');
if (radarPlayBtn) {
  radarPlayBtn.addEventListener('click', () => {
    if (state.radarPlaying) {
      clearInterval(state.radarInterval);
      state.radarPlaying = false;
      radarPlayBtn.innerHTML = '<i class="fa-solid fa-play"></i> Quét vệt mưa';
    } else {
      if (!state.radarFrames || state.radarFrames.length === 0) return;
      state.radarPlaying = true;
      radarPlayBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Dừng quét';
      let cur = 0;
      state.radarInterval = setInterval(() => {
        showRadarFrame(cur);
        cur = (cur + 1) % state.radarFrames.length;
      }, 650);
    }
  });
}

// --- Dismiss Severe Weather Alert ---
const dismissAlertBtn = document.getElementById('dismissAlertBtn');
if (dismissAlertBtn) {
  dismissAlertBtn.addEventListener('click', () => {
    const banner = document.getElementById('severeAlertBanner');
    if (banner) banner.classList.add('hidden');
  });
}

// ========================================================
// ANTI-TAMPERING & SOURCE CODE PROTECTION SYSTEM
// ========================================================
const tamperWarningEl = document.getElementById('tamperWarning');
const tamperMsgEl = document.getElementById('tamperMsg');
let tamperToastTimer = null;

function showTamperWarning(msg) {
  if (!tamperWarningEl) return;
  if (tamperMsgEl) tamperMsgEl.textContent = msg || 'Mã nguồn trang web đã được bảo vệ bản quyền!';
  tamperWarningEl.classList.remove('hidden');
  clearTimeout(tamperToastTimer);
  tamperToastTimer = setTimeout(() => {
    tamperWarningEl.classList.add('hidden');
  }, 2500);
}

// 1. Chặn chuột phải (Disable Context Menu)
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  showTamperWarning('Chuột phải đã bị vô hiệu hóa để bảo vệ bản quyền mã nguồn!');
  return false;
});

// 2. Chặn các phím tắt mở DevTools, xem nguồn (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U, Ctrl+S)
document.addEventListener('keydown', (e) => {
  // F12
  if (e.key === 'F12') {
    e.preventDefault();
    e.stopPropagation();
    showTamperWarning('Phím F12 (Inspect) đã bị khóa!');
    return false;
  }

  // Ctrl + Shift + I / J / C (DevTools & Console)
  if (e.ctrlKey && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) {
    e.preventDefault();
    e.stopPropagation();
    showTamperWarning('Phím tắt mở bảng điều khiển DevTools đã bị khóa!');
    return false;
  }

  // Ctrl + U (View Source) hoặc Ctrl + S (Save page)
  if (e.ctrlKey && ['U', 'u', 'S', 's'].includes(e.key)) {
    e.preventDefault();
    e.stopPropagation();
    showTamperWarning('Tính năng xem / lưu mã nguồn đã bị vô hiệu hóa!');
    return false;
  }
});

// 3. Chặn kéo thả hình ảnh và phần tử trái phép
document.addEventListener('dragstart', (e) => {
  e.preventDefault();
  return false;
});

// 4. Đóng băng dữ liệu cấu hình (Prevent Object Mutation & Tampering)
try {
  Object.freeze(LOCATIONS_DB);
  Object.freeze(WEATHER_CODES);
  Object.freeze(VN_BAC);
  Object.freeze(VN_TRUNG);
  Object.freeze(VN_NAM);
  Object.freeze(ALL_VN);
} catch (e) {}

// 5. Tắt thông báo rò rỉ trong Console môi trường Production
(function disableConsoleInspection() {
  const noop = () => {};
  window.console.log = noop;
  window.console.debug = noop;
  window.console.info = noop;
})();

