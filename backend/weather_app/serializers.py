from rest_framework import serializers
from .models import Location, FavoriteLocation, WeatherCache

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'

class FavoriteLocationSerializer(serializers.ModelSerializer):
    location = LocationSerializer(read_only=True)
    location_id = serializers.PrimaryKeyRelatedField(
        queryset=Location.objects.all(), source='location', write_only=True
    )

    class Meta:
        model = FavoriteLocation
        fields = ['id', 'user_id', 'location', 'location_id', 'saved_at']

class WeatherCacheSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeatherCache
        fields = [
            'latitude', 'longitude', 'place_name', 'temperature', 
            'feels_like', 'humidity', 'wind_speed', 'description', 
            'uv_index', 'updated_at'
        ]
