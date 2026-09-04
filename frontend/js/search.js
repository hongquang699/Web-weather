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

function renderSuggestionList(places, cleanQuery, container, onSelectPlace) {
  if (!container) return;
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
}

async function fetchAndRenderSuggestions(query, container, onSelectPlace) {
  if (!container) return;
  try {
    const cleanQuery = sanitizeInput(query);
    if (cleanQuery.length < 2) return;

    let places = [];

    // 1. SIÊU TỐC: Hiển thị NGAY LẬP TỨC 63 tỉnh thành Việt Nam (0ms không cần chờ mạng)
    if (typeof searchLocalLocations === 'function') {
      const localMatches = searchLocalLocations(cleanQuery);
      if (localMatches.length > 0) {
        places.push(...localMatches);
        renderSuggestionList(places, cleanQuery, container, onSelectPlace);
      }
    }

    // 2. Chạy ngầm gọi thêm API quốc tế (nếu cần mở rộng kết quả)
    try {
      const searchEndpoint = `${window.location.origin}/api/weather/search/?q=${encodeURIComponent(cleanQuery)}`;
      const apiRes = await safeFetch(searchEndpoint, 1500);
      if (Array.isArray(apiRes) && apiRes.length > 0) {
        let added = false;
        apiRes.forEach(extPlace => {
          const exists = places.some(p => Math.abs(p.latitude - extPlace.latitude) < 0.1 && Math.abs(p.longitude - extPlace.longitude) < 0.1);
          if (!exists) {
            places.push(extPlace);
            added = true;
          }
        });
        if (added) renderSuggestionList(places, cleanQuery, container, onSelectPlace);
      }
    } catch (e) {}

    // 3. Fallback Open-Meteo nếu chưa có kết quả nào
    if (places.length === 0) {
      try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanQuery)}&count=6&language=vi&format=json`;
        const data = await safeFetch(geoUrl, 2500);
        if (data && data.results) {
          data.results.forEach(extPlace => {
            const exists = places.some(p => Math.abs(p.latitude - extPlace.latitude) < 0.1 && Math.abs(p.longitude - extPlace.longitude) < 0.1);
            if (!exists) places.push(extPlace);
          });
          renderSuggestionList(places, cleanQuery, container, onSelectPlace);
        }
      } catch (e) {}
    }

    if (places.length === 0) {
      renderSuggestionList([], cleanQuery, container, onSelectPlace);
    }
  } catch (err) {
    console.error('Lỗi gợi ý tìm kiếm:', err);
  }
}
