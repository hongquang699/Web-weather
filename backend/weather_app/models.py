from django.db import models
from django.utils import timezone

class Location(models.Model):
    """Lưu trữ thông tin địa điểm tìm kiếm và phổ biến"""
    name = models.CharField(max_length=150, verbose_name="Tên địa danh")
    full_name = models.CharField(max_length=255, verbose_name="Tên đầy đủ")
    latitude = models.FloatField(verbose_name="Vĩ độ")
    longitude = models.FloatField(verbose_name="Kinh độ")
    country = models.CharField(max_length=100, blank=True, null=True, verbose_name="Quốc gia")
    country_code = models.CharField(max_length=10, blank=True, null=True, verbose_name="Mã quốc gia")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Địa điểm"
        verbose_name_plural = "Danh sách địa điểm"
        unique_together = ('latitude', 'longitude')

    def __str__(self):
        return self.full_name


class FavoriteLocation(models.Model):
    """Địa điểm yêu thích"""
    user_id = models.CharField(max_length=100, default='anonymous', verbose_name="ID người dùng")
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='favorites')
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Địa điểm yêu thích"
        verbose_name_plural = "Danh sách yêu thích"

    def __str__(self):
        return f"{self.user_id} - {self.location.name}"


class WeatherCache(models.Model):
    """Bộ đệm lưu trữ dữ liệu thời tiết đã chuẩn hóa để giảm thiểu gọi API bên ngoài"""
    latitude = models.FloatField(db_index=True)
    longitude = models.FloatField(db_index=True)
    place_name = models.CharField(max_length=255)
    temperature = models.FloatField(verbose_name="Nhiệt độ hiện tại")
    feels_like = models.FloatField(verbose_name="Nhiệt độ cảm nhận")
    humidity = models.IntegerField(verbose_name="Độ ẩm (%)")
    wind_speed = models.FloatField(verbose_name="Tốc độ gió (km/h)")
    wind_direction = models.FloatField(default=0, verbose_name="Hướng gió")
    weather_code = models.IntegerField(verbose_name="Mã WMO")
    description = models.CharField(max_length=150, verbose_name="Mô tả thời tiết")
    uv_index = models.FloatField(default=0, verbose_name="Chỉ số UV")
    pressure = models.FloatField(default=1013, verbose_name="Áp suất (hPa)")
    precipitation = models.FloatField(default=0, verbose_name="Lượng mưa (mm)")
    raw_payload = models.JSONField(verbose_name="Dữ liệu JSON thô đầy đủ")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Cập nhật lúc")

    class Meta:
        verbose_name = "Bộ đệm Thời tiết"
        verbose_name_plural = "Bộ đệm Thời tiết"
        indexes = [
            models.Index(fields=['latitude', 'longitude']),
        ]

    def is_fresh(self, max_age_seconds=600):
        """Kiểm tra xem dữ liệu trong cache còn tươi mới không (mặc định 10 phút)"""
        delta = (timezone.now() - self.updated_at).total_seconds()
        return delta < max_age_seconds

    def __str__(self):
        return f"{self.place_name} ({self.temperature}°C) - {self.updated_at.strftime('%H:%M:%S')}"
