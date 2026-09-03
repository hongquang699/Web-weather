// ========================================================
// MODULE: location.js - Quản lý Địa danh 63 Tỉnh thành & Định vị GPS
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
  { name: 'Thanh Hóa', fullName: 'Thanh Hóa, Việt Nam', lat: 19.8067, lon: 105.7852, flag: '🇻🇳', keywords: ['thanh hoa', 'sam son'] },
  { name: 'Nghệ An', fullName: 'Nghệ An, Việt Nam', lat: 18.6734, lon: 105.6813, flag: '🇻🇳', keywords: ['nghe an', 'vinh', 'thanh pho vinh', 'tp vinh', 'cua lo'] },
  { name: 'Hà Tĩnh', fullName: 'Hà Tĩnh, Việt Nam', lat: 18.3430, lon: 105.9058, flag: '🇻🇳', keywords: ['ha tinh', 'hong linh'] },
  { name: 'Quảng Bình', fullName: 'Quảng Bình, Việt Nam', lat: 17.4690, lon: 106.6225, flag: '🇻🇳', keywords: ['quang binh', 'dong hoi', 'phong nha'] },
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
  { name: 'An Giang (Long Xuyên)', fullName: 'Long Xuyên, An Giang, Việt Nam', lat: 10.3833, lon: 105.4167, flag: '🇻🇳' },
  { name: 'Bạc Liêu', fullName: 'Bạc Liêu, Việt Nam', lat: 9.2941, lon: 105.7244, flag: '🇻🇳' },
  { name: 'Bến Tre', fullName: 'Bến Tre, Việt Nam', lat: 10.2433, lon: 106.3756, flag: '🇻🇳' },
  { name: 'Cà Mau', fullName: 'Cà Mau, Việt Nam', lat: 9.1769, lon: 105.1524, flag: '🇻🇳' },
  { name: 'Cần Thơ', fullName: 'Cần Thơ, Việt Nam', lat: 10.0452, lon: 105.7469, flag: '🇻🇳' },
  { name: 'Đồng Tháp (Cao Lãnh)', fullName: 'Cao Lãnh, Đồng Tháp, Việt Nam', lat: 10.4602, lon: 105.6328, flag: '🇻🇳' },
  { name: 'Hậu Giang (Vị Thanh)', fullName: 'Vị Thanh, Hậu Giang, Việt Nam', lat: 9.7844, lon: 105.4706, flag: '🇻🇳' },
  { name: 'Kiên Giang (Phú Quốc)', fullName: 'Phú Quốc, Kiên Giang, Việt Nam', lat: 10.2289, lon: 103.9572, flag: '🇻🇳' },
  { name: 'Long An (Tân An)', fullName: 'Tân An, Long An, Việt Nam', lat: 10.5360, lon: 106.4131, flag: '🇻🇳' },
  { name: 'Sóc Trăng', fullName: 'Sóc Trăng, Việt Nam', lat: 9.6033, lon: 105.9739, flag: '🇻🇳' },
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
    { name: 'Đà Nẵng', fullName: 'Đà Nẵng, Việt Nam', lat: 16.0544, lon: 108.2022, flag: '🇻🇳' },
    { name: 'Phú Quốc', fullName: 'Phú Quốc, Kiên Giang, Việt Nam', lat: 10.2289, lon: 103.9572, flag: '🇻🇳' },
    { name: 'Sa Pa', fullName: 'Sa Pa, Lào Cai, Việt Nam', lat: 22.3364, lon: 103.8438, flag: '🇻🇳' },
    { name: 'Đà Lạt', fullName: 'Đà Lạt, Lâm Đồng, Việt Nam', lat: 11.9404, lon: 108.4583, flag: '🇻🇳' },
    { name: 'Hạ Long', fullName: 'Hạ Long, Quảng Ninh, Việt Nam', lat: 20.9505, lon: 107.0734, flag: '🇻🇳' },
    { name: 'Nha Trang', fullName: 'Nha Trang, Khánh Hòa, Việt Nam', lat: 12.2388, lon: 109.1967, flag: '🇻🇳' },
    { name: 'Hội An', fullName: 'Hội An, Quảng Nam, Việt Nam', lat: 15.8801, lon: 108.3380, flag: '🇻🇳' },
    { name: 'Huế', fullName: 'Huế, Thừa Thiên Huế, Việt Nam', lat: 16.4637, lon: 107.5909, flag: '🇻🇳' },
  ],
  asia: [
    { name: 'Tokyo', fullName: 'Tokyo, Nhật Bản', lat: 35.6762, lon: 139.6503, flag: '🇯🇵' },
    { name: 'Seoul', fullName: 'Seoul, Hàn Quốc', lat: 37.5665, lon: 126.9780, flag: '🇰🇷' },
    { name: 'Bangkok', fullName: 'Bangkok, Thái Lan', lat: 13.7563, lon: 100.5018, flag: '🇹🇭' },
    { name: 'Singapore', fullName: 'Singapore', lat: 1.3521, lon: 103.8198, flag: '🇸🇬' },
    { name: 'Bắc Kinh', fullName: 'Bắc Kinh, Trung Quốc', lat: 39.9042, lon: 116.4074, flag: '🇨🇳' },
  ],
  world: [
    { name: 'Paris', fullName: 'Paris, Pháp', lat: 48.8566, lon: 2.3522, flag: '🇫🇷' },
    { name: 'London', fullName: 'Luân Đôn, Anh', lat: 51.5074, lon: -0.1278, flag: '🇬🇧' },
    { name: 'New York', fullName: 'New York, Mỹ', lat: 40.7128, lon: -74.0060, flag: '🇺🇸' },
    { name: 'Sydney', fullName: 'Sydney, Úc', lat: -33.8688, lon: 151.2093, flag: '🇦🇺' },
  ]
};

