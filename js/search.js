// ========================================================
// MODULE: search.js - Tìm kiếm Tỉnh thành / Địa điểm & Gợi ý Autocomplete
// ========================================================

let searchDebounceTimer = null;

function initSearchModule(onSelectPlace) {
  const cityInput = document.getElementById('cityInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const suggestionsList = document.getElementById('suggestionsList');

  if (!cityInput) return;

  cityInput.addEventListener('input', (e) => {
    const query = sanitizeInput(e.target.value);
    if (clearSearchBtn) clearSearchBtn.classList.toggle('active', query.length > 0);

    clearTimeout(searchDebounceTimer);
    if (query.length < 2) {
      if (suggestionsList) suggestionsList.classList.remove('show');
      return;
    }

    searchDebounceTimer = setTimeout(() => {
      fetchAndRenderSuggestions(query, suggestionsList, onSelectPlace);
    }, 220);
  });

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      cityInput.value = '';
      clearSearchBtn.classList.remove('active');
      if (suggestionsList) suggestionsList.classList.remove('show');
      cityInput.focus();
    });
  }

  cityInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && suggestionsList) {
      const firstItem = suggestionsList.querySelector('.suggestion-item');
      if (firstItem) firstItem.click();
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrapper') && suggestionsList) {
      suggestionsList.classList.remove('show');
    }
  });
}

async function fetchAndRenderSuggestions(query, container, onSelectPlace) {
  if (!container) return;
  try {
    const cleanQuery = sanitizeInput(query);
    if (cleanQuery.length < 2) return;

    let places = [];

    // 1. ƯU TIÊN HÀNG ĐẦU: Tìm kiếm ngay trong danh bạ 63 Tỉnh Thành Việt Nam
    if (typeof searchLocalLocations === 'function') {
      const localMatches = searchLocalLocations(cleanQuery);
      if (localMatches.length > 0) {
        places.push(...localMatches);
      }
    }

    // 2. Thử gọi thêm Django Search API hoặc Open-Meteo cho địa danh quốc tế
    try {
      const apiRes = await safeFetch(`http://127.0.0.1:8000/api/weather/search/?q=${encodeURIComponent(cleanQuery)}`, 1800);
      if (Array.isArray(apiRes) && apiRes.length > 0) {
        apiRes.forEach(extPlace => {
          // Tránh trùng lặp với tỉnh thành đã có
          const exists = places.some(p => Math.abs(p.latitude - extPlace.latitude) < 0.1 && Math.abs(p.longitude - extPlace.longitude) < 0.1);
          if (!exists) places.push(extPlace);
        });
      }
    } catch (e) {}

    // 3. Fallback sang Open-Meteo Geocoding nếu chưa có nhiều kết quả
    if (places.length < 3) {
      try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanQuery)}&count=10&language=vi&format=json`;
        const data = await safeFetch(geoUrl, 3000);
        if (data && data.results) {
          data.results.forEach(extPlace => {
            const exists = places.some(p => Math.abs(p.latitude - extPlace.latitude) < 0.1 && Math.abs(p.longitude - extPlace.longitude) < 0.1);
            if (!exists) places.push(extPlace);
          });
        }
      } catch (e) {}
    }

    container.innerHTML = '';
    if (places.length > 0) {
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
          const input = document.getElementById('cityInput');
          if (input) input.value = fullDisplayName;
          container.classList.remove('show');
          if (onSelectPlace) onSelectPlace(place.latitude, place.longitude, fullDisplayName);
        });

        container.appendChild(item);
      });
      container.classList.add('show');
    } else {
      container.innerHTML = `<div class="suggestion-item"><span class="suggestion-sub">Không tìm thấy địa điểm khớp với "${escapeHTML(cleanQuery)}"</span></div>`;
      container.classList.add('show');
    }
  } catch (err) {
    console.error('Lỗi gợi ý tìm kiếm:', err);
  }
}
