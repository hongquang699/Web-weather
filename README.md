# 🌦️ VietWeather — Real-Time Weather Platform in Apple Weather Style

[![Django](https://img.shields.io/badge/Django-5.0+-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![Django REST Framework](https://img.shields.io/badge/DRF-3.14+-red?style=for-the-badge)](https://www.django-rest-framework.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-199900?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.4.1-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)](https://www.chartjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

**VietWeather** is a modern, high-performance, real-time weather web application designed with the aesthetic excellence of the **Apple Weather app (iOS 17/18)**. It combines **High-Definition Satellite Imagery**, **Live Meteorological Rain Radar**, and a **Django REST API Backend** equipped with multi-tiered caching and anti-tampering security.

---

## 🌟 1. Key Features

### 🍏 Authentic Apple Atmospheric Engine (iOS 18 Simulation)
- **Dynamic Real-Time Sky Shaders**: Automatically adapts gradient lighting and color schemes according to real-time sun angle and local weather conditions (Sunny, Overcast, Rain, Thunderstorm, Clear Night, Snow).
- **Radiant Sun & Volumetric Sunbeams**: Features a glowing corona with soft solar rays sweeping across the sky in a gentle 3D rotational perspective.
- **Volumetric Drifting Clouds**: Multi-layered, soft puffy cloud clusters that traverse horizontally with organic wind drift, shifting to storm-grey during downpours.
- **Physics-Based Rain & Splash Particle System**: Raindrops fall with wind-angle tilting, motion blur, and realistic water splash ripples upon hitting the bottom threshold.
- **Dual-Flash Thunderstorm & Branching Lightning**: Natural lightning bolts generated using procedural fractal branching, paired with ambient sky illumination.
- **Night Sky & Lunar Halo**: Over 100 twinkling stars with sinusoidal twinkle cycles, drifting shooting stars (meteors), and a dreamy luminous moon.

### 🛰️ High-Definition Satellite Weather Radar Map
- **High-Resolution Satellite Imagery**: Crisp terrain, coastlines, mountain ranges, and island topologies.
- **Live RainViewer Radar Overlay**: Color-coded meteorological rain clouds (*Light Green: Drizzle $\rightarrow$ Yellow/Amber: Moderate Rain $\rightarrow$ Red/Purple: Heavy Storm / Severe Gale*).
- **Time-Lapse Radar Playback**: One-click animated loop showing cloud movements and storm trajectories over the past 2 hours.
- **Interactive City Temperature Badges**: Floating real-time temperature pills placed across major provinces (Hanoi, Nghe An, Da Nang, Da Lat, Ho Chi Minh City, etc.).
- **Safe Zoom Normalization**: Powered by `maxNativeZoom: 15` interpolation to completely eliminate "Zoom Level Not Supported" tile artifacts.

### 🇻🇳 Comprehensive Vietnam & Global Location Coverage
- Pre-indexed database covering **all 63 provinces of Vietnam** (North, Central, and South regions, including Nghe An, Hanoi, Saigon, Da Nang, Sa Pa, Phu Quoc, etc.) plus major world capitals.
- **Smart Diacritic-Insensitive Search**: Instant autocomplete matching with or without accents (`nghe an`, `nghệ an`, `vinh`, `sai gon`, `tp hcm`, `da nang`...).
- **Privacy-Compliant GPS Location**: Requests explicit user confirmation via an interactive modal before accessing device coordinates.

### 📊 In-Depth 48-Hour & 14-Day Forecast Center ([`pages/forecast.html`](pages/forecast.html))
- **Interactive Trend Chart (Chart.js)**: Dual-dataset visualization plotting smooth temperature curves against precipitation probability bars.
- **48-Hour Hourly Timeline**: Interactive horizontal scroll slider with hourly conditions, temperatures, and rain percentages.
- **14-Day Extended Daily Forecast**: Features iOS-style temperature range gradient bars, total precipitation volume (mm), maximum wind gusts, and peak UV index ratings.

### 🌕 Advanced Environmental & Astronomical Telemetry
- **8 Comprehensive Metrics**: Humidity, Wind Velocity & Compass Direction, UV Index, Barometric Pressure, 24h Precipitation, Visibility Distance (km), Sunrise & Sunset times.
- **Lunar Cycles & Tides**: Real-time astronomical moon phase calculation (*New Moon, Waxing Crescent, Full Moon, Spring Tides, Neap Tides*).
- **Proactive Severe Weather Alerts**: Automatically flags severe thunderstorms, gale-force winds ($\ge 45\text{ km/h}$), extreme UV radiation ($\ge 9$), and imminent rain within 1–2 hours.

### 🔒 Enterprise Anti-Tampering & Security Hardening
- **DevTools Lockout**: Disables `F12`, `Ctrl + Shift + I/J/C`, `Ctrl + U` (View Source), and `Ctrl + S` (Save Page).
- **Context Menu Protection**: Right-click is locked across all pages with custom copyright security toast alerts.
- **Strict Content Security Policy (CSP)**: Hardened headers to prevent cross-site scripting (XSS), code injection, and data tampering.

---

## 📁 2. Modular Architecture

```
thoitiet/
│
├── index.html                      # Clean Home View (Current weather & Navigation Hub)
├── README.md                       # Project Documentation
├── robots.txt                      # Search engine crawlers directive
├── Dockerfile                      # Production Docker container definition for Django
├── docker-compose.yml              # Multi-container orchestration (Django + Nginx + Redis)
├── nginx.conf                      # Nginx Reverse Proxy & Rate Limiting (10 req/s)
│
├── pages/                          # Standalone Dedicated Subpages
│   ├── home.html                   # Lightweight overview
│   ├── forecast.html               # 48h & 14-day In-Depth Forecast Center
│   ├── map.html                    # Full-screen Satellite Radar Map
│   └── settings.html               # User preferences & Privacy controls
│
├── css/                            # Tiered CSS Architecture
│   ├── style.css                   # Core tokens, Apple Weather theme gradients, resets
│   ├── components.css              # Glassmorphic cards, sliders, legends, modals
│   └── responsive.css              # Responsive breakpoints (Mobile, Tablet, Desktop)
│
├── js/                             # Modular JavaScript Architecture
│   ├── app.js                      # Central coordinator & Apple Canvas engine
│   ├── weather.js                  # Weather API, normalizer, alerts & lunar math
│   ├── search.js                   # XSS-sanitized autocomplete search module
│   ├── chart.js                    # Chart.js temperature & precipitation visualizer
│   ├── map.js                      # Leaflet rain radar integration
│   ├── location.js                 # 63 provinces database & GPS locator
│   └── security.js                 # Global anti-tampering & DevTools shield
│
├── assets/                         # Static Assets (Images, Icons, Fonts)
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── components/                     # Reusable HTML Component Snippets
│   ├── header/                     # header.html
│   ├── search/                     # search.html
│   ├── current-weather/            # current-weather.html
│   ├── hourly-forecast/            # hourly-forecast.html
│   ├── daily-forecast/             # daily-forecast.html
│   ├── weather-chart/              # weather-chart.html
│   ├── weather-map/                # weather-map.html
│   ├── weather-alert/              # weather-alert.html
│   └── footer/                     # footer.html
│
└── backend/                        # Django REST API Backend Service
    ├── manage.py
    ├── requirements.txt            # Python dependencies
    ├── .env                        # Environment configurations & Secrets
    ├── weather_project/            # Django settings, CORS, Caching & Routing
    └── weather_app/                # Weather Business Logic App
        ├── models.py               # Database Models (Location, Favorite, WeatherCache)
        ├── services.py             # External API caller, normalizer & dual-tier cache
        ├── api.py                  # REST API Endpoints
        ├── serializers.py
        ├── urls.py
        └── views.py
```

---

## 🚀 3. Getting Started

### Option A: Local Run via Django Server (Recommended)

1. **Activate Python Virtual Environment**:
   ```bash
   # On Windows (PowerShell)
   .\backend\venv\bin\Activate.ps1
   # or
   .\backend\venv\Scripts\activate
   ```

2. **Run Database Migrations**:
   ```bash
   cd backend
   python manage.py migrate
   ```

3. **Start the Development Server**:
   ```bash
   python manage.py runserver 127.0.0.1:8000
   ```

4. **Launch the Application**:
   - **Home Page**: [`http://127.0.0.1:8000/`](http://127.0.0.1:8000/)
   - **Satellite Radar Map**: [`http://127.0.0.1:8000/pages/map.html`](http://127.0.0.1:8000/pages/map.html)
   - **Forecast Center**: [`http://127.0.0.1:8000/pages/forecast.html`](http://127.0.0.1:8000/pages/forecast.html)

---

### Option B: Deploy with Docker Compose (Production Ready)

The project includes an enterprise-ready Docker Compose configuration bundling `Django Backend`, `Nginx Reverse Proxy`, and `Redis In-Memory Cache`.

```bash
docker-compose up -d --build
```
The application will automatically be available at `http://localhost/` or `http://127.0.0.1/`.

---

## 📡 4. REST API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/weather/` | API directory and service discovery overview |
| `GET` | `/api/weather/health/` | Server health check endpoint |
| `GET` | `/api/weather/current/?lat=...&lon=...` | Real-time weather condition at specific coordinates |
| `GET` | `/api/weather/forecast/?lat=...&lon=...` | Complete 48h & 14-day forecast (10-minute caching) |
| `GET` | `/api/weather/search/?q=...` | Location search with accent-insensitive Vietnamese matching |
| `GET / POST`| `/api/weather/favorites/` | Retrieve and bookmark favorite locations |

---

## ⚖️ 5. License & Credits

- Developed by **VietWeather Team**.
- Built with high-fidelity inspiration from Apple Weather and modern meteorological mapping standards.
- All rights reserved. Code protected against unauthorized inspection and tampering.