function isValidCoordinate(lat, lon) {
  const nLat = Number(lat);
  const nLon = Number(lon);
  return !isNaN(nLat) && !isNaN(nLon) && nLat >= -90 && nLat <= 90 && nLon >= -180 && nLon <= 180;
}

function getSafeFavorites() {
  try {
    const raw = localStorage.getItem('meteo_favorites');
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.filter(item => item && typeof item.name === 'string' && isValidCoordinate(item.lat, item.lon)).slice(0, 50);
  } catch (e) {
    return [];
  }
}

function showLocationPermissionModal() {
  const modal = document.getElementById('locationPermissionModal');
  if (modal) modal.classList.remove('hidden');
}

function hideLocationPermissionModal() {
  const modal = document.getElementById('locationPermissionModal');
  if (modal) modal.classList.add('hidden');
}

function requestGPSLocation(onSuccess, onError) {
  if (!navigator.geolocation) {
    alert('Trình duyệt của bạn không hỗ trợ định vị GPS.');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = Number(pos.coords.latitude);
      const lon = Number(pos.coords.longitude);
      if (!isValidCoordinate(lat, lon)) {
        if (onError) onError('Tọa độ không hợp lệ');
        return;
      }
      let placeDisplayName = `Vị trí của bạn (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`;
      try {
        const revData = await safeFetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&localityLanguage=vi`, 5000);
        if (revData) {
          const parts = [revData.locality || revData.city, revData.principalSubdivision, revData.countryName].filter(Boolean);
          if (parts.length > 0) placeDisplayName = `${parts.join(', ')} 📍`;
        }
      } catch (e) {}
      if (onSuccess) onSuccess(lat, lon, placeDisplayName);
    },
    (err) => {
      let errMsg = 'Không thể lấy vị trí hiện tại.';
      if (err.code === err.PERMISSION_DENIED) {
        errMsg = 'Bạn đã từ chối quyền truy cập vị trí trên trình duyệt.';
      }
      if (onError) onError(errMsg);
      else alert(errMsg);
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
  );
}

// Hàm chuẩn hóa loại bỏ dấu tiếng Việt để tìm kiếm chính xác
function normalizeVietnamese(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .trim();
}

// Tìm kiếm nhanh trong danh mục 63 tỉnh thành Việt Nam & thế giới
function searchLocalLocations(query) {
  if (!query) return [];
  const q = normalizeVietnamese(query);
  const results = [];
  
  ALL_VN.forEach(item => {
    const nameNorm = normalizeVietnamese(item.name);
    const fullNorm = normalizeVietnamese(item.fullName);
    const kwMatch = item.keywords && item.keywords.some(k => normalizeVietnamese(k).includes(q));
    if (nameNorm.includes(q) || fullNorm.includes(q) || kwMatch) {
      results.push({
        name: item.name,
        admin1: 'Việt Nam',
        country: 'Việt Nam',
        country_code: 'VN',
        latitude: item.lat,
        longitude: item.lon,
        isLocal: true
      });
    }
  });

  return results;
}
