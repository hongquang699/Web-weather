import requests
from django.core.cache import cache
from .models import WeatherCache
from django.utils import timezone

OPEN_METEO_FORECAST_URL = "https://api.open-meteo.com/v1/forecast"
OPEN_METEO_GEO_URL = "https://geocoding-api.open-meteo.com/v1/search"

# Bảng dịch mã thời tiết WMO
WMO_DESCRIPTIONS = {
    0: "Trời quang đãng, nắng ấm",
    1: "Hầu như không mây, trời trong",
    2: "Trời có mây rải rác",
    3: "Trời nhiều mây, âm u",
    45: "Có sương mù dày",
    48: "Sương mù đọng băng",
    51: "Mưa phùn nhẹ",
    53: "Mưa phùn hạt vừa",
    55: "Mưa phùn dày hạt",
    61: "Mưa nhỏ rải rác",
    63: "Mưa vừa",
    65: "Mưa to xối xả",
    71: "Tuyết rơi nhẹ",
    73: "Tuyết rơi vừa",
    75: "Bão tuyết lớn",
    80: "Mưa rào nhẹ",
    81: "Mưa rào từng cơn",
    82: "Mưa rào như trút nước",
    95: "Có giông bão sấm chớp",
    96: "Giông lốc kèm mưa đá",
    99: "Giông bão dữ dội, nguy hiểm"
}

class WeatherService:
    """Lớp nghiệp vụ xử lý dữ liệu thời tiết, chuẩn hóa và tối ưu Cache"""

    @staticmethod
    def validate_coords(lat, lon):
        try:
            flat = float(lat)
            flon = float(lon)
            if -90 <= flat <= 90 and -180 <= flon <= 180:
                return round(flat, 4), round(flon, 4)
        except (ValueError, TypeError):
            pass
        return None, None

    @classmethod
    def get_weather_data(cls, lat, lon, place_name="Vị trí tra cứu"):
        flat, flon = cls.validate_coords(lat, lon)
        if flat is None or flon is None:
            raise ValueError("Tọa độ địa lý không hợp lệ.")

        cache_key = f"meteo_w_{flat}_{flon}"
        cached_result = cache.get(cache_key)
        if cached_result:
            return cached_result, True  # Trả về dữ liệu từ Memory Cache

        # Kiểm tra tiếp Database Cache
        db_cache = WeatherCache.objects.filter(
            latitude__gte=flat - 0.01, latitude__lte=flat + 0.01,
            longitude__gte=flon - 0.01, longitude__lte=flon + 0.01
        ).order_by('-updated_at').first()

        if db_cache and db_cache.is_fresh(max_age_seconds=600):
            result = db_cache.raw_payload
            cache.set(cache_key, result, timeout=600)
            return result, True

        # Gọi Open-Meteo API để lấy dữ liệu mới nhất
        params = {
            "latitude": flat,
            "longitude": flon,
            "current": "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,uv_index,visibility",
            "hourly": "temperature_2m,weather_code,precipitation_probability,precipitation,visibility,wind_speed_10m",
            "daily": "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max",
            "forecast_days": 14,
            "timezone": "auto"
        }

        try:
            response = requests.get(OPEN_METEO_FORECAST_URL, params=params, timeout=8)
            response.raise_for_status()
            api_data = response.json()
        except requests.RequestException as e:
            # Nếu API lỗi nhưng có dữ liệu cũ trong DB Cache thì dùng tạm
            if db_cache:
                return db_cache.raw_payload, True
            raise RuntimeError(f"Không thể kết nối máy chủ thời tiết: {str(e)}")

        current = api_data.get("current", {})
        weather_code = current.get("weather_code", 0)
        desc = WMO_DESCRIPTIONS.get(weather_code, "Thời tiết bình thường")

        # Chuẩn hóa payload trả về
        normalized_data = {
            "place_name": place_name,
            "latitude": flat,
            "longitude": flon,
            "current": current,
            "hourly": api_data.get("hourly", {}),
            "daily": api_data.get("daily", {}),
            "description": desc,
            "fetched_at": timezone.now().isoformat()
        }

        # Lưu vào Database Cache
        WeatherCache.objects.update_or_create(
            latitude=flat,
            longitude=flon,
            defaults={
                "place_name": place_name,
                "temperature": current.get("temperature_2m", 0),
                "feels_like": current.get("apparent_temperature", 0),
                "humidity": current.get("relative_humidity_2m", 0),
                "wind_speed": current.get("wind_speed_10m", 0),
                "wind_direction": current.get("wind_direction_10m", 0),
                "weather_code": weather_code,
                "description": desc,
                "uv_index": current.get("uv_index", 0),
                "pressure": current.get("surface_pressure", 1013),
                "precipitation": current.get("precipitation", 0),
                "raw_payload": normalized_data
            }
        )

        # Lưu vào Fast Memory Cache (10 phút)
        cache.set(cache_key, normalized_data, timeout=600)
        return normalized_data, False

    @classmethod
    def search_location(cls, query):
        """Tìm kiếm địa điểm có hỗ trợ tỉnh thành Việt Nam và cache"""
        clean_q = query.strip()[:80]
        if len(clean_q) < 2:
            return []

        cache_key = f"meteo_search_{clean_q.lower()}"
        cached_locations = cache.get(cache_key)
        if cached_locations:
            return cached_locations

        # Danh bạ tra cứu nhanh tiếng Việt
        import unicodedata
        def strip_accents(s):
            return ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn').lower().replace('đ', 'd')

        norm_q = strip_accents(clean_q)
        results = []

        VN_LOCAL_CITIES = [
            {"name": "Nghệ An", "admin1": "Nghệ An", "country": "Việt Nam", "country_code": "VN", "latitude": 18.6734, "longitude": 105.6813, "aliases": ["nghe an", "vinh", "tp vinh", "cua lo"]},
            {"name": "Hà Nội", "admin1": "Hà Nội", "country": "Việt Nam", "country_code": "VN", "latitude": 21.0285, "longitude": 105.8542, "aliases": ["ha noi", "hanoi"]},
            {"name": "TP. Hồ Chí Minh", "admin1": "TP. Hồ Chí Minh", "country": "Việt Nam", "country_code": "VN", "latitude": 10.8231, "longitude": 106.6297, "aliases": ["sai gon", "hcm", "ho chi minh"]},
            {"name": "Đà Nẵng", "admin1": "Đà Nẵng", "country": "Việt Nam", "country_code": "VN", "latitude": 16.0544, "longitude": 108.2022, "aliases": ["da nang", "danang"]},
            {"name": "Thanh Hóa", "admin1": "Thanh Hóa", "country": "Việt Nam", "country_code": "VN", "latitude": 19.8067, "longitude": 105.7852, "aliases": ["thanh hoa"]},
            {"name": "Hà Tĩnh", "admin1": "Hà Tĩnh", "country": "Việt Nam", "country_code": "VN", "latitude": 18.3430, "longitude": 105.9058, "aliases": ["ha tinh"]},
            {"name": "Quảng Bình", "admin1": "Quảng Bình", "country": "Việt Nam", "country_code": "VN", "latitude": 17.4690, "longitude": 106.6225, "aliases": ["quang binh", "dong hoi"]},
            {"name": "Thừa Thiên Huế", "admin1": "Thừa Thiên Huế", "country": "Việt Nam", "country_code": "VN", "latitude": 16.4637, "longitude": 107.5909, "aliases": ["hue", "thua thien hue"]},
            {"name": "Lâm Đồng (Đà Lạt)", "admin1": "Lâm Đồng", "country": "Việt Nam", "country_code": "VN", "latitude": 11.9404, "longitude": 108.4583, "aliases": ["da lat", "dalat", "lam dong"]},
            {"name": "Khánh Hòa (Nha Trang)", "admin1": "Khánh Hòa", "country": "Việt Nam", "country_code": "VN", "latitude": 12.2388, "longitude": 109.1967, "aliases": ["nha trang", "khanh hoa"]},
            {"name": "Đắk Lắk (Buôn Ma Thuột)", "admin1": "Đắk Lắk", "country": "Việt Nam", "country_code": "VN", "latitude": 12.6675, "longitude": 108.0383, "aliases": ["buon ma thuot", "dak lak", "daklak"]},
            {"name": "Cần Thơ", "admin1": "Cần Thơ", "country": "Việt Nam", "country_code": "VN", "latitude": 10.0452, "longitude": 105.7469, "aliases": ["can tho"]},
            {"name": "Hải Phòng", "admin1": "Hải Phòng", "country": "Việt Nam", "country_code": "VN", "latitude": 20.8449, "longitude": 106.6881, "aliases": ["hai phong"]},
            {"name": "Quảng Ninh (Hạ Long)", "admin1": "Quảng Ninh", "country": "Việt Nam", "country_code": "VN", "latitude": 20.9505, "longitude": 107.0734, "aliases": ["ha long", "quang ninh"]},
        ]

        for item in VN_LOCAL_CITIES:
            name_norm = strip_accents(item["name"])
            matched = norm_q in name_norm or any(norm_q in strip_accents(alias) for alias in item.get("aliases", []))
            if matched:
                results.append({
                    "id": abs(hash(item["name"])) % 100000,
                    "name": item["name"],
                    "latitude": item["latitude"],
                    "longitude": item["longitude"],
                    "country": item["country"],
                    "country_code": item["country_code"],
                    "admin1": item["admin1"]
                })

        # Gọi thêm Open-Meteo
        params = {
            "name": clean_q,
            "count": 6,
            "language": "vi",
            "format": "json"
        }

        try:
            res = requests.get(OPEN_METEO_GEO_URL, params=params, timeout=4)
            if res.ok:
                data = res.json()
                ext_results = data.get("results", [])
                for ext in ext_results:
                    if not any(abs(r["latitude"] - ext["latitude"]) < 0.1 for r in results):
                        results.append(ext)
        except requests.RequestException:
            pass

        cache.set(cache_key, results, timeout=3600)
        return results
