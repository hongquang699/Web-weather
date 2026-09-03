// ========================================================
// MODULE: map.js - Bản đồ Radar Thời tiết & Vệt mây mưa trực tiếp (Leaflet + RainViewer)
// ========================================================

let radarMapInstance = null;
let radarLayerGroup = null;
let radarFrames = [];
let radarFrameIndex = 0;
let radarInterval = null;
let isRadarPlaying = false;
let rainviewerHost = "https://tilecache.rainviewer.com";

async function initOrUpdateRadarMap(lat, lon, placeName = 'Vị trí hiện tại') {
  const mapEl = document.getElementById('radarMap');
  if (!mapEl || typeof L === 'undefined') return;

  if (!radarMapInstance) {
    radarMapInstance = L.map('radarMap', {
      center: [lat, lon],
      zoom: 7,
      minZoom: 4,
      maxZoom: 14,
      zoomControl: false,
      attributionControl: false
    });

    L.control.zoom({ position: 'topright' }).addTo(radarMapInstance);

    // Lớp bản đồ nền OpenStreetMap (100% Miễn phí, Không bao giờ có watermark)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap'
    }).addTo(radarMapInstance);

    radarLayerGroup = L.layerGroup().addTo(radarMapInstance);
  } else {
    radarMapInstance.setView([lat, lon], 7);
  }

  // Đánh dấu vị trí tra cứu với vòng tròn phát sáng
  if (window.currentLocationMarker) radarMapInstance.removeLayer(window.currentLocationMarker);
  window.currentLocationMarker = L.circleMarker([lat, lon], {
    radius: 8,
    fillColor: '#38bdf8',
    color: '#ffffff',
    weight: 2,
    opacity: 1,
    fillOpacity: 0.95
  }).addTo(radarMapInstance).bindPopup(`<b>📍 ${escapeHTML(placeName)}</b>`).openPopup();

  // Tải dữ liệu radar mưa thời gian thực từ RainViewer
  await loadRainRadarFrames();
}

async function loadRainRadarFrames() {
  try {
    const res = await safeFetch('https://api.rainviewer.com/public/weather-maps.json', 6000);
    if (res && res.radar && res.radar.past && res.radar.past.length > 0) {
      rainviewerHost = res.host || "https://tilecache.rainviewer.com";
      radarFrames = res.radar.past;
      // Hiển thị khung hình radar mưa mới nhất
      displayRadarFrame(radarFrames.length - 1);
    }
  } catch (err) {
    console.warn('Không thể tải dữ liệu radar mưa:', err);
  }
}

function displayRadarFrame(idx) {
  if (!radarFrames || !radarFrames[idx] || !radarLayerGroup) return;
  radarFrameIndex = idx;
  const frame = radarFrames[idx];

  // Xóa lớp radar cũ
  radarLayerGroup.clearLayers();

  // URL tile chuẩn của RainViewer: {host}{path}/256/{z}/{x}/{y}/1/1_1.png
  // Mã màu 1 = Chuẩn màu Radar Khí tượng: Xanh lá (mưa nhỏ) -> Vàng (mưa vừa) -> Đỏ/Tím (mưa to, dông bão)
  const radarUrl = `${rainviewerHost}${frame.path}/256/{z}/{x}/{y}/1/1_1.png`;

  L.tileLayer(radarUrl, {
    opacity: 0.85, // Tăng độ đậm của vệt mưa để nhìn rõ ràng
    zIndex: 200,
    tileSize: 256
  }).addTo(radarLayerGroup);

  // Cập nhật nhãn thời gian thực của vệt mưa
  const timePill = document.getElementById('radarTimeLabel');
  if (timePill && frame.time) {
    const d = new Date(frame.time * 1000);
    const isLatest = idx === radarFrames.length - 1;
    timePill.textContent = isLatest 
      ? `Vệt mưa lúc: ${d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} (Mới nhất)`
      : `Lịch sử: ${d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
  }
}

function toggleRadarAnimation() {
  const btn = document.getElementById('radarPlayBtn');
  if (!btn) return;

  if (isRadarPlaying) {
    clearInterval(radarInterval);
    isRadarPlaying = false;
    btn.innerHTML = '<i class="fa-solid fa-play"></i> Xem chuyển động mưa';
  } else {
    if (!radarFrames || radarFrames.length === 0) return;
    isRadarPlaying = true;
    btn.innerHTML = '<i class="fa-solid fa-pause"></i> Tạm dừng';
    
    let currentIdx = 0;
    radarInterval = setInterval(() => {
      displayRadarFrame(currentIdx);
      currentIdx = (currentIdx + 1) % radarFrames.length;
    }, 600); // 600ms mỗi khung hình chuyển động
  }
}
