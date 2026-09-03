from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.throttling import AnonRateThrottle
from .services import WeatherService
from .models import Location, FavoriteLocation
from .serializers import LocationSerializer, FavoriteLocationSerializer

class WeatherForecastAPIView(APIView):
    """
    GET /api/weather/forecast/?lat=21.0285&lon=105.8542&place=Hanoi
    Lấy toàn bộ dữ liệu dự báo thời tiết chuẩn hóa (Current, Hourly 48h, Daily 14 ngày)
    Tích hợp bộ nhớ Cache đa tầng (Memory & Database)
    """
    throttle_classes = [AnonRateThrottle]

    def get(self, request):
        lat = request.query_params.get('lat')
        lon = request.query_params.get('lon')
        place = request.query_params.get('place', 'Vị trí tra cứu')

        if not lat or not lon:
            return Response(
                {"error": "Thiếu tham số bắt buộc 'lat' và 'lon'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            data, from_cache = WeatherService.get_weather_data(lat, lon, place)
            return Response({
                "status": "success",
                "cached": from_cache,
                "data": data
            })
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except RuntimeError as e:
            return Response({"error": str(e)}, status=status.HTTP_502_BAD_GATEWAY)


class CurrentWeatherAPIView(APIView):
    """
    GET /api/weather/current/?lat=...&lon=...
    Chỉ lấy thông tin thời tiết thời gian thực hiện tại
    """
    throttle_classes = [AnonRateThrottle]

    def get(self, request):
        lat = request.query_params.get('lat')
        lon = request.query_params.get('lon')
        place = request.query_params.get('place', 'Vị trí tra cứu')

        try:
            data, from_cache = WeatherService.get_weather_data(lat, lon, place)
            return Response({
                "place_name": data.get("place_name"),
                "latitude": data.get("latitude"),
                "longitude": data.get("longitude"),
                "current": data.get("current"),
                "description": data.get("description"),
                "cached": from_cache
            })
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class SearchLocationAPIView(APIView):
    """
    GET /api/weather/search/?q=Hanoi
    Tìm kiếm thông tin địa điểm theo tên với cơ chế cache 1 giờ
    """
    throttle_classes = [AnonRateThrottle]

    def get(self, request):
        query = request.query_params.get('q', '').strip()
        if len(query) < 2:
            return Response([], status=status.HTTP_200_OK)

        results = WeatherService.search_location(query)
        return Response(results)


class FavoritesAPIView(APIView):
    """
    GET, POST /api/weather/favorites/
    Quản lý danh sách địa điểm yêu thích
    """
    def get(self, request):
        user_id = request.query_params.get('user_id', 'anonymous')
        favorites = FavoriteLocation.objects.filter(user_id=user_id).select_related('location')
        serializer = FavoriteLocationSerializer(favorites, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data
        user_id = data.get('user_id', 'anonymous')
        lat = data.get('latitude')
        lon = data.get('longitude')
        name = data.get('name', 'Địa điểm')
        full_name = data.get('full_name', name)

        if not lat or not lon:
            return Response({"error": "Thiếu tọa độ."}, status=status.HTTP_400_BAD_REQUEST)

        location, _ = Location.objects.get_or_create(
            latitude=round(float(lat), 4),
            longitude=round(float(lon), 4),
            defaults={'name': name, 'full_name': full_name}
        )

        favorite, created = FavoriteLocation.objects.get_or_create(
            user_id=user_id,
            location=location
        )

        return Response(
            {"message": "Đã lưu vào danh sách yêu thích.", "id": favorite.id},
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )
