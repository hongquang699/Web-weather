from django.urls import path
from .api import WeatherForecastAPIView, CurrentWeatherAPIView, SearchLocationAPIView, FavoritesAPIView
from .views import health_check, api_root

urlpatterns = [
    path('', api_root, name='api_root'),
    path('health/', health_check, name='health_check'),
    path('current/', CurrentWeatherAPIView.as_view(), name='weather_current'),
    path('forecast/', WeatherForecastAPIView.as_view(), name='weather_forecast'),
    path('search/', SearchLocationAPIView.as_view(), name='weather_search'),
    path('favorites/', FavoritesAPIView.as_view(), name='weather_favorites'),
]
